<template>
  <v-dialog v-model="popupStore.isActive" max-width="500px">
    <v-card>
      <v-card-title>{{ data.title }}</v-card-title>
      <v-card-text>
        {{ data.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text="Отмена" @click="popupStore.closePopup()"/>
        <v-btn variant="flat" text="Подтвердить" @click="applyHandler()"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { usePopupStore } from "~/stores/usePopup";

const popupStore = usePopupStore();

const props = defineProps({
  data: { type: Object, required: true },
});

const emit = defineEmits(["apply"]);

function applyHandler() {
  if (popupStore.onApply) {
    popupStore.onApply();
  }
  popupStore.closePopup();
}
</script>
