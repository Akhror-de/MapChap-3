<template>
  <div id="app" :class="themeClass">
    <!-- Overlay для панелей -->
    <div 
      v-if="activePanel"
      class="panel-overlay"
      @click="closePanel"
    ></div>

    <!-- Панели -->
    <div class="side-panels">
      <ProfilePanel v-if="activePanel === 'profile'" />
      <BusinessPanel v-if="activePanel === 'business'" />
      <BlogPanel v-if="activePanel === 'blog'" />
      <AboutPanel v-if="activePanel === 'about'" />
      <ArticlePanel 
        v-if="activePanel === 'article' && currentArticle" 
        :article="currentArticle" 
      />
    </div>

    <!-- Основной контент -->
    <div class="main-content" :class="{ 'blurred': activePanel }">
      <!-- Профессиональный хедер в стиле Telegram -->
      <header class="app-header">
        <div class="header-content">
          <!-- Левые кнопки -->
          <div class="header-left">
            <button class="header-action-btn menu-btn" @click="openPanel('business')" title="Бизнес-панель">
              <span class="action-icon">💼</span>
            </button>
          </div>
          
          <!-- Логотип по центру -->
          <div class="logo">
            <h1>🗺️ MapChap</h1>
          </div>
          
          <!-- Кнопки действий справа -->
          <div class="header-actions">
            <button class="header-action-btn" @click="openPanel('blog')" title="Блог">
              <span class="action-icon">📝</span>
            </button>
            
            <button class="header-action-btn" @click="openPanel('about')" title="О приложении">
              <span class="action-icon">ℹ️</span>
            </button>
            
            <button class="header-action-btn profile-btn" @click="openPanel('profile')" title="Профиль">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="profile-avatar" alt="Профиль" />
              <span v-else class="action-icon">👤</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Уведомления в стиле Telegram -->
      <div v-if="notification" class="notification" :class="notification.type">
        <div class="notification-content">
          <span class="notification-icon">
            <span v-if="notification.type === 'success'">✅</span>
            <span v-else-if="notification.type === 'error'">❌</span>
            <span v-else>💡</span>
          </span>
          <span class="notification-text">{{ notification.message }}</span>
        </div>
      </div>

      <!-- Основной контент -->
      <main class="app-main">
        <div class="map-container">
          <YandexMap />
        </div>
        
        <!-- Плавающие контролы в стиле Telegram -->
        <div class="floating-controls">
          <!-- Поиск -->
          <div class="search-section">
            <div class="search-container">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск бизнесов..."
                class="search-input"
                @keyup.enter="onSearch"
              />
              <button class="search-btn" @click="onSearch">
                <span class="search-icon">🔍</span>
              </button>
            </div>
          </div>
          
          <!-- Быстрые категории с кастомными значками -->
          <div class="categories-section">
            <div class="categories-scroll">
              <button
                v-for="category in quickCategories"
                :key="category.id"
                class="category-btn"
                :class="{ active: selectedCategory === category.id }"
                :style="{ '--category-color': category.color }"
                @click="selectCategory(category.id)"
              >
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
              </button>
            </div>
          </div>
          
          <!-- Кнопка местоположения -->
          <button class="location-btn" @click="getUserLocation" title="Мое местоположение">
            <span class="location-icon">📍</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOffersStore } from './stores/offersStore.js'
import { useUIStore } from './stores/uiStore.js'
import { useAuthStore } from './stores/authStore.js'
import { useGeolocation } from './composables/useGeolocation.js'
import { useTelegramTheme } from './composables/useTelegramTheme.js'
import YandexMap from './components/YandexMap.vue'

