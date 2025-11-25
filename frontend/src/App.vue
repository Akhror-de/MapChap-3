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
    <div class="main-content">
      <!-- Упрощенный хедер -->
      <header class="app-header">
        <div class="header-content">
          <!-- Кнопка для бизнеса слева -->
          <button class="header-btn business-btn" @click="openPanel('business')">
            <span class="btn-icon">💼</span>
            <span class="btn-text">Для бизнеса</span>
          </button>
          
          <div class="logo">
            <h1>🗺️ MapChap</h1>
            <span class="tagline">Бизнес на карте</span>
          </div>
          
          <!-- Кнопки справа -->
          <div class="header-buttons-right">
            <button class="header-btn blog-btn" @click="openPanel('blog')">
              <span class="btn-icon">📝</span>
              <span class="btn-text">Блог</span>
            </button>
            
            <button class="header-btn profile-btn" @click="openPanel('profile')">
              <span class="btn-icon">👤</span>
              <span class="btn-text">Профиль</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Уведомления -->
      <div v-if="notification" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>

      <!-- Основной контент - только карта и фильтры -->
      <main class="app-main">
        <div class="map-container">
          <YandexMap />
        </div>
        
        <!-- Плавающая панель фильтров -->
        <div class="floating-filters">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск бизнесов..."
              class="search-input"
              @keyup.enter="onSearch"
            />
            <button class="search-btn" @click="onSearch">🔍</button>
          </div>
          
          <div class="quick-categories">
            <button
              v-for="category in quickCategories"
              :key="category.id"
              class="category-chip"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <span class="chip-icon">{{ category.icon }}</span>
              <span class="chip-text">{{ category.name }}</span>
            </button>
          </div>
          
          <button class="location-fab" @click="getUserLocation" title="Мое местоположение">
            <span class="fab-icon">📍</span>
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
    const searchQuery = ref('')

    // Store refs
    const { activePanel, currentArticle, notification, isDarkTheme } = storeToRefs(uiStore)
    const { isAuthenticated } = storeToRefs(authStore)

    // Store actions
    const { initTheme, toggleTheme, openPanel, closePanel, showNotification } = uiStore
    const { setSelectedCategory, setSearchQuery, searchByAddress, setUserLocation } = offersStore

    // Инициализация при загрузке
    onMounted(() => {
      initTheme()
      authStore.checkAuth()
    })

    const quickCategories = [
      { id: 'all', name: 'Все', icon: '🗺️' },
      { id: 'food', name: 'Еда', icon: '🍕' },
      { id: 'shopping', name: 'Магазины', icon: '🛍️' },
      { id: 'beauty', name: 'Красота', icon: '💄' },
      { id: 'services', name: 'Услуги', icon: '🔧' }
    ]

    const selectedCategory = computed(() => offersStore.selectedCategory)
    const themeClass = computed(() => isDarkTheme.value ? 'dark-theme' : 'light-theme')

    const selectCategory = (categoryId) => {
      setSelectedCategory(categoryId)
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
      isDarkTheme,
      themeClass,
      activePanel,
      currentArticle,
      notification,
      isAuthenticated,
      toggleTheme,
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Light theme - Modern professional colors */
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #8b5cf6;
  --secondary: #06d6a0;
  --accent: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.2);
  --backdrop-blur: blur(20px);
}

.dark-theme {
  --primary: #818cf8;
  --primary-dark: #6366f1;
  --primary-light: #a5b4fc;
  --secondary: #34d399;
  --accent: #fbbf24;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  --border-color: #4b5563;
  --glass-bg: rgba(17, 24, 39, 0.8);
  --glass-border: rgba(255, 255, 255, 0.1);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition: all 0.3s ease;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Overlay для панелей */
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* Панели */
.side-panels {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  z-index: 1001;
}

/* Main content */
.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  border-bottom: 1px solid var(--glass-border);
  padding: 0.75rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

/* Контейнер для правых кнопок */
.header-buttons-right {
  display: flex;
  gap: 0.5rem;
}

/* Кнопки в хедере */
.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.header-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.header-btn .btn-icon {
  font-size: 1.1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Notifications */
.notification {
  position: fixed;
  top: 80px;
  right: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  z-index: 10000;
  animation: slideInRight 0.3s ease;
  max-width: 300px;
  backdrop-filter: var(--backdrop-blur);
}

.notification.success {
  background: rgba(16, 185, 129, 0.9);
  border: 1px solid rgba(5, 150, 105, 0.3);
}

.notification.error {
  background: rgba(239, 68, 68, 0.9);
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.notification.info {
  background: rgba(59, 130, 246, 0.9);
  border: 1px solid rgba(37, 99, 235, 0.3);
}

/* Main app content */
.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

/* Floating filters */
.floating-filters {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 90;
}

.search-box {
  display: flex;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: var(--shadow-lg);
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  background: var(--primary);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.05);
}

.quick-categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: var(--shadow-lg);
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
}

.category-chip:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.category-chip.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.chip-icon {
  font-size: 1rem;
}

.location-fab {
  background: var(--primary);
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-fab:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .floating-filters {
    right: 1rem;
    bottom: 2rem;
    top: auto;
    transform: none;
    flex-direction: row;
    align-items: flex-end;
  }
  
  .quick-categories {
    flex-direction: row;
    order: 2;
  }
  
  .search-box {
    order: 1;
  }
  
  .location-fab {
    order: 3;
    width: 48px;
    height: 48px;
  }
  
  .side-panels {
    max-width: 100%;
  }
  
  .header-btn .btn-text {
    display: none;
  }
  
  .header-btn {
    padding: 0.75rem;
  }
  
  .header-buttons-right {
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 0.5rem;
  }
  
  .logo h1 {
    font-size: 1.25rem;
  }
  
  .tagline {
    display: none;
  }
  
  .floating-filters {
    right: 0.5rem;
    bottom: 1rem;
  }
  
  .header-buttons-right {
    gap: 0.25rem;
  }
}
</style>
