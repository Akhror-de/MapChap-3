<template>
  <div id="app" class="dark-theme">
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
      <!-- Минималистичный хедер -->
      <header class="app-header">
        <div class="header-content">
          <!-- Левая часть - бизнес кнопка -->
          <div class="header-left">
            <button class="header-btn business-btn" @click="openPanel('business')" title="Бизнес">
              <span class="btn-icon">⚡</span>
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
              <span class="btn-icon">📝</span>
            </button>
            <button class="header-btn" @click="openPanel('about')" title="Инфо">
              <span class="btn-icon">ℹ️</span>
            </button>
            <button class="header-btn profile-btn" @click="openPanel('profile')" title="Профиль">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="profile-avatar" alt="" />
              <span v-else class="btn-icon">👤</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Уведомления -->
      <transition name="notification">
        <div v-if="notification" class="notification" :class="notification.type">
          <span class="notification-icon">
            <span v-if="notification.type === 'success'">✅</span>
            <span v-else-if="notification.type === 'error'">❌</span>
            <span v-else>💡</span>
          </span>
          <span class="notification-text">{{ notification.message }}</span>
        </div>
      </transition>

      <!-- Карта -->
      <main class="app-main">
        <div class="map-container">
          <YandexMap @offer-click="handleOfferClick" />
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
              <span class="search-icon">🔍</span>
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
                <span class="chip-icon">{{ category.icon }}</span>
                <span class="chip-text">{{ category.name }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Кнопка локации с анимацией -->
        <button 
          class="location-fab" 
          :class="{ 'locating': isLocating, 'located': hasLocation }"
          @click="getUserLocation" 
          title="Моя локация"
        >
          <span class="fab-pulse"></span>
          <span class="fab-pulse delay"></span>
          <span class="fab-icon" :class="{ 'spinning': isLocating }">📍</span>
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

    // Категории с зелеными/оранжевыми акцентами
    const categories = [
      { id: 'all', name: 'Все', icon: '🗺️' },
      { id: 'food', name: 'Еда', icon: '🍕' },
      { id: 'shopping', name: 'Магазины', icon: '🛍️' },
      { id: 'beauty', name: 'Красота', icon: '💄' },
      { id: 'services', name: 'Услуги', icon: '🔧' },
      { id: 'medical', name: 'Медицина', icon: '⚕️' },
      { id: 'pharmacy', name: 'Аптеки', icon: '💊' },
      { id: 'entertainment', name: 'Развлечения', icon: '🎭' }
    ]

    onMounted(() => {
      console.log('🚀 MapChap v3 started')
      authStore.initTelegramAuth()
      offersStore.fetchOffers()
    })

    const selectCategory = (categoryId) => {
      setSelectedCategory(categoryId)
      const cat = categories.find(c => c.id === categoryId)
      showNotification(`${cat?.icon} ${cat?.name}`, 'info')
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        setSearchQuery(searchQuery.value)
        searchByAddress(searchQuery.value)
        showNotification(`🔍 ${searchQuery.value}`, 'info')
      }
    }

    const getUserLocation = async () => {
      if (isLocating.value) return
      
      isLocating.value = true
      try {
        const location = await getCurrentLocation()
        setUserLocation(location)
        hasLocation.value = true
        showNotification('📍 Местоположение получено', 'success')
      } catch (error) {
        hasLocation.value = false
        showNotification('❌ Не удалось получить локацию', 'error')
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
/* Глобальные стили приложения */
.dark-theme {
  --mc-bg-primary: #0a0a0a;
  --mc-bg-secondary: #141414;
  --mc-bg-card: #1a1a1a;
  --mc-bg-elevated: #222222;
  --mc-text-primary: #ffffff;
  --mc-text-secondary: #888888;
  --mc-border: #2a2a2a;
  --mc-orange: #ff6b00;
  --mc-orange-light: #ff8533;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
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
  filter: blur(3px);
  transition: filter 0.3s ease;
}

/* Хедер */
.app-header {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--mc-border);
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
  gap: 8px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
}

.animated-logo {
  display: flex;
  gap: 8px;
}

.logo-word {
  font-size: 22px;
  font-weight: 800;
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
  text-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
  position: relative;
}

.logo-word::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  filter: blur(8px);
  opacity: 0.6;
  animation: logoGlowPulse 2s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.6));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6));
  }
}

