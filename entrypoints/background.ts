export default defineBackground(() => {
    browser.runtime.onInstalled.addListener(function (details) {
        switch (details.reason) {
            case "install":
                setContextMenu();
                onInstall();
                break;
            case "update":
                setContextMenu();
                onUpdate();
                break;
            case "browser_update":
                break;
        }
    });

    browser.contextMenus.onClicked.addListener(async function (info, tab) {
        switch (info.menuItemId) {
            case "emote": {
                if (tab && tab.id) {
                    const manager = MapManagerList.emote;
                    const response = await browser.tabs.sendMessage(tab.id, {
                        type: MessageType.ContextMenu.BlockEmote,
                    });
                    if (response?.platform && response?.alt) {
                        manager.set(response.platform, response.alt, {
                            value: response.alt,
                            active: true,
                        });
                    }
                }
            }
        }
    });
});

function setContextMenu() {
    browser.contextMenus.create({
        id: "emote",
        title: "block this emote",
        contexts: ["image"],
    });
}

function onInstall() {
    console.log("[dr.maggot - background]: execute onInstall");
    const storage = browser.storage.local;

    const settingsKeys = Object.keys(DefaultSettings) as Array<keyof Settings>;
    for (const key of settingsKeys) {
        if (Object.hasOwn(DefaultSettings, key)) {
            storage.set({ [key]: DefaultSettings[key] });
        }
    }

    //storage.get(null).then((items) => dcon.log(items));
}

async function onUpdate() {
    console.log("[dr.maggot - background]: execute onUpdate");
    const storage = browser.storage.local;
    const settings = await storage.get(null);

    for (const [key, setting] of Object.entries(settings)) {
        switch (key) {
            case "Display": {
                if (!isDisplay(setting)) {
                    storage.set({ ["Display"]: DefaultSettings["Display"] });
                }
                break;
            }
            case "Filter": {
                if (!isFilter(setting)) {
                    storage.set({ ["BackupFilter"]: setting });
                    storage.set({ ["Filter"]: DefaultSettings["Filter"] });

                    const words = DefaultSettings["BlockedWords"];
                    const users = DefaultSettings["BlockedUsers"];
                    const emotes = DefaultSettings["BlockedEmotes"];

                    if (setting["BlockedTerms"] && Array.isArray(setting["BlockedTerms"])) {
                        setting["BlockedTerms"].forEach((obj) => {
                            words.all.push([obj.value, { active: obj.status, value: obj.value }]);
                        });
                    }

                    if (setting["BlockedUsers"] && Array.isArray(setting["BlockedUsers"])) {
                        setting["BlockedUsers"].forEach((obj) => {
                            users.all.push([obj.value, { active: obj.status, value: obj.value }]);
                        });
                    }

                    if (setting["BlockedEmotes"] && Array.isArray(setting["BlockedEmotes"])) {
                        setting["BlockedEmotes"].forEach((obj) => {
                            emotes.all.push([obj.value, { active: obj.status, value: obj.value }]);
                        });
                    }

                    storage.set({ ["BlockedWords"]: words });
                    storage.set({ ["BlockedUsers"]: users });
                    storage.set({ ["BlockedEmotes"]: emotes });
                }
                break;
            }
            case "Danmaku": {
                if (!isDanmaku(setting)) {
                    storage.set({ ["Danmaku"]: DefaultSettings["Danmaku"] });
                }
                break;
            }
            case "Other": {
                if (!isOther(setting)) {
                    storage.set({ ["Other"]: DefaultSettings["Other"] });
                }
                break;
            }
        }
    }

    browser.tabs.create({
        url: "chrome-extension://" + browser.runtime.id + "/options.html#/notice",
    });
}

function isMappedPlatformsState(obj: any): obj is MappedPlatformsState {
    return (
        typeof obj === "object" &&
        typeof obj.youtube === "boolean" &&
        typeof obj.twitch === "boolean" &&
        typeof obj.openrec === "boolean" &&
        typeof obj.twicas === "boolean"
    );
}

function isLimiter(obj: any): obj is Limiter {
    return typeof obj === "object" && typeof obj.less === "number" && typeof obj.more === "number";
}

function isDisplay(obj: any): obj is Display {
    return (
        typeof obj === "object" &&
        isMappedPlatformsState(obj.hideName) &&
        isMappedPlatformsState(obj.unifyName) &&
        typeof obj.unifyNameValue === "string" &&
        isMappedPlatformsState(obj.stripe) &&
        typeof obj.stripeColor === "string" &&
        isMappedPlatformsState(obj.break) &&
        typeof obj.font === "string" &&
        typeof obj.fontSize === "number"
    );
}

function isFilter(obj: any): obj is Filter {
    return (
        typeof obj === "object" &&
        isMappedPlatformsState(obj.filter) &&
        isMappedPlatformsState(obj.subOnly) &&
        isLimiter(obj.charLimit) &&
        isLimiter(obj.emoteLimit) &&
        isMappedPlatformsState(obj.range)
    );
}

function isDanmaku(obj: any): obj is Danmaku {
    return (
        typeof obj === "object" &&
        isMappedPlatformsState(obj.danmaku) &&
        typeof obj.font === "string" &&
        typeof obj.fontSize === "number" &&
        typeof obj.opacity === "number" &&
        typeof obj.speed === "number"
    );
}

function isOther(obj: any): obj is Other {
    return (
        typeof obj === "object" &&
        isMappedPlatformsState(obj.quickBlock) &&
        isMappedPlatformsState(obj.autoBonus) &&
        isMappedPlatformsState(obj.countdown)
    );
}
