<template>
  <div id="app" :class="themeClass">
    <BurgerMenu />
    
    <header class="app-header">
      <button class="burger-btn" @click="toggleBurgerMenu">☰</button>
      <h1>🗺️ MapChap</h1>
      <button class="theme-btn" @click="toggleTheme">
        {{ isDarkTheme ? '☀️' : '🌙' }}
      </button>
    </header>

    <main class="app-main">
      <YandexMap />
    </main>

    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { useUIStore } from './stores/uiStore'
import { useAuthStore } from './stores/authStore'
import { storeToRefs } from 'pinia'
import YandexMap from './components/YandexMap.vue'
import BurgerMenu from './components/BurgerMenu.vue'

export default {
  name: 'App',
  components: {
    YandexMap,
    BurgerMenu
  },
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()

    const { isDarkTheme, notification } = storeToRefs(uiStore)
    const { toggleBurgerMenu, toggleTheme } = uiStore

    const themeClass = isDarkTheme

    return {
      isDarkTheme,
      notification,
      themeClass,
      toggleBurgerMenu,
      toggleTheme
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
  font-family: Arial, sans-serif;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.burger-btn, .theme-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
}

.app-main {
  height: calc(100vh - 60px);
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  z-index: 1002;
}

.notification.success {
  background: #4CAF50;
}

.notification.info {
  background: #2196F3;
}

.dark-theme .app-header {
  background: #1a1a1a;
  color: white;
  border-bottom-color: #333;
}
</style>
