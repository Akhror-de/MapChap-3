<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content business-modal" @click.stop>
      <!-- Заголовок -->
      <div class="modal-header">
        <h2>💼 Панель бизнеса</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Вкладки -->
      <div class="tabs">
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          ➕ Создать объявление
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'my' }"
          @click="activeTab = 'my'"
        >
          📋 Мои объявления
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          📊 Статистика
        </button>
      </div>

      <!-- Содержимое вкладок -->
      <div class="tab-content">
        <!-- Создание объявления -->
        <div v-if="activeTab === 'create'" class="create-form">
          <h3>{{ editingOffer ? 'Редактировать объявление' : 'Создать новое объявление' }}</h3>
          
          <form @submit.prevent="submitOffer">
            <div class="form-group">
              <label>Название бизнеса *</label>
              <input 
                v-model="offerForm.title"
                type="text" 
                placeholder="Например: Кофейня 'Уютная'"
                required
              >
            </div>

            <div class="form-group">
              <label>Категория *</label>
              <select v-model="offerForm.category" required>
                <option value="">Выберите категорию</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Описание *</label>
              <textarea 
                v-model="offerForm.description"
                placeholder="Опишите ваш бизнес, услуги, особенности..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Адрес *</label>
                <input 
                  v-model="offerForm.address"
                  type="text" 
                  placeholder="Город, улица, дом"
                  required
                >
              </div>
              
              <div class="form-group">
                <label>Телефон *</label>
                <input 
                  v-model="offerForm.phone"
                  type="tel" 
                  placeholder="+7 (999) 123-45-67"
                  required
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input 
                  v-model="offerForm.email"
                  type="email" 
                  placeholder="email@example.com"
                >
              </div>
              
              <div class="form-group">
                <label>Веб-сайт</label>
                <input 
                  v-model="offerForm.website"
                  type="url" 
                  placeholder="https://example.com"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Ценовая категория</label>
                <select v-model="offerForm.priceLevel">
                  <option value="budget">💰 Бюджетный</option>
                  <option value="medium">💰💰 Средний</option>
                  <option value="premium">💰💰💰 Премиум</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Часы работы</label>
                <input 
                  v-model="offerForm.hours"
                  type="text" 
                  placeholder="9:00-22:00"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Особенности</label>
              <div class="features-grid">
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="wi-fi">
                  📶 Wi-Fi
                </label>
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="parking">
                  🅿️ Парковка
                </label>
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="takeaway">
                  🥡 Навынос
                </label>
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="delivery">
                  🚚 Доставка
                </label>
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="outdoor">
                  🌳 Летняя площадка
                </label>
                <label class="feature-checkbox">
                  <input type="checkbox" v-model="offerForm.features" value="online_booking">
                  📅 Онлайн-запись
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="resetForm">
                {{ editingOffer ? 'Отменить' : 'Очистить' }}
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editingOffer ? '💾 Сохранить изменения' : '🚀 Опубликовать объявление' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Мои объявления -->
        <div v-if="activeTab === 'my'" class="my-offers">
          <div class="section-header">
            <h3>Мои объявления</h3>
            <button class="btn btn-primary" @click="activeTab = 'create'">
              ➕ Новое объявление
            </button>
          </div>
          
          <div v-if="userOffers.length === 0" class="empty-state">
            <div class="empty-icon">🏢</div>
            <h4>Пока нет объявлений</h4>
            <p>Создайте первое объявление для вашего бизнеса</p>
            <button class="btn btn-primary" @click="activeTab = 'create'">
              Создать объявление
            </button>
          </div>

          <div v-else class="offers-list">
            <div 
              v-for="offer in userOffers" 
              :key="offer.id"
              class="offer-card"
            >
              <div class="offer-header">
                <div class="offer-main-info">
                  <h4>{{ offer.title }}</h4>
                  <span class="offer-category">{{ getCategoryName(offer.category) }}</span>
                </div>
                <div class="offer-status" :class="offer.status">
                  {{ offer.status === 'active' ? '✅ Активно' : '⏸️ На паузе' }}
                </div>
              </div>
              
              <p class="offer-description">{{ offer.description }}</p>
              <p class="offer-address">📍 {{ offer.address }}</p>
              
              <div class="offer-stats">
                <div class="stat">
                  <span class="stat-icon">👁️</span>
                  <span class="stat-value">{{ offer.views }}</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">❤️</span>
                  <span class="stat-value">{{ offer.likes }}</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">⭐</span>
                  <span class="stat-value">{{ offer.rating }}</span>
                </div>
              </div>

              <div class="offer-features" v-if="offer.features && offer.features.length > 0">
                <span 
                  v-for="feature in offer.features.slice(0, 3)" 
                  :key="feature"
                  class="feature-tag"
                >
                  {{ getFeatureName(feature) }}
                </span>
                <span v-if="offer.features.length > 3" class="feature-more">
                  +{{ offer.features.length - 3 }}
                </span>
              </div>

              <div class="offer-actions">
                <button class="btn btn-small" @click="editOffer(offer)">
                  ✏️ Редактировать
                </button>
                <button 
                  class="btn btn-small" 
                  :class="offer.status === 'active' ? 'btn-warning' : 'btn-success'"
                  @click="handleToggleStatus(offer.id)"
                >
                  {{ offer.status === 'active' ? '⏸️ Пауза' : '▶️ Активировать' }}
                </button>
                <button 
                  class="btn btn-small btn-danger" 
                  @click="handleDeleteOffer(offer.id)"
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div v-if="activeTab === 'stats'" class="stats">
          <h3>Статистика бизнеса</h3>
          
          <div class="stats-overview">
            <div class="stat-card">
              <div class="stat-icon">🏢</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.totalOffers }}</div>
                <div class="stat-label">Всего объявлений</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👁️</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.totalViews }}</div>
                <div class="stat-label">Просмотров</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❤️</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.totalLikes }}</div>
                <div class="stat-label">Лайков</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">{{ businessStats.activeOffers }}</div>
                <div class="stat-label">Активных</div>
              </div>
            </div>
          </div>

          <div class="charts-section">
            <div class="chart-card">
              <h4>Популярность по категориям</h4>
              <div class="chart-bars">
                <div 
                  v-for="(views, categoryId) in businessStats.categoryStats" 
                  :key="categoryId"
                  class="chart-bar"
                >
                  <div class="bar-label">{{ getCategoryName(categoryId) }}</div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill" 
                      :style="{ 
                        width: calculatePercentage(views, businessStats.totalViews) + '%',
                        backgroundColor: getCategoryColor(categoryId)
                      }"
                    ></div>
                  </div>
                  <div class="bar-value">{{ views }} просмотров</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive } from 'vue'

