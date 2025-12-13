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
          Профиль
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>

      <div v-else-if="!isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется вход</h3>
        <p>Войдите для просмотра профиля</p>
        <button class="btn btn-primary" @click="initAuth">Войти</button>
      </div>

      <div v-else class="profile-content">
        <!-- Аватар -->
        <div class="profile-hero">
          <div class="avatar-wrapper">
            <img v-if="user?.photo_url" :src="user.photo_url" class="avatar-img" />
            <div v-else class="avatar-placeholder">{{ getUserInitials }}</div>
            <span v-if="user?.role === 'business_owner'" class="role-badge">💼</span>
          </div>
          <h3 class="user-name">{{ user?.first_name }} {{ user?.last_name }}</h3>
          <p v-if="user?.username" class="user-handle">@{{ user.username }}</p>
          <div v-if="user?.role === 'business_owner'" class="verified-tag">
            <span>✅</span> {{ user?.is_verified ? 'Верифицирован' : 'Бизнес' }}
          </div>
        </div>

        <!-- Табы -->
        <div class="profile-tabs">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            <span class="tab-icon">{{ tab.icon }}</span>
            <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
          </button>
        </div>

        <!-- История -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <div class="content-header">
            <h4>🕰️ История</h4>
            <button v-if="viewHistory.length > 0" class="link-btn" @click="clearHistory">Очистить</button>
          </div>
          <div v-if="viewHistory.length === 0" class="empty-mini">
            <span>👁️</span>
            <p>Нет просмотров</p>
          </div>
          <div v-else class="items-list">
            <div v-for="item in viewHistory" :key="item.id" class="list-item" @click="openOffer(item)">
              <span class="item-icon">{{ getCategoryIcon(item.category) }}</span>
              <div class="item-info">
                <strong>{{ item.title }}</strong>
                <span>{{ item.address }}</span>
              </div>
              <span class="item-arrow">›</span>
            </div>
          </div>
        </div>

        <!-- Избранное -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <div class="content-header"><h4>⭐ Избранное</h4></div>
          <div v-if="favorites.length === 0" class="empty-mini">
            <span>⭐</span>
            <p>Нет избранного</p>
          </div>
          <div v-else class="items-list">
            <div v-for="item in favorites" :key="item.id" class="list-item">
              <span class="item-icon">{{ getCategoryIcon(item.category) }}</span>
              <div class="item-info">
                <strong>{{ item.title }}</strong>
                <span>⭐ {{ item.rating || 0 }} • 👁️ {{ item.views || 0 }}</span>
              </div>
              <button class="remove-btn" @click="removeFavorite(item.id)">❤️</button>
            </div>
          </div>
        </div>

        <!-- Категории -->
        <div v-if="activeTab === 'categories'" class="tab-content">
          <div class="content-header">
            <h4>🎯 Любимые категории</h4>
            <p class="content-hint">Уведомления о близких местах</p>
          </div>
          <div class="categories-grid">
            <button v-for="cat in allCategories" :key="cat.id" class="cat-btn" :class="{ active: favoriteCategories.includes(cat.id) }" @click="toggleFavoriteCategory(cat.id)">
              <span>{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
              <span v-if="favoriteCategories.includes(cat.id)" class="cat-check">✓</span>
            </button>
          </div>
          <button class="btn btn-primary btn-block" @click="saveFavoriteCategories" :disabled="isSavingCategories">
            {{ isSavingCategories ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>

        <!-- Настройки -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="content-header"><h4>⚙️ Настройки</h4></div>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <span>🔔</span>
                <div>
                  <strong>Уведомления</strong>
                  <p>О близких местах</p>
                </div>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="notificationsEnabled" @change="saveNotificationSettings">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <button class="btn btn-danger btn-block" @click="logout">🚪 Выйти</button>
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

    const isLoading = ref(false)
    const activeTab = ref('history')
    const viewHistory = ref([])
    const favorites = ref([])
    const favoriteCategories = ref([])
    const notificationsEnabled = ref(true)
    const isSavingCategories = ref(false)

    const tabs = computed(() => [
      { id: 'history', icon: '🕰️', count: viewHistory.value.length },
      { id: 'favorites', icon: '⭐', count: favorites.value.length },
      { id: 'categories', icon: '🎯', count: favoriteCategories.value.length },
      { id: 'settings', icon: '⚙️', count: 0 }
    ])

    const getUserInitials = computed(() => {
      if (!user.value) return '?'
      return ((user.value.first_name?.[0] || '') + (user.value.last_name?.[0] || '')).toUpperCase() || 'U'
    })

    const initAuth = () => authStore.initTelegramAuth()
    const loadHistory = async () => { try { const r = await apiService.getUserHistory(user.value.telegram_id); viewHistory.value = r.history || [] } catch { viewHistory.value = [] } }
    const loadFavorites = async () => { try { const r = await apiService.getUserFavorites(user.value.telegram_id); favorites.value = r.favorites || [] } catch { favorites.value = [] } }
    const clearHistory = () => { viewHistory.value = []; showNotification('Очищено', 'success') }
    const removeFavorite = async (id) => { try { await apiService.updateFavorites(user.value.telegram_id, id); favorites.value = favorites.value.filter(f => f.id !== id); showNotification('Удалено', 'success') } catch { showNotification('Ошибка', 'error') } }
    const toggleFavoriteCategory = (id) => { const i = favoriteCategories.value.indexOf(id); i > -1 ? favoriteCategories.value.splice(i, 1) : favoriteCategories.value.push(id) }
    const saveFavoriteCategories = async () => { isSavingCategories.value = true; try { await apiService.updateFavoriteCategories(user.value.telegram_id, favoriteCategories.value); showNotification('Сохранено', 'success') } catch { showNotification('Ошибка', 'error') } finally { isSavingCategories.value = false } }
    const saveNotificationSettings = async () => { try { await apiService.updateUser(user.value.telegram_id, { notifications_enabled: notificationsEnabled.value }); showNotification(notificationsEnabled.value ? 'Включены' : 'Отключены', 'success') } catch {} }
    const openOffer = (o) => { offersStore.setSelectedOffer(o); closePanel() }
    const logout = () => { authStore.logout(); closePanel(); showNotification('Вышли', 'info') }
    const getCategoryIcon = (id) => ({ food: '🍕', shopping: '🛍️', beauty: '💄', services: '🔧', medical: '⚕️', pharmacy: '💊', entertainment: '🎭' }[id] || '📍')

    watch(isAuthenticated, (v) => { if (v && user.value) { loadHistory(); loadFavorites(); favoriteCategories.value = user.value.favorite_categories || []; notificationsEnabled.value = user.value.notifications_enabled !== false } }, { immediate: true })

    return { isLoading, activeTab, tabs, viewHistory, favorites, favoriteCategories, notificationsEnabled, isSavingCategories, allCategories, user, isAuthenticated, getUserInitials, closePanel, initAuth, clearHistory, removeFavorite, toggleFavoriteCategory, saveFavoriteCategories, saveNotificationSettings, openOffer, logout, getCategoryIcon }
  }
}
</script>

<style scoped>
.profile-hero {
  text-align: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.avatar-img, .avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #00ff88;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141414;
  color: #00ff88;
  font-size: 28px;
  font-weight: 700;
}

.role-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: #ff6b00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.user-name { margin: 0 0 4px; font-size: 22px; color: #fff; }
.user-handle { margin: 0 0 12px; color: #666; font-size: 14px; }
.verified-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 20px;
  color: #00ff88;
  font-size: 12px;
}

.profile-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-btn.active {
  background: #00ff88;
  border-color: #00ff88;
}

.tab-btn.active .tab-icon { filter: grayscale(1) brightness(0); }
.tab-icon { font-size: 20px; }
.tab-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #ff6b00;
  border-radius: 9px;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.content-header h4 { margin: 0; font-size: 16px; color: #fff; }
.content-hint { margin: 4px 0 0; font-size: 12px; color: #666; }
.link-btn { background: none; border: none; color: #00ff88; font-size: 13px; cursor: pointer; }

.empty-mini {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}
.empty-mini span { font-size: 32px; display: block; margin-bottom: 8px; }
.empty-mini p { margin: 0; }

.items-list { display: flex; flex-direction: column; gap: 8px; }
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.list-item:hover { background: #1a1a1a; border-color: #00ff88; }
.item-icon {
  width: 40px;
  height: 40px;
  background: #0a0a0a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.item-info { flex: 1; }
.item-info strong { display: block; font-size: 14px; color: #fff; margin-bottom: 2px; }
.item-info span { font-size: 12px; color: #666; }
.item-arrow { color: #444; font-size: 20px; }
.remove-btn { background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.7; }
.remove-btn:hover { opacity: 1; }

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.cat-btn.active { background: #00ff88; border-color: #00ff88; color: #000; }
.cat-check { margin-left: auto; font-weight: 700; }

.settings-list { margin-bottom: 20px; }
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  margin-bottom: 8px;
}
.setting-info { display: flex; align-items: center; gap: 12px; }
.setting-info span { font-size: 24px; }
.setting-info strong { display: block; font-size: 14px; color: #fff; }
.setting-info p { margin: 2px 0 0; font-size: 12px; color: #666; }

.toggle { position: relative; width: 50px; height: 28px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #2a2a2a;
  border-radius: 28px;
  transition: 0.3s;
}
.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}
.toggle input:checked + .toggle-slider { background: #00ff88; }
.toggle input:checked + .toggle-slider:before { transform: translateX(22px); }

.btn-danger { background: linear-gradient(135deg, #ff4444 0%, #cc3333 100%); color: #fff; }
</style>
