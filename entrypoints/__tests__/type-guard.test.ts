import { describe, it, expect } from "vitest";
import { TypeGuard } from "@/utils/type-guard";

describe("TypeGuard Test", () => {
    describe("PlatformRecord", () => {
        it("[true] 正常", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
            };
            expect(TypeGuard.is.PlatformRecord(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                twicas: true,
            };
            expect(TypeGuard.is.PlatformRecord(value)).toBe(false);
        });

        it("[false] 未定義プロパティを含む", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
                tiktok: true,
            };
            expect(TypeGuard.is.PlatformRecord(value)).toBe(false);
        });

        it("[false] そもそもオブジェクトではない", () => {
            const value = "文字列";
            expect(TypeGuard.is.PlatformRecord(value)).toBe(false);
        });
    });

    describe("PlatformBooleanRecord", () => {
        it("[true] 正常", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
            };
            expect(TypeGuard.is.PlatformBooleanRecord(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
            };
            expect(TypeGuard.is.PlatformBooleanRecord(value)).toBe(false);
        });

        it("[false] 未定義プロパティを含む", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
                tiktok: true,
            };
            expect(TypeGuard.is.PlatformBooleanRecord(value)).toBe(false);
        });

        it("[false] プロパティ充足、値の型がbooleanではないものが含まれている", () => {
            const value = {
                youtube: "yaa",
                twitch: "yaa",
                kick: "yaa",
                openrec: false,
                twicas: true,
            };
            expect(TypeGuard.is.PlatformBooleanRecord(value)).toBe(false);
        });

        it("[false] プロパティ充足、全ての値の型がbooleanではない", () => {
            const value = {
                youtube: "yaa",
                twitch: "yaa",
                kick: "yaa",
                openrec: "taa",
                twicas: "dorya",
            };
            expect(TypeGuard.is.PlatformBooleanRecord(value)).toBe(false);
        });

        it("[false] オブジェクトではない", () => {
            expect(TypeGuard.is.PlatformBooleanRecord("aaaaa")).toBe(false);
        });
    });

    describe("AllPlatformRecord", () => {
        it("[true] 正常", () => {
            const value = {
                all: true,
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
            };
            expect(TypeGuard.is.AllPlatformRecord(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
            };
            expect(TypeGuard.is.AllPlatformRecord(value)).toBe(false);
        });

        it("[false] 未定義プロパティを含む", () => {
            const value = {
                all: true,
                youtube: true,
                twitch: true,
                kick: true,
                openrec: true,
                twicas: true,
                tiktok: true,
            };
            expect(TypeGuard.is.AllPlatformRecord(value)).toBe(false);
        });

        it("[false] オブジェクトではない", () => {
            expect(TypeGuard.is.AllPlatformRecord("yaa")).toBe(false);
        });
    });

    describe("BlocklistItemValue", () => {
        it("[true] 正常", () => {
            const value = {
                value: "www",
                active: true,
            };
            expect(TypeGuard.is.BlocklistItemValue(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                active: true,
            };
            expect(TypeGuard.is.BlocklistItemValue(value)).toBe(false);
        });

        it("[false] 未定義プロパティを含む", () => {
            const value = {
                value: "www",
                active: true,
                kimikesu: true,
            };
            expect(TypeGuard.is.BlocklistItemValue(value)).toBe(false);
        });

        it("[false] オブジェクトではない", () => {
            expect(TypeGuard.is.BlocklistItemValue("www")).toBe(false);
        });
    });

    describe("BlocklistItem", () => {
        it("[true] 正常", () => {
            const value = ["1", { value: "1", active: true }];
            expect(TypeGuard.is.BlocklistItem(value)).toBe(true);
        });

        it("[false] タプルに含まれる値が多い", () => {
            const value = ["1", "2", { value: "1", active: false }];
            expect(TypeGuard.is.BlocklistItem(value)).toBe(false);
        });

        it("[false] タプルに含まれる値が少ない", () => {
            const value = [{ value: "1", active: false }];
            expect(TypeGuard.is.BlocklistItem(value)).toBe(false);
        });

        it("[false] タプルではない", () => {
            const value = "www";
            expect(TypeGuard.is.BlocklistItem(value)).toBe(false);
        });
    });

    describe("Blocklist", () => {
        it("[true] 正常", () => {
            const value = [
                ["1", { value: "1", active: true }],
                ["2", { value: "2", active: true }],
                ["3", { value: "3", active: true }],
            ];

            expect(TypeGuard.is.Blocklist(value)).toBe(true);
        });

        it("[true] 正常(空配列)", () => {
            const value: any[] = [];
            expect(TypeGuard.is.Blocklist(value)).toBe(true);
        });

        it("[false] 異常なBlocklistItemが含まれる", () => {
            const value = [
                ["1", { value: "1", active: true }],
                ["2", "doraaaaaaaa", { value: "2", active: true }],
                ["3", { value: "3", active: true }],
            ];

            expect(TypeGuard.is.Blocklist(value)).toBe(false);
        });

        it("[false] 配列ではない", () => {
            const value = "string";
            expect(TypeGuard.is.Blocklist(value)).toBe(false);
        });
    });

    describe("AllPlatformBlocklistRecord", () => {
        it("[true] 正常", () => {
            const value = {
                all: [["1", { value: "1", active: true }]],
                youtube: [["1", { value: "1", active: true }]],
                twitch: [["1", { value: "1", active: true }]],
                kick: [["1", { value: "1", active: true }]],
                openrec: [["1", { value: "1", active: true }]],
                twicas: [["1", { value: "1", active: true }]],
            };
            expect(TypeGuard.is.AllPlatformBlocklistRecord(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                all: [["1", { value: "1", active: true }]],
                youtube: [["1", { value: "1", active: true }]],
                twitch: [["1", { value: "1", active: true }]],
                kick: [["1", { value: "1", active: true }]],
            };
            expect(TypeGuard.is.AllPlatformBlocklistRecord(value)).toBe(false);
        });

        it("[false] 未定義プロパティ含む", () => {
            const value = {
                all: [["1", { value: "1", active: true }]],
                youtube: [["1", { value: "1", active: true }]],
                twitch: [["1", { value: "1", active: true }]],
                kick: [["1", { value: "1", active: true }]],
                openrec: [["1", { value: "1", active: true }]],
                twicas: [["1", { value: "1", active: true }]],
                tiktok: [["1", { value: "1", active: true }]],
            };
            expect(TypeGuard.is.AllPlatformBlocklistRecord(value)).toBe(false);
        });

        it("[false] 異常なBlocklistItemValueを含むBlocklistItemが含まれる", () => {
            const value = {
                all: [["1", { value: "1" }]],
                youtube: [["1", { value: "1", active: true }]],
                twitch: [["1", { value: "1", active: true }]],
                kick: [["1", { value: "1", active: true }]],
                openrec: [["1", { value: "1", active: true }]],
                twicas: [["1", { value: "1", active: true }]],
            };
            expect(TypeGuard.is.AllPlatformBlocklistRecord(value)).toBe(false);
        });

        it("[false] 異常なBlocklistItemが含まれる", () => {
            const value = {
                all: [["1", "oiiiiiiiiiiii", { value: "1", active: true }]],
                youtube: [["1", { value: "1", active: true }]],
                twitch: [["1", { value: "1", active: true }]],
                kick: [["1", { value: "1", active: true }]],
                openrec: [["1", { value: "1", active: true }]],
                twicas: [["1", { value: "1", active: true }]],
            };
            expect(TypeGuard.is.AllPlatformBlocklistRecord(value)).toBe(false);
        });
    });

    describe("Limiter", () => {
        it("[true] 正常", () => {
            const value = {
                less: 1,
                more: 1,
            };
            expect(TypeGuard.is.Limiter(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                less: 1,
            };
            expect(TypeGuard.is.Limiter(value)).toBe(false);
        });

        it("[false] 型が異なるプロパティを含む", () => {
            const value = {
                less: "yaa",
                more: 1,
            };
            expect(TypeGuard.is.Limiter(value)).toBe(false);
        });

        it("[false] 不適切なキーが含まれる", () => {
            const value = {
                less: 1,
                more: 1,
                medium: 1,
            };
            expect(TypeGuard.is.Limiter(value)).toBe(false);
        });
    });

    describe("Display", () => {
        it("[true] 正常", () => {
            const value = {
                hideName: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                unifyName: {
                    youtube: false,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                unifyNameValue: "unifiedName",
                stripe: {
                    youtube: false,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                stripeColor: "red",
                break: {
                    youtube: true,
                    twitch: false,
                    kick: false,
                    openrec: false,
                    twicas: false,
                },
                font: "Arial",
                fontSize: 12,
            };
            expect(TypeGuard.is.Display(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                hideName: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                },
                unifyName: {
                    youtube: false,
                    twitch: true,
                },
                unifyNameValue: "unifiedName",
                stripeColor: "red",
                fontSize: 12,
            };
            expect(TypeGuard.is.Display(value)).toBe(false);
        });

        it("[false] 型が異なるプロパティを含む", () => {
            const value = {
                hideName: "notAnObject",
                unifyName: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                unifyNameValue: 123,
                stripe: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                stripeColor: "red",
                break: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                font: "Arial",
                fontSize: "large",
            };
            expect(TypeGuard.is.Display(value)).toBe(false);
        });
    });

    describe("Filter", () => {
        it("[true] 正常", () => {
            const value = {
                filter: {
                    youtube: true,
                    twitch: false,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                subOnly: {
                    youtube: false,
                    twitch: true,
                    kick: true,
                    openrec: false,
                    twicas: true,
                },
                charLimit: {
                    less: 5,
                    more: 2,
                },
                emoteLimit: {
                    less: 10,
                    more: 3,
                },
                requiredFollowDays: 7,
                range: {
                    youtube: true,
                    twitch: false,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
            };
            expect(TypeGuard.is.Filter(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                filter: {
                    youtube: true,
                    twitch: true,
                },
                subOnly: {
                    youtube: false,
                    twitch: true,
                },
            };
            expect(TypeGuard.is.Filter(value)).toBe(false);
        });

        it("[false] 型が異なるプロパティを含む", () => {
            const value = {
                filter: {
                    youtube: true,
                    twitch: false,
                },
                subOnly: {
                    youtube: false,
                    twitch: true,
                },
                charLimit: {
                    less: "notANumber",
                    more: 2,
                },
                emoteLimit: {
                    less: 10,
                    more: "notANumber",
                },
                requiredFollowDays: "notANumber",
                range: "notAnObject",
            };
            expect(TypeGuard.is.Filter(value)).toBe(false);
        });
    });

    describe("Danmaku", () => {
        it("[true] 正常", () => {
            const value = {
                danmaku: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                decoration: {
                    youtube: false,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                font: "Verdana",
                fontSize: 14,
                opacity: 0.8,
                time: 10,
                limit: 5,
            };
            expect(TypeGuard.is.Danmaku(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                danmaku: {
                    youtube: true,
                    twitch: true,
                },
                font: "Verdana",
                fontSize: 14,
            };
            expect(TypeGuard.is.Danmaku(value)).toBe(false);
        });

        it("[false] 型が異なるプロパティを含む", () => {
            const value = {
                danmaku: {
                    youtube: true,
                    twitch: false,
                },
                decoration: "notAnObject",
                font: 123,
                fontSize: "large",
                opacity: "opaque",
                time: "notANumber",
                limit: "notANumber",
            };
            expect(TypeGuard.is.Danmaku(value)).toBe(false);
        });
    });

    describe("Other", () => {
        it("[true] 正常", () => {
            const value = {
                quickBlock: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                autoBonus: {
                    youtube: false,
                    twitch: true,
                    kick: true,
                    openrec: true,
                    twicas: true,
                },
                countdown: {
                    youtube: true,
                    twitch: true,
                    kick: true,
                    openrec: false,
                    twicas: true,
                },
            };
            expect(TypeGuard.is.Other(value)).toBe(true);
        });

        it("[false] プロパティ不足", () => {
            const value = {
                quickBlock: {
                    youtube: true,
                },
                autoBonus: {
                    youtube: false,
                },
            };
            expect(TypeGuard.is.Other(value)).toBe(false);
        });

        it("[false] 型が異なるプロパティを含む", () => {
            const value = {
                quickBlock: "notAnObject",
                autoBonus: {
                    youtube: true,
                    twitch: true,
                },
                countdown: "notAnObject",
            };
            expect(TypeGuard.is.Other(value)).toBe(false);
        });
    });
});
