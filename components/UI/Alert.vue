<template>
  <transition-group name="fade" tag="div" class="notification-container">
    <div
        v-for="alert in alertStore.alerts"
        :key="alert.id"
        :class="['notification', `notification--${alert.type}`]"
        @click="alertStore.removeAlert(alert.id)">
      <div class="notification__icon">
        <svg v-if="alert.type === 'success'" class="notification__icon-svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="alert.type === 'error'" class="notification__icon-svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="alert.type === 'warning'" class="notification__icon-svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="notification__icon-svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>

      <div class="notification__content">
        <div class="notification__message">{{ alert.message }}</div>
        <div v-if="alert.status" class="notification__status">{{ alert.status }}</div>
      </div>

      <button class="notification__close icon-btn" @click.stop="alertStore.removeAlert(alert.id)">
        <svg class="notification__close-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import {useAlertStore} from "~/stores/useAlert";

const alertStore = useAlertStore();
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 999999;
  max-width: 400px;
}

@media (max-width: 480px) {
  .notification-container {
    right: var(--spacing-sm);
    left: var(--spacing-sm);
    max-width: none;
  }
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background-color: var(--color-secondary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  min-width: 320px;
  cursor: pointer;
  transition: all 0.2s ease;
}

@media (max-width: 480px) {
  .notification {
    min-width: auto;
    width: 100%;
    padding: var(--spacing-md);
  }
}

.notification:hover {
  background-color: var(--color-accent-dark);
  border-color: var(--color-text-secondary);
}

.notification--success {
  border-left: 4px solid var(--color-success);
}

.notification--error {
  border-left: 4px solid var(--color-danger);
}

.notification--warning {
  border-left: 4px solid #f59e0b;
}

.notification--info {
  border-left: 4px solid var(--color-primary);
}

.notification__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.notification__icon-svg {
  width: 100%;
  height: 100%;
}

.notification--success .notification__icon {
  color: var(--color-success);
}

.notification--error .notification__icon {
  color: var(--color-danger);
}

.notification--warning .notification__icon {
  color: #f59e0b;
}

.notification--info .notification__icon {
  color: var(--color-primary);
}

.notification__content {
  flex: 1;
  min-width: 0;
}

.notification__message {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
}

.notification__status {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.3;
}

.notification__close {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: -0.125rem;
  margin-right: -0.25rem;
}

.notification__close-icon {
  width: 1rem;
  height: 1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>