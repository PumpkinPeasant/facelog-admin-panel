<template>
  <popup-component
      @submit="submit"
      :submit-btn-text="isEditMode ? 'Применить' : 'Создать'"
      :title="isEditMode ? 'Редактирование пользователя' : 'Создание пользователя'">

    <template #content>
      <div class="avatar-section">
        <div class="avatar-container" @click="triggerFileInput">
          <img
              :src="photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : 'images/empty.jpg'"
              alt="Фото"
              class="avatar-image"
          />
          <div class="avatar-overlay">
            <svg class="camera-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" fill-rule="evenodd"
                    d="M7.72 2.79L5.5 5.75a1.25 1.25 0 0 1-1 .5H4A2.75 2.75 0 0 0 1.25 9v10A2.75 2.75 0 0 0 4 21.75h16A2.75 2.75 0 0 0 22.75 19V9A2.75 2.75 0 0 0 20 6.25h-.5a1.25 1.25 0 0 1-1-.5l-2.22-2.96a1.35 1.35 0 0 0-1.08-.54H8.8c-.425 0-.825.2-1.08.54M12 8.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5"
                    clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <form class="form" @submit.prevent="submit">
        <div class="input-group">
          <label class="input-label">
            <svg class="input-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                  d="M6,17C6,15 10,13.9 12,13.9C14,13.9 18,15 18,17V18H6M15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6A3,3 0 0,1 15,9M3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5A2,2 0 0,0 3,5Z"/>
            </svg>
            Имя пользователя
          </label>
          <input
              v-model="name"
              type="text"
              class="text-input"
              placeholder="Введите имя пользователя"
              required
          />
        </div>

        <div class="input-group">
          <label class="input-label">
            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" fill-rule="evenodd"
                    d="M7.72 2.79L5.5 5.75a1.25 1.25 0 0 1-1 .5H4A2.75 2.75 0 0 0 1.25 9v10A2.75 2.75 0 0 0 4 21.75h16A2.75 2.75 0 0 0 22.75 19V9A2.75 2.75 0 0 0 20 6.25h-.5a1.25 1.25 0 0 1-1-.5l-2.22-2.96a1.35 1.35 0 0 0-1.08-.54H8.8c-.425 0-.825.2-1.08.54M12 8.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5"
                    clip-rule="evenodd"/>
            </svg>
            Загрузите фото
          </label>
          <input
              ref="fileInput"
              type="file"
              class="file-input"
              accept="image/*"
              @change="convertToBase64"
          />
          <div class="file-input-display" @click="triggerFileInput">
            <span v-if="photo">{{ photo.name }}</span>
            <span v-else class="file-placeholder">Выберите файл...</span>
          </div>
        </div>
      </form>
    </template>
  </popup-component>
</template>

<script setup lang="ts">
import {onMounted, ref, computed} from 'vue';
import {useFaceStore} from "~/stores/useFace.js";
import {usePopupStore} from "~/stores/usePopup";
import {toBase64} from "~/utils/base64";
import PopupComponent from "~/components/popups/PopupComponent.vue";

const faceStore = useFaceStore();
const name = ref('');
const photo = ref<File | null>(null);
const photoBase64 = ref('');
const fileInput = ref<HTMLInputElement>();

const popupStore = usePopupStore();

interface UserData {
  id: string;
  name: string;
  photo: string;
}

const props = defineProps<{
  userData?: UserData;
}>();

async function convertToBase64(event: Event) {
  try {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    photo.value = file;
    photoBase64.value = await toBase64(file);
  } catch (e) {
    console.error("Ошибка при конвертации в base64:", e);
  }
}

async function submit() {
  if (!name.value || !photoBase64.value) {
    alert('Пожалуйста, заполните имя и выберите фото.');
    return;
  }

  if (isEditMode.value && props.userData) {
    await faceStore.updateFace(props.userData.id, name.value, photoBase64.value).then(() => {
      popupStore.closePopup();
    });
    return;
  }

  await faceStore.createFace(name.value, photoBase64.value).then(() => {
    popupStore.closePopup();
  });
}

const isEditMode = computed(() => {
  return !!props.userData;
});

onMounted(() => {
  if (isEditMode.value && props.userData) {
    name.value = props.userData.name;
    photoBase64.value = props.userData.photo;
  }
});

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}
</script>

<style scoped>
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-2xl);
}

.avatar-container {
  position: relative;
  width: 200px;
  height: 200px;
  cursor: pointer;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 2px solid var(--color-border);
  transition: border-color 0.2s ease;
}

.avatar-container:hover {
  border-color: var(--color-text-secondary);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.camera-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-text-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.file-input {
  display: none;
}

.file-input-display {
  background-color: var(--color-secondary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.file-input-display:hover {
  border-color: var(--color-text-secondary);
  background-color: var(--color-accent-dark);
}

.file-placeholder {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .avatar-container {
    width: 150px;
    height: 150px;
  }
}
</style>