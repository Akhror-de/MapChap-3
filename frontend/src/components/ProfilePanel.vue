<template>
  <div class="side-panel modern-panel">
    <!-- Заголовок -->
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

    <!-- Содержимое панели -->
    <div class="panel-content">
      <!-- Информация профиля -->
      <div class="profile-section">
        <div class="avatar-large">
          {{ user.avatar }}
        </div>
        <div class="profile-info">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-username">@{{ user.username }}</p>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-phone">{{ user.phone }}</p>
          <div class="profile-badge">
            <span class="badge">{{ user.role === 'business_owner' ? 'Владелец бизнеса' : 'Пользователь' }}</span>
            <span class="join-date">С {{ formatDate(user.registrationDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="stats-section">
        <h4>📊 Моя статистика</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ businessStats.activeOffers }}</div>
            <div class="stat-label">Активных объявлений</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ businessStats.totalViews }}</div>
            <div class="stat-label">Просмотров</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ businessStats.totalLikes }}</div>
            <div class="stat-label">Лайков</div>
          </div>
        </div>
      </div>

      <!-- Быстрые действия -->
      <div class="actions-section">
        <h4>⚡ Быстрые действия</h4>
        <div class="actions-grid">
          <button class="action-btn" @click="openPanel('business')">
            <span class="action-icon">💼</span>
            <span class="action-text">Мои объявления</span>
          </button>
          <button class="action-btn" @click="openPanel('blog')">
            <span class="action-icon">📝</span>
            <span class="action-text">Мои статьи</span>
          </button>
          <button class="action-btn" @click="showFavorites">
            <span class="action-icon">❤️</span>
            <span class="action-text">Избранное</span>
          </button>
          <button class="action-btn" @click="showSettings">
            <span class="action-icon">⚙️</span>
            <span class="action-text">Настройки</span>
          </button>
        </div>
      </div>

      <!-- Телеграм информация -->
      <div class="telegram-section">
        <h4>🔗 Telegram</h4>
        <div class="telegram-info">
          <p>Вы вошли через Telegram Web App</p>
          <div class="telegram-data">
            <p><strong>ID:</strong> {{ telegramAuthData.id }}</p>
            <p><strong>Имя пользователя:</strong> @{{ telegramAuthData.username }}</p>
            <p><strong>Дата авторизации:</strong> {{ formatTelegramDate(telegramAuthData.auth_date) }}</p>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="profile-actions">
        <button class="btn btn-primary" @click="editProfile">
          ✏️ Редактировать профиль
        </button>
        <button class="btn btn-secondary" @click="logout">
          🚪 Выйти из аккаунта
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export default {
  name: 'ProfilePanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    
    const { user, telegramAuthData } = storeToRefs(authStore)
    const { getBusinessStats } = storeToRefs(businessStore)

    const { closePanel, openPanel, showNotification } = uiStore
    const { logout } = authStore

    const businessStats = computed(() => getBusinessStats.value)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long'
      })
    }

    const formatTelegramDate = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const editProfile = () => {
      showNotification('Редактирование профиля будет доступно в следующем обновлении', 'info')
    }

    const showFavorites = () => {
      showNotification('Раздел "Избранное" в разработке', 'info')
    }

    const showSettings = () => {
      showNotification('Настройки профиля в разработке', 'info')
    }

    const handleLogout = () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        logout()
        closePanel()
        showNotification('Вы успешно вышли из аккаунта', 'success')
      }
    }

    return {
      user,
      telegramAuthData,
      businessStats,
      closePanel,
      openPanel,
      editProfile,
      showFavorites,
      showSettings,
      logout: handleLogout,
      formatDate,
      formatTelegramDate
    }
  }
}
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl);
  z-index: 1003;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
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
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: var(--bg-secondary);
  transform: translateX(-2px);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.title-icon {
  font-size: 1.5rem;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Стили для этой панели */
.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.profile-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-username {
  margin: 0 0 0.25rem 0;
  opacity: 0.9;
}

.user-email, .user-phone {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.profile-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.join-date {
  font-size: 0.8rem;
  opacity: 0.8;
}

.stats-section, .actions-section, .telegram-section {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  margin-bottom: 1rem;
}

.stats-section h4, .actions-section h4, .telegram-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
}

.telegram-info {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.telegram-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.telegram-data {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
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

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .side-panel {
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .panel-header {
    padding: 1rem;
  }
  
  .panel-content {
    padding: 1rem;
  }
  
  .back-text {
    display: none;
  }
  
  .profile-section {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
