<template>
  <v-app v-once>
    <v-main>
      <div class="d-flex" style="width: 100%; height: 100%;">
        <v-card max-width="50%" class="flex-1-1-100 pa-4 rounded-e-xl" style="z-index: 2;">
          <VRow no-gutters align="center" justify="center" class="fill-height">
            <slot/>
          </VRow>
        </v-card>
        <div class="background-wrapper">
          <div
              v-for="(image, index) in images"
              :key="index"
              class="background-image"
              :style="{ backgroundImage: `url(${image})`, opacity: currentIndex === index ? 1 : 0 }"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>


<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

const images = [
  'images/bg1.webp',
  'images/bg2.webp',
  'images/bg3.webp',
  'images/bg4.webp',
  'images/bg5.webp',
]

const currentIndex = ref(0)
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>


<style scoped>
.background-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 45%;
  overflow: hidden;
}

.background-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1.5s ease-in-out;
  will-change: opacity;
}
</style>