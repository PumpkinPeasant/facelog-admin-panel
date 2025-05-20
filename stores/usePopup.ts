import {defineStore} from "pinia";
import type {Component} from "vue";

export const usePopupStore
    = defineStore('popup', () => {

    const isActive = ref(false);
    const component = shallowRef<Component | null>(null);
    const props = ref<Record<string, any>>({});

    const togglePopup = (popupComponent: Component, popupProps = {}) => {
        isActive.value = true;
        component.value = popupComponent;
        props.value = popupProps;
    }

    const closePopup = () => {
        isActive.value = false;
        component.value = null;
        props.value = {};
    }


    return {isActive, component, togglePopup, closePopup, props}
})