<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
import {useDebounceFn} from "@vueuse/core";

const faceStore = useFaceStore();

const headers = ref([
  {title: "Id", key: "id"},
  {title: "Фото", key: "photo", width: "150px"},
  {title: "Имя", key: "name", width: "240px"},
  {title: "Действия", key: "actions", width: "200px", sortable: false},
]);
const itemsPerPage = ref(10);

const debouncedFn = useDebounceFn(({page, itemsPerPage, sortBy, search, advancedSearch}) => {
  faceStore.getFaces({page, itemsPerPage})
      .finally(() => {
      });
}, 500);

async function loadItems({page, itemsPerPage}) {
  if (process.client && localStorage) {
    await debouncedFn({page, itemsPerPage});
  }
}

async function getPhoto(id: string) {
  const photo = await faceStore.getPhoto(id);
  return photo;
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
      <template v-slot:item.photo="value">
        <span>{{ getPhoto(value.item.id) }}</span>
        <img v-if="" :src="`data:image/jpeg;base64,${getPhoto(value.item.id)}`" alt="">
      </template>
    </v-data-table-server>

    <!--  <img-->
    <!--      v-if="!!sugarBagPicture"-->
    <!--      :src="`data:image/jpeg;base64,${sugarBagPicture}`"-->
    <!--      alt="Sugar Bag Image"-->
    <!--      style="max-width: 300px;"-->
    <!--  />-->
  </v-card>
</template>
