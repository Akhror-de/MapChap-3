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

      <!-- Не бизнес-аккаунт - показываем верификацию -->
      <div v-else-if="!authStore.isBusinessOwner" class="verification-section">
        <div class="verification-header">
          <div class="upgrade-icon">🚀</div>
          <h3>Станьте партнером MapChap</h3>
          <p>Подключите бизнес-аккаунт для размещения объявлений</p>
        </div>

        <!-- Выбор способа верификации -->
        <div class="verification-tabs">
          <button 
            class="verification-tab"
            :class="{ active: verificationMethod === 'inn' }"
            @click="verificationMethod = 'inn'"
          >
            <span class="tab-icon">🏢</span>
            <span class="tab-label">По ИНН</span>
          </button>
          <button 
            class="verification-tab"
            :class="{ active: verificationMethod === 'manual' }"
            @click="verificationMethod = 'manual'"
          >
            <span class="tab-icon">📝</span>
            <span class="tab-label">Вручную</span>
          </button>
        </div>

        <!-- Верификация по ИНН -->
        <div v-if="verificationMethod === 'inn'" class="verification-form">
          <div class="form-section">
            <h4>🏢 Верификация по ИНН</h4>
            <p class="form-description">
              Введите ИНН вашей компании для автоматической проверки через DaData
            </p>
            
            <div class="form-group">
              <label>ИНН компании *</label>
              <input 
                v-model="innForm.inn"
                type="text" 
                placeholder="10 или 12 цифр"
                maxlength="12"
                @input="validateINN"
              >
              <span v-if="innError" class="field-error">{{ innError }}</span>
            </div>

            <!-- Результат проверки -->
            <div v-if="innVerificationResult" class="verification-result" :class="{ success: innVerificationResult.success }">
              <div v-if="innVerificationResult.success" class="result-success">
                <span class="result-icon">✅</span>
                <div class="result-content">
                  <h5>{{ innVerificationResult.verification.name }}</h5>
                  <p>ИНН: {{ innVerificationResult.verification.inn }}</p>
                  <p v-if="innVerificationResult.verification.ogrn">ОГРН: {{ innVerificationResult.verification.ogrn }}</p>
                </div>
              </div>
              <div v-else class="result-error">
                <span class="result-icon">❌</span>
                <p>{{ innVerificationResult.error }}</p>
              </div>
            </div>

            <button 
              class="btn btn-primary btn-block" 
              @click="verifyByINN"
              :disabled="isVerifying || !isValidINN"
            >
              <span v-if="isVerifying" class="btn-loading"></span>
              {{ isVerifying ? 'Проверка...' : 'Проверить ИНН' }}
            </button>
          </div>
        </div>

        <!-- Ручная верификация -->
        <div v-if="verificationMethod === 'manual'" class="verification-form">
          <div class="form-section">
            <h4>📝 Ручная верификация</h4>
            <p class="form-description">
              Заполните контактные данные для связи
            </p>
            
            <div class="form-group">
              <label>Название компании *</label>
              <input 
                v-model="manualForm.company_name"
                type="text" 
                placeholder="ООО 'Ваша компания'"
              >
            </div>

            <div class="form-group">
              <label>Телефон *</label>
              <input 
                v-model="manualForm.phone"
                type="tel" 
                placeholder="+7 (999) 123-45-67"
              >
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input 
                v-model="manualForm.email"
                type="email" 
                placeholder="your@email.com"
              >
            </div>

            <div class="form-group">
              <label>Социальная сеть *</label>
              <div class="social-select">
                <button 
                  class="social-btn"
                  :class="{ active: manualForm.social_type === 'telegram' }"
                  @click="manualForm.social_type = 'telegram'"
                >
                  💬 Telegram
                </button>
                <button 
                  class="social-btn"
                  :class="{ active: manualForm.social_type === 'instagram' }"
                  @click="manualForm.social_type = 'instagram'"
                >
                  📷 Instagram
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Username {{ manualForm.social_type === 'telegram' ? 'Telegram' : 'Instagram' }} *</label>
              <input 
                v-model="manualForm.social_username"
                type="text" 
                :placeholder="manualForm.social_type === 'telegram' ? '@username' : '@instagram_name'"
              >
            </div>

            <button 
              class="btn btn-primary btn-block" 
              @click="verifyManually"
              :disabled="isVerifying || !isValidManualForm"
            >
              <span v-if="isVerifying" class="btn-loading"></span>
              {{ isVerifying ? 'Отправка...' : 'Подтвердить' }}
            </button>
          </div>
        </div>

        <!-- Преимущества -->
        <div class="upgrade-benefits">
          <h4>⭐ Преимущества бизнес-аккаунта</h4>
          <div class="benefit-item">
            <span class="benefit-icon">📊</span>
            <div class="benefit-content">
              <h5>Расширенная аналитика</h5>
              <p>Отслеживайте просмотры, клики и конверсии</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🎯</span>
            <div class="benefit-content">
              <h5>Продвижение объявлений</h5>
              <p>Увеличивайте видимость вашего бизнеса</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🔔</span>
            <div class="benefit-content">
              <h5>Уведомления клиентам</h5>
              <p>Отправляйте push-уведомления близким пользователям</p>
            </div>
          </div>
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
            🏢 Мои объявления
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
              <div class="verified-badge" v-if="authStore.user?.is_verified">
                <span>✅</span> Верифицировано
              </div>
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
            <div class="quick-actions-section">
              <h4>⚡ Быстрые действия</h4>
              <div class="actions-grid">
                <button class="action-btn" @click="activeTab = 'create'">
                  <span class="action-icon">➕</span>
                  <span class="action-text">Новое объявление</span>
                </button>
                <button class="action-btn" @click="activeTab = 'offers'">
                  <span class="action-icon">📋</span>
                  <span class="action-text">Управление</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Мои объявления -->
          <div v-if="activeTab === 'offers'" class="offers-tab">
            <div class="section-header">
              <h3>Мои объявления</h3>
              <button class="btn btn-primary" @click="activeTab = 'create'">
                ➕ Новое
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
                :class="offer.status"
              >
                <div class="offer-header">
                  <div class="offer-main">
                    <h4 class="offer-title">{{ offer.title }}</h4>
                    <div class="offer-meta">
                      <span class="offer-category">{{ getCategoryName(offer.category) }}</span>
                      <span class="offer-date">{{ formatDate(offer.updated_at || offer.updatedAt) }}</span>
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
                  </div>
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-value">{{ offer.likes || 0 }}</span>
                  </div>
                </div>

                <div class="offer-actions">
                  <button class="btn btn-small" @click="editOffer(offer)">
                    ✏️ Редактировать
                  </button>
                  <button 
                    class="btn btn-small" 
                    :class="offer.status === 'active' ? 'btn-warning' : 'btn-success'"
                    @click="handleToggleOfferStatus(offer.id)"
                  >
                    {{ offer.status === 'active' ? '⏸️ Пауза' : '▶️ Активировать' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Создание объявления -->
          <div v-if="activeTab === 'create'" class="create-tab">
            <div class="section-header">
              <h3>{{ editingOffer ? 'Редактировать' : 'Новое объявление' }}</h3>
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
                      {{ category.icon }} {{ category.name }}
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
                <h4>📞 Контакты</h4>
                
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
                  <label>Координаты (широта, долгота)</label>
                  <div class="coordinates-input">
                    <input 
                      v-model.number="offerForm.lat"
                      type="number" 
                      step="0.000001"
                      placeholder="55.751244"
                    >
                    <input 
                      v-model.number="offerForm.lng"
                      type="number" 
                      step="0.000001"
                      placeholder="37.618423"
                    >
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="cancelEdit" v-if="editingOffer">
                  Отменить
                </button>
                <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
                  {{ editingOffer ? '💾 Сохранить' : '🚀 Опубликовать' }}
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
import { apiService } from '../services/api'
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
    const { createOffer, updateOffer, toggleOfferStatus: toggleOfferStatusInStore, getCategoryById } = businessStore

    const { isAuthenticated, isBusinessOwner, user } = storeToRefs(authStore)
    const { getUserOffers, categories } = storeToRefs(businessStore)

    // State
    const activeTab = ref('overview')
    const editingOffer = ref(null)
    const verificationMethod = ref('inn')
    const isVerifying = ref(false)
    const innVerificationResult = ref(null)
    const innError = ref('')

    // Forms
    const innForm = reactive({ inn: '' })
    const manualForm = reactive({
      company_name: '',
      phone: '',
      email: '',
      social_type: 'telegram',
      social_username: ''
    })
    const offerForm = reactive({
      title: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      lat: 55.751244,
      lng: 37.618423
    })

    // Computed
    const userOffers = computed(() => getUserOffers.value)
    
    const businessInfo = computed(() => {
      return {
        companyName: user.value?.company_name || user.value?.first_name || 'Ваш бизнес',
        registrationDate: user.value?.created_at || new Date().toISOString()
      }
    })

    const businessStats = computed(() => {
      const offers = userOffers.value
      const totalViews = offers.reduce((sum, offer) => sum + (offer.views || 0), 0)
      const totalLikes = offers.reduce((sum, offer) => sum + (offer.likes || 0), 0)
      const activeOffers = offers.filter(offer => offer.status === 'active').length
      
      const ratedOffers = offers.filter(offer => offer.rating && offer.rating > 0)
      const averageRating = ratedOffers.length > 0 
        ? (ratedOffers.reduce((sum, offer) => sum + offer.rating, 0) / ratedOffers.length).toFixed(1)
        : null

      return { totalViews, totalLikes, activeOffers, averageRating }
    })

    const isValidINN = computed(() => {
      const inn = innForm.inn.replace(/\D/g, '')
      return inn.length === 10 || inn.length === 12
    })

    const isValidManualForm = computed(() => {
      return manualForm.company_name.length >= 2 &&
             manualForm.phone.length >= 10 &&
             manualForm.email.includes('@') &&
             manualForm.social_username.length >= 2
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

    const validateINN = () => {
      const inn = innForm.inn.replace(/\D/g, '')
      innForm.inn = inn
      
      if (inn.length > 0 && inn.length !== 10 && inn.length !== 12) {
        innError.value = 'ИНН должен содержать 10 или 12 цифр'
      } else {
        innError.value = ''
      }
      innVerificationResult.value = null
    }

    const verifyByINN = async () => {
      if (!isValidINN.value || isVerifying.value) return
      
      isVerifying.value = true
      innVerificationResult.value = null
      
      try {
        const result = await apiService.verifyByINN(user.value.telegram_id, innForm.inn)
        innVerificationResult.value = result
        
        if (result.success) {
          // Обновляем локальное состояние
          await authStore.registerAsBusiness({
            companyName: result.verification.name,
            inn: innForm.inn,
            verificationType: 'inn'
          })
          showNotification('🎉 Бизнес успешно верифицирован!', 'success')
        }
      } catch (error) {
        innVerificationResult.value = { success: false, error: error.message || 'Ошибка проверки ИНН' }
        showNotification(error.message || 'Ошибка проверки ИНН', 'error')
      } finally {
        isVerifying.value = false
      }
    }

    const verifyManually = async () => {
      if (!isValidManualForm.value || isVerifying.value) return
      
      isVerifying.value = true
      
      try {
        const result = await apiService.verifyManually(user.value.telegram_id, manualForm)
        
        if (result.success) {
          await authStore.registerAsBusiness({
            companyName: manualForm.company_name,
            phone: manualForm.phone,
            email: manualForm.email,
            verificationType: 'manual'
          })
          showNotification('🎉 Бизнес-аккаунт активирован!', 'success')
        }
      } catch (error) {
        showNotification(error.message || 'Ошибка верификации', 'error')
      } finally {
        isVerifying.value = false
      }
    }

    const getCategoryName = (categoryId) => {
      const category = getCategoryById(categoryId)
      return category ? `${category.icon} ${category.name}` : 'Неизвестно'
    }

    const getStatusText = (status) => {
      const statuses = {
        active: '✅ Активно',
        paused: '⏸️ На паузе',
        draft: '📝 Черновик'
      }
      return statuses[status] || status
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    }

    const submitOffer = async () => {
      try {
        const offerData = {
          title: offerForm.title,
          description: offerForm.description,
          category: offerForm.category,
          address: offerForm.address,
          phone: offerForm.phone,
          coordinates: [offerForm.lat, offerForm.lng]
        }

        if (editingOffer.value) {
          await updateOffer(editingOffer.value.id, offerData)
          showNotification('Объявление обновлено!', 'success')
        } else {
          await createOffer(offerData)
          showNotification('Объявление создано!', 'success')
        }
        resetForm()
        activeTab.value = 'offers'
      } catch (error) {
        showNotification('Ошибка при сохранении', 'error')
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
        lat: offer.coordinates?.[0] || 55.751244,
        lng: offer.coordinates?.[1] || 37.618423
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
        await toggleOfferStatusInStore(offerId)
        showNotification('Статус изменен', 'success')
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
        phone: '',
        lat: 55.751244,
        lng: 37.618423
      })
    }

    onMounted(() => {
      if (isAuthenticated.value && isBusinessOwner.value) {
        console.log('Business panel mounted')
      }
    })

    return {
      authStore,
      businessStore,
      activeTab,
      editingOffer,
      verificationMethod,
      isVerifying,
      innVerificationResult,
      innError,
      innForm,
      manualForm,
      offerForm,
      isAuthenticated,
      isBusinessOwner,
      userOffers,
      businessInfo,
      businessStats,
      isValidINN,
      isValidManualForm,
      canSubmit,
      closePanel,
      initAuth,
      validateINN,
      verifyByINN,
      verifyManually,
      submitOffer,
      editOffer,
      cancelEdit,
      handleToggleOfferStatus,
      getCategoryName,
      getStatusText,
      formatDate
    }
  }
}
</script>

<style scoped>
.verification-section {
  padding: 0;
}

.verification-header {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 20px;
}

.upgrade-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.verification-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
}

