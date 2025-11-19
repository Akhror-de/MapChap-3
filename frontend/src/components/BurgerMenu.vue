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
        <h3>Меню MapChap</h3>
        <button class="close-btn" @click="toggleMenu">✕</button>
      </div>

      <!-- Навигация -->
      <nav class="menu-nav">
        <!-- Профиль -->
        <div class="menu-item profile-item" @click="openModal('profile')">
          <div class="profile-avatar">
            {{ user.avatar }}
          </div>
          <div class="profile-info">
            <strong>{{ user.name }}</strong>
            <span class="profile-subtitle">Посмотреть профиль</span>
          </div>
        </div>

        <!-- Для бизнеса -->
        <button class="menu-item" @click="openModal('business')">
          <span class="menu-icon">💼</span>
          <span class="menu-text">Для бизнеса</span>
          <span class="menu-arrow">›</span>
        </button>

        <!-- Блог -->
        <button class="menu-item" @click="openModal('blog')">
          <span class="menu-icon">📝</span>
          <span class="menu-text">Блог MapChap</span>
          <span class="menu-arrow">›</span>
        </button>

        <!-- О приложении -->
        <button class="menu-item" @click="openModal('about')">
          <span class="menu-icon">ℹ️</span>
          <span class="menu-text">О приложении</span>
          <span class="menu-arrow">›</span>
        </button>
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
import { storeToRefs } from 'pinia'

export default {
  name: 'BurgerMenu',
  setup() {
    const uiStore = useUIStore()
    const { isBurgerMenuOpen: isOpen, user } = storeToRefs(uiStore)
    const { toggleBurgerMenu, openModal } = uiStore

    return {
      isOpen,
      user,
      toggleMenu: toggleBurgerMenu,
      openModal
    }
  }
}
</script>

<style scoped>
.burger-menu {
  position: relative;
}

/* Кнопка бургера */
.burger-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: white;
  border: none;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.burger-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.burger-btn span {
  width: 20px;
  height: 2px;
  background: #333;
  transition: all 0.3s ease;
}

.burger-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.burger-btn.active span:nth-child(2) {
  opacity: 0;
}

.burger-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Затемнение фона */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Боковая панель меню */
.menu-sidebar {
  position: fixed;
  top: 0;
  left: -320px;
  width: 320px;
  height: 100%;
  background: white;
  z-index: 1000;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.menu-sidebar.open {
  left: 0;
}

/* Заголовок меню */
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.menu-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Навигация */
.menu-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: left;
  gap: 1rem;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.profile-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
  margin-bottom: 0.5rem;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.profile-info {
  flex: 1;
}

.profile-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.profile-subtitle {
  font-size: 0.85rem;
  color: #666;
}

.menu-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 0.95rem;
}

.menu-arrow {
  color: #999;
  font-size: 1.2rem;
}

/* Футер меню */
.menu-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
  color: #666;
  font-size: 0.85rem;
}

.menu-footer p {
  margin: 0.25rem 0;
}

/* Адаптивность */
@media (max-width: 480px) {
  .menu-sidebar {
    width: 280px;
    left: -280px;
  }
  
  .burger-btn {
    top: 0.5rem;
    left: 0.5rem;
  }
}
</style>
