<script setup lang="ts">

import UserTable from "~/components/index/UserTable.vue";
import UserPopup from "~/components/popups/UserPopup.vue";
import {usePopupStore} from "~/stores/usePopup";

const popupStore = usePopupStore();
</script>

<template>
  <v-container max-width="1400">
    <div class="d-flex justify-space-between align-center">
      <h1>Все пользователи</h1>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="popupStore.togglePopup(UserPopup)">
        Добавить
      </v-btn>
    </div>
    <UserTable/>
  </v-container>
</template>

<style scoped>

</style>