import { useContext, useEffect, useState } from "react";
import { KVManager } from "@/src/lib/kv-manager";
import { Limiter } from "@/utils";

type InputLimitProps<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, Limiter>;
};

type LimitProps = {
    limiter: Limiter;
    limiterKey: keyof Limiter;
    guide: "≧" | "≦";
    onBlur: (e: React.ChangeEvent<HTMLInputElement>, limiterKey: keyof Limiter) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, limiterKey: keyof Limiter) => void;
};

const Limit = (props: LimitProps) => {
    return (
        <div className="flex rounded-lg">
            <input
                type="number"
                defaultValue={props.limiter[props.limiterKey]}
                key={props.limiter[props.limiterKey]}
                onBlur={(e) => props.onBlur(e, props.limiterKey)}
                onChange={(e) => props.onChange(e, props.limiterKey)}
                className="block w-[65px] rounded-lg rounded-e-none border-gray-200 px-2 py-2 text-xs focus:z-10 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
            <div className="flex h-full w-[34px] flex-col justify-center rounded-e-md border border-s-0 border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700">
                <div className="text-center">
                    <span className="text-xs text-neutral-400">{props.guide}</span>
                </div>
            </div>
        </div>
    );
};

const InputLimit = <T extends KeyValue>(props: InputLimitProps<T>) => {
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
            <Limit
                limiter={limiter}
                limiterKey={"less"}
                guide={"≧"}
                onBlur={onBlur}
                onChange={onChange}
            />
            <Limit
                limiter={limiter}
                limiterKey={"more"}
                guide={"≦"}
                onBlur={onBlur}
                onChange={onChange}
            />
        </div>
    );
};

export default InputLimit;
