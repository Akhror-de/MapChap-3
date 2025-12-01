<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Несохраненные изменения</h3>
        </div>
        
        <div class="modal-content">
          <div class="warning-icon">⚠️</div>
          <p>У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?</p>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="handleCancel">
            Отмена
          </button>
          <button class="btn btn-danger" @click="handleConfirm">
            Покинуть страницу
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  handleCancel()
}

// Закрытие по ESC
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
}

.modal-header {
  padding: 24px 24px 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-content {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.modal-content p {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Анимации */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
