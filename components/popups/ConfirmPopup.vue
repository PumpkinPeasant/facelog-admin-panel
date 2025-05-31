<template>
  <popup-component
      @submit="applyHandler()"
      :title="data.title">

    <template #content>
      <p>{{data.text}}</p>
    </template>
  </popup-component>
</template>

<script setup>
import { usePopupStore } from "~/stores/usePopup";
import PopupComponent from "./PopupComponent.vue";

const popupStore = usePopupStore();

const props = defineProps({
  data: { type: Object, required: true },
});

function applyHandler() {
  if (popupStore.onApply) {
    popupStore.onApply();
  }
  popupStore.closePopup();
}
</script>
