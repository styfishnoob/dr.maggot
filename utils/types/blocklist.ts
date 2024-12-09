export type BlocklistItemValue = { value: string; active: boolean };
export type BlocklistItem = [string, BlocklistItemValue];
export type Blocklist = BlocklistItem[];
export type AllPlatformBlocklistRecord = AllPlatformRecord<Blocklist>;
