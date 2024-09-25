import Button from "../features/Button/Button";
import InputLimit from "../features/InputLimit/InputLimit";
import PlatformCheckboxList from "../features/PlatformCheckboxList/PlatformCheckboxList";

type SettingsCardProps = {
    name: string;
    feature: JSX.Element;
};

const SettingsCards: SettingsCardProps[] = [
    {
        name: `${browser.i18n.getMessage("filter_filter")}`,
        feature: <PlatformCheckboxList<Filter> storageKey="Filter" itemKey="filter" />,
    },
    {
        name: `${browser.i18n.getMessage("danmaku_danmaku")}`,
        feature: <PlatformCheckboxList<Danmaku> storageKey="Danmaku" itemKey="danmaku" />,
    },
    {
        name: `${browser.i18n.getMessage("popup_subOnly")}`,
        feature: <PlatformCheckboxList<Filter> storageKey="Filter" itemKey="subOnly" />,
    },
    {
        name: `${browser.i18n.getMessage("filter_charLimit")}`,
        feature: <InputLimit<Filter> storageKey="Filter" itemKey="charLimit" />,
    },
    {
        name: `${browser.i18n.getMessage("filter_emoteLimit")}`,
        feature: <InputLimit<Filter> storageKey="Filter" itemKey="emoteLimit" />,
    },
];

const SettingsCard = (props: SettingsCardProps) => {
    return (
        <div className="-mt-px flex p-1">
            <div className="flex flex-col justify-center">
                <span>{props.name}</span>
            </div>
            <div className="ml-auto">{props.feature}</div>
        </div>
    );
};

function App() {
    return (
        <main className="flex flex-col gap-1 p-2 bg-white dark:bg-black text-black dark:text-white">
            <div className="flex justify-center text-lg font-bold">
                <span>{browser.i18n.getMessage("popup_title")}</span>
            </div>
            {SettingsCards.map((card) => (
                <SettingsCard name={card.name} feature={card.feature} />
            ))}
            <div>
                <Button
                    title={browser.i18n.getMessage("popup_button")}
                    style="w-full"
                    onClick={() => browser.runtime.openOptionsPage()}
                />
            </div>
        </main>
    );
}

export default App;
