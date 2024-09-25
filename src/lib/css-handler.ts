type CSSHandler = {
    add: () => void;
    rm: () => void;
    check: (b: boolean) => void;
};

export function CSSHandler(id: string, css: string): CSSHandler {
    const ctx = new ContentScriptContext('CSSHandler');
    const ui = createIntegratedUi(ctx, {
        position: 'inline',
        onMount: () => {
            const style = document.createElement('style');
            style.id = `drmaggot__${id}`;
            style.textContent = `${css}`;
            const clone = style.cloneNode(true);
            document.head.append(style);
            window.parent.document.head.append(clone);
        },
    });

    return {
        add() {
            ui.mount();
        },
        rm() {
            const styles = document.querySelectorAll(`#drmaggot__${id}`);
            styles.forEach((style) => style.remove());
        },
        check(b) {
            if (b) {
                this.add();
            } else {
                this.rm();
            }
        },
    };
}
