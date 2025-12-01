<template>
  <div class="avatar-upload">
    <div class="avatar-container">
      <div
        class="avatar-image"
        :class="{ 'has-image': avatarUrl, 'is-loading': isLoading }"
        @click="triggerFileInput"
      >
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
        <div v-else class="avatar-placeholder">
          <span class="placeholder-icon">👤</span>
        </div>
        
        <!-- Прогресс загрузки -->
        <div v-if="uploadProgress > 0" class="upload-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ uploadProgress }}%</span>
        </div>

        <!-- Наложение при наведении -->
        <div class="avatar-overlay">
          <span class="overlay-icon">📷</span>
          <span class="overlay-text">Сменить фото</span>
        </div>
      </div>

      <!-- Действия с аватаром -->
      <div class="avatar-actions">
        <button
          v-if="avatarUrl"
          class="btn btn-danger btn-sm"
          @click="handleRemove"
          :disabled="isLoading"
        >
          <span class="icon">🗑️</span>
          Удалить
        </button>
        <button
          class="btn btn-primary btn-sm"
          @click="triggerFileInput"
          :disabled="isLoading"
        >
          <span class="icon">📁</span>
          Загрузить
        </button>
      </div>
    </div>

    <!-- Скрытый input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  avatarUrl: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  uploadProgress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['upload', 'remove'])

const fileInputRef = ref(null)

const triggerFileInput = () => {
  if (!props.isLoading) {
    fileInputRef.value?.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload', file)
  }
  // Сбрасываем input для возможности выбора того же файла снова
  event.target.value = ''
}

const handleRemove = () => {
  emit('remove')
}
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.avatar-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.avatar-image.has-image:hover .avatar-overlay {
  opacity: 1;
}

.avatar-image.is-loading {
  cursor: not-allowed;
  opacity: 0.7;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.8;
}

/* Прогресс загрузки */
.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 30px;
}

/* Наложение */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.overlay-text {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Действия */
.avatar-actions {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 0.8rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

@media (max-width: 768px) {
  .avatar-image {
    width: 100px;
    height: 100px;
  }
  
  .avatar-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    justify-content: center;
  }
}
</style>
