<template>
  <v-dialog v-model="popupStore.isActive" max-width="500">
    <v-card>
      <v-card-title> {{ isEditMode ? 'Редактирование пользователя' : 'Создание пользователя' }}</v-card-title>
      <v-card-text>
        <div class="d-flex justify-center">
          <v-avatar
              class="mb-4 cursor-pointer"
              rounded="0"
              size="200"
              @click="triggerFileInput">
            <v-img
                :src="photoBase64 ? `data:image/jpeg;base64,${photoBase64}`: `images/empty.jpg`"
                alt="Фото"
                cover/>
          </v-avatar>
        </div>

        <v-form ref="form">
          <v-file-input
              ref="fileInput"
              label="Загрузите фото"
              accept="image/*"
              prepend-icon="mdi-camera"
              :show-size="true"
              v-model="photo"
              @update:model-value="convertToBase64"
          />

          <v-text-field
              v-model="name"
              label="Имя пользователя"
              prepend-icon="mdi-account"
              required
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn color="red" text @click="popupStore.closePopup()">Отмена</v-btn>
        <v-btn color="primary" @click="submit">{{ isEditMode ? 'Применить' : 'Создать' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useFaceStore } from "~/stores/useFace.js";
import { usePopupStore } from "~/stores/usePopup";
import { toBase64 } from "~/utils/base64";

const faceStore = useFaceStore();
const name = ref('');
const photo = ref(null);
const photoBase64 = ref('');
const fileInput = ref('fileInput');

const popupStore = usePopupStore();

interface UserData {
  id: string;
  name: string;
  photo: string;
}

const props = defineProps<{
  userData?: UserData;
}>();

async function convertToBase64(file: File | File[] | null) {
  try {
    if (!file) return;

    const actualFile = Array.isArray(file) ? file[0] : file;
    if (!actualFile || !(actualFile instanceof File)) return;

    photoBase64.value = await toBase64(actualFile);
  } catch (e) {
    console.error("Ошибка при конвертации в base64:", e);
  }
}

async function submit() {
  if (!name.value || !photoBase64.value) {
    alert('Пожалуйста, заполните имя и выберите фото.')
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
})

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
