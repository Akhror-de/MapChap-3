<template>
  <div class="boost-section">
    <!-- Заголовок -->
    <div class="boost-hero">
      <span class="boost-icon">🚀</span>
      <h3>{{ t('boost_title') }}</h3>
      <p>{{ t('boost_desc') }}</p>
    </div>

    <!-- Как это работает -->
    <div class="how-works">
      <h4>{{ t('boost_how_works') }}</h4>
      <div class="steps">
        <div class="step">
          <span class="step-icon">1️⃣</span>
          <strong>{{ t('boost_step1') }}</strong>
          <p>{{ t('boost_step1_desc') }}</p>
        </div>
        <div class="step">
          <span class="step-icon">2️⃣</span>
          <strong>{{ t('boost_step2') }}</strong>
          <p>{{ t('boost_step2_desc') }}</p>
        </div>
        <div class="step">
          <span class="step-icon">3️⃣</span>
          <strong>{{ t('boost_step3') }}</strong>
          <p>{{ t('boost_step3_desc') }}</p>
        </div>
      </div>
    </div>

    <!-- Тарифы бустов -->
    <div class="boost-plans">
      <div 
        class="boost-card"
        v-for="plan in boostPlans" 
        :key="plan.id"
        :class="{ popular: plan.popular, best: plan.best }"
        @click="selectPlan(plan)"
      >
        <div v-if="plan.popular" class="card-badge">{{ t('boost_popular') }}</div>
        <div v-if="plan.best" class="card-badge best">{{ t('boost_best') }}</div>
        
        <div class="card-header">
          <span class="card-icon">{{ plan.icon }}</span>
          <h4>{{ plan.days }} {{ plan.days === 1 ? t('day') : t('days') }}</h4>
        </div>
        
        <div class="card-price">
          <span v-if="plan.price" class="price">{{ plan.price }} {{ plan.currency }}</span>
          <span v-else class="price-coming">{{ t('boost_price_coming') }}</span>
        </div>
        
        <ul class="card-features">
          <li>✅ Push {{ t('profile_notifications') }}</li>
          <li>✅ {{ t('business_analytics') }}</li>
          <li v-if="plan.days >= 5">✅ {{ t('boost_popular') }} 🔥</li>
          <li v-if="plan.days >= 7">✅ VIP 👑</li>
        </ul>
        
        <button class="btn btn-primary btn-block" :disabled="!plan.price">
          {{ t('boost_buy') }}
        </button>
      </div>
    </div>

    <!-- Активные бусты -->
    <div class="active-boosts" v-if="activeBoosts.length > 0">
      <h4>{{ t('boost_active') }}</h4>
      <div class="active-list">
        <div v-for="boost in activeBoosts" :key="boost.id" class="active-card">
          <div class="active-info">
            <span class="active-icon">🚀</span>
            <div>
              <strong>{{ boost.days }} {{ t('days') }}</strong>
              <p>{{ t('boost_expires') }}: {{ formatDate(boost.expires_at) }}</p>
            </div>
          </div>
          <div class="active-stats">
            <span>📤 {{ boost.notifications_sent || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-boosts">
      <span>💤</span>
      <p>{{ t('boost_no_active') }}</p>
    </div>

    <!-- Настройка оплаты (для владельца) -->
    <div class="payment-setup" v-if="showPaymentSetup">
      <h4>💳 {{ t('boost_payment_setup') }}</h4>
      <p class="setup-desc">{{ t('boost_payment_desc') }}</p>
      
      <div class="form-group">
        <label>{{ t('boost_bank_account') }}</label>
        <input v-model="paymentDetails.account" type="text" placeholder="1234 5678 9012 3456">
      </div>
      
      <div class="form-group">
        <label>{{ t('boost_bank_name') }}</label>
        <input v-model="paymentDetails.bank" type="text" placeholder="Kapitalbank, Ipak Yuli...">
      </div>
      
      <div class="form-group">
        <label>{{ t('boost_holder_name') }}</label>
        <input v-model="paymentDetails.holder" type="text" placeholder="Имя владельца счёта">
      </div>
      
      <button class="btn btn-primary btn-block" @click="savePaymentDetails" :disabled="!canSavePayment">
        {{ t('boost_save_payment') }}
      </button>
      
      <div class="payment-note">
        <p>🇺🇿 Поддерживаются банки Узбекистана, Казахстана и других стран СНГ</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { useUIStore } from '../stores/uiStore'

export default {
  name: 'BoostPanel',
  props: {
    showPaymentSetup: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { t } = useLocale()
    const uiStore = useUIStore()
    
    // Тарифные планы (цены будут добавлены позже)
    const boostPlans = ref([
      { id: 'boost_1day', days: 1, icon: '⚡', price: null, currency: 'UZS', popular: false, best: false },
      { id: 'boost_5days', days: 5, icon: '🔥', price: null, currency: 'UZS', popular: true, best: false },
      { id: 'boost_7days', days: 7, icon: '👑', price: null, currency: 'UZS', popular: false, best: true }
    ])
    
    // Активные бусты пользователя
    const activeBoosts = ref([])
    
    // Детали оплаты
    const paymentDetails = reactive({
      account: '',
      bank: '',
      holder: ''
    })
    
    const canSavePayment = computed(() => {
      return paymentDetails.account.length >= 10 && 
             paymentDetails.bank.length >= 3 && 
             paymentDetails.holder.length >= 3
    })
    
    const selectPlan = (plan) => {
      if (!plan.price) {
        uiStore.showNotification(t('boost_price_coming'), 'info')
        return
      }
      // Тут будет логика покупки
      console.log('Selected plan:', plan)
    }
    
    const savePaymentDetails = () => {
      if (!canSavePayment.value) return
      
      // Сохраняем в localStorage
      localStorage.setItem('mapchap_payment', JSON.stringify(paymentDetails))
      uiStore.showNotification(t('notif_saved'), 'success')
    }
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString()
    }
    
    // Загружаем сохранённые данные оплаты
    const loadPaymentDetails = () => {
      const saved = localStorage.getItem('mapchap_payment')
      if (saved) {
        const data = JSON.parse(saved)
        Object.assign(paymentDetails, data)
      }
    }
    
    loadPaymentDetails()
    
    return {
      t,
      boostPlans,
      activeBoosts,
      paymentDetails,
      canSavePayment,
      selectPlan,
      savePaymentDetails,
      formatDate
    }
  }
}
</script>

<style scoped>
.boost-section {
  padding: 0;
}

.boost-hero {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-radius: 16px;
  margin-bottom: 16px;
}

.boost-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 8px;
}

