import { DOMObserver } from "@/src/lib/dom-observer";
import { Turret } from "./turret";
import { CSSHandler } from "@/src/lib/css-handler";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "#imports";

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    clearCanvas(platform);
    if (!platform) return;

    let doc = document.documentElement;
    let player = document.querySelector<HTMLElement>(Selectors.videoPlayer[platform]);

    // youtubeは動画プレイヤーがiframe内にあるため、親のdocumentを取得する
    if (platform === "youtube") {
        doc = window.parent.document.documentElement;
        player = window.parent.document.documentElement.querySelector<HTMLElement>(Selectors.videoPlayer[platform]);
    }

    (async () => {
        const inline = await import("./danmaku.css?inline");
        const handler = CSSHandler("danmaku", inline.default);
        handler.add();
    })();

    if (player) {
        const canvas = mountCanvas(doc, player);
        setTurret(doc, platform, canvas);
        return;
    }

    const obs_doc = new DOMObserver(doc);

    obs_doc.add.added(Selectors.videoPlayer[platform], {
        main: function (_player) {
            const canvas = mountCanvas(doc, _player);
            setTurret(doc, platform, canvas);
            obs_doc.stop();
        },
    });

    ctx.addEventListener(window, "wxt:locationchange", () => {
        clearCanvas(platform);
    });
}

function clearCanvas(platform: Platforms | undefined) {
    const id = "drmaggot__danmaku-canvas";
    const originCanvas = document.querySelector<HTMLElement>(`#${id}`);
    while (originCanvas?.firstChild) originCanvas.firstChild.remove();

    if (platform === "youtube") {
        const parentCanvas = window.parent.document.querySelector<HTMLElement>(`#${id}`);
        while (parentCanvas?.firstChild) parentCanvas.firstChild.remove();
    }
}

function mountCanvas(root: HTMLElement, player: HTMLElement): HTMLElement {
    const id = "drmaggot__danmaku-canvas";
    const canvases = root.querySelectorAll<HTMLElement>(`#${id}`);
    const canvas = document.createElement("div");
    canvas.id = id;
    if (canvases[0]) {
        return canvases[0];
    } else {
        player.append(canvas);
        return canvas;
    }
}

function setTurret(root: HTMLElement, platform: Platforms, canvas: HTMLElement) {
    const turret = new Turret(platform, canvas);

    new DOMObserver().add.added(Selectors.chat.cell[platform], {
        main: function (cell) {
            turret.load(cell);
        },
        stop: function () {
            turret.unwatch();
        },
    });

    new DOMObserver(root).add.added(Selectors.videoPlayer[platform], {
        main: function (player) {
            const canvas = mountCanvas(root, player);
            turret.canvas = canvas;
        },
    });
}
