<template>
  <div id="app" class="vercel-theme">
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
      <!-- Минималистичный хедер в стиле Vercel -->
      <header class="app-header">
        <div class="header-content">
          <!-- Левая часть - бизнес кнопка -->
          <div class="header-left">
            <button class="header-btn business-btn" @click="openPanel('business')" title="Бизнес">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </button>
          </div>
          
          <!-- Логотип с RGB анимацией -->
          <div class="logo">
            <span class="logo-text animated-logo">
              <span class="logo-word">MAP</span>
              <span class="logo-word">CHAP</span>
            </span>
          </div>
          
          <!-- Правая часть - навигация -->
          <div class="header-right">
            <button class="header-btn" @click="openPanel('blog')" title="Блог">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </button>
            <button class="header-btn" @click="openPanel('about')" title="Инфо">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
            <button class="header-btn profile-btn" @click="openPanel('profile')" title="Профиль">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="profile-avatar" alt="" />
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Уведомления -->
      <transition name="notification">
        <div v-if="notification" class="notification" :class="notification.type">
          <svg v-if="notification.type === 'success'" class="notif-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else-if="notification.type === 'error'" class="notif-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <svg v-else class="notif-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span class="notification-text">{{ notification.message }}</span>
        </div>
      </transition>

      <!-- Карта -->
      <main class="app-main">
        <div class="map-container">
          <YandexMap ref="yandexMapRef" @offer-click="handleOfferClick" />
        </div>
        
        <!-- Bottom Sheet для объявлений -->
        <OfferBottomSheet 
          :offer="selectedOffer" 
          :isOpen="isBottomSheetOpen"
          @close="closeBottomSheet"
        />
        
        <!-- Плавающие контролы -->
        <div class="floating-controls">
          <!-- Поиск -->
          <div class="search-wrapper">
            <div class="search-box">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск мест..."
                class="search-input"
                @keyup.enter="onSearch"
              />
            </div>
          </div>
          
          <!-- Категории -->
          <div class="categories-wrapper">
            <div class="categories-scroll">
              <button
                v-for="category in categories"
                :key="category.id"
                class="category-chip"
                :class="{ active: selectedCategory === category.id }"
                @click="selectCategory(category.id)"
              >
                <span class="chip-text">{{ category.name }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Кнопка локации -->
        <button 
          class="location-fab" 
          :class="{ 'locating': isLocating, 'located': hasLocation }"
          @click="getUserLocation" 
          title="Моя локация"
        >
          <span class="fab-pulse"></span>
          <svg class="fab-icon" :class="{ 'spinning': isLocating }" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          </svg>
        </button>
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
import ProfilePanel from './components/ProfilePanel.vue'
import BusinessPanel from './components/BusinessPanel.vue'
import BlogPanel from './components/BlogPanel.vue'
import AboutPanel from './components/AboutPanel.vue'
import ArticlePanel from './components/ArticlePanel.vue'
import OfferBottomSheet from './components/OfferBottomSheet.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    ProfilePanel,
    BusinessPanel,
    BlogPanel,
    AboutPanel,
    ArticlePanel,
    OfferBottomSheet
  },
  setup() {
    const offersStore = useOffersStore()
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const { getCurrentLocation } = useGeolocation()
    
    const searchQuery = ref('')
    const isLocating = ref(false)
    const hasLocation = ref(false)
    const selectedOffer = ref(null)
    const isBottomSheetOpen = ref(false)
    const { activePanel, currentArticle, notification } = storeToRefs(uiStore)
    const { user } = storeToRefs(authStore)
    const { openPanel, closePanel, showNotification } = uiStore
    const { setSelectedCategory, setSearchQuery, searchByAddress, setUserLocation } = offersStore

    const userPhotoUrl = computed(() => user.value?.photo_url || '')
    const selectedCategory = computed(() => offersStore.selectedCategory)

    // Категории без эмодзи
    const categories = [
      { id: 'all', name: 'Все' },
      { id: 'food', name: 'Еда' },
      { id: 'shopping', name: 'Магазины' },
      { id: 'beauty', name: 'Красота' },
      { id: 'services', name: 'Услуги' },
      { id: 'medical', name: 'Медицина' },
      { id: 'pharmacy', name: 'Аптеки' },
      { id: 'entertainment', name: 'Развлечения' }
    ]

    onMounted(() => {
      console.log('MapChap v3 started')
      authStore.initTelegramAuth()
      offersStore.fetchOffers()
    })

    const selectCategory = (categoryId) => {
      setSelectedCategory(categoryId)
      const cat = categories.find(c => c.id === categoryId)
      showNotification(cat?.name, 'info')
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        setSearchQuery(searchQuery.value)
        searchByAddress(searchQuery.value)
        showNotification(searchQuery.value, 'info')
      }
    }

    const getUserLocation = async () => {
      if (isLocating.value) return
      
      isLocating.value = true
      try {
        const location = await getCurrentLocation()
        setUserLocation(location)
        hasLocation.value = true
        showNotification('Местоположение получено', 'success')
      } catch (error) {
        hasLocation.value = false
        showNotification('Не удалось получить локацию', 'error')
      } finally {
        isLocating.value = false
      }
    }

    const handleOfferClick = (offer) => {
      selectedOffer.value = offer
      isBottomSheetOpen.value = true
    }

    const closeBottomSheet = () => {
      isBottomSheetOpen.value = false
      selectedOffer.value = null
    }

    return {
      searchQuery,
      categories,
      selectedCategory,
      activePanel,
      currentArticle,
      notification,
      userPhotoUrl,
      isLocating,
      hasLocation,
      selectedOffer,
      isBottomSheetOpen,
      openPanel,
      closePanel,
      selectCategory,
      onSearch,
      getUserLocation,
      handleOfferClick,
      closeBottomSheet
    }
  }
}
</script>

