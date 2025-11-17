<template>
  <div id="app">
    <div class="app-container">
      <!-- Хедер -->
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

      <!-- Основной контент -->
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
