type Props = {
    children: React.ReactNode;
};

const Main = (props: Props) => {
    return <main className="flex h-screen text-black dark:text-white">{props.children}</main>;
};

export default Main;
