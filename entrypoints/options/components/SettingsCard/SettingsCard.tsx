type Props = {
    title: string;
    description: string;
    children: JSX.Element;
};

const SettingsCard = (props: Props) => {
    return (
        <li className="-mt-px flex h-[60px] max-h-[60px] min-h-[60px] items-center gap-x-2 border border-gray-200 bg-stone-50 px-2.5 py-2.5 text-xs font-medium text-gray-800 first:mt-0 first:rounded-t-lg last:rounded-b-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
            <div className="flex flex-col gap-1">
                <div className="font-base">
                    <span>{props.title}</span>
                </div>
                <div className="text-neutral-400">
                    <span>{props.description}</span>
                </div>
            </div>
            <div className="ml-auto">{props.children}</div>
        </li>
    );
};

export default SettingsCard;
