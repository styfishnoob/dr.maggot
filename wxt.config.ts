import { defineConfig } from 'wxt';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "Dr.Maggot",
    description: "DESCRIPTION",
    permissions: ["storage", "fontSettings"],
  },
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
  webExt: {
    disabled: true,
  },
});
