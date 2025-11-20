<template>
  <div class="side-panel profile-panel">
    <!-- Заголовок -->
    <div class="panel-header">
      <h2>👤 Мой профиль</h2>
      <button class="close-btn" @click="closePanel">✕</button>
    </div>

    <div class="panel-content">
      <!-- Содержимое профиля без изменений -->
      <!-- ... существующий код ProfileModal.vue ... -->
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export default {
  name: 'ProfilePanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const businessStore = useBusinessStore()
    
    const { user, telegramAuthData } = storeToRefs(authStore)
    const { getBusinessStats } = storeToRefs(businessStore)

    const { closePanel, showNotification } = uiStore
    const { logout } = authStore

    const businessStats = computed(() => getBusinessStats.value)

    // ... остальные методы без изменений

    return {
      // ... существующие возвращаемые значения
      closePanel
    }
  }
}
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl);
  z-index: 2001;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
}

.panel-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .side-panel {
    width: 320px;
  }
}

@media (max-width: 480px) {
  .side-panel {
    width: 280px;
  }
}
</style>
