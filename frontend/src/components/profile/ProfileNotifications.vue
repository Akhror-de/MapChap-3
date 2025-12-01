<template>
  <div class="profile-notifications">
    <div class="tab-content">
      <h2 class="tab-title">Настройки уведомлений</h2>
      <p class="tab-description">
        Управляйте тем, какие уведомления вы хотите получать
      </p>

      <div class="notifications-list">
        <!-- Email уведомления -->
        <div class="notification-category">
          <h3 class="category-title">📧 Email уведомления</h3>
          
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Уведомления по email</h4>
              <p class="notification-description">
                Получать важные уведомления на ваш email
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.email"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Push уведомления -->
        <div class="notification-category">
          <h3 class="category-title">🔔 Push уведомления</h3>
          
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Новости и обновления</h4>
              <p class="notification-description">
                Будьте в курсе новых функций и обновлений платформы
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.news"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Акции и предложения</h4>
              <p class="notification-description">
                Специальные предложения и рекламные акции
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.promotions"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Уведомления активности -->
        <div class="notification-category">
          <h3 class="category-title">📱 Уведомления активности</h3>
          
          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Новые комментарии</h4>
              <p class="notification-description">
                Уведомления о новых комментариях к вашим отзывам
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.comments"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Лайки и реакции</h4>
              <p class="notification-description">
                Уведомления о лайках и реакциях на ваш контент
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.likes"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="notification-item">
            <div class="notification-info">
              <h4 class="notification-title">Новые подписчики</h4>
              <p class="notification-description">
                Уведомления о новых подписчиках
              </p>
            </div>
            <div class="notification-toggle">
              <label class="toggle">
                <input
                  type="checkbox"
                  v-model="notifications.followers"
                  @change="handleChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Сохранение настроек -->
      <div class="notifications-actions">
        <button class="btn btn-primary" @click="saveSettings" :disabled="!hasChanges">
          Сохранить настройки
        </button>
        <button class="btn btn-secondary" @click="resetSettings" :disabled="!hasChanges">
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  notifications: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:notifications', 'update'])

// Локальная копия для отслеживания изменений
const localNotifications = ref({ ...props.notifications })
const hasChanges = ref(false)

const handleChange = () => {
  hasChanges.value = true
  emit('update')
}

const saveSettings = () => {
  emit('update:notifications', { ...localNotifications.value })
  hasChanges.value = false
  // Здесь обычно API вызов для сохранения настроек
}

const resetSettings = () => {
  localNotifications.value = { ...props.notifications }
  hasChanges.value = false
}

// Следим за изменениями props
watch(() => props.notifications, (newNotifications) => {
  localNotifications.value = { ...newNotifications }
  hasChanges.value = false
}, { deep: true })
</script>

<style scoped>
.profile-notifications {
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

.notifications-list {
  max-width: 600px;
}

.notification-category {
  margin-bottom: 40px;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.notification-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-info {
  flex: 1;
  margin-right: 20px;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.notification-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d1d5db;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px #3b82f6;
}

/* Кнопки действий */
.notifications-actions {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
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

@media (max-width: 768px) {
  .profile-notifications {
    padding: 20px;
  }
  
  .notification-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .notification-info {
    margin-right: 0;
  }
  
  .notifications-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
