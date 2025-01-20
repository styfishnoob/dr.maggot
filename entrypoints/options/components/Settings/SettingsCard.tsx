type Props = {
    title: string;
    description: string | JSX.Element;
    feature: JSX.Element;
};

export const SettingsCard = (props: Props) => {
    return (
        <div className="-mt-px flex text-xs items-center gap-2 p-3 bg-slate-50 border border-gray-200 first:rounded-t-lg last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 ">
            <div className="flex flex-col align-center gap-1.5">
                <div>
                    <span>{props.title}</span>
                </div>
                <div className="text-neutral-400">
                    <span>{props.description}</span>
                </div>
            </div>
            <div className="ml-auto shrink-0">{props.feature}</div>
        </div>
    );
};

export default SettingsCard;
