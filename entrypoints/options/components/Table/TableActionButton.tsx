type Props = {
    style?: string;
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const TableActionButton = (props: Props) => {
    return (
        <button
            type="button"
            className={`${props.style} flex items-center gap-x-2 rounded-lg border border-transparent text-xs font-semibold`}
            onClick={props.onClick}
        >
            <span>{props.title}</span>
        </button>
    );
};

export default TableActionButton;