@keyframes logoGlowPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.header-btn {
  width: 42px;
  height: 42px;
  border: none;
  background: var(--mc-bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--mc-border);
}

.header-btn:hover {
  background: var(--mc-bg-elevated);
  border-color: var(--mc-orange);
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 18px;
}

.business-btn {
  background: linear-gradient(135deg, var(--mc-orange) 0%, #ff8533 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
}

.business-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
}

.profile-btn {
  padding: 0;
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Уведомления */
.notification {
  position: fixed;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--mc-bg-card);
  border: 1px solid var(--mc-border);
  border-radius: 16px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10000;
  max-width: 320px;
}

.notification.success {
  border-color: var(--mc-orange);
  box-shadow: 0 8px 32px rgba(255, 107, 0, 0.15);
}

.notification.error {
  border-color: #ff4444;
  box-shadow: 0 8px 32px rgba(255, 68, 68, 0.15);
}

.notification-icon {
  font-size: 18px;
}

.notification-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--mc-text-primary);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Карта */
.app-main {
  position: relative;
  height: calc(100vh - 66px);
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
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-wrapper {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--mc-border);
  border-radius: 16px;
  padding: 4px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--mc-orange);
  box-shadow: 0 4px 20px rgba(255, 107, 0, 0.15);
}

.search-icon {
  font-size: 16px;
  margin-right: 10px;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  padding: 12px 0;
  background: transparent;
  border: none;
  color: var(--mc-text-primary);
  font-size: 15px;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-input::placeholder {
  color: var(--mc-text-secondary);
}

/* Категории */
.categories-wrapper {
  width: 100%;
  overflow-x: auto;
}

.categories-scroll {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}

.categories-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--mc-border);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  color: var(--mc-text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.category-chip:hover {
  background: var(--mc-bg-elevated);
  border-color: var(--mc-text-secondary);
  color: var(--mc-text-primary);
}

.category-chip.active {
  background: var(--mc-orange);
  border-color: var(--mc-orange);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
}

.chip-icon {
  font-size: 14px;
}

.chip-text {
  font-weight: 600;
}

/* FAB кнопка локации с анимацией */
.location-fab {
  position: fixed;
  bottom: 24px;
  right: 16px;
  width: 56px;
  height: 56px;
  background: var(--mc-bg-card);
  border: 1px solid var(--mc-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 90;
  overflow: hidden;
}

.location-fab .fab-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 107, 0, 0.3);
  border-radius: 16px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.location-fab .fab-pulse.delay {
  animation-delay: 0.3s;
}

.location-fab.locating .fab-pulse {
  animation: fabPulse 1.5s ease-out infinite;
}

.location-fab.locating .fab-pulse.delay {
  animation: fabPulse 1.5s ease-out infinite 0.5s;
}

.location-fab.located {
  background: linear-gradient(135deg, var(--mc-orange) 0%, #ff8533 100%);
  border-color: var(--mc-orange);
  box-shadow: 0 4px 20px rgba(255, 107, 0, 0.4);
}

.location-fab.located .fab-icon {
  filter: grayscale(1) brightness(10);
}

.location-fab:hover {
  background: var(--mc-orange);
  border-color: var(--mc-orange);
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(255, 107, 0, 0.3);
}

.location-fab:hover .fab-icon {
  filter: grayscale(1) brightness(10);
}

.location-fab:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 24px;
  z-index: 2;
  transition: all 0.3s ease;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fab-icon {
  font-size: 22px;
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
  
  .chip-text {
    display: none;
  }
  
  .category-chip {
    padding: 10px 14px;
  }
  
  .side-panels {
    max-width: 100%;
  }
}
</style>
