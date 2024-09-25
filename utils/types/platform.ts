const SUPPORTED_PLATFORMS = ['youtube', 'twitch', 'openrec', 'twicas'] as const;
export type SupportedPlatforms = (typeof SUPPORTED_PLATFORMS)[number];
export type MappedSupportedPlatforms<U> = { [K in SupportedPlatforms]: U };
