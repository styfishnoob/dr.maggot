export default defineContentScript({
    matches: [
        "*://*.youtube.com/*",
        "*://*.twitch.tv/*",
        "*://*.openrec.tv/*",
        "*://*.twitcasting.tv/*",
    ],
    allFrames: true,
    runAt: "document_idle",

    main() {
        import("@/src/common/auto-bonus/entrypoint");
        import("@/src/common/chat-filter/entrypoint");
        import("@/src/common/custom-css/entrypoint");
        import("@/src/common/danmaku/entrypoint");
        import("@/src/common/quick-block/entrypoint");
        import("@/src/common/sub-only/entrypoint");
    },
});
