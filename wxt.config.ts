import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: "chrome",
    modules: ["@wxt-dev/module-react"],
    manifest: {
        name: "Dr.Maggot",
        description: "__MSG_extension_description__",
        default_locale: "ja",
        permissions: ["storage"],
    },
});
