export function isDev() {
    try {
        return import.meta.env.DEV;
    } catch {
        return false;
    }
}