<style>
/* Vercel-style тема */
.vercel-theme {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-card: #111111;
  --bg-elevated: #171717;
  --bg-hover: #1a1a1a;
  --text-primary: #fafafa;
  --text-secondary: #888888;
  --text-tertiary: #666666;
  --border-color: #333333;
  --border-light: #222222;
  --accent: #ffffff;
  --success: #50e3c2;
  --error: #ee5050;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.side-panels {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  z-index: 1001;
  pointer-events: none;
}

.side-panels > * {
  pointer-events: auto;
}

.main-content.blurred {
  filter: blur(4px);
  transition: filter 0.3s ease;
}

/* Хедер в стиле Vercel */
.app-header {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border-light);
  padding: 12px 16px;
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

.header-left,
.header-right {
  display: flex;
  gap: 4px;
}

/* Логотип с RGB анимацией */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.animated-logo {
  display: flex;
  gap: 8px;
}

.logo-word {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(
    90deg, 
    #ff6b00 0%, 
    #22c55e 25%, 
    #ff6b00 50%, 
    #22c55e 75%, 
    #ff6b00 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.5));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.5));
  }
}

/* Кнопки хедера */
.header-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--text-secondary);
}

.header-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.header-btn svg {
  transition: transform 0.15s ease;
}

.header-btn:hover svg {
  transform: scale(1.1);
}

.business-btn {
  background: var(--text-primary);
  color: var(--bg-primary);
}

.business-btn:hover {
  background: var(--text-secondary);
  color: var(--bg-primary);
  transform: translateY(-1px);
}

.profile-btn {
  padding: 0;
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Уведомления */
.notification {
  position: fixed;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  max-width: 320px;
}

.notification.success {
  border-color: var(--success);
}

.notification.success .notif-icon {
  color: var(--success);
}

.notification.error {
  border-color: var(--error);
}

.notification.error .notif-icon {
  color: var(--error);
}

.notif-icon {
  flex-shrink: 0;
}

.notification-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.2s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Карта */
.app-main {
  position: relative;
  height: calc(100vh - 65px);
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Плавающие контролы */
.floating-controls {
  position: fixed;
  top: 80px;
  left: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* Изоляция от filter карты */
  isolation: isolate;
}

.search-wrapper {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px 14px;
  transition: all 0.15s ease;
}

.search-box:focus-within {
  border-color: var(--text-secondary);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
}

.search-icon {
  margin-right: 10px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 10px 0;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

/* Категории */
.categories-wrapper {
  width: 100%;
  overflow-x: auto;
}

.categories-scroll {
  display: flex;
  gap: 6px;
  padding: 4px 0;
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  padding: 8px 14px;
  background: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid #333333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  color: #888888 !important;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.category-chip:hover {
  background: var(--bg-hover);
  border-color: var(--text-tertiary);
  color: var(--text-primary);
}

.category-chip.active,
.category-chip.active:hover,
.category-chip.active:focus,
button.category-chip.active {
  background: #ffffff !important;
  border-color: #ffffff !important;
  color: #000000 !important;
}

.chip-text {
  font-weight: 500;
}

/* FAB кнопка локации */
.location-fab {
  position: fixed;
  bottom: 180px;
  right: 16px;
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 90;
  overflow: hidden;
  color: var(--text-secondary);
}

.location-fab .fab-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  opacity: 0;
}

.location-fab.locating .fab-pulse {
  animation: fabPulse 1.5s ease-out infinite;
}

.location-fab.located {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg-primary);
}

.location-fab:hover {
  background: var(--bg-hover);
  border-color: var(--text-secondary);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.location-fab.located:hover {
  background: var(--text-secondary);
}

.fab-icon {
  z-index: 2;
  transition: transform 0.3s ease;
}

.fab-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes fabPulse {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Анимации */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Мобильная адаптация */
@media (max-width: 480px) {
  .floating-controls {
    left: 12px;
    right: 12px;
  }
  
  .side-panels {
    max-width: 100%;
  }
}
</style>
