import React from "react";
import TableData from "@/entrypoints/options/components/Table/TableData";
import all from "@/assets/platform_icons/all.png";
import youtube from "@/assets/platform_icons/youtube.svg";
import twitch from "@/assets/platform_icons/twitch.svg";
import kick from "@/assets/platform_icons/kick.svg";
import openrec from "@/assets/platform_icons/openrec.svg";
import twicas from "@/assets/platform_icons/twicas.png";
import { isRegExp } from "@/src/lib/is-regexp";

type Props = {
    platform: AllPlatforms;
    blocklists: Blocklist[];
    checkedMap: Map<string, boolean>;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type PlatformIcons = AllPlatformRecord<string>;

const platformIcons: PlatformIcons = {
    all: all,
    youtube: youtube,
    twitch: twitch,
    kick: kick,
    openrec: openrec,
    twicas: twicas,
};

const TableBodyRow = (props: Props) => {
    return (
        <>
            {props.blocklists.map(([key, item]) => {
                return (
                    <tr key={key} className="divide-x divide-gray-200 dark:divide-neutral-700">
                        <TableData width={true}>
                            <input
                                id={key}
                                type="checkbox"
                                className="rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
                                checked={props.checkedMap.get(key) || false}
                                onChange={(e) => props.onCheckboxChange(e)}
                            />
                        </TableData>
                        <TableData width={true}>
                            <img
                                width={16}
                                height={16}
                                src={platformIcons[props.platform]}
                                alt=""
                            />
                        </TableData>
                        {isRegExp(item.value)[0] ? (
                            <TableData width={false}>
                                <span className="mr-2 rounded bg-red-500 p-1">REGEXP</span>
                                <span>{item.value}</span>
                            </TableData>
                        ) : (
                            <TableData width={false}>
                                <span>{item.value}</span>
                            </TableData>
                        )}

                        <TableData width={true}>
                            <button
                                id={key}
                                type="button"
                                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400"
                                onClick={(e) => navigator.clipboard.writeText(e.currentTarget.id)}
                            >
                                <span>Copy</span>
                            </button>
                        </TableData>
                        <TableData width={true}>
                            <button
                                id={key}
                                type="button"
                                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold text-red-600 hover:text-red-800 disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:text-red-400"
                                onClick={(e) => props.onDeleteClick(e)}
                            >
                                <span>Delete</span>
                            </button>
                        </TableData>
                    </tr>
                );
            })}
        </>
    );
};

export default TableBodyRow;
