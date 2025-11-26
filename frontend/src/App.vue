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
      <!-- Хедер с кнопками справа -->
      <header class="app-header">
        <div class="header-content">
          <!-- Логотип слева -->
          <div class="logo">
            <h1>🗺️ MapChap</h1>
            <span class="tagline">Бизнес на карте</span>
          </div>
          
          <!-- Кнопки справа -->
          <div class="header-buttons">
            <button class="header-btn" @click="openPanel('business')" title="Для бизнеса">
              <span class="btn-icon">💼</span>
              <span class="btn-text">Бизнес</span>
            </button>
            
            <button class="header-btn" @click="openPanel('blog')" title="Блог">
              <span class="btn-icon">📝</span>
              <span class="btn-text">Блог</span>
            </button>
            
            <button class="header-btn" @click="openPanel('profile')" title="Профиль">
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

      <!-- Основной контент - карта -->
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
      offersStore.fetchOffers() // Загружаем предложения
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
      showNotification(`Выбрана категория: ${quickCategories.find(c => c.id === categoryId)?.name}`, 'info')
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
/* Базовые стили остаются прежними */

/* Хедер */
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

/* Контейнер для кнопок справа */
.header-buttons {
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

/* Основной контент */
.app-main {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: calc(100vh - 80px); /* Высота минус хедер */
  position: relative;
}

/* Стили для карты */
.yandex-map {
  width: 100%;
  height: 100%;
  border-radius: 0; /* Убираем скругления для полного покрытия */
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-btn .btn-text {
    display: none;
  }
  
  .header-btn {
    padding: 0.75rem;
  }
  
  .header-buttons {
    gap: 0.25rem;
  }
  
  .logo h1 {
    font-size: 1.25rem;
  }
  
  .tagline {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 0.5rem;
  }
  
  .header-btn {
    padding: 0.6rem;
  }
}
</style>
