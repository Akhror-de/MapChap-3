<template>
  <div class="side-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="handleBack">
          <span class="back-icon">←</span>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">⚡</span>
          {{ t('business_title') }}
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('loading') }}</p>
      </div>

      <!-- Не авторизован -->
      <div v-else-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-icon">🔐</div>
        <h3>{{ t('profile_login_required') }}</h3>
        <p>{{ t('profile_login_message') }}</p>
        <button class="btn btn-primary" @click="initAuth">{{ t('profile_login') }}</button>
      </div>

      <!-- Верификация (Шаг 1) -->
      <div v-else-if="!authStore.isBusinessOwner && currentStep === 'verification'" class="verification-section">
        <!-- Хедер -->
        <div class="hero-card">
          <div class="hero-icon">🚀</div>
          <h3>{{ t('business_become_partner') }}</h3>
          <p>{{ t('business_partner_desc') }}</p>
        </div>

        <!-- Индикатор шагов -->
        <div class="steps-indicator">
          <div class="step active">
            <span class="step-num">1</span>
            <span class="step-label">{{ t('business_step1') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">2</span>
            <span class="step-label">{{ t('business_step2') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">3</span>
            <span class="step-label">{{ t('business_step3') }}</span>
          </div>
        </div>

        <!-- Табы верификации -->
        <div class="verification-tabs">
          <button 
            class="tab-btn"
            :class="{ active: verificationMethod === 'inn' }"
            @click="verificationMethod = 'inn'"
          >
            <span>🏢</span> {{ t('business_verify_inn') }}
          </button>
          <button 
            class="tab-btn"
            :class="{ active: verificationMethod === 'manual' }"
            @click="verificationMethod = 'manual'"
          >
            <span>📝</span> {{ t('business_verify_manual') }}
          </button>
        </div>

        <!-- Форма ИНН -->
        <div v-if="verificationMethod === 'inn'" class="section-card">
          <div class="section-title">{{ t('business_inn_check') }}</div>
          <p class="section-description">Проверка по ИНН/БИН доступна для России, Казахстана и Беларуси</p>
          
          <!-- Выбор страны -->
          <div class="form-group">
            <label>Страна регистрации</label>
            <div class="country-btns">
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'RU' }"
                @click="innForm.country = 'RU'"
              >🇷🇺 Россия</button>
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'KZ' }"
                @click="innForm.country = 'KZ'"
              >🇰🇿 Казахстан</button>
              <button 
                class="country-btn"
                :class="{ active: innForm.country === 'BY' }"
                @click="innForm.country = 'BY'"
              >🇧🇾 Беларусь</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ innForm.country === 'KZ' ? 'БИН/ИИН компании' : 'ИНН компании' }}</label>
            <input 
              v-model="innForm.inn"
              type="text" 
              :placeholder="getINNPlaceholder"
              :maxlength="innForm.country === 'KZ' ? 12 : 12"
              @input="validateINN"
            >
            <span v-if="innError" class="field-error">{{ innError }}</span>
          </div>

          <div v-if="innVerificationResult" class="result-card" :class="{ success: innVerificationResult.success }">
            <div v-if="innVerificationResult.success" class="result-success">
              <span class="result-icon">✅</span>
              <div>
                <strong>{{ innVerificationResult.verification.name }}</strong>
                <p>{{ innForm.country === 'KZ' ? 'БИН' : 'ИНН' }}: {{ innVerificationResult.verification.inn }}</p>
                <p v-if="innVerificationResult.verification.address">📍 {{ innVerificationResult.verification.address }}</p>
                <p v-if="innVerificationResult.verification.status">Статус: {{ innVerificationResult.verification.status }}</p>
              </div>
            </div>
            <div v-else class="result-error">
              <span class="result-icon">❌</span>
              <p>{{ innVerificationResult.error }}</p>
            </div>
          </div>

          <button class="btn btn-primary btn-block" @click="verifyByINN" :disabled="isVerifying || !isValidINN">
            {{ isVerifying ? t('loading') : t('business_check') }}
          </button>
          
          <!-- Подсказка для других стран СНГ -->
          <div class="cis-hint">
            <p>🇺🇿🇹🇯🇰🇬 Для Узбекистана, Таджикистана и Кыргызстана используйте <strong>ручную верификацию</strong></p>
          </div>
        </div>

        <!-- Ручная форма -->
        <div v-if="verificationMethod === 'manual'" class="section-card">
          <div class="section-title">{{ t('business_manual_verification') }}</div>
          
          <div class="form-group">
            <label>{{ t('business_company_name') }} *</label>
            <input v-model="manualForm.company_name" type="text" placeholder="ООО 'Ваша компания'">
          </div>

          <div class="form-group">
            <label>{{ t('business_phone') }} *</label>
            <input v-model="manualForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
          </div>

          <div class="form-group">
            <label>{{ t('business_email') }} *</label>
            <input v-model="manualForm.email" type="email" placeholder="email@company.com">
          </div>

          <div class="form-group">
            <label>{{ t('business_social') }}</label>
            <div class="social-btns">
              <button 
                class="social-btn"
                :class="{ active: manualForm.social_type === 'telegram' }"
                @click="manualForm.social_type = 'telegram'"
              >💬 TG</button>
              <button 
                class="social-btn"
                :class="{ active: manualForm.social_type === 'instagram' }"
                @click="manualForm.social_type = 'instagram'"
              >📷 IG</button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_username') }}</label>
            <input v-model="manualForm.social_username" type="text" placeholder="@username">
          </div>

          <button class="btn btn-primary btn-block" @click="verifyManually" :disabled="isVerifying || !isValidManualForm">
            {{ isVerifying ? t('loading') : t('business_confirm') }}
          </button>
        </div>

        <!-- Преимущества -->
        <div class="benefits-card">
          <div class="benefit-item">
            <span class="benefit-icon">📊</span>
            <div>
              <strong>{{ t('business_analytics') }}</strong>
              <p>{{ t('business_analytics_desc') }}</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">🔔</span>
            <div>
              <strong>{{ t('business_push_notifications') }}</strong>
              <p>{{ t('business_push_desc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 2: После верификации - создание первого объявления -->
      <div v-else-if="authStore.isBusinessOwner && currentStep === 'create-offer'" class="create-offer-section">
        <!-- Индикатор шагов -->
        <div class="steps-indicator">
          <div class="step completed">
            <span class="step-num">✓</span>
            <span class="step-label">{{ t('business_step1') }}</span>
          </div>
          <div class="step-line active"></div>
          <div class="step active">
            <span class="step-num">2</span>
            <span class="step-label">{{ t('business_step2') }}</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <span class="step-num">3</span>
            <span class="step-label">{{ t('business_step_done') }}</span>
          </div>
        </div>

        <div class="success-banner">
          <span class="success-icon">🎉</span>
          <div>
            <strong>{{ t('business_verification_passed') }}</strong>
            <p>{{ t('business_create_first_offer') }}</p>
          </div>
        </div>

        <!-- Форма объявления -->
        <div class="section-card">
          <div class="section-title">📝 {{ t('business_info_about') }}</div>
          
          <div class="form-group">
            <label>{{ t('business_name_label') }} *</label>
            <input v-model="offerForm.title" type="text" :placeholder="t('business_name_placeholder')">
          </div>

          <div class="form-group">
            <label>{{ t('business_offer_category') }} *</label>
            <div class="category-grid">
              <button 
                v-for="cat in categories" 
                :key="cat.id"
                class="category-btn"
                :class="{ active: offerForm.category === cat.id }"
                @click="offerForm.category = cat.id"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_short_desc') }} *</label>
            <textarea v-model="offerForm.description" rows="3" :placeholder="t('business_short_desc_placeholder')"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('business_full_desc') }}</label>
            <textarea v-model="offerForm.full_description" rows="5" :placeholder="t('business_full_desc_placeholder')"></textarea>
          </div>

          <div class="form-group">
            <label>{{ t('business_offer_address') }} *</label>
            <input v-model="offerForm.address" type="text" placeholder="">
            <span class="field-hint">{{ t('business_address_hint') }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('business_phone') }} *</label>
              <input v-model="offerForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
            </div>
            <div class="form-group">
              <label>{{ t('business_email') }}</label>
              <input v-model="offerForm.email" type="email" placeholder="email@company.com">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('business_website') }}</label>
              <input v-model="offerForm.website" type="url" placeholder="https://example.com">
            </div>
            <div class="form-group">
              <label>{{ t('business_hours') }}</label>
              <input v-model="offerForm.working_hours" type="text" placeholder="">
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('business_amenities') }}</label>
            <div class="amenities-grid">
              <button 
                v-for="amenity in amenitiesList" 
                :key="amenity.id"
                class="amenity-btn"
                :class="{ active: offerForm.amenities.includes(amenity.id) }"
                @click="toggleAmenity(amenity.id)"
              >
                <span>{{ amenity.icon }}</span>
                <span>{{ getAmenityName(amenity.id) }}</span>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="currentStep = 'dashboard'">{{ t('business_skip') }}</button>
            <button class="btn btn-primary" @click="submitOffer" :disabled="!canSubmitOffer || isSubmitting">
              {{ isSubmitting ? t('loading') : t('business_create_offer') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Бизнес дашборд -->
      <div v-else-if="authStore.isBusinessOwner && currentStep === 'dashboard'" class="business-content">
        <div class="tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">📊 {{ t('business_overview') }}</button>
          <button class="tab-btn" :class="{ active: activeTab === 'offers' }" @click="activeTab = 'offers'">🏢 {{ t('business_my_offers') }}</button>
          <button class="tab-btn" :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">➕ {{ t('business_new_offer') }}</button>
        </div>

        <!-- Обзор -->
        <div v-if="activeTab === 'overview'">
          <div class="welcome-card">
            <span v-if="authStore.user?.is_verified" class="verified-badge">✅ {{ t('business_verified_badge') }}</span>
            <h3>{{ t('business_welcome') }}, {{ businessInfo.companyName }}!</h3>
            <p v-if="authStore.user?.inn">ИНН: {{ authStore.user.inn }}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-icon">👁️</span>
              <div class="metric-value">{{ businessStats.totalViews }}</div>
              <div class="metric-label">{{ t('business_views') }}</div>
            </div>
            <div class="metric-card orange">
              <span class="metric-icon">❤️</span>
              <div class="metric-value">{{ businessStats.totalLikes }}</div>
              <div class="metric-label">{{ t('business_likes') }}</div>
            </div>
            <div class="metric-card">
              <span class="metric-icon">🏢</span>
              <div class="metric-value">{{ businessStats.activeOffers }}</div>
              <div class="metric-label">{{ t('business_offers') }}</div>
            </div>
            <div class="metric-card orange">
              <span class="metric-icon">⭐</span>
              <div class="metric-value">{{ businessStats.averageRating || '-' }}</div>
              <div class="metric-label">{{ t('business_rating') }}</div>
            </div>
          </div>

          <div class="quick-actions">
            <button class="action-btn" @click="activeTab = 'create'">
              <span>➕</span> {{ t('business_new_offer_btn') }}
            </button>
            <button class="action-btn" @click="activeTab = 'offers'">
              <span>📋</span> {{ t('business_manage') }}
            </button>
          </div>
        </div>

        <!-- Мои объявления -->
        <div v-if="activeTab === 'offers'">
          <div v-if="userOffers.length === 0" class="empty-state">
            <div class="empty-icon">🏢</div>
            <h4>{{ t('business_no_offers') }}</h4>
            <p>{{ t('business_create_first') }}</p>
            <button class="btn btn-primary" @click="activeTab = 'create'">{{ t('create') }}</button>
          </div>

          <div v-else class="offers-list">
            <div v-for="offer in userOffers" :key="offer.id" class="offer-card" :class="offer.status">
              <div class="offer-header">
                <h4>{{ offer.title }}</h4>
                <span class="offer-status" :class="offer.status">{{ getStatusText(offer.status) }}</span>
              </div>
              <p class="offer-desc">{{ offer.description }}</p>
              <div class="offer-stats">
                <span>👁️ {{ offer.views || 0 }}</span>
                <span>❤️ {{ offer.likes || 0 }}</span>
                <span>📍 {{ offer.address }}</span>
              </div>
              <div class="offer-actions">
                <button class="btn btn-small btn-secondary" @click="editOffer(offer)">✏️ {{ t('edit') }}</button>
                <button class="btn btn-small" :class="offer.status === 'active' ? 'btn-orange' : 'btn-primary'" @click="handleToggleOfferStatus(offer.id)">
                  {{ offer.status === 'active' ? '⏸️' : '▶️' }}
                </button>
                <button class="btn btn-small btn-danger" @click="handleDeleteOffer(offer.id)">🗑️</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Создание -->
        <div v-if="activeTab === 'create'">
          <div class="section-card">
            <div class="section-title">{{ editingOffer ? t('business_editing') : t('business_new_offer_btn') }}</div>
            
            <div class="form-group">
              <label>{{ t('business_name_label') }} *</label>
              <input v-model="offerForm.title" type="text" :placeholder="t('business_name_placeholder')">
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_category') }} *</label>
              <div class="category-grid">
                <button 
                  v-for="cat in categories" 
                  :key="cat.id"
                  class="category-btn"
                  :class="{ active: offerForm.category === cat.id }"
                  @click="offerForm.category = cat.id"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.name }}</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('business_short_desc') }} *</label>
              <textarea v-model="offerForm.description" rows="3" :placeholder="t('business_short_desc_placeholder')"></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('business_full_desc') }}</label>
              <textarea v-model="offerForm.full_description" rows="5" :placeholder="t('business_full_desc_placeholder')"></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_address') }} *</label>
              <input v-model="offerForm.address" type="text" placeholder="">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('business_phone') }} *</label>
                <input v-model="offerForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
              </div>
              <div class="form-group">
                <label>{{ t('business_email') }}</label>
                <input v-model="offerForm.email" type="email" placeholder="email@company.com">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ t('business_website') }}</label>
                <input v-model="offerForm.website" type="url" placeholder="https://example.com">
              </div>
              <div class="form-group">
                <label>{{ t('business_hours') }}</label>
                <input v-model="offerForm.working_hours" type="text" placeholder="">
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('business_amenities') }}</label>
              <div class="amenities-grid">
                <button 
                  v-for="amenity in amenitiesList" 
                  :key="amenity.id"
                  class="amenity-btn"
                  :class="{ active: offerForm.amenities.includes(amenity.id) }"
                  @click="toggleAmenity(amenity.id)"
                >
                  <span>{{ amenity.icon }}</span>
                  <span>{{ getAmenityName(amenity.id) }}</span>
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button v-if="editingOffer" class="btn btn-secondary" @click="cancelEdit">{{ t('cancel') }}</button>
              <button class="btn btn-primary" :class="{ 'btn-block': !editingOffer }" @click="submitOffer" :disabled="!canSubmitOffer || isSubmitting">
                {{ isSubmitting ? t('loading') : (editingOffer ? t('save') : t('business_publish')) }}
              </button>
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
import { apiService } from '../services/api'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useLocale } from '../composables/useLocale'

