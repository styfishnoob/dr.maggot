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
                                transform: `translate3d(${-(this.canvas.clientWidth + bullet.width)}px, 0px, 0px)`,
                            },
                        ],
                        this.settings.speed * 1000
                    );

                    animate.onfinish = () => {
                        if (this.magazine[i]) {
                            this.magazine[i] = this.magazine[i].filter((_bullet) => _bullet !== bullet);
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
        for (let i = 0; i <= this.magazine.length; i++) {
            // 全ての行に入れられなかった場合、最後のコメントの位置が最もゴールに違い行に追加
            if (i === this.magazine.length) {
                let min = 0;
                for (let j = 1; j < this.magazine.length; j++) {
                    const minLastBullet = this.magazine[min][this.magazine[min].length - 1];
                    const lastBullet = this.magazine[j][this.magazine[j].length - 1];
                    const min_lb_pos_x = this.getPosX(minLastBullet.core) + minLastBullet.width;
                    const lb_pos_x = this.getPosX(lastBullet.core) + lastBullet.width;
                    if (lb_pos_x <= min_lb_pos_x) {
                        min = j;
                    }
                }
                this.magazine[min].push(newBullet);
                this.fire();
                return;
            }

            const lastBullet = this.magazine[i][this.magazine[i].length - 1];
            switch (true) {
                case this.magazine[i].length > 100: {
                    while (this.magazine[i].length > 100) {
                        this.magazine[i].shift();
                    }
                }

                case lastBullet === undefined:
                case this.checkCollision(newBullet, lastBullet): {
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
        const display = window.getComputedStyle(material).display; // サブ限などで非表示になっている場合
        const contents = material.querySelector<HTMLElement>(Selectors.chat.contents[this.platform]);
        const core: HTMLElement = document.createElement("div");
        const bullet: Bullet = { core: core, fired: false, width: 0 };
        if (!contents || contents.hidden || material.hidden || display === "none") return bullet;

        core.style.height = `${this.rowHeight}px`;

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
                    const img = c as HTMLImageElement;
                    const clone = img.cloneNode(true) as HTMLImageElement;
                    clone.width = img.width;
                    clone.height = img.height;
                    core.append(clone);
                    break;
                }

                case !!c.querySelector(Selectors.chat.emotes[this.platform]): {
                    const clone = c.cloneNode(true);
                    core.append(clone);
                    break;
                }
            }
        });

        bullet.core = core;
        bullet.core.className = "drmaggot__danmaku-bullet";
        bullet.width = this.getWidth(bullet.core);
        return bullet;
    }

    private update() {
        function setProperty(settings: Danmaku) {
            document.documentElement.style.setProperty("--drmaggot__danmaku-font", settings.font);
            document.documentElement.style.setProperty("--drmaggot__danmaku-fontSize", `${settings.fontSize}px`);
            document.documentElement.style.setProperty("--drmaggot__danmaku-opacity", `${settings.opacity}%`);
            window.parent.document.documentElement.style.setProperty("--drmaggot__danmaku-font", settings.font);
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
            if (!this.settings.danmaku[this.platform]) while (this.canvas.firstChild) this.canvas.firstChild.remove();
        })();
    }

    private checkCollision(newBullet: Bullet, lastBullet: Bullet) {
        // 衝突しない -> true 衝突する -> false
        const nb_width = newBullet.width;
        const lb_width = lastBullet.width;

        // キャンバスの横幅とコメントの横幅を足して実際に流れる距離を計算
        const nb_travel_distance = this.canvas.clientWidth + nb_width;
        const lb_travel_distance = this.canvas.clientWidth + lb_width;

        const nb_speed = nb_travel_distance / this.settings.speed;
        const lb_speed = lb_travel_distance / this.settings.speed;

        const lb_pos_x = this.getPosX(lastBullet.core) + lb_width; // コメントの右端を基準にしたいため、コメントの横幅を足す
        const lb_traveled = lb_travel_distance - lb_pos_x;
        const lb_elapsed_time = lb_traveled / lb_speed;
        const lb_is_appeared = lb_traveled >= lb_width;
        const lb_time_to_appear = lb_width / lb_speed; // 完全にコメントが表示されるまでの時間(コメントの右端がスタートラインに触れるまで)

        // lb が完全に表示されていない場合
        if (!lb_is_appeared) return false;

        // nb　の速度が lb より遅い場合
        if (nb_speed <= lb_speed) return true;

        // catch_up_time は nb が lb に追いつくまでの時間
        // lb_elapsed_time - lb_time_to_appear は　lb が完全に表示されてから何秒経過したか
        // つまり、コメントの右端基準で経過時間を測定している
        const catch_up_time = (lb_speed * (lb_elapsed_time - lb_time_to_appear)) / (nb_speed - lb_speed);
        return lb_is_appeared && catch_up_time >= this.settings.speed - lb_elapsed_time;
    }

    private getWidth(core: HTMLElement): number {
        const clone = core.cloneNode(true) as HTMLElement;
        clone.className = "drmaggot__danmaku-check";
        this.canvas.append(clone);
        const result = clone.clientWidth;
        clone.remove();
        return result;
    }

    private getPosX(core: HTMLElement) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const bulletRect = core.getBoundingClientRect();
        return bulletRect.left - canvasRect.left;
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
}
