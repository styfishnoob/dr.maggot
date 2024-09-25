export class MapManager<T extends Maps, V extends CompositeType> {
    private storageKey: KeysOfType<Settings, T>;

    constructor(storageKey: KeysOfType<Settings, T>) {
        this.storageKey = storageKey;
    }

    async getMaps(): Promise<T> {
        const record = await browser.storage.local.get(this.storageKey);
        return record[this.storageKey];
    }

    async getMap<K extends keyof T>(key: K): Promise<T[K]> {
        const maps = await this.getMaps();
        return maps[key];
    }

    async get<K extends keyof T>(mapKey: K, key: string): Promise<V | undefined> {
        const map = await this.getMap(mapKey);
        const MAP = new Map(map);
        const entry = MAP.get(key);
        return entry ? (entry as V) : undefined;
    }

    async setMap<K extends keyof T>(mapKey: K, map: T[K]): Promise<T> {
        const maps = await this.getMaps();
        maps[mapKey] = map;
        browser.storage.local.set({ [this.storageKey]: maps });
        return maps;
    }

    async set<K extends keyof T>(mapKey: K, key: string, value: V): Promise<T[K]> {
        const map = await this.getMap(mapKey);
        const MAP = new Map(map).set(key, value);
        const updated = Array.from(MAP) as T[K];
        this.setMap(mapKey, updated);
        return updated;
    }

    async has<K extends keyof T>(mapKey: K, key: string) {
        const map = await this.getMap(mapKey);
        const MAP = new Map(map);
        return MAP.has(key);
    }

    async delete<K extends keyof T>(mapKey: K, key: string): Promise<T[K]> {
        const map = await this.getMap(mapKey);
        const MAP = new Map(map);
        MAP.delete(key);
        const updated = Array.from(MAP) as T[K];
        this.setMap(mapKey, updated);
        return updated;
    }
}
