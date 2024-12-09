import { isRegExp } from "@/src/lib/is-regexp";

type Settings = {
    filter: Filter;
    wordBlocklists: { all: Blocklist; platform: Blocklist };
    userBlockelists: { all: Blocklist; platform: Blocklist };
    emoteBlocklists: { all: Blocklist; platform: Blocklist };
};

const defaultSettings: Settings = {
    filter: DefaultSettings.Filter,
    wordBlocklists: { all: [], platform: [] },
    userBlockelists: { all: [], platform: [] },
    emoteBlocklists: { all: [], platform: [] },
};

type Compiled = {
    joined: string;
    strings: string[];
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
        this.settings.wordBlocklists = {
            all: await MapManagerList.word.getMap("all"),
            platform: await MapManagerList.word.getMap(this.platform),
        };
        this.settings.userBlockelists = {
            all: await MapManagerList.user.getMap("all"),
            platform: await MapManagerList.user.getMap(this.platform),
        };
        this.settings.emoteBlocklists = {
            all: await MapManagerList.emote.getMap("all"),
            platform: await MapManagerList.emote.getMap(this.platform),
        };
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
        const blocklists = this.settings.wordBlocklists;
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);

        for (const [, blocklist] of Object.entries(blocklists)) {
            blocklist.forEach((item) => {
                if (item[1].active === false) return;
                const result = isRegExp(item[1].value);

                if (!result[0] && compiled.joined.includes(item[1].value)) {
                    this.deleteContents(node);
                    return;
                }

                if (result[0] && result[1].test(compiled.joined)) {
                    this.deleteContents(node);
                    return;
                }
            });
        }
    }

    containsBlockedUser(node: Element) {
        const blocklists = this.settings.userBlockelists;
        const userName = node.querySelector(Selectors.chat.userName[this.platform])?.textContent;
        if (!userName) return;

        for (const [, blocklist] of Object.entries(blocklists)) {
            const map = new Map(blocklist);

            if (map.get(userName)?.active) {
                this.deleteContents(node);
                return;
            }

            map.forEach((item) => {
                if (item.active === false) return;
                const result = isRegExp(item.value);

                if (result[0] && result[1].test(userName)) {
                    this.deleteContents(node);
                    return;
                }
            });
        }
    }

    containsBlockedEmote(node: Element) {
        const blocklists = this.settings.emoteBlocklists;
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        const compiled = this.compileEmotes(emotes);

        for (const [, blocklist] of Object.entries(blocklists)) {
            const map = new Map(blocklist);

            for (const emoteName of compiled.strings) {
                if (map.get(emoteName)?.active) {
                    this.deleteContents(node);
                    return;
                }
            }

            map.forEach((item) => {
                if (item.active === false) return;
                const result = isRegExp(item.value);

                for (const emoteName of compiled.strings) {
                    if (result[0] && result[1].test(emoteName)) {
                        this.deleteContents(node);
                        return;
                    }
                }
            });
        }
    }

    private compileMessages(messages: NodeListOf<Element>): Compiled {
        let compiled: Compiled = {
            joined: "",
            strings: [],
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
            strings: [],
        };

        for (const emote of emotes) {
            const alt = emote.getAttribute("alt");
            if (alt) {
                compiled.joined += alt;
                compiled.strings.push(alt);
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
