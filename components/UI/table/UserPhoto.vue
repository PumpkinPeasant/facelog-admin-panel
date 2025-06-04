<script setup lang="ts">
import { ref } from 'vue';
import { getAvatarUrl } from '~/utils/getAvatar';
import PhotoPopup from "~/components/popups/PhotoPopup.vue";

interface Props {
  user: {
    id: string;
    name?: string;
    photo?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const isModalOpen = ref(false);
const imageUrl = ref('');

const openPhotoModal = () => {
  imageUrl.value = getAvatarUrl(props.user);
  isModalOpen.value = true;
};

const closePhotoModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="user-photo-wrapper">
    <div
        class="user-photo user-photo--medium"
        :style="`background-image: url('${getAvatarUrl(user)}')`"
        @click="openPhotoModal"
        :title="`Посмотреть фото ${user.name || 'пользователя'}`">

      <div class="user-photo__overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <path d="M11 8v6"/>
          <path d="M8 11h6"/>
        </svg>
      </div>
    </div>

    <PhotoPopup
        v-if="isModalOpen"
        :image-url="imageUrl"
        :user-name="user.name"
        :is-open="isModalOpen"
        @close="closePhotoModal" />
  </div>
</template>

<style scoped>
.user-photo-wrapper {
  display: inline-block;
}

.user-photo {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: var(--border-radius-full);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
}

.user-photo--medium {
  width: 3.5rem;
  height: 3.5rem;
}

.user-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.user-photo__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
}

.user-photo:hover .user-photo__overlay {
  opacity: 1;
}

@media (max-width: 480px) {
  .user-photo--medium {
    width: 2rem;
    height: 2rem;
  }

  .user-photo__overlay svg {
    width: 12px;
    height: 12px;
  }
}
</style>