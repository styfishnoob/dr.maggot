import { NavLink } from "react-router-dom";

const gradationList = {
    black: "bg-gradient-to-t from-stone-900 to-neutral-700",
    red: "bg-gradient-to-b from-red-400 via-red-600 to-red-600",
    green: "bg-gradient-to-b from-green-400 via-green-500 to-green-500",
    blue: "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-500",
    amber: "bg-gradient-to-b from-amber-400 to-amber-500",
    gray: "bg-gradient-to-b from-stone-400 via-stone-600 to-stone-600",
    slate: "bg-gradient-to-r from-slate-400 to-slate-500",
};

type Props = {
    external?: boolean;
    to: string;
    title: string;
    imgSrc: string;
    gradationKey: keyof typeof gradationList;
};

export const NavigationLink = (props: Props) => {
    const Child = (props: Props) => {
        return (
            <div className="text-xs flex items-center gap-1.5 px-1.5 py-1 bg-inherit rounded-md">
                <div className={`rounded-md p-1 ${gradationList[props.gradationKey]}`}>
                    <img src={props.imgSrc} width={16} height={16} />
                </div>
                <div>
                    <span>{props.title}</span>
                </div>
            </div>
        );
    };

    if (!props.external) {
        return (
            <div>
                <NavLink
                    to={props.to}
                    className={({ isActive }) => (isActive ? "bg-blue-700 text-white" : "bg-inherit")}
                >
                    <Child to={props.to} title={props.title} imgSrc={props.imgSrc} gradationKey={props.gradationKey} />
                </NavLink>
            </div>
        );
    } else {
        return (
            <div>
                <a href={props.to} target="_blank">
                    <Child to={props.to} title={props.title} imgSrc={props.imgSrc} gradationKey={props.gradationKey} />
                </a>
            </div>
        );
    }
};

export default NavigationLink;
