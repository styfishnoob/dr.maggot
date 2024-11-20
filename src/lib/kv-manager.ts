import { Unwatch } from "wxt/storage";

type StorageChange = {
    oldValue?: any;
    newValue?: any;
};

type StorageChanges = { [key in string]: StorageChange };

type StorageOnChange = (change: StorageChange) => void;

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

    observe(onChange: StorageOnChange): Unwatch {
        const listener = (changes: StorageChanges) => {
            const change = changes[this.key];
            if (change) {
                const nv = change.newValue as T;
                const ov = change.oldValue as T;
                if (JSON.stringify(nv[this.key]) !== JSON.stringify(ov[this.key])) onChange(change);
            }
        };

        browser.storage.local.onChanged.addListener(listener);
        return () => browser.storage.local.onChanged.removeListener(listener);
    }

    observeItem<K extends keyof T>(key: K, onChange: StorageOnChange): Unwatch {
        const listener = (changes: StorageChanges) => {
            const change = changes[this.key];
            if (change) {
                const nv = change.newValue as T;
                const ov = change.oldValue as T;
                if (JSON.stringify(nv[key]) !== JSON.stringify(ov[key])) onChange(change);
            }
        };

        browser.storage.local.onChanged.addListener(listener);
        return () => browser.storage.local.onChanged.removeListener(listener);
    }
}
