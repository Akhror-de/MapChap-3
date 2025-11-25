<template>
  <div class="burger-menu-system">
    <!-- Overlay -->
    <div 
      v-if="isMenuOpen || isPanelOpen"
      class="menu-overlay"
      @click="closeAll"
    ></div>

    <!-- Main Burger Menu -->
    <div class="burger-menu" :class="{ open: isMenuOpen }">
      <!-- Header -->
      <div class="menu-header">
        <div class="user-section" v-if="authStore.isAuthenticated">
          <div class="user-avatar">
            {{ authStore.user?.avatar || '👤' }}
          </div>
          <div class="user-info">
            <h3>{{ authStore.user?.name || 'Пользователь' }}</h3>
            <p>{{ authStore.user?.role === 'business_owner' ? 'Владелец бизнеса' : 'Пользователь' }}</p>
          </div>
        </div>
        <div class="auth-section" v-else>
          <div class="auth-avatar">👤</div>
          <div class="auth-info">
            <h3>Гость</h3>
            <p>Войдите для доступа ко всем функциям</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="menu-nav">
        <button class="nav-item" @click="openPanel('profile')">
          <span class="nav-icon">👤</span>
          <span class="nav-text">Мой профиль</span>
        </button>

        <button class="nav-item" @click="openPanel('business')">
          <span class="nav-icon">💼</span>
          <span class="nav-text">Для бизнеса</span>
        </button>

        <button class="nav-item" @click="openPanel('blog')">
          <span class="nav-icon">📝</span>
          <span class="nav-text">Блог MapChap</span>
        </button>

        <button class="nav-item" @click="openPanel('about')">
          <span class="nav-icon">ℹ️</span>
          <span class="nav-text">О приложении</span>
        </button>

        <!-- Auth Actions -->
        <div class="auth-actions" v-if="!authStore.isAuthenticated">
          <button class="auth-button" @click="initAuth">
            <span class="auth-icon">🔗</span>
            <span class="auth-text">Войти через Telegram</span>
          </button>
        </div>

        <div class="user-actions" v-else>
          <button class="logout-button" @click="logout">
            <span class="logout-icon">🚪</span>
            <span class="logout-text">Выйти</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- Side Panels -->
    <div class="side-panels">
      <ProfilePanel v-if="currentPanel === 'profile'" />
      <BusinessPanel v-if="currentPanel === 'business'" />
      <BlogPanel v-if="currentPanel === 'blog'" />
      <AboutPanel v-if="currentPanel === 'about'" />
      <ArticlePanel 
        v-if="currentPanel === 'article' && currentArticle" 
        :article="currentArticle" 
      />
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import ProfilePanel from './ProfilePanel.vue'
import BusinessPanel from './BusinessPanel.vue'
import BlogPanel from './BlogPanel.vue'
import AboutPanel from './AboutPanel.vue'
import ArticlePanel from './ArticlePanel.vue'

export default {
  name: 'BurgerMenu',
  components: {
    ProfilePanel,
    BusinessPanel,
    BlogPanel,
    AboutPanel,
    ArticlePanel
  },
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    
    const { 
      isBurgerMenuOpen: isMenuOpen, 
      currentPanel, 
      currentArticle 
    } = storeToRefs(uiStore)

    const { 
      toggleBurgerMenu, 
      openPanel, 
      closePanel,
      showNotification
    } = uiStore
    
    const { initTelegramAuth, logout } = authStore

    const isPanelOpen = computed(() => currentPanel.value !== null)

    const openPanelHandler = (panelName) => {
      openPanel(panelName)
      toggleBurgerMenu() // Закрываем меню после выбора
    }

    const closeAll = () => {
      closePanel()
      if (isMenuOpen.value) {
        toggleBurgerMenu()
      }
    }

    const initAuth = () => {
      initTelegramAuth()
      showNotification('Авторизация через Telegram!', 'success')
      toggleBurgerMenu()
    }

    const handleLogout = () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        logout()
        closeAll()
        showNotification('Вы успешно вышли из аккаунта', 'success')
      }
    }

    return {
      authStore,
      isMenuOpen,
      isPanelOpen,
      currentPanel,
      currentArticle,
      openPanel: openPanelHandler,
      closeAll,
      initAuth,
      logout: handleLogout
    }
  }
}
</script>

<style scoped>
.burger-menu-system {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.burger-menu {
  position: fixed;
  top: 0;
  left: -320px;
  width: 320px;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  z-index: 1002;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.burger-menu.open {
  transform: translateX(320px);
}

.menu-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
}

.user-section, .auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar, .auth-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-info h3, .auth-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.user-info p, .auth-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.menu-nav {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
  text-align: left;
}

.nav-item:hover {
  background: var(--bg-tertiary);
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
}

.auth-actions, .user-actions {
  padding: 1rem 1.5rem;
  margin-top: auto;
}

.auth-button, .logout-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.auth-button {
  background: #0088cc;
  color: white;
}

.logout-button {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.side-panels {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1003;
  pointer-events: none;
}

.side-panels > * {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .burger-menu {
    width: 280px;
  }
  
  .burger-menu.open {
    transform: translateX(280px);
  }
}
</style>
