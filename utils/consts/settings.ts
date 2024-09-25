import { KVManager } from '@/src/lib/kv-manager';
import { MapManager } from '@/src/lib/map-manager';

export const KVManagerList = {
    display: new KVManager<Display>('Display'),
    filter: new KVManager<Filter>('Filter'),
    danmaku: new KVManager<Danmaku>('Danmaku'),
    other: new KVManager<Other>('Other'),
};

export const MapManagerList = {
    word: new MapManager<BlockMaps, BlockItem>('BlockedWords'),
    user: new MapManager<BlockMaps, BlockItem>('BlockedUsers'),
    emote: new MapManager<BlockMaps, BlockItem>('BlockedEmotes'),
};

const DefaultDisplay: Display = {
    hideName: { youtube: false, twitch: false, openrec: false, twicas: false },
    unifyName: { youtube: false, twitch: false, openrec: false, twicas: false },
    unifyNameValue: `'@'`,
    stripe: { youtube: false, twitch: false, openrec: false, twicas: false },
    stripeColor: '#2563eb',
    break: { youtube: false, twitch: false, openrec: false, twicas: false },
    font: '',
    fontSize: 13,
};

const DefaultFilter: Filter = {
    filter: { youtube: true, twitch: true, openrec: true, twicas: true },
    subOnly: { youtube: false, twitch: false, openrec: false, twicas: false },
    charLimit: { less: 0, more: 0 },
    emoteLimit: { less: 0, more: 0 },
    range: { youtube: false, twitch: false, openrec: false, twicas: false },
};

const DefaultDanmaku: Danmaku = {
    danmaku: { youtube: false, twitch: false, openrec: false, twicas: false },
    font: '',
    fontSize: 28,
    opacity: 50,
    speed: 10,
};

const DefaultOther: Other = {
    quickBlock: { youtube: false, twitch: false, openrec: false, twicas: false },
    autoBonus: { youtube: false, twitch: false, openrec: false, twicas: false },
    countdown: { youtube: false, twitch: false, openrec: false, twicas: false },
};

const DefaultBlockedWords: BlockMaps = {
    all: [],
    youtube: [],
    twitch: [],
    openrec: [],
    twicas: [],
};
const DefaultBlockedUsers: BlockMaps = {
    all: [],
    youtube: [],
    twitch: [],
    openrec: [],
    twicas: [],
};
const DefaultBlockedEmotes: BlockMaps = {
    all: [],
    youtube: [],
    twitch: [],
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
