import { KVManager } from "@/src/lib/kv-manager";

import InputCheckbox from "../InputCheckbox/InputCheckbox";

type Props<T extends KeyValue> = {
    platform: Platforms;
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, PlatformStateRecord>;
    imgSrc: string;
};

const PlatformCheckbox = <T extends KeyValue>(props: Props<T>) => {
    const [state, setState] = useState<boolean>(false);
    const manager = new KVManager<T>(props.storageKey);
    const id = `${props.platform}__${String(props.itemKey)}`;

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<PlatformStateRecord>(props.itemKey);
            setState(item[props.platform]);
        })();
    }, []);

    function onChange() {
        (async () => {
            const item = await manager.getItem<PlatformStateRecord>(props.itemKey);
            item[props.platform] = !state;
            setState(!state);
            manager.setItem<PlatformStateRecord>(props.itemKey, item);
        })();
    }

    return (
        <div className="-ms-px flex w-full gap-3.5 px-3 py-2 border bg-white first:rounded-l-md last:rounded-r-md dark:bg-inherit dark:border-neutral-700">
            <div className="flex shrink-0 items-center">
                <InputCheckbox id={id} checked={state} onChange={onChange} />
            </div>
            <div className="flex shrink-0 items-center">
                <label htmlFor={id}>
                    <img width="16" height="16" src={props.imgSrc} />
                </label>
            </div>
        </div>
    );
};

export default PlatformCheckbox;
