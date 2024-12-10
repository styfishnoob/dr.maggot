import Main from "@/entrypoints/options/components/Main/Main";
import Navigation from "@/entrypoints/options/components/Navigation/Navigation";
import Dashboard from "@/entrypoints/options/components/Dashboard/Dashboard";
import Settings from "../components/Settings/Settings";
import SettingsCard from "../components/Settings/SettingsCard";
import PlatformCheckboxes from "@/entrypoints/features/PlatformCheckboxes/PlatformCheckboxes";
import InputNumberWithUnit from "@/entrypoints/features/InputNumberWithUnit/InputNumberWithUnit";
import ColorPicker from "@/entrypoints/features/ColorPicker/ColorPicker";
import InputTextWithDynamicPlaceholder from "@/entrypoints/features/InputTextWithDynamicPlaceholer/InputTextWithDynamicPlaceholder";

const settingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("display_hideName")}`,
        description: `${browser.i18n.getMessage("display_hideName_description")}`,
        feature: <PlatformCheckboxes<Display> storageKey="Display" itemKey="hideName" />,
    },
    {
        title: `${browser.i18n.getMessage("display_unifyName")}`,
        description: `${browser.i18n.getMessage("display_unifyName_description")}`,
        feature: <PlatformCheckboxes<Display> storageKey="Display" itemKey="unifyName" />,
    },
    {
        title: `${browser.i18n.getMessage("display_break")}`,
        description: `${browser.i18n.getMessage("display_break_description")}`,
        feature: <PlatformCheckboxes<Display> storageKey="Display" itemKey="break" />,
    },
    {
        title: `${browser.i18n.getMessage("display_stripe")}`,
        description: `${browser.i18n.getMessage("display_stripe_description")}`,
        feature: <PlatformCheckboxes<Display> storageKey="Display" itemKey="stripe" disabled={["openrec"]} />,
    },
    {
        title: `${browser.i18n.getMessage("display_stripeColor")}`,
        description: `${browser.i18n.getMessage("display_stripeColor_description")}`,
        feature: <ColorPicker<Display> storageKey="Display" itemKey="stripeColor" style="h-[35px] w-[100px]" />,
    },
    {
        title: `${browser.i18n.getMessage("display_unifyNameValue")}`,
        description: `${browser.i18n.getMessage("display_unifyNameValue_description")}`,
        feature: <InputTextWithDynamicPlaceholder<Display> storageKey="Display" itemKey="unifyNameValue" />,
    },
    {
        title: `${browser.i18n.getMessage("display_font")}`,
        description: `${browser.i18n.getMessage("display_font_description")}`,
        feature: <InputTextWithDynamicPlaceholder<Display> allowEmpty storageKey="Display" itemKey="font" />,
    },
    {
        title: `${browser.i18n.getMessage("display_fontSize")}`,
        description: `${browser.i18n.getMessage("display_fontSize_description")}`,
        feature: <InputNumberWithUnit<Display> storageKey="Display" itemKey="fontSize" unit="px" style="w-[65px]" />,
    },
];

const Display = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title={browser.i18n.getMessage("navigation_display")}>
                <Settings settingsCards={settingsCards} />
            </Dashboard>
        </Main>
    );
};

export default Display;
