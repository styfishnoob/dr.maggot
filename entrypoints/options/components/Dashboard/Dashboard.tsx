type Props = {
    title: string;
    children: React.ReactNode;
};

const Dashboard = (props: Props) => {
    return (
        <div className="h-screen w-screen flex flex-col grow bg-white dark:bg-black">
            <div className="w-full px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <span className="text-base font-black">{props.title}</span>
            </div>
            <div className="p-6 w-full h-full overflow-auto">{props.children}</div>
        </div>
    );
};

export default Dashboard;
