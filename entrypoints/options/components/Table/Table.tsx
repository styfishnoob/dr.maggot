import { useEffect, useState } from 'react';
import InputText from '@/entrypoints/features/InputText/InputText';
import Select from '@/entrypoints/features/Select/Select';
import TableHeader from '@/entrypoints/options/components/Table/TableHeader';
import TableBodyRow from './TableBodyRow';
import TableBodyNoRow from './TableBodyNoRow';

type Props = {
    storageKey: keyof typeof MapManagerList;
    placeholder: string;
};

const Table = (props: Props) => {
    const [platform, setPlatform] = useState<BlockMapSupportedPlatforms>('all');
    const [blockMap, setBlockMap] = useState<BlockMap[]>([]);
    const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(new Map([]));
    const PLATFORMS: BlockMapSupportedPlatforms[] = ['all', 'youtube', 'twitch', 'openrec', 'twicas'];
    const manager = MapManagerList[props.storageKey];

    useEffect(() => {
        (async function () {
            const newBlockMap = await manager.getMap(platform);
            const newCheckedMap: Map<string, boolean> = new Map([]);
            const BlockMap = await manager.getMap(platform);
            BlockMap.forEach((item) => newCheckedMap.set(item[1].value, item[1].active));
            setBlockMap(newBlockMap);
            setCheckedMap(newCheckedMap);
        })();
    }, [platform]);

    function onCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const map = new Map(checkedMap);
        map.set(e.target.id, e.target.checked);
        setCheckedMap(map);
        manager.set(platform, e.target.id, { value: e.target.id, active: e.target.checked });
    }

    function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value as SupportedPlatforms;
        setPlatform(value);
    }

    function onDelete(e: React.MouseEvent<HTMLButtonElement>) {
        (async function () {
            const deleted = await manager.delete(platform, e.currentTarget.id);
            setBlockMap(deleted);
        })();
    }

    function onEnter(value: string) {
        (async function () {
            if (value != '') {
                const newBlockMap = await manager.set(platform, value, { value: value, active: true });
                const newCheckedMap = checkedMap.set(value, true);
                setBlockMap(newBlockMap);
                setCheckedMap(newCheckedMap);
            }
        })();
    }

    function theadColor(): string {
        switch (platform) {
            case 'all':
                return 'bg-gray-50 dark:bg-zinc-800 text-black dark:text-white';
            case 'youtube':
                return 'bg-[#ff0000] text-white';
            case 'twitch':
                return 'bg-[#874af6] text-white';
            case 'openrec':
                return 'bg-[#eb5123] text-white';
            case 'twicas':
                return 'bg-[#286DB3] text-white';
        }
    }

    return (
        <div className="flex h-[92%] flex-col p-6">
            <div className="mb-2 flex gap-2">
                <Select<BlockMapSupportedPlatforms> options={PLATFORMS} defaultValue={platform} onChange={(e) => onSelectChange(e)} />
                <InputText staticPlaceholder={props.placeholder} style={'grow'} onEnter={(v) => onEnter(v)} />
            </div>
            <div className="overflow-y-auto rounded-lg border dark:border-neutral-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className={`${theadColor()} sticky left-0 top-0`}>
                        <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
                            <TableHeader widthFix={true} title="ACTIVE" />
                            <TableHeader widthFix={true} title="PLATFORM" />
                            <TableHeader widthFix={false} title="REGISTERD VALUE" />
                            <TableHeader widthFix={true} title="COPY" />
                            <TableHeader widthFix={true} title="DELETE" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {blockMap.length === 0 ? (
                            <TableBodyNoRow platform={platform} text={browser.i18n.getMessage('blocklist_empty')} />
                        ) : (
                            <TableBodyRow
                                platform={platform}
                                blockMap={blockMap}
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
