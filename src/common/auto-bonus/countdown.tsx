import { useEffect, useRef, useState } from "react";
import { ContentScriptContext } from "wxt/client";
import "./css/twitch.css";

type Props = {
    ctx: ContentScriptContext;
};

const Countdown = (props: Props) => {
    const [remaining, setRemaining] = useState<number>(900);
    const refRemaining = useRef(remaining);
    const manager = KVManagerList.other;
    const ID = "drmaggot__countdown";

    useEffect(() => {
        refRemaining.current = remaining;
    }, [remaining]);

    useEffect(() => {
        const i = props.ctx.setInterval(function () {
            (async function () {
                const countdown = await manager.getItem<PlatformStateRecord>("countdown");
                if (refRemaining.current <= 0 || !countdown.twitch) {
                    clearInterval(i);
                    props.ctx.abort();
                } else {
                    setRemaining(refRemaining.current - 1);
                }
            })();
        }, 1000);

        return () => {
            clearInterval(i);
        };
    }, []);

    return (
        <div id={ID} className={ID}>
            <span>{remaining}</span>
        </div>
    );
};

export default Countdown;
