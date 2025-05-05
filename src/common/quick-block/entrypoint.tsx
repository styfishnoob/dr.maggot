import ReactDOM from "react-dom/client";
import QuickBlock from "./quick-block";
import { DOMObserver } from "@/src/lib/dom-observer";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "wxt/client";

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    if (!platform) return;

    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: async function (cell) {
            const manager = KVManagerList.other;
            const quickBlock = await manager.getItem<PlatformRecord<boolean>>("quickBlock");
            if (!quickBlock[platform]) return;

            const user = cell.querySelector<HTMLElement>(Selectors.chat.userName[platform]);
            const anchor = cell.querySelector<HTMLElement>(Selectors.chat.quickBlockAnchor[platform]);
            const btns = cell.querySelectorAll("[data-wxt-integrated]");
            const username = user?.textContent;
            if (!anchor || !user || !user.textContent || !username) return;

            btns.forEach((btn) => btn.remove());
            const btn = createIntegratedUi(ctx, {
                position: "inline",
                anchor: anchor,
                onMount: (container) => {
                    const root = ReactDOM.createRoot(container);
                    root.render(<QuickBlock element={cell} user={username} platform={platform} />);
                    return root;
                },
                onRemove: (root) => {
                    root?.unmount();
                },
            });

            btn.mount();
        },
    });
}
