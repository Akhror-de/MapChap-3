<template>
  <div class="side-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
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
      <div v-if="businessStore.isLoading" class="loading-state">
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

      <!-- Верификация -->
      <div v-else-if="!authStore.isBusinessOwner" class="verification-section">
        <!-- Хедер -->
        <div class="hero-card">
          <div class="hero-icon">🚀</div>
          <h3>{{ t('business_become_partner') }}</h3>
          <p>{{ t('business_partner_desc') }}</p>
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
          <p class="section-description">{{ t('business_inn_desc') }}</p>
          
          <div class="form-group">
            <label>{{ t('business_inn_label') }}</label>
            <input 
              v-model="innForm.inn"
              type="text" 
              :placeholder="t('business_inn_placeholder')"
              maxlength="12"
              @input="validateINN"
            >
            <span v-if="innError" class="field-error">{{ innError }}</span>
          </div>

          <div v-if="innVerificationResult" class="result-card" :class="{ success: innVerificationResult.success }">
            <div v-if="innVerificationResult.success" class="result-success">
              <span class="result-icon">✅</span>
              <div>
                <strong>{{ innVerificationResult.verification.name }}</strong>
                <p>ИНН: {{ innVerificationResult.verification.inn }}</p>
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
        </div>

        <!-- Ручная форма -->
        <div v-if="verificationMethod === 'manual'" class="section-card">
          <div class="section-title">{{ t('business_manual_verification') }}</div>
          
          <div class="form-group">
            <label>{{ t('business_company_name') }}</label>
            <input v-model="manualForm.company_name" type="text" placeholder="ООО 'Ваша компания'">
          </div>

          <div class="form-group">
            <label>{{ t('business_phone') }}</label>
            <input v-model="manualForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
          </div>

          <div class="form-group">
            <label>{{ t('business_email') }}</label>
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

      <!-- Бизнес контент -->
      <div v-else class="business-content">
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
              <label>{{ t('business_offer_title') }} *</label>
              <input v-model="offerForm.title" type="text" :placeholder="t('business_offer_title')">
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_category') }} *</label>
              <select v-model="offerForm.category">
                <option value="">{{ t('business_offer_select') }}</option>
                <option v-for="cat in businessStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_desc') }} *</label>
              <textarea v-model="offerForm.description" rows="4" :placeholder="t('business_offer_desc')"></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('business_offer_address') }} *</label>
              <input v-model="offerForm.address" type="text" placeholder="Город, улица, дом">
            </div>

            <div class="form-group">
              <label>{{ t('business_phone') }} *</label>
              <input v-model="offerForm.phone" type="tel" placeholder="+7 (999) 123-45-67">
            </div>
            
            <div class="form-group">
              <label>{{ t('business_email') }}</label>
              <input v-model="offerForm.email" type="email" placeholder="email@company.com">
            </div>

            <div class="form-group">
              <label>Часы работы</label>
              <input v-model="offerForm.working_hours" type="text" placeholder="Пн-Пт: 9:00-18:00">
            </div>

            <div class="form-actions">
              <button v-if="editingOffer" class="btn btn-secondary" @click="cancelEdit">{{ t('cancel') }}</button>
              <button class="btn btn-primary" :class="{ 'btn-block': !editingOffer }" @click="submitOffer" :disabled="!canSubmit || isSubmitting">
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

    const activeTab = ref('overview')
    const editingOffer = ref(null)
    const verificationMethod = ref('inn')
    const isVerifying = ref(false)
    const isSubmitting = ref(false)
    const innVerificationResult = ref(null)
    const innError = ref('')

    const innForm = reactive({ inn: '' })
    const manualForm = reactive({ company_name: '', phone: '', email: '', social_type: 'telegram', social_username: '' })
    const offerForm = reactive({ 
      title: '', 
      category: '', 
      description: '', 
      address: '', 
      phone: '', 
      email: '',
      working_hours: '',
      lat: 55.751244, 
      lng: 37.618423 
    })

    const userOffers = computed(() => getUserOffers.value)
    const businessInfo = computed(() => ({ companyName: authStore.user?.company_name || authStore.user?.first_name || 'Бизнес' }))
    
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
      return inn.length === 10 || inn.length === 12 
    })
    
    const isValidManualForm = computed(() => 
      manualForm.company_name.length >= 2 && 
      manualForm.phone.length >= 10 && 
      manualForm.email.includes('@') && 
      manualForm.social_username.length >= 2
    )
    
    const canSubmit = computed(() => 
      offerForm.title && 
      offerForm.category && 
      offerForm.description && 
      offerForm.address && 
      offerForm.phone
    )

    const initAuth = () => authStore.initTelegramAuth()
    
    const validateINN = () => { 
      innForm.inn = innForm.inn.replace(/\D/g, '')
      innError.value = innForm.inn.length > 0 && !isValidINN.value ? 'ИНН: 10 или 12 цифр' : ''
      innVerificationResult.value = null 
    }
    
    const verifyByINN = async () => {
      if (!isValidINN.value) return
      isVerifying.value = true
      try {
        const result = await apiService.verifyByINN(authStore.user.telegram_id, innForm.inn)
        innVerificationResult.value = result
        if (result.success) {
          await authStore.registerAsBusiness({ companyName: result.verification.name, inn: innForm.inn, verificationType: 'inn' })
          showNotification(t('notif_verified'), 'success')
        }
      } catch (e) {
        innVerificationResult.value = { success: false, error: e.message }
        showNotification(e.message, 'error')
      } finally { 
        isVerifying.value = false 
      }
    }

    const verifyManually = async () => {
      if (!isValidManualForm.value) return
      isVerifying.value = true
      try {
        await apiService.verifyManually(authStore.user.telegram_id, manualForm)
        await authStore.registerAsBusiness({ companyName: manualForm.company_name, verificationType: 'manual' })
        showNotification(t('notif_activated'), 'success')
      } catch (e) { 
        showNotification(e.message, 'error') 
      } finally { 
        isVerifying.value = false 
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
      if (!canSubmit.value || isSubmitting.value) return
      
      isSubmitting.value = true
      try {
        const data = { 
          ...offerForm, 
          coordinates: [offerForm.lat, offerForm.lng] 
        }
        
        if (editingOffer.value) {
          await businessStore.updateOffer(editingOffer.value.id, data)
          showNotification(t('notif_saved'), 'success')
        } else {
          await businessStore.createOffer(data)
          showNotification(t('notif_published'), 'success')
        }
        
        resetForm()
        activeTab.value = 'offers'
      } catch (e) { 
        showNotification(t('error'), 'error') 
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
        address: o.address || '',
        phone: o.phone || '',
        email: o.email || '',
        working_hours: o.working_hours || '',
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
      showNotification(t('notif_status_changed'), 'success') 
    }
    
    const handleDeleteOffer = async (id) => {
      if (confirm('Удалить объявление?')) {
        await businessStore.deleteOffer(id)
        showNotification(t('notif_removed'), 'success')
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
        email: '',
        working_hours: '',
        lat: 55.751244, 
        lng: 37.618423 
      }) 
    }
    
    // Загружаем объявления при входе
    watch(() => authStore.isBusinessOwner, (isBusiness) => {
      if (isBusiness) {
        businessStore.loadUserOffers()
      }
    }, { immediate: true })

    return { 
      authStore, businessStore, activeTab, editingOffer, verificationMethod, 
      isVerifying, isSubmitting, innVerificationResult, innError, innForm, manualForm, offerForm, 
      userOffers, businessInfo, businessStats, isValidINN, isValidManualForm, canSubmit, 
      closePanel, initAuth, validateINN, verifyByINN, verifyManually, submitOffer, 
      editOffer, cancelEdit, handleToggleOfferStatus, handleDeleteOffer, getStatusText, t 
    }
  }
}
</script>

