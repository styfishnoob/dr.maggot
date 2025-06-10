const FullScreenButton = () => {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    return (
        <div id="drmaggot__fullscreen-button" className="InjectLayout-sc-1i43xsx-0 iDMNUO">
            <div className="Layout-sc-1xcs6mc-0 ScLayoutCssVars-sc-1pn65j5-0 jfyitl gaSyOh">
                <button
                    className="ScCoreButton-sc-ocjdkq-0 bhSCzT ScButtonIcon-sc-9yap0r-0 exrGQc"
                    title="[Dr.Maggot] FullScreeen"
                    onClick={() => {
                        const videoContainer = document.querySelector(".video-player__container");
                        const videoContainerParent = document.querySelector("[data-a-target='video-player']");
                        const newState = !isFullScreen;
                        if (!videoContainer || !videoContainerParent) return;

                        if (newState) {
                            setIsFullScreen(true);
                            videoContainer.requestFullscreen();
                        } else {
                            setIsFullScreen(false);
                            document.exitFullscreen();
                        }
                    }}
                >
                    <span>📺</span>
                </button>
            </div>
        </div>
    );
};

export default FullScreenButton;
