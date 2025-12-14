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
                <span class="category-badge" :style="{ background: getCategoryColor }">
                  {{ getCategoryIcon }} {{ getCategoryName }}
                </span>
                <div class="rating" v-if="offer.rating">
                  <span class="rating-stars">⭐</span>
                  <span class="rating-value">{{ offer.rating }}</span>
                </div>
              </div>
              <button class="close-btn" @click="close">
                <span>✕</span>
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

            <!-- Адрес с анимированной иконкой -->
            <div class="info-card address-card" @click="openInMaps">
              <div class="info-icon pulsing">📍</div>
              <div class="info-content">
                <span class="info-label">{{ t('business_offer_address') }}</span>
                <span class="info-value">{{ offer.address }}</span>
              </div>
              <span class="info-arrow">→</span>
            </div>

            <!-- Телефон -->
            <a v-if="offer.phone" :href="'tel:' + offer.phone" class="info-card phone-card">
              <div class="info-icon">📞</div>
              <div class="info-content">
                <span class="info-label">{{ t('business_phone') }}</span>
                <span class="info-value">{{ offer.phone }}</span>
              </div>
              <span class="info-arrow">→</span>
            </a>

            <!-- Часы работы -->
            <div v-if="offer.working_hours" class="info-card">
              <div class="info-icon">🕐</div>
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
                  <span>{{ getAmenityIcon(amenity) }}</span>
                  <span>{{ getAmenityName(amenity) }}</span>
                </div>
              </div>
            </div>

            <!-- Акции / Скидки -->
            <div v-if="offer.promotion || offer.discount" class="promo-section">
              <div class="promo-card">
                <div class="promo-icon">🎁</div>
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
                <span class="stat-icon">👁️</span>
                <span class="stat-value">{{ offer.views || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">❤️</span>
                <span class="stat-value">{{ offer.likes || 0 }}</span>
              </div>
              <div class="stat-item" v-if="offer.boosted">
                <span class="stat-icon boosted">🚀</span>
                <span class="stat-value boosted-text">Буст</span>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="action-buttons">
              <button class="action-btn like-btn" :class="{ liked: isLiked }" @click="toggleLike">
                <span>{{ isLiked ? '❤️' : '🤍' }}</span>
              </button>
              <button class="action-btn share-btn" @click="shareOffer">
                <span>🔗</span>
              </button>
              <a v-if="offer.phone" :href="'tel:' + offer.phone" class="action-btn call-btn primary">
                <span>📞</span>
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
    offer: {
      type: Object,
      default: () => ({})
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useLocale()
    const uiStore = useUIStore()
    
    const isExpanded = ref(false)
    const isLiked = ref(false)
    const contentRef = ref(null)
    
    // Свайп для закрытия
    let touchStartY = 0
    let touchCurrentY = 0
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    
    const handleTouchMove = (e) => {
      touchCurrentY = e.touches[0].clientY
    }
    
    const handleTouchEnd = () => {
      const diff = touchCurrentY - touchStartY
      if (diff > 100) {
        if (isExpanded.value) {
          isExpanded.value = false
        } else {
          close()
        }
      } else if (diff < -100) {
        isExpanded.value = true
      }
    }
    
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('bottom-sheet-overlay')) {
        close()
      }
    }
    
    const close = () => {
      isExpanded.value = false
      emit('close')
    }
    
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }
    
    const toggleLike = () => {
      isLiked.value = !isLiked.value
      uiStore.showNotification(
        isLiked.value ? t('article_added_likes') : t('article_removed_likes'),
        'success'
      )
    }
    
    const shareOffer = () => {
      if (navigator.share) {
        navigator.share({
          title: props.offer.title,
          text: props.offer.description,
          url: window.location.href
        })
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
      food: { icon: '🍕', color: '#FF6B6B', name: 'Еда' },
      shopping: { icon: '🛍️', color: '#4ECDC4', name: 'Магазины' },
      beauty: { icon: '💄', color: '#FFD166', name: 'Красота' },
      services: { icon: '🔧', color: '#06D6A0', name: 'Услуги' },
      medical: { icon: '⚕️', color: '#118AB2', name: 'Медицина' },
      pharmacy: { icon: '💊', color: '#EF476F', name: 'Аптеки' },
      fitness: { icon: '💪', color: '#F97316', name: 'Фитнес' },
      entertainment: { icon: '🎭', color: '#7209B7', name: 'Развлечения' }
    }
    
    const getCategoryIcon = computed(() => {
      return CATEGORY_DATA[props.offer.category]?.icon || '📍'
    })
    
    const getCategoryColor = computed(() => {
      return CATEGORY_DATA[props.offer.category]?.color || '#ff6b00'
    })
    
    const getCategoryName = computed(() => {
      return CATEGORY_DATA[props.offer.category]?.name || 'Место'
    })
    
    const AMENITIES = {
      wifi: { icon: '📶', name: 'Wi-Fi' },
      parking: { icon: '🅿️', name: 'Парковка' },
      card_payment: { icon: '💳', name: 'Карта' },
      delivery: { icon: '🚗', name: 'Доставка' },
      takeaway: { icon: '🥡', name: 'С собой' },
      wheelchair: { icon: '♿', name: 'Доступность' },
      children: { icon: '👶', name: 'Дети' },
      pet_friendly: { icon: '🐕', name: 'Животные' },
      ac: { icon: '❄️', name: 'Кондиционер' },
      outdoor: { icon: '🌳', name: 'Терраса' },
      reservation: { icon: '📅', name: 'Бронь' },
      '24h': { icon: '🌙', name: '24 часа' }
    }
    
    const getAmenityIcon = (id) => AMENITIES[id]?.icon || '✓'
    const getAmenityName = (id) => AMENITIES[id]?.name || id
    
    watch(() => props.isOpen, (val) => {
      if (!val) isExpanded.value = false
    })
    
    return {
      t,
      isExpanded,
      isLiked,
      contentRef,
      close,
      toggleExpand,
      toggleLike,
      shareOffer,
      openInMaps,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleOverlayClick,
      getCategoryIcon,
      getCategoryColor,
      getCategoryName,
      getAmenityIcon,
      getAmenityName
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  width: 100%;
  max-width: 500px;
  max-height: 60vh;
  background: #0a0a0a;
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
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
  width: 40px;
  height: 4px;
  background: #444;
  border-radius: 2px;
  transition: all 0.2s;
}

.sheet-handle:hover .handle-bar {
  background: #ff6b00;
  width: 60px;
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
  gap: 12px;
}

.category-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(245, 158, 11, 0.15);
  border-radius: 12px;
}

