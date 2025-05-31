<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import ConfirmPopup from "~/components/popups/ConfirmPopup.vue";
import {useHistoryStore} from "~/stores/useHistory";
import TablePagination from "~/components/UI/table/TablePagination.vue";
import TableSearch from "~/components/UI/table/TableSearch.vue";
import {debounce} from 'lodash-es';
import {getAvatarUrl} from "~/utils/getAvatar";
import {formatDate} from "~/utils/formatDate";
import {usePopupStore} from "~/stores/usePopup";

const popupStore = usePopupStore();
const historyStore = useHistoryStore();

const searchQuery = ref('');

const debouncedSearch = debounce(async (query: string) => {
  historyStore.updateSearchParams({
    name: query || undefined,
    page: 1
  });
  await historyStore.loadItems();
}, 500);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const currentPage = computed({
  get: () => historyStore.searchParams.page,
  set: async (value: number) => {
    historyStore.updateSearchParams({page: value});
    await historyStore.loadItems();
  }
});

const itemsPerPage = computed({
  get: () => historyStore.searchParams.pageSize,
  set: async (value: number) => {
    historyStore.updateSearchParams({
      pageSize: value,
      page: 1
    });
    await historyStore.loadItems();
  }
});

async function deleteHistory(id: string) {
  await historyStore.deleteFace(id);
}

onMounted(async () => {
  await historyStore.loadItems();
});
</script>

<template>
  <div>
    <table-search v-model="searchQuery"/>

    <div v-if="historyStore.loading" class="loading-container">
      <div class="loading-spinner">Загрузка...</div>
    </div>

    <div v-else class="table-container">
      <div class="table-wrapper">
        <table class="access-table">
          <thead>
          <tr class="table-header">
            <th class="table-cell table-cell--photo">Фото</th>
            <th class="table-cell table-cell--name">Имя</th>
            <th class="table-cell table-cell--date">Дата и время</th>
            <th class="table-cell table-cell--status">Статус доступа</th>
            <th class="table-cell table-cell--actions">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in historyStore.history"
              :key="item.id"
              class="table-row"
          >
            <!-- Фото -->
            <td class="table-cell table-cell--photo">
              <div
                  class="user-photo"
                  :style="`background-image: url('${getAvatarUrl(item)}');`"
              ></div>
            </td>

            <!-- Имя -->
            <td class="table-cell table-cell--name">
              <span class="user-name">{{ item.name || 'Неизвестно' }}</span>
            </td>

            <!-- Дата -->
            <td class="table-cell table-cell--date">
              <span class="access-date">{{ formatDate(item.date) }}</span>
            </td>

            <!-- Статус -->
            <td class="table-cell table-cell--status">
              <button
                  class="status-btn"
                  :class="{
                      'status-btn--allowed': item.state,
                      'status-btn--denied': !item.state
                    }"
              >
                {{ item.state ? 'Разрешен' : 'Запрещен' }}
              </button>
            </td>

            <!-- Действия -->
            <td class="table-cell table-cell--actions">
              <button
                  @click="popupStore.togglePopup(ConfirmPopup,
                  { data: { title: 'Удаление пользователя', text: `Вы точно хотите удалить запись?`}},
        () =>  deleteHistory(item.id))"
                  class="icon-btn delete-btn"
                  title="Удалить запись"
                  :disabled="historyStore.loading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     viewBox="0 0 256 256">
                  <path
                      d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                </svg>
              </button>
            </td>
          </tr>

          <!-- Пустое состояние -->
          <tr v-if="historyStore.history.length === 0" class="table-row">
            <td colspan="5" class="table-cell table-cell--empty">
              {{ searchQuery ? 'Записи не найдены' : 'Нет записей' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <table-pagination
          v-model:currentPage="currentPage"
          v-model:itemsPerPage="itemsPerPage"
          :total-items="historyStore.historyCount"
          @update:page=""/>

    </div>
  </div>
</template>

<style scoped>
@import "/assets/css/table.css";
</style>