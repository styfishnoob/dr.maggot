import Sidebar from "@/entrypoints/options/components/Sidebar/Sidebar";
import Main from "@/entrypoints/options/components/Main/Main";
import Topbar from "@/entrypoints/options/components/Topbar/Topbar";
import SettingsList from "@/entrypoints/options/components/SettingsList/SettingsList";
import SettingsCard from "@/entrypoints/options/components/SettingsCard/SettingsCard";
import PlatformCheckbox from "@/entrypoints/features/PlatformCheckbox/PlatformCheckbox";
import InputNumber from "@/entrypoints/features/InputNumber/InputNumber";
import InputText from "@/entrypoints/features/InputText/InputText";
import ColorPicker from "@/entrypoints/features/ColorPicker/ColorPicker";

function InputTextUnifyNameOnEnter(itemKey: KeysOfType<Display, string>, value: string) {
    if (value != "") {
        const manager = KVManagerList.display;
        manager.setItem<string>(itemKey, `"${value}"`);
    }
}

function InputTextFontOnEnter(itemKey: KeysOfType<Display, string>, value: string) {
    const manager = KVManagerList.display;
    manager.setItem<string>(itemKey, value);
}

const SettingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("display_hideName")}`,
        description: `${browser.i18n.getMessage("display_hideName_description")}`,
        children: <PlatformCheckbox<Display> storageKey="Display" itemKey="hideName" />,
    },
    {
        title: `${browser.i18n.getMessage("display_unifyName")}`,
        description: `${browser.i18n.getMessage("display_unifyName_description")}`,
        children: <PlatformCheckbox<Display> storageKey="Display" itemKey="unifyName" />,
    },
    {
        title: `${browser.i18n.getMessage("display_break")}`,
        description: `${browser.i18n.getMessage("display_break_description")}`,
        children: <PlatformCheckbox<Display> storageKey="Display" itemKey="break" />,
    },
    {
        title: `${browser.i18n.getMessage("display_stripe")}`,
        description: `${browser.i18n.getMessage("display_stripe_description")}`,
        children: (
            <PlatformCheckbox<Display>
                storageKey="Display"
                itemKey="stripe"
                disabled={{
                    youtube: false,
                    twitch: false,
                    kick: false,
                    openrec: true,
                    twicas: false,
                }}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("display_stripeColor")}`,
        description: `${browser.i18n.getMessage("display_stripeColor_description")}`,
        children: <ColorPicker<Display> storageKey="Display" itemKey="stripeColor" />,
    },
    {
        title: `${browser.i18n.getMessage("display_unifyNameValue")}`,
        description: `${browser.i18n.getMessage("display_unifyNameValue_description")}`,
        children: (
            <InputText<Display>
                dynamicPlaceholder={true}
                storageKey="Display"
                itemKey="unifyNameValue"
                onEnter={(v) => InputTextUnifyNameOnEnter("unifyNameValue", v)}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("display_font")}`,
        description: `${browser.i18n.getMessage("display_font_description")}`,
        children: (
            <InputText<Display>
                dynamicPlaceholder={true}
                storageKey="Display"
                itemKey="font"
                onEnter={(v) => InputTextFontOnEnter("font", v)}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("display_fontSize")}`,
        description: `${browser.i18n.getMessage("display_fontSize_description")}`,
        children: <InputNumber<Display> storageKey="Display" guide="px" itemKey="fontSize" />,
    },
];

const Display = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage("menu_display")} />
                <SettingsList>
                    {SettingsCards.map((item, index) => (
                        <SettingsCard key={index} title={item.title} description={item.description}>
                            {item.children}
                        </SettingsCard>
                    ))}
                </SettingsList>
            </Main>
        </main>
    );
};

export default Display;
