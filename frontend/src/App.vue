<template>
  <div id="app">
    <div class="app-container">
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
            <nav class="nav">
              <!-- Убрали старые кнопки, оставили только для desktop -->
              <button class="nav-btn desktop-only" @click="openModal('about')">О приложении</button>
              <button class="nav-btn desktop-only" @click="openModal('business')">Для бизнеса</button>
              <button class="nav-btn desktop-only" @click="openModal('profile')">Войти</button>
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
              <!-- ... существующий код сайдбара ... -->
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
/* Существующие стили остаются */

/* Добавляем адаптивность для desktop-only элементов */
.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  
  /* Увеличиваем отступы для мобильных */
  .app-header {
    padding: 0.5rem 0;
  }
  
  .header-content {
    padding-left: 60px; /* Место для бургер-кнопки */
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
