<script setup lang="ts">

import UserTable from "~/components/index/UserTable.vue";
import UserPopup from "~/components/popups/UserPopup.vue";
import {usePopupStore} from "~/stores/usePopup";

const popupStore = usePopupStore();
</script>

<template>
  <v-container max-width="1400">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Все пользователи

        <v-btn color="primary" prepend-icon="mdi-plus" @click="popupStore.togglePopup(UserPopup)">
          Добавить
        </v-btn>
      </v-card-title>
        <UserTable/>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>