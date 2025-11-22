<template>
  <div class="side-panel modern-panel">
    <!-- Заголовок -->
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

    <!-- Содержимое панели -->
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
        <h3>Станьте партнером</h3>
        <p>Для размещения объявлений необходимо зарегистрировать бизнес-аккаунт</p>
        <div class="upgrade-features">
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span>Расширенная статистика</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🎯</span>
            <span>Продвижение объявлений</span>
          </div>
          <div class="feature">
            <span class="feature-icon">👥</span>
            <span>Управление командой</span>
          </div>
        </div>
        <button class="btn btn-primary" @click="registerBusiness">
          Зарегистрировать бизнес
        </button>
      </div>

      <!-- Основной контент -->
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
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'analytics' }"
            @click="activeTab = 'analytics'"
          >
            📈 Аналитика
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="tab-content">
          <!-- Обзор -->
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <div class="welcome-section">
              <h3>Добро пожаловать, {{ authStore.user.name }}! 👋</h3>
              <p>Управляйте вашими бизнес-объявлениями и отслеживайте эффективность</p>
            </div>

            <!-- Ключевые метрики -->
            <div class="metrics-grid">
              <div class="metric-card primary">
                <div class="metric-icon">👁️</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.totalViews }}</div>
                  <div class="metric-label">Всего просмотров</div>
                  <div class="metric-trend positive">+12% за месяц</div>
                </div>
              </div>
              <div class="metric-card success">
                <div class="metric-icon">❤️</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.totalLikes }}</div>
                  <div class="metric-label">Лайков</div>
                  <div class="metric-trend positive">+8% за месяц</div>
                </div>
              </div>
              <div class="metric-card warning">
                <div class="metric-icon">🏢</div>
                <div class="metric-content">
                  <div class="metric-value">{{ businessStats.activeOffers }}</div>
                  <div class="metric-label">Активных объявлений</div>
                  <div class="metric-trend">из {{ businessStats.totalOffers }}</div>
                </div>
              </div>
              <div class="metric-card info">
                <div class="metric-icon">⭐</div>
                <div class="metric-content">
                  <div class="metric-value">4.8</div>
                  <div class="metric-label">Средний рейтинг</div>
                  <div class="metric-trend positive">+0.2</div>
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
                <button class="action-btn" @click="showPerformance">
                  <span class="action-icon">📈</span>
                  <span class="action-text">Аналитика</span>
                </button>
                <button class="action-btn" @click="showPromotion">
                  <span class="action-icon">🎯</span>
                  <span class="action-text">Продвижение</span>
                </button>
                <button class="action-btn" @click="showTeam">
                  <span class="action-icon">👥</span>
                  <span class="action-text">Команда</span>
                </button>
              </div>
            </div>

            <!-- Недавние действия -->
            <div class="recent-activity">
              <h4>📝 Недавние действия</h4>
              <div class="activity-list">
                <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                  <div class="activity-icon">{{ activity.icon }}</div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
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

            <!-- Фильтры -->
            <div class="filters">
              <div class="filter-group">
                <label>Статус:</label>
                <select v-model="offersFilter.status" @change="filterOffers">
                  <option value="all">Все</option>
                  <option value="active">Активные</option>
                  <option value="paused">На паузе</option>
                  <option value="draft">Черновики</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Категория:</label>
                <select v-model="offersFilter.category" @change="filterOffers">
                  <option value="all">Все категории</option>
                  <option 
                    v-for="category in businessStore.categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Список объявлений -->
            <div v-if="filteredOffers.length === 0" class="empty-state">
              <div class="empty-icon">🏢</div>
              <h4>Пока нет объявлений</h4>
              <p>Создайте первое объявление для вашего бизнеса</p>
              <button class="btn btn-primary" @click="activeTab = 'create'">
                Создать объявление
              </button>
            </div>

            <div v-else class="offers-list">
              <div 
                v-for="offer in filteredOffers" 
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

                <div class="offer-details">
                  <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-text">{{ offer.address }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-icon">📞</span>
                    <span class="detail-text">{{ offer.phone }}</span>
                  </div>
                  <div v-if="offer.hours" class="detail-item">
                    <span class="detail-icon">🕒</span>
                    <span class="detail-text">{{ offer.hours }}</span>
                  </div>
                </div>

                <!-- Статистика объявления -->
                <div class="offer-stats">
                  <div class="stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">{{ offer.views }}</span>
                    <span class="stat-label">просмотров</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-value">{{ offer.likes }}</span>
                    <span class="stat-label">лайков</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💬</span>
                    <span class="stat-value">{{ offer.reviews }}</span>
                    <span class="stat-label">отзывов</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">{{ offer.rating }}</span>
                    <span class="stat-label">рейтинг</span>
                  </div>
                </div>

                <!-- Особенности -->
                <div class="offer-features" v-if="offer.features && offer.features.length > 0">
                  <span 
                    v-for="feature in offer.features.slice(0, 4)" 
                    :key="feature"
                    class="feature-tag"
                  >
                    {{ getFeatureName(feature) }}
                  </span>
                  <span v-if="offer.features.length > 4" class="feature-more">
                    +{{ offer.features.length - 4 }}
                  </span>
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
                  <button 
                    class="btn btn-small btn-danger" 
                    @click="confirmDeleteOffer(offer.id)"
                  >
                    <span class="btn-icon">🗑️</span>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Создание/редактирование -->
          <div v-if="activeTab === 'create'" class="create-tab">
            <div class="section-header">
              <h3>{{ editingOffer ? 'Редактировать объявление' : 'Создать новое объявление' }}</h3>
              <button v-if="editingOffer" class="btn btn-secondary" @click="cancelEdit">
                Отменить
              </button>
            </div>

            <form @submit.prevent="submitOffer" class="offer-form">
              <!-- Основная информация -->
              <div class="form-section">
                <h4>📝 Основная информация</h4>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Название бизнеса *</label>
                    <input 
                      v-model="offerForm.title"
                      type="text" 
                      placeholder="Например: Кофейня 'Уютная'"
                      required
                      maxlength="100"
                    >
                    <div class="char-counter">{{ offerForm.title.length }}/100</div>
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
                    <label>Ценовая категория</label>
                    <select v-model="offerForm.priceLevel">
                      <option value="budget">💰 Бюджетный</option>
                      <option value="medium">💰💰 Средний</option>
                      <option value="premium">💰💰💰 Премиум</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Описание *</label>
                  <textarea 
                    v-model="offerForm.description"
                    placeholder="Опишите ваш бизнес, услуги, особенности, уникальное предложение..."
                    rows="4"
                    required
                    maxlength="500"
                  ></textarea>
                  <div class="char-counter">{{ offerForm.description.length }}/500</div>
                </div>
              </div>

              <!-- Контактная информация -->
              <div class="form-section">
                <h4>📞 Контактная информация</h4>
                <div class="form-grid">
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
              </div>

              <!-- Дополнительная информация -->
              <div class="form-section">
                <h4>🕒 Дополнительная информация</h4>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Часы работы</label>
                    <input 
                      v-model="offerForm.hours"
                      type="text" 
                      placeholder="9:00-22:00, без выходных"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label>Средний чек</label>
                    <input 
                      v-model="offerForm.averageBill"
                      type="text" 
                      placeholder="500-1000 ₽"
                    >
                  </div>
                </div>
              </div>

              <!-- Особенности -->
              <div class="form-section">
                <h4>🎯 Особенности и услуги</h4>
                <div class="features-grid">
                  <label 
                    v-for="feature in availableFeatures" 
                    :key="feature.id"
                    class="feature-checkbox"
                    :class="{ selected: offerForm.features.includes(feature.id) }"
                  >
                    <input 
                      type="checkbox" 
                      :value="feature.id"
                      v-model="offerForm.features"
                    >
                    <span class="feature-icon">{{ feature.icon }}</span>
                    <span class="feature-name">{{ feature.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Действия формы -->
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="saveDraft">
                  💾 Сохранить черновик
                </button>
                <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
                  {{ editingOffer ? '💾 Сохранить изменения' : '🚀 Опубликовать объявление' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Аналитика -->
          <div v-if="activeTab === 'analytics'" class="analytics-tab">
            <div class="section-header">
              <h3>📈 Аналитика бизнеса</h3>
              <div class="period-selector">
                <select v-model="analyticsPeriod">
                  <option value="7days">7 дней</option>
                  <option value="30days">30 дней</option>
                  <option value="90days">90 дней</option>
                  <option value="1year">1 год</option>
                </select>
              </div>
            </div>

            <!-- Сводка -->
            <div class="analytics-summary">
              <div class="summary-card">
                <div class="summary-value">{{ analyticsData.totalViews }}</div>
                <div class="summary-label">Просмотры</div>
                <div class="summary-change positive">+12%</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ analyticsData.totalClicks }}</div>
                <div class="summary-label">Клики</div>
                <div class="summary-change positive">+8%</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ analyticsData.conversionRate }}%</div>
                <div class="summary-label">Конверсия</div>
                <div class="summary-change positive">+2%</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ analyticsData.avgRating }}</div>
                <div class="summary-label">Рейтинг</div>
                <div class="summary-change positive">+0.1</div>
              </div>
            </div>

            <!-- Графики -->
            <div class="charts-section">
              <div class="chart-card">
                <h4>📊 Просмотры по дням</h4>
                <div class="chart-placeholder">
                  <p>График будет отображать динамику просмотров</p>
                </div>
              </div>
              
              <div class="chart-card">
                <h4>🎯 Эффективность по категориям</h4>
                <div class="chart-bars">
                  <div 
                    v-for="(stats, categoryId) in businessStats.categoryStats" 
                    :key="categoryId"
                    class="chart-bar"
                  >
                    <div class="bar-label">{{ getCategoryName(categoryId) }}</div>
                    <div class="bar-container">
                      <div 
                        class="bar-fill" 
                        :style="{ 
                          width: calculatePercentage(stats, businessStats.totalViews) + '%',
                          backgroundColor: getCategoryColor(categoryId)
                        }"
                      ></div>
                    </div>
                    <div class="bar-value">{{ stats }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Рекомендации -->
            <div class="recommendations">
              <h4>💡 Рекомендации</h4>
              <div class="recommendation-list">
                <div class="recommendation-item">
                  <span class="rec-icon">📸</span>
                  <div class="rec-content">
                    <strong>Добавьте больше фото</strong>
                    <p>Объявления с 3+ фотографиями получают на 45% больше просмотров</p>
                  </div>
                </div>
                <div class="recommendation-item">
                  <span class="rec-icon">🕒</span>
                  <div class="rec-content">
                    <strong>Укажите точное время работы</strong>
                    <p>Пользователи чаще посещают заведения с актуальной информацией</p>
                  </div>
                </div>
                <div class="recommendation-item">
                  <span class="rec-icon">🎯</span>
                  <div class="rec-content">
                    <strong>Заполните все поля</strong>
                    <p>Полные профили получают на 60% больше откликов</p>
                  </div>
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
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'

export default {
  name: 'BusinessPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    
    const { closePanel, showNotification, openPanel } = uiStore
    const { initTelegramAuth, registerAsBusiness } = authStore
    const { 
      createOffer, 
      updateOffer, 
      deleteOffer, 
      toggleOfferStatus,
      getCategoryById 
    } = businessStore

    const { isAuthenticated, isBusinessOwner } = storeToRefs(authStore)
    const { getUserOffers, getBusinessStats, categories } = storeToRefs(businessStore)

    // State
    const activeTab = ref('overview')
    const editingOffer = ref(null)
    const offersFilter = reactive({
      status: 'all',
      category: 'all'
    })
    const analyticsPeriod = ref('30days')

    // Form data
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
      averageBill: '',
      features: []
    })

    // Computed
    const businessStats = computed(() => getBusinessStats.value)
    const userOffers = computed(() => getUserOffers.value)
    
    const filteredOffers = computed(() => {
      let filtered = userOffers.value
      
      if (offersFilter.status !== 'all') {
        filtered = filtered.filter(offer => offer.status === offersFilter.status)
      }
      
      if (offersFilter.category !== 'all') {
        filtered = filtered.filter(offer => offer.category === offersFilter.category)
      }
      
      return filtered
    })

    const canSubmit = computed(() => {
      return offerForm.title.length > 0 &&
             offerForm.category.length > 0 &&
             offerForm.description.length > 0 &&
             offerForm.address.length > 0 &&
             offerForm.phone.length > 0
    })

    const availableFeatures = [
      { id: 'wi-fi', name: 'Wi-Fi', icon: '📶' },
      { id: 'parking', name: 'Парковка', icon: '🅿️' },
      { id: 'takeaway', name: 'Навынос', icon: '🥡' },
      { id: 'delivery', name: 'Доставка', icon: '🚚' },
      { id: 'outdoor', name: 'Летняя площадка', icon: '🌳' },
      { id: 'online_booking', name: 'Онлайн-запись', icon: '📅' },
      { id: 'cards', name: 'Оплата картой', icon: '💳' },
      { id: 'kids', name: 'Детская комната', icon: '👶' },
      { id: 'alcohol', name: 'Алкоголь', icon: '🍷' },
      { id: 'breakfast', name: 'Завтраки', icon: '🍳' },
      { id: 'live_music', name: 'Живая музыка', icon: '🎵' },
      { id: 'tv', name: 'Телевизор', icon: '📺' }
    ]

    const analyticsData = reactive({
      totalViews: 1245,
      totalClicks: 367,
      conversionRate: 29.5,
      avgRating: 4.8
    })

    const recentActivities = [
      { id: 1, icon: '👁️', text: 'Кофейня "Уютный уголок" получила 23 просмотра', time: '2 часа назад' },
      { id: 2, icon: '❤️', text: 'Новый лайк на ваше объявление', time: '5 часов назад' },
      { id: 3, icon: '💬', text: 'Новый отзыв от пользователя', time: '1 день назад' },
      { id: 4, icon: '📈', text: 'Рост просмотров на 12% за неделю', time: '2 дня назад' }
    ]

    // Methods
    const initAuth = () => {
      initTelegramAuth()
    }

    const registerBusiness = async () => {
      try {
        const businessData = {
          companyName: authStore.user.name,
          registrationDate: new Date().toISOString(),
          type: 'individual'
        }
        
        await registerAsBusiness(businessData)
        showNotification('Поздравляем! Теперь вы партнер MapChap', 'success')
        activeTab.value = 'overview'
      } catch (error) {
        showNotification('Ошибка при регистрации бизнеса', 'error')
      }
    }

    const getCategoryName = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? category.name : 'Неизвестно'
    }

    const getCategoryColor = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? category.color : '#667eea'
    }

    const getFeatureName = (featureId) => {
      const feature = availableFeatures.find(f => f.id === featureId)
      return feature ? feature.name : featureId
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
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    }

    const calculatePercentage = (value, total) => {
      if (total === 0) return 0
      return Math.round((value / total) * 100)
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
        phone: offer.phone,
        email: offer.email || '',
        website: offer.website || '',
        priceLevel: offer.priceLevel,
        hours: offer.hours || '',
        averageBill: offer.averageBill || '',
        features: offer.features || []
      })
      activeTab.value = 'create'
    }

    const cancelEdit = () => {
      editingOffer.value = null
      resetForm()
      activeTab.value = 'offers'
    }

    const handleToggleOfferStatus = async (offerId) => {
      try {
        await toggleOfferStatus(offerId)
        showNotification('Статус объявления изменен', 'success')
      } catch (error) {
        showNotification('Ошибка при изменении статуса', 'error')
      }
    }

    const confirmDeleteOffer = (offerId) => {
      if (confirm('Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.')) {
        deleteOffer(offerId)
        showNotification('Объявление удалено', 'success')
      }
    }

    const saveDraft = () => {
      localStorage.setItem('business_offer_draft', JSON.stringify(offerForm))
      showNotification('Черновик сохранен!', 'success')
    }

    const filterOffers = () => {
      // Фильтрация происходит в computed свойстве
    }

    const showPerformance = () => {
      activeTab.value = 'analytics'
    }

    const showPromotion = () => {
      showNotification('Раздел продвижения будет доступен в следующем обновлении', 'info')
    }

    const showTeam = () => {
      showNotification('Управление командой будет доступно в следующем обновлении', 'info')
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
        averageBill: '',
        features: []
      })
    }

    // Load draft on component mount
    const loadDraft = () => {
      const draft = localStorage.getItem('business_offer_draft')
      if (draft) {
        const draftData = JSON.parse(draft)
        Object.assign(offerForm, draftData)
      }
    }

    loadDraft()

    return {
      // Stores
      authStore,
      businessStore,
      
      // State
      activeTab,
      editingOffer,
      offersFilter,
      analyticsPeriod,
      offerForm,
      
      // Computed
      isAuthenticated,
      isBusinessOwner,
      businessStats,
      userOffers,
      filteredOffers,
      canSubmit,
      availableFeatures,
      analyticsData,
      recentActivities,
      
      // Methods
      closePanel,
      initAuth,
      registerBusiness,
      submitOffer,
      editOffer,
      cancelEdit,
      handleToggleOfferStatus,
      confirmDeleteOffer,
      saveDraft,
      filterOffers,
      showPerformance,
      showPromotion,
      showTeam,
      getCategoryName,
      getCategoryColor,
      getFeatureName,
      getStatusText,
      getStatusButtonText,
      getStatusButtonIcon,
      getStatusButtonClass,
      formatDate,
      calculatePercentage
    }
  }
}
</script>

