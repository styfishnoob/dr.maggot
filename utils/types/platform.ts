export const PLATFORMS = ["youtube", "twitch", "kick", "openrec", "twicas"] as const;

export type Platforms = (typeof PLATFORMS)[number];
export type PlatformRecord<U> = Record<Platforms, U>;

export type AllPlatforms = "all" | Platforms;
export type AllPlatformRecord<U> = Record<AllPlatforms, U>;
