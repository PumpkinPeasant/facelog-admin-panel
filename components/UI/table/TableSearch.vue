<template>
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
          placeholder="Поиск по имени"
          class="search-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = defineModel()
</script>

<style scoped>
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

@media (max-width: 768px) {
  .search-container {
    padding: var(--spacing-lg) 0;
  }
}

</style>