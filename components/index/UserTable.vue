<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
import UserPopup from "~/components/popups/UserPopup.vue";
import ConfirmPopup from "~/components/popups/ConfirmPopup.vue";
import {usePopupStore} from "~/stores/usePopup";
import {onMounted} from "vue";
import {computed} from "@vue/reactivity";

const faceStore = useFaceStore();
const popupStore = usePopupStore();

async function deleteFace(id: string) {
  await faceStore.deleteFace(id);
}

onMounted(async () => {
  await faceStore.loadItems();
})

const pageCount = computed(() => {
  return Math.ceil(faceStore.facesCount / faceStore.tableOptions.itemsPerPage);
})

const updateItems = () => {
  setTimeout(async () => {
    await faceStore.loadItems();
  }, 0)
}
</script>

<template>
  <v-card-text>
    <v-list lines="two">
      <v-list-subheader>Всего пользователей: {{ faceStore.facesCount }}</v-list-subheader>
      <v-list-item
          v-for="item in faceStore.faces"
          :key="item.title"
          :subtitle="`Последний вход: ${!!item?.lastEnter ? item.lastEnter : 'никогда'}`"
          :title="item.name"
      >
        <template v-slot:prepend>
          <v-avatar size="100">
            <v-img v-if="item?.photo" :src="`data:image/jpeg;base64,${item.photo}`" cover alt="Фото"></v-img>
            <v-icon v-else size="x-large" icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn icon="mdi-pencil" variant="text"
                 @click="popupStore.togglePopup(UserPopup,
                           {userData: {id: item.id,name: item.name,photo: item.photo}})"/>
          <v-btn icon="mdi-delete" variant="text" color="red" @click="popupStore.togglePopup(ConfirmPopup,
  { data: { title: 'Удаление пользователя', text: `Вы точно хотите удалить пользователя ${item.name}?`}},
  () =>  deleteFace(item.id))"/>
        </template>
      </v-list-item>
    </v-list>
  </v-card-text>
  <v-card-actions style="display: grid; grid-template-columns: 200px auto 200px">
    <v-select
        label="Записей"
        hide-details
        density="compact"
        max-width="100"
        @update:modelValue="updateItems"
        :items="[5, 10, 25, 50]"
        v-model="faceStore.tableOptions.itemsPerPage"/>
    <v-pagination
        color="primary"
        class="flex-1-1-100"
        density="compact"
        :total-visible="4"
        @update:modelValue="updateItems"
        v-model="faceStore.tableOptions.page"
        :length="pageCount"/>
  </v-card-actions>
</template>
