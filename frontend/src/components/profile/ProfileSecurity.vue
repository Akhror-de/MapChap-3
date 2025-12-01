<template>
  <div class="profile-security">
    <div class="tab-content">
      <h2 class="tab-title">Безопасность</h2>
      <p class="tab-description">
        Управление настройками безопасности вашего аккаунта
      </p>

      <!-- Смена пароля -->
      <div class="security-section">
        <h3 class="section-title">🔒 Смена пароля</h3>
        
        <form @submit.prevent="handlePasswordChange" class="password-form">
          <div class="form-group">
            <label for="currentPassword" class="form-label">Текущий пароль</label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ error: passwordErrors.currentPassword }"
              placeholder="Введите текущий пароль"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <span class="icon">{{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
            <div v-if="passwordErrors.currentPassword" class="error-message">
              {{ passwordErrors.currentPassword }}
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword" class="form-label">Новый пароль</label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ error: passwordErrors.newPassword }"
              placeholder="Введите новый пароль"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showNewPassword = !showNewPassword"
            >
              <span class="icon">{{ showNewPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
            <div v-if="passwordErrors.newPassword" class="error-message">
              {{ passwordErrors.newPassword }}
            </div>
            <div class="password-strength">
              <div class="strength-bar" :class="passwordStrengthClass"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ error: passwordErrors.confirmPassword }"
              placeholder="Повторите новый пароль"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
            <div v-if="passwordErrors.confirmPassword" class="error-message">
              {{ passwordErrors.confirmPassword }}
            </div>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isPasswordFormValid || isChangingPassword"
            >
              <span v-if="isChangingPassword" class="loading-spinner"></span>
              {{ isChangingPassword ? 'Смена пароля...' : 'Сменить пароль' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Сессии -->
      <div class="security-section">
        <h3 class="section-title">🌐 Активные сессии</h3>
        
        <div class="sessions-list">
          <div class="session-item" v-for="session in activeSessions" :key="session.id">
            <div class="session-info">
              <div class="session-device">
                <span class="device-icon">{{ session.deviceIcon }}</span>
                <div class="device-details">
                  <div class="device-name">{{ session.deviceName }}</div>
                  <div class="session-location">{{ session.location }}</div>
                </div>
              </div>
              <div class="session-meta">
                <div class="session-ip">IP: {{ session.ipAddress }}</div>
                <div class="session-time">Вход: {{ formatSessionTime(session.lastActive) }}</div>
              </div>
            </div>
            <div class="session-actions">
              <button
                v-if="!session.isCurrent"
                class="btn btn-danger btn-sm"
                @click="terminateSession(session.id)"
              >
                Завершить
              </button>
              <span v-else class="current-badge">Текущая</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Двухфакторная аутентификация -->
      <div class="security-section">
        <h3 class="section-title">🔐 Двухфакторная аутентификация</h3>
        
        <div class="two-factor-settings">
          <div class="two-factor-info">
            <p>Добавьте дополнительный уровень безопасности к вашему аккаунту</p>
            <div class="two-factor-status">
              <span class="status-badge" :class="twoFactorEnabled ? 'enabled' : 'disabled'">
                {{ twoFactorEnabled ? 'Включено' : 'Выключено' }}
              </span>
            </div>
          </div>
          <button
            class="btn btn-secondary"
            @click="toggleTwoFactor"
          >
            {{ twoFactorEnabled ? 'Выключить' : 'Включить' }} 2FA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const emit = defineEmits(['password-change'])

// Состояние формы смены пароля
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isChangingPassword = ref(false)

// Активные сессии
const activeSessions = ref([
  {
    id: 1,
    deviceName: 'Chrome на Windows',
    deviceIcon: '💻',
    location: 'Москва, Россия',
    ipAddress: '192.168.1.1',
    lastActive: new Date().toISOString(),
    isCurrent: true
  },
  {
    id: 2,
    deviceName: 'Safari на iPhone',
    deviceIcon: '📱',
    location: 'Санкт-Петербург, Россия',
    ipAddress: '192.168.1.2',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isCurrent: false
  }
])

// Двухфакторная аутентификация
const twoFactorEnabled = ref(false)

// Валидация пароля
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1
  
  return strength
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'Слабый'
  if (strength <= 4) return 'Средний'
  return 'Сильный'
})

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword &&
         passwordForm.newPassword &&
         passwordForm.confirmPassword &&
         passwordForm.newPassword === passwordForm.confirmPassword &&
         passwordStrength.value >= 3 &&
         !passwordErrors.currentPassword
})

// Обработчики
const handlePasswordChange = async () => {
  if (!isPasswordFormValid.value) return

  isChangingPassword.value = true
  try {
    await emit('password-change', { ...passwordForm })
    
    // Сброс формы
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    Object.keys(passwordErrors).forEach(key => {
      passwordErrors[key] = ''
    })
  } catch (error) {
    console.error('Password change error:', error)
  } finally {
    isChangingPassword.value = false
  }
}

const terminateSession = (sessionId) => {
  activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId)
}

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  // Здесь обычно API вызов для изменения настроек 2FA
}

const formatSessionTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Валидация в реальном времени
watch(() => passwordForm.newPassword, (newPassword) => {
  if (newPassword && newPassword.length < 6) {
    passwordErrors.newPassword = 'Пароль должен содержать минимум 6 символов'
  } else {
    passwordErrors.newPassword = ''
  }
})

watch(() => passwordForm.confirmPassword, (confirmPassword) => {
  if (confirmPassword && confirmPassword !== passwordForm.newPassword) {
    passwordErrors.confirmPassword = 'Пароли не совпадают'
  } else {
    passwordErrors.confirmPassword = ''
  }
})
</script>

<style scoped>
.profile-security {
  padding: 40px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.tab-description {
  color: #6b7280;
  margin: 0 0 40px 0;
}

.security-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.security-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
}

/* Форма смены пароля */
.password-form {
  max-width: 400px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 45px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 38px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Индикатор силы пароля */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.strength-bar.weak {
  background: #ef4444;
  width: 33%;
}

.strength-bar.medium {
  background: #f59e0b;
  width: 66%;
}

.strength-bar.strong {
  background: #10b981;
  width: 100%;
}

.strength-text {
  font-size: 0.8rem;
  color: #6b7280;
}

/* Активные сессии */
.sessions-list {
  space-y: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.session-device {
  display: flex;
  align-items: center;
  gap: 10px;
}

.device-icon {
  font-size: 1.5rem;
}

.device-details {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-weight: 600;
  color: #1f2937;
}

.session-location {
  font-size: 0.9rem;
  color: #6b7280;
}

.session-meta {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  color: #9ca3af;
}

.session-actions .btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.session-actions .btn-danger:hover {
  background: #dc2626;
}

.current-badge {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Двухфакторная аутентификация */
.two-factor-settings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.two-factor-info p {
  margin: 0 0 8px 0;
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.enabled {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.disabled {
  background: #fef3c7;
  color: #92400e;
}

/* Кнопки */
.form-actions {
  margin-top: 24px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-security {
    padding: 20px;
  }
  
  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .session-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .two-factor-settings {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
