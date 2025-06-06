import { CSSHandler } from "@/src/lib/css-handler";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "#imports";

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
}
