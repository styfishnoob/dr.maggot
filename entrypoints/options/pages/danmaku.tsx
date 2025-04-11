import PlatformCheckboxes from "@/entrypoints/features/PlatformCheckboxes/PlatformCheckboxes";
import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";
import Settings from "../components/Settings/Settings";
import SettingsCard from "../components/Settings/SettingsCard";
import InputNumberWithUnit from "@/entrypoints/features/InputNumberWithUnit/InputNumberWithUnit";
import SelectFont from "@/entrypoints/features/SelectFont/SelectFont";

const settingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("danmaku_danmaku")}`,
        description: `${browser.i18n.getMessage("danmaku_danmaku_description")}`,
        feature: <PlatformCheckboxes<Danmaku> storageKey="Danmaku" itemKey="danmaku" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_decoration")}`,
        description: `${browser.i18n.getMessage("danmaku_decoration_description")}`,
        feature: <PlatformCheckboxes<Danmaku> storageKey="Danmaku" itemKey="decoration" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_font")}`,
        description: `${browser.i18n.getMessage("danmaku_font_description")}`,
        feature: <SelectFont<Danmaku> storageKey="Danmaku" itemKey="font" style="w-[200px]" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_fontSize")}`,
        description: `${browser.i18n.getMessage("danmaku_fontSize_description")}`,
        feature: (
            <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="fontSize" min={1} unit="px" style="w-[65px]" />
        ),
    },
    {
        title: `${browser.i18n.getMessage("danmaku_opacity")}`,
        description: `${browser.i18n.getMessage("danmaku_opacity_description")}`,
        feature: (
            <InputNumberWithUnit<Danmaku>
                storageKey="Danmaku"
                itemKey="opacity"
                min={0}
                max={100}
                unit="%"
                style="w-[65px]"
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("danmaku_time")}`,
        description: `${browser.i18n.getMessage("danmaku_time_description")}`,
        feature: (
            <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="time" min={1} unit="sec" style="w-[65px]" />
        ),
    },
    {
        title: `${browser.i18n.getMessage("danmaku_limit")}`,
        description: `${browser.i18n.getMessage("danmaku_limit_description")}`,
        feature: <InputNumberWithUnit<Danmaku> storageKey="Danmaku" itemKey="limit" unit="items" style="w-[65px]" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_displayRange")}`,
        description: `${browser.i18n.getMessage("danmaku_displayRange_description")}`,
        feature: (
            <InputNumberWithUnit<Danmaku>
                storageKey="Danmaku"
                itemKey="displayRange"
                step={10}
                min={10}
                max={100}
                unit="%"
                style="w-[65px]"
            />
        ),
    },
];

const Danmaku = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("navigation_danmaku")}>
                <Settings settingsCards={settingsCards} />
            </Dashboard>
        </Main>
    );
};

export default Danmaku;
