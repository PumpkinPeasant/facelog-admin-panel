<script setup lang="ts">
import AppHeader from "~/components/UI/AppHeader.vue";
import {usePopupStore} from "~/stores/usePopup";
import Alert from "~/components/UI/Alert.vue";

const popupStore = usePopupStore();
</script>

<template>
  <div class="app">
    <AppHeader/>
    <main class="main">
      <component
          v-if="popupStore.isActive"
          :is="popupStore.component"
          v-bind="popupStore.props"/>
      <slot/>
    </main>
    <alert/>
  </div>
</template>

<style scoped>

</style>