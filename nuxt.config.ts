import vuetify, {transformAssetUrls} from "vite-plugin-vuetify";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    build: {
        transpile: ["vuetify"],
    },
    app: {
        head: {
            title: "Панель администратора",
            link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        },
    },
    modules: [
        '@nuxt/image',
        '@nuxt/icon',
        "@pinia/nuxt",
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}));
            });
        },],
    css: ["@/assets/css/main.css", "vuetify/styles"],
    routeRules: {
        "/proxy/**": {proxy: import.meta.env.API_BACKEND},
    },
    runtimeConfig: {
        public: {
            apiBase: "",
            logEnv:  JSON.stringify(import.meta.env.API_BACKEND)
        },
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})