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
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка профиля...</p>
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в систему, чтобы просмотреть профиль</p>
        <button class="btn btn-primary" @click="initAuth">
          Войти через Telegram
        </button>
      </div>

      <!-- Контент профиля -->
      <div v-else class="profile-content">
        <!-- Аватар и основная информация -->
        <div class="profile-summary">
          <div class="avatar-section">
            <div class="avatar">
              <img v-if="user?.photo_url" :src="user.photo_url" alt="Avatar" />
              <div v-else class="avatar-placeholder">
                {{ getUserInitials }}
              </div>
              <div class="role-badge" v-if="user?.role === 'business_owner'">
                💼
              </div>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ user?.first_name }} {{ user?.last_name }}</h3>
              <p class="user-username" v-if="user?.username">
                @{{ user.username }}
              </p>
              <div class="user-role" v-if="user?.role === 'business_owner'">
                <span class="role-icon">✅</span>
                <span>{{ user?.is_verified ? 'Верифицированный бизнес' : 'Бизнес-аккаунт' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Табы профиля -->
        <div class="profile-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- История просмотров -->
          <div v-if="activeTab === 'history'" class="history-tab">
            <div class="section-header">
              <h4>🕰️ История просмотров</h4>
              <button v-if="viewHistory.length > 0" class="btn-link" @click="clearHistory">
                Очистить
              </button>
            </div>

            <div v-if="isLoadingHistory" class="loading-inline">
              <div class="loading-spinner-small"></div>
              <span>Загрузка...</span>
            </div>

            <div v-else-if="viewHistory.length === 0" class="empty-state-small">
              <span class="empty-icon">👁️</span>
              <p>Вы еще не просматривали объявления</p>
            </div>

            <div v-else class="history-list">
              <div 
                v-for="item in viewHistory" 
                :key="item.id"
                class="history-item"
                @click="openOffer(item)"
              >
                <div class="history-icon">
                  {{ getCategoryIcon(item.category) }}
                </div>
                <div class="history-content">
                  <h5 class="history-title">{{ item.title }}</h5>
                  <p class="history-address">{{ item.address }}</p>
                  <span class="history-time">{{ formatTime(item.viewed_at) }}</span>
                </div>
                <div class="history-arrow">›</div>
              </div>
            </div>
          </div>

          <!-- Избранное -->
          <div v-if="activeTab === 'favorites'" class="favorites-tab">
            <div class="section-header">
              <h4>⭐ Избранные места</h4>
            </div>

            <div v-if="isLoadingFavorites" class="loading-inline">
              <div class="loading-spinner-small"></div>
              <span>Загрузка...</span>
            </div>

            <div v-else-if="favorites.length === 0" class="empty-state-small">
              <span class="empty-icon">⭐</span>
              <p>Добавьте места в избранное</p>
            </div>

            <div v-else class="favorites-list">
              <div 
                v-for="item in favorites" 
                :key="item.id"
                class="favorite-item"
              >
                <div class="favorite-icon">
                  {{ getCategoryIcon(item.category) }}
                </div>
                <div class="favorite-content">
                  <h5 class="favorite-title">{{ item.title }}</h5>
                  <p class="favorite-address">{{ item.address }}</p>
                  <div class="favorite-stats">
                    <span>⭐ {{ item.rating || 0 }}</span>
                    <span>👁️ {{ item.views || 0 }}</span>
                  </div>
                </div>
                <button class="remove-favorite-btn" @click="removeFavorite(item.id)">
                  ❤️
                </button>
              </div>
            </div>
          </div>

          <!-- Любимые категории -->
          <div v-if="activeTab === 'categories'" class="categories-tab">
            <div class="section-header">
              <h4>🎯 Любимые категории</h4>
              <p class="section-description">
                Выберите категории, чтобы получать уведомления о близких местах
              </p>
            </div>

            <div class="categories-grid">
              <button
                v-for="category in allCategories"
                :key="category.id"
                class="category-toggle"
                :class="{ active: favoriteCategories.includes(category.id) }"
                :style="{ '--category-color': category.color }"
                @click="toggleFavoriteCategory(category.id)"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-check" v-if="favoriteCategories.includes(category.id)">✓</span>
              </button>
            </div>

            <button 
              class="btn btn-primary btn-block" 
              @click="saveFavoriteCategories"
              :disabled="isSavingCategories"
            >
              {{ isSavingCategories ? 'Сохранение...' : 'Сохранить настройки' }}
            </button>
          </div>

          <!-- Настройки -->
          <div v-if="activeTab === 'settings'" class="settings-tab">
            <div class="section-header">
              <h4>⚙️ Настройки</h4>
            </div>

            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-icon">🔔</span>
                  <div class="setting-text">
                    <h5>Уведомления</h5>
                    <p>Получать уведомления о близких местах</p>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="notificationsEnabled"
                    @change="saveNotificationSettings"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-icon">🌙</span>
                  <div class="setting-text">
                    <h5>Темная тема</h5>
                    <p>Использовать тему Telegram</p>
                  </div>
                </div>
                <span class="setting-value">Авто</span>
              </div>
            </div>

            <div class="logout-section">
              <button class="btn btn-danger btn-block" @click="logout">
                🚪 Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { useOffersStore } from '../stores/offersStore'
import { storeToRefs } from 'pinia'
import { apiService } from '../services/api'

export default {
  name: 'ProfilePanel',
  setup() {
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    const offersStore = useOffersStore()
    
    const { closePanel, showNotification } = uiStore
    const { user, isAuthenticated } = storeToRefs(authStore)
    const { categories: allCategories } = storeToRefs(offersStore)

    // State
    const isLoading = ref(false)
    const isLoadingHistory = ref(false)
    const isLoadingFavorites = ref(false)
    const isSavingCategories = ref(false)
    const activeTab = ref('history')
    const viewHistory = ref([])
    const favorites = ref([])
    const favoriteCategories = ref([])
    const notificationsEnabled = ref(true)

    // Tabs
    const tabs = computed(() => [
      { id: 'history', label: 'История', icon: '🕰️', count: viewHistory.value.length },
      { id: 'favorites', label: 'Избранное', icon: '⭐', count: favorites.value.length },
      { id: 'categories', label: 'Категории', icon: '🎯', count: favoriteCategories.value.length },
      { id: 'settings', label: 'Настройки', icon: '⚙️', count: 0 }
    ])

    // Computed
    const getUserInitials = computed(() => {
      if (!user.value) return '?'
      const first = user.value.first_name?.[0] || ''
      const last = user.value.last_name?.[0] || ''
      return (first + last).toUpperCase() || 'U'
    })

    // Methods
    const initAuth = () => {
      authStore.initTelegramAuth()
    }

    const loadHistory = async () => {
      if (!user.value?.telegram_id) return
      
      isLoadingHistory.value = true
      try {
        const result = await apiService.getUserHistory(user.value.telegram_id)
        viewHistory.value = result.history || []
      } catch (error) {
        console.log('History load error:', error)
        viewHistory.value = []
      } finally {
        isLoadingHistory.value = false
      }
    }

    const loadFavorites = async () => {
      if (!user.value?.telegram_id) return
      
      isLoadingFavorites.value = true
      try {
        const result = await apiService.getUserFavorites(user.value.telegram_id)
        favorites.value = result.favorites || []
      } catch (error) {
        console.log('Favorites load error:', error)
        favorites.value = []
      } finally {
        isLoadingFavorites.value = false
      }
    }

    const clearHistory = () => {
      viewHistory.value = []
      showNotification('История очищена', 'success')
    }

    const removeFavorite = async (offerId) => {
      try {
        await apiService.updateFavorites(user.value.telegram_id, offerId)
        favorites.value = favorites.value.filter(f => f.id !== offerId)
        showNotification('Удалено из избранного', 'success')
      } catch (error) {
        showNotification('Ошибка при удалении', 'error')
      }
    }

    const toggleFavoriteCategory = (categoryId) => {
      const index = favoriteCategories.value.indexOf(categoryId)
      if (index > -1) {
        favoriteCategories.value.splice(index, 1)
      } else {
        favoriteCategories.value.push(categoryId)
      }
    }

    const saveFavoriteCategories = async () => {
      isSavingCategories.value = true
      try {
        await apiService.updateFavoriteCategories(user.value.telegram_id, favoriteCategories.value)
        showNotification('Категории сохранены', 'success')
      } catch (error) {
        showNotification('Ошибка при сохранении', 'error')
      } finally {
        isSavingCategories.value = false
      }
    }

    const saveNotificationSettings = async () => {
      try {
        await apiService.updateUser(user.value.telegram_id, {
          notifications_enabled: notificationsEnabled.value
        })
        showNotification(
          notificationsEnabled.value ? 'Уведомления включены' : 'Уведомления отключены',
          'success'
        )
      } catch (error) {
        console.log('Settings save error:', error)
      }
    }

    const openOffer = (offer) => {
      offersStore.setSelectedOffer(offer)
      closePanel()
    }

    const logout = () => {
      authStore.logout()
      closePanel()
      showNotification('Вы вышли из аккаунта', 'info')
    }

    const getCategoryIcon = (categoryId) => {
      const icons = {
        food: '🍕', shopping: '🛍️', beauty: '💄', services: '🔧',
        medical: '⚕️', furniture: '🛋️', pharmacy: '💊', entertainment: '🎭',
        education: '📚', auto: '🚗', hotel: '🏨'
      }
      return icons[categoryId] || '📍'
    }

    const formatTime = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Только что'
      if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`
      return date.toLocaleDateString('ru-RU')
    }

    // Watch for auth changes
    watch(isAuthenticated, (newVal) => {
      if (newVal && user.value) {
        loadHistory()
        loadFavorites()
        favoriteCategories.value = user.value.favorite_categories || []
        notificationsEnabled.value = user.value.notifications_enabled !== false
      }
    }, { immediate: true })

    onMounted(() => {
      if (isAuthenticated.value && user.value) {
        loadHistory()
        loadFavorites()
        favoriteCategories.value = user.value.favorite_categories || []
        notificationsEnabled.value = user.value.notifications_enabled !== false
      }
    })

    return {
      isLoading,
      isLoadingHistory,
      isLoadingFavorites,
      isSavingCategories,
      activeTab,
      tabs,
      viewHistory,
      favorites,
      favoriteCategories,
      notificationsEnabled,
      allCategories,
      user,
      isAuthenticated,
      getUserInitials,
      closePanel,
      initAuth,
      clearHistory,
      removeFavorite,
      toggleFavoriteCategory,
      saveFavoriteCategories,
      saveNotificationSettings,
      openOffer,
      logout,
      getCategoryIcon,
      formatTime
    }
  }
}
</script>

<style scoped>
.profile-content {
  padding: 0;
}

.profile-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  color: white;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
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
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.role-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
}

.user-username {
  margin: 0 0 8px 0;
  opacity: 0.9;
  font-size: 14px;
}

.user-role {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.profile-tabs {
  display: flex;
  gap: 4px;
  background: var(--tg-secondary-bg-color);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
}

.tab-button.active {
  background: var(--tg-button-color);
  color: white;
}

.tab-icon {
  font-size: 18px;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}

.tab-count {
  font-size: 10px;
  background: rgba(0,0,0,0.1);
  padding: 1px 6px;
  border-radius: 10px;
}

.tab-button.active .tab-count {
  background: rgba(255,255,255,0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
}

.section-description {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--tg-hint-color);
}

.btn-link {
  background: none;
  border: none;
  color: var(--tg-button-color);
  font-size: 14px;
  cursor: pointer;
}

.loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--tg-hint-color);
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid var(--tg-border-color);
  border-top-color: var(--tg-button-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state-small {
  text-align: center;
  padding: 30px 20px;
  color: var(--tg-hint-color);
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.empty-state-small p {
  margin: 0;
  font-size: 14px;
}

/* History list */
.history-list,
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item,
.favorite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover,
.favorite-item:hover {
  background: var(--tg-border-color);
}

.history-icon,
.favorite-icon {
  width: 44px;
  height: 44px;
  background: var(--tg-bg-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.history-content,
.favorite-content {
  flex: 1;
  min-width: 0;
}

.history-title,
.favorite-title {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-address,
.favorite-address {
  margin: 0;
  font-size: 12px;
  color: var(--tg-hint-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 11px;
  color: var(--tg-hint-color);
}

.favorite-stats {
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--tg-hint-color);
}

.history-arrow {
  font-size: 20px;
  color: var(--tg-hint-color);
}

.remove-favorite-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.remove-favorite-btn:hover {
  opacity: 1;
}

/* Categories grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.category-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid var(--tg-border-color);
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.category-toggle.active {
  border-color: var(--category-color, var(--tg-button-color));
  background: var(--category-color, var(--tg-button-color));
  color: white;
}

.category-toggle .category-icon {
  font-size: 20px;
}

.category-toggle .category-name {
  font-size: 12px;
  font-weight: 500;
  flex: 1;
}

.category-check {
  font-size: 14px;
  font-weight: 700;
}

/* Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-icon {
  font-size: 24px;
}

.setting-text h5 {
  margin: 0 0 2px 0;
  font-size: 14px;
}

.setting-text p {
  margin: 0;
  font-size: 12px;
  color: var(--tg-hint-color);
}

.setting-value {
  font-size: 13px;
  color: var(--tg-hint-color);
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--tg-border-color);
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--tg-button-color);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

.logout-section {
  margin-top: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--tg-button-color);
  color: var(--tg-button-text-color);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-block {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Auth required */
.loading-state,
.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--tg-border-color);
  border-top-color: var(--tg-button-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.auth-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.auth-required h3 {
  margin: 0 0 8px 0;
}

.auth-required p {
  margin: 0 0 20px 0;
  color: var(--tg-hint-color);
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .tab-label {
    display: none;
  }
  
  .tab-button {
    min-width: 50px;
  }
}
</style>
