import { DOMObserver } from "@/src/lib/dom-observer";
import { Turret } from "./turret";
import { CSSHandler } from "@/src/lib/css-handler";
import { getPlatform } from "@/src/lib/get-platform";

(function () {
    const platform = getPlatform();
    if (!platform) return;

    cleanCanvas();
    const ctx = new ContentScriptContext("danmaku");
    const origin = document.documentElement;
    const parent = window.parent.document.documentElement;
    const player_origin = document.querySelector<HTMLElement>(Selectors.videoPlayer[platform]);
    const player_parent = window.parent.document.documentElement.querySelector<HTMLElement>(
        Selectors.videoPlayer[platform]
    );

    ctx.addEventListener(window, "wxt:locationchange", function () {
        cleanCanvas();
    });

    (async () => {
        const inline = await import("./danmaku.css?inline");
        const handler = CSSHandler("danmaku", inline.default);
        handler.add();
    })();

    if (player_origin) {
        const canvas = mountCanvas(origin, player_origin);
        setTurret(origin, platform, canvas);
        return;
    }

    if (player_parent) {
        const canvas = mountCanvas(parent, player_parent);
        setTurret(parent, platform, canvas);
        return;
    }

    const obs_origin = new DOMObserver(origin);
    const obs_parent = new DOMObserver(parent);

    obs_origin.add.added(Selectors.videoPlayer[platform], {
        main: function (player) {
            const canvas = mountCanvas(origin, player);
            setTurret(origin, platform, canvas);
            obs_origin.stop();
            obs_parent.stop();
        },
    });

    obs_parent.add.added(Selectors.videoPlayer[platform], {
        main: function (player) {
            const canvas = mountCanvas(parent, player);
            setTurret(parent, platform, canvas);
            obs_origin.stop();
            obs_parent.stop();
        },
    });
})();

function cleanCanvas() {
    const id = "drmaggot__danmaku-canvas";
    const originCanvas = document.querySelector<HTMLElement>(`#${id}`);
    const parentCanvas = window.parent.document.querySelector<HTMLElement>(`#${id}`);
    while (originCanvas?.firstChild) originCanvas.firstChild.remove();
    while (parentCanvas?.firstChild) parentCanvas.firstChild.remove();
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
