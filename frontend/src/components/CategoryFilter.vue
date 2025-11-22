<template>
  <div class="category-filter">
    <div class="search-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по адресу или названию..."
          class="search-input"
          @input="onSearchInput"
        />
        <button class="search-btn" @click="onSearch">
          🔍
        </button>
      </div>
    </div>

    <div class="categories-section">
      <h3 class="section-title">Категории</h3>
      <div class="categories-grid">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
          :style="{ borderColor: category.color }"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>
    </div>

    <div class="location-section">
      <button class="location-btn" @click="getUserLocation">
        📍 Мое местоположение
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'
import { useGeolocation } from '../composables/useGeolocation.js'

export default {
  name: 'CategoryFilter',
  setup() {
    const offersStore = useOffersStore()
    const { getCurrentLocation } = useGeolocation()
    const searchQuery = ref('')

    const categories = computed(() => offersStore.categories)
    const selectedCategory = computed(() => offersStore.selectedCategory)

    const selectCategory = (categoryId) => {
      offersStore.setSelectedCategory(categoryId)
    }

    const onSearchInput = () => {
      offersStore.setSearchQuery(searchQuery.value)
    }

    const onSearch = () => {
      if (searchQuery.value.trim()) {
        offersStore.searchByAddress(searchQuery.value)
      }
    }

    const getUserLocation = async () => {
      try {
        const location = await getCurrentLocation()
        offersStore.setUserLocation(location)
      } catch (error) {
        console.error('Ошибка получения местоположения:', error)
        alert('Не удалось получить ваше местоположение. Проверьте разрешения браузера.')
      }
    }

    return {
      searchQuery,
      categories,
      selectedCategory,
      selectCategory,
      onSearchInput,
      onSearch,
      getUserLocation
    }
  }
}
</script>

<style scoped>
.category-filter {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  height: fit-content;
  border: 1px solid var(--border-color);
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.search-btn {
  padding: 0.75rem 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: var(--primary-dark);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.category-btn:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.category-btn.active {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.location-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.location-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.location-btn:hover {
  border-color: var(--primary);
  background: var(--primary);
  color: white;
}

@media (max-width: 768px) {
  .category-filter {
    padding: 1rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
