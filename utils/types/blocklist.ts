export type BlocklistItem = { value: string; active: boolean };
export type Blocklist = [string, BlocklistItem];
export type AllPlatformBlocklistRecord = AllPlatformRecord<Blocklist[]>;
