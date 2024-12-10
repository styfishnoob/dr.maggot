import InputNumber from "../InputNumber/InputNumber";

type Props = {
    value: number | "";
    min?: number;
    max?: number;
    style?: string;
    unit: string;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const InputLimiterWithUnit = (props: Props) => {
    return (
        <div className="flex">
            <InputNumber
                style={`${props.style} rounded-e-none`}
                value={props.value}
                onBlur={props.onBlur}
                onChange={props.onChange}
            />
            <div className="flex items-center justify-center py-2 w-[36px] rounded-e-md border border-s-0 border-gray-200 bg-gray-50 dark:border-neutral-600 dark:bg-neutral-700">
                <span>{props.unit}</span>
            </div>
        </div>
    );
};

export default InputLimiterWithUnit;
