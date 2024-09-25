type Props = {
    widthFix: boolean;
    title: string;
};

const TableHeader = (props: Props) => {
    const w = props.widthFix ? `w-[95px] max-w-[95px] min-w-[95px]` : 'min-w-[160px]';
    return (
        <th scope="col" className={`px-3 py-3 ${w} whitespace-nowrap text-xs font-medium`}>
            <div className="flex justify-center">
                <span>{props.title}</span>
            </div>
        </th>
    );
};

export default TableHeader;
