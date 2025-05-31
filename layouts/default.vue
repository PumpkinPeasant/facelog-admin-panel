<script setup lang="ts">
import AppHeader from "~/components/UI/AppHeader.vue";
import {usePopupStore} from "~/stores/usePopup";
import Alert from "~/components/UI/Alert.vue";

const popupStore = usePopupStore();
</script>

<template>
  <v-app class="app">
    <AppHeader/>
    <v-main class="main">
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
.app {
  font-family: var(--font-family);
  background-color: var(--color-primary-dark);
  color: var(--color-text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: var(--spacing-xl) 10rem;
}

@media (max-width: 768px) {
  .main {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .main {
    padding: var(--spacing-md) var(--spacing-sm);
  }
}
</style>