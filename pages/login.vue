<script setup lang="ts">
const show = ref(false)
const password = ref('')
const login = ref('')
</script>

<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white-200">Вход</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div>

          <UFormField label="Логин" required>
            <UInput variant="subtle" size="lg" v-model="login" placeholder="Введите логин" icon="i-lucide-at-sign" class="block w-full"/>
          </UFormField>
        </div>

        <div>
          <UFormField label="Пароль" required>
            <UInput
                variant="subtle"
                size="lg"
                class="block w-full"
                v-model="password"
                placeholder="Введите пароль"
                :type="show ? 'text' : 'password'"
                :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                    color="neutral"
                    variant="link"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show ? 'Hide password' : 'Show password'"
                    :aria-pressed="show"
                    aria-controls="password"
                    @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>
        </div>

        <div>
          <u-button type="submit" class="flex w-full justify-center px-3 py-1.5 text-sm/6">Войти</u-button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>

</style>