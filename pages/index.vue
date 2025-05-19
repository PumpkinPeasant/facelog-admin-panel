<script setup lang="ts">

import UserTable from "~/components/index/UserTable.vue";
import UserPopup from "~/components/popups/UserPopup.vue";
</script>

<template>
  <v-container max-width="1400">
    <div class="d-flex justify-space-between align-center">
      <h1>Все пользователи</h1>

      <user-popup>
        <template v-slot:activator="{ activatorProps, isActive }">
          <v-btn color="primary" prepend-icon="mdi-plus" v-bind="activatorProps">
            Добавить
          </v-btn>
        </template>
      </user-popup>
    </div>
    <UserTable/>
  </v-container>
</template>

<style scoped>

</style>