import { KVManager } from "@/src/lib/kv-manager";
import InputLimiterWithUnit from "./InputLimiterWithUnit";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, Limiter>;
    min?: number;
    max?: number;
};

const InputLimitersWithUnit = <T extends KeyValue>(props: Props<T>) => {
    const manager = new KVManager<T>(props.storageKey);
    const [lessValue, setLessValue] = useState<number | "">(0);
    const [moreValue, setMoreValue] = useState<number | "">(0);

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<Limiter>(props.itemKey);
            setLessValue(item.less);
            setMoreValue(item.more);
        })();
    }, []);

    function update(key: keyof Limiter, value: number) {
        (async function () {
            const item = await manager.getItem<Limiter>(props.itemKey);
            if (key === "less") setLessValue(value);
            if (key === "more") setMoreValue(value);
            item[key] = value;
            manager.setItem<Limiter>(props.itemKey, item);
        })();
    }

    function onBlur(key: keyof Limiter, event: React.FocusEvent<HTMLInputElement>) {
        if (event.target.value === "") {
            update(key, 0);
        }
    }

    function onChange(key: keyof Limiter, event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        const num = Number(event.target.value);
        const min = props.min ?? 0;
        const max = props.max ?? 500;

        if (val === "") {
            if (key === "less") setLessValue("");
            if (key === "more") setMoreValue("");
        } else {
            update(key, Math.max(min, Math.min(num, max)));
        }
    }

    return (
        <div className="flex gap-2.5">
            <InputLimiterWithUnit
                value={lessValue}
                unit="≧"
                style="w-[65px]"
                onBlur={(e) => onBlur("less", e)}
                onChange={(e) => onChange("less", e)}
            />
            <InputLimiterWithUnit
                value={moreValue}
                unit="≦"
                style="w-[65px]"
                onBlur={(e) => onBlur("more", e)}
                onChange={(e) => onChange("more", e)}
            />
        </div>
    );
};

export default InputLimitersWithUnit;
