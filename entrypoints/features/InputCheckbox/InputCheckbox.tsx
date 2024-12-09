type Props = {
    id: string;
    checked: boolean;
    style?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputCheckbox = (props: Props) => {
    const style = props.style ? props.style : "";

    return (
        <input
            id={props.id}
            type="checkbox"
            className={`${style} w-[18px] h-[18px] rounded border-gray-200 focus:ring-offset-0 focus:ring-0 dark:border-neutral-700 dark:bg-neutral-800`}
            checked={props.checked}
            onChange={props.onChange}
        />
    );
};

export default InputCheckbox;
