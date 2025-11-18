<template>
  <div id="app">
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <h1>🗺️ MapChap</h1>
              <p>Бизнес-объявления на карте</p>
            </div>
            <nav class="nav">
              <button class="nav-btn" @click="openAbout">О приложении</button>
              <button class="nav-btn">Для бизнеса</button>
              <button class="nav-btn">Войти</button>
            </nav>
          </div>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <div class="dashboard">
            <!-- Левая панель - Фильтры -->
            <div class="sidebar">
              <CategoryFilter />
              <OffersList />
            </div>

            <!-- Правая панель - Карта -->
            <div class="map-container">
              <YandexMap />
            </div>
          </div>
        </div>
      </main>

      <!-- Панель "О приложении" -->
      <AboutPanel ref="aboutPanel" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import CategoryFilter from './components/CategoryFilter.vue'
import OffersList from './components/OffersList.vue'
import YandexMap from './components/YandexMap.vue'
import AboutPanel from './components/AboutPanel.vue'

export default {
  name: 'App',
  components: {
    CategoryFilter,
    OffersList,
    YandexMap,
    AboutPanel
  },
  setup() {
    const aboutPanel = ref(null)

    const openAbout = () => {
      if (aboutPanel.value) {
        aboutPanel.value.open()
      }
    }

    return {
      aboutPanel,
      openAbout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Хедер */
.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo p {
  color: #666;
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.nav-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Основной контент */
.app-main {
  flex: 1;
  padding: 2rem 0;
}

.dashboard {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: calc(100vh - 120px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.map-container {
  position: relative;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 350px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    min-height: calc(100vh - 120px);
  }

  .sidebar {
    height: auto;
  }

  .map-container {
    height: 400px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .app-main {
    padding: 1rem 0;
  }

  .dashboard {
    gap: 1rem;
  }
}
</style>
