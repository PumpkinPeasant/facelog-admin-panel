<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  imageUrl: string;
  userName?: string;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLElement>();
const imageRef = ref<HTMLImageElement>();
const isLoaded = ref(false);
const isClosing = ref(false);

// Закрытие по ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === modalRef.value) {
    closeModal();
  }
};

const closeModal = () => {
  isClosing.value = true;
  setTimeout(() => {
    emit('close');
    isClosing.value = false;
  }, 200); // Время анимации закрытия
};

const handleImageLoad = () => {
  isLoaded.value = true;
};

const downloadImage = () => {
  const link = document.createElement('a');
  link.href = props.imageUrl;
  link.download = `${props.userName || 'user'}_photo.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  if (props.imageUrl) {
    const img = new Image();
    img.onload = handleImageLoad;
    img.src = props.imageUrl;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
        name="modal"
        :duration="{ enter: 300, leave: 200 }">
      <div
          v-if="isOpen"
          ref="modalRef"
          class="photo-modal-overlay"
          :class="{ 'photo-modal-overlay--closing': isClosing }"
          @click="handleBackdropClick">
        <div class="photo-modal">
          <div class="photo-modal__header">
            <div class="photo-modal__title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span>{{ userName ? `Фото: ${userName}` : 'Просмотр фото' }}</span>
            </div>

            <div class="photo-modal__controls">
              <button
                  @click="downloadImage"
                  class="icon-btn"
                  title="Скачать изображение">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>

              <button
                  @click="closeModal"
                  class="icon-btn"
                  title="Закрыть">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="photo-modal__content">
            <div v-if="!isLoaded" class="photo-modal__loader">
              <div class="loader-spinner"></div>
              <span>Загрузка изображения...</span>
            </div>

            <Transition name="image-fade">
              <img
                  v-if="isLoaded"
                  ref="imageRef"
                  :src="imageUrl"
                  :alt="userName || 'User photo'"
                  class="photo-modal__image"
                  @error="isLoaded = false" />
            </Transition>
          </div>

          <div class="photo-modal__hint">
            <span>ESC для закрытия • Клик вне изображения для закрытия</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.photo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.photo-modal {
  background-color: var(--color-secondary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.photo-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-accent-dark);
}

.photo-modal__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.photo-modal__controls {
  display: flex;
  gap: var(--spacing-sm);
}

.photo-modal__content {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: var(--color-primary-dark);
}

.photo-modal__loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.photo-modal__image {
  max-width: 100%;
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.photo-modal__hint {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-accent-dark);
}

/* Анимации */
.modal-enter-active {
  transition: all 0.3s ease;
}

.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .photo-modal {
  transform: scale(0.8) translateY(20px);
}

.modal-leave-to .photo-modal {
  transform: scale(0.9) translateY(-10px);
}

.modal-enter-to .photo-modal,
.modal-leave-from .photo-modal {
  transform: scale(1) translateY(0);
}

.image-fade-enter-active {
  transition: opacity 0.3s ease;
}

.image-fade-enter-from {
  opacity: 0;
}

.image-fade-enter-to {
  opacity: 1;
}

/* Адаптивность */
@media (max-width: 768px) {
  .photo-modal-overlay {
    padding: var(--spacing-md);
  }

  .photo-modal {
    max-width: 95vw;
    max-height: 95vh;
  }

  .photo-modal__header {
    padding: var(--spacing-md);
  }

  .photo-modal__title {
    font-size: var(--font-size-base);
  }

  .photo-modal__title span {
    display: none;
  }

  .photo-modal__image {
    max-height: 60vh;
  }

  .photo-modal__hint {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .photo-modal-overlay {
    padding: var(--spacing-sm);
  }

  .photo-modal__header {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .photo-modal__controls {
    gap: var(--spacing-xs);
  }

  .photo-modal__image {
    max-height: 50vh;
  }

  .photo-modal__hint span {
    display: none;
  }
}
</style>