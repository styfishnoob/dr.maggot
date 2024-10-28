import { isRegExp } from "@/src/lib/is-regexp";

type Settings = {
    filter: Filter;
    wordsMaps: { all: Blocklist[]; platform: Blocklist[] };
    usersMaps: { all: Blocklist[]; platform: Blocklist[] };
    emotesMaps: { all: Blocklist[]; platform: Blocklist[] };
};

const defaultSettings: Settings = {
    filter: DefaultSettings.Filter,
    wordsMaps: { all: [], platform: [] },
    usersMaps: { all: [], platform: [] },
    emotesMaps: { all: [], platform: [] },
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
        this.settings.wordsMaps = {
            all: await MapManagerList.word.getMap("all"),
            platform: await MapManagerList.word.getMap(this.platform),
        };
        this.settings.usersMaps = {
            all: await MapManagerList.user.getMap("all"),
            platform: await MapManagerList.user.getMap(this.platform),
        };
        this.settings.emotesMaps = {
            all: await MapManagerList.emote.getMap("all"),
            platform: await MapManagerList.emote.getMap(this.platform),
        };
    }

    checkCharLimit(node: Element) {
        const limit = this.settings.filter.charLimit;
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);
        if (compiled) {
            if (limit.less > 0 && limit.less >= compiled.length) this.deleteContents(node);
            if (limit.more > 0 && limit.more <= compiled.length) this.deleteContents(node);
        }
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
        const maps = this.settings.wordsMaps;
        const messages = node.querySelectorAll(Selectors.chat.messages[this.platform]);
        const compiled = this.compileMessages(messages);

        for (const [, map] of Object.entries(maps)) {
            map.forEach((item) => {
                if (item[1].active === false) return;
                const result = isRegExp(item[1].value);

                if (result[0] && result[1].test(compiled)) {
                    this.deleteContents(node);
                    return;
                }

                if (!result[0] && compiled.includes(item[1].value)) {
                    this.deleteContents(node);
                    return;
                }
            });
        }
    }

    containsBlockedUser(node: Element) {
        const maps = this.settings.usersMaps;
        const userName = node.querySelector(Selectors.chat.userName[this.platform])?.textContent;
        if (!userName) return;

        for (const [, map] of Object.entries(maps)) {
            const MAP = new Map(map);
            const active = MAP.get(userName);

            if (active) {
                this.deleteContents(node);
                return;
            }

            map.forEach((item) => {
                if (item[1].active === false) return;
                const result = isRegExp(item[1].value);

                if (result[0] && result[1].test(userName)) {
                    this.deleteContents(node);
                    return;
                }
            });
        }
    }

    containsBlockedEmote(node: Element) {
        const maps = this.settings.emotesMaps;
        const emotes = node.querySelectorAll(Selectors.chat.emotes[this.platform]);
        const compiled = this.compileEmotes(emotes);

        for (const [, map] of Object.entries(maps)) {
            map.forEach((item) => {
                if (item[1].active === false) return;
                const result = isRegExp(item[1].value);

                if (result[0] && result[1].test(compiled)) {
                    this.deleteContents(node);
                    return;
                }

                if (!result[0] && compiled.includes(item[1].value)) {
                    this.deleteContents(node);
                    return;
                }
            });
        }
    }

    private compileMessages(messages: NodeListOf<Element>) {
        let result = "";
        for (const message of messages) {
            if (message.textContent) {
                result += message.textContent;
            }
        }
        const compiled = result.replace(/\s+/g, "");
        return compiled;
    }

    private compileEmotes(emotes: NodeListOf<Element>) {
        let result = "";
        for (const emote of emotes) {
            const alt = emote.getAttribute("alt");
            if (alt) {
                result += alt;
            }
        }
        return result;
    }

    private deleteContents(node: Element) {
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
            const contents = node.querySelector<HTMLElement>(
                Selectors.chat.contents[this.platform]
            );
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
