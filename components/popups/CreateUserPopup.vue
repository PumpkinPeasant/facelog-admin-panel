<template>
  <div>
    <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
      Добавить
    </v-btn>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Создание пользователя</v-card-title>

        <v-card-text>

          <v-img
              v-if="imagePreview"
              :src="imagePreview"
              class="my-4"
              max-height="200"
              contain
          />

          <v-form ref="form">
            <v-file-input
                label="Загрузите фото"
                accept="image/*"
                prepend-icon="mdi-camera"
                :show-size="true"
                v-model="image"
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
          <v-btn text @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="submit">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useFaceStore} from "~/stores/useFace.js";

const faceStore = useFaceStore();
const dialog = ref(false)
const name = ref('')
const image = ref(null)
const imagePreview = ref('images/empty.jpg')

watch(image, (newImage) => {
  if (newImage) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(newImage);
  } else {
    imagePreview.value = 'images/empty.jpg';
  }
});

function submit() {
  if (!name.value || !image.value) {
    alert('Пожалуйста, заполните имя и выберите фото.')
    return
  }

  faceStore.createFace(name.value, image.value);

  // Очистка и закрытие
  name.value = ''
  image.value = null
  dialog.value = false
}
</script>

