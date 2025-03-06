import PlatformCheckbox from "./PlatformCheckbox";

import youtube from "@/assets/platform_icons/youtube.svg";
import twitch from "@/assets/platform_icons/twitch.svg";
import kick from "@/assets/platform_icons/kick.svg";
import openrec from "@/assets/platform_icons/openrec.svg";
import twicas from "@/assets/platform_icons/twicas.png";

type Props<T extends KeyValue> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, PlatformRecord<boolean>>;
    disabled?: Platforms[];
};

const PlatformCheckboxes = <T extends KeyValue>(props: Props<T>) => {
    const platformIcons = new Map<Platforms, string>([
        ["youtube", youtube],
        ["twitch", twitch],
        ["kick", kick],
        ["openrec", openrec],
        ["twicas", twicas],
    ]);

    const filteredIcons = Array.from(platformIcons).filter(([key]) => {
        return !(props.disabled && props.disabled.includes(key));
    });

    return (
        <div className="flex">
            {filteredIcons.map(([platform, imgSrc], index) => (
                <PlatformCheckbox<T>
                    key={index}
                    platform={platform}
                    imgSrc={imgSrc}
                    storageKey={props.storageKey}
                    itemKey={props.itemKey}
                />
            ))}
        </div>
    );
};

export default PlatformCheckboxes;
