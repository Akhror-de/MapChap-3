<template>
  <div class="side-panel modern-panel">
    <!-- Заголовок -->
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          Блог MapChap
        </h2>
      </div>
    </div>

    <!-- Содержимое панели -->
    <div class="panel-content">
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
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
          v-if="isAuthenticated"
        >
          ✍️ Написать
        </button>
      </div>

      <!-- Содержимое вкладок -->
      <div class="tab-content">
        <!-- Статьи разработчиков -->
        <div v-if="activeTab === 'developers'" class="articles-list">
          <div 
            v-for="article in developerArticles" 
            :key="article.id"
            class="article-card"
            @click="readArticle(article)"
          >
            <div class="article-image" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
            </div>
            
            <div class="article-content">
              <div class="article-header">
                <div class="article-author">
                  <div class="author-avatar">{{ article.author.avatar }}</div>
                  <div class="author-info">
                    <strong>{{ article.author.name }}</strong>
                    <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                  </div>
                </div>
                <span class="article-badge developer">👨‍💻 Официально</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-meta">
                <div class="meta-item">
                  <span class="meta-icon">👁️</span>
                  <span class="meta-value">{{ article.views }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">❤️</span>
                  <span class="meta-value">{{ article.likes }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">💬</span>
                  <span class="meta-value">{{ article.commentsCount }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  <span class="meta-value">{{ article.readTime }} мин</span>
                </div>
              </div>

              <div class="article-tags">
                <span 
                  v-for="tag in article.tags" 
                  :key="tag"
                  class="tag"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Статьи пользователей -->
        <div v-if="activeTab === 'users'" class="articles-list">
          <div 
            v-for="article in userArticles" 
            :key="article.id"
            class="article-card"
            @click="readArticle(article)"
          >
            <div class="article-content">
              <div class="article-header">
                <div class="article-author">
                  <div class="author-avatar">{{ article.author.avatar }}</div>
                  <div class="author-info">
                    <strong>{{ article.author.name }}</strong>
                    <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                  </div>
                </div>
                <span class="article-badge user">👥 Пользователь</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-meta">
                <div class="meta-item">
                  <span class="meta-icon">👁️</span>
                  <span class="meta-value">{{ article.views }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">❤️</span>
                  <span class="meta-value">{{ article.likes }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">💬</span>
                  <span class="meta-value">{{ article.commentsCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="userArticles.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h4>Пока нет статей от пользователей</h4>
            <p>Будьте первым, кто поделится своим опытом!</p>
            <button class="btn btn-primary" @click="activeTab = 'create'" v-if="isAuthenticated">
              Написать статью
            </button>
          </div>
        </div>

        <!-- Создание статьи -->
        <div v-if="activeTab === 'create'" class="create-article">
          <h3>Написать статью</h3>
          
          <form @submit.prevent="publishArticle">
            <div class="form-group">
              <label>Заголовок статьи *</label>
              <input 
                v-model="articleForm.title"
                type="text" 
                placeholder="Интересный заголовок..."
                required
                maxlength="100"
              >
              <div class="char-counter">{{ articleForm.title.length }}/100</div>
            </div>

            <div class="form-group">
              <label>Категория *</label>
              <select v-model="articleForm.category" required>
                <option value="">Выберите категорию</option>
                <option value="business">💼 Бизнес-советы</option>
                <option value="success">🚀 Истории успеха</option>
                <option value="marketing">📈 Маркетинг</option>
                <option value="technology">🤖 Технологии</option>
                <option value="news">📢 Новости платформы</option>
                <option value="review">⭐ Обзоры</option>
                <option value="other">🔮 Другое</option>
              </select>
            </div>

            <div class="form-group">
              <label>Краткое описание *</label>
              <textarea 
                v-model="articleForm.excerpt"
                placeholder="Краткое описание, которое увидят читатели в списке статей..."
                rows="3"
                maxlength="200"
                required
              ></textarea>
              <div class="char-counter">{{ articleForm.excerpt.length }}/200</div>
            </div>

            <div class="form-group">
              <label>Содержание статьи *</label>
              <textarea 
                v-model="articleForm.content"
                placeholder="Напишите вашу статью здесь..."
                rows="12"
                required
              ></textarea>
              <div class="editor-tips">
                <strong>Подсказки:</strong><br>
                • Пишите понятно и структурировано<br>
                • Добавляйте заголовки и списки<br>
                • Делитесь личным опытом<br>
                • Минимальная длина - 500 символов
              </div>
            </div>

            <div class="form-group">
              <label>Теги (через запятую)</label>
              <input 
                v-model="articleForm.tagsInput"
                type="text" 
                placeholder="бизнес, успех, маркетинг, советы"
              >
              <div class="tags-preview" v-if="articleForm.tags.length > 0">
                <span 
                  v-for="tag in articleForm.tags" 
                  :key="tag"
                  class="tag-preview"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <div class="publish-options">
              <label class="checkbox-label">
                <input 
                  v-model="articleForm.allowComments"
                  type="checkbox" 
                  checked
                >
                Разрешить комментарии
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="saveDraft">
                💾 Сохранить черновик
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!canPublish">
                🚀 Опубликовать статью
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useBlogStore } from '../stores/blogStore'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'

export default {
  name: 'BlogPanel',
  setup() {
    const uiStore = useUIStore()
    const blogStore = useBlogStore()
    const authStore = useAuthStore()
    
    const { getDeveloperArticles, getUserArticles } = storeToRefs(blogStore)
    const { isAuthenticated } = storeToRefs(authStore)

    const { closePanel, showNotification, openArticle } = uiStore
    const { createArticle } = blogStore

    const activeTab = ref('developers')

    const developerArticles = computed(() => getDeveloperArticles.value)
    const userArticles = computed(() => getUserArticles.value)

    const articleForm = reactive({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      tagsInput: '',
      tags: [],
      allowComments: true
    })

    const canPublish = computed(() => {
      return articleForm.title.length > 0 &&
             articleForm.category.length > 0 &&
             articleForm.excerpt.length > 0 &&
             articleForm.content.length >= 500
    })

    watch(() => articleForm.tagsInput, (newValue) => {
      if (newValue) {
        articleForm.tags = newValue.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .slice(0, 5) // Максимум 5 тегов
      } else {
        articleForm.tags = []
      }
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const readArticle = (article) => {
      openArticle(article)
    }

    const publishArticle = () => {
      try {
        const articleData = {
          title: articleForm.title,
          category: articleForm.category,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          tags: articleForm.tags,
          allowComments: articleForm.allowComments
        }

        const newArticle = createArticle(articleData)
        showNotification('Статья успешно опубликована!', 'success')
        resetForm()
        activeTab.value = 'users'
      } catch (error) {
        showNotification('Ошибка при публикации статьи', 'error')
      }
    }

    const saveDraft = () => {
      localStorage.setItem('blog_draft', JSON.stringify(articleForm))
      showNotification('Черновик сохранен!', 'success')
    }

    const resetForm = () => {
      Object.assign(articleForm, {
        title: '',
        category: '',
        excerpt: '',
        content: '',
        tagsInput: '',
        tags: [],
        allowComments: true
      })
    }

    // Загрузка черновика
    const loadDraft = () => {
      const draft = localStorage.getItem('blog_draft')
      if (draft) {
        const draftData = JSON.parse(draft)
        Object.assign(articleForm, draftData)
      }
    }

    loadDraft()

    return {
      activeTab,
      developerArticles,
      userArticles,
      isAuthenticated,
      articleForm,
      canPublish,
      closePanel,
      readArticle,
      publishArticle,
      saveDraft,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Стили для вкладок */
.tabs {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-radius: 8px;
  font-weight: 500;
  min-width: 120px;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
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
  font-size: 0.9rem;
}

.article-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.article-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-badge.developer {
  background: var(--primary);
  color: white;
}

.article-badge.user {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.article-title {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  line-height: 1.4;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.meta-icon {
  font-size: 1rem;
}

.meta-value {
  font-weight: 500;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.create-article {
  padding: 0;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.editor-tips {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-preview {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.publish-options {
  margin: 1.5rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .article-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .article-meta {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .articles-list,
  .create-article {
    padding: 0;
  }
  
  .article-content {
    padding: 1rem;
  }
}
</style>
