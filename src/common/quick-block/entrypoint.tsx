import ReactDOM from "react-dom/client";
import QuickBlock from "./quick-block";
import { DOMObserver } from "@/src/lib/dom-observer";
import { getPlatform } from "@/src/lib/get-platform";

(function () {
    const platform = getPlatform();
    if (!platform) return;

    setListenerBlockEmoteContextMenu(platform);

    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: function (chatList) {
            mountQuickblock(platform, chatList);
        },
    });
})();

function setListenerBlockEmoteContextMenu(platform: Platforms) {
    let emote: EventTarget | null = null;

    document.addEventListener("contextmenu", function (event) {
        emote = event.target;
    });

    browser.runtime.onMessage.addListener(function (message) {
        if (
            emote &&
            emote instanceof HTMLImageElement &&
            message.type === MessageType.ContextMenu.BlockEmote
        ) {
            const container = document.querySelector(Selectors.chat.container[platform]);
            if (container?.contains(emote)) {
                return Promise.resolve({
                    platform: platform,
                    alt: emote.alt,
                });
            }
        }
    });
}

function mountQuickblock(platform: Platforms, e: HTMLElement) {
    (async () => {
        const manager = KVManagerList.other;
        const quickBlock = await manager.getItem<PlatformStateRecord>("quickBlock");
        if (!quickBlock[platform]) return;

        const user = e.querySelector<HTMLElement>(Selectors.chat.userName[platform]);
        const anchor = e.querySelector<HTMLElement>(Selectors.chat.quickBlockAnchor[platform]);
        const btns = e.querySelectorAll("[drmaggot]");
        const username = user?.textContent;
        if (!anchor || !user || !user.textContent || !username) return;
        btns.forEach((btn) => btn.remove());

        const container = document.createElement("div");
        const root = ReactDOM.createRoot(container);
        container.setAttribute("drmaggot", "");
        root.render(<QuickBlock element={e} user={username} platform={platform} />);
        anchor.append(container);
    })();
}
