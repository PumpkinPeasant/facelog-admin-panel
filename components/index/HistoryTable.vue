<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import { useHistoryStore } from "~/stores/useHistory";

const historyStore = useHistoryStore();

// Состояние для поиска
const searchQuery = ref('');

// Фильтрованные данные на основе поиска
const filteredHistory = computed(() => {
  if (!searchQuery.value) {
    return historyStore.history || [];
  }

  const query = searchQuery.value.toLowerCase();
  return (historyStore.history || []).filter(item =>
      item.name?.toLowerCase().includes(query) ||
      formatDate(item.date).toLowerCase().includes(query)
  );
});

// Пагинация
const currentPage = ref(1);
const itemsPerPage = ref(5);

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredHistory.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHistory.value.length / itemsPerPage.value);
});

async function deleteHistory(id: string) {
  await historyStore.deleteFace(id);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// Генерация аватара по умолчанию или использование фото
function getAvatarUrl(item: any) {
  if (item?.photo) {
    return `data:image/jpeg;base64,${item.photo}`;
  }
  // Генерируем цветной аватар на основе имени
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const colorIndex = (item.name?.charCodeAt(0) || 0) % colors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Unknown')}&background=${colors[colorIndex].substring(1)}&color=fff&size=40`;
}

onMounted(async () => {
  await historyStore.loadItems();
})
</script>

<template>
  <div>
    <!-- Search -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path
                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
          </svg>
        </div>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по имени или дате"
            class="search-input"
        />
      </div>
    </div>

    <!-- Access Log Table -->
    <div class="table-container">
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
              v-for="item in paginatedHistory"
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
                  @click="deleteHistory(item.id)"
                  class="delete-btn"
                  title="Удалить запись"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                </svg>
              </button>
            </td>
          </tr>

          <!-- Пустое состояние -->
          <tr v-if="paginatedHistory.length === 0" class="table-row">
            <td colspan="5" class="table-cell table-cell--empty">
              {{ searchQuery ? 'Записи не найдены' : 'Нет записей' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="pagination">
        <div class="pagination-info">
          Показано {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length) }}-{{ Math.min(currentPage * itemsPerPage, filteredHistory.length) }} из {{ filteredHistory.length }}
        </div>

        <div class="pagination-controls">
          <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn-regular"
              :class="{ 'btn-regular--disabled': currentPage === 1 }"
          >
            Назад
          </button>

          <template v-for="page in totalPages" :key="page">
            <button
                v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
                @click="goToPage(page)"
                class="btn-regular pagination-btn--page"
                :class="{ 'pagination-btn--active': currentPage === page }"
            >
              {{ page }}
            </button>
            <span
                v-else-if="page === 2 && currentPage > 4"
                class="pagination-dots"
            >
              ...
            </span>
            <span
                v-else-if="page === totalPages - 1 && currentPage < totalPages - 3"
                class="pagination-dots"
            >
              ...
            </span>
          </template>

          <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn-regular"
              :class="{ 'pagination-btn--disabled': currentPage === totalPages }"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.search-container {
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--color-secondary-dark);
  border-radius: var(--border-radius);
  height: 3rem;
  overflow: hidden;
}

.search-icon {
  color: var(--color-text-secondary);
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  padding: var(--spacing-lg) var(--spacing-sm);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

/* Table */
.table-container {
  padding: var(--spacing-md) var(--spacing-lg);
}

.table-wrapper {
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  overflow-x: auto;
}

.access-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.table-header {
  background-color: var(--color-accent-dark);
}

.table-cell {
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  border-top: 1px solid var(--color-border);
}

.table-header .table-cell {
  border-top: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.table-cell--photo {
  width: 3.5rem;
}

.table-cell--name {
  min-width: 200px;
}

.table-cell--date {
  min-width: 250px;
}

.table-cell--status {
  width: 150px;
}

.table-cell--actions {
  width: 100px;
}

.table-cell--empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-2xl);
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(45, 54, 62, 0.3);
}

.user-photo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--border-radius-full);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.user-name {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.access-date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.status-btn {
  background-color: var(--color-secondary-dark);
  border: none;
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-lg);
  width: 100%;
  max-width: 120px;
  transition: all 0.2s ease;
}

.status-btn--allowed {
  background-color: var(--color-success);
  color: white;
}

.status-btn--allowed:hover {
  background-color: #1fa750;
}

.status-btn--denied {
  background-color: var(--color-danger);
  color: white;
}

.status-btn--denied:hover {
  background-color: #dc2626;
}

.delete-btn {
  background-color: var(--color-danger);
  border: none;
  border-radius: var(--border-radius);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: #dc2626;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-xl);
}

.pagination-info {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pagination-btn--page {
  min-width: 2.5rem;
}

.pagination-btn--active {
  background-color: #3b82f6;
  color: white;
}

.pagination-dots {
  color: var(--color-text-secondary);
  padding: 0 var(--spacing-sm);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container,
  .table-container {
    padding: var(--spacing-lg) 0;
  }

  .table-cell--date {
    min-width: 200px;
  }

  .pagination {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 640px) {
  .table-cell--date {
    display: none;
  }

  .table-header .table-cell--date {
    display: none;
  }

  .access-table {
    min-width: 500px;
  }
}

@media (max-width: 480px) {
  .table-cell {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .table-cell--photo {
    width: 3rem;
  }

  .user-photo {
    width: 2rem;
    height: 2rem;
  }

  .status-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .delete-btn {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>