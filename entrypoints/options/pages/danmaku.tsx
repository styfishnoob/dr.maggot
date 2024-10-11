import Main from "@/entrypoints/options/components/Main/Main";
import Sidebar from "@/entrypoints/options/components/Sidebar/Sidebar";
import Topbar from "@/entrypoints/options/components/Topbar/Topbar";
import SettingsList from "@/entrypoints/options/components/SettingsList/SettingsList";
import SettingsCard from "@/entrypoints/options/components/SettingsCard/SettingsCard";
import PlatformCheckbox from "@/entrypoints/features/PlatformCheckbox/PlatformCheckbox";
import InputText from "@/entrypoints/features/InputText/InputText";
import InputNumber from "@/entrypoints/features/InputNumber/InputNumber";

function InputTextFontOnEnter(itemKey: KeysOfType<Danmaku, string>, value: string) {
    const manager = KVManagerList.danmaku;
    manager.setItem<string>(itemKey, value);
}

const SettingsCards: React.ComponentProps<typeof SettingsCard>[] = [
    {
        title: `${browser.i18n.getMessage("danmaku_danmaku")}`,
        description: `${browser.i18n.getMessage("danmaku_danmaku_description")}`,
        children: <PlatformCheckbox<Danmaku> storageKey="Danmaku" itemKey="danmaku" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_font")}`,
        description: `${browser.i18n.getMessage("danmaku_font_description")}`,
        children: (
            <InputText<Danmaku>
                dynamicPlaceholder={true}
                storageKey="Danmaku"
                itemKey="font"
                onEnter={(v) => InputTextFontOnEnter("font", v)}
            />
        ),
    },
    {
        title: `${browser.i18n.getMessage("danmaku_fontSize")}`,
        description: `${browser.i18n.getMessage("danmaku_fontSize_description")}`,
        children: <InputNumber<Danmaku> storageKey="Danmaku" itemKey="fontSize" guide="px" />,
    },
    {
        title: `${browser.i18n.getMessage("danmaku_opacity")}`,
        description: `${browser.i18n.getMessage("danmaku_opacity_description")}`,
        children: (
            <InputNumber<Danmaku> storageKey="Danmaku" itemKey="opacity" guide="%" max={100} />
        ),
    },
    {
        title: `${browser.i18n.getMessage("danmaku_speed")}`,
        description: `${browser.i18n.getMessage("danmaku_speed_description")}`,
        children: <InputNumber<Danmaku> storageKey="Danmaku" itemKey="speed" guide="sec" />,
    },
];

const Danmaku = () => {
    return (
        <main className="flex h-screen">
            <Sidebar />
            <Main>
                <Topbar title={browser.i18n.getMessage("menu_danmaku")} />
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

export default Danmaku;
