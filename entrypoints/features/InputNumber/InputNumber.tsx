import { useEffect, useState } from "react";
import { KVManager } from "@/src/lib/kv-manager";

type Props<T extends KeyValue> = {
    guide: string;
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, number>;
    min?: number;
    max?: number;
};

const InputNumber = <T extends KeyValue>(props: Props<T>) => {
    const [value, setValue] = useState<number>(0);
    const manager = new KVManager<T>(props.storageKey); //型の担保のためKVlistは使わない

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<number>(props.itemKey);
            setValue(item);
        })();
    }, []);

    function onBlur(e: React.ChangeEvent<HTMLInputElement>) {
        const v = Number(e.target.value);
        const min = props.min ? `${props.min}` : "0";
        const max = props.max ? `${props.max}` : "500";
        if (v <= Number(min)) e.target.value = min;
        if (v >= Number(max)) e.target.value = max;
        const num = Number(e.target.value);
        manager.setItem<number>(props.itemKey, num);
        setValue(num);
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const v = e.target.value;
        const num = Number(v);
        const min = props.min ? `${props.min}` : "0";
        const max = props.max ? `${props.max}` : "500";
        if (v != "") {
            if (num <= Number(min)) e.target.value = min;
            if (num >= Number(max)) e.target.value = max;
            manager.setItem<number>(props.itemKey, num);
        }
    }

    return (
        <div className="flex gap-2">
            <div className="flex">
                <input
                    type="number"
                    className="block w-[65px] rounded-lg rounded-e-none border-gray-200 px-1.5 py-1.5 text-xs focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    defaultValue={value}
                    key={value}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <div className="flex h-[30px] max-h-[30px] min-h-[30px] w-[35px] min-w-[35px] max-w-[35px] flex-col justify-center rounded-e-md border border-s-0 border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700">
                    <div className="text-center">
                        <span className="text-xs text-neutral-400">{props.guide}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputNumber;
