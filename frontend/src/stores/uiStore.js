import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Состояние меню и модальных окон
  const isBurgerMenuOpen = ref(false)
  const activeModal = ref(null)
  const isDarkTheme = ref(false)
  
  // Данные пользователя
  const user = ref({
    name: 'Ахрор Хабибуллаев',
    avatar: '👨‍💼',
    email: 'khabibullaevakhrorjon@gmail.com',
    favoriteCategories: ['🍕 Еда', '🛍️ Покупки', '💄 Красота'],
    favorites: ['Ресторан "Суши-Мастер"', 'ТЦ "Мега"', 'Салон "Клео"']
  })

  // Вычисляемые свойства
  const themeClass = computed(() => isDarkTheme.value ? 'dark-theme' : 'light-theme')

  // Действия
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }

  const openModal = (modalName) => {
    activeModal.value = modalName
    isBurgerMenuOpen.value = false
  }

  const closeModal = () => {
    activeModal.value = null
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    localStorage.setItem('mapchap-theme', isDarkTheme.value ? 'dark' : 'light')
    
    if (isDarkTheme.value) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }

  // Инициализация темы
  const initTheme = () => {
    const savedTheme = localStorage.getItem('mapchap-theme')
    if (savedTheme) {
      isDarkTheme.value = savedTheme === 'dark'
      if (isDarkTheme.value) {
        document.body.classList.add('dark-theme')
      }
    }
  }

  return {
    isBurgerMenuOpen,
    activeModal,
    user,
    isDarkTheme,
    themeClass,
    toggleBurgerMenu,
    openModal,
    closeModal,
    toggleTheme,
    initTheme
  }
})
