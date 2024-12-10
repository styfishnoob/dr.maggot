import { KVManager } from "@/src/lib/kv-manager";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, string>;
    allowEmpty?: boolean;
    style?: string;
};

const PLACEHOLDER_HEADER = browser.i18n.getMessage("input_text_currentValue");

const InputTextWithDynamicPlaceholder = <T extends KeyValue>(props: Props<T>) => {
    const [value, setValue] = useState<string>("");
    const [placeholder, setPlaceholder] = useState<string>(`${PLACEHOLDER_HEADER}: ${value}`);
    const manager = new KVManager<T>(props.storageKey);

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<string>(props.itemKey);
            if (item === "") {
                setPlaceholder(`${PLACEHOLDER_HEADER}: DEFAULT`);
            } else {
                setPlaceholder(`${PLACEHOLDER_HEADER}: ${item}`);
            }
        })();
    }, []);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.currentTarget.value);
    }

    function onKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
        const val = event.currentTarget.value;
        const isComposing = event.nativeEvent.isComposing; // 予測変換中とかだったらtrue

        if (event.key === "Enter" && !isComposing) {
            if (props.allowEmpty && val === "") {
                manager.setItem(props.itemKey, val);
                setValue("");
                setPlaceholder(`${PLACEHOLDER_HEADER}: DEFAULT`);
            }

            if (val !== "") {
                manager.setItem(props.itemKey, val);
                setValue("");
                setPlaceholder(`${PLACEHOLDER_HEADER}: ${val}`);
            }
        }
    }

    return (
        <input
            type="text"
            className={`${props.style} block w-[300px] rounded-md border-gray-200 px-1.8 py-1.8 text-xs text-black focus:border-blue-900 focus:ring-blue-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeydown}
        />
    );
};

export default InputTextWithDynamicPlaceholder;
