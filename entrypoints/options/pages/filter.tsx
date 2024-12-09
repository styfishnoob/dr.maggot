import PlatformCheckboxes from "@/entrypoints/features/PlatformCheckboxes/PlatformCheckboxes";
import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";
import Settings from "../components/Settings/Settings";
import SettingsCard from "../components/Settings/SettingsCard";
import InputLimitersWithUnit from "@/entrypoints/features/InputLimitersWithUnit/InputLimitersWithUnit";
import InputNumberWithUnit from "@/entrypoints/features/InputNumberWithUnit/InputNumberWithUnit";

const settingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("filter_filter")}`,
        description: `${browser.i18n.getMessage("filter_filter_description")}`,
        feature: <PlatformCheckboxes<Filter> storageKey="Filter" itemKey="filter" />,
    },
    {
        title: `${browser.i18n.getMessage("filter_subOnly")}`,
        description: `${browser.i18n.getMessage("filter_subOnly_description")}`,
        feature: <PlatformCheckboxes<Filter> storageKey="Filter" itemKey="subOnly" />,
    },
    {
        title: `${browser.i18n.getMessage("filter_range")}`,
        description: `${browser.i18n.getMessage("filter_range_description")}`,
        feature: <PlatformCheckboxes<Filter> storageKey="Filter" itemKey="range" />,
    },
    {
        title: `${browser.i18n.getMessage("filter_charLimit")}`,
        description: `${browser.i18n.getMessage("filter_charLimit_description")}`,
        feature: <InputLimitersWithUnit<Filter> storageKey="Filter" itemKey="charLimit" />,
    },
    {
        title: `${browser.i18n.getMessage("filter_emoteLimit")}`,
        description: `${browser.i18n.getMessage("filter_emoteLimit_description")}`,
        feature: <InputLimitersWithUnit<Filter> storageKey="Filter" itemKey="emoteLimit" />,
    },
    {
        title: `${browser.i18n.getMessage("filter_requiredFollowDays")}`,
        description: `${browser.i18n.getMessage("filter_requiredFollowDays_description")}`,
        feature: (
            <InputNumberWithUnit<Filter>
                storageKey="Filter"
                itemKey="requiredFollowDays"
                unit="days"
                min={0}
                max={10000}
                style="w-[75px]"
            />
        ),
    },
];

const Filter = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("menu_filter")}>
                <Settings settingsCards={settingsCards} />
            </Dashboard>
        </Main>
    );
};

export default Filter;
