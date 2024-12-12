import * as S from "./twitch/schema";
import { getPlatform } from "@/src/lib/get-platform";
import { DOMObserver } from "@/src/lib/dom-observer";
import { TwitchGql } from "./twitch/gql";
import { ChatFilter } from "../chat-filter/chat-filter";

(async function () {
    const platform = getPlatform();
    if (!platform || platform != "twitch") return;

    let requiredDays = 0;
    const manager = KVManagerList.filter;
    const gql = new TwitchGql();
    const chatFilter = new ChatFilter(platform);

    requiredDays = await manager.getItem<number>("requiredFollowDays");

    manager.observeItem("requiredFollowDays", async function () {
        requiredDays = await manager.getItem<number>("requiredFollowDays");
    });

    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: async function (cell) {
            if (requiredDays <= 0) return;

            const channelHref = document.querySelector<HTMLAnchorElement>(".metadata-layout__support a")?.href;
            const channelName = channelHref?.match(/https:\/\/www\.twitch\.tv\/([^\/]+)/)?.[1];
            const userName = cell.querySelector<HTMLElement>(Selectors.chat.userName[platform])?.dataset?.aUser;

            if (userName && channelName) {
                const userLogin = userName as S.UserLogin;
                const channelLogin = channelName as S.ChannelLogin;

                if (!gql.followDaysMaps.has(userLogin)) {
                    await gql.getUserFollowsByUserLogin(userLogin, channelLogin);
                }

                if (
                    !gql.hasFollowDays(userLogin, channelLogin, requiredDays) &&
                    gql.moderatorsMap.get(userLogin) !== channelLogin && // 投稿者がモデレーターの場合
                    userLogin !== channelLogin // 投稿者が配信者自身の場合
                ) {
                    chatFilter.deleteContents(cell);
                }
            }
        },
    });
})();
