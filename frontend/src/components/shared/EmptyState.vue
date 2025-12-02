<template>
  <div class="empty-state">
    <div class="icon-container">
      <span class="icon">{{ icon }}</span>
    </div>
    <div class="content">
      <h3 class="title">{{ title }}</h3>
      <p v-if="description" class="description">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📭'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  border-radius: 12px;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
}

.icon-container {
  margin-bottom: 16px;
}

.icon {
  font-size: 3.5rem;
  opacity: 0.8;
}

.content {
  max-width: 400px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .empty-state {
    padding: 32px 16px;
  }
  
  .icon {
    font-size: 2.5rem;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
  }
  
  .actions :deep(button) {
    width: 100%;
  }
}
</style>