.verification-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.verification-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.verification-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  border: 2px solid var(--tg-border-color);
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verification-tab.active {
  border-color: var(--tg-button-color);
  background: var(--tg-button-color);
  color: white;
}

.tab-icon {
  font-size: 24px;
}

.tab-label {
  font-size: 14px;
  font-weight: 600;
}

.verification-form {
  margin-bottom: 24px;
}

.form-section {
  background: var(--tg-secondary-bg-color);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}

.form-section h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--tg-text-color);
}

.form-description {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: var(--tg-hint-color);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--tg-text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--tg-border-color);
  border-radius: 10px;
  background: var(--tg-bg-color);
  color: var(--tg-text-color);
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--tg-button-color);
}

.field-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--tg-error-color);
}

.social-select {
  display: flex;
  gap: 8px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--tg-border-color);
  background: var(--tg-bg-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.social-btn.active {
  border-color: var(--tg-button-color);
  background: var(--tg-button-color);
  color: white;
}

.coordinates-input {
  display: flex;
  gap: 8px;
}

.coordinates-input input {
  flex: 1;
}

.verification-result {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.verification-result.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.result-success,
.result-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.result-icon {
  font-size: 24px;
}

.result-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #166534;
}

.result-content p {
  margin: 0;
  font-size: 13px;
  color: #15803d;
}

.result-error p {
  margin: 0;
  color: #dc2626;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--tg-button-color);
  color: var(--tg-button-text-color);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--tg-secondary-bg-color);
  color: var(--tg-text-color);
}

