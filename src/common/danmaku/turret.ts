type Bullet = {
    core: HTMLElement;
    fired: boolean;
    width: number;
    decoration: {
        up: boolean;
        down: boolean;
    };
};

type StorageChange = {
    oldValue?: any;
    newValue?: any;
};

type StorageAreaOnChangedChangesType = {
    [key: string]: StorageChange;
};

enum DecorationCommands {
    up = "up", // 上中央表示
    dw = "dw", // 下中央表示
    wh = "wh", // ホワイト
    re = "re", // レッド
    pi = "pi", // ピンク
    or = "or", //　オレンジ
    yw = "ye", //　イエロー
    gr = "gr", //　グリーン
    cy = "cy", //　シアン
    bu = "bu", //　ブルー
    pu = "pu", //　パープル
    bl = "bl", //　ブラック
}

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

                    switch (true) {
                        case bullet.decoration.up: {
                            // 重なる場合下へ表示するように
                            core.style.top = `0px`;
                            core.style.left = `${this.canvas.clientWidth / 2 - bullet.width / 2}px`;
                            this.canvas.append(core);
                            setTimeout(() => core.remove(), this.settings.speed * 1000);
                            return;
                        }

                        case bullet.decoration.down: {
                            // 重なる場合上へ表示するように
                            core.style.top = `${this.canvas.clientHeight - this.rowHeight}px`;
                            core.style.left = `${this.canvas.clientWidth / 2 - bullet.width / 2}px`;
                            this.canvas.append(core);
                            setTimeout(() => core.remove(), this.settings.speed * 1000);
                            return;
                        }

                        default: {
                            core.style.top = `${this.rowHeight * i}px`;
                            core.style.left = `${this.canvas.clientWidth}px`;
                        }
                    }

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
        this.decoration(newBullet);

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

    private decoration(bullet: Bullet) {
        const firstChild = bullet.core.firstChild;
        if (!firstChild || !firstChild.textContent || firstChild.nodeName != "SPAN") return;

        const validCommands = Object.keys(DecorationCommands).join("|");
        const commandRegex = new RegExp(`^\\[(${validCommands})+\\]`, "i");
        const match = firstChild.textContent.match(commandRegex);
        if (!match) return;

        const matchedCommands = match[0].slice(1, -1);
        const commands: string[] = [];
        firstChild.textContent = firstChild.textContent.replace(commandRegex, "");

        for (let i = 0; i < matchedCommands.length; i += 2) {
            commands.push(matchedCommands.substring(i, i + 2));
        }

        commands.forEach((command) => {
            const lowered = command.toLowerCase();
            if (lowered in DecorationCommands) {
                switch (lowered) {
                    case "up":
                        bullet.decoration.up = true;
                        bullet.decoration.down = false;
                        break;
                    case "dw":
                        bullet.decoration.up = false;
                        bullet.decoration.down = true;
                        break;
                    case "wh":
                        bullet.core.style.color = "white";
                        break;
                    case "re":
                        bullet.core.style.color = "red";
                        break;
                    case "pi":
                        bullet.core.style.color = "pink";
                        break;
                    case "or":
                        bullet.core.style.color = "orange";
                        break;
                    case "yw":
                        bullet.core.style.color = "yellow";
                        break;
                    case "gr":
                        bullet.core.style.color = "green";
                        break;
                    case "cy":
                        bullet.core.style.color = "cyan";
                        break;
                    case "bu":
                        bullet.core.style.color = "blue";
                        break;
                    case "pu":
                        bullet.core.style.color = "purple";
                        break;
                    case "bl":
                        bullet.core.style.color = "black";
                        break;
                    default:
                        dcon.log(`登録されていないコマンドです: ${lowered}`);
                }
            }
        });
    }

    private manufacture(material: HTMLElement): Bullet {
        const display = window.getComputedStyle(material).display; // サブ限などで非表示になっている場合
        const contents = material.querySelector<HTMLElement>(Selectors.chat.contents[this.platform]);
        const core: HTMLElement = document.createElement("div");
        const bullet: Bullet = {
            core: core,
            fired: false,
            width: 0,
            decoration: {
                up: false,
                down: false,
            },
        };

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
