import { AllPlatformRecord, PlatformRecord } from "./types/platform";

export const TypeGuard = {
    is: {
        PlatformRecord: function <T>(obj: any): obj is PlatformRecord<T> {
            for (const key of PLATFORMS) {
                if (!(key in obj)) return false;
            }
            return true;
        },
        AllPlatformRecord: function <T>(obj: any): obj is AllPlatformRecord<T> {
            if (!("all" in obj)) return false;
            if (!this.PlatformRecord(obj)) return false;
            return true;
        },
        PlatformStateRecord: function (obj: any): obj is PlatformStateRecord {
            return (
                typeof obj === "object" &&
                typeof obj.youtube === "boolean" &&
                typeof obj.twitch === "boolean" &&
                typeof obj.openrec === "boolean" &&
                typeof obj.twicas === "boolean"
            );
        },
        AllPlatformBlocklistRecord: function (obj: any): obj is AllPlatformBlocklistRecord {
            if (typeof obj !== "object" || obj === null) {
                return false;
            }

            const keys = Object.keys(obj) as AllPlatforms[];
            const validKeys = ["all", ...PLATFORMS];

            return keys.every(
                (key) =>
                    validKeys.includes(key) &&
                    Array.isArray(obj[key]) &&
                    obj[key].every((blocklist: any) => this.Blocklist(blocklist))
            );
        },
        Blocklist: function (arr: Array<any>) {
            if (Array.isArray(arr) && arr.length === 0) return true;
            return (
                Array.isArray(arr) &&
                typeof arr[0] === "string" &&
                typeof arr[1] === "object" &&
                typeof arr[1].value === "string" &&
                typeof arr[1].active === "boolean"
            );
        },
        Limiter: function (obj: any): obj is Limiter {
            return typeof obj === "object" && typeof obj.less === "number" && typeof obj.more === "number";
        },
        Display: function (obj: any): obj is Display {
            return (
                typeof obj === "object" &&
                this.PlatformStateRecord(obj.hideName) &&
                this.PlatformStateRecord(obj.unifyName) &&
                typeof obj.unifyNameValue === "string" &&
                this.PlatformStateRecord(obj.stripe) &&
                typeof obj.stripeColor === "string" &&
                this.PlatformStateRecord(obj.break) &&
                typeof obj.font === "string" &&
                typeof obj.fontSize === "number"
            );
        },
        Filter: function Filter(obj: any): obj is Filter {
            return (
                typeof obj === "object" &&
                this.PlatformStateRecord(obj.filter) &&
                this.PlatformStateRecord(obj.subOnly) &&
                this.Limiter(obj.charLimit) &&
                this.Limiter(obj.emoteLimit) &&
                typeof obj.requiredFollowDays === "number" &&
                this.PlatformStateRecord(obj.range)
            );
        },
        Danmaku: function (obj: any): obj is Danmaku {
            return (
                typeof obj === "object" &&
                this.PlatformStateRecord(obj.danmaku) &&
                typeof obj.font === "string" &&
                typeof obj.fontSize === "number" &&
                typeof obj.opacity === "number" &&
                typeof obj.speed === "number"
            );
        },
        Other: function (obj: any): obj is Other {
            return (
                typeof obj === "object" &&
                this.PlatformStateRecord(obj.quickBlock) &&
                this.PlatformStateRecord(obj.autoBonus) &&
                this.PlatformStateRecord(obj.countdown)
            );
        },
    },
};
