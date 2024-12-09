import InputLimiterWithUnit from "./InputLimiterWithUnit";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, Limiter>;
};

const InputLimitersWithUnit = <T extends KeyValue>(props: Props<T>) => {
    return (
        <div className="flex gap-2.5">
            <InputLimiterWithUnit<T>
                storageKey={props.storageKey}
                itemKey={props.itemKey}
                limiterKey={"less"}
                unit="≧"
                style="w-[65px]"
            />
            <InputLimiterWithUnit<T>
                storageKey={props.storageKey}
                itemKey={props.itemKey}
                limiterKey={"more"}
                unit="≦"
                style="w-[65px]"
            />
        </div>
    );
};

export default InputLimitersWithUnit;
