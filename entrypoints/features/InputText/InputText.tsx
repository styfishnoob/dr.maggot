type Props = {
    placeholder: string;
    style?: string;
    value: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const InputText = (props: Props) => {
    return (
        <input
            type="text"
            className={`${props.style} border-gray-200 rounded-md text-xs placeholder-neutral-500 focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-600`}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
        />
    );
};

export default InputText;
