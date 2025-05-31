<script setup lang="ts">

import UserTable from "~/components/index/UserTable.vue";
import UserPopup from "~/components/popups/UserPopup.vue";
import {usePopupStore} from "~/stores/usePopup";

const popupStore = usePopupStore();
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Все пользователи</h1>
      <button
          @click="popupStore.togglePopup(UserPopup)"
          class="btn-regular">
        Добавить
      </button>
    </div>
    <UserTable/>
  </div>
</template>

<style scoped>

</style>