.boost-hero h3 {
  margin: 0 0 4px;
  color: #fff;
  font-size: 20px;
}

.boost-hero p {
  margin: 0;
  color: rgba(255,255,255,0.9);
  font-size: 13px;
}

.how-works {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.how-works h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #fff;
}

.steps {
  display: flex;
  gap: 12px;
}

.step {
  flex: 1;
  text-align: center;
}

.step-icon {
  font-size: 20px;
  display: block;
  margin-bottom: 4px;
}

.step strong {
  display: block;
  font-size: 12px;
  color: #fff;
  margin-bottom: 2px;
}

.step p {
  margin: 0;
  font-size: 10px;
  color: #666;
}

.boost-plans {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.boost-card {
  flex: 1;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

.boost-card:hover {
  border-color: #ff6b00;
}

.boost-card.popular {
  border-color: #ff6b00;
}

.boost-card.best {
  border-color: #ffd700;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a1a 100%);
}

.card-badge {
  position: absolute;
  top: -8px;
  right: 10px;
  padding: 2px 8px;
  background: #ff6b00;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
  color: #fff;
}

.card-badge.best {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #000;
}

.card-header {
  text-align: center;
  margin-bottom: 12px;
}

.card-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 4px;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  color: #fff;
}

.card-price {
  text-align: center;
  margin-bottom: 12px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #ff6b00;
}

.price-coming {
  font-size: 12px;
  color: #666;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}

.card-features li {
  font-size: 11px;
  color: #888;
  margin-bottom: 4px;
}

.active-boosts h4,
.no-boosts {
  margin-bottom: 12px;
}

.active-boosts h4 {
  font-size: 14px;
  color: #fff;
}

.active-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.active-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 10px;
}

.active-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.active-icon {
  font-size: 24px;
}

.active-info strong {
  display: block;
  color: #22c55e;
  font-size: 14px;
}

.active-info p {
  margin: 0;
  font-size: 11px;
  color: #888;
}

.active-stats {
  font-size: 13px;
  color: #888;
}

.no-boosts {
  text-align: center;
  padding: 24px;
  background: #141414;
  border-radius: 14px;
}

.no-boosts span {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.no-boosts p {
  margin: 0;
  color: #666;
  font-size: 13px;
}

.payment-setup {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 16px;
  margin-top: 16px;
}

.payment-setup h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #fff;
}

.setup-desc {
  margin: 0 0 16px;
  font-size: 12px;
  color: #666;
}

.payment-note {
  margin-top: 12px;
  padding: 10px;
  background: rgba(255, 107, 0, 0.1);
  border-radius: 8px;
}

.payment-note p {
  margin: 0;
  font-size: 11px;
  color: #888;
  text-align: center;
}
</style>
