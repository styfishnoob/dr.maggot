import { AllPlatformBlocklistRecord } from "@/utils";
import { describe, it, expect } from "vitest";

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

const ALL_FALSE = { youtube: false, twitch: false, kick: false, openrec: false, twicas: false };

const settings = {
    BlockedWords: {
        kick: [
            [
                "kick-word",
                {
                    active: true,
                    value: "kick-word",
                },
            ],
        ],
        openrec: [
            [
                "openrec-word",
                {
                    active: true,
                    value: "openrec-word",
                },
            ],
        ],
        twicas: [
            [
                "twicas-word",
                {
                    active: true,
                    value: "twicas-word",
                },
            ],
        ],
        twitch: [
            [
                "twitch-word",
                {
                    active: true,
                    value: "twitch-word",
                },
            ],
        ],
        youtube: [
            [
                "youtube-word",
                {
                    active: true,
                    value: "youtube-word",
                },
            ],
        ],
    },
    Display: {
        hideName: { youtube: false, twitch: false, kick: false, openrec: false, twicas: false },
        break: ALL_FALSE,
        font: "",
        fontSize: 13,
    },
};

describe("Check On Updated", () => {
    describe("BlockedWords", () => {
        const key: keyof typeof DefaultSettings = "BlockedWords";
        it("TypeGuardあり 本番と同じ", () => {
            const value = settings[key];
            let updated = null;

            if (!TypeGuard.is.AllPlatformRecord(value)) {
                updated = updateSettings(
                    DefaultSettings["BlockedWords"],
                    settings.BlockedWords as Partial<AllPlatformBlocklistRecord>
                );
            }

            expect(updated).toEqual({
                all: [],
                kick: [
                    [
                        "kick-word",
                        {
                            active: true,
                            value: "kick-word",
                        },
                    ],
                ],
                openrec: [
                    [
                        "openrec-word",
                        {
                            active: true,
                            value: "openrec-word",
                        },
                    ],
                ],
                twicas: [
                    [
                        "twicas-word",
                        {
                            active: true,
                            value: "twicas-word",
                        },
                    ],
                ],
                twitch: [
                    [
                        "twitch-word",
                        {
                            active: true,
                            value: "twitch-word",
                        },
                    ],
                ],
                youtube: [
                    [
                        "youtube-word",
                        {
                            active: true,
                            value: "youtube-word",
                        },
                    ],
                ],
            });
        });
    });

    describe("Display", () => {
        const key: keyof typeof settings = "Display";

        it("欠損値穴埋めテスト", () => {
            const value = settings[key];
            let updated = null;

            if (!TypeGuard.is.Display(value)) {
                updated = updateSettings(DefaultSettings["Display"], settings.Display as Partial<Display>);
            }

            expect(updated).toEqual({
                hideName: ALL_FALSE,
                unifyName: ALL_FALSE,
                unifyNameValue: "@",
                stripe: ALL_FALSE,
                stripeColor: "#2563eb",
                break: ALL_FALSE,
                font: "",
                fontSize: 13,
            });
        });
    });
});
