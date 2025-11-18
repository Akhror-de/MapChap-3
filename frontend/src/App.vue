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
              <button class="nav-btn" @click="toggleBottomSheet">Фильтры</button>
            </nav>
          </div>
        </div>
      </header>

      <!-- Основной контент -->
      <main class="app-main">
        <div class="map-fullscreen">
          <YandexMap />
        </div>
      </main>

      <!-- Поисковая панель -->
      <div class="search-panel">
        <div class="search-container">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по адресу или названию..."
              class="search-input"
              @input="onSearchInput"
            />
            <button class="search-btn" @click="onSearch">
              <span class="search-icon">🔍</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Упрощенный BottomSheet -->
      <div class="bottom-sheet-simple" :class="{ open: isBottomSheetOpen }">
        <div class="sheet-handle" @click="toggleBottomSheet">
          <div class="handle-bar"></div>
        </div>
        <div class="sheet-content">
          <h3>Категории</h3>
          <div class="categories-grid">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-btn"
              @click="selectCategory(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Панель "О приложении" -->
      <AboutPanel ref="aboutPanel" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useOffersStore } from './stores/offersStore.js'
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
    const aboutPanel = ref(null)
    const searchQuery = ref('')
    const isBottomSheetOpen = ref(false)

    const categories = computed(() => [
      { id: 'all', name: 'Все категории', icon: '🗺️' },
      { id: 'food', name: 'Еда', icon: '🍕' },
      { id: 'shopping', name: 'Покупки', icon: '🛍️' },
      { id: 'beauty', name: 'Красота', icon: '💄' },
      { id: 'services', name: 'Услуги', icon: '🔧' }
    ])

    const openAbout = () => {
      if (aboutPanel.value) {
        aboutPanel.value.open()
      }
    }

    const toggleBottomSheet = () => {
      isBottomSheetOpen.value = !isBottomSheetOpen.value
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

    return {
      aboutPanel,
      searchQuery,
      isBottomSheetOpen,
      categories,
      openAbout,
      toggleBottomSheet,
      selectCategory,
      onSearchInput,
      onSearch
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
  background: #0f1419;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 100%);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Хедер */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  margin-bottom: 0.1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.logo p {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
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
  padding-top: 70px;
  height: 100vh;
}

.map-fullscreen {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Поисковая панель */
.search-panel {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  z-index: 998;
  padding: 0 1rem;
}

.search-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
}

.search-box {
  flex: 1;
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  padding: 0.75rem 1rem;
  background: #667eea;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #5a6fd8;
}

.search-icon {
  color: white;
  font-size: 1rem;
}

/* Упрощенный BottomSheet */
.bottom-sheet-simple {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 999;
  max-height: 50vh;
}

.bottom-sheet-simple.open {
  transform: translateY(0);
}

.sheet-handle {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e9ecef;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.sheet-content {
  padding: 1rem;
}

.sheet-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
}

/* Адаптивность */
@media (max-width: 768px) {
  .app-header {
    padding: 0.5rem 0;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
  
  .logo p {
    font-size: 0.7rem;
  }
  
  .search-panel {
    top: 70px;
    padding: 0 0.5rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .search-input {
    font-size: 0.8rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
