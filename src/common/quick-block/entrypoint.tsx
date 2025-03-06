import ReactDOM from "react-dom/client";
import QuickBlock from "./quick-block";
import { DOMObserver } from "@/src/lib/dom-observer";
import { getPlatform } from "@/src/lib/get-platform";

(function () {
    const platform = getPlatform();
    if (!platform) return;

    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: function (cell) {
            mountQuickblock(platform, cell);
        },
    });
})();

function mountQuickblock(platform: Platforms, e: HTMLElement) {
    (async () => {
        const manager = KVManagerList.other;
        const quickBlock = await manager.getItem<PlatformRecord<boolean>>("quickBlock");
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
