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
          <h3>Создать новое объявление</h3>
          
          <form @submit.prevent="createOffer">
            <div class="form-group">
              <label>Название бизнеса *</label>
              <input 
                v-model="newOffer.title"
                type="text" 
                placeholder="Например: Кофейня 'Уютная'"
                required
              >
            </div>

            <div class="form-group">
              <label>Категория *</label>
              <select v-model="newOffer.category" required>
                <option value="">Выберите категорию</option>
                <option value="food">🍕 Еда и рестораны</option>
                <option value="shopping">🛍️ Покупки</option>
                <option value="beauty">💄 Салоны красоты</option>
                <option value="services">🔧 Услуги</option>
                <option value="medical">⚕️ Медицина</option>
                <option value="furniture">🛋️ Мебель</option>
                <option value="pharmacy">💊 Аптеки</option>
              </select>
            </div>

            <div class="form-group">
              <label>Описание *</label>
              <textarea 
                v-model="newOffer.description"
                placeholder="Опишите ваш бизнес, услуги, особенности..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Адрес *</label>
                <input 
                  v-model="newOffer.address"
                  type="text" 
                  placeholder="Город, улица, дом"
                  required
                >
              </div>
              
              <div class="form-group">
                <label>Телефон *</label>
                <input 
                  v-model="newOffer.phone"
                  type="tel" 
                  placeholder="+7 (999) 123-45-67"
                  required
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Ценовая категория</label>
                <select v-model="newOffer.priceLevel">
                  <option value="budget">💰 Бюджетный</option>
                  <option value="medium">💰💰 Средний</option>
                  <option value="premium">💰💰💰 Премиум</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Часы работы</label>
                <input 
                  v-model="newOffer.hours"
                  type="text" 
                  placeholder="9:00-22:00"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Ссылка на сайт/соцсети</label>
              <input 
                v-model="newOffer.website"
                type="url" 
                placeholder="https://..."
              >
            </div>

            <div class="form-group">
              <label>Фотографии (до 5)</label>
              <div class="image-upload">
                <div 
                  v-for="(img, index) in newOffer.images" 
                  :key="index"
                  class="image-preview"
                >
                  <img :src="img.url" alt="Preview">
                  <button type="button" @click="removeImage(index)">✕</button>
                </div>
                <label class="upload-btn" v-if="newOffer.images.length < 5">
                  📸 Добавить фото
                  <input 
                    type="file" 
                    accept="image/*"
                    @change="handleImageUpload"
                    hidden
                  >
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="resetForm">
                Очистить
              </button>
              <button type="submit" class="btn btn-primary">
                🚀 Опубликовать объявление
              </button>
            </div>
          </form>
        </div>

        <!-- Мои объявления -->
        <div v-if="activeTab === 'my'" class="my-offers">
          <h3>Мои объявления</h3>
          
          <div v-if="userOffers.length === 0" class="empty-state">
            <p>У вас пока нет объявлений</p>
            <button class="btn btn-primary" @click="activeTab = 'create'">
              Создать первое объявление
            </button>
          </div>

          <div v-else class="offers-list">
            <div 
              v-for="offer in userOffers" 
              :key="offer.id"
              class="offer-card"
            >
              <div class="offer-header">
                <h4>{{ offer.title }}</h4>
                <span class="offer-status" :class="offer.status">
                  {{ offer.status === 'active' ? '✅ Активно' : '⏸️ На паузе' }}
                </span>
              </div>
              
              <p class="offer-category">{{ getCategoryName(offer.category) }}</p>
              <p class="offer-address">📍 {{ offer.address }}</p>
              
              <div class="offer-stats">
                <span>👁️ {{ offer.views }} просмотров</span>
                <span>❤️ {{ offer.likes }} лайков</span>
              </div>

              <div class="offer-actions">
                <button class="btn btn-small" @click="editOffer(offer)">
                  ✏️ Редактировать
                </button>
                <button 
                  class="btn btn-small btn-danger" 
                  @click="toggleOfferStatus(offer)"
                >
                  {{ offer.status === 'active' ? '⏸️' : '▶️' }}
                  {{ offer.status === 'active' ? 'Пауза' : 'Активировать' }}
                </button>
                <button 
                  class="btn btn-small btn-danger" 
                  @click="deleteOffer(offer.id)"
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
              <div class="stat-value">{{ totalViews }}</div>
              <div class="stat-label">Всего просмотров</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ activeOffers }}</div>
              <div class="stat-label">Активных объявлений</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalLikes }}</div>
              <div class="stat-label">Лайков</div>
            </div>
          </div>

          <div class="charts">
            <div class="chart-section">
              <h4>Популярность по категориям</h4>
              <div class="chart-bars">
                <div 
                  v-for="stat in categoryStats" 
                  :key="stat.category"
                  class="chart-bar"
                >
                  <div class="bar-label">{{ stat.category }}</div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill" 
                      :style="{ width: stat.percentage + '%' }"
                    ></div>
                  </div>
                  <div class="bar-value">{{ stat.views }} просмотров</div>
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
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

