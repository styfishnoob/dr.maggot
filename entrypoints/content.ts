export default defineContentScript({
    matches: [
        "*://*.youtube.com/*",
        "*://*.twitch.tv/*",
        "*://*.openrec.tv/*",
        "*://*.kick.com/*",
        "*://*.twitcasting.tv/*",
    ],
    allFrames: true,
    runAt: "document_idle",

    async main() {
        import("@/src/common/auto-bonus/entrypoint");
        import("@/src/common/chat-filter/entrypoint");
        import("@/src/common/custom-css/entrypoint");
        import("@/src/common/danmaku/entrypoint");
        import("@/src/common/quick-block/entrypoint");
        import("@/src/common/followed-days/entrypoint");
        import("@/src/common/sub-only/entrypoint");
    },
});
