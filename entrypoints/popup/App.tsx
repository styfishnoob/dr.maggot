import { useState } from "react";
import { AllPlatforms } from "@/utils";

import Button from "../features/Button/Button";
import InputLimit from "../features/InputLimit/InputLimit";
import InputText from "../features/InputText/InputText";
import PlatformCheckboxList from "../features/PlatformCheckbox/PlatformCheckbox";
import PlatformSelect from "../options/components/PlatformSelect/PlatformSelect";

type SettingsCardProp = {
    name: string;
    feature: JSX.Element;
};

const SettingsCard = (props: SettingsCardProp) => {
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
    const [wordAllPlatform, setWordAllPlatform] = useState<AllPlatforms>("all");
    const [emoteAllPlatform, setEmoteAllPlatform] = useState<AllPlatforms>("all");
    const wordManager = MapManagerList.word;
    const emoteManager = MapManagerList.emote;

    function onSelectChange(
        e: React.ChangeEvent<HTMLSelectElement>,
        setAllPlatform: React.Dispatch<React.SetStateAction<AllPlatforms>>
    ) {
        const value = e.target.value as AllPlatforms;
        setAllPlatform(value);
    }

    function onEnter(
        value: string,
        manager: (typeof MapManagerList)[keyof typeof MapManagerList],
        allPlatform: AllPlatforms
    ) {
        (async function () {
            if (value === "") return;
            await manager.set(allPlatform, value, {
                value: value,
                active: true,
            });
        })();
    }

    const SettingsCardProps: SettingsCardProp[] = [
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
            name: `${browser.i18n.getMessage("popup_charLimit")}`,
            feature: <InputLimit<Filter> storageKey="Filter" itemKey="charLimit" />,
        },
        {
            name: `${browser.i18n.getMessage("popup_emoteLimit")}`,
            feature: <InputLimit<Filter> storageKey="Filter" itemKey="emoteLimit" />,
        },
        {
            name: `${browser.i18n.getMessage("popup_blockedWords")}`,
            feature: (
                <div className="flex gap-2">
                    <PlatformSelect
                        defaultValue={"all"}
                        onChange={(e) => onSelectChange(e, setWordAllPlatform)}
                    />
                    <InputText
                        staticPlaceholder={""}
                        style={"max-w-[253px]"}
                        onEnter={(v) => onEnter(v, wordManager, wordAllPlatform)}
                    />
                </div>
            ),
        },
        {
            name: `${browser.i18n.getMessage("popup_blockedEmotes")}`,
            feature: (
                <div className="flex gap-2">
                    <PlatformSelect
                        defaultValue={"all"}
                        onChange={(e) => onSelectChange(e, setEmoteAllPlatform)}
                    />
                    <InputText
                        staticPlaceholder={""}
                        style={"max-w-[253px]"}
                        onEnter={(v) => onEnter(v, emoteManager, emoteAllPlatform)}
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
            {SettingsCardProps.map((card, key) => (
                <SettingsCard key={key} name={card.name} feature={card.feature} />
            ))}
            <div className="p-1">
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