// Импортируем компоненты панелей
import ProfilePanel from './components/ProfilePanel.vue'
import BusinessPanel from './components/BusinessPanel.vue'
import BlogPanel from './components/BlogPanel.vue'
import AboutPanel from './components/AboutPanel.vue'
import ArticlePanel from './components/ArticlePanel.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    ProfilePanel,
    BusinessPanel,
    BlogPanel,
    AboutPanel,
    ArticlePanel
  },
  setup() {
    const offersStore = useOffersStore()
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const { getCurrentLocation } = useGeolocation()
    const { isTelegram, tgTheme, applyTelegramTheme } = useTelegramTheme()
    
    const searchQuery = ref('')

    // Store refs
    const { activePanel, currentArticle, notification } = storeToRefs(uiStore)
    const { isAuthenticated, user } = storeToRefs(authStore)

    // Store actions
    const { openPanel, closePanel, showNotification } = uiStore
    const { setSelectedCategory, setSearchQuery, searchByAddress, setUserLocation } = offersStore

    // Фото пользователя
    const userPhotoUrl = computed(() => user.value?.photo_url || '')

    // Инициализация при загрузке
    onMounted(() => {
      console.log('🚀 App mounted')
      authStore.initTelegramAuth()
      offersStore.fetchOffers()
    })

    // Категории с кастомными цветами
    const quickCategories = [
      { id: 'all', name: 'Все', icon: '🗺️', color: '#667eea' },
      { id: 'food', name: 'Еда', icon: '🍕', color: '#FF6B6B' },
      { id: 'shopping', name: 'Магазины', icon: '🛍️', color: '#4ECDC4' },
      { id: 'beauty', name: 'Красота', icon: '💄', color: '#FFD166' },
      { id: 'services', name: 'Услуги', icon: '🔧', color: '#06D6A0' },
      { id: 'medical', name: 'Медицина', icon: '⚕️', color: '#118AB2' },
      { id: 'pharmacy', name: 'Аптеки', icon: '💊', color: '#EF476F' },
      { id: 'entertainment', name: 'Развлечения', icon: '🎭', color: '#7209B7' }
    ]

    const selectedCategory = computed(() => offersStore.selectedCategory)
    const themeClass = computed(() => `tg-${tgTheme.value}`)

    const selectCategory = (categoryId) => {
      setSelectedCategory(categoryId)
      const categoryName = quickCategories.find(c => c.id === categoryId)?.name
      showNotification(`Выбрана категория: ${categoryName}`, 'info')
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        setSearchQuery(searchQuery.value)
        searchByAddress(searchQuery.value)
        showNotification(`Поиск: "${searchQuery.value}"`, 'info')
      }
    }

    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation()
        setUserLocation(location)
        
        // Отправляем локацию на сервер для уведомлений
        if (authStore.isAuthenticated && user.value?.telegram_id) {
          try {
            const { apiService } = await import('./services/api.js')
            await apiService.updateLocation(user.value.telegram_id, location.latitude, location.longitude)
          } catch (e) {
            console.log('Location update skipped:', e)
          }
        }
        
        showNotification(`Местоположение получено!`, 'success')
      } catch (error) {
        console.error('Ошибка получения местоположения:', error)
        showNotification('Не удалось получить местоположение', 'error')
      }
    }

    return {
      searchQuery,
      quickCategories,
      selectedCategory,
      activePanel,
      currentArticle,
      notification,
      isAuthenticated,
      userPhotoUrl,
      isTelegram,
      themeClass,
      openPanel,
      closePanel,
      selectCategory,
      onSearch,
      getUserLocation
    }
  }
}
</script>

<style>
/* Telegram-стили CSS переменные */
:root {
  --tg-bg-color: #ffffff;
  --tg-text-color: #000000;
  --tg-hint-color: #707579;
  --tg-link-color: #2678b6;
  --tg-button-color: #50a8eb;
  --tg-button-text-color: #ffffff;
  --tg-secondary-bg-color: #f1f1f1;
  --tg-section-bg-color: #ffffff;
  --tg-border-color: #e5e5e5;
  --tg-success-color: #34c759;
  --tg-warning-color: #ff9500;
  --tg-error-color: #ff3b30;
  --tg-shadow-1: 0 1px 3px rgba(0, 0, 0, 0.1);
  --tg-shadow-2: 0 2px 6px rgba(0, 0, 0, 0.1);
  --tg-shadow-3: 0 4px 12px rgba(0, 0, 0, 0.1);
  --tg-border-radius-small: 8px;
  --tg-border-radius-medium: 12px;
  --tg-border-radius-large: 16px;
  --tg-border-radius-xlarge: 20px;
}

.tg-dark {
  --tg-bg-color: #1c1c1d;
  --tg-text-color: #ffffff;
  --tg-hint-color: #98989e;
  --tg-link-color: #5eafff;
  --tg-button-color: #50a8eb;
  --tg-button-text-color: #ffffff;
  --tg-secondary-bg-color: #2d2d2f;
  --tg-section-bg-color: #2d2d2f;
  --tg-border-color: #3d3d3f;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--tg-bg-color);
  color: var(--tg-text-color);
  line-height: 1.4;
  font-size: 17px;
}

