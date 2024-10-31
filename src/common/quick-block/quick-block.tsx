import drmaggot_icon from "@/assets/dr.maggot/dr.maggot.png";
import "./css/youtube.css";
import "./css/twitch.css";
import "./css/kick.css";
import "./css/openrec.css";
import "./css/twicas.css";

type Props = {
    element: HTMLElement;
    user: string;
    platform: Platforms;
};

type PlatformImgSizes = PlatformRecord<number>;

const QuickBlock = (props: Props) => {
    var imgSizes: PlatformImgSizes = {
        youtube: 20,
        twitch: 22,
        kick: 22,
        openrec: 15,
        twicas: 16,
    };

    return (
        <div
            className={`${props.platform}__quick-block`}
            title={browser.i18n.getMessage("quickBlock_title")}
        >
            <button
                className={`${props.platform}__quick-block--button`}
                title={browser.i18n.getMessage("quickBlock_title")}
                onClick={(event) => {
                    const manager = MapManagerList.user;
                    manager.set(props.platform, props.user, { value: props.user, active: true });
                    props.element.hidden = true;
                    props.element.style.display = "none";
                    event.stopPropagation();
                }}
            >
                <span>
                    <img
                        width={imgSizes[props.platform]}
                        height={imgSizes[props.platform]}
                        src={drmaggot_icon}
                    />
                </span>
            </button>
        </div>
    );
};

export default QuickBlock;
