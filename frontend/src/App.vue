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
              <button class="nav-btn">Для бизнеса</button>
              <button class="nav-btn">Войти</button>
            </nav>
          </div>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <div class="status-panel">
            <div class="status-item">
              <div class="status-icon">🚀</div>
              <div class="status-info">
                <div class="status-title">Фаза 1 завершена</div>
                <div class="status-desc">Базовая структура готова</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon">✅</div>
              <div class="status-info">
                <div class="status-title">Frontend настроен</div>
                <div class="status-desc">Vue 3 + Pinia + Vite</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon">🔧</div>
              <div class="status-info">
                <div class="status-title">Backend готов</div>
                <div class="status-desc">Node.js 22 + Express</div>
              </div>
            </div>
          </div>

          <div class="next-phase">
            <h2>Готовы к Фазе 2?</h2>
            <p>Интеграция Яндекс.Карт и базовый интерфейс</p>
            <button class="btn-primary" @click="startPhase2">
              Начать Фазу 2 🗺️
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useOffersStore } from './stores/offersStore'

export default {
  name: 'App',
  setup() {
    const offersStore = useOffersStore()

    const startPhase2 = () => {
      console.log('Starting Phase 2: Яндекс.Карты')
      // Здесь будет переход к карте
      alert('Переходим к Фазе 2: Яндекс.Карты!')
    }

    return {
      startPhase2
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  font-size: 2rem;
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
}

.nav-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Main */
.app-main {
  flex: 1;
  padding: 2rem 0;
  display: flex;
  align-items: center;
}

.status-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-icon {
  font-size: 2rem;
}

.status-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.status-desc {
  color: #666;
  font-size: 0.9rem;
}

.next-phase {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.next-phase h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.next-phase p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .status-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>
