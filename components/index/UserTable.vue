<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
import {useDebounceFn} from "@vueuse/core";
import UserPopup from "~/components/popups/UserPopup.vue";
import {usePopupStore} from "~/stores/usePopup";

const faceStore = useFaceStore();
const popupStore = usePopupStore();

const headers = ref([
  {title: "Id", key: "id"},
  {title: "Фото", key: "photo", width: "150px"},
  {title: "Имя", key: "name", width: "240px"},
  {title: "Действия", key: "actions", width: "200px", sortable: false},
]);
const itemsPerPage = ref(10);

const debouncedFn = useDebounceFn(({page, itemsPerPage, sortBy, search, advancedSearch}) => {
  faceStore.getFaces({page, itemsPerPage}).then(async () => {
    console.log(faceStore.faces)
    for (const face of faceStore.faces) {
      if (!face.photo) {
        face.photo = await getPhoto(face.id);
      }
    }
  })
      .finally(() => {
      });
}, 500);

async function loadItems({page, itemsPerPage}) {
  if (process.client && localStorage) {
    await debouncedFn({page, itemsPerPage});
  }
}


async function getPhoto(id: string) {
  let photo = await faceStore.getPhoto(id)
  return photo;
}

async function deleteFace(id: string) {
  await faceStore.deleteFace(id);
}
</script>

<template>
  <v-card>
    <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="faceStore.faces?.length  || 0"
        @update:options="loadItems"
        :items="faceStore.faces">
      <template v-slot:item.photo="{ item }">
        <img
            v-if="item?.photo"
            :src="`data:image/jpeg;base64,${item.photo}`"
            alt="Фото"
            style="max-width: 100px;"
        />
        <span v-else>Загрузка...</span>
      </template>
      <template v-slot:item.actions="{item}">
        <div>
          <v-btn icon="mdi-pencil" variant="text"
                 @click="popupStore.togglePopup(UserPopup,
                 {userData: {id: item.id,name: item.name,photo: item.photo}})"/>
          <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteFace(item.id)"/>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>
