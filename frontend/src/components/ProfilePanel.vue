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
        <LoadingSpinner size="large" text="Загрузка профиля..." />
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в систему, чтобы просмотреть профиль</p>
        <button class="btn btn-primary" @click="redirectToLogin">
          Войти
        </button>
      </div>

      <!-- Контент профиля -->
      <div v-else class="profile-content">
        <!-- Аватар и основная информация -->
        <div class="profile-summary">
          <div class="avatar-section">
            <div class="avatar" @click="openAvatarUpload">
              <img v-if="user?.photo_url" :src="user.photo_url" alt="Avatar" />
              <div v-else class="avatar-placeholder">
                {{ getUserInitials }}
              </div>
              <div class="avatar-overlay">
                <span class="overlay-icon">📷</span>
              </div>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ user?.first_name }} {{ user?.last_name }}</h3>
              <p class="user-username" v-if="user?.username">
                @{{ user.username }}
              </p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
          </div>

          <!-- Быстрые действия -->
          <div class="quick-actions">
            <button class="action-btn" @click="switchTab('edit')">
              <span class="action-icon">✏️</span>
              Редактировать
            </button>
            <button class="action-btn" @click="switchTab('favorites')">
              <span class="action-icon">⭐</span>
              Избранное
              <span class="badge" v-if="favoritesCount > 0">{{ favoritesCount }}</span>
            </button>
            <button class="action-btn" @click="switchTab('stats')">
              <span class="action-icon">📊</span>
              Статистика
            </button>
          </div>
        </div>

        <!-- Табы профиля -->
        <div class="profile-tabs-wrapper">
          <div class="tabs-header">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-button"
              :class="{ active: activeTab === tab.id }"
              @click="switchTab(tab.id)"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>

          <div class="tab-content">
            <!-- Редактирование профиля -->
            <div v-if="activeTab === 'edit'" class="edit-tab">
              <ProfileEditTab
                v-if="user"
                v-model:form-data="editForm"
                :validation-errors="validationErrors"
                :is-submitting="isSubmitting"
                :has-changes="hasChanges"
                @update:field="validateField"
                @save="updateProfile"
                @reset="resetForm"
              />
            </div>

            <!-- Статистика -->
            <div v-else-if="activeTab === 'stats'" class="stats-tab">
              <ProfileStatsTab
                :user-stats="userStats"
                :is-loading="isLoading"
                @export-stats="exportStats"
              />
            </div>

            <!-- Избранное -->
            <div v-else-if="activeTab === 'favorites'" class="favorites-tab">
              <ProfileFavoritesTab
                :favorites="favorites"
                :is-loading="isLoading"
                @remove-favorite="removeFavorite"
                @export-favorites="exportFavorites"
              />
            </div>

            <!-- Уведомления -->
            <div v-else-if="activeTab === 'notifications'" class="notifications-tab">
              <ProfileNotifications
                v-model:notifications="editForm.notifications"
                @update="markFormDirty"
              />
            </div>

            <!-- Безопасность -->
            <div v-else-if="activeTab === 'security'" class="security-tab">
              <ProfileSecurity
                @password-change="handlePasswordChange"
              />
            </div>
          </div>
        </div>

        <!-- Информация о сессии -->
        <div class="session-info">
          <div class="session-item">
            <span class="session-label">В сети:</span>
            <span class="session-value">{{ formatLastActive }}</span>
          </div>
          <div class="session-item" v-if="user?.last_login">
            <span class="session-label">Последний вход:</span>
            <span class="session-value">{{ formatDate(user.last_login) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Аватар загрузка -->
    <input
      ref="avatarInput"
      type="file"
      accept="image/*"
      @change="handleAvatarChange"
      style="display: none"
    />

    <!-- Модальные окна -->
    <UnsavedChangesModal
      :show="showUnsavedModal"
      @confirm="confirmNavigation"
      @cancel="cancelNavigation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '../composables/useProfile'
import { formatDate, getRelativeTime } from '../utils/dateUtils'

// Компоненты профиля
import ProfileEditTab from './profile/ProfileEditTab.vue'
import ProfileStatsTab from './profile/ProfileStatsTab.vue'
import ProfileFavoritesTab from './profile/ProfileFavoritesTab.vue'
import ProfileNotifications from './profile/ProfileNotifications.vue'
import ProfileSecurity from './profile/ProfileSecurity.vue'
import UnsavedChangesModal from './profile/UnsavedChangesModal.vue'
import LoadingSpinner from './shared/LoadingSpinner.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const avatarInput = ref(null)

// Используем композабл профиля
const {
  // State
  isLoading,
  isSubmitting,
  activeTab,
  formDirty,
  validationErrors,
  uploadProgress,
  
  // Computed
  hasChanges,
  isValidForm,
  canSubmit,
  isAuthenticated,
  user,
  favorites,
  userStats,
  
  // Form
  editForm,
  
  // Methods
  validateField,
  markFormDirty,
  resetForm,
  updateProfile,
  handleAvatarUpload,
  removeAvatar
} = useProfile()

// Локальное состояние
const showUnsavedModal = ref(false)
const pendingAction = ref(null)

// Табы профиля
const tabs = [
  { id: 'edit', label: 'Профиль', icon: '👤' },
  { id: 'favorites', label: 'Избранное', icon: '⭐' },
  { id: 'stats', label: 'Статистика', icon: '📊' },
  { id: 'notifications', label: 'Уведомления', icon: '🔔' },
  { id: 'security', label: 'Безопасность', icon: '🔒' }
]

// Computed
const favoritesCount = computed(() => {
  return favorites.value?.length || 0
})

const getUserInitials = computed(() => {
  if (!user.value) return '?'
  const first = user.value.first_name?.[0] || ''
  const last = user.value.last_name?.[0] || ''
  return (first + last).toUpperCase() || 'U'
})

const formatLastActive = computed(() => {
  if (!user.value?.last_active) return 'только что'
  return getRelativeTime(user.value.last_active)
})

// Методы
const closePanel = () => {
  if (hasChanges.value) {
    showUnsavedModal.value = true
    pendingAction.value = 'close'
  } else {
    emit('close')
  }
}

const switchTab = (tabId) => {
  if (hasChanges.value && activeTab.value === 'edit') {
    showUnsavedModal.value = true
    pendingAction.value = { type: 'switch', tabId }
  } else {
    activeTab.value = tabId
  }
}

const openAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await handleAvatarUpload(file)
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
    }
  }
  event.target.value = ''
}

