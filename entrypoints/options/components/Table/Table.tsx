import { useEffect, useState } from "react";
import InputText from "@/entrypoints/features/InputText/InputText";
import Select from "@/entrypoints/options/components/PlatformSelect/PlatformSelect";
import TableHeader from "@/entrypoints/options/components/Table/TableHeader";
import TableBodyRow from "./TableBodyRow";
import TableBodyNoRow from "./TableBodyNoRow";

type Props = {
    storageKey: keyof typeof MapManagerList;
    placeholder: string;
};

const Table = (props: Props) => {
    const [allPlatform, setAllPlatform] = useState<AllPlatforms>("all");
    const [blocklists, setBlocklists] = useState<Blocklist[]>([]);
    const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(new Map([]));
    const manager = MapManagerList[props.storageKey];

    const theadColor: AllPlatformRecord<string> = {
        all: "bg-gray-50 dark:bg-zinc-800 text-black dark:text-white",
        youtube: "bg-[#ff0000] text-white",
        twitch: "bg-[#874af6] text-white",
        kick: "bg-[#53fc18] text-white",
        openrec: "bg-[#eb5123] text-white",
        twicas: "bg-[#286DB3] text-white",
    };

    useEffect(() => {
        (async function () {
            const map = await manager.getMap(allPlatform);
            const checkedMap: Map<string, boolean> = new Map([]);
            map.forEach((item) => checkedMap.set(item[1].value, item[1].active));
            setBlocklists(map);
            setCheckedMap(checkedMap);
        })();
    }, [allPlatform]);

    function onCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const map = new Map(checkedMap);
        map.set(e.target.id, e.target.checked);
        setCheckedMap(map);
        manager.set(allPlatform, e.target.id, { value: e.target.id, active: e.target.checked });
    }

    function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value as Platforms;
        setAllPlatform(value);
    }

    function onDelete(e: React.MouseEvent<HTMLButtonElement>) {
        (async function () {
            const deleted = await manager.delete(allPlatform, e.currentTarget.id);
            setBlocklists(deleted);
        })();
    }

    function onEnter(value: string) {
        (async function () {
            if (value != "") {
                const newBlockMap = await manager.set(allPlatform, value, {
                    value: value,
                    active: true,
                });
                const newCheckedMap = checkedMap.set(value, true);
                setBlocklists(newBlockMap);
                setCheckedMap(newCheckedMap);
            }
        })();
    }

    return (
        <div className="flex h-[92%] flex-col p-6">
            <div className="mb-2 flex gap-2">
                <Select defaultValue={allPlatform} onChange={(e) => onSelectChange(e)} />
                <InputText
                    staticPlaceholder={props.placeholder}
                    style={"grow"}
                    onEnter={(v) => onEnter(v)}
                />
            </div>
            <div className="overflow-y-auto rounded-lg border dark:border-neutral-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className={`${theadColor[allPlatform]} sticky left-0 top-0`}>
                        <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
                            <TableHeader widthFix={true} title="ACTIVE" />
                            <TableHeader widthFix={true} title="PLATFORM" />
                            <TableHeader widthFix={false} title="REGISTERD VALUE" />
                            <TableHeader widthFix={true} title="COPY" />
                            <TableHeader widthFix={true} title="DELETE" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {blocklists.length === 0 ? (
                            <TableBodyNoRow
                                platform={allPlatform}
                                text={browser.i18n.getMessage("blocklist_empty")}
                            />
                        ) : (
                            <TableBodyRow
                                platform={allPlatform}
                                blocklists={blocklists}
                                checkedMap={checkedMap}
                                onCheckboxChange={onCheckboxChange}
                                onDeleteClick={onDelete}
                            />
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
