<script setup lang="ts">
import AppHeader from "~/components/UI/AppHeader.vue";
import {usePopupStore} from "~/stores/usePopup";
import Alert from "~/components/UI/Alert.vue";

const popupStore = usePopupStore();
</script>

<template>
  <v-app>
    <AppHeader/>
    <v-main>
      <component
          v-if="popupStore.isActive"
          :is="popupStore.component"
          v-bind="popupStore.props"/>
      <slot/>
    </v-main>
    <alert/>
  </v-app>
</template>

<style scoped>

</style>