export default {
  name: 'BusinessModal',
  setup() {
    const uiStore = useUIStore()
    const { activeModal } = storeToRefs(uiStore)
    const { closeModal } = uiStore

    const isOpen = computed(() => activeModal.value === 'business')
    const activeTab = ref('create')

    // Данные для нового объявления
    const newOffer = ref({
      title: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      priceLevel: 'medium',
      hours: '',
      website: '',
      images: []
    })

    // Моковые данные объявлений пользователя
    const userOffers = ref([
      {
        id: 1,
        title: 'Кофейня "Уютная"',
        category: 'food',
        description: 'Лучший кофе в городе и домашняя выпечка',
        address: 'г. Москва, ул. Примерная, 15',
        phone: '+7 (999) 123-45-67',
        status: 'active',
        views: 156,
        likes: 23,
        priceLevel: 'medium',
        hours: '8:00-22:00',
        website: 'https://coffee.example.com'
      },
      {
        id: 2,
        title: 'Салон красоты "Элегант"',
        category: 'beauty',
        description: 'Парикмахерские услуги, маникюр, визаж',
        address: 'г. Москва, пр. Центральный, 42',
        phone: '+7 (999) 765-43-21',
        status: 'paused',
        views: 89,
        likes: 15,
        priceLevel: 'premium',
        hours: '10:00-20:00',
        website: ''
      }
    ])

    // Статистика
    const totalViews = computed(() => userOffers.value.reduce((sum, offer) => sum + offer.views, 0))
    const totalLikes = computed(() => userOffers.value.reduce((sum, offer) => sum + offer.likes, 0))
    const activeOffers = computed(() => userOffers.value.filter(offer => offer.status === 'active').length)

    const categoryStats = computed(() => {
      const stats = {}
      userOffers.value.forEach(offer => {
        if (!stats[offer.category]) {
          stats[offer.category] = 0
        }
        stats[offer.category] += offer.views
      })

      const total = Object.values(stats).reduce((sum, views) => sum + views, 0)
      
      return Object.entries(stats).map(([category, views]) => ({
        category: getCategoryName(category),
        views,
        percentage: total > 0 ? (views / total) * 100 : 0
      }))
    })

    // Методы
    const getCategoryName = (categoryId) => {
      const categories = {
        food: '🍕 Еда и рестораны',
        shopping: '🛍️ Покупки',
        beauty: '💄 Салоны красоты',
        services: '🔧 Услуги',
        medical: '⚕️ Медицина',
        furniture: '🛋️ Мебель',
        pharmacy: '💊 Аптеки'
      }
      return categories[categoryId] || categoryId
    }

    const createOffer = () => {
      const offer = {
        id: Date.now(),
        ...newOffer.value,
        status: 'active',
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString()
      }
      
      userOffers.value.unshift(offer)
      resetForm()
      alert('Объявление успешно создано!')
    }

    const editOffer = (offer) => {
      // Заполняем форму данными для редактирования
      newOffer.value = { ...offer }
      activeTab.value = 'create'
    }

    const toggleOfferStatus = (offer) => {
      offer.status = offer.status === 'active' ? 'paused' : 'active'
    }

    const deleteOffer = (offerId) => {
      if (confirm('Вы уверены, что хотите удалить это объявление?')) {
        userOffers.value = userOffers.value.filter(offer => offer.id !== offerId)
      }
    }

    const resetForm = () => {
      newOffer.value = {
        title: '',
        category: '',
        description: '',
        address: '',
        phone: '',
        priceLevel: 'medium',
        hours: '',
        website: '',
        images: []
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newOffer.value.images.push({
            url: e.target.result,
            file: file
          })
        }
        reader.readAsDataURL(file)
      }
    }

    const removeImage = (index) => {
      newOffer.value.images.splice(index, 1)
    }

    return {
      isOpen,
      activeTab,
      newOffer,
      userOffers,
      totalViews,
      totalLikes,
      activeOffers,
      categoryStats,
      closeModal,
      createOffer,
      editOffer,
      toggleOfferStatus,
      deleteOffer,
      resetForm,
      handleImageUpload,
      removeImage,
      getCategoryName
    }
  }
}
</script>

<style scoped>
.business-modal {
  max-width: 800px;
  max-height: 90vh;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  padding: 0 1.5rem;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.tab-btn.active {
  border-bottom-color: #667eea;
  color: #667eea;
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  background: #f8f9fa;
}

.tab-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
}

/* Стили для формы */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* Загрузка изображений */
.image-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview button {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s ease;
  text-align: center;
  font-size: 0.8rem;
}

.upload-btn:hover {
  border-color: #667eea;
}

/* Список объявлений */
.offers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offer-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.offer-header h4 {
  margin: 0;
  color: #333;
}

.offer-status.active {
  color: #28a745;
  font-weight: 600;
}

.offer-status.paused {
  color: #6c757d;
}

.offer-category {
  color: #666;
  margin: 0.25rem 0;
}

.offer-address {
  color: #666;
  margin: 0.5rem 0;
}

.offer-stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.offer-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* Статистика */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.chart-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar-label {
  min-width: 150px;
  font-size: 0.9rem;
}

.bar-container {
  flex: 1;
  height: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.bar-value {
  min-width: 100px;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .business-modal {
    width: 95%;
  }
  
  .tabs {
    flex-direction: column;
    padding: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .offer-actions {
    flex-direction: column;
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
