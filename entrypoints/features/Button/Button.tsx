type Props = {
    title: string;
    style?: string;
    onClick: () => void;
};

const Button = (props: Props) => {
    return (
        <button
            type="button"
            className={`${
                props.style ? props.style : ''
            } py-1 px-2 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700`}
            onClick={props.onClick}
        >
            {props.title}
        </button>
    );
};

export default Button;
