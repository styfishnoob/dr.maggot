export default defineBackground(() => {
    browser.runtime.onInstalled.addListener(function (details) {
        switch (details.reason) {
            case "install":
                //setContextMenu();
                onInstall();
                break;
            case "update":
                //setContextMenu();
                onUpdate();
                break;
            case "browser_update":
                break;
        }
    });
});

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

    for (const [key, value] of Object.entries(settings)) {
        switch (key) {
            case "Display": {
                if (!TypeGuard.is.Display(value)) {
                    const extracted = extractPartial<Display>(key, value);
                    const merged: Display = { ...DefaultSettings[key], ...extracted };
                    storage.set({ [key]: merged });
                    break;
                }
                break;
            }
            case "Filter": {
                if (!TypeGuard.is.Filter(value)) {
                    const extracted = extractPartial<Filter>(key, value);
                    const merged: Filter = { ...DefaultSettings[key], ...extracted };
                    storage.set({ ["BackupFilter"]: value });
                    storage.set({ [key]: merged });
                }
                break;
            }
            case "Danmaku": {
                if (!TypeGuard.is.Danmaku(value)) {
                    const extracted = extractPartial<Danmaku>(key, value);
                    const merged: Danmaku = { ...DefaultSettings[key], ...extracted };
                    storage.set({ [key]: merged });
                }
                break;
            }
            case "Other": {
                if (!TypeGuard.is.Other(value)) {
                    const extracted = extractPartial<Other>(key, value);
                    const merged: Other = { ...DefaultSettings[key], ...extracted };
                    storage.set({ [key]: merged });
                }
                break;
            }
            case "BlockedWords":
            case "BlockedUsers":
            case "BlockedEmotes": {
                if (!TypeGuard.is.AllPlatformRecord(value)) {
                    const extracted = extractPartial<AllPlatformBlocklistRecord>(key, value);
                    const merged: AllPlatformBlocklistRecord = {
                        ...DefaultSettings[key],
                        ...extracted,
                    };
                    storage.set({ [key]: merged });
                }
                break;
            }
        }
    }

    browser.tabs.create({
        url: "chrome-extension://" + browser.runtime.id + "/options.html#/notice",
    });
}

function extractPartial<T extends Object>(
    key: keyof typeof DefaultSettings,
    value: any
): Partial<T> {
    return Object.keys(DefaultSettings[key]).reduce((_acc, _key) => {
        if (_key in value) {
            _acc[_key as keyof T] = value[_key];
        }
        return _acc;
    }, {} as Partial<T>);
}

function setContextMenu() {
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

    browser.contextMenus.create({
        id: "emote",
        title: "block this emote",
        contexts: ["image"],
    });
}
