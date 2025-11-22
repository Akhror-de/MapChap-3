<template>
  <div class="offers-list">
    <div class="list-header">
      <h3 class="section-title">
        {{ selectedCategoryInfo.icon }} {{ selectedCategoryInfo.name }}
        <span class="offers-count">({{ filteredOffers.length }})</span>
      </h3>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Загрузка предложений...</p>
    </div>

    <div v-else-if="filteredOffers.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p class="empty-title">Ничего не найдено</p>
      <p class="empty-desc">Попробуйте изменить фильтры или поисковый запрос</p>
    </div>

    <div v-else class="offers-grid">
      <div
        v-for="offer in filteredOffers"
        :key="offer.id"
        class="offer-card"
        :class="{ active: selectedOffer?.id === offer.id }"
        @click="selectOffer(offer)"
      >
        <div class="offer-image">
          <img :src="offer.image" :alt="offer.title" />
          <div class="offer-category" :style="{ backgroundColor: getCategoryColor(offer.category) }">
            {{ getCategoryIcon(offer.category) }}
          </div>
        </div>
        
        <div class="offer-content">
          <h4 class="offer-title">{{ offer.title }}</h4>
          <p class="offer-description">{{ offer.description }}</p>
          
          <div class="offer-meta">
            <div class="offer-address">
              📍 {{ offer.address }}
            </div>
            <div class="offer-hours">
              🕒 {{ offer.workingHours }}
            </div>
          </div>

          <div class="offer-footer">
            <div class="offer-rating">
              ⭐ {{ offer.rating }} ({{ offer.reviews }})
            </div>
            <div class="offer-phone">
              📞 {{ offer.phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'

export default {
  name: 'OffersList',
  setup() {
    const offersStore = useOffersStore()

    const filteredOffers = computed(() => offersStore.filteredOffers)
    const selectedCategoryInfo = computed(() => offersStore.selectedCategoryInfo)
    const selectedOffer = computed(() => offersStore.selectedOffer)
    const isLoading = computed(() => offersStore.isLoading)

    const selectOffer = (offer) => {
      offersStore.setSelectedOffer(offer)
    }

    const getCategoryIcon = (category) => {
      const icons = {
        food: '🍕',
        shopping: '🛍️',
        beauty: '💄',
        services: '🔧',
        medical: '⚕️',
        furniture: '🛋️',
        pharmacy: '💊'
      }
      return icons[category] || '📍'
    }

    const getCategoryColor = (category) => {
      const colors = {
        food: '#FF6B6B',
        shopping: '#4ECDC4',
        beauty: '#FFD166',
        services: '#06D6A0',
        medical: '#118AB2',
        furniture: '#073B4C',
        pharmacy: '#EF476F'
      }
      return colors[category] || '#667eea'
    }

    onMounted(() => {
      offersStore.fetchOffers()
    })

    return {
      filteredOffers,
      selectedCategoryInfo,
      selectedOffer,
      isLoading,
      selectOffer,
      getCategoryIcon,
      getCategoryColor
    }
  }
}
</script>

<style scoped>
.offers-list {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  height: 600px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.list-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.offers-count {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 0.9em;
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.9rem;
  opacity: 0.7;
}

.offers-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-card {
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-primary);
}

.offer-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.offer-card.active {
  border-color: var(--primary);
  background: var(--bg-secondary);
}

.offer-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.offer-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.offer-category {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
}

.offer-content {
  padding: 1rem;
}

.offer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.offer-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.offer-meta {
  margin-bottom: 1rem;
}

.offer-address,
.offer-hours {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.offer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.offer-rating {
  color: var(--accent);
  font-weight: 600;
}

.offer-phone {
  color: var(--primary);
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .offers-list {
    height: 400px;
  }
  
  .offer-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
