type Props = {
    title: string;
};

const Topbar = (props: Props) => {
    return (
        <div className="flex h-[8%] w-full shrink-0 items-center border-b border-gray-200 pl-6 align-middle text-black dark:border-neutral-700 dark:text-white">
            <span className="text-base font-black">{props.title}</span>
        </div>
    );
};

export default Topbar;
