import { Cartridge, Magazine, DecorationMagazines, StorageAreaOnChangedChangesType } from "./turret-type";
import { applyCommands } from "./decoration-commands";

export class Turret {
    public canvas: HTMLElement;
    private canvasClientHeight: number;
    private rowsNum: number = 0;
    private rowHeight: number = 0;
    private platform: Platforms;
    private settings: Danmaku;
    private normalMagazine: Magazine = [];
    private decorationMagazines: DecorationMagazines = { up: [], down: [] };

    constructor(platform: Platforms, canvas: HTMLElement) {
        this.platform = platform;
        this.canvas = canvas;
        this.canvasClientHeight = this.canvas.clientHeight;
        this.settings = DefaultSettings.Danmaku;
        this.updateSettings();
        this.watch();
    }

    private watcher = {
        storageOnChanged: (changes: StorageAreaOnChangedChangesType) => {
            Object.keys(changes).forEach((key) => {
                if (key === "Danmaku") {
                    this.updateSettings();
                }
            });
        },

        windowResized: () => {
            requestAnimationFrame(() => this.updateSettings());
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
        this.normalMagazine = [];
    }

    private fire() {
        for (let i = 0; i < this.normalMagazine.length; i++) {
            for (let j = 0; j < this.normalMagazine[i].length; j++) {
                if (this.normalMagazine[i][j].fired === false) {
                    const cartridge = this.normalMagazine[i][j];
                    const bullet = cartridge.bullet;
                    cartridge.fired = true;
                    cartridge.width = getWidth(this.canvas, bullet);
                    bullet.style.top = `${this.rowHeight * i}px`;
                    bullet.style.left = `${this.canvas.clientWidth}px`;

                    const animate = cartridge.bullet.animate(
                        [
                            {
                                transform: `translate3d(${-(this.canvas.clientWidth + cartridge.width)}px, 0px, 0px)`,
                            },
                        ],
                        this.settings.time * 1000
                    );

                    animate.onfinish = () => {
                        if (this.normalMagazine[i]) {
                            this.normalMagazine[i] = this.normalMagazine[i].filter(
                                (_cartridge) => _cartridge !== cartridge
                            );
                        }
                        cartridge.bullet.remove();
                    };

                    this.canvas.append(bullet);
                }
            }
        }

        Object.entries(this.decorationMagazines).forEach(([key, magazine]) => {
            for (let i = 0; i < magazine.length; i++) {
                for (let j = 0; j < magazine[i].length; j++) {
                    if (magazine[i][j].fired === false) {
                        const cartridge = magazine[i][j];
                        const bullet = cartridge.bullet;
                        cartridge.fired = true;
                        cartridge.width = getWidth(this.canvas, bullet);

                        if (key == "up") {
                            bullet.style.top = `${this.rowHeight * i}px`;
                        }

                        if (key == "down") {
                            bullet.style.top = `${this.rowHeight * (this.rowsNum - 1) - this.rowHeight * i}px`;
                        }

                        bullet.style.left = `${this.canvas.clientWidth / 2 - cartridge.width / 2}px`;

                        setTimeout(() => {
                            if (magazine[i]) {
                                magazine[i] = magazine[i].filter((_cartridge) => _cartridge !== cartridge);
                            }
                            cartridge.bullet.remove();
                        }, this.settings.time * 1000);

                        this.canvas.append(bullet);
                    }
                }
            }
        });
    }

    public load(material: HTMLElement) {
        if (!this.settings.danmaku[this.platform]) return;

        // 画面の大きさが異なっている場合更新
        const clientHeight = this.canvas.clientHeight;
        if (clientHeight != this.canvasClientHeight) this.updateSettings();

        // 現在装填されている弾幕の数を算出
        const loadedCartridges = this.normalMagazine.reduce((acc, arr) => acc + arr.length, 0);
        if (this.settings.limit > 0 && loadedCartridges >= this.settings.limit) return;

        // 弾幕を生産し、装飾も行う
        const newCartridge = this.manufacture(material);
        if (this.settings.decoration[this.platform]) applyCommands(newCartridge);

        switch (true) {
            case newCartridge.decoration.up: {
                this.loadToDecorationMagazine("up", newCartridge);
                break;
            }

            case newCartridge.decoration.down: {
                this.loadToDecorationMagazine("down", newCartridge);
                break;
            }

            default:
                this.loadToNormalMagazine(newCartridge);
                break;
        }
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
        cartridge.width = getWidth(this.canvas, cartridge.bullet);
        return cartridge;
    }

    private updateSettings() {
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
            this.canvasClientHeight = this.canvas.clientHeight;
            this.normalMagazine = [];
            this.decorationMagazines = { up: [], down: [] };
            this.rowHeight = getHeight(this.canvas);
            this.rowsNum = Math.floor(this.canvas.clientHeight / this.rowHeight);

            for (let i = 0; i < this.rowsNum; i++) {
                this.normalMagazine.push([]);
                this.decorationMagazines.up.push([]);
                this.decorationMagazines.down.push([]);
            }

            if (!this.settings.danmaku[this.platform]) {
                while (this.canvas.firstChild) this.canvas.firstChild.remove();
            }
        })();
    }

    private loadToNormalMagazine(newCartridge: Cartridge) {
        for (let i = 0; i <= this.normalMagazine.length; i++) {
            // 全ての行に入れられなかった場合、最後のコメントの位置が最もゴールに違い行に追加
            if (i === this.normalMagazine.length) {
                let min = 0;
                for (let j = 1; j < this.normalMagazine.length; j++) {
                    const minLastCartridge = this.normalMagazine[min][this.normalMagazine[min].length - 1];
                    const lastCartridge = this.normalMagazine[j][this.normalMagazine[j].length - 1];
                    const min_lc_pos_x = getPosX(this.canvas, minLastCartridge.bullet) + minLastCartridge.width;
                    const lc_pos_x = getPosX(this.canvas, lastCartridge.bullet) + lastCartridge.width;
                    if (lc_pos_x <= min_lc_pos_x) {
                        min = j;
                    }
                }
                this.normalMagazine[min].push(newCartridge);
                this.fire();
                return;
            }

            const lastCartridge = this.normalMagazine[i][this.normalMagazine[i].length - 1];

            switch (true) {
                case this.normalMagazine[i].length > 100: {
                    while (this.normalMagazine[i].length > 100) {
                        this.normalMagazine[i].shift();
                    }
                }

                case lastCartridge === undefined:
                case this.checkCollision(newCartridge, lastCartridge): {
                    this.normalMagazine[i].push(newCartridge);
                    this.fire();
                    return;
                }

                default: {
                    continue;
                }
            }
        }
    }

    private loadToDecorationMagazine(key: keyof DecorationMagazines, newCartridge: Cartridge) {
        const decorationMagazine = this.decorationMagazines[key];
        for (let i = 0; i <= decorationMagazine.length; i++) {
            if (i === decorationMagazine.length) {
                let min = 0;
                for (let j = 1; j < decorationMagazine.length; j++) {
                    if (decorationMagazine[min].length > decorationMagazine[j].length) {
                        min = j;
                    }
                }
                decorationMagazine[min].push(newCartridge);
                this.fire();
                return;
            }

            if (decorationMagazine[i].length === 0) {
                decorationMagazine[i].push(newCartridge);
                this.fire();
                return;
            }
        }
    }

    private checkCollision(newCartridge: Cartridge, lastCartridge: Cartridge) {
        // 衝突しない -> true 衝突する -> false
        const nc_width = newCartridge.width;
        const lc_width = lastCartridge.width;

        // キャンバスの横幅とコメントの横幅を足して実際に流れる距離を計算
        const nc_travel_distance = this.canvas.clientWidth + nc_width;
        const lc_travel_distance = this.canvas.clientWidth + lc_width;

        const nc_speed = nc_travel_distance / this.settings.time;
        const lc_speed = lc_travel_distance / this.settings.time;

        const lc_pos_x = getPosX(this.canvas, lastCartridge.bullet) + lc_width; // コメントの右端を基準にしたいため、コメントの横幅を足す
        const lc_traveled = lc_travel_distance - lc_pos_x;
        const lc_elapsed_time = lc_traveled / lc_speed;
        const lc_is_appeared = lc_traveled >= lc_width;
        const lc_time_to_appear = lc_width / lc_speed; // 完全にコメントが表示されるまでの時間(コメントの右端がスタートラインに触れるまで)

        // lc が完全に表示されていない場合
        if (!lc_is_appeared) return false;

        // nc　の速度が lc より遅い場合
        if (nc_speed <= lc_speed) return true;

        // catch_up_time は nc が lc に追いつくまでの時間
        // lc_elapsed_time - lc_time_to_appear は　lc が完全に表示されてから何秒経過したか
        // つまり、コメントの右端基準で経過時間を測定している
        const catch_up_time = (lc_speed * (lc_elapsed_time - lc_time_to_appear)) / (nc_speed - lc_speed);
        return lc_is_appeared && catch_up_time >= this.settings.time - lc_elapsed_time;
    }
}

function getWidth(canvas: HTMLElement, bullet: HTMLElement): number {
    const clone = bullet.cloneNode(true) as HTMLElement;
    clone.className = "drmaggot__danmaku-check";
    canvas.append(clone);
    const result = clone.clientWidth;
    clone.remove();
    return result;
}

function getPosX(canvas: HTMLElement, bullet: HTMLElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const cartridgeRect = bullet.getBoundingClientRect();
    return cartridgeRect.left - canvasRect.left;
}

function getHeight(canvas: HTMLElement): number {
    const div = document.createElement("div");
    div.textContent = "TESTHEIGHT";
    div.className = "drmaggot__danmaku-check";
    canvas.append(div);
    const result = div.clientHeight;
    div.remove();
    return result;
}
