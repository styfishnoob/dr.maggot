import React, { useState } from 'react';

type Props<T> = {
    options: T[];
    defaultValue: T;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select = <T extends string>(props: Props<T>) => {
    const [selectedValue, setSelectedValue] = useState<T>(props.defaultValue);

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
            {props.options.map((v) => (
                <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()}
                </option>
            ))}
        </select>
    );
};

export default Select;
