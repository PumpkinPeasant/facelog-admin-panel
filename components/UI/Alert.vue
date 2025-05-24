<template>
  <transition-group name="fade" tag="div" class="notification-container">
    <v-alert
        @click="alertStore.removeAlert(alert.id)"
        v-for="alert in alertStore.alerts"
        :title="alert.message"
        :text="alert.status"
        :type="alert.type"
        :key="alert.id"
        class="notification"
    >
    </v-alert>
  </transition-group>
</template>

<script setup lang="ts">
import {useAlertStore} from "~/stores/useAlert";

const alertStore = useAlertStore();

</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 999999;
}

.notification {
  margin-bottom: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>