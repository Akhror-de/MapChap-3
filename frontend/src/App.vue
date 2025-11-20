<template>
  <div id="app" :class="themeClass">
    <!-- Бургер-меню и панели -->
    <BurgerMenu />
    
    <!-- Основной контент -->
    <div class="main-content" :class="{ 'content-shifted': isAnyPanelOpen }">
      <!-- Упрощенный хедер -->
      <header class="app-header">
        <div class="header-content">
          <button class="burger-toggle" @click="toggleBurgerMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div class="logo">
            <h1>🗺️ MapChap</h1>
            <span class="tagline">Бизнес на карте</span>
          </div>
          
          <div class="header-actions">
            <button class="theme-toggle" @click="toggleTheme">
              {{ isDarkTheme ? '☀️' : '🌙' }}
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
import BurgerMenu from './components/BurgerMenu.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    BurgerMenu
  },
  setup() {
    const offersStore = useOffersStore()
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const { getCurrentLocation } = useGeolocation()
    const searchQuery = ref('')

    // Store refs
    const { isBurgerMenuOpen, isDarkTheme, notification, activePanel } = storeToRefs(uiStore)
    const { isAuthenticated } = storeToRefs(authStore)

    // Store actions
    const { initTheme, toggleTheme, toggleBurgerMenu, showNotification } = uiStore
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
    const isAnyPanelOpen = computed(() => isBurgerMenuOpen.value || activePanel.value !== null)

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
      isAnyPanelOpen,
      notification,
      isAuthenticated,
      toggleTheme,
      toggleBurgerMenu,
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

/* Main content */
.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-shifted {
  transform: translateX(320px);
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

.burger-toggle {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.burger-toggle:hover {
  background: var(--bg-tertiary);
}

.burger-toggle span {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s ease;
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

.theme-toggle {
  background: var(--bg-tertiary);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.05);
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
  
  .content-shifted {
    transform: translateX(280px);
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
  
  .content-shifted {
    transform: translateX(260px);
  }
}
</style>
