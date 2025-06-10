const NULL = "[drmaggot__null]";

export const Selectors: WebSelectors = {
    videoPlayer: {
        youtube: `#movie_player`,
        twitch: `[data-a-target="video-player"] > .video-player__container`,
        kick: `#injected-embedded-channel-player-video > div`,
        openrec: `.video-player-wrapper`,
        twicas: `.tw-player`,
    },

    chat: {
        container: {
            youtube: `#items`,
            twitch: `[data-test-selector="chat-scrollable-area__message-container"]`,
            kick: `#chatroom-messages > div.no-scrollbar`,
            openrec: `.chat-list-content`,
            twicas: `.tw-comment-list-view__scroller > div`,
        },

        cell: {
            youtube: `yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer`,
            twitch: `[data-a-target="chat-line-message"], .video-chat__message-list-wrapper li`,
            kick: `#chatroom-messages > div.no-scrollbar > div[data-index]`,
            openrec: `.sc-69ljpb-1`,
            twicas: `.tw-comment-item`,
        },

        quickBlockAnchor: {
            youtube: `#menu`,
            twitch: `.chat-line__icons, div.vod-message`,
            kick: `.group`,
            openrec: `.sc-1ey02g1-4`,
            twicas: `.tw-comment-item-dropdown`,
        },

        contents: {
            youtube: `#message`,
            twitch: `[data-a-target="chat-line-message-body"], .video-chat__message > span[class=""]`,
            kick: `.font-normal`,
            openrec: `.sc-bmdkpm-0`,
            twicas: `.tw-comment-item-comment`,
        },

        userName: {
            youtube: `#author-name`,
            twitch: `[data-a-user]`,
            kick: `button[class="inline font-bold"]`,
            openrec: `.sc-1i0rd20-1`,
            twicas: `.tw-comment-item-name`,
        },

        messages: {
            youtube: `#message`,
            twitch: `.text-fragment`,
            kick: `.font-normal`,
            openrec: `.chat-content`,
            twicas: `.tw-comment-item-comment > span`,
        },

        emotes: {
            youtube: `.emoji`,
            twitch: `img[class*="chat-line__message--emote"]`,
            kick: `[data-emote-id][data-emote-name] img`,
            openrec: `.sc-1ey02g1-7`,
            twicas: `${NULL}`,
        },
    },
};
