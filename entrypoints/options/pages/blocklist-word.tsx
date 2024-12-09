import Main from "@/entrypoints/options/components/Main/Main";
import Navigation from "@/entrypoints/options/components/Navigation/Navigation";
import Dashboard from "@/entrypoints/options/components/Dashboard/Dashboard";
import Button from "@/entrypoints/features/Button/Button";
import InputText from "@/entrypoints/features/InputText/InputText";
import InputCheckbox from "@/entrypoints/features/InputCheckbox/InputCheckbox";
import PlatformSelect from "@/entrypoints/features/PlatformSelect/PlatformSelect";
import Table from "../components/Table/Table";
import TableActionButton from "../components/Table/TableActionButton";

import { MapManager } from "@/src/lib/map-manager";
import { AllPlatformIcons } from "@/entrypoints/const/platform-icons";
import { TheadColors } from "@/entrypoints/const/thead-colors";
import { isRegExp } from "@/src/lib/is-regexp";
import { useBlocklistTable } from "@/entrypoints/hooks/useBlocklistTable";

const TABLE_KEYS = ["active", "platform", "registeredValue", "copy", "delete"] as const;
type TableKeys = (typeof TABLE_KEYS)[number];
type TableCell = { style?: string; node: React.ReactNode };
type TableRow = Record<TableKeys, TableCell>;

const BlocklistWord = () => {
    const manager = new MapManager<AllPlatformBlocklistRecord, BlocklistItemValue>("BlockedWords");
    const {
        platform,
        setPlatform,
        blocklist,
        checkedMap,
        setActive,
        setBlocklistItem,
        deleteBlocklistItem,
        deleteAllBlocklistItem,
    } = useBlocklistTable(manager);
    const [inputTextValue, setInputTextValue] = useState<string>("");

    const Header: TableRow = {
        active: {
            style: `${TheadColors[platform]} text-center w-[95px]`,
            node: <span>ACTIVE</span>,
        },
        platform: {
            style: `${TheadColors[platform]} text-center w-[95px]`,
            node: <span>PLATFORM</span>,
        },
        registeredValue: {
            style: `${TheadColors[platform]} text-center`,
            node: <span>REGSTERED VALUE</span>,
        },
        copy: {
            style: `${TheadColors[platform]} text-center w-[95px]`,
            node: <span>COPY</span>,
        },
        delete: {
            style: `${TheadColors[platform]} text-center w-[95px]`,
            node: <span>DELETE</span>,
        },
    };

    const Body: TableRow[] = blocklist.map(([key]) => {
        return {
            active: {
                node: (
                    <div className="flex justify-center">
                        <InputCheckbox
                            id={key}
                            checked={checkedMap.get(key) ?? false}
                            onChange={(e) => setActive(e.target.id, e.target.checked)}
                        />
                    </div>
                ),
            },
            platform: {
                node: (
                    <div className="flex justify-center">
                        <img width={16} height={16} src={AllPlatformIcons[platform]} />
                    </div>
                ),
            },
            registeredValue: {
                node: (
                    <div>
                        {isRegExp(key)[0] && <span className="mr-2 rounded bg-red-500 p-1">REGEXP</span>}
                        <span>{key}</span>
                    </div>
                ),
            },
            copy: {
                node: (
                    <div className="flex justify-center">
                        <TableActionButton
                            title="COPY"
                            style="text-blue-500 hover:text-blue-400"
                            onClick={() => navigator.clipboard.writeText(key)}
                        />
                    </div>
                ),
            },
            delete: {
                node: (
                    <div className="flex justify-center">
                        <TableActionButton
                            title="DELETE"
                            style="text-red-500 hover:text-red-400"
                            onClick={() => deleteBlocklistItem(key)}
                        />
                    </div>
                ),
            },
        };
    });

    function onInputTextEnter(event: React.KeyboardEvent<HTMLInputElement>) {
        const val = event.currentTarget.value;
        const isComposing = event.nativeEvent.isComposing;

        if (event.key === "Enter" && !isComposing) {
            if (val !== "") {
                setBlocklistItem(val);
                setInputTextValue("");
            }
        }
    }

    function onAllDeleteButtonClick() {
        const result = confirm("OK?");
        if (result) deleteAllBlocklistItem();
    }

    return (
        <Main>
            <Navigation />
            <Dashboard title={`${browser.i18n.getMessage("menu_blockedWords")}`}>
                <div className="flex flex-col gap-1.5">
                    <div className="flex gap-1.5">
                        <PlatformSelect
                            defaultValue={"all"}
                            style="w-[95px]"
                            onChange={(e) => setPlatform(e.target.value as AllPlatforms)}
                        />
                        <InputText
                            value={inputTextValue}
                            style="flex-grow"
                            placeholder={browser.i18n.getMessage("blockedWords_input_placeholder")}
                            onChange={(e) => setInputTextValue(e.target.value)}
                            onKeyDown={onInputTextEnter}
                        />
                        <Button
                            title="DELETE ALL"
                            style="text-white bg-red-600 hover:bg-red-700 active:bg-red-600 w-[95px]"
                            onClick={() => onAllDeleteButtonClick()}
                        />
                    </div>
                    <Table<TableRow> header={Header} body={Body} />
                </div>
            </Dashboard>
        </Main>
    );
};

export default BlocklistWord;
