<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">👤</span>
          Мой профиль
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <div class="debug-info">
        🔍 Панель профиля загружена!
      </div>

      <div v-if="authStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>

      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в аккаунт для доступа к профилю</p>
        <button class="btn btn-primary" @click="initAuth">
          Войти через Telegram
        </button>
      </div>

      <div v-else class="profile-content">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-large">
              {{ authStore.user.avatar }}
            </div>
          </div>
          
          <div class="profile-info">
            <h1 class="user-name">{{ authStore.user.name }}</h1>
            <p class="user-username">@{{ authStore.user.username }}</p>
          </div>
        </div>
        
        <div class="debug-action">
          <button class="btn btn-primary" @click="testAction">
            Тестовая кнопка
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'ProfilePanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()

    const { closePanel, showNotification } = uiStore
    const { initTelegramAuth } = authStore

    const { isAuthenticated } = storeToRefs(authStore)

    const initAuth = () => {
      console.log('🔐 ProfilePanel: Initializing auth')
      initTelegramAuth()
      showNotification('Авторизация через Telegram запущена', 'info')
    }

    const testAction = () => {
      console.log('✅ ProfilePanel: Test button clicked!')
      showNotification('Тестовая кнопка работает!', 'success')
    }

    return {
      authStore,
      isAuthenticated,
      closePanel,
      initAuth,
      testAction
    }
  }
}
</script>

<style scoped>
.side-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: var(--bg-tertiary);
}

.panel-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.debug-info {
  background: #4CAF50;
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.debug-action {
  margin-top: 2rem;
  text-align: center;
}

.loading-state, .auth-required {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.auth-required .auth-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-required h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-username {
  margin: 0;
  color: var(--text-secondary);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}
</style>
