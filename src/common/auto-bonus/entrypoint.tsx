import ReactDOM from "react-dom/client";
import Countdown from "./countdown";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "wxt/client";

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    if (platform !== "twitch") return;

    ctx.setInterval(async function () {
        const manager = KVManagerList.other;
        const summary = document.querySelector<HTMLElement>(`[data-test-selector="community-points-summary"]`);
        const bonus = summary?.querySelector<HTMLElement>(`button[class*="ScCoreButton"]:has(+ div[role="tooltip"])`);
        const autobonus = await manager.getItem<PlatformRecord<boolean>>("autoBonus");
        const countdown = await manager.getItem<PlatformRecord<boolean>>("countdown");
        if (bonus && autobonus.twitch) {
            bonus.click();
            if (summary && countdown.twitch) {
                mount_countdown(ctx, summary);
            }
        }
    }, 1000);
}

function mount_countdown(ctx: ContentScriptContext, summary: HTMLElement) {
    const countdown = createIntegratedUi(ctx, {
        position: "inline",
        anchor: summary,
        onMount: (container) => {
            const root = ReactDOM.createRoot(container);
            root.render(<Countdown ctx={ctx} />);
            return root;
        },
        onRemove: (root) => {
            root?.unmount();
        },
    });
    countdown.mount();
}
