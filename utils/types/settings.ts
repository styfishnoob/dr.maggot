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
    range: PlatformStateRecord;
};

export type Danmaku = {
    danmaku: PlatformStateRecord;
    font: string;
    fontSize: number;
    opacity: number;
    speed: number;
};

export type Other = {
    quickBlock: PlatformStateRecord;
    autoBonus: PlatformStateRecord;
    countdown: PlatformStateRecord;
};
