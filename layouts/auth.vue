<template>
  <v-app v-once>
    <v-main>
      <div class="d-flex" style="width: 100%; height: 100%;">
        <v-card max-width="50%" class="flex-1-1-100 pa-4 rounded-e-xl" style="z-index: 2;">
          <VRow no-gutters align="center" justify="center" class="fill-height">
            <slot />
          </VRow>
        </v-card>
        <div class="background" />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
</script>

<style scoped>
.background {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 45%;
  background: url("https://api.ozero.market/pictures/30559/conversions/3748cf13009b44c63c0ebd93baa7d0fd7cb1fbb5-large.jpg") center/cover no-repeat;
}

.copyright {
  position: absolute;
  bottom: 0;
}
</style>