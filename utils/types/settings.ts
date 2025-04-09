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
    hideName: PlatformRecord<boolean>;
    unifyName: PlatformRecord<boolean>;
    unifyNameValue: string;
    stripe: PlatformRecord<boolean>;
    stripeColor: string;
    break: PlatformRecord<boolean>;
    font: string;
    fontSize: number;
};

export type Filter = {
    filter: PlatformRecord<boolean>;
    subOnly: PlatformRecord<boolean>;
    charLimit: Limiter;
    emoteLimit: Limiter;
    requiredFollowDays: number;
    range: PlatformRecord<boolean>;
};

export type Danmaku = {
    danmaku: PlatformRecord<boolean>;
    decoration: PlatformRecord<boolean>;
    font: string;
    fontSize: number;
    opacity: number;
    time: number;
    limit: number;
    displayRange: number;
};

export type Other = {
    quickBlock: PlatformRecord<boolean>;
    autoBonus: PlatformRecord<boolean>;
    countdown: PlatformRecord<boolean>;
};
