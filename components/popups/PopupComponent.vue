<template>
  <div v-if="popupStore.isActive" class="popup-overlay">
    <div class="popup-dialog" @click.stop>

      <div class="popup-header">
        <slot name="header">
          <h2 class="popup-title">
            {{ title }}
          </h2>
        </slot>
      </div>

      <div class="popup-content">
        <slot name="content"/>
      </div>

      <div class="popup-actions">
        <button type="button" class="btn-cancel" @click="popupStore.closePopup()">
          Отмена
        </button>
        <button type="button" class="btn-primary" @click="submit">
          {{ submitBtnText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {usePopupStore} from "~/stores/usePopup";

const popupStore = usePopupStore();
const emit = defineEmits(["submit"]);

const props = defineProps({
  title: {type: String, default: 'Заголовок'},
  submitBtnText: {type: String, default: 'Подтвердить'},
})

function submit() {
  emit("submit");
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.popup-dialog {
  background-color: var(--color-primary-dark);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  font-family: var(--font-family);
}

.popup-header {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xl);
}

.popup-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xl) 0;
  text-align: center;
}

.popup-content {
  padding: 0 var(--spacing-xl);
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-xl);
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-lg);
  transition: all 0.2s ease;
  font-family: var(--font-family);
}

.btn-cancel:hover {
  background-color: var(--color-secondary-dark);
  border-color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .popup-overlay {
    padding: var(--spacing-md);
  }

  .popup-dialog {
    max-height: 95vh;
  }

  .popup-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-primary {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
  }
}
</style>