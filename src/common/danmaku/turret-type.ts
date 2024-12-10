export type Cartridge = {
    bullet: HTMLElement;
    fired: boolean;
    width: number;
    decoration: {
        up: boolean;
        down: boolean;
    };
};

export type Magazine = Cartridge[][];

export type DecorationMagazines = {
    up: Magazine;
    down: Magazine;
};

export type StorageChange = {
    oldValue?: any;
    newValue?: any;
};

export type StorageAreaOnChangedChangesType = {
    [key: string]: StorageChange;
};
