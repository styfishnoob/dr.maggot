import TableData from '@/entrypoints/options/components/Table/TableData';
import all from '@/assets/platform_icons/all.png';
import youtube from '@/assets/platform_icons/youtube.svg';
import twitch from '@/assets/platform_icons/twitch.svg';
import openrec from '@/assets/platform_icons/openrec.svg';
import twicas from '@/assets/platform_icons/twicas.png';

type Props = {
    platform: BlockMapSupportedPlatforms;
    text: string;
};

type PlatformIcons = { [P in BlockMapSupportedPlatforms]: string };

const platformIcons: PlatformIcons = {
    all: all,
    youtube: youtube,
    twitch: twitch,
    openrec: openrec,
    twicas: twicas,
};

const TableBodyNoRow = (props: Props) => {
    return (
        <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
            <TableData width={true}>
                <input
                    disabled
                    type="checkbox"
                    className="rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                />
            </TableData>
            <TableData width={true}>
                <img width={16} height={16} src={platformIcons[props.platform]} alt="" />
            </TableData>
            <TableData width={false}>
                <div className="text-center">
                    <span>{props.text}</span>
                </div>
            </TableData>
            <TableData width={true}>
                <button
                    type="button"
                    className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400"
                >
                    <span>Copy</span>
                </button>
            </TableData>
            <TableData width={true}>
                <button
                    type="button"
                    className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-red-600 hover:text-red-800 disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:text-red-400"
                >
                    <span>Delete</span>
                </button>
            </TableData>
        </tr>
    );
};

export default TableBodyNoRow;
