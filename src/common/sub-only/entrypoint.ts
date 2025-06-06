import { CSSHandler } from "@/src/lib/css-handler";
import { getPlatform } from "@/src/lib/get-platform";
import { ContentScriptContext } from "#imports";

export default async function entrypoint(ctx: ContentScriptContext) {
    const platform = getPlatform();
    if (!platform) return;

    const inline_SubOnly = await import(`./css/${platform}.css?inline`);
    const inline_Stripe = await import(`./css/stripe/${platform}.css?inline`);

    const ch_SubOnly = CSSHandler("subOnly", inline_SubOnly.default);
    const ch_Stripe = CSSHandler("stripe_subOnly", inline_Stripe.default);

    const fm = KVManagerList.filter;
    const dm = KVManagerList.display;

    const subOnly = await fm.getItem<PlatformRecord<boolean>>("subOnly");
    const stripe = await dm.getItem<PlatformRecord<boolean>>("stripe");
    const stripeColor = await dm.getItem<string>("stripeColor");

    if (subOnly[platform]) ch_SubOnly.add();
    if (subOnly[platform] && stripe[platform]) ch_Stripe.add();

    document.documentElement.style.setProperty(`--drmaggot__subOnlyStripeColor`, `${stripeColor}`);

    fm.observeItem("subOnly", async () => {
        const subOnly = await fm.getItem<PlatformRecord<boolean>>("subOnly");
        const stripe = await dm.getItem<PlatformRecord<boolean>>("stripe");
        ch_SubOnly.check(subOnly[platform]);
        if (!subOnly[platform] || !stripe[platform]) ch_Stripe.rm();
        if (subOnly[platform] && stripe[platform]) ch_Stripe.add();
    });

    dm.observeItem("stripe", async () => {
        const subOnly = await fm.getItem<PlatformRecord<boolean>>("subOnly");
        const stripe = await dm.getItem<PlatformRecord<boolean>>("stripe");
        if (subOnly[platform] && stripe[platform]) ch_Stripe.add();
        else ch_Stripe.rm();
    });

    dm.observeItem("stripeColor", async () => {
        const stripeColor = await dm.getItem<string>("stripeColor");
        document.documentElement.style.setProperty(`--drmaggot__subOnlyStripeColor`, `${stripeColor}`);
    });
}
