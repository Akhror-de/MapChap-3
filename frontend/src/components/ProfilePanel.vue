<template>
  <div class="side-panel vercel-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">{{ t('profile_title') }}</h2>
      </div>
    </div>

    <div class="panel-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('loading') }}</p>
      </div>

      <div v-else-if="!isAuthenticated" class="auth-required">
        <div class="auth-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3>{{ t('profile_login_required') }}</h3>
        <p>{{ t('profile_login_message') }}</p>
        <button class="btn btn-primary" @click="initAuth">{{ t('profile_login') }}</button>
      </div>

      <div v-else class="profile-content">
        <!-- Аватар -->
        <div class="profile-hero">
          <div class="avatar-wrapper">
            <img v-if="user?.photo_url" :src="user.photo_url" class="avatar-img" />
            <div v-else class="avatar-placeholder">{{ getUserInitials }}</div>
            <span v-if="user?.role === 'business_owner'" class="role-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </span>
          </div>
          <h3 class="user-name">{{ user?.first_name }} {{ user?.last_name }}</h3>
          <p v-if="user?.username" class="user-handle">@{{ user.username }}</p>
          <div v-if="user?.role === 'business_owner'" class="verified-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {{ user?.is_verified ? t('profile_verified') : t('profile_business') }}
          </div>
        </div>

        <!-- Табы -->
        <div class="profile-tabs">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            <component :is="tab.iconComponent" class="tab-icon-svg"/>
            <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
          </button>
        </div>

        <!-- История -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <div class="content-header">
            <h4>{{ t('profile_history') }}</h4>
            <button v-if="viewHistory.length > 0" class="link-btn" @click="clearHistory">{{ t('profile_clear') }}</button>
          </div>
          <div v-if="viewHistory.length === 0" class="empty-mini">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>{{ t('profile_no_history') }}</p>
          </div>
          <div v-else class="items-list">
            <div v-for="item in viewHistory" :key="item.id" class="list-item" @click="openOffer(item)">
              <div class="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="item-info">
                <strong>{{ item.title }}</strong>
                <span>{{ item.address }}</span>
              </div>
              <svg class="item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Избранное -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <div class="content-header"><h4>{{ t('profile_favorites') }}</h4></div>
          <div v-if="favorites.length === 0" class="empty-mini">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <p>{{ t('profile_no_favorites') }}</p>
          </div>
          <div v-else class="items-list">
            <div v-for="item in favorites" :key="item.id" class="list-item">
              <div class="item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="item-info">
                <strong>{{ item.title }}</strong>
                <span>{{ item.rating || 0 }} / {{ item.views || 0 }} views</span>
              </div>
              <button class="remove-btn" @click="removeFavorite(item.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Категории -->
        <div v-if="activeTab === 'categories'" class="tab-content">
          <div class="content-header">
            <h4>{{ t('profile_categories') }}</h4>
            <p class="content-hint">{{ t('profile_categories_hint') }}</p>
          </div>
          <div class="categories-grid">
            <button v-for="cat in allCategories" :key="cat.id" class="cat-btn" :class="{ active: favoriteCategories.includes(cat.id) }" @click="toggleFavoriteCategory(cat.id)">
              <span>{{ cat.name }}</span>
              <svg v-if="favoriteCategories.includes(cat.id)" class="cat-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
          <button class="btn btn-primary btn-block" @click="saveFavoriteCategories" :disabled="isSavingCategories">
            {{ isSavingCategories ? t('loading') : t('profile_save_categories') }}
          </button>
        </div>

        <!-- Настройки -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="content-header"><h4>{{ t('profile_settings') }}</h4></div>
          <div class="settings-list">
            <!-- Уведомления -->
            <div class="setting-item">
              <div class="setting-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <div>
                  <strong>{{ t('profile_notifications') }}</strong>
                  <p>{{ t('profile_notifications_desc') }}</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notificationsEnabled" @change="saveNotificationSettings">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <!-- Язык -->
            <div class="setting-item language-setting">
              <div class="setting-info">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <div>
                  <strong>{{ t('profile_language') }}</strong>
                  <p>{{ t('profile_language_desc') }}</p>
                </div>
              </div>
            </div>
            
            <!-- Выбор языка -->
            <div class="language-selector">
              <button 
                v-for="lang in languages" 
                :key="lang.code" 
                class="lang-btn"
                :class="{ active: language === lang.code }"
                @click="changeLanguage(lang.code)"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </button>
            </div>
          </div>
          <button class="btn btn-danger btn-block" @click="logout">{{ t('profile_logout') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, h } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { useOffersStore } from '../stores/offersStore'
import { storeToRefs } from 'pinia'
import { apiService } from '../services/api'
import { useLocale } from '../composables/useLocale'

// SVG Icons as components
const ClockIcon = { render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [h('circle', { cx: 12, cy: 12, r: 10 }), h('polyline', { points: '12 6 12 12 16 14' })]) }
const StarIcon = { render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })]) }
const TargetIcon = { render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [h('circle', { cx: 12, cy: 12, r: 10 }), h('circle', { cx: 12, cy: 12, r: 6 }), h('circle', { cx: 12, cy: 12, r: 2 })]) }
const SettingsIcon = { render: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [h('circle', { cx: 12, cy: 12, r: 3 }), h('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })]) }

export default {
  name: 'ProfilePanel',
  setup() {
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    const offersStore = useOffersStore()
    const { closePanel, showNotification } = uiStore
    const { user, isAuthenticated } = storeToRefs(authStore)
    const { categories: allCategories } = storeToRefs(offersStore)
    const { t, language, languages, setLanguage } = useLocale()

    const isLoading = ref(false)
    const activeTab = ref('history')
    const viewHistory = ref([])
    const favorites = ref([])
    const favoriteCategories = ref([])
    const notificationsEnabled = ref(true)
    const isSavingCategories = ref(false)

    const tabs = computed(() => [
      { id: 'history', iconComponent: ClockIcon, count: viewHistory.value.length },
      { id: 'favorites', iconComponent: StarIcon, count: favorites.value.length },
      { id: 'categories', iconComponent: TargetIcon, count: favoriteCategories.value.length },
      { id: 'settings', iconComponent: SettingsIcon, count: 0 }
    ])

    const getUserInitials = computed(() => {
      if (!user.value) return '?'
      return ((user.value.first_name?.[0] || '') + (user.value.last_name?.[0] || '')).toUpperCase() || 'U'
    })

    const initAuth = () => authStore.initTelegramAuth()
    
    const loadHistory = async () => { 
      try { 
        const r = await apiService.getUserHistory(user.value.telegram_id)
        viewHistory.value = r.history || [] 
      } catch { viewHistory.value = [] } 
    }
    
    const loadFavorites = async () => { 
      try { 
        const r = await apiService.getUserFavorites(user.value.telegram_id)
        favorites.value = r.favorites || [] 
      } catch { favorites.value = [] } 
    }
    
    const clearHistory = () => { 
      viewHistory.value = []
      showNotification(t('notif_cleared'), 'success') 
    }
    
    const removeFavorite = async (id) => { 
      try { 
        await apiService.updateFavorites(user.value.telegram_id, id)
        favorites.value = favorites.value.filter(f => f.id !== id)
        showNotification(t('notif_removed'), 'success') 
      } catch { showNotification(t('error'), 'error') } 
    }
    
    const toggleFavoriteCategory = (id) => { 
      const i = favoriteCategories.value.indexOf(id)
      i > -1 ? favoriteCategories.value.splice(i, 1) : favoriteCategories.value.push(id) 
    }
    
    const saveFavoriteCategories = async () => { 
      isSavingCategories.value = true
      try { 
        await apiService.updateFavoriteCategories(user.value.telegram_id, favoriteCategories.value)
        showNotification(t('notif_saved'), 'success') 
      } catch { showNotification(t('error'), 'error') } 
      finally { isSavingCategories.value = false } 
    }
    
    const saveNotificationSettings = async () => { 
      try { 
        await apiService.updateUser(user.value.telegram_id, { notifications_enabled: notificationsEnabled.value })
        showNotification(notificationsEnabled.value ? t('notif_enabled') : t('notif_disabled'), 'success') 
      } catch {} 
    }
    
    const openOffer = (o) => { 
      offersStore.setSelectedOffer(o)
      closePanel() 
    }
    
    const logout = () => { 
      authStore.logout()
      closePanel()
      showNotification(t('notif_logged_out'), 'info') 
    }
    
    const changeLanguage = (langCode) => {
      setLanguage(langCode)
      showNotification(t('notif_language_changed'), 'success')
    }

    watch(isAuthenticated, (v) => { 
      if (v && user.value) { 
        loadHistory()
        loadFavorites()
        favoriteCategories.value = user.value.favorite_categories || []
        notificationsEnabled.value = user.value.notifications_enabled !== false 
      } 
    }, { immediate: true })

    return { 
      isLoading, activeTab, tabs, viewHistory, favorites, favoriteCategories, 
      notificationsEnabled, isSavingCategories, allCategories, user, isAuthenticated, 
      getUserInitials, closePanel, initAuth, clearHistory, removeFavorite, 
      toggleFavoriteCategory, saveFavoriteCategories, saveNotificationSettings, 
      openOffer, logout, t, language, languages, changeLanguage
    }
  }
}
</script>

<style scoped>
.vercel-panel {
  background: #000;
  border-left: 1px solid #222;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid #222;
  padding: 16px 20px;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.back-button:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading-state, .auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid #222;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-icon {
  color: #444;
  margin-bottom: 20px;
}

.auth-required h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #fff;
}

.auth-required p {
  margin: 0 0 20px;
  color: #666;
  font-size: 14px;
}

.profile-hero {
  text-align: center;
  padding: 32px 20px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.avatar-img, .avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #222 0%, #111 100%);
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: #666;
}

.role-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.user-name {
  margin: 0 0 4px;
  font-size: 20px;
  color: #fff;
}

.user-handle {
  margin: 0 0 12px;
  font-size: 14px;
  color: #555;
}

.verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  font-size: 12px;
  color: #50e3c2;
}

.profile-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.tab-btn:hover {
  color: #888;
  background: #111;
}

.tab-btn.active {
  background: #fff;
  color: #000;
}

.tab-icon-svg {
  width: 18px;
  height: 18px;
}

.tab-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-btn.active .tab-badge {
  background: #000;
  color: #fff;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-header h4 {
  margin: 0;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.content-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: #555;
}

.link-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.link-btn:hover {
  color: #fff;
}

.empty-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #444;
}

