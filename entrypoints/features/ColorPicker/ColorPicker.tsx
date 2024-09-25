import { KVManager } from '@/src/lib/kv-manager';
import { useEffect, useState } from 'react';

type Props<T extends KV> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, string>;
};

const ColorPicker = <T extends KV>(props: Props<T>) => {
    const [color, setColor] = useState<string>('#000000');
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
            className="block h-[35px] w-[80px] cursor-pointer rounded-lg border border-gray-200 bg-white p-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900"
            defaultValue={color}
            onBlur={(e) => onBlur(e)}
        ></input>
    );
};

export default ColorPicker;
