export type MappedPlatformsState = MappedSupportedPlatforms<boolean>;

export type Limiter = {
    less: number;
    more: number;
};

export type Settings = {
    Display: Display;
    Filter: Filter;
    Danmaku: Danmaku;
    Other: Other;
    BlockedWords: BlockMaps;
    BlockedUsers: BlockMaps;
    BlockedEmotes: BlockMaps;
};

export type Display = {
    hideName: MappedPlatformsState;
    unifyName: MappedPlatformsState;
    unifyNameValue: string;
    stripe: MappedPlatformsState;
    stripeColor: string;
    break: MappedPlatformsState;
    font: string;
    fontSize: number;
};

export type Filter = {
    filter: MappedPlatformsState;
    subOnly: MappedPlatformsState;
    charLimit: Limiter;
    emoteLimit: Limiter;
    range: MappedPlatformsState;
};

export type Danmaku = {
    danmaku: MappedPlatformsState;
    font: string;
    fontSize: number;
    opacity: number;
    speed: number;
};

export type Other = {
    quickBlock: MappedPlatformsState;
    autoBonus: MappedPlatformsState;
    countdown: MappedPlatformsState;
};