export default {
  name: 'BusinessPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    const { closePanel, showNotification } = uiStore
    const { getUserOffers } = storeToRefs(businessStore)
    const { t } = useLocale()

    const isLoading = ref(false)
    const activeTab = ref('overview')
    const editingOffer = ref(null)
    const verificationMethod = ref('inn')
    const isVerifying = ref(false)
    const isSubmitting = ref(false)
    const innVerificationResult = ref(null)
    const innError = ref('')
    const currentStep = ref('verification') // verification, create-offer, dashboard
    const categories = ref([])

    const innForm = reactive({ inn: '', country: 'RU' })
    const manualForm = reactive({ company_name: '', phone: '', email: '', social_type: 'telegram', social_username: '' })
    const offerForm = reactive({ 
      title: '', 
      category: '', 
      description: '',
      full_description: '',
      address: '', 
      phone: '', 
      email: '',
      website: '',
      working_hours: '',
      amenities: [],
      lat: 55.751244, 
      lng: 37.618423 
    })

    // Список удобств
    const amenitiesList = [
      { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
      { id: 'parking', name: 'Парковка', icon: '🅿️' },
      { id: 'card_payment', name: 'Оплата картой', icon: '💳' },
      { id: 'delivery', name: 'Доставка', icon: '🚚' },
      { id: 'takeaway', name: 'С собой', icon: '📦' },
      { id: 'wheelchair', name: 'Доступная среда', icon: '♿' },
      { id: 'children', name: 'Детская зона', icon: '👶' },
      { id: 'pet_friendly', name: 'С животными', icon: '🐕' },
      { id: 'ac', name: 'Кондиционер', icon: '❄️' },
      { id: 'outdoor', name: 'Терраса', icon: '🌿' },
      { id: 'reservation', name: 'Бронь', icon: '📅' },
      { id: '24h', name: '24 часа', icon: '🕐' }
    ]

    const userOffers = computed(() => getUserOffers.value)
    const businessInfo = computed(() => ({ 
      companyName: authStore.user?.company_name || authStore.user?.first_name || 'Бизнес' 
    }))
    
    const businessStats = computed(() => {
      const offers = userOffers.value
      return {
        totalViews: offers.reduce((s, o) => s + (o.views || 0), 0),
        totalLikes: offers.reduce((s, o) => s + (o.likes || 0), 0),
        activeOffers: offers.filter(o => o.status === 'active').length,
        averageRating: null
      }
    })

    const isValidINN = computed(() => { 
      const inn = innForm.inn.replace(/\D/g, '')
      if (innForm.country === 'KZ') {
        // Казахстан: БИН 12 цифр
        return inn.length === 12
      } else if (innForm.country === 'BY') {
        // Беларусь: УНП 9 цифр
        return inn.length === 9
      } else {
        // Россия: ИНН 10 или 12 цифр
        return inn.length === 10 || inn.length === 12
      }
    })
    
    const getINNPlaceholder = computed(() => {
      if (innForm.country === 'KZ') return '12 цифр (БИН)'
      if (innForm.country === 'BY') return '9 цифр (УНП)'
      return '10 или 12 цифр'
    })
    
    const isValidManualForm = computed(() => 
      manualForm.company_name.length >= 2 && 
      manualForm.phone.length >= 10 && 
      manualForm.email.includes('@')
    )
    
    const canSubmitOffer = computed(() => 
      offerForm.title && 
      offerForm.category && 
      offerForm.description && 
      offerForm.address && 
      offerForm.phone
    )

    const initAuth = () => authStore.initTelegramAuth()
    
    const handleBack = () => {
      if (currentStep.value === 'create-offer') {
        currentStep.value = 'dashboard'
      } else {
        closePanel()
      }
    }

    const loadCategories = async () => {
      try {
        const result = await apiService.getCategories()
        categories.value = result.categories || []
      } catch (e) {
        console.log('Categories load error:', e)
        categories.value = businessStore.categories
      }
    }
    
    const validateINN = () => { 
      innForm.inn = innForm.inn.replace(/\D/g, '')
      
      let errorMsg = ''
      const inn = innForm.inn
      
      if (inn.length > 0 && !isValidINN.value) {
        if (innForm.country === 'KZ') {
          errorMsg = 'БИН должен содержать 12 цифр'
        } else if (innForm.country === 'BY') {
          errorMsg = 'УНП должен содержать 9 цифр'
        } else {
          errorMsg = 'ИНН должен содержать 10 или 12 цифр'
        }
      }
      
      innError.value = errorMsg
      innVerificationResult.value = null 
    }
    
    const verifyByINN = async () => {
      if (!isValidINN.value) return
      isVerifying.value = true
      innVerificationResult.value = null
      
      try {
        const result = await apiService.verifyByINN(authStore.user.telegram_id, innForm.inn)
        innVerificationResult.value = result
        
        if (result.success) {
          // Обновляем данные пользователя локально
          await authStore.registerAsBusiness({
            companyName: result.verification.name,
            inn: result.verification.inn,
            verificationType: 'inn'
          })
          
          // Пытаемся синхронизировать с сервером (не критично если не получится)
          await authStore.fetchUser()
          
          showNotification('✅ Верификация пройдена!', 'success')
          
          // Переходим к созданию объявления
          setTimeout(() => {
            currentStep.value = 'create-offer'
            // Заполняем адрес из данных DaData
            if (result.verification?.address) {
              offerForm.address = result.verification.address
            }
          }, 1500)
        }
      } catch (e) {
        innVerificationResult.value = { success: false, error: e.message || 'Ошибка проверки ИНН' }
        showNotification('❌ ' + (e.message || 'Ошибка проверки'), 'error')
      } finally { 
        isVerifying.value = false 
      }
    }

    const verifyManually = async () => {
      if (!isValidManualForm.value) return
      isVerifying.value = true
      
      try {
        await apiService.verifyManually(authStore.user.telegram_id, manualForm)
        await authStore.fetchUser()
        showNotification('✅ Бизнес-аккаунт активирован!', 'success')
        
        setTimeout(() => {
          currentStep.value = 'create-offer'
        }, 1500)
      } catch (e) { 
        showNotification('❌ ' + (e.message || 'Ошибка'), 'error') 
      } finally { 
        isVerifying.value = false 
      }
    }

    const toggleAmenity = (id) => {
      const idx = offerForm.amenities.indexOf(id)
      if (idx > -1) {
        offerForm.amenities.splice(idx, 1)
      } else {
        offerForm.amenities.push(id)
      }
    }

    const getStatusText = (s) => {
      const statuses = { 
        active: t('business_offer_active'), 
        paused: t('business_offer_paused') 
      }
      return statuses[s] || s
    }
    
    const submitOffer = async () => {
      if (!canSubmitOffer.value || isSubmitting.value) return
      
      isSubmitting.value = true
      try {
        const data = { 
          ...offerForm, 
          coordinates: [offerForm.lat, offerForm.lng],
          inn: authStore.user?.inn || null
        }
        
        if (editingOffer.value) {
          await businessStore.updateOffer(editingOffer.value.id, data)
          showNotification('✅ Объявление обновлено', 'success')
        } else {
          await businessStore.createOffer(data)
          showNotification('🎉 Объявление опубликовано!', 'success')
        }
        
        resetForm()
        currentStep.value = 'dashboard'
        activeTab.value = 'offers'
      } catch (e) { 
        showNotification('❌ ' + (e.message || 'Ошибка'), 'error') 
      } finally {
        isSubmitting.value = false
      }
    }

    const editOffer = (o) => { 
      editingOffer.value = o
      Object.assign(offerForm, {
        title: o.title || '',
        category: o.category || '',
        description: o.description || '',
        full_description: o.full_description || '',
        address: o.address || '',
        phone: o.phone || '',
        email: o.email || '',
        website: o.website || '',
        working_hours: o.working_hours || '',
        price_level: o.price_level || 'medium',
        amenities: o.amenities || [],
        lat: o.coordinates?.[0] || 55.751244,
        lng: o.coordinates?.[1] || 37.618423
      })
      activeTab.value = 'create' 
    }
    
    const cancelEdit = () => { 
      editingOffer.value = null
      resetForm()
      activeTab.value = 'offers' 
    }
    
    const handleToggleOfferStatus = async (id) => { 
      await businessStore.toggleOfferStatus(id)
      showNotification('✅ Статус изменен', 'success') 
    }
    
    const handleDeleteOffer = async (id) => {
      if (confirm('Удалить объявление?')) {
        await businessStore.deleteOffer(id)
        showNotification('✅ Объявление удалено', 'success')
      }
    }
    
    const resetForm = () => { 
      editingOffer.value = null
      Object.assign(offerForm, { 
        title: '', 
        category: '', 
        description: '',
        full_description: '',
        address: '', 
        phone: '', 
        email: '',
        website: '',
        working_hours: '',
        amenities: [],
        lat: 55.751244, 
        lng: 37.618423 
      }) 
    }
    
    // Определяем начальный шаг
    watch(() => authStore.isBusinessOwner, (isBusiness) => {
      if (isBusiness) {
        currentStep.value = 'dashboard'
        businessStore.loadUserOffers()
      } else {
        currentStep.value = 'verification'
      }
    }, { immediate: true })

    onMounted(() => {
      loadCategories()
    })

    return { 
      authStore, businessStore, isLoading, activeTab, editingOffer, verificationMethod, 
      isVerifying, isSubmitting, innVerificationResult, innError, innForm, manualForm, offerForm, 
      userOffers, businessInfo, businessStats, isValidINN, isValidManualForm, canSubmitOffer, 
      categories, amenitiesList, currentStep, getINNPlaceholder,
      closePanel, handleBack, initAuth, validateINN, verifyByINN, verifyManually, 
      submitOffer, editOffer, cancelEdit, handleToggleOfferStatus, handleDeleteOffer, 
      getStatusText, toggleAmenity, t 
    }
  }
}
</script>

