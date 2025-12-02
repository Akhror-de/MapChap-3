<template>
  <div v-if="show" class="error-message" :class="type">
    <div class="icon-container">
      <span class="icon">{{ icon }}</span>
    </div>
    <div class="content">
      <h4 v-if="title" class="title">{{ title }}</h4>
      <p class="message">{{ message }}</p>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
    <button v-if="dismissible" class="close-btn" @click="$emit('dismiss')">
      <span class="close-icon">×</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const icon = computed(() => {
  switch (props.type) {
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    case 'success': return '✅'
    default: return '❌'
  }
})
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  animation: slideIn 0.3s ease;
}

.error-message.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.error-message.warning {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  color: #d97706;
}

.error-message.info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
}

.error-message.success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.icon-container {
  flex-shrink: 0;
  margin-top: 2px;
}

.icon {
  font-size: 1.25rem;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 0.95rem;
}

.message {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.close-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: inherit;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
