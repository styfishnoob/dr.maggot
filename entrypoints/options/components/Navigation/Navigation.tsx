import NavigationLink from "./NavigationLink";

import bell from "@/assets/icons/bell.svg";
import book from "@/assets/icons/book.svg";
import code from "@/assets/icons/code.svg";
import gem from "@/assets/icons/gem.svg";
import megaphone from "@/assets/icons/megaphone.svg";
import monitor from "@/assets/icons/monitor.svg";
import other from "@/assets/icons/other.svg";
import robot from "@/assets/icons/robot.svg";
import users from "@/assets/icons/users.svg";

import odaibako from "@/assets/link_icons/odaibako.png";
import webstore from "@/assets/link_icons/webstore.svg";
import github from "@/assets/link_icons/github.svg";

const SettingsLinks: React.ComponentProps<typeof NavigationLink>[] = [
    {
        to: "/",
        title: `${browser.i18n.getMessage("navigation_display")}`,
        imgSrc: monitor,
        gradationKey: "green",
    },
    {
        to: "/filter",
        title: `${browser.i18n.getMessage("navigation_filter")}`,
        imgSrc: robot,
        gradationKey: "blue",
    },
    {
        to: "/danmaku",
        title: `${browser.i18n.getMessage("navigation_danmaku")}`,
        imgSrc: megaphone,
        gradationKey: "amber",
    },
    {
        to: "/other",
        title: `${browser.i18n.getMessage("navigation_other")}`,
        imgSrc: other,
        gradationKey: "gray",
    },
];

const BlocklistLinks: React.ComponentProps<typeof NavigationLink>[] = [
    {
        to: "/blocklist-word",
        title: `${browser.i18n.getMessage("navigation_blockedWords")}`,
        imgSrc: book,
        gradationKey: "red",
    },
    {
        to: "/blocklist-user",
        title: `${browser.i18n.getMessage("navigation_blockedUsers")}`,
        imgSrc: users,
        gradationKey: "red",
    },
    {
        to: "/blocklist-emote",
        title: `${browser.i18n.getMessage("navigation_blockedEmotes")}`,
        imgSrc: gem,
        gradationKey: "red",
    },
];

const OtherLinks: React.ComponentProps<typeof NavigationLink>[] = [
    {
        to: "/notice",
        title: `${browser.i18n.getMessage("navigation_notice")}`,
        imgSrc: bell,
        gradationKey: "slate",
    },
    {
        to: "/command-list",
        title: `${browser.i18n.getMessage("navigation_commandList")}`,
        imgSrc: code,
        gradationKey: "slate",
    },
    {
        external: true,
        to: "https://odaibako.net/u/styfish",
        title: "odaibako",
        imgSrc: odaibako,
        gradationKey: "slate",
    },
    {
        external: true,
        to: "https://chromewebstore.google.com/detail/drmaggot/lohndmdifcjjclnedjmljpmdjmfpbnai",
        title: "web store",
        imgSrc: webstore,
        gradationKey: "slate",
    },
    {
        external: true,
        to: "https://github.com/styfishnoob/dr.maggot",
        title: "Github",
        imgSrc: github,
        gradationKey: "black",
    },
];

export const Navigation = () => {
    return (
        <nav
            id="navigation"
            className="w-56 min-w-56 max-w-56 p-6 flex flex-col gap-3 bg-stone-100 border-e border-gray-200 dark:bg-neutral-900 dark:border-neutral-700"
        >
            <div aria-label="title" className="py-2">
                <span className="text-lg font-semibold">Dr.Maggot</span>
            </div>
            <div aria-label="settings-link">
                {SettingsLinks.map((prop, index) => (
                    <NavigationLink
                        key={index}
                        external={prop.external}
                        to={prop.to}
                        imgSrc={prop.imgSrc}
                        title={prop.title}
                        gradationKey={prop.gradationKey}
                    />
                ))}
            </div>
            <div aria-label="blocklist-link">
                {BlocklistLinks.map((prop, index) => (
                    <NavigationLink
                        key={index}
                        external={prop.external}
                        to={prop.to}
                        imgSrc={prop.imgSrc}
                        title={prop.title}
                        gradationKey={prop.gradationKey}
                    />
                ))}
            </div>
            <div aria-label="other-link">
                {OtherLinks.map((prop, index) => (
                    <NavigationLink
                        key={index}
                        external={prop.external}
                        to={prop.to}
                        imgSrc={prop.imgSrc}
                        title={prop.title}
                        gradationKey={prop.gradationKey}
                    />
                ))}
            </div>
        </nav>
    );
};

export default Navigation;