const redirectToLogin = () => {
  router.push('/login')
}

const confirmNavigation = () => {
  if (pendingAction.value === 'close') {
    emit('close')
  } else if (pendingAction.value?.type === 'switch') {
    activeTab.value = pendingAction.value.tabId
  }
  showUnsavedModal.value = false
  pendingAction.value = null
}

const cancelNavigation = () => {
  showUnsavedModal.value = false
  pendingAction.value = null
}

// Дополнительные методы (нужно реализовать)
const removeFavorite = async (favoriteId) => {
  console.log('Удалить избранное:', favoriteId)
  // TODO: Реализовать удаление
}

const exportFavorites = (format) => {
  console.log('Экспорт избранного в формате:', format)
  // TODO: Реализовать экспорт
}

const exportStats = (format) => {
  console.log('Экспорт статистики в формате:', format)
  // TODO: Реализовать экспорт
}

const handlePasswordChange = async (passwordData) => {
  console.log('Изменение пароля:', passwordData)
  // TODO: Реализовать смену пароля
}

// Инициализация
onMounted(() => {
  // Можно загрузить начальные данные здесь
})
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 450px;
  background: white;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.panel-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Состояния */
.loading-state,
.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
}

.auth-required .auth-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.auth-required h3 {
  margin: 0 0 10px 0;
  color: #1f2937;
}

.auth-required p {
  color: #6b7280;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Сводка профиля */
.profile-summary {
  margin-bottom: 30px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  cursor: pointer;
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
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 5px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.user-username {
  margin: 0 0 5px 0;
  color: #3b82f6;
  font-size: 0.9rem;
}

.user-email {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Быстрые действия */
.quick-actions {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e5e7eb;
}

.badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

/* Табы */
.tabs-header {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f3f4f6;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  min-height: 300px;
}

/* Контент табов */
.edit-tab,
.stats-tab,
.favorites-tab,
.notifications-tab,
.security-tab {
  animation: fadeIn 0.3s ease;
}

/* Информация о сессии */
.session-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
  font-size: 0.85rem;
  color: #6b7280;
}

.session-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.session-label {
  font-weight: 500;
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .side-panel {
    width: 100%;
  }
  
  .quick-actions {
    flex-wrap: wrap;
  }
  
  .tabs-header {
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .tab-label {
    display: none;
  }
  
  .tab-button {
    padding: 8px 12px;
  }
}
</style>
