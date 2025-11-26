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
          
          <!-- Кнопка для профиля справа -->
          <button class="header-btn profile-btn" @click="openPanel('profile')">
            <span class="btn-icon">👤</span>
            <span class="btn-text">Профиль</span>
          </button>
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
      console.log('🚀 App mounted')
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
/* ... существующие стили ... */

/* Добавьте эти стили */
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

.side-panels {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
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

/* Стили для всех панелей */
.side-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: var(--bg-tertiary);
}

.panel-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Анимации */
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .side-panels {
    max-width: 100%;
  }
  
  .header-btn .btn-text {
    display: none;
  }
  
  .header-btn {
    padding: 0.75rem;
  }
}
</style>