#app {
  min-height: 100vh;
  background: var(--tg-bg-color);
  position: relative;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.side-panels {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  z-index: 1001;
  pointer-events: none;
}

.side-panels > * {
  pointer-events: auto;
}

.main-content.blurred {
  filter: blur(2px);
  transition: filter 0.3s ease;
}

.app-header {
  background: var(--tg-section-bg-color);
  border-bottom: 0.5px solid var(--tg-border-color);
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  gap: 8px;
}

.logo h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--tg-text-color);
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-action-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: var(--tg-secondary-bg-color);
  border-radius: var(--tg-border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--tg-text-color);
  overflow: hidden;
}

.header-action-btn:hover {
  background: var(--tg-border-color);
  transform: scale(1.05);
}

.header-action-btn .action-icon {
  font-size: 20px;
}

.profile-btn {
  padding: 0;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--tg-border-radius-medium);
}

.menu-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.menu-btn:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
}

.notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tg-section-bg-color);
  border: 0.5px solid var(--tg-border-color);
  border-radius: var(--tg-border-radius-large);
  padding: 12px 16px;
  box-shadow: var(--tg-shadow-3);
  z-index: 10000;
  animation: slideDown 0.3s ease;
  max-width: 320px;
  width: 90%;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.notification-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--tg-text-color);
}

.notification.success { border-left: 4px solid var(--tg-success-color); }
.notification.error { border-left: 4px solid var(--tg-error-color); }
.notification.info { border-left: 4px solid var(--tg-button-color); }

.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: calc(100vh - 68px);
  position: relative;
}

.floating-controls {
  position: fixed;
  top: 80px;
  left: 16px;
  right: 16px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-section {
  width: 100%;
}

.search-container {
  display: flex;
  background: var(--tg-section-bg-color);
  border: 0.5px solid var(--tg-border-color);
  border-radius: var(--tg-border-radius-large);
  overflow: hidden;
  box-shadow: var(--tg-shadow-2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.search-input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  background: transparent;
  color: var(--tg-text-color);
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: var(--tg-hint-color);
}

.search-btn {
  padding: 0 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--tg-hint-color);
  transition: color 0.2s ease;
}

.search-btn:hover {
  color: var(--tg-text-color);
}

.search-icon {
  font-size: 18px;
}

.categories-section {
  width: 100%;
  overflow-x: auto;
}

.categories-scroll {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: var(--tg-section-bg-color);
  border: 0.5px solid var(--tg-border-color);
  border-radius: var(--tg-border-radius-large);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--tg-text-color);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: var(--tg-shadow-1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.category-btn:hover {
  background: var(--tg-secondary-bg-color);
  transform: translateY(-1px);
  box-shadow: var(--tg-shadow-2);
}

.category-btn.active {
  background: var(--category-color, var(--tg-button-color));
  color: var(--tg-button-text-color);
  border-color: var(--category-color, var(--tg-button-color));
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-weight: 500;
}

.location-btn {
  position: fixed;
  bottom: 24px;
  right: 16px;
  width: 56px;
  height: 56px;
  border: none;
  background: var(--tg-section-bg-color);
  border: 0.5px solid var(--tg-border-color);
  border-radius: var(--tg-border-radius-large);
  cursor: pointer;
  color: var(--tg-text-color);
  font-size: 20px;
  box-shadow: var(--tg-shadow-3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 90;
}

.location-btn:hover {
  background: var(--tg-secondary-bg-color);
  transform: scale(1.05);
  box-shadow: var(--tg-shadow-3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.categories-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 768px) {
  .floating-controls {
    left: 12px;
    right: 12px;
  }
  
  .side-panels {
    max-width: 100%;
  }
  
  .notification {
    width: calc(100% - 24px);
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 12px;
  }
  
  .header-content {
    padding: 0 4px;
  }
  
  .floating-controls {
    left: 8px;
    right: 8px;
  }
  
  .category-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .category-name {
    display: none;
  }
  
  .location-btn {
    bottom: 16px;
    right: 12px;
    width: 52px;
    height: 52px;
  }
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--tg-hint-color);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--tg-text-color);
}
</style>
