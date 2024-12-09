import { KVManager } from "@/src/lib/kv-manager";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, string>;
    style?: string;
};

const ColorPicker = <T extends KeyValue>(props: Props<T>) => {
    const [color, setColor] = useState<string>("#000000");
    const manager = new KVManager<T>(props.storageKey);

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<string>(props.itemKey);
            setColor(item);
        })();
    }, []);

    function onBlur(e: React.FocusEvent<HTMLInputElement, Element>) {
        setColor(e.target.value);
        manager.setItem<string>(props.itemKey, e.target.value);
    }

    return (
        <input
            type="color"
            className={`${props.style} rounded-md p-1 border border-gray-200 bg-white cursor-pointer dark:border-neutral-700 dark:bg-neutral-900`}
            defaultValue={color}
            onBlur={(e) => onBlur(e)}
        ></input>
    );
};

export default ColorPicker;
