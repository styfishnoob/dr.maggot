import { Cartridge } from "./turret-type";

enum DecorationCommands {
    up = "up", // 上中央表示
    down = "down", // 下中央表示
    white = "white", // ホワイト
    red = "red", // レッド
    pink = "pink", // ピンク
    orange = "orange", //　オレンジ
    yellow = "yellow", //　イエロー
    green = "green", //　グリーン
    cyan = "cyan", //　シアン
    blue = "blue", //　ブルー
    purple = "purple", //　パープル
    black = "black", //　ブラック
}

const commandHandlers: Record<DecorationCommands, (cartridge: Cartridge) => void> = {
    [DecorationCommands.up]: (cartridge) => (cartridge.decoration.up = true),
    [DecorationCommands.down]: (cartridge) => (cartridge.decoration.down = true),
    [DecorationCommands.white]: (cartridge) => (cartridge.bullet.style.color = "white"),
    [DecorationCommands.red]: (cartridge) => (cartridge.bullet.style.color = "red"),
    [DecorationCommands.pink]: (cartridge) => (cartridge.bullet.style.color = "pink"),
    [DecorationCommands.orange]: (cartridge) => (cartridge.bullet.style.color = "orange"),
    [DecorationCommands.yellow]: (cartridge) => (cartridge.bullet.style.color = "yellow"),
    [DecorationCommands.green]: (cartridge) => (cartridge.bullet.style.color = "green"),
    [DecorationCommands.cyan]: (cartridge) => (cartridge.bullet.style.color = "cyan"),
    [DecorationCommands.blue]: (cartridge) => (cartridge.bullet.style.color = "blue"),
    [DecorationCommands.purple]: (cartridge) => (cartridge.bullet.style.color = "purple"),
    [DecorationCommands.black]: (cartridge) => (cartridge.bullet.style.color = "black"),
};

export function applyCommands(cartridge: Cartridge) {
    const firstChild = cartridge.bullet.firstChild;
    if (!firstChild || !firstChild.textContent || firstChild.nodeName != "SPAN") return;

    const CommandRegex = /^\[(.*?)\]/;
    const match = firstChild.textContent.match(CommandRegex);

    if (!match) {
        dcon.warn("[dr.maggot]: コマンド正規表現にマッチしませんでした。", firstChild.textContent);
        return;
    }

    const commands = parseCommands(match[1]);
    commands.forEach((cmd) => {
        if (commandHandlers[cmd]) {
            commandHandlers[cmd](cartridge);
        } else {
            dcon.warn("[dr.maggot]: 未定義のコマンドが指定されました。", cmd);
        }
    });

    firstChild.textContent = firstChild.textContent.replace(CommandRegex, "");
}

function parseCommands(commandText: string) {
    const parsed: DecorationCommands[] = [];
    const loweredCommands = commandText.toLowerCase();

    Object.values(DecorationCommands).forEach((cmd) => {
        if (loweredCommands.includes(cmd)) {
            parsed.push(cmd);
        }
    });

    return parsed;
}
