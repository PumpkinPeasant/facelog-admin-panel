<script setup>
import {ref} from 'vue'
import {useAuthStore} from "~/stores/useAuth";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  errors.value.email = ''
  errors.value.password = ''

  if (!form.value.email) {
    errors.email = 'Email обязателен'
    return false
  }

  if (!form.value.password) {
    errors.password = 'Пароль обязателен'
    return false
  }

  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true

  await authStore.login(form.value.email, form.value.password)
      .then(() => {
        form.value = {
          password: "",
          email: ""
        }
      })
      .finally(() => {
        isLoading.value = false
      })
}
</script>

<template>
  <div class="login-form">
    <div class="form-header">
      <h1 class="form-title">Вход в систему</h1>
    </div>

    <form @submit.prevent="handleLogin" class="login-form-content">
      <div class="input-group">
        <label for="email" class="input-label">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
              <path d="M17.5 19.125A9 9 0 1 1 21 12c0 5.5-6 5.5-6 2V8"/>
              <path
                  d="M15 12v-1.5C15 9.12 13.657 8 12 8s-3 1.12-3 2.5V12m6 0v1.5c0 1.38-1.343 2.5-3 2.5s-3-1.12-3-2.5V12"/>
            </g>
          </svg>
          Имя пользователя
        </label>
        <input
            id="email"
            v-model="form.email"
            type="text"
            class="text-input"
            placeholder="Введите логин"
            required/>
      </div>

      <div class="input-group">
        <label for="password" class="input-label">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 12h1.4a.6.6 0 0 1 .6.6v6.8a.6.6 0 0 1-.6.6H6.6a.6.6 0 0 1-.6-.6v-6.8a.6.6 0 0 1 .6-.6H8m8 0V8c0-1.333-.8-4-4-4S8 6.667 8 8v4m8 0H8"/>
          </svg>
          Пароль
        </label>
        <div class="password-input-wrapper">
          <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="text-input"
              placeholder="Введите пароль"
              required
          />
          <button
              type="button"
              class="icon-btn password-toggle"
              @click="showPassword = !showPassword"
          >
            <svg v-if="showPassword" class="toggle-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                <path d="M3 13c3.6-8 14.4-8 18 0"/>
                <path d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6"/>
              </g>
            </svg>
            <svg v-else class="toggle-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                 viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="m19.5 16l-2.475-3.396M12 17.5V14m-7.5 2l2.469-3.388M3 8c3.6 8 14.4 8 18 0"/>
            </svg>
          </button>
        </div>
      </div>

      <button
          type="submit"
          class="btn-primary login-button"
          :disabled="isLoading"
      >
        <svg v-if="isLoading" class="loading-spinner" viewBox="0 0 24 24">
          <circle class="loading-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="loading-path" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span v-else>Войти</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-form {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-4xl);
  width: 100%;
  max-width: 500px;
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.login-form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.password-input-wrapper{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.password-input-wrapper > .text-input{
  flex: 1;
}

.password-toggle {
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: var(--color-text-primary);
}

.toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.login-button {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 3rem;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

.loading-circle {
  opacity: 0.25;
}

.loading-path {
  opacity: 0.75;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .form-title {
    font-size: var(--font-size-xl);
  }

  .login-form {
    border: none;
    padding: 0;
  }
}
</style>