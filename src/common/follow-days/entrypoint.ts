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
            const channelHref = document.querySelector<HTMLAnchorElement>(".metadata-layout__support a")?.href;
            const channelLogin = channelHref?.match(/https:\/\/www\.twitch\.tv\/([^\/]+)/)?.[1];
            const userLogin = cell.querySelector<HTMLElement>(Selectors.chat.userName[platform])?.dataset?.aUser;

            if (userLogin && channelLogin && requiredDays > 0) {
                if (!gql.followDaysMaps.has(userLogin ?? "")) {
                    const followedDaysMap = await gql.getUserFollowsByUserLogin(userLogin);
                    gql.followDaysMaps.set(userLogin, followedDaysMap);
                }

                if (!gql.hasFollowDays(userLogin, channelLogin, requiredDays)) {
                    chatFilter.deleteContents(cell);
                }
            }
        },
    });
})();