.rating-stars {
  font-size: 14px;
}

.rating-value {
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #888;
  font-size: 16px;
}

.close-btn:hover {
  background: #ff4444;
  color: #fff;
  transform: rotate(90deg);
}

.sheet-main {
  margin-bottom: 16px;
}

.offer-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

.offer-description {
  margin: 0;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

.offer-full-description {
  margin: 12px 0 0;
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
  padding-top: 12px;
  border-top: 1px solid #222;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #141414;
  border: 1px solid #222;
  border-radius: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.info-card:hover {
  background: #1a1a1a;
  border-color: #ff6b00;
  transform: translateX(4px);
}

.info-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  border-radius: 12px;
}

.info-icon.pulsing {
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.info-value {
  display: block;
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.info-arrow {
  font-size: 18px;
  color: #444;
  transition: all 0.2s;
}

.info-card:hover .info-arrow {
  color: #ff6b00;
  transform: translateX(4px);
}

.amenities-section {
  margin: 16px 0;
}

.amenities-section h4 {
  margin: 0 0 12px;
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
}

.amenities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.amenity-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  font-size: 12px;
  color: #aaa;
  transition: all 0.2s;
}

.amenity-chip:hover {
  border-color: #ff6b00;
  color: #fff;
}

.promo-section {
  margin: 16px 0;
}

.promo-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.15) 0%, rgba(34, 197, 94, 0.15) 100%);
  border: 1px solid rgba(255, 107, 0, 0.3);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.promo-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.promo-icon {
  font-size: 28px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.promo-content {
  flex: 1;
}

.promo-label {
  display: block;
  font-size: 11px;
  color: #22c55e;
  text-transform: uppercase;
  font-weight: 600;
}

.promo-value {
  display: block;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin-top: 2px;
}

.promo-badge {
  padding: 6px 12px;
  background: #ff6b00;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
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
}

.stat-icon {
  font-size: 18px;
}

.stat-icon.boosted {
  animation: rocketPulse 1s ease-in-out infinite;
}

@keyframes rocketPulse {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.stat-value {
  font-size: 14px;
  color: #888;
}

.boosted-text {
  color: #ff6b00;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn:hover {
  background: #222;
  border-color: #444;
  color: #fff;
}

.action-btn.primary {
  flex: 1;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border: none;
  color: #fff;
}

.action-btn.primary:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
}

.action-btn.liked {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.like-btn span, .share-btn span {
  font-size: 20px;
}

/* Transitions */
.sheet-enter-active {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-leave-active {
  animation: slideDown 0.25s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