.btn-block {
  width: 100%;
}

.btn-small {
  padding: 8px 12px;
  font-size: 13px;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.upgrade-benefits {
  background: var(--tg-secondary-bg-color);
  border-radius: 16px;
  padding: 20px;
}

.upgrade-benefits h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.benefit-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--tg-border-color);
}

.benefit-item:last-child {
  border-bottom: none;
}

.benefit-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.benefit-content h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.benefit-content p {
  margin: 0;
  font-size: 13px;
  color: var(--tg-hint-color);
}

/* Business content styles */
.tabs {
  display: flex;
  gap: 4px;
  background: var(--tg-secondary-bg-color);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--tg-hint-color);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--tg-button-color);
  color: white;
}

.welcome-section {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 20px;
}

.verified-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 8px;
}

.welcome-section h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.welcome-section p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
}

.metric-icon {
  font-size: 24px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.metric-label {
  font-size: 12px;
  color: var(--tg-hint-color);
  margin-top: 2px;
}

.quick-actions-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--tg-secondary-bg-color);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--tg-border-color);
}

.action-icon {
  font-size: 24px;
}

.action-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--tg-text-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 16px 0;
  color: var(--tg-hint-color);
}

.offers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.offer-card {
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
  padding: 16px;
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.offer-title {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.offer-meta {
  font-size: 12px;
  color: var(--tg-hint-color);
}

.offer-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.offer-status.active {
  background: #dcfce7;
  color: #166534;
}

.offer-status.paused {
  background: #fef3c7;
  color: #92400e;
}

.offer-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--tg-hint-color);
  line-height: 1.4;
}

.offer-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--tg-hint-color);
}

.offer-actions {
  display: flex;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-actions .btn {
  flex: 1;
}

/* Panel base styles */
.loading-state,
.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--tg-border-color);
  border-top-color: var(--tg-button-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.auth-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.auth-required h3 {
  margin: 0 0 8px 0;
}

.auth-required p {
  margin: 0 0 20px 0;
  color: var(--tg-hint-color);
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .offer-header {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
