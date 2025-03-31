import { isRegExp } from "@/src/lib/is-regexp";
import { Trie } from "./trie";

type Settings = {
    filter: Filter;
    wordTrie: Trie;
    userBlocklist: Blocklist;
    emoteBlocklist: Blocklist;
    wordRegexList: Blocklist;
    userRegexList: Blocklist;
    emoteRegexList: Blocklist;
};

const defaultSettings: Settings = {
    filter: DefaultSettings.Filter,
    wordTrie: new Trie(),
    userBlocklist: [],
    emoteBlocklist: [],
    wordRegexList: [],
    userRegexList: [],
    emoteRegexList: [],
};

type Compiled = {
    joined: string;
    parts: string[];
};

export class ChatFilter {
    private platform: Platforms;
    private settings: Settings;

    constructor(platform: Platforms) {
        this.platform = platform;
        this.settings = defaultSettings;
        this.update = this.update.bind(this);
        this.update();
        this.watch();
    }

    run(node: Element) {
        if (this.settings.filter.filter[this.platform]) {
            this.checkCharLimit(node);
            this.checkEmoteLimit(node);
            this.containsBlockedWord(node);
            this.containsBlockedUser(node);
            this.containsBlockedEmote(node);
        }
    }

    watch() {
        browser.storage.local.onChanged.addListener(this.update);
    }

    unwatch() {
        browser.storage.local.onChanged.removeListener(this.update);
    }

    async update() {
        this.settings.filter = await KVManagerList.filter.get();

        const wordBlocklist = [
            ...(await MapManagerList.word.getMap("all")),
            ...(await MapManagerList.word.getMap(this.platform)),
        ];
        const userBlockelist = [
            ...(await MapManagerList.user.getMap("all")),
            ...(await MapManagerList.user.getMap(this.platform)),
        ];
        const emoteBlocklist = [
            ...(await MapManagerList.emote.getMap("all")),
            ...(await MapManagerList.emote.getMap(this.platform)),
        ];

        const wordTrie = new Trie();
        const wordRegexList = wordTrie.add(wordBlocklist);

        this.settings.wordTrie = wordTrie;
        this.settings.wordRegexList = wordRegexList;

        for (const item of userBlockelist) {
            if (isRegExp(item[0])[0]) {
                this.settings.userRegexList.push(item);
            } else {
                this.settings.userBlocklist.push(item);
            }
        }

        for (const item of emoteBlocklist) {
            if (isRegExp(item[0])[0]) {
                this.settings.emoteRegexList.push(item);
            } else {
                this.settings.emoteBlocklist.push(item);
            }
        }
    }

    checkCharLimit(node: Element) {
        const limit = this.settings.filter.charLimit;
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);
        if (limit.less > 0 && limit.less >= compiled.joined.length) this.deleteContents(node);
        if (limit.more > 0 && limit.more <= compiled.joined.length) this.deleteContents(node);
    }

    checkEmoteLimit(node: Element) {
        const limit = this.settings.filter.emoteLimit;
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        if (emotes) {
            if (limit.less > 0 && limit.less >= emotes.length) this.deleteContents(node);
            if (limit.more > 0 && limit.more <= emotes.length) this.deleteContents(node);
        }
    }

    containsBlockedWord(node: Element) {
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);
        this.settings.wordTrie.check();

        if (this.settings.wordTrie.includes(compiled.joined)) {
            this.deleteContents(node);
            return;
        }

        for (const item of this.settings.wordRegexList) {
            const result = isRegExp(item[1].value);

            if (result[0] && result[1].test(compiled.joined)) {
                this.deleteContents(node);
                return;
            }
        }
    }

    containsBlockedUser(node: Element) {
        const userName = node.querySelector(Selectors.chat.userName[this.platform])?.textContent;
        if (!userName) return;

        const map = new Map(this.settings.userBlocklist);

        if (map.get(userName)?.active) {
            this.deleteContents(node);
            return;
        }

        for (const item of this.settings.userRegexList) {
            if (item[1].active === false) return;
            const result = isRegExp(item[1].value);

            if (result[0] && result[1].test(userName)) {
                this.deleteContents(node);
                return;
            }
        }
    }

    containsBlockedEmote(node: Element) {
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        const compiled = this.compileEmotes(emotes);

        const map = new Map(this.settings.emoteBlocklist);

        for (const emoteName of compiled.parts) {
            if (map.get(emoteName)?.active) {
                this.deleteContents(node);
                return;
            }
        }

        for (const item of this.settings.userRegexList) {
            if (item[1].active === false) return;
            const result = isRegExp(item[1].value);

            for (const emoteName of compiled.parts) {
                if (result[0] && result[1].test(emoteName)) {
                    this.deleteContents(node);
                    return;
                }
            }
        }
    }

    private compileMessages(messages: NodeListOf<Element>): Compiled {
        let compiled: Compiled = {
            joined: "",
            parts: [],
        };

        for (const message of messages) {
            if (message.textContent) {
                compiled.joined += message.textContent;
            }
        }

        compiled.joined = compiled.joined.replace(/\s+/g, "");
        return compiled;
    }

    private compileEmotes(emotes: NodeListOf<Element>): Compiled {
        let compiled: Compiled = {
            joined: "",
            parts: [],
        };

        for (const emote of emotes) {
            const alt = emote.getAttribute("alt");
            if (alt) {
                compiled.joined += alt;
                compiled.parts.push(alt);
            }
        }

        return compiled;
    }

    public deleteContents(node: Element) {
        if (this.settings.filter.range[this.platform]) {
            const e = node as HTMLElement;
            if (isDev()) {
                e.style.backgroundColor = "red";
                // e.hidden = true;
                // e.style.display = "none";
            } else {
                e.hidden = true;
                e.style.display = "none";
            }
        } else {
            const contents = node.querySelector<HTMLElement>(Selectors.chat.contents[this.platform]);
            if (contents) {
                if (isDev()) {
                    contents.style.backgroundColor = "red";
                    //contents.hidden = true;
                } else {
                    contents.hidden = true;
                }
            }
        }
    }
}
