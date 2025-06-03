<script setup lang="ts">

import {useFaceStore} from "~/stores/useFace";
import UserPopup from "~/components/popups/UserPopup.vue";
import ConfirmPopup from "~/components/popups/ConfirmPopup.vue";
import {usePopupStore} from "~/stores/usePopup";
import {onMounted, ref, watch} from "vue";
import {computed} from "@vue/reactivity";
import {getAvatarUrl} from "~/utils/getAvatar";
import {formatDate} from "~/utils/formatDate";
import TableSearch from "~/components/UI/table/TableSearch.vue";
import TablePagination from "~/components/UI/table/TablePagination.vue";
import {debounce} from 'lodash-es';
import TableEmptyState from "~/components/UI/table/TableEmptyState.vue";

const faceStore = useFaceStore();
const popupStore = usePopupStore();

const searchQuery = ref('');

const debouncedSearch = debounce(async (query: string) => {
  faceStore.updateSearchParams({
    searchParams: {
      name: query || undefined,
    },
    page: 1
  });
  await faceStore.loadItems();
}, 500);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const currentPage = computed({
  get: () => faceStore.searchParams.page,
  set: async (value: number) => {
    faceStore.updateSearchParams({page: value});
    await faceStore.loadItems();
  }
});

const itemsPerPage = computed({
  get: () => faceStore.searchParams.pageSize,
  set: async (value: number) => {
    faceStore.updateSearchParams({
      pageSize: value,
      page: 1
    });
    await faceStore.loadItems();
  }
});

async function deleteFace(id: string) {
  await faceStore.deleteFace(id);
}

onMounted(async () => {
  await faceStore.loadItems();
})
</script>

<template>
  <div>
    <table-search v-model="searchQuery"/>

    <div v-if="faceStore.loading" class="loading-container">
      <div class="loading-spinner">Загрузка...</div>
    </div>

    <!-- Заглушка для пустого состояния -->
    <table-empty-state
        :search-query="searchQuery"
        @clear="searchQuery = ''"
        v-else-if="faceStore.facesCount === 0"/>

    <!-- Таблица с данными -->
    <div v-else class="table-container">
      <div class="table-wrapper">
        <table class="access-table">
          <thead>
          <tr class="table-header">
            <th class="table-cell table-cell--photo">Фото</th>
            <th class="table-cell table-cell--name">Имя</th>
            <th class="table-cell table-cell--date">Последний вход</th>
            <th class="table-cell table-cell--actions">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in faceStore.faces"
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
              <span class="access-date">{{ item.lastEnter ? formatDate(item.lastEnter) : 'Никогда' }}</span>
            </td>
            <!-- Действия -->
            <td class="table-cell table-cell--actions">
              <div class="table-cell--actions__wrapper">
                <button
                    class="icon-btn"
                    title="Редактировать пользователя"
                    :disabled="faceStore.loading"
                    @click="popupStore.togglePopup(UserPopup,
                  {userData: {id: item.id,name: item.name,photo: item.photo}})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="1.5"
                          d="m14.363 5.652l1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242l-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242l4.243 4.242"/>
                  </svg>
                </button>
                <button
                    class="icon-btn delete-btn"
                    title="Удалить пользователя"
                    :disabled="faceStore.loading"
                    @click="popupStore.togglePopup(ConfirmPopup,
                  { data: { title: 'Удаление пользователя', text: `Вы точно хотите удалить пользователя ${item.name}?`}},
        () =>  deleteFace(item.id))">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       viewBox="0 0 256 256">
                    <path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <table-pagination
          v-model:currentPage="currentPage"
          v-model:itemsPerPage="itemsPerPage"
          :total-items="faceStore.facesCount"
          @update:page=""/>

    </div>
  </div>
</template>

<style scoped>
@import "/assets/css/table.css";

.table-cell--actions__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>