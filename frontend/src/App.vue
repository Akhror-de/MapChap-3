<template>
  <div id="app">
    <!-- Бургер-меню -->
    <BurgerMenu />
    
    <!-- Хедер -->
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>🗺️ MapChap</h1>
            <p>Бизнес-объявления на карте</p>
          </div>
          <nav class="nav desktop-only">
            <button class="nav-btn" @click="openModal('about')">О приложении</button>
            <button class="nav-btn" @click="openModal('business')">Для бизнеса</button>
            <button class="nav-btn" @click="openModal('profile')">Войти</button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="app-main">
      <div class="container">
        <div class="dashboard">
          <!-- Левая панель - Фильтры -->
          <div class="sidebar">
            <div class="search-section">
              <div class="search-box">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Поиск по адресу или названию..."
                  class="search-input"
                  @input="onSearchInput"
                />
                <button class="search-btn" @click="onSearch">
                  🔍
                </button>
              </div>
            </div>

            <div class="categories-section">
              <h3 class="section-title">Категории</h3>
              <div class="categories-grid">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  class="category-btn"
                  :class="{ active: selectedCategory === category.id }"
                  @click="selectCategory(category.id)"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </button>
              </div>
            </div>

            <div class="location-section">
              <button class="location-btn" @click="getUserLocation">
                📍 Мое местоположение
              </button>
            </div>
          </div>

          <!-- Правая панель - Карта -->
          <div class="map-container">
            <YandexMap />
          </div>
        </div>
      </div>
    </main>

    <!-- Модальные окна -->
    <ProfileModal />
    <BusinessModal />
    <BlogModal />
    
    <!-- Панель "О приложении" -->
    <AboutPanel ref="aboutPanel" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useOffersStore } from './stores/offersStore.js'
import { useUIStore } from './stores/uiStore.js'
import { useGeolocation } from './composables/useGeolocation.js'
import YandexMap from './components/YandexMap.vue'
import AboutPanel from './components/AboutPanel.vue'
import BurgerMenu from './components/BurgerMenu.vue'
import ProfileModal from './components/ProfileModal.vue'
import BusinessModal from './components/BusinessModal.vue'
import BlogModal from './components/BlogModal.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    AboutPanel,
    BurgerMenu,
    ProfileModal,
    BusinessModal,
    BlogModal
  },
  setup() {
    const offersStore = useOffersStore()
    const uiStore = useUIStore()
    const { getCurrentLocation } = useGeolocation()
    const aboutPanel = ref(null)
    const searchQuery = ref('')

    const categories = computed(() => [
      { id: 'all', name: 'Все категории', icon: '🗺️' },
      { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕' },
      { id: 'shopping', name: '🛍️ Покупки', icon: '🛍️' },
      { id: 'beauty', name: '💄 Салоны красоты', icon: '💄' },
      { id: 'services', name: '🔧 Услуги', icon: '🔧' },
      { id: 'medical', name: '⚕️ Медицина', icon: '⚕️' },
      { id: 'furniture', name: '🛋️ Мебель', icon: '🛋️' },
      { id: 'pharmacy', name: '💊 Аптеки', icon: '💊' }
    ])

    const selectedCategory = computed(() => offersStore.selectedCategory)

    const openAbout = () => {
      if (aboutPanel.value) {
        aboutPanel.value.open()
      }
    }

    const openModal = (modalName) => {
      uiStore.openModal(modalName)
    }

    const selectCategory = (categoryId) => {
      offersStore.setSelectedCategory(categoryId)
    }

    const onSearchInput = () => {
      offersStore.setSearchQuery(searchQuery.value)
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        offersStore.searchByAddress(searchQuery.value)
      }
    }

    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation()
        offersStore.setUserLocation(location)
      } catch (error) {
        console.error('Ошибка получения местоположения:', error)
        alert('Не удалось получить ваше местоположение. Проверьте разрешения браузера.')
      }
    }

    return {
      aboutPanel,
      searchQuery,
      categories,
      selectedCategory,
      openAbout,
      openModal,
      selectCategory,
      onSearchInput,
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

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Хедер */
.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo p {
  color: #666;
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.nav-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Основной контент */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

.dashboard {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: calc(100vh - 120px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.search-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #5a6fd8;
}

.categories-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.category-btn:hover {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.category-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.location-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.location-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.location-btn:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.map-container {
  position: relative;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    min-height: calc(100vh - 120px);
  }

  .sidebar {
    height: auto;
  }

  .map-container {
    height: 400px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .desktop-only {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .app-main {
    padding: 1rem 0;
  }

  .dashboard {
    gap: 1rem;
  }
}

/* Дополнительные стили для модальных окон */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
