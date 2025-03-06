import Button from "../features/Button/Button";
import InputLimitersWithUnit from "../features/InputLimitersWithUnit/InputLimitersWithUnit";
import InputText from "../features/InputText/InputText";
import PlatformCheckboxes from "../features/PlatformCheckboxes/PlatformCheckboxes";
import PlatformSelect from "../features/PlatformSelect/PlatformSelect";

type Prop = {
    title: string;
    feature: JSX.Element;
};

const SettingsCard = (props: Prop) => {
    return (
        <div className="-mt-px flex p-1">
            <div className="flex flex-col justify-center">
                <span>{props.title}</span>
            </div>
            <div className="ml-auto">{props.feature}</div>
        </div>
    );
};

const App = () => {
    const wordManager = MapManagerList.word;
    const emoteManager = MapManagerList.emote;
    const [wordPlatform, setWordPlatform] = useState<AllPlatforms>("all");
    const [emotePlatform, setEmotePlatform] = useState<AllPlatforms>("all");
    const [InputBlockWordValue, setInputBlockWordValue] = useState<string>("");
    const [InputBlockEmoteValue, setInputBlockEmoteValue] = useState<string>("");

    function onSelectChange(
        e: React.ChangeEvent<HTMLSelectElement>,
        setAllPlatform: React.Dispatch<React.SetStateAction<AllPlatforms>>
    ) {
        const value = e.target.value as AllPlatforms;
        setAllPlatform(value);
    }

    function onInputTextEnter(
        event: React.KeyboardEvent<HTMLInputElement>,
        manager: (typeof MapManagerList)[keyof typeof MapManagerList],
        setInputValue: React.Dispatch<React.SetStateAction<string>>,
        platform: AllPlatforms
    ) {
        const value = event.currentTarget.value;
        const isComposing = event.nativeEvent.isComposing;

        if (event.key === "Enter" && !isComposing) {
            if (value !== "") {
                manager.set(platform, value, { value: value, active: true });
                setInputValue("");
            }
        }
    }

    const SettingsCards: Prop[] = [
        {
            title: `${browser.i18n.getMessage("filter_filter")}`,
            feature: <PlatformCheckboxes<Filter> storageKey="Filter" itemKey="filter" />,
        },
        {
            title: `${browser.i18n.getMessage("danmaku_danmaku")}`,
            feature: <PlatformCheckboxes<Danmaku> storageKey="Danmaku" itemKey="danmaku" />,
        },
        {
            title: `${browser.i18n.getMessage("popup_subOnly")}`,
            feature: <PlatformCheckboxes<Filter> storageKey="Filter" itemKey="subOnly" />,
        },
        {
            title: `${browser.i18n.getMessage("popup_charLimit")}`,
            feature: <InputLimitersWithUnit<Filter> storageKey="Filter" itemKey="charLimit" />,
        },
        {
            title: `${browser.i18n.getMessage("popup_emoteLimit")}`,
            feature: <InputLimitersWithUnit<Filter> storageKey="Filter" itemKey="emoteLimit" />,
        },
        {
            title: `${browser.i18n.getMessage("popup_blockedWords")}`,
            feature: (
                <div className="flex gap-2">
                    <PlatformSelect
                        defaultValue={"all"}
                        style="w-[95px]"
                        onChange={(e) => onSelectChange(e, setWordPlatform)}
                    />
                    <InputText
                        style={"w-[262px]"}
                        onChange={(e) => setInputBlockWordValue(e.target.value)}
                        onKeyDown={(e) => onInputTextEnter(e, wordManager, setInputBlockWordValue, wordPlatform)}
                        placeholder=""
                        value={InputBlockWordValue}
                    />
                </div>
            ),
        },
        {
            title: `${browser.i18n.getMessage("popup_blockedEmotes")}`,
            feature: (
                <div className="flex gap-2">
                    <PlatformSelect
                        defaultValue={"all"}
                        style="w-[95px]"
                        onChange={(e) => onSelectChange(e, setEmotePlatform)}
                    />
                    <InputText
                        style={"w-[262px]"}
                        onChange={(e) => setInputBlockEmoteValue(e.target.value)}
                        onKeyDown={(e) => onInputTextEnter(e, emoteManager, setInputBlockEmoteValue, emotePlatform)}
                        placeholder=""
                        value={InputBlockEmoteValue}
                    />
                </div>
            ),
        },
    ];

    return (
        <main className="flex flex-col gap-1 p-2 bg-white dark:bg-black text-black dark:text-white">
            <div className="flex justify-center text-lg font-bold">
                <span>{browser.i18n.getMessage("popup_title")}</span>
            </div>
            <div className="text-xs">
                {SettingsCards.map((card, key) => (
                    <SettingsCard key={key} title={card.title} feature={card.feature} />
                ))}
            </div>
            <div className="m-1">
                <Button
                    title={browser.i18n.getMessage("popup_button")}
                    style="w-full text-xs p-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => browser.runtime.openOptionsPage()}
                />
            </div>
        </main>
    );
};

export default App;
