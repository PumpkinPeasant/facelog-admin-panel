<template>
  <v-app-bar app>
    <v-app-bar-title>
      <NuxtLink to="/" class="text-decoration-none text-black" >
        Панель управления
      </NuxtLink>
    </v-app-bar-title>

    <v-tabs align-with-title>
      <v-tab to="/" exact-active-class="active-tab">
        <v-icon start icon="mdi-account-group" />
        Все пользователи
      </v-tab>

      <v-tab to="/history" exact-active-class="active-tab">
        <v-icon start icon="mdi-history" />
        История входов
      </v-tab>
    </v-tabs>

    <v-btn icon @click="router.push('/login')">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>

.v-tab {
  letter-spacing: normal;
  text-transform: none;
}
</style>
<script setup lang="ts">
const router = useRouter();
</script>