<style scoped>
.verification-section, .create-offer-section { padding: 0; }

/* Steps indicator */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #141414;
  border-radius: 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: #2a2a2a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.step.active .step-num {
  background: #ff6b00;
  color: #fff;
}

.step.completed .step-num {
  background: #22c55e;
  color: #fff;
}

.step-label {
  font-size: 11px;
  color: #666;
}

.step.active .step-label,
.step.completed .step-label {
  color: #fff;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #2a2a2a;
  margin: 0 8px;
}

.step-line.active {
  background: #ff6b00;
}

/* Success banner */
.success-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  margin-bottom: 16px;
}

.success-icon {
  font-size: 32px;
}

.success-banner strong {
  color: #22c55e;
  display: block;
  margin-bottom: 2px;
}

.success-banner p {
  margin: 0;
  font-size: 13px;
  color: #888;
}

/* Hero card */
.hero-card {
  text-align: center;
  padding: 32px 20px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-radius: 20px;
  margin-bottom: 20px;
}
.hero-icon { font-size: 48px; margin-bottom: 12px; }
.hero-card h3 { margin: 0 0 8px; font-size: 22px; color: #fff; }
.hero-card p { margin: 0; opacity: 0.9; color: #fff; }

/* Tabs */
.verification-tabs, .tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.tab-btn {
  flex: 1;
  padding: 12px 16px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  color: #888;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #ff6b00;
  border-color: #ff6b00;
  color: #fff;
}
.tab-btn:hover:not(.active) { background: #1a1a1a; color: #fff; }

/* Form */
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: #888; font-weight: 500; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 12px 14px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #ff6b00;
}
.form-group textarea { resize: vertical; min-height: 80px; }
.field-error { display: block; margin-top: 4px; color: #ff4444; font-size: 12px; }
.field-hint { display: block; margin-top: 4px; color: #666; font-size: 12px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* Category grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover { background: #1a1a1a; }
.category-btn.active { background: #ff6b00; border-color: #ff6b00; }
.category-btn.active .cat-name { color: #fff; }
.cat-icon { font-size: 20px; }
.cat-name { font-size: 10px; color: #888; text-align: center; }

/* Amenities grid */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.amenity-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.amenity-btn:hover { background: #1a1a1a; color: #fff; }
.amenity-btn.active { background: #ff6b00; border-color: #ff6b00; color: #fff; }

/* Social buttons */
.social-btns { display: flex; gap: 8px; }

/* Country buttons */
.country-btns {
  display: flex;
  gap: 8px;
}

.country-btn {
  flex: 1;
  padding: 10px 8px;
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.country-btn:hover { 
  background: #1a1a1a; 
  color: #fff; 
}

.country-btn.active { 
  background: #ff6b00; 
  border-color: #ff6b00; 
  color: #fff; 
}

/* CIS hint */
.cis-hint {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 107, 0, 0.1);
  border: 1px solid rgba(255, 107, 0, 0.2);
  border-radius: 10px;
}

.cis-hint p {
  margin: 0;
  font-size: 12px;
  color: #888;
  text-align: center;
}

.cis-hint strong {
  color: #ff6b00;
}
.social-btn {
  flex: 1;
  padding: 10px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.social-btn.active { background: #ff6b00; border-color: #ff6b00; color: #fff; }

/* Result card */
.result-card {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
}
.result-card.success { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); }
.result-success, .result-error { display: flex; align-items: flex-start; gap: 12px; }
.result-icon { font-size: 24px; }
.result-success strong { color: #22c55e; display: block; margin-bottom: 4px; }
.result-success p, .result-error p { margin: 2px 0; color: #888; font-size: 13px; }

/* Benefits */
.benefits-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 16px;
}
.benefit-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #2a2a2a; }
.benefit-item:last-child { border-bottom: none; }
.benefit-icon { font-size: 24px; }
.benefit-item strong { color: #fff; font-size: 14px; }
.benefit-item p { margin: 2px 0 0; color: #666; font-size: 12px; }

/* Welcome card */
.welcome-card {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 16px;
  color: #fff;
}
.verified-badge { display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; margin-bottom: 8px; }
.welcome-card h3 { margin: 0; font-size: 18px; }
.welcome-card p { margin: 4px 0 0; font-size: 13px; opacity: 0.9; }

/* Metrics */
.metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
.metric-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
}
.metric-card.orange { border-color: rgba(255, 107, 0, 0.3); }
.metric-icon { font-size: 20px; }
.metric-value { font-size: 24px; font-weight: 700; color: #fff; margin: 4px 0; }
.metric-label { font-size: 12px; color: #666; }

/* Quick actions */
.quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover { background: #1a1a1a; color: #fff; border-color: #ff6b00; }
.action-btn span { font-size: 20px; }

/* Offers list */
.offers-list { display: flex; flex-direction: column; gap: 12px; }
.offer-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
}
.offer-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.offer-header h4 { margin: 0; font-size: 15px; color: #fff; }
.offer-status { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
.offer-status.active { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.offer-status.paused { background: rgba(255, 165, 0, 0.15); color: #ffa500; }
.offer-desc { margin: 0 0 12px; font-size: 13px; color: #666; }
.offer-stats { display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #888; }
.offer-actions { display: flex; gap: 8px; }

/* Form actions */
.form-actions { display: flex; gap: 12px; margin-top: 20px; }
.form-actions .btn { flex: 1; }

/* Section card */
.section-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.section-title { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.section-description { font-size: 13px; color: #666; margin: 0 0 16px; }

/* Buttons */
.btn-danger { 
  background: linear-gradient(135deg, #ff4444 0%, #cc3333 100%) !important; 
  color: #fff !important; 
}
.btn-orange {
  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%) !important;
  color: #fff !important;
}
</style>
