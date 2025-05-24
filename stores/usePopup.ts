import {defineStore} from "pinia";
import type {Component} from "vue";
import {ref} from "vue";
import {shallowRef} from "@vue/reactivity";

export const usePopupStore = defineStore('popup', () => {
    const isActive = ref(false);
    const component = shallowRef<Component | null>(null);
    const props = ref<Record<string, any>>({});
    const onApply = ref<() => void | null>(null);

    const togglePopup = (popupComponent: Component, popupProps = {}, applyCallback: () => void) => {
        isActive.value = true;
        component.value = popupComponent;
        props.value = popupProps;
        onApply.value = applyCallback;
    };

    const closePopup = () => {
        isActive.value = false;
        component.value = null;
        props.value = {};
        onApply.value = null;
    };

    return {isActive, component, togglePopup, closePopup, props, onApply};
});
