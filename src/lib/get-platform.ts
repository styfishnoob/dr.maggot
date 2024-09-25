export function getPlatform(url?: string): SupportedPlatforms | undefined {
    const URL = url ? url : location.href;
    switch (true) {
        case check(URL, /youtube\.com\/live_chat\?.+$/):
        case check(URL, /youtube\.com\/live_chat_replay\?.+$/): {
            return "youtube";
        }

        case check(URL, /twitch\.tv(\/.*)/):
        case check(URL, /twitch\.tv\/videos\/.+$/): {
            return "twitch";
        }

        case check(URL, /openrec\.tv(\/.*)/): {
            return "openrec";
        }

        case check(URL, /twitcasting\.tv(\/.*)/): {
            return "twicas";
        }

        default:
            return undefined;
    }
}

function check(url: string, regex: RegExp): boolean {
    return url.match(regex) ? true : false;
}
