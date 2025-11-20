<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content business-modal" @click.stop>
      <!-- ... существующий код модалки ... -->
    </div>
  </div>
</template>

<style scoped>
/* Увеличиваем z-index для модальных окон */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 10000; /* УВЕЛИЧИЛИ ДО 10000 */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--glass-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-xl);
  z-index: 10001; /* УВЕЛИЧИЛИ ДО 10001 */
}

/* Остальные стили остаются прежними */
.business-modal {
  max-width: 800px;
  max-height: 90vh;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding: 0 1.5rem;
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.tab-btn.active {
  border-bottom-color: var(--accent-color);
  color: var(--accent-color);
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

.tab-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
}

/* Стили для формы */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary);
  color: var(--text-primary);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .business-modal {
    width: 95%;
  }
  
  .tabs {
    flex-direction: column;
    padding: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
