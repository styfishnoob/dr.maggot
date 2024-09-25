type MappedPlatformsSelector = Readonly<MappedSupportedPlatforms<string>>;

export type PlatformSelectors = {
    videoPlayer: MappedPlatformsSelector;
    chat: {
        container: MappedPlatformsSelector;
        cell: MappedPlatformsSelector;
        quickBlockAnchor: MappedPlatformsSelector;
        contents: MappedPlatformsSelector;
        userName: MappedPlatformsSelector;
        messages: MappedPlatformsSelector;
        emotes: MappedPlatformsSelector;
        twitchBonus: MappedPlatformsSelector;
    };
};
