<template>
  <div class="loading-spinner" :class="[size, variant, { 'with-text': text }]">
    <div class="spinner"></div>
    <span v-if="text" class="text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white', 'danger'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border-style: solid;
}

/* Размеры */
.loading-spinner.small .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner.medium .spinner {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

.loading-spinner.large .spinner {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.loading-spinner.xl .spinner {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

/* Варианты цветов */
.loading-spinner.primary .spinner {
  border-color: #3b82f6 transparent transparent transparent;
}

.loading-spinner.secondary .spinner {
  border-color: #6b7280 transparent transparent transparent;
}

.loading-spinner.white .spinner {
  border-color: #ffffff transparent transparent transparent;
}

.loading-spinner.danger .spinner {
  border-color: #ef4444 transparent transparent transparent;
}

/* Текст */
.text {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #6b7280;
}

.loading-spinner.primary .text {
  color: #3b82f6;
}

.loading-spinner.secondary .text {
  color: #6b7280;
}

.loading-spinner.white .text {
  color: #ffffff;
}

.loading-spinner.danger .text {
  color: #ef4444;
}

/* Анимация */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
