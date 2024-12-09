import PlatformCheckboxes from "@/entrypoints/features/PlatformCheckboxes/PlatformCheckboxes";
import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";
import Settings from "../components/Settings/Settings";
import SettingsCard from "../components/Settings/SettingsCard";
import InputTextWithDynamicPlaceholder from "@/entrypoints/features/InputTextWithDynamicPlaceholer/InputTextWithDynamicPlaceholder";
import InputNumberWithUnit from "@/entrypoints/features/InputNumberWithUnit/InputNumberWithUnit";

const settingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("danmaku_danmaku")}`,
        description: `${browser.i18n.getMessage("danmaku_danmaku_description")}`,
        feature: <PlatformCheckboxes<Danmaku> storageKey="Danmaku" itemKey="danmaku" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_font")}`,
        description: `${browser.i18n.getMessage("danmaku_font_description")}`,
        feature: <InputTextWithDynamicPlaceholder<Danmaku> storageKey="Danmaku" itemKey="font" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_fontSize")}`,
        description: `${browser.i18n.getMessage("danmaku_fontSize_description")}`,
        feature: <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="fontSize" unit="px" style="w-[65px]" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_opacity")}`,
        description: `${browser.i18n.getMessage("danmaku_opacity_description")}`,
        feature: <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="opacity" unit="%" style="w-[65px]" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_time")}`,
        description: `${browser.i18n.getMessage("danmaku_time_description")}`,
        feature: <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="time" unit="sec" style="w-[65px]" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_limit")}`,
        description: `${browser.i18n.getMessage("danmaku_limit_description")}`,
        feature: <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="limit" unit="item" style="w-[65px]" />,
    },
];

const Danmaku = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("menu_danmaku")}>
                <Settings settingsCards={settingsCards} />
            </Dashboard>
        </Main>
    );
};

export default Danmaku;
