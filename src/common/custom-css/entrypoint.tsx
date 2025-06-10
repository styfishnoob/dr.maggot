import { CSSHandler } from "@/src/lib/css-handler";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "#imports";
import ReactDOM from "react-dom/client";
import FullScreenButton from "./css/fullscreen/FullScreenButton";

type CustomProperty = [keyof Display, string];

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    if (!platform) return;

    const manager = KVManagerList.display;
    const CSSNameList: (keyof Display)[] = ["break", "font", "hideName", "stripe", "unifyName"];
    const CustomProperties: CustomProperty[] = [
        ["font", ""],
        ["fontSize", "px"],
        ["stripeColor", ""],
        ["unifyNameValue", ""],
    ];

    CSSNameList.forEach(async (cssName) => {
        const inline = await import(`./css/${cssName}/${platform}.css?inline`);
        const handler = CSSHandler(cssName, inline.default);

        const update = async () => {
            const settings = await manager.get();
            const property = settings[cssName];
            if (property instanceof Object) handler.check(property[platform]);
            else handler.add();
        };

        update();
        manager.observeItem(cssName, () => update());
    });

    CustomProperties.forEach(async (customProperty) => {
        const update = async () => {
            const settings = await manager.get();
            const property = settings[customProperty[0]];

            if (customProperty[0] === "unifyNameValue") {
                document.documentElement.style.setProperty(
                    `--drmaggot__${customProperty[0]}`,
                    `"${property}"${customProperty[1]}`
                );
                window.parent.document.documentElement.style.setProperty(
                    `--drmaggot__${customProperty[0]}`,
                    `"${property}"${customProperty[1]}`
                );
            } else {
                document.documentElement.style.setProperty(
                    `--drmaggot__${customProperty[0]}`,
                    `${property + customProperty[1]}`
                );
                window.parent.document.documentElement.style.setProperty(
                    `--drmaggot__${customProperty[0]}`,
                    `${property + customProperty[1]}`
                );
            }
        };

        update();
        manager.observeItem(customProperty[0], () => update());
    });

    (async function () {
        const setFullScreenButton = () => {
            if (platform !== "twitch") return;

            const controlGroup = document.querySelector(".player-controls__right-control-group");
            const fullScreenButtons = document.querySelectorAll("#drmaggot__fullscreen-button");
            if (!controlGroup) return;
            if (fullScreenButtons) fullScreenButtons.forEach((button) => button.remove());

            const fullScreenButton = createIntegratedUi(ctx, {
                position: "inline",
                anchor: controlGroup,
                onMount: (container) => {
                    const root = ReactDOM.createRoot(container);
                    root.render(<FullScreenButton />);
                    return root;
                },
                onRemove: (root) => {
                    root?.unmount();
                },
            });

            fullScreenButton.mount();
        };

        setFullScreenButton();
        ctx.addEventListener(window, "wxt:locationchange", function () {
            setFullScreenButton();
        });
    })();
}
