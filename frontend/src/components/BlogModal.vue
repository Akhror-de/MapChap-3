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
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          ✍️ Написать статью
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
          >
            <div class="article-header">
              <div class="article-author">
                <div class="author-avatar">{{ article.author.avatar }}</div>
                <div class="author-info">
                  <strong>{{ article.author.name }}</strong>
                  <span class="article-date">{{ formatDate(article.date) }}</span>
                </div>
              </div>
              <span class="article-badge">👨‍💻 Официально</span>
            </div>
            
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <div class="article-stats">
              <span>👁️ {{ article.views }}</span>
              <span>💬 {{ article.comments }}</span>
              <span>❤️ {{ article.likes }}</span>
            </div>
            
            <button class="btn btn-primary" @click="readArticle(article)">
              Читать полностью
            </button>
          </div>
        </div>

        <!-- Статьи пользователей -->
        <div v-if="activeTab === 'users'" class="articles-list">
          <div 
            v-for="article in userArticles" 
            :key="article.id"
            class="article-card"
          >
            <div class="article-header">
              <div class="article-author">
                <div class="author-avatar">{{ article.author.avatar }}</div>
                <div class="author-info">
                  <strong>{{ article.author.name }}</strong>
                  <span class="article-date">{{ formatDate(article.date) }}</span>
                </div>
              </div>
              <span class="article-badge user">👥 Пользователь</span>
            </div>
            
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <div class="article-stats">
              <span>👁️ {{ article.views }}</span>
              <span>💬 {{ article.comments }}</span>
              <span>❤️ {{ article.likes }}</span>
            </div>
            
            <button class="btn btn-primary" @click="readArticle(article)">
              Читать полностью
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
                v-model="newArticle.title"
                type="text" 
                placeholder="Интересный заголовок..."
                required
                maxlength="100"
              >
              <div class="char-counter">{{ newArticle.title.length }}/100</div>
            </div>

            <div class="form-group">
              <label>Категория *</label>
              <select v-model="newArticle.category" required>
                <option value="">Выберите категорию</option>
                <option value="business">💼 Бизнес-советы</option>
                <option value="success">🚀 Истории успеха</option>
                <option value="marketing">📈 Маркетинг</option>
                <option value="technology">🤖 Технологии</option>
                <option value="news">📢 Новости платформы</option>
                <option value="other">🔮 Другое</option>
              </select>
            </div>

            <div class="form-group">
              <label>Содержание статьи *</label>
              <textarea 
                v-model="newArticle.content"
                placeholder="Напишите вашу статью здесь..."
                rows="12"
                required
              ></textarea>
              <div class="editor-tips">
                <strong>Подсказки:</strong>
                - Пишите понятно и структурировано<br>
                - Добавляйте заголовки и списки<br>
                - Делитесь личным опытом
              </div>
            </div>

            <div class="form-group">
              <label>Краткое описание (для превью)</label>
              <textarea 
                v-model="newArticle.excerpt"
                placeholder="Краткое описание, которое увидят читатели в списке статей..."
                rows="3"
                maxlength="200"
              ></textarea>
              <div class="char-counter">{{ newArticle.excerpt.length }}/200</div>
            </div>

            <div class="form-group">
              <label>Теги (через запятую)</label>
              <input 
                v-model="newArticle.tags"
                type="text" 
                placeholder="бизнес, успех, маркетинг, советы"
              >
            </div>

            <div class="publish-options">
              <label class="checkbox-label">
                <input 
                  v-model="newArticle.allowComments"
                  type="checkbox" 
                >
                Разрешить комментарии
              </label>
              
              <label class="checkbox-label">
                <input 
                  v-model="newArticle.notifySubscribers"
                  type="checkbox" 
                >
                Уведомить подписчиков
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="saveDraft">
                💾 Сохранить черновик
              </button>
              <button type="submit" class="btn btn-primary">
                🚀 Опубликовать статью
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Модалка чтения статьи -->
      <div v-if="selectedArticle" class="article-modal">
        <div class="article-full">
          <button class="back-btn" @click="selectedArticle = null">← Назад</button>
          
          <div class="article-header">
            <div class="article-author">
              <div class="author-avatar large">{{ selectedArticle.author.avatar }}</div>
              <div class="author-info">
                <strong>{{ selectedArticle.author.name }}</strong>
                <span class="article-date">{{ formatDate(selectedArticle.date) }}</span>
                <span class="article-badge" :class="{ user: selectedArticle.author.type === 'user' }">
                  {{ selectedArticle.author.type === 'developer' ? '👨‍💻 Официально' : '👥 Пользователь' }}
                </span>
              </div>
            </div>
          </div>

          <h1 class="article-full-title">{{ selectedArticle.title }}</h1>
          
          <div class="article-content">
            <p>{{ selectedArticle.fullContent }}</p>
          </div>

          <div class="article-tags">
            <span 
              v-for="tag in selectedArticle.tags" 
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="article-actions">
            <button class="action-btn" @click="likeArticle(selectedArticle)">
              ❤️ {{ selectedArticle.likes }}
            </button>
            <button class="action-btn" @click="toggleComments">
              💬 {{ selectedArticle.comments }} комментариев
            </button>
            <button class="action-btn">🔗 Поделиться</button>
          </div>

          <!-- Комментарии -->
          <div v-if="showComments" class="comments-section">
            <h4>Комментарии</h4>
            
            <div class="comment-form">
              <textarea 
                v-model="newComment"
                placeholder="Напишите комментарий..."
                rows="3"
              ></textarea>
              <button class="btn btn-primary" @click="addComment">
                Отправить
              </button>
            </div>

            <div class="comments-list">
              <div 
                v-for="comment in selectedArticle.commentsList" 
                :key="comment.id"
                class="comment"
              >
                <div class="comment-author">
                  <span class="comment-avatar">{{ comment.author.avatar }}</span>
                  <strong>{{ comment.author.name }}</strong>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
                <span class="comment-date">{{ formatDate(comment.date) }}</span>
              </div>
            </div>
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
    const selectedArticle = ref(null)
    const showComments = ref(false)
    const newComment = ref('')

    // Моковые данные статей
    const developerArticles = ref([
      {
        id: 1,
        title: 'MapChap v3.0: Новая эра бизнес-карт',
        excerpt: 'Рассказываем о главных обновлениях новой версии платформы и наших планах на будущее.',
        fullContent: 'Мы рады представить вам MapChap v3.0 - полностью переработанную платформу для бизнес-объявлений на карте. В этой версии мы уделили особое внимание пользовательскому опыту и функциональности для бизнеса...',
        author: {
          name: 'Ахрор Хабибуллаев',
          avatar: '👨‍💼',
          type: 'developer'
        },
        date: new Date('2024-01-15'),
        views: 1245,
        comments: 23,
        likes: 89,
        category: 'news',
        tags: ['обновление', 'платформа', 'бизнес']
      },
      {
        id: 2,
        title: 'Как эффективно продвигать бизнес на картах',
        excerpt: 'Практические советы по привлечению клиентов через картографические сервисы.',
        fullContent: 'Картографические сервисы стали мощным инструментом для привлечения клиентов. В этой статье мы расскажем, как максимально эффективно использовать MapChap для продвижения вашего бизнеса...',
        author: {
          name: 'Яна Ивченко',
          avatar: '👩‍💼',
          type: 'developer'
        },
        date: new Date('2024-01-10'),
        views: 876,
        comments: 15,
        likes: 67,
        category: 'marketing',
        tags: ['маркетинг', 'продвижение', 'советы']
      }
    ])

    const userArticles = ref([
      {
        id: 3,
        title: 'Как я увеличил продажи в 3 раза с помощью MapChap',
        excerpt: 'Реальная история владельца кофейни о том, как картографический сервис помог найти новых клиентов.',
        fullContent: 'Когда я открыл свою кофейню, главной проблемой было привлечение клиентов. Традиционная реклама не давала результатов, пока я не обнаружил MapChap...',
        author: {
          name: 'Михаил Петров',
          avatar: '👨‍🍳',
          type: 'user'
        },
        date: new Date('2024-01-08'),
        views: 543,
        comments: 8,
        likes: 45,
        category: 'success',
        tags: ['успех', 'кофейня', 'рост'],
        commentsList: [
          {
            id: 1,
            author: { name: 'Анна Смирнова', avatar: '👩' },
            text: 'Отличная история! Спасибо за советы.',
            date: new Date('2024-01-09')
          }
        ]
      }
    ])

    // Форма новой статьи
    const newArticle = ref({
      title: '',
      category: '',
      content: '',
      excerpt: '',
      tags: '',
      allowComments: true,
      notifySubscribers: true
    })

    // Методы
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const readArticle = (article) => {
      selectedArticle.value = article
    }

    const likeArticle = (article) => {
      article.likes++
      // Здесь будет API вызов при интеграции с бэкендом
    }

    const toggleComments = () => {
      showComments.value = !showComments.value
    }

    const addComment = () => {
      if (newComment.value.trim()) {
        const comment = {
          id: Date.now(),
          author: {
            name: 'Текущий пользователь',
            avatar: '👤'
          },
          text: newComment.value,
          date: new Date()
        }
        
        if (!selectedArticle.value.commentsList) {
          selectedArticle.value.commentsList = []
        }
        
        selectedArticle.value.commentsList.push(comment)
        selectedArticle.value.comments++
        newComment.value = ''
      }
    }

    const publishArticle = () => {
      const article = {
        id: Date.now(),
        ...newArticle.value,
        author: {
          name: 'Текущий пользователь',
          avatar: '👤',
          type: 'user'
        },
        date: new Date(),
        views: 0,
        comments: 0,
        likes: 0,
        tags: newArticle.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        fullContent: newArticle.value.content,
        commentsList: []
      }
      
      userArticles.value.unshift(article)
      resetForm()
      activeTab.value = 'users'
      alert('Статья успешно опубликована!')
    }

    const saveDraft = () => {
      // Сохранение черновика в localStorage
      localStorage.setItem('blogDraft', JSON.stringify(newArticle.value))
      alert('Черновик сохранен!')
    }

    const resetForm = () => {
      newArticle.value = {
        title: '',
        category: '',
        content: '',
        excerpt: '',
        tags: '',
        allowComments: true,
        notifySubscribers: true
      }
    }

    // Загрузка черновика при монтировании
    const loadDraft = () => {
      const draft = localStorage.getItem('blogDraft')
      if (draft) {
        newArticle.value = JSON.parse(draft)
      }
    }

    loadDraft()

    return {
      isOpen,
      activeTab,
      selectedArticle,
      showComments,
      newComment,
      developerArticles,
      userArticles,
      newArticle,
      closeModal,
      formatDate,
      readArticle,
      likeArticle,
      toggleComments,
      addComment,
      publishArticle,
      saveDraft
    }
  }
}
</script>

<style scoped>
.blog-modal {
  max-width: 900px;
  max-height: 90vh;
}

/* Стили для статей */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.article-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.author-avatar.large {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
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
  color: #666;
}

.article-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-badge.user {
  background: #28a745;
}

.article-title {
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
  color: #333;
  line-height: 1.4;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

/* Создание статьи */
.create-article {
  padding: 1rem 0;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.editor-tips {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.publish-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

/* Полная статья */
.article-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 3000;
  overflow-y: auto;
}

.article-full {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #667eea;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
}

.article-full-title {
  font-size: 2rem;
  margin: 2rem 0 1.5rem 0;
  color: #333;
  line-height: 1.3;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 2rem;
}

.article-content p {
  margin-bottom: 1.5rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  border: 1px solid #e9ecef;
}

.article-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.action-btn {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e9ecef;
}

/* Комментарии */
.comments-section {
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  margin-bottom: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.comment-text {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.comment-date {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .blog-modal {
    width: 95%;
  }
  
  .article-full {
    padding: 1rem;
  }
  
  .article-full-title {
    font-size: 1.5rem;
  }
  
  .article-actions {
    flex-direction: column;
  }
  
  .article-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
