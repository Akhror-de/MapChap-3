<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content blog-modal" @click.stop>
      <!-- Заголовок -->
      <div class="modal-header">
        <h2>📝 Блог MapChap</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Вкладки -->
      <div class="tabs">
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'developers' }"
          @click="activeTab = 'developers'"
        >
          👨‍💼 От разработчиков
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          👥 От пользователей
        </button>
      </div>

      <!-- Содержимое вкладок -->
      <div class="tab-content">
        <!-- Статьи разработчиков -->
        <div v-if="activeTab === 'developers'" class="articles-list">
          <div class="article-card">
            <div class="article-header">
              <div class="article-author">
                <div class="author-avatar">👨‍💼</div>
                <div class="author-info">
                  <strong>Ахрор Хабибуллаев</strong>
                  <span class="article-date">15 января 2024</span>
                </div>
              </div>
            </div>
            
            <h3 class="article-title">MapChap v3.0: Новая эра бизнес-карт</h3>
            <p class="article-excerpt">Рассказываем о главных обновлениях новой версии платформы и наших планах на будущее.</p>
            
            <button class="btn btn-primary">
              Читать полностью
            </button>
          </div>
        </div>

        <!-- Статьи пользователей -->
        <div v-if="activeTab === 'users'" class="articles-list">
          <div class="empty-state">
            <p>Пока нет статей от пользователей</p>
            <p>Будьте первым, кто поделится своим опытом!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

export default {
  name: 'BlogModal',
  setup() {
    const uiStore = useUIStore()
    const { activeModal } = storeToRefs(uiStore)
    const { closeModal } = uiStore

    const isOpen = computed(() => activeModal.value === 'blog')
    const activeTab = ref('developers')

    return {
      isOpen,
      activeTab,
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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 10000;
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-xl);
  z-index: 10001;
}

.blog-modal {
  max-width: 900px;
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

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.article-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  margin-bottom: 0.25rem;
}

.article-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.article-title {
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .blog-modal {
    width: 95%;
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
