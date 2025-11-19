import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Состояние меню и модальных окон
  const isBurgerMenuOpen = ref(false)
  const activeModal = ref(null) // 'profile', 'business', 'blog', 'about'
  
  // Данные пользователя (временные, пока нет бэкенда)
  const user = ref({
    name: 'Ахрор Хабибуллаев',
    avatar: '👨‍💼',
    favoriteCategories: ['🍕 Еда', '🛍️ Покупки', '💄 Красота'],
    favorites: ['Ресторан "Суши-Мастер"', 'ТЦ "Мега"', 'Салон "Клео"']
  })

  // Действия
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }

  const openModal = (modalName) => {
    activeModal.value = modalName
    isBurgerMenuOpen.value = false // Закрываем меню при открытии модалки
  }

  const closeModal = () => {
    activeModal.value = null
  }

  return {
    isBurgerMenuOpen,
    activeModal,
    user,
    toggleBurgerMenu,
    openModal,
    closeModal
  }
})
