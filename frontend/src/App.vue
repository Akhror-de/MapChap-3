<template>
  <div id="app" :class="themeClass">
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
            <button class="theme-toggle" @click="toggleTheme">
              {{ isDarkTheme ? '☀️' : '🌙' }}
            </button>
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
import { ref, computed, onMounted } from 'vue'
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

    // Инициализация темы при загрузке
    onMounted(() => {
      uiStore.initTheme()
    })

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
    const isDarkTheme = computed(() => uiStore.isDarkTheme)
    const themeClass = computed(() => uiStore.themeClass)

    const openAbout = () => {
      if (aboutPanel.value) {
        aboutPanel.value.open()
      }
    }

    const openModal = (modalName) => {
      uiStore.openModal(modalName)
    }

    const toggleTheme = () => {
      uiStore.toggleTheme()
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
      isDarkTheme,
      themeClass,
      openAbout,
      openModal,
      toggleTheme,
      selectCategory,
      onSearchInput,
      onSearch,
      getUserLocation
    }
  }
}
</script>
