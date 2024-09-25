import drmaggot_icon from "@/assets/dr.maggot/dr.maggot.png";
import "./css/youtube.css";
import "./css/twitch.css";
import "./css/openrec.css";
import "./css/twicas.css";

type Props = {
    element: HTMLElement;
    user: string;
    platform: SupportedPlatforms;
};

const QuickBlock = (props: Props) => {
    switch (props.platform) {
        case "youtube":
            return <Youtube element={props.element} user={props.user} platform={props.platform} />;
        case "twitch": {
            if (location.href.match(/twitch\.tv\/videos\/.+$/)) {
                return (
                    <TwitchArchive
                        element={props.element}
                        user={props.user}
                        platform={props.platform}
                    />
                );
            } else {
                return (
                    <Twitch element={props.element} user={props.user} platform={props.platform} />
                );
            }
        }
        case "openrec":
            return <OPENREC element={props.element} user={props.user} platform={props.platform} />;
        case "twicas":
            return <Twicas element={props.element} user={props.user} platform={props.platform} />;
    }
};

const Youtube = (props: Props) => {
    return (
        <div className="youtube__quick-block" title={browser.i18n.getMessage("quickBlock_title")}>
            <button
                className="youtube__quick-block--button"
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={() => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                }}
            >
                <span>
                    <img width={20} height={20} src={drmaggot_icon} />
                </span>
            </button>
        </div>
    );
};

const Twitch = (props: Props) => {
    return (
        <div className="twitch__quick-block" title={browser.i18n.getMessage("quickBlock_title")}>
            <button
                className="twitch__quick-block--button"
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={() => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                }}
            >
                <span>
                    <img width={22} height={22} src={drmaggot_icon} />
                </span>
            </button>
        </div>
    );
};

const TwitchArchive = (props: Props) => {
    return (
        <div
            className="twitch-archive__quick-block"
            title={browser.i18n.getMessage("quickBlock_title")}
        >
            <button
                className="twitch-archive__quick-block--button"
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={() => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                }}
            >
                <span>
                    <img width={16} height={16} src={drmaggot_icon} />
                </span>
            </button>
        </div>
    );
};

const OPENREC = (props: Props) => {
    return (
        <div className="openrec__quick-block" title={browser.i18n.getMessage("quickBlock_title")}>
            <button
                className="openrec__quick-block--button"
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={() => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                }}
            >
                <span>
                    <img width={15} height={15} src={drmaggot_icon} />
                </span>
            </button>
        </div>
    );
};

const Twicas = (props: Props) => {
    return (
        <div className="twicas__quick-block" title={browser.i18n.getMessage("quickBlock_title")}>
            <span
                className="twicas__quick-block--button"
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={() => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                    props.element.style.display = "none";
                }}
            >
                <img src={drmaggot_icon} width={15} height={15} />
            </span>
        </div>
    );
};

export default QuickBlock;
