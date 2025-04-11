import { AllPlatformBlocklistRecord } from "./types/blocklist";
import { AllPlatformRecord, PlatformRecord } from "./types/platform";

type TypeGuardRecord<T> = Record<keyof T, (v: unknown) => boolean>;

function checkUserDefinedTypeObject<T>(value: unknown, guards: TypeGuardRecord<T>): boolean {
    if (!TypeGuard.is.Object(value)) return false;

    for (const key in value) {
        if (!(key in guards)) {
            dcon.log("定義されていないプロパティ", key);
            return false;
        }
    }

    for (const key in guards) {
        const guard = guards[key];
        const vkey = (value as any)[key];

        if (!(key in value)) {
            dcon.error(`不足しているプロパティ: ${key}`);
            return false;
        }

        if (!guard(vkey)) {
            dcon.error(`型に異常があるプロパティ: ${key}`);
            return false;
        }
    }

    return true;
}

export const TypeGuard = {
    is: {
        Boolean: (value: unknown): value is boolean => typeof value === "boolean",
        Number: (value: unknown): value is number => typeof value === "number",
        String: (value: unknown): value is string => typeof value === "string",
        Object: (value: unknown): value is object => typeof value === "object",

        PlatformRecord: function (value: unknown): value is PlatformRecord<unknown> {
            if (!this.Object(value)) return false;

            for (const [key] of Object.entries(value)) {
                if (!PLATFORMS.some((p) => p === key)) {
                    dcon.log("定義されていないプロパティ", key);
                    return false;
                }
            }

            for (const key of PLATFORMS) {
                if (!(key in value)) {
                    dcon.log("不足しているプロパティ", key);
                    return false;
                }
            }

            return true;
        },

        AllPlatformRecord: function (value: unknown): value is AllPlatformRecord<unknown> {
            if (!this.Object(value)) return false;

            for (const [key] of Object.entries(value)) {
                if (!ALL_PLATFORMS.some((p) => p === key)) {
                    dcon.log("定義されていないプロパティ", key);
                    return false;
                }
            }

            for (const key of ALL_PLATFORMS) {
                if (!(key in value)) {
                    dcon.log("不足しているプロパティ", key);
                    return false;
                }
            }

            return true;
        },

        PlatformBooleanRecord: function (value: unknown): value is PlatformRecord<boolean> {
            if (!this.Object(value)) return false;
            if (!this.PlatformRecord(value)) return false;
            for (const [, v] of Object.entries(value)) {
                if (typeof v !== "boolean") return false;
            }
            return true;
        },

        BlocklistItemValue: function (value: unknown): value is BlocklistItemValue {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<BlocklistItemValue> = {
                value: (v) => this.String(v),
                active: (v) => this.Boolean(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        BlocklistItem: function (value: unknown): value is BlocklistItem {
            if (!Array.isArray(value) || value.length !== 2) return false;
            return this.String(value[0]) && this.BlocklistItemValue(value[1]);
        },

        Blocklist: function (value: unknown): value is Blocklist {
            return Array.isArray(value) && value.every((v) => this.BlocklistItem(v));
        },

        AllPlatformBlocklistRecord: function (value: unknown): value is AllPlatformBlocklistRecord {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<AllPlatformBlocklistRecord> = {
                all: (v) => this.Blocklist(v),
                youtube: (v) => this.Blocklist(v),
                twitch: (v) => this.Blocklist(v),
                kick: (v) => this.Blocklist(v),
                openrec: (v) => this.Blocklist(v),
                twicas: (v) => this.Blocklist(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        Limiter: function (value: unknown): value is Limiter {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<Limiter> = {
                less: (v) => this.Number(v),
                more: (v) => this.Number(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        Display: function (value: unknown): value is Display {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<Display> = {
                hideName: (v) => this.PlatformBooleanRecord(v),
                unifyName: (v) => this.PlatformBooleanRecord(v),
                unifyNameValue: (v) => this.String(v),
                stripe: (v) => this.PlatformBooleanRecord(v),
                stripeColor: (v) => this.String(v),
                break: (v) => this.PlatformBooleanRecord(v),
                font: (v) => this.String(v),
                fontSize: (v) => this.Number(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        Filter: function (value: unknown): value is Filter {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<Filter> = {
                filter: (v) => this.PlatformBooleanRecord(v),
                subOnly: (v) => this.PlatformBooleanRecord(v),
                charLimit: (v) => this.Limiter(v),
                emoteLimit: (v) => this.Limiter(v),
                requiredFollowDays: (v) => this.Number(v),
                range: (v) => this.PlatformBooleanRecord(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        Danmaku: function (value: unknown): value is Danmaku {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<Danmaku> = {
                danmaku: (v) => this.PlatformBooleanRecord(v),
                decoration: (v) => this.PlatformBooleanRecord(v),
                font: (v) => this.String(v),
                fontSize: (v) => this.Number(v),
                opacity: (v) => this.Number(v),
                time: (v) => this.Number(v),
                limit: (v) => this.Number(v),
                displayRange: (v) => this.Number(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },

        Other: function (value: unknown): value is Other {
            if (!this.Object(value)) return false;

            const guards: TypeGuardRecord<Other> = {
                quickBlock: (v) => this.PlatformBooleanRecord(v),
                autoBonus: (v) => this.PlatformBooleanRecord(v),
                countdown: (v) => this.PlatformBooleanRecord(v),
            };

            return checkUserDefinedTypeObject(value, guards);
        },
    },
};
