type Props = {
    children: React.ReactNode;
    value: string;
    style?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

const Select = (props: Props) => {
    return (
        <select
            className={`${props.style} border-gray-200 rounded-md text-xs placeholder-neutral-500 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-600`}
            value={props.value}
            onChange={props.onChange}
        >
            {props.children}
        </select>
    );
};

export default Select;
