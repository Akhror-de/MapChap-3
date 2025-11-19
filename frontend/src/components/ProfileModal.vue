<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Заголовок -->
      <div class="modal-header">
        <h2>👤 Мой профиль</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Информация профиля -->
      <div class="profile-section">
        <div class="avatar-large">
          {{ user.avatar }}
        </div>
        <h3 class="user-name">{{ user.name }}</h3>
        <p class="user-email">khabibullaevakhrorjon@gmail.com</p>
      </div>

      <!-- Любимые категории -->
      <div class="section">
        <h4>❤️ Любимые категории</h4>
        <div class="categories-list">
          <span 
            v-for="category in user.favoriteCategories" 
            :key="category"
            class="category-tag"
          >
            {{ category }}
          </span>
        </div>
      </div>

      <!-- Избранные -->
      <div class="section">
        <h4>⭐ Избранные объявления</h4>
        <div class="favorites-list">
          <div 
            v-for="favorite in user.favorites" 
            :key="favorite"
            class="favorite-item"
          >
            <span class="favorite-icon">📍</span>
            <span class="favorite-text">{{ favorite }}</span>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="modal-actions">
        <button class="btn btn-primary">Редактировать профиль</button>
        <button class="btn btn-secondary">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'ProfileModal',
  setup() {
    const uiStore = useUIStore()
    const { activeModal, user } = storeToRefs(uiStore)
    const { closeModal } = uiStore

    const isOpen = computed(() => activeModal.value === 'profile')

    return {
      isOpen,
      user,
      closeModal
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
}

.profile-section {
  text-align: center;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.user-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.user-email {
  margin: 0;
  color: #666;
}

.section {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.favorite-item:hover {
  background: #e9ecef;
}

.favorite-icon {
  font-size: 1.2rem;
}

.favorite-text {
  flex: 1;
}

.modal-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
}
</style>
