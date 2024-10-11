import React, { useState } from "react";

type Props<T extends AllPlatforms> = {
    defaultValue: T;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const PlatformSelect = <T extends AllPlatforms>(props: Props<T>) => {
    const [selectedValue, setSelectedValue] = useState<T>(props.defaultValue);

    const options: AllPlatformRecord<string> = {
        all: "All",
        youtube: "Youtube",
        twitch: "Twitch",
        kick: "Kick",
        openrec: "OPENREC",
        twicas: "Twicas",
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(e.target.value as T);
        props.onChange(e);
    };

    return (
        <select
            value={selectedValue}
            onChange={handleChange}
            className="block w-[95px] min-w-[95px] max-w-[95px] rounded-lg px-2 py-2 text-xs border-2 border-blue-600 focus:ring-0 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
        >
            {Object.entries(options).map(([key, value]) => {
                return (
                    <option key={key} value={key}>
                        {value}
                    </option>
                );
            })}
        </select>
    );
};

export default PlatformSelect;
