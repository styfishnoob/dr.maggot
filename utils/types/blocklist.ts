export type BlockMapSupportedPlatforms = 'all' | SupportedPlatforms;
export type MappedBlockMapSupportedPlatforms<U> = { [K in BlockMapSupportedPlatforms]: U };
export type BlockItem = { value: string; active: boolean };
export type BlockMap = [string, BlockItem];
export type BlockMaps = MappedBlockMapSupportedPlatforms<BlockMap[]>;
