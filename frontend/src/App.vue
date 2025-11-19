<template>
  <div id="app">
    <div class="app-container">
      <!-- Хедер -->
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <h1>🗺️ MapChap</h1>
              <p>Бизнес-объявления на карте</p>
            </div>
            <nav class="nav">
              <button class="nav-btn" @click="openAbout">О приложении</button>
              <button class="nav-btn">Для бизнеса</button>
              <button class="nav-btn">Войти</button>
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

      <!-- Панель "О приложении" -->
      <AboutPanel ref="aboutPanel" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useOffersStore } from './stores/offersStore.js'
import { useGeolocation } from './composables/useGeolocation.js'
import YandexMap from './components/YandexMap.vue'
import AboutPanel from './components/AboutPanel.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    AboutPanel
  },
  setup() {
    const offersStore = useOffersStore()
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
  background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 100%);
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Хедер - профессиональный стиль */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
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
  font-weight: 700;
}

.logo p {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-btn:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

/* Сайдбар - профессиональный стиль */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.search-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.search-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.categories-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  overflow-y: auto;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.category-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.location-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.location-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.location-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

/* Контейнер карты - профессиональный стиль */
.map-container {
  position: relative;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
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

/* Плавные переходы */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
