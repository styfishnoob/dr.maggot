type ObserverMainCallback = (e: HTMLElement) => void;
type ObserverStopCallback = () => void;

type ObserverCallbacks = {
    main: ObserverMainCallback;
    stop?: ObserverStopCallback;
};

type ObserverConfig = {
    selector: string;
    callbacks: ObserverCallbacks;
};

const OBSERVER = (target: HTMLElement, callback: (records: MutationRecord[]) => void) => {
    const observer = new MutationObserver(callback);
    return {
        start: () => {
            observer.observe(target, { childList: true, subtree: true, attributes: true });
        },
        stop: () => {
            observer.disconnect();
        },
    };
};

export class DOMObserver {
    private observer: ReturnType<typeof OBSERVER>;
    private addedSet = new Set<ObserverConfig>();
    private attributeSet = new Set<ObserverConfig>();

    constructor(target?: HTMLElement) {
        this.observer = OBSERVER(target ? target : document.documentElement, (records) =>
            this.exe.main(records)
        );
        this.observer.start();
    }

    stop() {
        this.addedSet.forEach((config) => (config.callbacks.stop ? config.callbacks.stop() : ""));
        this.attributeSet.forEach((config) =>
            config.callbacks.stop ? config.callbacks.stop() : ""
        );
        this.observer.stop();
    }

    public add = {
        added: (selector: string, callbacks: ObserverCallbacks) => {
            const config = { selector: selector, callbacks: callbacks };
            this.addedSet.add(config);
            return () => this.addedSet.delete(config);
        },
        attributes: (selector: string, callbacks: ObserverCallbacks) => {
            const config = { selector: selector, callbacks: callbacks };
            this.attributeSet.add(config);
            return () => this.attributeSet.delete(config);
        },
    };

    private exe = {
        main: function (records: MutationRecord[]) {
            records.forEach((record) => {
                switch (record.type) {
                    case "childList": {
                        this.childList(record);
                        break;
                    }
                    case "attributes": {
                        this.attributes(record);
                    }
                }
            });
        },

        childList: (record: MutationRecord) => {
            record.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;

                this.addedSet.forEach((config) => {
                    if (node.matches(config.selector)) config.callbacks.main(node);
                    node.querySelectorAll<HTMLElement>(config.selector).forEach((e) =>
                        config.callbacks.main(e)
                    );
                });
            });
        },

        attributes: (record: MutationRecord) => {
            const node = record.target;
            if (!(node instanceof HTMLElement)) return;

            this.attributeSet.forEach((config) => {
                if (node.matches(config.selector)) {
                    config.callbacks.main(node);
                }
            });
        },
    };
}
