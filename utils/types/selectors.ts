type PlatformSelectorRecord = Readonly<PlatformRecord<string>>;

export type WebSelectors = {
    videoPlayer: PlatformSelectorRecord;
    chat: {
        container: PlatformSelectorRecord;
        cell: PlatformSelectorRecord;
        quickBlockAnchor: PlatformSelectorRecord;
        contents: PlatformSelectorRecord;
        userName: PlatformSelectorRecord;
        messages: PlatformSelectorRecord;
        emotes: PlatformSelectorRecord;
    };
};
