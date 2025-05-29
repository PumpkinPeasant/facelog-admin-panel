<script setup lang="ts">
import HistoryTable from "~/components/index/HistoryTable.vue";
</script>

<template>
  <div class="app">
    <!-- Header -->

    <!-- Main Content -->
    <main class="main">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">История входов</h1>
        </div>

        <HistoryTable />
      </div>
    </main>
  </div>
</template>

<style>
.app {
  font-family: var(--font-family);
  background-color: var(--color-primary-dark);
  color: var(--color-text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content */
.main {
  flex: 1;
  padding: var(--spacing-xl) 10rem;
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.page-header {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Responsive Design */
.desktop-only {
  display: flex;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .header-content {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .main {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 640px) {
  .brand-title {
    display: none;
  }

  .header-actions {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .main {
    padding: var(--spacing-md) var(--spacing-sm);
  }
}
</style>