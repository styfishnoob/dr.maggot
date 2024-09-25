import { useEffect, useState } from 'react';
import { KVManager } from '@/src/lib/kv-manager';
import youtube from '@/assets/platform_icons/youtube.svg';
import twitch from '@/assets/platform_icons/twitch.svg';
import openrec from '@/assets/platform_icons/openrec.svg';
import twicas from '@/assets/platform_icons/twicas.png';

type CheckboxesProps<T extends KV> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, MappedPlatformsState>;
    disabled?: MappedPlatformsState;
};

type CheckboxProps<T extends KV> = {
    platform: SupportedPlatforms;
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, MappedPlatformsState>;
    imgSrc: string;
};

const Checkboxes = <T extends KV>(props: CheckboxesProps<T>) => {
    const CheckboxList: CheckboxProps<T>[] = [
        {
            platform: 'youtube',
            storageKey: props.storageKey,
            itemKey: props.itemKey,
            imgSrc: youtube,
        },
        {
            platform: 'twitch',
            storageKey: props.storageKey,
            itemKey: props.itemKey,
            imgSrc: twitch,
        },
        {
            platform: 'openrec',
            storageKey: props.storageKey,
            itemKey: props.itemKey,
            imgSrc: openrec,
        },
        {
            platform: 'twicas',
            storageKey: props.storageKey,
            itemKey: props.itemKey,
            imgSrc: twicas,
        },
    ];

    return (
        <ul className="flex justify-end sm:flex-row">
            {CheckboxList.map((item, index) =>
                !props.disabled || !props.disabled[item.platform] ? (
                    <Checkbox<T>
                        key={index}
                        platform={item.platform}
                        storageKey={item.storageKey}
                        itemKey={item.itemKey}
                        imgSrc={item.imgSrc}
                    />
                ) : (
                    ''
                )
            )}
        </ul>
    );
};

const Checkbox = <T extends KV>(props: CheckboxProps<T>) => {
    const [state, setState] = useState<boolean>(false);
    const manager = new KVManager<T>(props.storageKey);
    const ID = `${props.platform}__${String(props.itemKey)}`;

    useEffect(() => {
        (async function () {
            const item = await manager.getItem<MappedPlatformsState>(props.itemKey);
            setState(item[props.platform]);
        })();
    });

    function onChange(platform: SupportedPlatforms) {
        (async () => {
            const item = await manager.getItem<MappedPlatformsState>(props.itemKey);
            item[platform] = !state;
            setState(!state);
            manager.setItem<MappedPlatformsState>(props.itemKey, item);
        })();
    }

    return (
        <li className="-ms-px border border-box w-[72px] bg-white px-3 py-2 font-medium text-gray-800 first:rounded-l-lg last:rounded-r-lg only:rounded-lg dark:border-neutral-700 dark:bg-inherit dark:text-white">
            <div className="flex w-full items-center justify-center">
                <div className="flex h-5 items-center">
                    <input
                        id={ID}
                        name={ID}
                        type="checkbox"
                        className="rounded border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                        checked={state}
                        onChange={() => onChange(props.platform)}
                    />
                </div>
                <label
                    htmlFor={ID}
                    className="ms-3.5 flex w-full items-center justify-center text-sm text-gray-600 dark:text-neutral-500"
                >
                    <img width={16} height={16} src={props.imgSrc} />
                </label>
            </div>
        </li>
    );
};

export default Checkboxes;
