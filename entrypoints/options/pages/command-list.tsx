import Dashboard from "../components/Dashboard/Dashboard";
import Main from "../components/Main/Main";
import Navigation from "../components/Navigation/Navigation";
import Table from "../components/Table/Table";

const TABLE_KEYS = ["command", "effect"] as const;
type TableKeys = (typeof TABLE_KEYS)[number];
type TableCell = { style?: string; node: React.ReactNode };
type TableRow = Record<TableKeys, TableCell>;

type TableRowMaterial = { command: string; effect: React.ReactNode };

const Header: TableRow = {
    command: {
        style: "text-center bg-gray-100 dark:bg-neutral-900 w-[100px]",
        node: <span>COMMAND</span>,
    },
    effect: {
        style: "text-center bg-gray-100 dark:bg-neutral-900",
        node: <span>EFFECT</span>,
    },
};

const TableRowMaterials: TableRowMaterial[] = [
    {
        command: "example",
        effect: (
            <div className="flex flex-col gap-2">
                <div className="flex">
                    <div className="w-[100px]">[ReUp]ああああ</div>
                    <div className="mr-2">-&gt;</div>
                    <div>画面上に赤で表示</div>
                </div>
                <div className="flex">
                    <div className="w-[100px]">[DwPi]ああああ</div>
                    <div className="mr-2">-&gt;</div>
                    <div>画面下にピンクで表示</div>
                </div>
                <div className="flex">
                    <div className="w-[100px]">[Gr]ああああ</div>
                    <div className="mr-2">-&gt;</div>
                    <div>緑コメントを通常表示</div>
                </div>
            </div>
        ),
    },
    { command: "Up", effect: <span>コメントを画面中央上部に表示します。</span> },
    { command: "Dw", effect: <span>コメントを画面中央下部に表示します。</span> },
    {
        command: "Wh",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#FFFFFF] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#FFFFFF</span>
                にします。
            </span>
        ),
    },
    {
        command: "Re",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#FF0000] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#FF0000</span>
                にします。
            </span>
        ),
    },
    {
        command: "Pi",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#FFC0CB] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#FFC0CB</span>
                にします。
            </span>
        ),
    },
    {
        command: "Or",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#FFA500] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#FFA500</span>
                にします。
            </span>
        ),
    },
    {
        command: "Ye",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#FFFF00] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#FFFF00</span>
                にします。
            </span>
        ),
    },
    {
        command: "Gr",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#008000] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#008000</span>
                にします。
            </span>
        ),
    },
    {
        command: "Cy",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#00FFFF] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#00FFFF</span>
                にします。
            </span>
        ),
    },
    {
        command: "Bu",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#0000FF] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#0000FF</span>
                にします。
            </span>
        ),
    },
    {
        command: "Pu",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#800080] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#800080</span>
                にします。
            </span>
        ),
    },
    {
        command: "Bl",
        effect: (
            <span>
                コメントの色を
                <span className="text-[#000000] p-1 rounded-md bg-gray-200 dark:bg-zinc-800">■#000000</span>
                にします。
            </span>
        ),
    },
];

const CommandList = () => {
    return (
        <Main>
            <Navigation />
            <Dashboard title="コマンドリスト">
                <Table
                    header={Header}
                    body={TableRowMaterials.map((material) => {
                        return {
                            command: {
                                style: "text-center font-bold",
                                node: <span>{material.command}</span>,
                            },
                            effect: {
                                style: "",
                                node: material.effect,
                            },
                        };
                    })}
                ></Table>
            </Dashboard>
        </Main>
    );
};

export default CommandList;
