import { useEffect, useState } from "react";

const PLACEHOLDER_HEADER = browser.i18n.getMessage("input_text_currentValue");

type Props = {
    style?: string;
    onEnter: (value: string) => void;
};

type StaticPlaceholder = Props & {
    staticPlaceholder: string;
    dynamicPlaceholder?: never;
    storageKey?: never;
    itemKey?: never;
};

type DynamicPlaceholder<T> = Props & {
    staticPlaceholder?: never;
    dynamicPlaceholder: boolean;
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, string>;
};

const InputText = <T,>({
    style,
    onEnter,
    staticPlaceholder,
    dynamicPlaceholder,
    storageKey,
    itemKey,
}: StaticPlaceholder | DynamicPlaceholder<T>) => {
    const [value, setValue] = useState<string>("");
    const [placeholder, setPlaceholder] = useState<string>(`${PLACEHOLDER_HEADER}: ${value}`);

    useEffect(() => {
        (async function () {
            if (dynamicPlaceholder) {
                const storage = await browser.storage.local.get(storageKey);
                const settings = storage[storageKey];
                const item = settings[itemKey] as string;
                if (item == "") setPlaceholder(`${PLACEHOLDER_HEADER}: DEFAULT`);
                else setPlaceholder(`${PLACEHOLDER_HEADER}: ${item}`);
            }
        })();
    });

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.currentTarget.value);
    }

    function onKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            onEnter(e.currentTarget.value);
            setValue("");
            setPlaceholder(`${PLACEHOLDER_HEADER}: ${e.currentTarget.value}`);
        }
    }

    return (
        <input
            type="text"
            className={`${
                style ? style : ""
            } block w-[300px] rounded-lg border-gray-200 px-1.8 py-1.8 text-xs text-black focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
            value={value}
            placeholder={dynamicPlaceholder ? placeholder : staticPlaceholder}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onKeydown(e)}
        />
    );
};

export default InputText;
