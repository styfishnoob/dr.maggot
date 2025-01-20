import TableData from "./TableData";

type TableRow = Record<string, { style?: string; node: React.ReactNode }>;

type Props<T extends TableRow> = {
    header: T;
    body: T[];
};

const Table = <T extends TableRow>(props: Props<T>) => {
    return (
        <div className="overflow-y-auto rounded-md border text-xs dark:border-neutral-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="sticky left-0 top-0">
                    <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
                        {Object.entries(props.header).map(([, item], index) => (
                            <TableData key={index} style={item.style}>
                                {item.node}
                            </TableData>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.body.length > 0 ? (
                        props.body.map((row, index) => (
                            <tr key={index} className="divide-x dark:divide-neutral-700">
                                {Object.entries(row).map(([, item], index) => (
                                    <TableData key={index} style={item.style}>
                                        {item.node}
                                    </TableData>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={Object.keys(props.header).length}>
                                <div className="flex justify-center p-3">
                                    <span>{browser.i18n.getMessage("blocklist_empty")}</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
