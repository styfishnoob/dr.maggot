import { MapManager } from "@/src/lib/map-manager";

export const useBlocklistTable = (manager: MapManager<AllPlatformBlocklistRecord, BlocklistItemValue>) => {
    const [platform, setPlatform] = useState<AllPlatforms>("all");
    const [blocklist, setBlocklist] = useState<Blocklist>([]);
    const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(new Map([]));

    useEffect(() => {
        (async function () {
            const newBlockMap = await manager.getMap(platform);
            newBlockMap.forEach((item) => checkedMap.set(item[1].value, item[1].active));
            setBlocklist(newBlockMap);
            setCheckedMap(new Map(checkedMap));
        })();
    }, [platform]);

    function setActive(id: string, checked: boolean) {
        checkedMap.set(id, checked);
        setCheckedMap(new Map(checkedMap));
        manager.set(platform, id, { value: id, active: checked });
    }

    function setBlocklistItem(value: string) {
        (async function () {
            const newBlocklist = await manager.set(platform, value, { value: value, active: true });
            checkedMap.set(value, true);
            setBlocklist(newBlocklist);
            setCheckedMap(new Map(checkedMap));
        })();
    }

    function deleteBlocklistItem(key: string) {
        (async function () {
            const newBlocklist = await manager.delete(platform, key);
            checkedMap.delete(key);
            setBlocklist(newBlocklist);
            setCheckedMap(new Map(checkedMap));
        })();
    }

    function deleteAllBlocklistItem() {
        (async function () {
            const newBlocklist = await manager.setMap(platform, []);
            setBlocklist(newBlocklist[platform]);
            setCheckedMap(new Map());
        })();
    }

    return {
        platform,
        setPlatform,
        blocklist,
        checkedMap,
        setActive,
        setBlocklistItem,
        deleteBlocklistItem,
        deleteAllBlocklistItem,
    };
};
