type Props<T extends AllPlatforms> = {
    defaultValue: T;
    style?: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
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
        <div className={`${props.style} relative inline-block`}>
            <select
                value={selectedValue}
                onChange={handleChange}
                className="block w-full border-none h-full rounded-lg px-2 py-2 text-xs text-white bg-blue-600 appearance-none"
            >
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </span>
        </div>
    );
};

export default PlatformSelect;
