type Bullet = {
    core: HTMLElement;
    fired: boolean;
    width: number;
};

type StorageChange = {
    oldValue?: any;
    newValue?: any;
};

type StorageAreaOnChangedChangesType = {
    [key: string]: StorageChange;
};

// コメント表示数の制限をできるようにする

export class Turret {
    public canvas: HTMLElement;
    private canvasClientHeight: number;
    private platform: Platforms;
    private settings: Danmaku;
    private magazine: Bullet[][] = [];
    private rowsNum: number = 0;
    private rowHeight: number = 0;

    constructor(platform: Platforms, canvas: HTMLElement) {
        this.platform = platform;
        this.canvas = canvas;
        this.canvasClientHeight = this.canvas.clientHeight;
        this.settings = DefaultSettings.Danmaku;
        this.update();
        this.watch();
    }

    private watcher = {
        storageOnChanged: (changes: StorageAreaOnChangedChangesType) => {
            Object.keys(changes).forEach((key) => {
                if (key === "Danmaku") {
                    this.update();
                }
            });
        },

        windowResized: () => {
            requestAnimationFrame(() => this.update());
        },
    };

    private watch() {
        browser.storage.local.onChanged.addListener(this.watcher.storageOnChanged);
        window.addEventListener("resize", this.watcher.windowResized);
    }

    public unwatch() {
        browser.storage.local.onChanged.removeListener(this.watcher.storageOnChanged);
        window.removeEventListener("resize", this.watcher.windowResized);
        while (this.canvas.firstChild) this.canvas.firstChild.remove();
        this.magazine = [];
    }

    private fire() {
        for (let i = 0; i < this.magazine.length; i++) {
            for (let j = 0; j < this.magazine[i].length; j++) {
                if (this.magazine[i][j].fired === false) {
                    const bullet = this.magazine[i][j];
                    const core = bullet.core;
                    bullet.fired = true;
                    bullet.width = this.getWidth(core);
                    core.style.top = `${this.rowHeight * i}px`;
                    core.style.left = `${this.canvas.clientWidth}px`;

                    const animate = bullet.core.animate(
                        [
                            {
                                transform: `translate3d(${-(
                                    this.canvas.clientWidth + bullet.width
                                )}px, 0px, 0px)`,
                            },
                        ],
                        this.settings.speed * 1000
                    );

                    animate.onfinish = () => {
                        if (this.magazine[i]) {
                            this.magazine[i] = this.magazine[i].filter(
                                (_bullet) => _bullet !== bullet
                            );
                        }
                        bullet.core.remove();
                    };

                    this.canvas.append(core);
                }
            }
        }
    }

    public load(material: HTMLElement) {
        if (!this.settings.danmaku[this.platform]) return;
        if (this.canvas.clientHeight != this.canvasClientHeight) {
            this.canvasClientHeight = this.canvas.clientHeight;
            this.update();
        }

        const newBullet = this.manufacture(material);
        for (let i = 0; i < this.magazine.length; i++) {
            const lastBullet = this.magazine[i][this.magazine[i].length - 1];

            switch (true) {
                case this.magazine[i].length > 100: {
                    while (this.magazine[i].length > 100) {
                        this.magazine[i].shift();
                    }
                }

                case i === this.magazine.length - 1: {
                    let min = 0;
                    for (let j = 0; j < this.magazine.length; j++) {
                        if (this.magazine[j].length < this.magazine[min].length) {
                            min = j;
                        }
                    }
                    //newBullet.core.style.backgroundColor = "red";
                    this.magazine[min].push(newBullet);
                    this.fire();
                    return;
                }

                case lastBullet === undefined:
                case this.checkCollision(newBullet, lastBullet): {
                    //newBullet.core.style.backgroundColor = "blue";
                    this.magazine[i].push(newBullet);
                    this.fire();
                    return;
                }

                default: {
                    continue;
                }
            }
        }
    }

