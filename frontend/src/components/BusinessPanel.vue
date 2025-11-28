<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">💼</span>
          Панель бизнеса
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Загрузка -->
      <div v-if="businessStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка данных...</p>
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>Требуется авторизация</h3>
        <p>Войдите в аккаунт для управления бизнесом</p>
        <button class="btn btn-primary" @click="initAuth">
          Войти через Telegram
        </button>
      </div>

      <!-- Не бизнес-аккаунт -->
      <div v-else-if="!authStore.isBusinessOwner" class="upgrade-required">
        <div class="upgrade-icon">🚀</div>
        <h3>Станьте партнером MapChap</h3>
        <p>Подключите бизнес-аккаунт для размещения объявлений и управления компанией</p>
        
        <div class="upgrade-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">📊</span>
            <div class="benefit-content">
              <h4>Расширенная аналитика</h4>
              <p>Отслеживайте просмотры, клики и конверсии</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🎯</span>
            <div class="benefit-content">
              <h4>Продвижение объявлений</h4>
              <p>Увеличивайте видимость вашего бизнеса</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">👥</span>
            <div class="benefit-content">
              <h4>Управление командой</h4>
              <p>Добавляйте сотрудников для управления</p>
            </div>
          </div>
        </div>

        <div class="upgrade-actions">
          <button class="btn btn-primary" @click="registerBusiness">
            Подключить бизнес-аккаунт
          </button>
          <button class="btn btn-outline" @click="showPricing">
            Тарифы и условия
          </button>
        </div>
      </div>

      <!-- Основной контент бизнеса -->
      <div v-else class="business-content">
        <!-- Вкладки -->
        <div class="tabs">
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'overview' }"
            @click="activeTab = 'overview'"
          >
            📊 Обзор
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'offers' }"
            @click="activeTab = 'offers'"
          >
            🏢 Объявления
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'create' }"
            @click="activeTab = 'create'"
          >
            ➕ Создать
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="tab-content">
          <!-- Обзор -->
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <div class="welcome-section">
              <h3>Добро пожаловать, {{ businessInfo.companyName }}! 👋</h3>
              <p>Статистика и управление вашим бизнесом на MapChap</p>
            </div>

            <!-- Ключевые метрики -->
            <div class="metrics-grid">
              <div class="metric-card primary">
                <div class="metric-icon">👁️</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.totalViews || 0 }}</div>
                  <div class="metric-label">Всего просмотров</div>
                </div>
              </div>
              <div class="metric-card success">
                <div class="metric-icon">❤️</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.totalLikes || 0 }}</div>
                  <div class="metric-label">Лайков</div>
                </div>
              </div>
              <div class="metric-card warning">
                <div class="metric-icon">🏢</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.activeOffers || 0 }}</div>
                  <div class="metric-label">Активных объявлений</div>
                </div>
              </div>
              <div class="metric-card info">
                <div class="metric-icon">⭐</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.averageRating || 'Нет' }}</div>
                  <div class="metric-label">Средний рейтинг</div>
                </div>
              </div>
            </div>

            <!-- Быстрые действия -->
            <div class="quick-actions">
              <h4>⚡ Быстрые действия</h4>
              <div class="actions-grid">
                <button class="action-btn" @click="activeTab = 'create'">
                  <span class="action-icon">➕</span>
                  <span class="action-text">Новое объявление</span>
                </button>
                <button class="action-btn" @click="manageOffers">
                  <span class="action-icon">📋</span>
                  <span class="action-text">Управление объявлениями</span>
                </button>
                <button class="action-btn" @click="showAnalytics">
                  <span class="action-icon">📈</span>
                  <span class="action-text">Детальная аналитика</span>
                </button>
                <button class="action-btn" @click="showSettings">
                  <span class="action-icon">⚙️</span>
                  <span class="action-text">Настройки бизнеса</span>
                </button>
              </div>
            </div>

            <!-- Последняя активность -->
            <div class="recent-activity">
              <h4>📝 Последняя активность</h4>
              <div class="activity-list">
                <div v-if="recentActivities.length === 0" class="empty-activities">
                  <p>Пока нет активности</p>
                  <button class="btn btn-primary" @click="activeTab = 'create'">
                    Создать первое объявление
                  </button>
                </div>
                <div v-else class="activity-items">
                  <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                    <span class="activity-icon">{{ activity.icon }}</span>
                    <div class="activity-content">
                      <p class="activity-text">{{ activity.text }}</p>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Мои объявления -->
          <div v-if="activeTab === 'offers'" class="offers-tab">
            <div class="section-header">
              <h3>Мои объявления</h3>
              <div class="header-actions">
                <button class="btn btn-primary" @click="activeTab = 'create'">
                  ➕ Новое объявление
                </button>
              </div>
            </div>

            <!-- Список объявлений -->
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
                :class="offer.status"
              >
                <div class="offer-header">
                  <div class="offer-main">
                    <h4 class="offer-title">{{ offer.title }}</h4>
                    <div class="offer-meta">
                      <span class="offer-category">{{ getCategoryName(offer.category) }}</span>
                      <span class="offer-date">{{ formatDate(offer.updatedAt) }}</span>
                    </div>
                  </div>
                  <div class="offer-status" :class="offer.status">
                    {{ getStatusText(offer.status) }}
                  </div>
                </div>

                <p class="offer-description">{{ offer.description }}</p>

                <div class="offer-stats">
                  <div class="stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">{{ offer.views || 0 }}</span>
                    <span class="stat-label">просмотров</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-value">{{ offer.likes || 0 }}</span>
                    <span class="stat-label">лайков</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💬</span>
                    <span class="stat-value">{{ offer.reviews || 0 }}</span>
                    <span class="stat-label">отзывов</span>
                  </div>
                </div>

                <!-- Действия -->
                <div class="offer-actions">
                  <button class="btn btn-small" @click="editOffer(offer)">
                    <span class="btn-icon">✏️</span>
                    Редактировать
                  </button>
                  <button 
                    class="btn btn-small" 
                    :class="getStatusButtonClass(offer.status)"
                    @click="handleToggleOfferStatus(offer.id)"
                  >
                    <span class="btn-icon">{{ getStatusButtonIcon(offer.status) }}</span>
                    {{ getStatusButtonText(offer.status) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Создание объявления -->
          <div v-if="activeTab === 'create'" class="create-tab">
            <div class="section-header">
              <h3>{{ editingOffer ? 'Редактировать объявление' : 'Создать новое объявление' }}</h3>
              <button v-if="editingOffer" class="btn btn-secondary" @click="cancelEdit">
                Отменить
              </button>
            </div>

            <form @submit.prevent="submitOffer" class="offer-form">
              <div class="form-section">
                <h4>📝 Основная информация</h4>
                
                <div class="form-group">
                  <label>Название бизнеса *</label>
                  <input 
                    v-model="offerForm.title"
                    type="text" 
                    placeholder="Например: Кофейня 'Уютная'"
                    required
                    maxlength="100"
                  >
                </div>

                <div class="form-group">
                  <label>Категория *</label>
                  <select v-model="offerForm.category" required>
                    <option value="">Выберите категорию</option>
                    <option 
                      v-for="category in businessStore.categories" 
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
                    maxlength="500"
                  ></textarea>
                </div>
              </div>

              <div class="form-section">
                <h4>📞 Контактная информация</h4>
                
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

              <!-- Действия формы -->
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="cancelEdit" v-if="editingOffer">
                  Отменить
                </button>
                <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
                  {{ editingOffer ? '💾 Сохранить изменения' : '🚀 Опубликовать объявление' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, onMounted } from 'vue'

export default {
  name: 'BusinessPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    
    const { closePanel, showNotification } = uiStore
    const { initTelegramAuth, registerAsBusiness } = authStore
    const { 
      createOffer, 
      updateOffer, 
      toggleOfferStatus: toggleOfferStatusInStore, // Переименовано здесь
      getCategoryById 
    } = businessStore

    const { isAuthenticated, isBusinessOwner, user } = storeToRefs(authStore)
    const { getUserOffers, categories } = storeToRefs(businessStore)

    // State
    const activeTab = ref('overview')
    const editingOffer = ref(null)

    // Form data
    const offerForm = reactive({
      title: '',
      category: '',
      description: '',
      address: '',
      phone: ''
    })

    // Computed
    const userOffers = computed(() => getUserOffers.value)
    
    const businessInfo = computed(() => {
      return user.value?.businessInfo || {
        companyName: user.value?.name || 'Ваш бизнес',
        registrationDate: new Date().toISOString()
      }
    })

    const businessStats = computed(() => {
      const offers = userOffers.value
      const totalViews = offers.reduce((sum, offer) => sum + (offer.views || 0), 0)
      const totalLikes = offers.reduce((sum, offer) => sum + (offer.likes || 0), 0)
      const activeOffers = offers.filter(offer => offer.status === 'active').length
      
      // Calculate average rating
      const ratedOffers = offers.filter(offer => offer.rating && offer.rating > 0)
      const averageRating = ratedOffers.length > 0 
        ? (ratedOffers.reduce((sum, offer) => sum + offer.rating, 0) / ratedOffers.length).toFixed(1)
        : null

      return {
        totalViews,
        totalLikes,
        activeOffers,
        averageRating
      }
    })

    const recentActivities = computed(() => {
      // Generate recent activities from offers
      const activities = []
      userOffers.value.forEach(offer => {
        if (offer.views > 0) {
          activities.push({
            id: `view-${offer.id}`,
            icon: '👁️',
            text: `"${offer.title}" получил ${offer.views} просмотров`,
            time: 'Недавно'
          })
        }
        if (offer.likes > 0) {
          activities.push({
            id: `like-${offer.id}`,
            icon: '❤️',
            text: `"${offer.title}" получил ${offer.likes} лайков`,
            time: 'Недавно'
          })
        }
      })
      return activities.slice(0, 5) // Return only 5 most recent
    })

    const canSubmit = computed(() => {
      return offerForm.title.length > 0 &&
             offerForm.category.length > 0 &&
             offerForm.description.length > 0 &&
             offerForm.address.length > 0 &&
             offerForm.phone.length > 0
    })

    // Methods
    const initAuth = () => {
      initTelegramAuth()
    }

    const registerBusiness = async () => {
      try {
        const businessData = {
          companyName: user.value?.name || 'Мой бизнес',
          type: 'individual',
          registrationDate: new Date().toISOString()
        }
        
        await registerAsBusiness(businessData)
        showNotification('Бизнес-аккаунт успешно подключен!', 'success')
      } catch (error) {
        showNotification('Ошибка при подключении бизнес-аккаунта', 'error')
      }
    }

    const showPricing = () => {
      showNotification('Информация о тарифах будет доступна в следующем обновлении', 'info')
    }

    const getCategoryName = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? category.name : 'Неизвестно'
    }

    const getStatusText = (status) => {
      const statuses = {
        active: '✅ Активно',
        paused: '⏸️ На паузе',
        draft: '📝 Черновик'
      }
      return statuses[status] || status
    }

    const getStatusButtonText = (status) => {
      return status === 'active' ? 'Пауза' : 'Активировать'
    }

    const getStatusButtonIcon = (status) => {
      return status === 'active' ? '⏸️' : '▶️'
    }

    const getStatusButtonClass = (status) => {
      return status === 'active' ? 'btn-warning' : 'btn-success'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    }

    const manageOffers = () => {
      activeTab.value = 'offers'
    }

    const showAnalytics = () => {
      showNotification('Детальная аналитика будет доступна в следующем обновлении', 'info')
    }

    const showSettings = () => {
      showNotification('Настройки бизнеса будут доступны в следующем обновлении', 'info')
    }

    const submitOffer = async () => {
      try {
        if (editingOffer.value) {
          await updateOffer(editingOffer.value.id, offerForm)
          showNotification('Объявление успешно обновлено!', 'success')
        } else {
          await createOffer(offerForm)
          showNotification('Объявление успешно создано!', 'success')
        }
        resetForm()
        activeTab.value = 'offers'
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
        phone: offer.phone
      })
      activeTab.value = 'create'
    }

    const cancelEdit = () => {
      editingOffer.value = null
      resetForm()
      activeTab.value = 'offers'
    }

    // Исправленная функция - переименована чтобы избежать конфликта
    const handleToggleOfferStatus = async (offerId) => {
      try {
        await toggleOfferStatusInStore(offerId)
        showNotification('Статус объявления изменен', 'success')
      } catch (error) {
        showNotification('Ошибка при изменении статуса', 'error')
      }
    }

    const resetForm = () => {
      editingOffer.value = null
      Object.assign(offerForm, {
        title: '',
        category: '',
        description: '',
        address: '',
        phone: ''
      })
    }

    // Load user offers on mount
    onMounted(() => {
      if (isAuthenticated.value && isBusinessOwner.value) {
        // Offers are already loaded in the store
        console.log('Business panel mounted, offers:', userOffers.value.length)
      }
    })

    return {
      // Stores
      authStore,
      businessStore,
      
      // State
      activeTab,
      editingOffer,
      offerForm,
      
      // Computed
      isAuthenticated,
      isBusinessOwner,
      userOffers,
      businessInfo,
      businessStats,
      recentActivities,
      canSubmit,
      
      // Methods
      closePanel,
      initAuth,
      registerBusiness,
      showPricing,
      submitOffer,
      editOffer,
      cancelEdit,
      handleToggleOfferStatus, // Исправленное имя
      manageOffers,
      showAnalytics,
      showSettings,
      getCategoryName,
      getStatusText,
      getStatusButtonText,
      getStatusButtonIcon,
      getStatusButtonClass,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Стили для новых элементов BusinessPanel */

.upgrade-required {
  text-align: center;
  padding: 2rem;
}

.upgrade-benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.benefit-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: var(--primary-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.benefit-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.upgrade-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-activities {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.activity-icon {
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  color: var(--text-primary);
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Адаптивность */
@media (max-width: 768px) {
  .upgrade-actions {
    flex-direction: column;
  }
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
  }
  
  .activity-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
