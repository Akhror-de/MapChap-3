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
      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в аккаунт для доступа к профилю</p>
        <button class="btn btn-primary" @click="initAuth">
          Войти через Telegram
        </button>
      </div>

      <!-- Основной контент профиля -->
      <div v-else class="profile-content">
        <!-- Шапка профиля -->
        <div class="profile-header">
          <div class="profile-avatar">
            <img v-if="user.photo_url" :src="user.photo_url" :alt="user.name" />
            <div v-else class="avatar-placeholder">
              {{ getUserInitials(user) }}
            </div>
          </div>
          <div class="profile-info">
            <h3 class="user-name">{{ user.first_name }} {{ user.last_name }}</h3>
            <p class="user-username" v-if="user.username">@{{ user.username }}</p>
            <p class="user-join-date">Участник с {{ formatJoinDate(user.join_date) }}</p>
          </div>
          <button class="btn btn-secondary logout-btn" @click="logout">
            <span class="btn-icon">🚪</span>
            Выйти
          </button>
        </div>

        <!-- Вкладки -->
        <div class="tabs">
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'edit' }"
            @click="setActiveTab('edit')"
          >
            ✏️ Редактировать
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'favorites' }"
            @click="setActiveTab('favorites')"
          >
            ⭐ Избранное
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'stats' }"
            @click="setActiveTab('stats')"
          >
            📊 Статистика
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="tab-content">
          <!-- Редактирование профиля -->
          <div v-if="activeTab === 'edit'" class="edit-tab">
            <div class="section-header">
              <h3>✏️ Редактирование профиля</h3>
              <p>Обновите информацию о себе</p>
            </div>

            <div class="profile-form">
              <div class="avatar-upload">
                <div class="avatar-preview">
                  <img v-if="editForm.photo_url" :src="editForm.photo_url" alt="Avatar" />
                  <div v-else class="avatar-placeholder large">
                    {{ getUserInitials(user) }}
                  </div>
                </div>
                <div class="upload-actions">
                  <button type="button" class="btn btn-secondary" @click="changeAvatar">
                    <span class="btn-icon">🖼️</span>
                    Сменить фото
                  </button>
                  <button type="button" class="btn btn-outline" @click="removeAvatar" v-if="editForm.photo_url">
                    <span class="btn-icon">🗑️</span>
                    Удалить
                  </button>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Имя *</label>
                  <input 
                    v-model="editForm.first_name"
                    type="text" 
                    placeholder="Ваше имя"
                    required
                    @keydown.enter.prevent
                  >
                </div>

                <div class="form-group">
                  <label>Фамилия *</label>
                  <input 
                    v-model="editForm.last_name"
                    type="text" 
                    placeholder="Ваша фамилия"
                    required
                    @keydown.enter.prevent
                  >
                </div>

                <div class="form-group">
                  <label>Username</label>
                  <input 
                    v-model="editForm.username"
                    type="text" 
                    placeholder="username"
                    @input="formatUsername"
                    @keydown.enter.prevent
                  >
                  <div class="input-hint">Только латинские буквы, цифры и подчеркивания</div>
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input 
                    v-model="editForm.email"
                    type="email" 
                    placeholder="email@example.com"
                    @keydown.enter.prevent
                  >
                </div>

                <div class="form-group full-width">
                  <label>О себе</label>
                  <textarea 
                    v-model="editForm.bio"
                    placeholder="Расскажите о себе..."
                    rows="3"
                    maxlength="200"
                    @keydown.enter.prevent
                  ></textarea>
                  <div class="char-counter">{{ editForm.bio.length }}/200</div>
                </div>

                <div class="form-group">
                  <label>Город</label>
                  <input 
                    v-model="editForm.city"
                    type="text" 
                    placeholder="Ваш город"
                    @keydown.enter.prevent
                  >
                </div>

                <div class="form-group">
                  <label>Телефон</label>
                  <input 
                    v-model="editForm.phone"
                    type="tel" 
                    placeholder="+7 (999) 123-45-67"
                    @keydown.enter.prevent
                  >
                </div>
              </div>

              <!-- Настройки уведомлений -->
              <div class="settings-section">
                <h4>🔔 Настройки уведомлений</h4>
                <div class="settings-list">
                  <label class="setting-item">
                    <input 
                      type="checkbox" 
                      v-model="editForm.notifications.email"
                    >
                    <span class="setting-label">
                      <span class="setting-icon">📧</span>
                      Email уведомления
                    </span>
                  </label>
                  <label class="setting-item">
                    <input 
                      type="checkbox" 
                      v-model="editForm.notifications.news"
                    >
                    <span class="setting-label">
                      <span class="setting-icon">📰</span>
                      Новости и обновления
                    </span>
                  </label>
                  <label class="setting-item">
                    <input 
                      type="checkbox" 
                      v-model="editForm.notifications.promotions"
                    >
                    <span class="setting-label">
                      <span class="setting-icon">🎁</span>
                      Спецпредложения
                    </span>
                  </label>
                </div>
              </div>

              <!-- Действия формы -->
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="resetForm">
                  Отменить
                </button>
                <button type="button" class="btn btn-primary" @click="updateProfile" :disabled="!hasChanges || isSubmitting">
                  <span v-if="isSubmitting" class="loading-spinner-small"></span>
                  <span v-else>💾</span>
                  {{ isSubmitting ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Избранное -->
          <div v-if="activeTab === 'favorites'" class="favorites-tab">
            <div class="section-header">
              <h3>⭐ Избранные места</h3>
              <p>Ваши сохраненные бизнесы и места</p>
            </div>

            <!-- Фильтры избранного -->
            <div class="filters">
              <div class="filter-group">
                <select v-model="favoritesFilter" @change="applyFavoritesFilter">
                  <option value="all">Все категории</option>
                  <option value="cafe">☕ Кафе</option>
                  <option value="restaurant">🍕 Рестораны</option>
                  <option value="shop">🛍️ Магазины</option>
                  <option value="service">🔧 Услуги</option>
                </select>
              </div>
              <div class="filter-group">
                <select v-model="favoritesSort" @change="applyFavoritesFilter">
                  <option value="recent">Сначала новые</option>
                  <option value="name">По названию</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>

            <!-- Список избранного -->
            <div class="favorites-list">
              <div v-if="filteredFavorites.length === 0" class="empty-state">
                <div class="empty-icon">⭐</div>
                <h4>Пока нет избранных мест</h4>
                <p>Добавляйте бизнесы в избранное, чтобы легко находить их позже</p>
                <button class="btn btn-primary" @click="exploreBusinesses">
                  Найти бизнесы
                </button>
              </div>

              <div v-else class="favorites-grid">
                <div 
                  v-for="favorite in filteredFavorites" 
                  :key="favorite.id"
                  class="favorite-card"
                >
                  <div class="favorite-image">
                    <img v-if="favorite.image" :src="favorite.image" :alt="favorite.name" />
                    <div v-else class="image-placeholder">
                      🏢
                    </div>
                    <button class="favorite-btn active" @click="removeFromFavorites(favorite.id)">
                      ❤️
                    </button>
                  </div>
                  
                  <div class="favorite-content">
                    <h4 class="favorite-name">{{ favorite.name }}</h4>
                    <p class="favorite-category">{{ getCategoryName(favorite.category) }}</p>
                    <p class="favorite-address">{{ favorite.address }}</p>
                    
                    <div class="favorite-meta">
                      <div class="rating">
                        <span class="rating-stars">⭐</span>
                        <span class="rating-value">{{ favorite.rating || 'Нет' }}</span>
                      </div>
                      <div class="distance" v-if="favorite.distance">
                        📍 {{ favorite.distance }} км
                      </div>
                    </div>

                    <div class="favorite-actions">
                      <button class="btn btn-small" @click="viewOnMap(favorite)">
                        🗺️ На карте
                      </button>
                      <button class="btn btn-small btn-primary" @click="viewDetails(favorite)">
                        👀 Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Статистика избранного -->
            <div class="favorites-stats">
              <div class="stat-card">
                <div class="stat-value">{{ profileStore.totalFavorites }}</div>
                <div class="stat-label">Всего избранных</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ profileStore.favoriteCategories }}</div>
                <div class="stat-label">Категорий</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ profileStore.avgRating }}</div>
                <div class="stat-label">Средний рейтинг</div>
              </div>
            </div>
          </div>

          <!-- Статистика пользователя -->
          <div v-if="activeTab === 'stats'" class="stats-tab">
            <div class="section-header">
              <h3>📊 Моя статистика</h3>
              <p>Ваша активность на платформе</p>
            </div>

            <!-- Основные метрики -->
            <div class="metrics-grid">
              <div class="metric-card primary">
                <div class="metric-icon">⭐</div>
                <div class="metric-content">
                  <div class="metric-value">{{ userStats.totalFavorites || 0 }}</div>
                  <div class="metric-label">Избранных мест</div>
                </div>
              </div>
              <div class="metric-card success">
                <div class="metric-icon">👁️</div>
                <div class="metric-content">
                  <div class="metric-value">{{ userStats.totalViews || 0 }}</div>
                  <div class="metric-label">Просмотров</div>
                </div>
              </div>
              <div class="metric-card warning">
                <div class="metric-icon">💬</div>
                <div class="metric-content">
                  <div class="metric-value">{{ userStats.totalComments || 0 }}</div>
                  <div class="metric-label">Комментариев</div>
                </div>
              </div>
              <div class="metric-card info">
                <div class="metric-icon">📅</div>
                <div class="metric-content">
                  <div class="metric-value">{{ userStats.daysActive || 0 }}</div>
                  <div class="metric-label">Дней с нами</div>
                </div>
              </div>
            </div>

            <!-- Детальная статистика -->
            <div class="detailed-stats">
              <div class="stat-section">
                <h4>🎯 Активность по категориям</h4>
                <div class="category-stats">
                  <div 
                    v-for="category in userStats.categoryDistribution" 
                    :key="category.name"
                    class="category-stat"
                  >
                    <div class="category-info">
                      <span class="category-icon">{{ category.icon }}</span>
                      <span class="category-name">{{ category.name }}</span>
                    </div>
                    <div class="category-value">{{ category.count }} мест</div>
                  </div>
                </div>
              </div>

              <div class="stat-section">
                <h4>📈 Активность за месяц</h4>
                <div class="activity-chart">
                  <div 
                    v-for="day in userStats.monthlyActivity" 
                    :key="day.date"
                    class="chart-bar"
                    :style="{ height: day.activity * 2 + 'px' }"
                    :title="`${day.date}: ${day.activity} действий`"
                  ></div>
                </div>
                <div class="chart-legend">
                  <span>Низкая</span>
                  <span>Высокая активность</span>
                </div>
              </div>

              <!-- Достижения -->
              <div class="stat-section">
                <h4>🏆 Достижения</h4>
                <div class="achievements-grid">
                  <div 
                    v-for="achievement in userStats.achievements" 
                    :key="achievement.id"
                    class="achievement-card"
                    :class="{ unlocked: achievement.unlocked }"
                  >
                    <div class="achievement-icon">{{ achievement.icon }}</div>
                    <div class="achievement-content">
                      <h5>{{ achievement.name }}</h5>
                      <p>{{ achievement.description }}</p>
                      <div class="achievement-progress" v-if="!achievement.unlocked">
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: achievement.progress + '%' }"
                          ></div>
                        </div>
                        <span class="progress-text">{{ achievement.progress }}%</span>
                      </div>
                      <div class="achievement-date" v-else>
                        Получено {{ formatDate(achievement.unlockedAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Экспорт данных -->
            <div class="export-section">
              <h4>📤 Экспорт данных</h4>
              <p>Вы можете скачать ваши данные в удобном формате</p>
              <div class="export-actions">
                <button class="btn btn-secondary" @click="exportData('json')">
                  <span class="btn-icon">📄</span>
                  JSON
                </button>
                <button class="btn btn-secondary" @click="exportData('csv')">
                  <span class="btn-icon">📊</span>
                  CSV
                </button>
                <button class="btn btn-secondary" @click="exportData('pdf')">
                  <span class="btn-icon">📋</span>
                  PDF отчет
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, reactive } from 'vue'

export default {
  name: 'ProfilePanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    const { closePanel, showNotification } = uiStore
    const { initTelegramAuth, logout: authLogout } = authStore
    const { updateUserProfile, getFavorites, removeFavorite, init } = profileStore

    const { isAuthenticated, user } = storeToRefs(authStore)
    const { favorites, userStats } = storeToRefs(profileStore)

    // State
    const isLoading = ref(false)
    const activeTab = ref('edit')
    const favoritesFilter = ref('all')
    const favoritesSort = ref('recent')
    const isSubmitting = ref(false)

    // Form data
    const editForm = reactive({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      bio: '',
      city: '',
      phone: '',
      photo_url: '',
      notifications: {
        email: true,
        news: true,
        promotions: false
      }
    })

    // Computed
    const hasChanges = computed(() => {
      if (!user.value) return false
      
      return editForm.first_name !== user.value.first_name ||
             editForm.last_name !== user.value.last_name ||
             editForm.username !== (user.value.username || '') ||
             editForm.email !== (user.value.email || '') ||
             editForm.bio !== (user.value.bio || '') ||
             editForm.city !== (user.value.city || '') ||
             editForm.phone !== (user.value.phone || '') ||
             editForm.photo_url !== (user.value.photo_url || '')
    })

    const filteredFavorites = computed(() => {
      let filtered = favorites.value

      // Фильтрация по категории
      if (favoritesFilter.value !== 'all') {
        filtered = filtered.filter(fav => fav.category === favoritesFilter.value)
      }

      // Сортировка
      switch (favoritesSort.value) {
        case 'recent':
          filtered.sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
      }

      return filtered
    })

    // Methods
    const initAuth = () => {
      initTelegramAuth()
    }

    const logout = () => {
      if (confirm('Вы уверены, что хотите выйти?')) {
        authLogout()
        closePanel()
        showNotification('Вы успешно вышли из аккаунта', 'success')
      }
    }

    const setActiveTab = (tab) => {
      activeTab.value = tab
    }

    const getUserInitials = (user) => {
      if (!user) return '👤'
      const firstName = user.first_name || ''
      const lastName = user.last_name || ''
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '👤'
    }

    const formatJoinDate = (dateString) => {
      if (!dateString) return 'недавно'
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long'
      })
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU')
    }

    const formatUsername = () => {
      editForm.username = editForm.username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
    }

    const changeAvatar = () => {
      showNotification('Функция смены аватара будет доступна в следующем обновлении', 'info')
    }

    const removeAvatar = () => {
      editForm.photo_url = ''
    }

    const updateProfile = async () => {
      if (!hasChanges.value || isSubmitting.value) return
      
      isSubmitting.value = true
      try {
        await updateUserProfile(editForm)
        showNotification('Профиль успешно обновлен', 'success')
      } catch (error) {
        console.error('Error updating profile:', error)
        showNotification('Ошибка при обновлении профиля', 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    const resetForm = () => {
      if (!user.value) return
      
      Object.assign(editForm, {
        first_name: user.value.first_name || '',
        last_name: user.value.last_name || '',
        username: user.value.username || '',
        email: user.value.email || '',
        bio: user.value.bio || '',
        city: user.value.city || '',
        phone: user.value.phone || '',
        photo_url: user.value.photo_url || '',
        notifications: user.value.notifications || {
          email: true,
          news: true,
          promotions: false
        }
      })
    }

    const applyFavoritesFilter = () => {
      // Фильтрация применяется в computed свойстве
    }

    const removeFromFavorites = async (favoriteId) => {
      try {
        await removeFavorite(favoriteId)
        showNotification('Удалено из избранного', 'success')
      } catch (error) {
        showNotification('Ошибка при удалении из избранного', 'error')
      }
    }

    const viewOnMap = (favorite) => {
      showNotification(`Показать на карте: ${favorite.name}`, 'info')
      // В реальном приложении здесь будет навигация на карту
    }

    const viewDetails = (favorite) => {
      showNotification(`Подробности: ${favorite.name}`, 'info')
      // В реальном приложении здесь будет открытие деталей бизнеса
    }

    const exploreBusinesses = () => {
      closePanel()
      showNotification('Исследуйте бизнесы на карте', 'info')
    }

    const getCategoryName = (categoryId) => {
      const categories = {
        restaurant: 'Ресторан',
        cafe: 'Кафе',
        shop: 'Магазин',
        service: 'Услуги'
      }
      return categories[categoryId] || 'Другое'
    }

    const exportData = (format) => {
      showNotification(`Экспорт данных в формате ${format} будет доступен в следующем обновлении`, 'info')
    }

    // Load user data
    const loadUserData = () => {
      if (isAuthenticated.value) {
        resetForm()
        // Загрузка избранного и статистики
        init()
      }
    }

    onMounted(() => {
      loadUserData()
    })

    return {
      // Stores
      authStore,
      profileStore,
      
      // State
      isLoading,
      activeTab,
      favoritesFilter,
      favoritesSort,
      editForm,
      isSubmitting,
      
      // Computed
      isAuthenticated,
      user,
      favorites: filteredFavorites,
      userStats,
      hasChanges,
      
      // Methods
      closePanel,
      initAuth,
      logout,
      setActiveTab,
      updateProfile,
      resetForm,
      removeFromFavorites,
      viewOnMap,
      viewDetails,
      exploreBusinesses,
      applyFavoritesFilter,
      getCategoryName,
      exportData,
      getUserInitials,
      formatJoinDate,
      formatDate,
      formatUsername,
      changeAvatar,
      removeAvatar
    }
  }
}
</script>

<style scoped>
/* Добавим стиль для маленького спиннера загрузки */
.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Остальные стили остаются такими же как в предыдущей версии */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.avatar-placeholder.large {
  width: 120px;
  height: 120px;
  font-size: 2rem;
}

.profile-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.3rem;
  color: var(--text-primary);
}

.user-username {
  margin: 0 0 0.5rem 0;
  color: var(--primary);
  font-weight: 500;
}

.user-join-date {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.logout-btn {
  align-self: flex-start;
}

/* Вкладки */
.tabs {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-radius: 12px;
  font-weight: 500;
  min-width: 120px;
  white-space: nowrap;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

/* Форма редактирования */
.profile-form {
  padding: 1rem 0;
}

.avatar-upload {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.avatar-preview {
  margin-bottom: 1rem;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Настройки уведомлений */
.settings-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.settings-section h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.setting-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.setting-icon {
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Остальные стили... */
</style>