.empty-mini svg {
  margin-bottom: 12px;
}

.empty-mini p {
  margin: 0;
  font-size: 13px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.list-item:hover {
  background: #111;
  border-color: #333;
}

.list-item:hover .item-arrow {
  transform: translateX(4px);
  color: #fff;
}

.item-icon {
  width: 36px;
  height: 36px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info strong {
  display: block;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info span {
  display: block;
  font-size: 12px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-arrow {
  color: #333;
  transition: all 0.15s ease;
}

.remove-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ee5050;
  transition: all 0.15s ease;
}

.remove-btn:hover {
  background: rgba(238, 80, 80, 0.1);
  border-color: #ee5050;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.cat-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cat-btn:hover {
  background: #111;
  border-color: #333;
  color: #fff;
}

.cat-btn.active {
  background: #fff;
  border-color: #fff;
  color: #000;
}

.cat-check {
  color: #000;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
}

.setting-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.setting-info svg {
  color: #555;
  flex-shrink: 0;
  margin-top: 2px;
}

.setting-info strong {
  display: block;
  font-size: 14px;
  color: #fff;
  margin-bottom: 2px;
}

.setting-info p {
  margin: 0;
  font-size: 12px;
  color: #555;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
}

.toggle input {
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
  background: #222;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #555;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.toggle input:checked + .toggle-slider {
  background: #fff;
}

.toggle input:checked + .toggle-slider::before {
  background: #000;
  transform: translateX(20px);
}

.language-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lang-btn:hover {
  background: #161616;
  border-color: #333;
  color: #fff;
}

.lang-btn.active {
  background: #fff;
  border-color: #fff;
  color: #000;
}

.lang-flag {
  font-size: 16px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: #fff;
  color: #000;
}

.btn-primary:hover {
  background: #e0e0e0;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: transparent;
  border: 1px solid #333;
  color: #ee5050;
}

.btn-danger:hover {
  background: rgba(238, 80, 80, 0.1);
  border-color: #ee5050;
}

.btn-block {
  width: 100%;
}
</style>
