<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useLive} from "~/stores/useLive";

const streamStore = useLive();
// Реактивные переменные для состояния
const isStreaming = ref(false);
const isFullscreen = ref(false);
const connectionStatus = ref('disconnected'); // 'connected', 'connecting', 'disconnected'
const currentTime = ref(new Date().toLocaleTimeString());
const resolution = ref('1920x1080');
const quality = ref('high'); // 'low', 'medium', 'high'

// Обновление времени каждую секунду
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString();
  }, 1000);
});

const toggleStream = () => {
  if (streamStore.liveStatus) {
    // If currently streaming, stop it
    streamStore.stop();
    isStreaming.value = false;
    connectionStatus.value = 'disconnected';
  } else {
    // If not streaming, start it
    streamStore.connect();
    isStreaming.value = true;
    connectionStatus.value = 'connecting';
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const takeScreenshot = () => {
  // Функционал скриншота
};

const changeQuality = (newQuality: string) => {
  quality.value = newQuality;
};
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Просмотр камеры</h1>
      <div class="header-controls">
        <button
            @click="toggleStream"
            :class="['btn-primary', { 'btn-stop': isStreaming }]">
          {{ isStreaming ? 'Остановить' : 'Запустить' }}
        </button>
      </div>
    </div>

    <div class="camera-layout">
      <!-- Основная область видео -->
      <div class="video-section">
        <div class="video-container" :class="{ 'video-container--fullscreen': isFullscreen }">
          <!-- Видеопоток -->
          <div class="video-stream">
            <div v-if="isStreaming && streamStore.frameUrl">
              <img :src="streamStore.frameUrl" alt="Видеопоток" />
            </div>
            <div v-else class="video-placeholder">
              <div class="placeholder-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M23 7l-7 5 7 5V7z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                <p>Камера не активна</p>
                <p class="placeholder-hint">Нажмите "Запустить" для начала трансляции</p>
              </div>
            </div>
          </div>

          <!-- Оверлей с информацией -->
          <div class="video-overlay">
            <!-- Статус подключения -->
            <div class="status-indicator">
              <div class="status-dot" :class="`status-dot--${connectionStatus}`"></div>
              <span class="status-text">
                {{
                  connectionStatus === 'connected' ? 'Подключено' :
                      connectionStatus === 'connecting' ? 'Подключение...' : 'Отключено'
                }}
              </span>
            </div>

            <!-- Время и разрешение -->
            <div class="video-info">
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>{{ currentTime }}</span>
              </div>
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>{{ resolution }}</span>
              </div>
            </div>
          </div>

          <!-- Элементы управления видео -->
          <div class="video-controls">
            <button
                @click="takeScreenshot"
                class="control-btn"
                title="Сделать скриншот"
                :disabled="!isStreaming">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>

            <button
                @click="toggleFullscreen"
                class="control-btn"
                title="Полноэкранный режим">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path v-if="!isFullscreen" d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                <path v-else d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Боковая панель с настройками -->
      <div class="settings-panel">
        <div class="panel-section">
          <h3 class="panel-title">Настройки качества</h3>
          <div class="quality-controls">
            <button
                v-for="qualityOption in ['low', 'medium', 'high']"
                :key="qualityOption"
                @click="changeQuality(qualityOption)"
                :class="['quality-btn', { 'quality-btn--active': quality === qualityOption }]">
              {{
                qualityOption === 'low' ? 'Низкое' :
                    qualityOption === 'medium' ? 'Среднее' : 'Высокое'
              }}
            </button>
          </div>
        </div>

        <div class="panel-section">
          <h3 class="panel-title">Информация</h3>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Статус:</span>
              <span class="info-value" :class="`info-value--${connectionStatus}`">
                {{
                  connectionStatus === 'connected' ? 'Активно' :
                      connectionStatus === 'connecting' ? 'Подключение...' : 'Неактивно'
                }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Разрешение:</span>
              <span class="info-value">{{ resolution }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Качество:</span>
              <span class="info-value">
                {{
                  quality === 'low' ? 'Низкое' :
                      quality === 'medium' ? 'Среднее' : 'Высокое'
                }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Время:</span>
              <span class="info-value">{{ currentTime }}</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3 class="panel-title">Действия</h3>
          <div class="action-buttons">
            <button
                @click="takeScreenshot"
                class="action-btn"
                :disabled="!isStreaming">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Скриншот
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-xl);
  height: calc(100vh - 200px);
}

.video-section {
  display: flex;
  flex-direction: column;
}

.video-container {
  position: relative;
  background-color: var(--color-secondary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
  flex: 1;
  min-height: 400px;
}

.video-container--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  border-radius: 0;
}

.video-stream {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
}

.placeholder-content {
  text-align: center;
}

.placeholder-content svg {
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.placeholder-content p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.placeholder-hint {
  font-size: var(--font-size-sm) !important;
  opacity: 0.7;
}

.video-overlay {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  right: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: rgba(21, 26, 30, 0.8);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot--connected {
  background-color: var(--color-success);
}

.status-dot--connecting {
  background-color: #f59e0b;
}

.status-dot--disconnected {
  background-color: var(--color-danger);
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: rgba(21, 26, 30, 0.8);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.video-controls {
  position: absolute;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  background-color: rgba(21, 26, 30, 0.8);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.control-btn:hover:not(:disabled) {
  background-color: rgba(45, 54, 62, 0.9);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings-panel {
  background-color: var(--color-secondary-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  height: fit-content;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.quality-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quality-btn {
  background-color: var(--color-accent-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  text-align: left;
}

.quality-btn:hover {
  background-color: var(--color-border);
}

.quality-btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.info-value {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.info-value--connected {
  color: var(--color-success);
}

.info-value--connecting {
  color: #f59e0b;
}

.info-value--disconnected {
  color: var(--color-danger);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-btn {
  background-color: var(--color-accent-dark);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.action-btn:hover:not(:disabled) {
  background-color: var(--color-border);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-stop {
  background-color: var(--color-danger);
}

.btn-stop:hover {
  background-color: #dc2626;
}

.header-controls {
  display: flex;
  gap: var(--spacing-sm);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .camera-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .settings-panel {
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .camera-layout {
    gap: var(--spacing-lg);
  }

  .video-overlay {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .video-info {
    align-self: flex-end;
  }

  .settings-panel {
    padding: var(--spacing-md);
  }

  .quality-controls {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .quality-btn {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .video-controls {
    bottom: var(--spacing-md);
    right: var(--spacing-md);
  }

  .control-btn {
    padding: var(--spacing-sm);
  }

  .info-grid {
    gap: var(--spacing-sm);
  }

  .panel-section {
    gap: var(--spacing-sm);
  }
}
</style>