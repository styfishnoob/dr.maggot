type Props = {
    children: React.ReactNode;
};

const Main = (props: Props) => {
    return <div className="flex h-screen w-screen grow flex-col bg-white dark:bg-black">{props.children}</div>;
};

export default Main;
