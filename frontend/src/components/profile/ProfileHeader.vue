<template>
  <div class="profile-header">
    <div class="header-background"></div>
    <div class="header-content">
      <!-- Аватар -->
      <ProfileAvatarUpload
        :avatar-url="user?.photo_url"
        :is-loading="isLoading"
        :upload-progress="uploadProgress"
        @upload="handleAvatarUpload"
        @remove="handleAvatarRemove"
      />

      <!-- Информация пользователя -->
      <div class="user-info">
        <h1 class="user-name">
          {{ user?.first_name }} {{ user?.last_name }}
        </h1>
        <p class="user-username" v-if="user?.username">
          @{{ user.username }}
        </p>
        <p class="user-bio" v-if="user?.bio">
          {{ user.bio }}
        </p>
        <div class="user-meta">
          <span class="meta-item">
            <span class="icon">📍</span>
            {{ user?.city || 'Город не указан' }}
          </span>
          <span class="meta-item" v-if="user?.phone">
            <span class="icon">📱</span>
            {{ user.phone }}
          </span>
          <span class="meta-item">
            <span class="icon">📅</span>
            Участник с {{ formatJoinDate(user?.created_at) }}
          </span>
        </div>
      </div>

      <!-- Действия -->
      <div class="header-actions">
        <button class="btn btn-secondary">
          <span class="icon">👥</span>
          Подписчики
        </button>
        <button class="btn btn-secondary">
          <span class="icon">❤️</span>
          Лайки
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProfileAvatarUpload from './ProfileAvatarUpload.vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
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

const emit = defineEmits(['avatar-upload', 'avatar-remove'])

const handleAvatarUpload = (file) => {
  emit('avatar-upload', file)
}

const handleAvatarRemove = () => {
  emit('avatar-remove')
}

const formatJoinDate = (dateString) => {
  if (!dateString) return '...'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.profile-header {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-background {
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-content {
  display: flex;
  align-items: flex-start;
  padding: 0 40px 40px;
  margin-top: -60px;
  position: relative;
}

.user-info {
  flex: 1;
  margin-left: 30px;
  margin-right: 20px;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 5px 0;
}

.user-username {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0 0 15px 0;
}

.user-bio {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.user-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
}

.meta-item .icon {
  margin-right: 5px;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 20px 30px;
  }

  .user-info {
    margin: 20px 0;
  }

  .user-meta {
    justify-content: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