    private manufacture(material: HTMLElement): Bullet {
        const anstyle = window.getComputedStyle(material).display;
        const contents = material.querySelector<HTMLElement>(
            Selectors.chat.contents[this.platform]
        );
        const core: HTMLElement = document.createElement("div");
        const bullet = { core: core, fired: false, width: 0 };
        if (!contents || contents.hidden || material.hidden || anstyle === "none") return bullet;

        contents.childNodes.forEach((child) => {
            const c = child as HTMLElement;
            switch (true) {
                case c.nodeName === "#text": {
                    const span = document.createElement("span");
                    span.textContent = c.textContent;
                    core.append(span);
                    break;
                }

                case c.matches(Selectors.chat.messages[this.platform]): {
                    const clone = c.cloneNode(true);
                    core.append(clone);
                    break;
                }

                case c.matches(Selectors.chat.emotes[this.platform]): {
                    const clone = c.cloneNode(true) as HTMLElement;
                    const _img = clone.querySelector("img");
                    const img = _img ? _img : (clone as HTMLImageElement);
                    img.width = this.settings.fontSize;
                    img.height = this.settings.fontSize;
                    core.append(clone);
                    break;
                }
            }
        });

        bullet.core = core;
        bullet.core.className = "drmaggot__danmaku-bullet";
        return bullet;
    }

    private update() {
        function setProperty(settings: Danmaku) {
            document.documentElement.style.setProperty("--drmaggot__danmaku-font", settings.font);
            document.documentElement.style.setProperty(
                "--drmaggot__danmaku-fontSize",
                `${settings.fontSize}px`
            );
            document.documentElement.style.setProperty(
                "--drmaggot__danmaku-opacity",
                `${settings.opacity}%`
            );
            window.parent.document.documentElement.style.setProperty(
                "--drmaggot__danmaku-font",
                settings.font
            );
            window.parent.document.documentElement.style.setProperty(
                "--drmaggot__danmaku-fontSize",
                `${settings.fontSize}px`
            );
            window.parent.document.documentElement.style.setProperty(
                "--drmaggot__danmaku-opacity",
                `${settings.opacity}%`
            );
        }

        (async () => {
            this.settings = await KVManagerList.danmaku.get();
            setProperty(this.settings);
            this.magazine = [];
            this.rowHeight = this.getHeight();
            this.rowsNum = Math.floor(this.canvas.clientHeight / this.rowHeight);
            for (let i = 0; i < this.rowsNum; i++) this.magazine.push([]);
            if (!this.settings.danmaku[this.platform])
                while (this.canvas.firstChild) this.canvas.firstChild.remove();
        })();
    }

    private checkCollision(newBullet: Bullet, lastBullet: Bullet) {
        const canvas_width = this.canvas.clientWidth;
        const newBulletWidth = newBullet.width;
        const lastBulletWidth = lastBullet.width;
        const lastX_Left_LeftSide = this.getPosX(lastBullet.core); //canvasの左側を0としたlast_commentの左端のx座標
        const lastX_Right_LeftSide = canvas_width - lastX_Left_LeftSide; //canvasの右側を0としたlast_commentの左端のx座標
        const lastX_Right_RightSide = lastX_Right_LeftSide - lastBulletWidth; //canvasの右側を0とした、last_commentの右端の座標
        const interval = Math.abs(lastBulletWidth - newBulletWidth);
        const appearance = lastX_Right_LeftSide > lastBulletWidth;
        const collision = interval < lastX_Right_RightSide;
        return appearance && collision;
    }

    private getWidth(bullet: HTMLElement): number {
        const clone = bullet.cloneNode(true) as HTMLElement;
        clone.className = "drmaggot__danmaku-check";
        this.canvas.append(clone);
        const result = clone.clientWidth;
        clone.remove();
        return result;
    }

    private getHeight(): number {
        const div = document.createElement("div");
        div.textContent = "TESTHEIGHT";
        div.className = "drmaggot__danmaku-check";
        this.canvas.append(div);
        const result = div.clientHeight;
        div.remove();
        return result;
    }

    private getPosX(bullet: HTMLElement) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const bulletRect = bullet.getBoundingClientRect();
        return bulletRect.left - canvasRect.left;
    }
}
