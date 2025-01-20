type Props = {
    style?: string;
    children: React.ReactNode;
};

const TableData = (props: Props) => {
    return (
        <td className={`${props.style} p-3 text-gray-800 whitespace-nowrap dark:text-neutral-200`}>{props.children}</td>
    );
};

export default TableData;
