<template>
  <div class="favorites-tab">
    <!-- Header with Stats -->
    <div class="section-header">
      <div class="header-main">
        <h3>⭐ Избранные места</h3>
        <p>Ваши сохраненные бизнесы и места</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="stat-value">{{ totalFavorites }}</span>
          <span class="stat-label">мест</span>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Поиск по избранному..."
          class="search-input"
        >
        <button 
          v-if="searchQuery" 
          class="clear-search"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>

      <div class="filter-controls">
        <div class="filter-group">
          <label>Категория:</label>
          <select v-model="filters.category" @change="applyFilters">
            <option value="all">Все категории</option>
            <option value="cafe">☕ Кафе</option>
            <option value="restaurant">🍕 Рестораны</option>
            <option value="shop">🛍️ Магазины</option>
            <option value="service">🔧 Услуги</option>
            <option value="hotel">🏨 Отели</option>
            <option value="entertainment">🎭 Развлечения</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Сортировка:</label>
          <select v-model="filters.sort" @change="applyFilters">
            <option value="recent">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="name">По названию (А-Я)</option>
            <option value="name_desc">По названию (Я-А)</option>
            <option value="rating">По рейтингу</option>
            <option value="distance">По расстоянию</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Рейтинг:</label>
          <select v-model="filters.rating" @change="applyFilters">
            <option value="all">Любой рейтинг</option>
            <option value="4.5">⭐ 4.5+</option>
            <option value="4.0">⭐ 4.0+</option>
            <option value="3.5">⭐ 3.5+</option>
            <option value="3.0">⭐ 3.0+</option>
          </select>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="filters-label">Активные фильтры:</span>
        <div class="filter-tags">
          <span 
            v-if="filters.category !== 'all'"
            class="filter-tag"
          >
            {{ getCategoryName(filters.category) }}
            <button @click="filters.category = 'all'">✕</button>
          </span>
          <span 
            v-if="filters.rating !== 'all'"
            class="filter-tag"
          >
            Рейтинг {{ filters.rating }}+
            <button @click="filters.rating = 'all'">✕</button>
          </span>
          <span 
            v-if="searchQuery"
            class="filter-tag"
          >
            Поиск: "{{ searchQuery }}"
            <button @click="searchQuery = ''">✕</button>
          </span>
          <button class="clear-all-filters" @click="clearAllFilters">
            Очистить все
          </button>
        </div>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="view-controls">
      <div class="view-toggle">
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          ◼️ Сетка
        </button>
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          ☰ Список
        </button>
      </div>
      <div class="results-count">
        Показано {{ filteredFavorites.length }} из {{ totalFavorites }} мест
      </div>
    </div>

    <!-- Favorites List -->
    <div class="favorites-content">
      <!-- Empty State -->
      <div v-if="filteredFavorites.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <h4 v-if="hasActiveFilters">Ничего не найдено</h4>
        <h4 v-else>Пока нет избранных мест</h4>
        <p v-if="hasActiveFilters">
          Попробуйте изменить параметры фильтрации
        </p>
        <p v-else>
          Добавляйте бизнесы в избранное, чтобы легко находить их позже
        </p>
        <div class="empty-actions">
          <button v-if="hasActiveFilters" class="btn btn-primary" @click="clearAllFilters">
            Сбросить фильтры
          </button>
          <button class="btn btn-primary" @click="$emit('explore')">
            🔍 Найти бизнесы
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="favorites-grid">
        <div 
          v-for="favorite in filteredFavorites" 
          :key="favorite.id"
          class="favorite-card"
          @click="$emit('view-details', favorite)"
        >
          <div class="favorite-image">
            <img 
              v-if="favorite.image" 
              :src="favorite.image" 
              :alt="favorite.name"
              loading="lazy"
            />
            <div v-else class="image-placeholder">
              {{ getCategoryIcon(favorite.category) }}
            </div>
            <div class="favorite-badges">
              <span class="category-badge">{{ getCategoryName(favorite.category) }}</span>
              <span v-if="favorite.is_open" class="status-badge open">Открыто</span>
              <span v-else class="status-badge closed">Закрыто</span>
            </div>
            <button 
              class="favorite-btn active"
              @click.stop="$emit('remove-favorite', favorite.id)"
              aria-label="Удалить из избранного"
            >
              ❤️
            </button>
          </div>
          
          <div class="favorite-content">
            <div class="favorite-header">
              <h4 class="favorite-name">{{ favorite.name }}</h4>
              <div class="favorite-rating" v-if="favorite.rating">
                <span class="rating-stars">⭐</span>
                <span class="rating-value">{{ favorite.rating }}</span>
                <span class="rating-count">({{ favorite.review_count || 0 }})</span>
              </div>
            </div>

            <p class="favorite-description" v-if="favorite.description">
              {{ favorite.description }}
            </p>

            <p class="favorite-address">📍 {{ favorite.address }}</p>
            
            <div class="favorite-meta">
              <div class="meta-item" v-if="favorite.distance">
                <span class="meta-icon">📏</span>
                <span class="meta-text">{{ favorite.distance }} км</span>
              </div>
              <div class="meta-item" v-if="favorite.price_range">
                <span class="meta-icon">💰</span>
                <span class="meta-text">{{ favorite.price_range }}</span>
              </div>
              <div class="meta-item" v-if="favorite.phone">
                <span class="meta-icon">📞</span>
                <span class="meta-text">{{ favorite.phone }}</span>
              </div>
            </div>

            <div class="favorite-tags" v-if="favorite.tags && favorite.tags.length">
              <span 
                v-for="tag in favorite.tags.slice(0, 3)" 
                :key="tag"
                class="tag"
              >
                #{{ tag }}
              </span>
              <span v-if="favorite.tags.length > 3" class="tag-more">
                +{{ favorite.tags.length - 3 }}
              </span>
            </div>

            <div class="favorite-actions">
              <button class="btn btn-small btn-outline" @click.stop="$emit('view-on-map', favorite)">
                🗺️ На карте
              </button>
              <button class="btn btn-small btn-primary" @click.stop="$emit('view-details', favorite)">
                👀 Подробнее
              </button>
              <button class="btn btn-small btn-secondary" @click.stop="shareFavorite(favorite)">
                🔗 Поделиться
              </button>
            </div>

            <div class="favorite-footer">
              <span class="added-date">Добавлено {{ formatDate(favorite.added_at) }}</span>
              <span class="visit-count" v-if="favorite.visit_count">
                🚶 {{ favorite.visit_count }} посещений
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="favorites-list">
        <div 
          v-for="favorite in filteredFavorites" 
          :key="favorite.id"
          class="favorite-list-item"
        >
          <div class="list-item-main">
            <div class="item-image">
              <img 
                v-if="favorite.image" 
                :src="favorite.image" 
                :alt="favorite.name"
                loading="lazy"
              />
              <div v-else class="image-placeholder small">
                {{ getCategoryIcon(favorite.category) }}
              </div>
            </div>
            
            <div class="item-content">
              <div class="item-header">
                <h4 class="item-name">{{ favorite.name }}</h4>
                <div class="item-meta">
                  <span class="category">{{ getCategoryName(favorite.category) }}</span>
                  <span class="rating" v-if="favorite.rating">
                    ⭐ {{ favorite.rating }}
                  </span>
                  <span class="distance" v-if="favorite.distance">
                    📍 {{ favorite.distance }} км
                  </span>
                </div>
              </div>

              <p class="item-address">{{ favorite.address }}</p>
              
              <div class="item-description" v-if="favorite.description">
                {{ favorite.description }}
              </div>

              <div class="item-tags" v-if="favorite.tags && favorite.tags.length">
                <span 
                  v-for="tag in favorite.tags.slice(0, 2)" 
                  :key="tag"
                  class="tag"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="list-item-actions">
            <button 
              class="favorite-btn active"
              @click="$emit('remove-favorite', favorite.id)"
              aria-label="Удалить из избранного"
            >
              ❤️
            </button>
            <div class="action-buttons">
              <button class="btn btn-small" @click="$emit('view-on-map', favorite)">
                🗺️
              </button>
              <button class="btn btn-small btn-primary" @click="$emit('view-details', favorite)">
                👀
              </button>
              <button class="btn btn-small" @click="shareFavorite(favorite)">
                🔗
              </button>
            </div>
            <span class="added-date">{{ formatRelativeDate(favorite.added_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && filteredFavorites.length >= pageSize" class="load-more">
      <button class="btn btn-outline" @click="loadMore" :disabled="loadingMore">
        <span v-if="loadingMore" class="loading-spinner-small"></span>
        {{ loadingMore ? 'Загрузка...' : 'Показать еще' }}
      </button>
    </div>

    <!-- Statistics Summary -->
    <div class="favorites-summary">
      <h4>📊 Статистика избранного</h4>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon">⭐</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalFavorites }}</div>
            <div class="summary-label">Всего избранных</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">🏷️</div>
          <div class="summary-content">
            <div class="summary-value">{{ favoriteCategories }}</div>
            <div class="summary-label">Категорий</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📈</div>
          <div class="summary-content">
            <div class="summary-value">{{ avgRating }}</div>
            <div class="summary-label">Средний рейтинг</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">🚶</div>
          <div class="summary-content">
            <div class="summary-value">{{ totalVisits }}</div>
            <div class="summary-label">Всего посещений</div>
          </div>
        </div>
      </div>

      <!-- Categories Distribution -->
      <div class="categories-distribution">
        <h5>Распределение по категориям</h5>
        <div class="distribution-list">
          <div 
            v-for="category in categoriesDistribution" 
            :key="category.name"
            class="distribution-item"
          >
            <div class="category-info">
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </div>
            <div class="category-stats">
              <span class="category-count">{{ category.count }}</span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: category.percentage + '%' }"
                ></div>
              </div>
              <span class="category-percentage">{{ category.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h4>⚡ Быстрые действия</h4>
      <div class="actions-grid">
        <button class="action-btn" @click="exportFavorites">
          <span class="action-icon">📤</span>
          <span class="action-text">Экспорт избранного</span>
        </button>
        <button class="action-btn" @click="createCollection">
          <span class="action-icon">📁</span>
          <span class="action-text">Создать коллекцию</span>
        </button>
        <button class="action-btn" @click="shareAllFavorites">
          <span class="action-icon">🔗</span>
          <span class="action-text">Поделиться всеми</span>
        </button>
        <button class="action-btn" @click="sortByDistance">
          <span class="action-icon">📍</span>
          <span class="action-text">Ближайшие ко мне</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ProfileFavoritesTab',
  props: {
    favorites: {
      type: Array,
      required: true
    }
  },
  emits: ['remove-favorite', 'view-on-map', 'view-details', 'explore'],
  setup(props, { emit }) {
    // State
    const searchQuery = ref('')
    const viewMode = ref('grid')
    const loadingMore = ref(false)
    const currentPage = ref(1)
    const pageSize = 12

    const filters = ref({
      category: 'all',
      sort: 'recent',
      rating: 'all'
    })

    // Computed
    const totalFavorites = computed(() => props.favorites.length)
    
    const favoriteCategories = computed(() => {
      const categories = props.favorites.map(fav => fav.category)
      return [...new Set(categories)].length
    })

    const avgRating = computed(() => {
      if (props.favorites.length === 0) return '0.0'
      const ratedFavorites = props.favorites.filter(fav => fav.rating)
      if (ratedFavorites.length === 0) return '0.0'
      const sum = ratedFavorites.reduce((acc, fav) => acc + fav.rating, 0)
      return (sum / ratedFavorites.length).toFixed(1)
    })

    const totalVisits = computed(() => {
      return props.favorites.reduce((sum, fav) => sum + (fav.visit_count || 0), 0)
    })

    const categoriesDistribution = computed(() => {
      const categoryCounts = {}
      props.favorites.forEach(fav => {
        categoryCounts[fav.category] = (categoryCounts[fav.category] || 0) + 1
      })

      return Object.entries(categoryCounts).map(([category, count]) => ({
        name: getCategoryName(category),
        icon: getCategoryIcon(category),
        count,
        percentage: ((count / totalFavorites.value) * 100).toFixed(1)
      })).sort((a, b) => b.count - a.count)
    })

    const filteredFavorites = computed(() => {
      let filtered = [...props.favorites]

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(fav => 
          fav.name.toLowerCase().includes(query) ||
          fav.description?.toLowerCase().includes(query) ||
          fav.address.toLowerCase().includes(query) ||
          fav.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // Category filter
      if (filters.value.category !== 'all') {
        filtered = filtered.filter(fav => fav.category === filters.value.category)
      }

      // Rating filter
      if (filters.value.rating !== 'all') {
        const minRating = parseFloat(filters.value.rating)
        filtered = filtered.filter(fav => fav.rating >= minRating)
      }

      // Sorting
      switch (filters.value.sort) {
        case 'recent':
          filtered.sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
          break
        case 'oldest':
          filtered.sort((a, b) => new Date(a.added_at) - new Date(b.added_at))
          break
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name_desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'distance':
          filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
          break
      }

      // Pagination
      const startIndex = 0
      const endIndex = currentPage.value * pageSize
      return filtered.slice(startIndex, endIndex)
    })

    const hasActiveFilters = computed(() => {
      return searchQuery.value || 
             filters.value.category !== 'all' || 
             filters.value.rating !== 'all'
    })

    const hasMore = computed(() => {
      return filteredFavorites.value.length < props.favorites.length
    })

    // Methods
    const getCategoryName = (categoryId) => {
      const categories = {
        restaurant: 'Ресторан',
        cafe: 'Кафе',
        shop: 'Магазин',
        service: 'Услуги',
        hotel: 'Отель',
        entertainment: 'Развлечения'
      }
      return categories[categoryId] || 'Другое'
    }

    const getCategoryIcon = (categoryId) => {
      const icons = {
        restaurant: '🍕',
        cafe: '☕',
        shop: '🛍️',
        service: '🔧',
        hotel: '🏨',
        entertainment: '🎭'
      }
      return icons[categoryId] || '🏢'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU')
    }

    const formatRelativeDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return 'Вчера'
      if (diffDays < 7) return `${diffDays} дней назад`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`
      return formatDate(dateString)
    }

    const applyFilters = () => {
      currentPage.value = 1
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      filters.value = {
        category: 'all',
        sort: 'recent',
        rating: 'all'
      }
    }

    const loadMore = () => {
      loadingMore.value = true
      setTimeout(() => {
        currentPage.value++
        loadingMore.value = false
      }, 500)
    }

    const shareFavorite = (favorite) => {
      if (navigator.share) {
        navigator.share({
          title: favorite.name,
          text: favorite.description,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(`${favorite.name} - ${favorite.address}`)
        // Show notification
      }
    }

    const exportFavorites = () => {
      // Implementation for export
      console.log('Export favorites')
    }

    const createCollection = () => {
      // Implementation for creating collection
      console.log('Create collection')
    }

    const shareAllFavorites = () => {
      // Implementation for sharing all favorites
      console.log('Share all favorites')
    }

    const sortByDistance = () => {
      filters.value.sort = 'distance'
    }

    return {
      // Refs
      searchQuery,
      viewMode,
      loadingMore,
      filters,
      // Computed
      totalFavorites,
      favoriteCategories,
      avgRating,
      totalVisits,
      categoriesDistribution,
      filteredFavorites,
      hasActiveFilters,
      hasMore,
      // Methods
      getCategoryName,
      getCategoryIcon,
      formatDate,
      formatRelativeDate,
      applyFilters,
      clearAllFilters,
      loadMore,
      shareFavorite,
      exportFavorites,
      createCollection,
      shareAllFavorites,
      sortByDistance
    }
  }
}
</script>

<style scoped>
/* Comprehensive styles for favorites tab */
.favorites-tab {
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border-radius: 20px;
  color: white;
}

.header-main h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.header-main p {
  margin: 0;
  opacity: 0.9;
}

.stat-badge {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Filters Section */
.filters-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters-label {
  font-weight: 600;
  color: var(--text-primary);
}

.filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-all-filters {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

/* View Controls */
.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.view-toggle {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.view-btn.active {
  background: var(--primary);
  color: white;
}

.results-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Favorites Grid */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.favorite-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.favorite-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.image-placeholder.small {
  height: 80px;
  width: 80px;
  font-size: 1.5rem;
  border-radius: 12px;
}

.favorite-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-badge,
.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.category-badge {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-primary);
}

.status-badge.open {
  background: rgba(34, 197, 94, 0.9);
  color: white;
}

.status-badge.closed {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.favorite-btn.active {
  background: #fecaca;
  color: #dc2626;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-content {
  padding: 1.5rem;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.favorite-name {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  flex: 1;
}

.favorite-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.rating-count {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.favorite-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-address {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.favorite-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.favorite-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.tag-more {
  background: var(--primary);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.favorite-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.favorite-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.added-date,
.visit-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* List View */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.favorite-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.favorite-list-item:hover {
  border-color: var(--primary);
  transform: translateX(4px);
}

.list-item-main {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex: 1;
}

.item-image {
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.item-name {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.item-address {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.item-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-tags {
  display: flex;
  gap: 0.5rem;
}

.list-item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.added-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Load More */
.load-more {
  text-align: center;
  margin-bottom: 2rem;
}

/* Summary */
.favorites-summary {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.favorites-summary h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.summary-icon {
  font-size: 2rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.categories-distribution h5 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-weight: 500;
  color: var(--text-primary);
}

.category-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 200px;
}

.category-count {
  font-weight: 600;
  color: var(--primary);
  min-width: 30px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.category-percentage {
  font-size: 0.9rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

/* Quick Actions */
.quick-actions {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.quick-actions h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.action-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-weight: 500;
  color: var(--text-primary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
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

.empty-state p {
  margin: 0 0 1.5rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .filter-controls {
    grid-template-columns: 1fr;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .favorite-list-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .list-item-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .category-stats {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .favorite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .favorite-actions {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .distribution-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .category-stats {
    width: 100%;
  }
}
</style>
