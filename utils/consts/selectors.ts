const NULL = "[drmaggot__null]";

export const Selectors: WebSelectors = {
    videoPlayer: {
        youtube: `#movie_player`,
        twitch: `[data-a-target="video-player"]`,
        kick: `#injected-embedded-channel-player-video`,
        openrec: `.Component__VideoWrapper-sc-1x94c9l-6`,
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
            youtube: `yt-live-chat-text-message-renderer`,
            twitch: `[data-a-target="chat-line-message"], .video-chat__message-list-wrapper li`,
            kick: `#chatroom-messages > div.no-scrollbar > div[data-index]`,
            openrec: `.ChatList__CellContainer-sc-69ljpb-1`,
            twicas: `.tw-comment-item`,
        },
        quickBlockAnchor: {
            youtube: `#menu`,
            twitch: `.chat-line__icons, div.vod-message`,
            kick: `.group`,
            openrec: `.ChatCell__Cell-sc-1ey02g1-4`,
            twicas: `.tw-comment-item-dropdown`,
        },
        contents: {
            youtube: `#message`,
            twitch: `[data-a-target="chat-line-message-body"], .video-chat__message > span[class=""]`,
            kick: `.font-normal`,
            openrec: `.chat-content`,
            twicas: `.tw-comment-item-comment`,
        },
        userName: {
            youtube: `#author-name`,
            twitch: `[data-a-user]`,
            kick: `button[class="inline font-bold"]`,
            openrec: `.UserName__Name-sc-1i0rd20-1`,
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
            twitch: `.chat-line__message--emote-button`,
            kick: `[data-emote-id][data-emote-name]`,
            openrec: `.ChatCell__StampContainer-sc-1ey02g1-7`,
            twicas: `${NULL}`,
        },
    },
};
