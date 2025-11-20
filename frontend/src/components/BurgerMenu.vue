<template>
  <div class="burger-menu">
    <!-- Кнопка бургер-меню -->
    <button 
      class="burger-btn"
      :class="{ 'active': isOpen }"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Затемнение фона -->
    <div 
      v-if="isOpen"
      class="menu-overlay"
      @click="toggleMenu"
    ></div>

    <!-- Само меню -->
    <div 
      class="menu-sidebar"
      :class="{ 'open': isOpen }"
    >
      <!-- Заголовок меню -->
      <div class="menu-header">
        <h3>🗺️ MapChap</h3>
        <button class="close-btn" @click="toggleMenu">✕</button>
      </div>

      <!-- Навигация -->
      <nav class="menu-nav">
        <template v-if="isAuthenticated">
          <!-- Профиль -->
          <div class="menu-item profile-item" @click="openPanel('profile')">
            <div class="profile-avatar">
              {{ user.avatar }}
            </div>
            <div class="profile-info">
              <strong>{{ user.name }}</strong>
              <span class="profile-subtitle">@{{ user.username }}</span>
              <span class="profile-role">{{ user.role === 'business_owner' ? 'Владелец бизнеса' : 'Пользователь' }}</span>
            </div>
          </div>

          <div class="menu-divider"></div>
        </template>

        <!-- Основная навигация -->
        <button class="menu-item" @click="openPanel('business')">
          <span class="menu-icon">💼</span>
          <span class="menu-text">Для бизнеса</span>
          <span class="menu-arrow">›</span>
        </button>

        <button class="menu-item" @click="openPanel('blog')">
          <span class="menu-icon">📝</span>
          <span class="menu-text">Блог MapChap</span>
          <span class="menu-arrow">›</span>
        </button>

        <button class="menu-item" @click="openPanel('about')">
          <span class="menu-icon">ℹ️</span>
          <span class="menu-text">О приложении</span>
          <span class="menu-arrow">›</span>
        </button>

        <!-- Авторизация -->
        <template v-if="!isAuthenticated">
          <div class="menu-divider"></div>
          <button class="menu-item auth-item" @click="initAuth">
            <span class="menu-icon">🔗</span>
            <span class="menu-text">Войти через Telegram</span>
            <span class="menu-arrow">›</span>
          </button>
        </template>
      </nav>

      <!-- Футер меню -->
      <div class="menu-footer">
        <p>MapChap v3.0</p>
        <p>С любовью для бизнеса ❤️</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'BurgerMenu',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    
    const { isBurgerMenuOpen: isOpen } = storeToRefs(uiStore)
    const { isAuthenticated, user } = storeToRefs(authStore)

    const { toggleBurgerMenu, openPanel } = uiStore
    const { initTelegramAuth } = authStore

    const toggleMenu = () => {
      toggleBurgerMenu()
    }

    const openPanelWithClose = (panelName) => {
      openPanel(panelName)
    }

    const initAuth = () => {
      initTelegramAuth()
      toggleBurgerMenu()
    }

    return {
      isOpen,
      user,
      isAuthenticated,
      toggleMenu,
      openPanel: openPanelWithClose,
      initAuth
    }
  }
}
</script>

<style scoped>
/* Стили остаются такими же как в предыдущей версии */
/* Только обновляем z-index для правильного отображения */
.burger-btn {
  z-index: 1001;
}

.menu-overlay {
  z-index: 999;
}

.menu-sidebar {
  z-index: 1000;
}
</style>
