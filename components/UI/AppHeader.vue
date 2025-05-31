<script setup lang="ts">
import {useAuthStore} from "~/stores/useAuth";

const authStore = useAuthStore();
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="brand">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M7.72 2.79L5.5 5.75a1.25 1.25 0 0 1-1 .5H4A2.75 2.75 0 0 0 1.25 9v10A2.75 2.75 0 0 0 4 21.75h16A2.75 2.75 0 0 0 22.75 19V9A2.75 2.75 0 0 0 20 6.25h-.5a1.25 1.25 0 0 1-1-.5l-2.22-2.96a1.35 1.35 0 0 0-1.08-.54H8.8c-.425 0-.825.2-1.08.54M12 8.25a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5" clip-rule="evenodd" />
          </svg>
        </div>
        <h2 class="brand-title">FaceID: Панель управления</h2>
      </div>

      <div class="header-actions">
        <nav class="navigation">
          <nuxt-link class="nav-link" active-class="active" to="/">
            <a>Обзор</a>
          </nuxt-link>
          <nuxt-link class="nav-link" active-class="active" to="history">
            <a>История входов</a>
          </nuxt-link>
        </nav>

      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header */
.header {
  background-color: var(--color-primary-dark);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-3xl);
  height: var(--header-height);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.logo svg {
  width: 100%;
  height: 100%;
}

.brand-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

.navigation {
  display: flex;
  gap: var(--spacing-2xl);
}

.nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color 0.2s ease;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-text-secondary);
}

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
}
</style>