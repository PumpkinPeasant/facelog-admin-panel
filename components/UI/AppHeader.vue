<script setup lang="ts">
import {useAuthStore} from "~/stores/useAuth";

const authStore = useAuthStore();
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="brand">
        <div class="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6_319)">
              <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect width="48" height="48" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 class="brand-title">FaceID Access</h2>
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
  gap: var(--spacing-lg);
}

.logo {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-primary);
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