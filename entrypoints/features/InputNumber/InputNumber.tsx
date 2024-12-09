type Props = {
    style?: string;
    value: number | "";
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputNumber = (props: Props) => {
    return (
        <input
            type="number"
            className={`${props.style} rounded-md border-gray-200 px-2 py-2 text-xs focus:z-10 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 dark:focus:ring-neutral-600`}
            value={props.value}
            onBlur={props.onBlur}
            onChange={props.onChange}
        />
    );
};

export default InputNumber;
