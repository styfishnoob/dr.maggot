import PlatformCheckboxes from "@/entrypoints/features/PlatformCheckboxes/PlatformCheckboxes";
import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";
import Settings from "../components/Settings/Settings";
import SettingsCard from "../components/Settings/SettingsCard";

const settingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("other_quickBlock")}`,
        description: `${browser.i18n.getMessage("other_quickBlock_description")}`,
        feature: <PlatformCheckboxes<Other> storageKey="Other" itemKey="quickBlock" />,
    },
    {
        title: `${browser.i18n.getMessage("other_autoBonus")}`,
        description: `${browser.i18n.getMessage("other_autoBonus_description")}`,
        feature: (
            <PlatformCheckboxes<Other>
                storageKey="Other"
                itemKey="autoBonus"
                disabled={["youtube", "kick", "openrec", "twicas"]}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("other_countdown")}`,
        description: `${browser.i18n.getMessage("other_countdown_description")}`,
        feature: (
            <PlatformCheckboxes<Other>
                storageKey="Other"
                itemKey="countdown"
                disabled={["youtube", "kick", "openrec", "twicas"]}
            />
        ),
    },
];

const Other = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("menu_other")}>
                <Settings settingsCards={settingsCards} />
            </Dashboard>
        </Main>
    );
};

export default Other;
