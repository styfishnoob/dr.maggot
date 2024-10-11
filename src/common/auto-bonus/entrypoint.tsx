import ReactDOM from "react-dom/client";
import Countdown from "./countdown";
import { getPlatform } from "@/src/lib/get-platform";

(function () {
    const platform = getPlatform();
    if (platform !== "twitch") return;

    new ContentScriptContext("auto-bonus").setInterval(async function () {
        const manager = KVManagerList.other;
        const summary = document.querySelector<HTMLElement>(
            `[data-test-selector="community-points-summary"]`
        );
        const bonus = summary?.querySelector<HTMLElement>(
            `button[class*="ScCoreButton"]:has(+ div[role="tooltip"])`
        );
        const autobonus = await manager.getItem<PlatformStateRecord>("autoBonus");
        const countdown = await manager.getItem<PlatformStateRecord>("countdown");
        if (bonus && autobonus.twitch) {
            bonus.click();
            if (summary && countdown.twitch) {
                mount_countdown(summary);
            }
        }
    }, 1000);
})();

function mount_countdown(summary: HTMLElement) {
    const ctx = new ContentScriptContext("countdown");
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
