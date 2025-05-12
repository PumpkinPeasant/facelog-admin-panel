<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
import { useDebounceFn } from "@vueuse/core";

const faceStore = useFaceStore();

const headers = ref([
  { title: "Id", key: "id" },
  { title: "Фото", key: "photo", width: "150px" },
  { title: "Имя", key: "name", width: "240px" },
  { title: "Действия", key: "actions", width: "200px", sortable: false },
]);

const debouncedFn = useDebounceFn(({ page, itemsPerPage, sortBy, search, advancedSearch }) => {
  faceStore.getFaces({ page, itemsPerPage })
      .finally(() => {
      });
}, 500);

async function loadItems({ page, itemsPerPage }) {
  if (process.client && localStorage) {
    await debouncedFn({ page, itemsPerPage});
  }
}
</script>

<template>
<v-card>
  <v-data-table-server
      :headers="headers"
      @update:options="loadItems"
      :items="faceStore.faces">
  </v-data-table-server>
</v-card>
</template>
