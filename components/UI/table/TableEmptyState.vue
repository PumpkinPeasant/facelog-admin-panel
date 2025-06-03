<script setup lang="ts">
const props = defineProps({
  searchQuery: {type: String, required: false},
    }
)

const emit = defineEmits(["clear"]);
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
    <h3 class="empty-state__title">
      {{ searchQuery ? 'Пользователи не найдены' : 'Нет пользователей' }}
    </h3>
    <p class="empty-state__description">
      {{ searchQuery
        ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить критерии поиска.`
        : 'В системе пока нет зарегистрированных пользователей.' }}
    </p>
    <button v-if="searchQuery" @click="emit('clear')" class="btn-primary">
      Очистить поиск
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  border-radius:  var(--border-radius);
  border: 1px solid var(--color-border);
  margin: calc(var(--spacing-md) + var(--spacing-lg)) var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
}

.empty-state__icon {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
}

.empty-state__description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin: 0 0 2rem 0;
  max-width: 28rem;
  line-height: 1.5;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .empty-state {
    padding: 3rem 1.5rem;
  }

  .empty-state__title {
    font-size: 1.25rem;
  }

  .empty-state__description {
    font-size: 0.875rem;
  }
}
</style>