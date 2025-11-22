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
      <!-- Загрузка -->
      <div v-if="authStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в аккаунт для доступа к профилю</p>
        <button class="btn btn-primary" @click="initAuth">
          Войти через Telegram
        </button>
      </div>

      <!-- Профиль -->
      <div v-else class="profile-content">
        <!-- Аватар и основная информация -->
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar-large">
              {{ authStore.user.avatar }}
            </div>
            <button class="edit-avatar-btn" @click="editAvatar">
              ✏️
            </button>
          </div>
          
          <div class="profile-info">
            <h1 class="user-name">{{ authStore.user.name }}</h1>
            <p class="user-username">@{{ authStore.user.username }}</p>
            
            <div class="profile-badges">
              <span class="badge role" :class="authStore.userRole">
                {{ roleDisplayName }}
              </span>
              <span class="badge member-since">
                Участник с {{ formatDate(authStore.user.registrationDate) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="contact-section">
          <h3>📞 Контакты</h3>
          <div class="contact-grid">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <span class="contact-value">{{ authStore.user.email }}</span>
              <button class="contact-edit" @click="editContact('email')">✏️</button>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <span class="contact-value">{{ authStore.user.phone }}</span>
              <button class="contact-edit" @click="editContact('phone')">✏️</button>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="stats-section">
          <h3>📊 Моя активность</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🏢</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.activeOffers || 0 }}</div>
                <div class="stat-label">Активных объявлений</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <div class="stat-value">{{ userArticles.length }}</div>
                <div class="stat-label">Статей в блоге</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👁️</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.totalViews || 0 }}</div>
                <div class="stat-label">Просмотров</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❤️</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.totalLikes || 0 }}</div>
                <div class="stat-label">Лайков</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="actions-section">
          <h3>⚡ Быстрые действия</h3>
          <div class="actions-grid">
            <button class="action-btn" @click="openBusinessPanel">
              <span class="action-icon">💼</span>
              <span class="action-text">Мои объявления</span>
              <span class="action-badge" v-if="businessStats.activeOffers > 0">
                {{ businessStats.activeOffers }}
              </span>
            </button>

            <button class="action-btn" @click="openBlogPanel">
              <span class="action-icon">📝</span>
              <span class="action-text">Мои статьи</span>
              <span class="action-badge" v-if="userArticles.length > 0">
                {{ userArticles.length }}
              </span>
            </button>

            <button class="action-btn" @click="showFavorites">
              <span class="action-icon">❤️</span>
              <span class="action-text">Избранное</span>
            </button>

            <button class="action-btn" @click="showSettings">
              <span class="action-icon">⚙️</span>
              <span class="action-text">Настройки</span>
            </button>

            <button v-if="!authStore.isBusinessOwner" class="action-btn highlight" @click="registerBusiness">
              <span class="action-icon">🚀</span>
              <span class="action-text">Стать партнером</span>
            </button>

            <button class="action-btn" @click="showSupport">
              <span class="action-icon">💬</span>
              <span class="action-text">Поддержка</span>
            </button>
          </div>
        </div>

        <!-- Telegram информация -->
        <div class="telegram-section" v-if="authStore.telegramAuthData">
          <h3>🔗 Telegram</h3>
          <div class="telegram-info">
            <div class="telegram-item">
              <span class="label">ID:</span>
              <span class="value">{{ authStore.telegramAuthData.id }}</span>
            </div>
            <div class="telegram-item">
              <span class="label">Имя пользователя:</span>
              <span class="value">@{{ authStore.telegramAuthData.username }}</span>
            </div>
            <div class="telegram-item">
              <span class="label">Авторизация:</span>
              <span class="value">{{ formatTelegramDate(authStore.telegramAuthData.authDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Действия с аккаунтом -->
        <div class="account-actions">
          <button class="btn btn-outline" @click="editProfile">
            ✏️ Редактировать профиль
          </button>
          <button class="btn btn-danger" @click="logout">
            🚪 Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { useBlogStore } from '../stores/blogStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export default {
  name: 'ProfilePanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    const blogStore = useBlogStore()

    const { closePanel, showNotification, openPanel } = uiStore
    const { initTelegramAuth, logout } = authStore
    const { registerAsBusiness } = authStore

    const { user, isAuthenticated, isBusinessOwner } = storeToRefs(authStore)
    const { getBusinessStats } = storeToRefs(businessStore)
    const { getUserArticles } = storeToRefs(blogStore)

    const businessStats = computed(() => getBusinessStats.value)
    const userArticles = computed(() => getUserArticles.value)

    const roleDisplayName = computed(() => {
      const roles = {
        user: '👤 Пользователь',
        business_owner: '💼 Владелец бизнеса',
        admin: '👑 Администратор'
      }
      return roles[authStore.userRole.value] || '👤 Пользователь'
    })

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
        day: 'numeric'
      })
    }

    const initAuth = () => {
      initTelegramAuth()
    }

    const openBusinessPanel = () => {
      openPanel('business')
    }

    const openBlogPanel = () => {
      openPanel('blog')
    }

    const editAvatar = () => {
      showNotification('Смена аватара будет доступна в следующем обновлении', 'info')
    }

    const editContact = (type) => {
      showNotification(`Редактирование ${type} будет доступно в следующем обновлении`, 'info')
    }

    const editProfile = () => {
      showNotification('Полное редактирование профиля в разработке', 'info')
    }

    const showFavorites = () => {
      showNotification('Раздел "Избранное" будет доступен в следующем обновлении', 'info')
    }

    const showSettings = () => {
      showNotification('Настройки профиля в разработке', 'info')
    }

    const showSupport = () => {
      openPanel('about')
    }

    const registerBusiness = async () => {
      try {
        const businessData = {
          companyName: user.value.name,
          registrationDate: new Date().toISOString()
        }
        
        await registerAsBusiness(businessData)
        showNotification('Поздравляем! Теперь вы партнер MapChap', 'success')
      } catch (error) {
        showNotification('Ошибка при регистрации бизнеса', 'error')
      }
    }

    const handleLogout = () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        logout()
        closePanel()
        showNotification('Вы успешно вышли из аккаунта', 'success')
      }
    }

    return {
      authStore,
      isAuthenticated,
      isBusinessOwner,
      businessStats,
      userArticles,
      roleDisplayName,
      closePanel,
      initAuth,
      logout: handleLogout,
      registerBusiness,
      openBusinessPanel,
      openBlogPanel,
      editAvatar,
      editContact,
      editProfile,
      showFavorites,
      showSettings,
      showSupport,
      formatDate,
      formatTelegramDate
    }
  }
}
</script>

<style scoped>
.profile-content {
  padding: 0;
}

.loading-state, .auth-required {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.auth-icon {
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
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  position: relative;
}

.avatar-section {
  position: relative;
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
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.edit-avatar-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  background: var(--accent);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
}

.profile-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-username {
  margin: 0 0 1rem 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.role {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.badge.member-since {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.contact-section,
.stats-section,
.actions-section,
.telegram-section,
.account-actions {
  margin-bottom: 2rem;
}

.contact-section h3,
.stats-section h3,
.actions-section h3,
.telegram-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.contact-grid {
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.contact-value {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.contact-edit {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.contact-edit:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-card .stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: var(--primary-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  line-height: 1;
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
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-btn.highlight {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-color: var(--primary);
}

.action-btn.highlight:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.action-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.action-badge {
  background: var(--accent);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.telegram-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.telegram-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.telegram-item:last-child {
  border-bottom: none;
}

.telegram-item .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.telegram-item .value {
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-tertiary);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .telegram-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 1.5rem;
  }
  
  .avatar-large {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
