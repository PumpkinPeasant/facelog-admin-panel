<template>
  <div class="app">
    <main class="main" v-once>
      <slot/>
    </main>
    <alert/>
  </div>
</template>


<script setup>
import Alert from "~/components/UI/Alert.vue";
</script>


<style scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>