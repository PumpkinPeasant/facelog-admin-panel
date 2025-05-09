<script setup lang="ts">
import {useAuthStore} from "~/stores/useAuth";

definePageMeta({
  layout: "auth",
});
const authStore = useAuthStore();

const disabled = ref(false);
const name = ref("");
const password = ref("");
const showPassword = ref(false);
const form = ref("form");
const rules = ref({
  required: (value) => !!value || "Поле не заполнено",
  password: (value) => !!value || "Поле не заполнено",
});

async function submit() {
  disabled.value = true;
  let resp = await authStore.login(name.value, password.value).finally(() => {
    disabled.value = false;
  });
  if (resp === false) {
    password.value = "";
    name.value = "";
  }
}

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <VCol cols="12" md="5" sm="10">
    <VRow no-gutters align="center" justify="center">
      <VCol cols="12">
        <logo />
        <VForm ref="form" @submit.prevent="submit" class="mt-7">
          <div class="mt-1">
            <label class="label text-grey-darken-2" for="email">Логин</label>
            <VTextField
                :rules="[rules.required]"
                v-model="name"
                label="Введите логин"
                id="email"
                name="email"
                type="text"
            />
          </div>
          <div class="mt-1">
            <label class="label text-grey-darken-2" for="password">Пароль</label>
            <VTextField
                :rules="[rules.required, rules.password]"
                v-model="password"
                label="Введите пароль"
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="toggleShowPassword"
                append-inner-icon="solar:eye-outline"
            />
          </div>
          <div class="mt-5">
            <VBtn
                :disabled="disabled || !!form.errors?.length"
                type="submit"
                block min-height="44"
                color="primary"
            >
              Войти
            </VBtn>
          </div>
        </VForm>
      </VCol>
    </VRow>
  </VCol>
</template>

<style scoped>

</style>