<style scoped>
.verification-section { padding: 0; }

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

.field-error { display: block; margin-top: 4px; color: #ff4444; font-size: 12px; }

.social-btns { display: flex; gap: 8px; }
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

.result-card {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
}
.result-card.success { background: rgba(255, 107, 0, 0.1); border-color: rgba(255, 107, 0, 0.3); }
.result-success, .result-error { display: flex; align-items: flex-start; gap: 12px; }
.result-icon { font-size: 24px; }
.result-success strong { color: #ff6b00; }
.result-success p, .result-error p { margin: 4px 0 0; color: #888; font-size: 13px; }

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

.welcome-card {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 16px;
  color: #fff;
}
.verified-badge { display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; margin-bottom: 8px; }
.welcome-card h3 { margin: 0; font-size: 18px; }

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
.offer-status.active { background: rgba(255, 107, 0, 0.15); color: #ff6b00; }
.offer-status.paused { background: rgba(255, 165, 0, 0.15); color: #ffa500; }
.offer-desc { margin: 0 0 12px; font-size: 13px; color: #666; }
.offer-stats { display: flex; gap: 16px; margin-bottom: 12px; font-size: 13px; color: #888; }
.offer-actions { display: flex; gap: 8px; }

.form-actions { display: flex; gap: 12px; margin-top: 20px; }
.form-actions .btn { flex: 1; }

.section-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.section-title { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.section-description { font-size: 13px; color: #666; margin: 0 0 16px; }

.btn-danger { 
  background: linear-gradient(135deg, #ff4444 0%, #cc3333 100%) !important; 
  color: #fff !important; 
}
</style>
