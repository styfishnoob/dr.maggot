type Props = {
    width: boolean;
    children: React.ReactNode;
};

const TableData = (props: Props) => {
    const w = props.width ? 'w-[95px] max-w-[95px] min-w-[95px]' : 'min-w-[160px]';
    const flex = props.width ? 'flex justify-center' : '';
    return (
        <td
            className={`whitespace-nowrap px-3 py-3 ${w} text-xs text-gray-800 dark:text-neutral-200`}
        >
            <div className={`${flex}`}>{props.children}</div>
        </td>
    );
};

export default TableData;
