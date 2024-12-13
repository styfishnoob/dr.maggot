import { TypeGuard } from "@/utils/type-guard";

export default defineBackground(() => {
    browser.runtime.onInstalled.addListener(function (details) {
        switch (details.reason) {
            case "install":
                onInstall();
                break;
            case "update":
                onUpdate();
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
}

async function onUpdate() {
    console.log("[dr.maggot - background]: execute onUpdate");
    const storage = browser.storage.local;
    const settings = await storage.get(null);

    storage.set({ ["BackupBlockedWords"]: settings["BlockedWords"] });
    storage.set({ ["BackupBlockedUsers"]: settings["BlockedUsers"] });
    storage.set({ ["BackupBlockedEmotes"]: settings["BlockedEmotes"] });

    for (const [key, value] of Object.entries(settings)) {
        switch (key) {
            case "Display": {
                if (!TypeGuard.is.Display(value)) {
                    const updated = updateSettings(DefaultSettings[key], value);
                    storage.set({ [key]: updated });
                }
                break;
            }
            case "Filter": {
                if (!TypeGuard.is.Filter(value)) {
                    const updated = updateSettings(DefaultSettings[key], value);
                    storage.set({ [key]: updated });
                }
                break;
            }
            case "Danmaku": {
                if (!TypeGuard.is.Danmaku(value)) {
                    const updated = updateSettings(DefaultSettings[key], value);
                    storage.set({ [key]: updated });
                }
                break;
            }
            case "Other": {
                if (!TypeGuard.is.Other(value)) {
                    const updated = updateSettings(DefaultSettings[key], value);
                    storage.set({ [key]: updated });
                }
                break;
            }
            case "BlockedWords":
            case "BlockedUsers":
            case "BlockedEmotes": {
                if (!TypeGuard.is.AllPlatformRecord(value)) {
                    const updated = updateSettings(DefaultSettings[key], value);
                    storage.set({ [key]: updated });
                }
                break;
            }
        }
    }

    dcon.log(await storage.get(null));

    browser.tabs.create({
        url: "chrome-extension://" + browser.runtime.id + "/options.html#/notice",
    });
}

function checkSettingsProperties<T>(defaultSettings: T, currentSettings: Partial<T>): T {
    const result: Partial<T> = {};
    for (const key in defaultSettings) {
        result[key] = currentSettings[key] !== undefined ? currentSettings[key] : defaultSettings[key];
    }
    return result as T;
}

function updateSettings<T>(defaultSettings: T, currentSettings: Partial<T>): T {
    const result: Partial<T> = {};

    for (const key in defaultSettings) {
        const defaultValue = defaultSettings[key];
        const currentValue = currentSettings[key];

        if (typeof defaultValue === "object" && !Array.isArray(defaultValue) && defaultValue !== null) {
            result[key] = checkSettingsProperties(defaultValue, currentValue || {});
        } else {
            result[key] = currentValue !== undefined ? currentValue : defaultValue;
        }
    }

    return result as T;
}
