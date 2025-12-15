<template>
  <Teleport to="body">
    <transition name="sheet">
      <div v-if="isOpen" class="bottom-sheet-overlay" @click="handleOverlayClick">
        <div 
          class="bottom-sheet"
          :class="{ 'full-height': isExpanded }"
          @click.stop
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Ручка для свайпа -->
          <div class="sheet-handle" @click="toggleExpand">
            <div class="handle-bar"></div>
          </div>
          
          <!-- Контент -->
          <div class="sheet-content" ref="contentRef">
            <!-- Шапка с категорией и рейтингом -->
            <div class="sheet-header">
              <div class="header-left">
                <span class="category-badge">
                  {{ getCategoryName }}
                </span>
                <div class="rating" v-if="offer.rating">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span class="rating-value">{{ offer.rating }}</span>
                </div>
              </div>
              <button class="close-btn" @click="close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Название и описание -->
            <div class="sheet-main">
              <h2 class="offer-title">{{ offer.title }}</h2>
              <p class="offer-description">{{ offer.description }}</p>
              
              <!-- Полное описание при раскрытии -->
              <transition name="fade">
                <p v-if="isExpanded && offer.full_description" class="offer-full-description">
                  {{ offer.full_description }}
                </p>
              </transition>
            </div>

            <!-- Адрес -->
            <div class="info-card address-card" @click="openInMaps">
              <div class="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">{{ t('business_offer_address') }}</span>
                <span class="info-value">{{ offer.address }}</span>
              </div>
              <svg class="info-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            <!-- Телефон -->
            <a v-if="offer.phone" :href="'tel:' + offer.phone" class="info-card phone-card">
              <div class="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">{{ t('business_phone') }}</span>
                <span class="info-value">{{ offer.phone }}</span>
              </div>
              <svg class="info-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>

            <!-- Часы работы -->
            <div v-if="offer.working_hours" class="info-card">
              <div class="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="info-content">
                <span class="info-label">{{ t('business_hours') }}</span>
                <span class="info-value">{{ offer.working_hours }}</span>
              </div>
            </div>

            <!-- Удобства -->
            <div v-if="offer.amenities && offer.amenities.length" class="amenities-section">
              <h4>{{ t('business_amenities') }}</h4>
              <div class="amenities-grid">
                <div 
                  v-for="amenity in offer.amenities" 
                  :key="amenity"
                  class="amenity-chip"
                >
                  <span>{{ getAmenityName(amenity) }}</span>
                </div>
              </div>
            </div>

            <!-- Акции / Скидки -->
            <div v-if="offer.promotion || offer.discount" class="promo-section">
              <div class="promo-card">
                <div class="promo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="19" y1="5" x2="5" y2="19"/>
                    <circle cx="6.5" cy="6.5" r="2.5"/>
                    <circle cx="17.5" cy="17.5" r="2.5"/>
                  </svg>
                </div>
                <div class="promo-content">
                  <span class="promo-label">{{ offer.discount ? t('offer_discount') : t('offer_promotion') }}</span>
                  <span class="promo-value">{{ offer.promotion || offer.discount }}</span>
                </div>
                <div class="promo-badge" v-if="offer.discount">-{{ offer.discount }}%</div>
              </div>
            </div>

            <!-- Статистика -->
            <div class="stats-row">
              <div class="stat-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span class="stat-value">{{ offer.views || 0 }}</span>
              </div>
              <div class="stat-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span class="stat-value">{{ offer.likes || 0 }}</span>
              </div>
              <div class="stat-item" v-if="offer.boosted">
                <svg class="boosted-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span class="stat-value boosted-text">Boost</span>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="action-buttons">
              <button class="action-btn like-btn" :class="{ liked: isLiked }" @click="toggleLike">
                <svg width="18" height="18" viewBox="0 0 24 24" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button class="action-btn share-btn" @click="shareOffer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
              <a v-if="offer.phone" :href="'tel:' + offer.phone" class="action-btn call-btn primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ t('offer_call') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useLocale } from '../composables/useLocale'
import { useUIStore } from '../stores/uiStore'

