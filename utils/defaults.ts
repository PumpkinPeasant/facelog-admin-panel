//@ts-ignore
import type { DefaultsInstance } from "vuetify";

export const defaults: DefaultsInstance = {
    VBtn: {
        variant: "flat",
        // height: 38,
        rounded: true,
        size: "large",
    },
    VTextField: {
        color: "primary",
        variant: "outlined",
        density: "comfortable",
    },
    VAppBar: {
        VToolbar: {
            elevation: 0,
        },
    },
    VCard: {
        elevation: 0
    },
    VSearch: {
        prependInnerIcon: 'mdi-magnify',
        color: "rgba(0,0,0,0)",
        variant: "outlined",
        label: 'Поиск',
        hideDetails: true,
        bgColor: 'surface',
        baseColor: "rgba(0,0,0,0)",
        rounded: true
    },
};