export default {
  name: 'BusinessModal',
  setup() {
    const uiStore = useUIStore()
    const businessStore = useBusinessStore()
    
    const { activeModal } = storeToRefs(uiStore)
    const { categories, getUserOffers, getBusinessStats } = storeToRefs(businessStore)
    
    const { closeModal, showNotification } = uiStore
    const { createOffer, updateOffer, deleteOffer, toggleOfferStatus, getCategoryById } = businessStore

    const isOpen = computed(() => activeModal.value === 'business')
    const activeTab = ref('my')
    const editingOffer = ref(null)

    const userOffers = computed(() => getUserOffers.value)
    const businessStats = computed(() => getBusinessStats.value)

    const offerForm = reactive({
      title: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      priceLevel: 'medium',
      hours: '',
      features: []
    })

    const getCategoryName = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? category.name : 'Неизвестно'
    }

    const getCategoryColor = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? category.color : '#667eea'
    }

    const getFeatureName = (feature) => {
      const features = {
        'wi-fi': 'Wi-Fi',
        'parking': 'Парковка',
        'takeaway': 'Навынос',
        'delivery': 'Доставка',
        'outdoor': 'Летняя площадка',
        'online_booking': 'Онлайн-запись'
      }
      return features[feature] || feature
    }

    const calculatePercentage = (value, total) => {
      if (total === 0) return 0
      return Math.round((value / total) * 100)
    }

    const submitOffer = () => {
      try {
        if (editingOffer.value) {
          updateOffer(editingOffer.value.id, offerForm)
          showNotification('Объявление успешно обновлено!', 'success')
        } else {
          createOffer(offerForm)
          showNotification('Объявление успешно создано!', 'success')
        }
        resetForm()
        activeTab.value = 'my'
      } catch (error) {
        showNotification('Ошибка при сохранении объявления', 'error')
      }
    }

    const editOffer = (offer) => {
      editingOffer.value = offer
      Object.assign(offerForm, {
        title: offer.title,
        category: offer.category,
        description: offer.description,
        address: offer.address,
        phone: offer.phone,
        email: offer.email || '',
        website: offer.website || '',
        priceLevel: offer.priceLevel,
        hours: offer.hours || '',
        features: offer.features || []
      })
      activeTab.value = 'create'
    }

    // ИСПРАВЛЕНИЕ: Переименовал функцию чтобы избежать конфликта имен
    const handleDeleteOffer = (offerId) => {
      if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        deleteOffer(offerId)
        showNotification('Объявление удалено', 'success')
      }
    }

    // ИСПРАВЛЕНИЕ: Переименовал функцию чтобы избежать конфликта имен
    const handleToggleStatus = (offerId) => {
      toggleOfferStatus(offerId)
      showNotification('Статус объявления изменен', 'success')
    }

    const resetForm = () => {
      editingOffer.value = null
      Object.assign(offerForm, {
        title: '',
        category: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        priceLevel: 'medium',
        hours: '',
        features: []
      })
    }

    return {
      isOpen,
      activeTab,
      editingOffer,
      userOffers,
      businessStats,
      categories,
      offerForm,
      closeModal,
      submitOffer,
      editOffer,
      // ИСПРАВЛЕНИЕ: Используем переименованные функции
      deleteOffer: handleDeleteOffer,
      toggleOfferStatus: handleToggleStatus,
      getCategoryName,
      getCategoryColor,
      getFeatureName,
      calculatePercentage,
      resetForm
    }
  }
}
</script>

<style scoped>
.business-modal {
  max-width: 800px;
  max-height: 90vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.create-form {
  padding: 1rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.feature-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.feature-checkbox:hover {
  background: var(--bg-secondary);
}

.feature-checkbox input {
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.offer-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.offer-main-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.offer-category {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.offer-status.active {
  color: #28a745;
  font-weight: 600;
}

.offer-status.paused {
  color: #6c757d;
}

.offer-description {
  color: var(--text-secondary);
  margin: 0.5rem 0;
  line-height: 1.5;
}

.offer-address {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.offer-stats {
  display: flex;
  gap: 1.5rem;
  margin: 1rem 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-weight: 600;
  color: var(--text-primary);
}

.offer-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.feature-tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.feature-more {
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.offer-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.stat-card .stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  display: block;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.chart-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar-label {
  min-width: 150px;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.bar-container {
  flex: 1;
  height: 20px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
  min-width: 20px;
}

.bar-value {
  min-width: 100px;
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .business-modal {
    width: 95%;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .offer-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .offer-actions {
    flex-direction: column;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .chart-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .bar-label {
    min-width: auto;
  }
}
</style>
