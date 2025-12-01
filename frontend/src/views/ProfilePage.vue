<template>
  <div class="profile-page">
    <div class="container">
      <!-- Заголовок профиля -->
      <ProfileHeader
        :user="user"
        :is-loading="isLoading"
        @avatar-upload="handleAvatarUpload"
        @avatar-remove="removeAvatar"
      />

      <!-- Навигация по табам -->
      <ProfileTabs
        v-model:active-tab="activeTab"
        :tabs="tabs"
        :has-unsaved-changes="hasChanges"
      />

      <!-- Содержимое табов -->
      <div class="profile-content">
        <div v-if="isLoading" class="loading-container">
          <LoadingSpinner size="large" />
        </div>

        <template v-else>
          <!-- Редактирование профиля -->
          <ProfileEditTab
            v-if="activeTab === 'edit'"
            v-model:form-data="editForm"
            :validation-errors="validationErrors"
            :is-submitting="isSubmitting"
            :has-changes="hasChanges"
            @update:field="validateField"
            @save="updateProfile"
            @reset="resetForm"
          />

          <!-- Статистика -->
          <ProfileStatsTab
            v-else-if="activeTab === 'stats'"
            :user-stats="userStats"
            :is-loading="isLoading"
            @export-stats="exportStats"
          />

          <!-- Избранное -->
          <ProfileFavoritesTab
            v-else-if="activeTab === 'favorites'"
            :favorites="favorites"
            :is-loading="isLoading"
            @remove-favorite="removeFavorite"
            @export-favorites="exportFavorites"
          />

          <!-- Уведомления -->
          <ProfileNotifications
            v-else-if="activeTab === 'notifications'"
            v-model:notifications="editForm.notifications"
            @update="markFormDirty"
          />

          <!-- Безопасность -->
          <ProfileSecurity
            v-else-if="activeTab === 'security'"
            @password-change="handlePasswordChange"
          />
        </template>
      </div>
    </div>

    <!-- Модальное окно несохраненных изменений -->
    <UnsavedChangesModal
      :show="showUnsavedModal"
      @confirm="confirmNavigation"
      @cancel="cancelNavigation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfile } from '../composables/useProfile'

// Components
import ProfileHeader from '../components/profile/ProfileHeader.vue'
import ProfileTabs from '../components/profile/ProfileTabs.vue'
import ProfileEditTab from '../components/profile/ProfileEditTab.vue'
import ProfileStatsTab from '../components/profile/ProfileStatsTab.vue'
import ProfileFavoritesTab from '../components/profile/ProfileFavoritesTab.vue'
import ProfileNotifications from '../components/profile/ProfileNotifications.vue'
import ProfileSecurity from '../components/profile/ProfileSecurity.vue'
import UnsavedChangesModal from '../components/profile/UnsavedChangesModal.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const {
  // State
  isLoading,
  isSubmitting,
  activeTab,
  formDirty,
  validationErrors,
  
  // Computed
  hasChanges,
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
const pendingNavigation = ref(null)

// Табы профиля
const tabs = [
  { id: 'edit', label: 'Профиль', icon: '👤' },
  { id: 'stats', label: 'Статистика', icon: '📊' },
  { id: 'favorites', label: 'Избранное', icon: '⭐' },
  { id: 'notifications', label: 'Уведомления', icon: '🔔' },
  { id: 'security', label: 'Безопасность', icon: '🔒' }
]

// Обработчики событий
const removeFavorite = async (favoriteId) => {
  // TODO: Implement remove favorite logic
  console.log('Remove favorite:', favoriteId)
}

const exportFavorites = (format) => {
  // TODO: Implement export favorites logic
  console.log('Export favorites as:', format)
}

const exportStats = (format) => {
  // TODO: Implement export stats logic
  console.log('Export stats as:', format)
}

const handlePasswordChange = async (passwordData) => {
  // TODO: Implement password change logic
  console.log('Change password:', passwordData)
}

// Навигация с проверкой несохраненных изменений
const handleNavigation = (to) => {
  if (hasChanges.value) {
    showUnsavedModal.value = true
    pendingNavigation.value = to
  } else {
    router.push(to)
  }
}

const confirmNavigation = () => {
  if (pendingNavigation.value) {
    router.push(pendingNavigation.value)
  }
  showUnsavedModal.value = false
  pendingNavigation.value = null
}

const cancelNavigation = () => {
  showUnsavedModal.value = false
  pendingNavigation.value = null
}

// Инициализация
onMounted(() => {
  // Установка активного таба из URL
  if (route.query.tab && tabs.some(tab => tab.id === route.query.tab)) {
    activeTab.value = route.query.tab
  }
})

// Защита от потери данных при закрытии страницы
onBeforeUnmount(() => {
  if (hasChanges.value) {
    // Можно показать подтверждение или автоматически сохранить
    console.log('Unsaved changes detected')
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow: hidden;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px 0;
  }
  
  .container {
    padding: 0 10px;
  }
}
</style>
