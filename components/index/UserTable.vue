<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
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

async function deleteFace(id: string) {
  await faceStore.deleteFace(id);
}
</script>

<template>
  <v-card>
    <v-data-table-server
        v-model:page="faceStore.tableOptions.page"
        v-model:items-per-page="faceStore.tableOptions.itemsPerPage"
        :headers="headers"
        :items-length="faceStore.faces?.length  || 0"
        @update:options="faceStore.loadItems"
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
