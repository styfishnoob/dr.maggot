import { useContext, useEffect, useState } from "react";
import { KVManager } from "@/src/lib/kv-manager";
import { Limiter } from "@/utils";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, Limiter>;
};

const InputLimit = <T extends KeyValue>(props: Props<T>) => {
    const manager = new KVManager<T>(props.storageKey);
    const [limiter, setLimiter] = useState<Limiter>({ less: 0, more: 0 });

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<Limiter>(props.itemKey);
            setLimiter(item);
        })();
    }, []);

    function onBlur(e: React.ChangeEvent<HTMLInputElement>, limiterKey: keyof Limiter) {
        (async function () {
            const num = Number(e.target.value);
            if (num <= 0) e.target.value = "0";
            if (num >= 500) e.target.value = "500";
            limiter[limiterKey] = Number(e.target.value);
            manager.setItem<Limiter>(props.itemKey, limiter);
            setLimiter(limiter);
        })();
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>, limiterKey: keyof Limiter) {
        (async function () {
            const item = await manager.getItem<Limiter>(props.itemKey);
            const num = Number(e.target.value);
            if (e.target.value != "") {
                if (num <= 0) e.target.value = "0";
                if (num >= 500) e.target.value = "500";
                item[limiterKey] = Number(e.target.value);
                manager.setItem<Limiter>(props.itemKey, item);
            }
        })();
    }

    return (
        <div className="flex gap-2">
            <div className="flex rounded-lg">
                <input
                    type="number"
                    defaultValue={limiter.less}
                    key={limiter.less}
                    onBlur={(e) => onBlur(e, "less")}
                    onChange={(e) => onChange(e, "less")}
                    className="block w-[65px] rounded-lg rounded-e-none border-gray-200 px-1.5 py-1.5 text-xs focus:z-10 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                />
                <div className="inline-flex min-w-fit items-center rounded-e-md border border-s-0 border-gray-200 bg-gray-50 px-2.5 dark:border-neutral-600 dark:bg-neutral-700">
                    <span className="text-sm text-neutral-400">≧</span>
                </div>
                <div></div>
            </div>
            <div className="flex rounded-lg">
                <input
                    type="number"
                    defaultValue={limiter.more}
                    key={limiter.more}
                    onBlur={(e) => onBlur(e, "more")}
                    onChange={(e) => onChange(e, "more")}
                    className="block w-[65px] rounded-lg rounded-e-none border-gray-200 px-1.5 py-1.5 text-xs focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                />
                <div className="inline-flex min-w-fit items-center rounded-e-md border border-s-0 border-gray-200 bg-gray-50 px-2.5 dark:border-neutral-600 dark:bg-neutral-700">
                    <span className="text-sm text-gray-500 dark:text-neutral-400">≦</span>
                </div>
            </div>
        </div>
    );
};

export default InputLimit;