export default {
  name: 'OfferBottomSheet',
  props: {
    offer: { type: Object, default: () => ({}) },
    isOpen: { type: Boolean, default: false }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocale()
    const uiStore = useUIStore()
    
    const isExpanded = ref(false)
    const isLiked = ref(false)
    const contentRef = ref(null)
    
    let touchStartY = 0
    let touchCurrentY = 0
    
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove = (e) => { touchCurrentY = e.touches[0].clientY }
    
    const handleTouchEnd = () => {
      const diff = touchCurrentY - touchStartY
      if (diff > 100) {
        isExpanded.value ? isExpanded.value = false : close()
      } else if (diff < -100) {
        isExpanded.value = true
      }
    }
    
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('bottom-sheet-overlay')) close()
    }
    
    const close = () => {
      isExpanded.value = false
      emit('close')
    }
    
    const toggleExpand = () => { isExpanded.value = !isExpanded.value }
    
    const toggleLike = () => {
      isLiked.value = !isLiked.value
      uiStore.showNotification(isLiked.value ? t('article_added_likes') : t('article_removed_likes'), 'success')
    }
    
    const shareOffer = () => {
      if (navigator.share) {
        navigator.share({ title: props.offer.title, text: props.offer.description, url: window.location.href })
      } else {
        navigator.clipboard.writeText(window.location.href)
        uiStore.showNotification(t('article_link_copied'), 'success')
      }
    }
    
    const openInMaps = () => {
      const address = encodeURIComponent(props.offer.address)
      window.open(`https://yandex.ru/maps/?text=${address}`, '_blank')
    }
    
    const CATEGORY_DATA = {
      food: 'Еда', shopping: 'Магазины', beauty: 'Красота', services: 'Услуги',
      medical: 'Медицина', pharmacy: 'Аптеки', fitness: 'Фитнес', entertainment: 'Развлечения'
    }
    
    const getCategoryName = computed(() => CATEGORY_DATA[props.offer.category] || 'Место')
    
    const AMENITIES = {
      wifi: 'Wi-Fi', parking: 'Парковка', card_payment: 'Карта', delivery: 'Доставка',
      takeaway: 'С собой', wheelchair: 'Доступность', children: 'Дети', pet_friendly: 'Животные',
      ac: 'Кондиционер', outdoor: 'Терраса', reservation: 'Бронь', '24h': '24 часа'
    }
    
    const getAmenityName = (id) => AMENITIES[id] || id
    
    watch(() => props.isOpen, (val) => { if (!val) isExpanded.value = false })
    
    return {
      t, isExpanded, isLiked, contentRef, close, toggleExpand, toggleLike, shareOffer,
      openInMaps, handleTouchStart, handleTouchMove, handleTouchEnd, handleOverlayClick,
      getCategoryName, getAmenityName
    }
  }
}
</script>

<style scoped>
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  width: 100%;
  max-width: 500px;
  max-height: 55vh;
  background: #000;
  border: 1px solid #222;
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-sheet.full-height {
  max-height: 85vh;
}

.sheet-handle {
  padding: 12px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.handle-bar {
  width: 36px;
  height: 4px;
  background: #333;
  border-radius: 2px;
  transition: all 0.15s ease;
}

.sheet-handle:hover .handle-bar {
  background: #555;
  width: 50px;
}

.sheet-content {
  padding: 0 20px 24px;
  overflow-y: auto;
  max-height: calc(85vh - 40px);
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-badge {
  padding: 6px 12px;
  background: #111;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #888;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #888;
}

.rating svg {
  color: #f5a623;
}

.rating-value {
  font-size: 13px;
  font-weight: 500;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #333;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #555;
}

.close-btn:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.sheet-main {
  margin-bottom: 16px;
}

.offer-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.offer-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.offer-full-description {
  margin: 12px 0 0;
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px solid #222;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  color: inherit;
}

.info-card:hover {
  background: #111;
  border-color: #333;
}

.info-card:hover .info-arrow {
  transform: translateX(4px);
  color: #fff;
}

.info-icon {
  width: 36px;
  height: 36px;
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 10px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  display: block;
  font-size: 14px;
  color: #fff;
  margin-top: 2px;
}

.info-arrow {
  color: #333;
  transition: all 0.15s ease;
}

.amenities-section {
  margin: 16px 0;
}

.amenities-section h4 {
  margin: 0 0 10px;
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.amenities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.amenity-chip {
  padding: 6px 12px;
  background: #111;
  border: 1px solid #222;
  border-radius: 6px;
  font-size: 12px;
  color: #888;
  transition: all 0.15s ease;
}

.amenity-chip:hover {
  border-color: #333;
  color: #fff;
}

.promo-section {
  margin: 16px 0;
}

.promo-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(80, 227, 194, 0.08) 0%, rgba(80, 227, 194, 0.02) 100%);
  border: 1px solid rgba(80, 227, 194, 0.2);
  border-radius: 8px;
}

.promo-icon {
  color: #50e3c2;
}

.promo-content {
  flex: 1;
}

.promo-label {
  display: block;
  font-size: 10px;
  color: #50e3c2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.promo-value {
  display: block;
  font-size: 14px;
  color: #fff;
  font-weight: 500;
  margin-top: 2px;
}

.promo-badge {
  padding: 6px 12px;
  background: #50e3c2;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #000;
}

.stats-row {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  margin: 16px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
}

.stat-value {
  font-size: 13px;
}

.boosted-icon {
  color: #f5a623;
}

.boosted-text {
  color: #f5a623;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.action-btn:hover {
  background: #111;
  border-color: #333;
  color: #fff;
}

.action-btn.primary {
  flex: 1;
  background: #fff;
  border: none;
  color: #000;
}

.action-btn.primary:hover {
  background: #e0e0e0;
}

.action-btn.liked {
  background: rgba(238, 80, 80, 0.1);
  border-color: rgba(238, 80, 80, 0.3);
  color: #ee5050;
}

/* Transitions */
.sheet-enter-active { animation: slideUp 0.25s ease; }
.sheet-leave-active { animation: slideDown 0.2s ease; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(100%); }
}

.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
