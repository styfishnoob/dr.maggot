type Cartridge = {
    bullet: HTMLElement;
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
    private magazine: Cartridge[][] = [];
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
                    const cartridge = this.magazine[i][j];
                    const bullet = cartridge.bullet;
                    cartridge.fired = true;
                    cartridge.width = this.getWidth(bullet);

                    switch (true) {
                        case cartridge.decoration.up: {
                            // 重なる場合下へ表示するように
                            bullet.style.top = `0px`;
                            bullet.style.left = `${this.canvas.clientWidth / 2 - cartridge.width / 2}px`;
                            this.canvas.append(bullet);
                            setTimeout(() => bullet.remove(), this.settings.time * 1000);
                            return;
                        }

                        case cartridge.decoration.down: {
                            // 重なる場合上へ表示するように
                            bullet.style.top = `${this.canvas.clientHeight - this.rowHeight}px`;
                            bullet.style.left = `${this.canvas.clientWidth / 2 - cartridge.width / 2}px`;
                            this.canvas.append(bullet);
                            setTimeout(() => bullet.remove(), this.settings.time * 1000);
                            return;
                        }

                        default: {
                            bullet.style.top = `${this.rowHeight * i}px`;
                            bullet.style.left = `${this.canvas.clientWidth}px`;
                        }
                    }

                    const animate = cartridge.bullet.animate(
                        [
                            {
                                transform: `translate3d(${-(this.canvas.clientWidth + cartridge.width)}px, 0px, 0px)`,
                            },
                        ],
                        this.settings.time * 1000
                    );

                    animate.onfinish = () => {
                        if (this.magazine[i]) {
                            this.magazine[i] = this.magazine[i].filter((_cartridge) => _cartridge !== cartridge);
                        }
                        cartridge.bullet.remove();
                    };

                    this.canvas.append(bullet);
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

        const loadedCartridges = this.magazine.reduce((acc, arr) => acc + arr.length, 0);
        dcon.log(loadedCartridges, this.settings.limit);
        if (this.settings.limit > 0 && loadedCartridges >= this.settings.limit) return;
        dcon.log("A");

        const newCartridge = this.manufacture(material);
        this.decoration(newCartridge);

        for (let i = 0; i <= this.magazine.length; i++) {
            // 全ての行に入れられなかった場合、最後のコメントの位置が最もゴールに違い行に追加
            if (i === this.magazine.length) {
                let min = 0;
                for (let j = 1; j < this.magazine.length; j++) {
                    const minLastCartridge = this.magazine[min][this.magazine[min].length - 1];
                    const lastCartridge = this.magazine[j][this.magazine[j].length - 1];
                    const min_lb_pos_x = this.getPosX(minLastCartridge.bullet) + minLastCartridge.width;
                    const lb_pos_x = this.getPosX(lastCartridge.bullet) + lastCartridge.width;
                    if (lb_pos_x <= min_lb_pos_x) {
                        min = j;
                    }
                }
                this.magazine[min].push(newCartridge);
                this.fire();
                return;
            }

            const lastCartridge = this.magazine[i][this.magazine[i].length - 1];
            switch (true) {
                case this.magazine[i].length > 100: {
                    while (this.magazine[i].length > 100) {
                        this.magazine[i].shift();
                    }
                }

                case lastCartridge === undefined:
                case this.checkCollision(newCartridge, lastCartridge): {
                    this.magazine[i].push(newCartridge);
                    this.fire();
                    return;
                }

                default: {
                    continue;
                }
            }
        }
    }

    private decoration(cartridge: Cartridge) {
        const firstChild = cartridge.bullet.firstChild;
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
                        cartridge.decoration.up = true;
                        cartridge.decoration.down = false;
                        break;
                    case "dw":
                        cartridge.decoration.up = false;
                        cartridge.decoration.down = true;
                        break;
                    case "wh":
                        cartridge.bullet.style.color = "white";
                        break;
                    case "re":
                        cartridge.bullet.style.color = "red";
                        break;
                    case "pi":
                        cartridge.bullet.style.color = "pink";
                        break;
                    case "or":
                        cartridge.bullet.style.color = "orange";
                        break;
                    case "yw":
                        cartridge.bullet.style.color = "yellow";
                        break;
                    case "gr":
                        cartridge.bullet.style.color = "green";
                        break;
                    case "cy":
                        cartridge.bullet.style.color = "cyan";
                        break;
                    case "bu":
                        cartridge.bullet.style.color = "blue";
                        break;
                    case "pu":
                        cartridge.bullet.style.color = "purple";
                        break;
                    case "bl":
                        cartridge.bullet.style.color = "black";
                        break;
                    default:
                        dcon.log(`登録されていないコマンドです: ${lowered}`);
                }
            }
        });
    }

    private manufacture(material: HTMLElement): Cartridge {
        const display = window.getComputedStyle(material).display; // サブ限などで非表示になっている場合
        const contents = material.querySelector<HTMLElement>(Selectors.chat.contents[this.platform]);
        const bullet: HTMLElement = document.createElement("div");
        const cartridge: Cartridge = {
            bullet: bullet,
            fired: false,
            width: 0,
            decoration: {
                up: false,
                down: false,
            },
        };

        if (!contents || contents.hidden || material.hidden || display === "none") return cartridge;
        bullet.style.height = `${this.rowHeight}px`;

        contents.childNodes.forEach((child) => {
            const c = child as HTMLElement;
            switch (true) {
                case c.nodeName === "#text": {
                    const span = document.createElement("span");
                    span.textContent = c.textContent;
                    bullet.append(span);
                    break;
                }

                case c.matches(Selectors.chat.messages[this.platform]): {
                    const clone = c.cloneNode(true);
                    bullet.append(clone);
                    break;
                }

                case c.matches(Selectors.chat.emotes[this.platform]): {
                    const img = c as HTMLImageElement;
                    const clone = img.cloneNode(true) as HTMLImageElement;
                    clone.width = img.width;
                    clone.height = img.height;
                    bullet.append(clone);
                    break;
                }

                case !!c.querySelector(Selectors.chat.emotes[this.platform]): {
                    const clone = c.cloneNode(true);
                    bullet.append(clone);
                    break;
                }
            }
        });

        cartridge.bullet = bullet;
        cartridge.bullet.className = "drmaggot__danmaku-bullet";
        cartridge.width = this.getWidth(cartridge.bullet);
        return cartridge;
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

    private checkCollision(newCartridge: Cartridge, lastCartridge: Cartridge) {
        // 衝突しない -> true 衝突する -> false
        const nb_width = newCartridge.width;
        const lb_width = lastCartridge.width;

        // キャンバスの横幅とコメントの横幅を足して実際に流れる距離を計算
        const nb_travel_distance = this.canvas.clientWidth + nb_width;
        const lb_travel_distance = this.canvas.clientWidth + lb_width;

        const nb_speed = nb_travel_distance / this.settings.time;
        const lb_speed = lb_travel_distance / this.settings.time;

        const lb_pos_x = this.getPosX(lastCartridge.bullet) + lb_width; // コメントの右端を基準にしたいため、コメントの横幅を足す
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
        return lb_is_appeared && catch_up_time >= this.settings.time - lb_elapsed_time;
    }

    private getWidth(bullet: HTMLElement): number {
        const clone = bullet.cloneNode(true) as HTMLElement;
        clone.className = "drmaggot__danmaku-check";
        this.canvas.append(clone);
        const result = clone.clientWidth;
        clone.remove();
        return result;
    }

    private getPosX(bullet: HTMLElement) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const cartridgeRect = bullet.getBoundingClientRect();
        return cartridgeRect.left - canvasRect.left;
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
