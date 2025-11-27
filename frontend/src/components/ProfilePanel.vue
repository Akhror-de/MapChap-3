<template>
  <div class="side-panel">
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
      <div v-if="authStore.isLoading" class="loading-state">
        <div class="tg-loading-spinner"></div>
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
          <div class="profile-header-content">
            <div class="avatar-section">
              <div class="avatar-large">
                {{ authStore.user.avatar }}
              </div>
            </div>
            
            <div class="profile-info">
              <h1 class="user-name">{{ authStore.user.name }}</h1>
              <p class="user-username">@{{ authStore.user.username }}</p>
              <div class="user-role">
                {{ authStore.user.role === 'business_owner' ? '💼 Владелец бизнеса' : '👤 Пользователь' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-value">3</div>
            <div class="stat-label">Объявления</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">1245</div>
            <div class="stat-label">Просмотры</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">89</div>
            <div class="stat-label">Лайки</div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn btn-primary" @click="testAction">
            Тестовая кнопка
          </button>
          <button class="btn btn-secondary" @click="closePanel">
            Закрыть панель
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
/* Используем Telegram стили */
.profile-content {
  padding: 0;
}

.loading-state, .auth-required {
  text-align: center;
  padding: 60px 20px;
  color: var(--tg-hint-color);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.tg-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--tg-border-color);
  border-top: 3px solid var(--tg-button-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.auth-icon {
  font-size: 64px;
  opacity: 0.7;
}

.auth-required h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--tg-text-color);
}

.auth-required p {
  margin: 0;
  font-size: 16px;
  color: var(--tg-hint-color);
}

/* Профиль */
.profile-header {
  background: linear-gradient(135deg, var(--tg-button-color), #6b8cff);
  color: white;
  padding: 24px 20px;
  border-radius: var(--tg-border-radius-large);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.profile-header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.profile-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
}

.user-username {
  margin: 0 0 12px 0;
  opacity: 0.9;
  font-size: 16px;
}

.user-role {
  background: rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  backdrop-filter: blur(10px);
}

/* Статистика */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--tg-section-bg-color);
  border: 0.5px solid var(--tg-border-color);
  border-radius: var(--tg-border-radius-medium);
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--tg-shadow-2);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--tg-button-color);
  display: block;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--tg-hint-color);
  font-weight: 500;
}

/* Действия */
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Стили для кнопок */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 480px) {
  .profile-header {
    padding: 20px 16px;
  }
  
  .profile-header-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .avatar-large {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }
  
  .user-name {
    font-size: 20px;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
