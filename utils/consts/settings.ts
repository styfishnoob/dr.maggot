import { KVManager } from "@/src/lib/kv-manager";
import { MapManager } from "@/src/lib/map-manager";

export const KVManagerList = {
    display: new KVManager<Display>("Display"),
    filter: new KVManager<Filter>("Filter"),
    danmaku: new KVManager<Danmaku>("Danmaku"),
    other: new KVManager<Other>("Other"),
};

export const MapManagerList = {
    word: new MapManager<AllPlatformBlocklistRecord, BlocklistItemValue>("BlockedWords"),
    user: new MapManager<AllPlatformBlocklistRecord, BlocklistItemValue>("BlockedUsers"),
    emote: new MapManager<AllPlatformBlocklistRecord, BlocklistItemValue>("BlockedEmotes"),
};

const ALL_FALSE = { youtube: false, twitch: false, kick: false, openrec: false, twicas: false };
const ALL_TRUE = { youtube: true, twitch: true, kick: true, openrec: true, twicas: true };

const DefaultDisplay: Display = {
    hideName: ALL_FALSE,
    unifyName: ALL_FALSE,
    unifyNameValue: `'@'`,
    stripe: ALL_FALSE,
    stripeColor: "#2563eb",
    break: ALL_FALSE,
    font: "",
    fontSize: 13,
};

const DefaultFilter: Filter = {
    filter: ALL_TRUE,
    subOnly: ALL_FALSE,
    charLimit: { less: 0, more: 0 },
    emoteLimit: { less: 0, more: 0 },
    requiredFollowDays: 0,
    range: ALL_FALSE,
};

const DefaultDanmaku: Danmaku = {
    danmaku: ALL_FALSE,
    decoration: ALL_FALSE,
    font: "",
    fontSize: 28,
    opacity: 50,
    time: 10,
    limit: 0,
};

const DefaultOther: Other = {
    quickBlock: ALL_FALSE,
    autoBonus: ALL_FALSE,
    countdown: ALL_FALSE,
};

const DefaultBlockedWords: AllPlatformBlocklistRecord = {
    all: [],
    youtube: [],
    twitch: [],
    kick: [],
    openrec: [],
    twicas: [],
};

const DefaultBlockedUsers: AllPlatformBlocklistRecord = {
    all: [],
    youtube: [],
    twitch: [],
    kick: [],
    openrec: [],
    twicas: [],
};

const DefaultBlockedEmotes: AllPlatformBlocklistRecord = {
    all: [],
    youtube: [],
    twitch: [],
    kick: [],
    openrec: [],
    twicas: [],
};

export const DefaultSettings = {
    Display: DefaultDisplay,
    Filter: DefaultFilter,
    Danmaku: DefaultDanmaku,
    Other: DefaultOther,
    BlockedWords: DefaultBlockedWords,
    BlockedUsers: DefaultBlockedUsers,
    BlockedEmotes: DefaultBlockedEmotes,
};