<style scoped>
.business-content {
  padding: 0;
}

.loading-state, .auth-required, .upgrade-required {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.auth-icon, .upgrade-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-required h3, .upgrade-required h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.upgrade-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.feature-icon {
  font-size: 1.2rem;
}

/* Tabs */
.tabs {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-radius: 12px;
  font-weight: 500;
  min-width: 100px;
  white-space: nowrap;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

/* Overview Tab */
.overview-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.welcome-section {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 20px;
}

.welcome-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.welcome-section p {
  margin: 0;
  opacity: 0.9;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
}

.metric-card.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.metric-card.success {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
}

.metric-card.warning {
  background: linear-gradient(135deg, #ffd166, #ff9e6d);
}

.metric-card.info {
  background: linear-gradient(135deg, #118ab2, #06d6a0);
}

.metric-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.metric-trend.positive {
  color: #4ade80;
}

.quick-actions {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.quick-actions h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.action-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.action-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.recent-activity {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.recent-activity h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
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
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Offers Tab */
.offers-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
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
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.offer-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.offer-card.paused {
  opacity: 0.7;
  background: var(--bg-tertiary);
}

.offer-card.draft {
  border-style: dashed;
  background: var(--bg-tertiary);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.offer-main h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.offer-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.offer-category {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-weight: 500;
}

.offer-status {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.offer-status.active {
  background: #dcfce7;
  color: #166534;
}

.offer-status.paused {
  background: #fef3c7;
  color: #92400e;
}

.offer-status.draft {
  background: #e0e7ff;
  color: #3730a3;
}

.offer-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.offer-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.offer-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat {
  text-align: center;
}

.stat-icon {
  font-size: 1.25rem;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.feature-more {
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.offer-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Create Tab */
.create-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.offer-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}

.feature-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-checkbox:hover {
  background: var(--bg-tertiary);
}

.feature-checkbox.selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.feature-checkbox input {
  margin: 0;
}

.feature-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.feature-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Analytics Tab */
.analytics-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.period-selector select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.summary-card {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.summary-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.summary-change {
  font-size: 0.8rem;
  font-weight: 600;
}

.summary-change.positive {
  color: #10b981;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.chart-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
  color: var(--text-secondary);
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
  min-width: 120px;
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
  min-width: 80px;
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.recommendations {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.recommendations h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.rec-icon {
  font-size: 1.25rem;
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.rec-content {
  flex: 1;
}

.rec-content strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.rec-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-decoration: none;
  justify-content: center;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .offer-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .offer-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .offer-actions {
    flex-direction: column;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .analytics-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
  
  .offer-stats {
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
