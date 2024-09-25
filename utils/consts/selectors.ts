const NULL = "[drmaggot__null]";

export const Selectors: PlatformSelectors = {
    videoPlayer: {
        youtube: `#movie_player`,
        twitch: `[data-a-target="video-player"]`,
        openrec: `.Component__VideoWrapper-sc-1x94c9l-6`,
        twicas: `.tw-player`,
    },
    chat: {
        container: {
            youtube: `#items`,
            twitch: `[data-test-selector="chat-scrollable-area__message-container"]`,
            openrec: `.chat-list-content`,
            twicas: `.tw-comment-list-view__scroller > div`,
        },
        cell: {
            youtube: `yt-live-chat-text-message-renderer`,
            twitch: `[data-a-target="chat-line-message"], .video-chat__message-list-wrapper li`,
            openrec: `.ChatList__CellContainer-sc-69ljpb-1`,
            twicas: `.tw-comment-item`,
        },
        quickBlockAnchor: {
            youtube: `#menu`,
            twitch: `.chat-line__icons, .video-chat__message-menu`,
            openrec: `.ChatCell__Cell-sc-1ey02g1-4`,
            twicas: `.tw-comment-item-dropdown`,
        },
        contents: {
            youtube: `#message`,
            twitch: `[data-a-target="chat-line-message-body"], .video-chat__message > span[class=""]`,
            openrec: `.chat-content`,
            twicas: `.tw-comment-item-comment`,
        },
        userName: {
            youtube: `#author-name`,
            twitch: `[data-a-user]`,
            openrec: `.UserName__Name-sc-1i0rd20-1`,
            twicas: `.tw-comment-item-name`,
        },
        messages: {
            youtube: `#message`,
            twitch: `.text-fragment`,
            openrec: `.chat-content`,
            twicas: `.tw-comment-item-comment > span`,
        },

        emotes: {
            youtube: `.emoji`,
            twitch: `.chat-line__message--emote`,
            openrec: `.ChatCell__StampContainer-sc-1ey02g1-7`,
            twicas: `${NULL}`,
        },

        twitchBonus: {
            youtube: `${NULL}`,
            twitch: `[data-test-selector="community-points-summary"]`,
            openrec: `${NULL}`,
            twicas: `${NULL}`,
        },
    },
};
