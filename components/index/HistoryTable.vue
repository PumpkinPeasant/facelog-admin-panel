<script setup lang="ts">
import {useHistoryStore} from "~/stores/useHistory";

const historyStore = useHistoryStore();

const headers = ref([
  {title: "Id", key: "id"},
  {title: "Фото", key: "photo", width: "150px"},
  {title: "Имя", key: "name"},
  {title: "Дата", key: "date"},
  {title: "Вход", key: "state"},
  {title: "Действия", key: "actions", sortable: false},
]);


async function deleteHistory(id: string) {
  await historyStore.deleteFace(id);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
}

</script>

<template>
  <v-card>
    <v-data-table-server
        v-model:page="historyStore.tableOptions.page"
        v-model:items-per-page="historyStore.tableOptions.itemsPerPage"
        :headers="headers"
        :items-length="historyStore.history?.length  || 0"
        @update:options="historyStore.loadItems"
        :items="historyStore.history">
      <template v-slot:item.photo="{ item }">
        <img
            v-if="item?.photo"
            :src="`data:image/jpeg;base64,${item.photo}`"
            alt="Фото"
            style="max-width: 100px;"
        />
        <span v-else>Загрузка...</span>
      </template>
      <template v-slot:item.date="{item}">
        <span>{{ formatDate(item.date) }}</span>
      </template>
      <template v-slot:item.state="{item}">
        <v-chip :color="item.state ? 'success' : 'error'">
          {{ item.state ? "Вход выполнен" : "Вход запрещен" }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{item}">
        <div>
          <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteHistory(item.id)"/>
        </div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>