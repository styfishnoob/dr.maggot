type DCon = {
    assert: (value: any, message?: string, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    log: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
};

export const dcon: DCon = {
    assert(v, m, ...op) {
        if (isDev()) {
            console.assert(v, m, ...op);
        }
    },
    error(m, ...op) {
        if (isDev()) {
            console.error(m, ...op);
        }
    },
    log(m, ...op) {
        if (isDev()) {
            console.log(m, ...op);
        }
    },
    warn(m, ...op) {
        if (isDev()) {
            console.warn(m, ...op);
        }
    },
};
