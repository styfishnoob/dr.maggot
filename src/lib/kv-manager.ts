export class KVManager<T extends KeyValue> {
    private key: KeysOfType<Settings, KeyValue>;

    constructor(key: KeysOfType<Settings, KeyValue>) {
        this.key = key;
    }

    async get(): Promise<T> {
        const obj = await browser.storage.local.get(this.key);
        if (Object.entries(obj).length === 0) {
            throw new Error(`[Dr.Maggot] KVStorage cannot get ${this.key}`);
        }
        return obj[this.key];
    }

    async getItem<U>(key: KeysOfType<T, U>): Promise<U> {
        const kv = await this.get();
        return kv[key] as U;
    }

    async set(kv: T): Promise<void> {
        await browser.storage.local.set({ [this.key]: kv });
    }

    async setItem<U>(key: KeysOfType<T, U>, newItem: U): Promise<void> {
        const kv = await this.get();
        (kv[key] as U) = newItem;
        await this.set(kv);
    }

    async observeItem<K extends keyof T>(key: K, callback: () => void): Promise<void> {
        browser.storage.local.onChanged.addListener((changes) => {
            const c = changes[this.key];
            if (c) {
                const nv = c.newValue as T;
                const ov = c.oldValue as T;
                if (JSON.stringify(nv[key]) !== JSON.stringify(ov[key])) callback();
            }
        });
    }
}
