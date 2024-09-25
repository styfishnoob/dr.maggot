type RegExpResult = [false, string] | [true, RegExp];

export function isRegExp(text: string): RegExpResult {
    function test(): boolean {
        return /^\/.*\/[gimsuy]*$/.test(text);
    }

    if (test()) {
        try {
            const parts = text.match(/^\/(.*)\/([gimsuy]*)$/);
            if (parts) return [true, new RegExp(parts[1], parts[2])];
            else return [false, text];
        } catch {
            return [false, text];
        }
    } else {
        return [false, text];
    }
}
