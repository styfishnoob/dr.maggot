import { KVManager } from "@/src/lib/kv-manager";
import InputNumber from "../InputNumber/InputNumber";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, Limiter>;
    limiterKey: keyof Limiter;
    min?: number;
    max?: number;
    style?: string;
    unit: string;
};

const InputLimiterWithUnit = <T extends KeyValue>(props: Props<T>) => {
    const manager = new KVManager<T>(props.storageKey);
    const [limiter, setLimiter] = useState<Limiter>({ less: 0, more: 0 });

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<Limiter>(props.itemKey);
            setLimiter(item);
        })();
    }, []);

    function update(value: number) {
        const updated = { ...limiter, [props.limiterKey]: value };
        setLimiter(updated);
        manager.setItem<Limiter>(props.itemKey, updated);
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        if (event.target.value === "") {
            update(0);
        }
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        const num = Number(event.target.value);
        const min = props.min ?? 0;
        const max = props.max ?? 500;

        if (val === "") setLimiter({ ...limiter, [props.limiterKey]: val });
        else update(Math.max(min, Math.min(num, max)));
    }

    return (
        <div className="flex">
            <InputNumber
                style={`${props.style} rounded-e-none`}
                value={limiter[props.limiterKey]}
                onBlur={onBlur}
                onChange={onChange}
            />
            <div className="flex items-center justify-center py-2 w-[36px] rounded-e-md border border-s-0 border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700">
                <span>{props.unit}</span>
            </div>
        </div>
    );
};

export default InputLimiterWithUnit;
