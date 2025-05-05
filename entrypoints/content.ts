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

    async main(ctx) {
        const modules = await Promise.all([
            import("@/src/common/auto-bonus/entrypoint"),
            import("@/src/common/chat-filter/entrypoint"),
            import("@/src/common/custom-css/entrypoint"),
            import("@/src/common/danmaku/entrypoint"),
            import("@/src/common/quick-block/entrypoint"),
            import("@/src/common/follow-days/entrypoint"),
            import("@/src/common/sub-only/entrypoint"),
        ]);

        modules.forEach((mod) => {
            if (typeof mod.default === "function") {
                mod.default(ctx);
            }
        });
    },
});
