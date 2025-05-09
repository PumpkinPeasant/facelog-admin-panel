<script setup lang="ts">

import AppHeader from "~/components/UI/AppHeader.vue";
</script>

<template>
  <v-app>
    <AppHeader/>
    <v-main>
      <slot/>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>