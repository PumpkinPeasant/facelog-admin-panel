<template>
  <div v-if="totalPages > 1" class="pagination">
    <div class="pagination-info">
      Показано {{
        Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
      }}-{{ Math.min(currentPage * itemsPerPage, totalItems) }} из {{ totalItems }}
    </div>

    <div class="pagination-controls">
      <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn-regular"
          :class="{ 'btn-regular--disabled': currentPage === 1 }">
        Назад
      </button>

      <template v-for="page in totalPages" :key="page">
        <button
            v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1"
            @click="goToPage(page)"
            class="btn-regular pagination-btn--page"
            :class="{ 'pagination-btn--active': currentPage === page }">
          {{ page }}
        </button>
        <span v-else-if="page === 2 && currentPage > 4" class="pagination-dots">
          ...
        </span>
        <span v-else-if="page === totalPages - 1 && currentPage < totalPages - 3" class="pagination-dots">
          ...
        </span>
      </template>

      <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn-regular"
          :class="{ 'pagination-btn--disabled': currentPage === totalPages }">
        Вперед
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

const emit = defineEmits(['update:page'])

const currentPage = defineModel('currentPage')
const itemsPerPage = defineModel('itemsPerPage')

const props = defineProps({
  totalItems: {type: Number, required: true},
})

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / itemsPerPage.value);
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }

  emit('update:page', page);
}
</script>

<style scoped>
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

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
}
</style>