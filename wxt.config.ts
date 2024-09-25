import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        name: "Dr.Maggot",
        description: "__MSG_extension_description__",
        default_locale: "ja",
        permissions: ["storage", "contextMenus", "scripting"],
    },
});
