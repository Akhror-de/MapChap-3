<template>
  <div class="burger-menu">
    <!-- Кнопка бургера -->
    <button class="burger-btn" @click="toggleMenu" :class="{ active: isOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Затемнение -->
    <div v-if="isOpen" class="menu-overlay" @click="closeMenu"></div>

    <!-- Меню -->
    <div class="menu-content" :class="{ open: isOpen }">
      <div class="menu-header">
        <h3>Меню</h3>
        <button class="close-btn" @click="closeMenu">×</button>
      </div>

      <div class="menu-items">
        <!-- Профиль -->
        <div class="menu-section">
          <h4>Аккаунт</h4>
          <button class="menu-item" @click="openProfile">
            <span class="menu-icon">👤</span>
            <span class="menu-text">Мой профиль</span>
          </button>
          <button class="menu-item" @click="openSettings">
            <span class="menu-icon">⚙️</span>
            <span class="menu-text">Настройки</span>
          </button>
          <button class="menu-item" @click="openFavorites">
            <span class="menu-icon">❤️</span>
            <span class="menu-text">Избранное</span>
          </button>
        </div>

        <!-- Бизнес -->
        <div class="menu-section">
          <h4>Для бизнеса</h4>
          <button class="menu-item" @click="openCreateBusiness">
            <span class="menu-icon">➕</span>
            <span class="menu-text">Создать бизнес</span>
          </button>
          <button class="menu-item" @click="openEditBusiness">
            <span class="menu-icon">✏️</span>
            <span class="menu-text">Редактировать бизнес</span>
          </button>
          <button class="menu-item" @click="openBusinessPanel">
            <span class="menu-icon">🏢</span>
            <span class="menu-text">Панель управления</span>
          </button>
        </div>

        <!-- Блог -->
        <div class="menu-section">
          <h4>BlogChap</h4>
          <button class="menu-item" @click="openBlog">
            <span class="menu-icon">📝</span>
            <span class="menu-text">Читать блог</span>
          </button>
          <button class="menu-item" @click="openCreatePost">
            <span class="menu-icon">🖊️</span>
            <span class="menu-text">Написать пост</span>
          </button>
          <button class="menu-item" @click="openMyPosts">
            <span class="menu-icon">📚</span>
            <span class="menu-text">Мои публикации</span>
          </button>
        </div>

        <!-- Информация -->
        <div class="menu-section">
          <h4>Информация</h4>
          <button class="menu-item" @click="openAbout">
            <span class="menu-icon">ℹ️</span>
            <span class="menu-text">О приложении</span>
          </button>
          <button class="menu-item" @click="openHelp">
            <span class="menu-icon">❓</span>
            <span class="menu-text">Помощь</span>
          </button>
          <button class="menu-item" @click="openContact">
            <span class="menu-icon">📞</span>
            <span class="menu-text">Связаться с нами</span>
          </button>
        </div>
      </div>

      <div class="menu-footer">
        <button class="logout-btn" @click="logout">
          <span class="menu-icon">🚪</span>
          <span class="menu-text">Выйти</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'BurgerMenu',
  emits: ['open-profile', 'open-business', 'open-blog', 'open-about'],
  setup(props, { emit }) {
    const isOpen = ref(false)

    const toggleMenu = () => {
      isOpen.value = !isOpen.value
    }

    const closeMenu = () => {
      isOpen.value = false
    }

    const openProfile = () => {
      emit('open-profile')
      closeMenu()
    }

    const openSettings = () => {
      alert('Открыть настройки')
      closeMenu()
    }

    const openFavorites = () => {
      alert('Открыть избранное')
      closeMenu()
    }

    const openCreateBusiness = () => {
      emit('open-business', 'create')
      closeMenu()
    }

    const openEditBusiness = () => {
      emit('open-business', 'edit')
      closeMenu()
    }

    const openBusinessPanel = () => {
      emit('open-business', 'panel')
      closeMenu()
    }

    const openBlog = () => {
      emit('open-blog', 'read')
      closeMenu()
    }

    const openCreatePost = () => {
      emit('open-blog', 'create')
      closeMenu()
    }

    const openMyPosts = () => {
      emit('open-blog', 'my-posts')
      closeMenu()
    }

    const openAbout = () => {
      emit('open-about')
      closeMenu()
    }

    const openHelp = () => {
      alert('Открыть помощь')
      closeMenu()
    }

    const openContact = () => {
      alert('Открыть контакты')
      closeMenu()
    }

    const logout = () => {
      if (confirm('Вы уверены, что хотите выйти?')) {
        alert('Выход из системы')
        closeMenu()
      }
    }

    return {
      isOpen,
      toggleMenu,
      closeMenu,
      openProfile,
      openSettings,
      openFavorites,
      openCreateBusiness,
      openEditBusiness,
      openBusinessPanel,
      openBlog,
      openCreatePost,
      openMyPosts,
      openAbout,
      openHelp,
      openContact,
      logout
    }
  }
}
</script>

<style scoped>
.burger-menu {
  position: relative;
}

.burger-btn {
  width: 44px;
  height: 44px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1002;
}

.burger-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.burger-btn span {
  width: 20px;
  height: 2px;
  background: #333;
  transition: all 0.3s ease;
  transform-origin: center;
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

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
}

.menu-content {
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.menu-content.open {
  right: 0;
}

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
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.menu-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.menu-section {
  margin-bottom: 1.5rem;
}

.menu-section h4 {
  padding: 0 1.5rem 0.5rem;
  margin: 0;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-item {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background 0.3s ease;
  color: #333;
}

.menu-item:hover {
  background: #f8f9ff;
}

.menu-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.menu-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.menu-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.logout-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  color: #dc3545;
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

@media (max-width: 480px) {
  .menu-content {
    width: 300px;
  }
}
</style>
