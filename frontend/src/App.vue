<template>
  <div id="app" :class="themeClass">
    <BurgerMenu />
    
    <div class="main-content" :class="{ 'content-shifted': isAnyPanelOpen }">
      <header class="app-header">
        <div class="header-content">
          <button class="burger-toggle" @click="toggleBurgerMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div class="logo">
            <h1>🗺️ MapChap</h1>
          </div>
          
          <button class="theme-toggle" @click="toggleTheme">
            {{ isDarkTheme ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>

      <main class="app-main">
        <div class="map-container">
          <YandexMap />
        </div>
        
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
              @click="selectCategory(category.id)"
            >
              <span class="chip-icon">{{ category.icon }}</span>
            </button>
          </div>
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
    const searchQuery = ref('')

    const { isDarkTheme, activePanel } = storeToRefs(uiStore)
    const { toggleTheme, toggleBurgerMenu } = uiStore
    const { setSelectedCategory, setSearchQuery } = offersStore

    onMounted(() => {
      authStore.checkAuth()
    })

    const quickCategories = [
      { id: 'all', name: 'Все', icon: '🗺️' },
      { id: 'food', name: 'Еда', icon: '🍕' },
      { id: 'shopping', name: 'Магазины', icon: '🛍️' },
      { id: 'beauty', name: 'Красота', icon: '💄' }
    ]

    const themeClass = computed(() => isDarkTheme.value ? 'dark-theme' : 'light-theme')
    const isAnyPanelOpen = computed(() => activePanel.value !== null)

    const selectCategory = (categoryId) => {
      setSelectedCategory(categoryId)
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        setSearchQuery(searchQuery.value)
      }
    }

    return {
      searchQuery,
      quickCategories,
      isDarkTheme,
      themeClass,
      isAnyPanelOpen,
      toggleTheme,
      toggleBurgerMenu,
      selectCategory,
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

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --border-color: #e2e8f0;
}

.dark-theme {
  --primary: #818cf8;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;
  --border-color: #4b5563;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  min-height: 100vh;
}

.main-content {
  transition: transform 0.3s ease;
}

.content-shifted {
  transform: translateX(320px);
}

.app-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.burger-toggle {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.burger-toggle span {
  width: 20px;
  height: 2px;
  background: var(--text-primary);
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.theme-toggle {
  background: var(--bg-tertiary);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
}

.app-main {
  flex: 1;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100vh;
}

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
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-primary);
  outline: none;
}

.search-btn {
  background: var(--primary);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}

.quick-categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
}

.category-chip {
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
}

.category-chip:hover {
  background: var(--bg-tertiary);
}

@media (max-width: 768px) {
  .content-shifted {
    transform: translateX(280px);
  }
  
  .floating-filters {
    right: 1rem;
    bottom: 2rem;
    top: auto;
    transform: none;
    flex-direction: row;
  }
}
</style>
