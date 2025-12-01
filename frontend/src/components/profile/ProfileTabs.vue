<template>
  <div class="profile-tabs">
    <nav class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id, 'has-changes': hasUnsavedChanges && tab.id === 'edit' }"
        @click="changeTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="hasUnsavedChanges && tab.id === 'edit'" class="unsaved-dot"></span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  hasUnsavedChanges: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:activeTab'])

const tabs = [
  { id: 'edit', label: 'Профиль', icon: '👤' },
  { id: 'stats', label: 'Статистика', icon: '📊' },
  { id: 'favorites', label: 'Избранное', icon: '⭐' },
  { id: 'notifications', label: 'Уведомления', icon: '🔔' },
  { id: 'security', label: 'Безопасность', icon: '🔒' }
]

const changeTab = (tabId) => {
  emit('update:activeTab', tabId)
}
</script>

<style scoped>
.profile-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  overflow: hidden;
}

.tabs-nav {
  display: flex;
  padding: 0 20px;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.tab-button:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-icon {
  font-size: 1.1rem;
}

.tab-label {
  font-weight: 500;
}

.unsaved-dot {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  margin-left: 4px;
}

@media (max-width: 768px) {
  .tabs-nav {
    padding: 0 10px;
  }
  
  .tab-button {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
  
  .tab-label {
    display: none;
  }
}
</style>
