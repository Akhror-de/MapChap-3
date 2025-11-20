<template>
  <div class="burger-menu-system">
    <!-- Overlay -->
    <div 
      v-if="isMenuOpen || isPanelOpen"
      class="menu-overlay"
      :class="{ 'panel-open': isPanelOpen }"
      @click="closeAll"
    ></div>

    <!-- Main Burger Menu -->
    <div class="burger-menu" :class="{ open: isMenuOpen }">
      <!-- Header -->
      <div class="menu-header">
        <div class="user-section" v-if="isAuthenticated">
          <div class="user-avatar large">
            {{ user.avatar }}
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-role">{{ user.role === 'business_owner' ? 'Владелец бизнеса' : 'Пользователь' }}</p>
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
        <div class="nav-section">
          <h4 class="section-title">Основное</h4>
          <div class="nav-items">
            <button class="nav-item" @click="openPanel('profile')" :class="{ active: currentPanel === 'profile' }">
              <span class="nav-icon">👤</span>
              <span class="nav-text">Мой профиль</span>
              <span class="nav-badge" v-if="!isAuthenticated">Войти</span>
            </button>

            <button class="nav-item" @click="openPanel('business')" :class="{ active: currentPanel === 'business' }">
              <span class="nav-icon">💼</span>
              <span class="nav-text">Для бизнеса</span>
              <span class="nav-badge" v-if="businessStats.activeOffers > 0">{{ businessStats.activeOffers }}</span>
            </button>

            <button class="nav-item" @click="openPanel('blog')" :class="{ active: currentPanel === 'blog' }">
              <span class="nav-icon">📝</span>
              <span class="nav-text">Блог MapChap</span>
            </button>
          </div>
        </div>

        <div class="nav-section">
          <h4 class="section-title">О проекте</h4>
          <div class="nav-items">
            <button class="nav-item" @click="openPanel('about')" :class="{ active: currentPanel === 'about' }">
              <span class="nav-icon">ℹ️</span>
              <span class="nav-text">О приложении</span>
            </button>
          </div>
        </div>

        <!-- Auth Button -->
        <div class="auth-actions" v-if="!isAuthenticated">
          <button class="auth-button" @click="initAuth">
            <span class="auth-icon">🔗</span>
            <span class="auth-text">Войти через Telegram</span>
          </button>
        </div>

        <!-- User Actions -->
        <div class="user-actions" v-else>
          <button class="logout-button" @click="logout">
            <span class="logout-icon">🚪</span>
            <span class="logout-text">Выйти</span>
          </button>
        </div>
      </nav>

      <!-- Footer -->
      <div class="menu-footer">
        <p class="app-version">MapChap v3.0</p>
        <p class="app-copyright">С любовью для бизнеса ❤️</p>
      </div>
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
import { useBusinessStore } from '../stores/businessStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// Import all panel components
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
    const businessStore = useBusinessStore()
    
    const { 
      isBurgerMenuOpen: isMenuOpen, 
      currentPanel, 
      currentArticle 
    } = storeToRefs(uiStore)
    
    const { isAuthenticated, user } = storeToRefs(authStore)
    const { getBusinessStats } = storeToRefs(businessStore)

    const { 
      toggleBurgerMenu, 
      openPanel, 
      closePanel,
      openArticle 
    } = uiStore
    
    const { initTelegramAuth, logout } = authStore

    const businessStats = computed(() => getBusinessStats.value)
    const isPanelOpen = computed(() => currentPanel.value !== null)

    const openPanelWithClose = (panelName) => {
      openPanel(panelName)
    }

    const closeAll = () => {
      uiStore.closePanel()
      uiStore.toggleBurgerMenu()
    }

    const initAuth = () => {
      initTelegramAuth()
      uiStore.showNotification('Успешная авторизация через Telegram!', 'success')
    }

    const handleLogout = () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        logout()
        uiStore.showNotification('Вы успешно вышли из аккаунта', 'success')
      }
    }

    return {
      isMenuOpen,
      isPanelOpen,
      currentPanel,
      currentArticle,
      user,
      isAuthenticated,
      businessStats,
      toggleBurgerMenu,
      openPanel: openPanelWithClose,
      openArticle,
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

/* Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
  z-index: 1001;
}

.menu-overlay.panel-open {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

/* Main Menu */
.burger-menu {
  position: fixed;
  top: 0;
  left: -320px;
  width: 320px;
  height: 100vh;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl);
  z-index: 1002;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.burger-menu.open {
  left: 0;
}

/* Header */
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

.user-avatar.large, .auth-avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-info h3, .auth-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.user-info p, .auth-info p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Navigation */
.menu-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 1.5rem 0.5rem 1.5rem;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  text-align: left;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-tertiary);
}

.nav-item.active {
  background: var(--primary);
  color: white;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: var(--accent);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-badge {
  background: var(--accent);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* Auth Actions */
.auth-actions, .user-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.auth-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #0088cc, #00a2e8);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.auth-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.logout-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.logout-button:hover {
  background: var(--bg-secondary);
  border-color: var(--text-muted);
}

/* Footer */
.menu-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.app-version {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.app-copyright {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Side Panels */
.side-panels {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1003;
  pointer-events: none;
}

.side-panels > * {
  pointer-events: auto;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .burger-menu {
    width: 280px;
    left: -280px;
  }
}

@media (max-width: 480px) {
  .burger-menu {
    width: 260px;
    left: -260px;
  }
  
  .menu-header {
    padding: 1rem;
  }
  
  .user-avatar.large, .auth-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
}
</style>
