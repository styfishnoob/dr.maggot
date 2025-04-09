import { KVManager } from "@/src/lib/kv-manager";
import Select from "../Select/Select";

type Props<T> = {
    storageKey: KeysOfType<Settings, T>;
    itemKey: KeysOfType<T, string>;
};

const SelectFont = <T extends KeyValue>(props: Props<T>) => {
    const [fonts, setFonts] = useState<chrome.fontSettings.FontName[]>([]);
    const [registeredFont, setRegisteredFont] = useState<string>("");
    const manager = new KVManager<T>(props.storageKey);

    useEffect(() => {
        (async function () {
            const fonts = await browser.fontSettings.getFontList();
            const registeredFont = await manager.getItem<string>(props.itemKey);
            setFonts(fonts);
            setRegisteredFont(registeredFont);
        })();
    }, []);

    function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setRegisteredFont(value);
        manager.setItem(props.itemKey, value);
    }

    return (
        <Select onChange={onChange} value={registeredFont}>
            <option value={""}>Default</option>
            {fonts.map((font, index) => {
                return (
                    <option key={index} value={font.fontId}>
                        {font.displayName}
                    </option>
                );
            })}
        </Select>
    );
};

export default SelectFont;
