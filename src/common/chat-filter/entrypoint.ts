import { getPlatform } from "@/src/lib/get-platform";
import { ChatFilter } from "./chat-filter";
import { DOMObserver } from "@/src/lib/dom-observer";
import { ContentScriptContext } from "#imports";

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    if (!platform) return;

    const cf = new ChatFilter(platform);
    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: function (cell) {
            cf.run(cell);
        },
        stop: function () {
            cf.unwatch();
        },
    });
}
