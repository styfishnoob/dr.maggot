export type PlatformStateRecord = PlatformRecord<boolean>;

export type Limiter = {
    less: number;
    more: number;
};

export type Settings = {
    Display: Display;
    Filter: Filter;
    Danmaku: Danmaku;
    Other: Other;
    BlockedWords: AllPlatformBlocklistRecord;
    BlockedUsers: AllPlatformBlocklistRecord;
    BlockedEmotes: AllPlatformBlocklistRecord;
};

export type Display = {
    hideName: PlatformStateRecord;
    unifyName: PlatformStateRecord;
    unifyNameValue: string;
    stripe: PlatformStateRecord;
    stripeColor: string;
    break: PlatformStateRecord;
    font: string;
    fontSize: number;
};

export type Filter = {
    filter: PlatformStateRecord;
    subOnly: PlatformStateRecord;
    charLimit: Limiter;
    emoteLimit: Limiter;
    requiredFollowDays: number;
    range: PlatformStateRecord;
};

export type Danmaku = {
    danmaku: PlatformStateRecord;
    decoration: PlatformStateRecord;
    font: string;
    fontSize: number;
    opacity: number;
    time: number;
    limit: number;
};

export type Other = {
    quickBlock: PlatformStateRecord;
    autoBonus: PlatformStateRecord;
    countdown: PlatformStateRecord;
};
