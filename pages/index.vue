<script setup lang="ts">

import UserTable from "~/components/index/UserTable.vue";
import CreateUserPopup from "~/components/popups/CreateUserPopup.vue";
</script>

<template>
  <v-container max-width="1400">
    <div class="d-flex justify-space-between align-center">
      <h1>Все пользователи</h1>

      <create-user-popup/>
    </div>
    <UserTable/>
  </v-container>
</template>

<style scoped>

</style>