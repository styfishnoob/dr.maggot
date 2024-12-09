import { KVManager } from "@/src/lib/kv-manager";
import InputNumber from "../InputNumber/InputNumber";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, number>;
    min?: number;
    max?: number;
    style?: string;
    unit: string;
};

const InputNumberWithUnit = <T extends KeyValue>(props: Props<T>) => {
    const manager = new KVManager<T>(props.storageKey);
    const [value, setValue] = useState<number | "">(0);

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<number>(props.itemKey);
            setValue(item);
        })();
    }, []);

    function update(v: number) {
        setValue(v);
        manager.setItem<number>(props.itemKey, v);
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        if (event.target.value === "") {
            update(0);
        }
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        const num = Number(val);
        const min = props.min ?? 0;
        const max = props.max ?? 500;

        if (val === "") setValue("");
        else update(Math.max(min, Math.min(num, max)));
    }

    return (
        <div className="flex">
            <InputNumber style={`${props.style} rounded-e-none`} value={value} onBlur={onBlur} onChange={onChange} />
            <div className="flex items-center justify-center py-2 w-[36px] rounded-e-md border border-s-0 border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700">
                <span>{props.unit}</span>
            </div>
        </div>
    );
};

export default InputNumberWithUnit;
