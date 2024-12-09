type Props = {
    style?: string;
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = (props: Props) => {
    return (
        <button className={`${props.style} rounded-md`} onClick={props.onClick}>
            {props.title}
        </button>
    );
};

export default Button;
