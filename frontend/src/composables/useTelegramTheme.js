import { ref, onMounted, watch } from 'vue'

export function useTelegramTheme() {
  const isTelegram = ref(false)
  const tgTheme = ref('light')
  const tgColors = ref({})

  const initTelegramTheme = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      isTelegram.value = true
      
      // Получаем тему Telegram
      tgTheme.value = tg.colorScheme || 'light'
      tgColors.value = tg.themeParams || {}
      
      // Инициализируем тему приложения в соответствии с Telegram
      applyTelegramTheme()
      
      // Слушаем изменения темы
      tg.onEvent('themeChanged', () => {
        tgTheme.value = tg.colorScheme
        applyTelegramTheme()
      })
      
      // Расширяем приложение на весь экран
      tg.expand()
    }
  }

  const applyTelegramTheme = () => {
    const root = document.documentElement
    const theme = tgTheme.value
    
    if (isTelegram.value && tgColors.value) {
      // Используем цвета из Telegram
      root.style.setProperty('--tg-bg-color', tgColors.value.bg_color || '#ffffff')
      root.style.setProperty('--tg-text-color', tgColors.value.text_color || '#000000')
      root.style.setProperty('--tg-hint-color', tgColors.value.hint_color || '#999999')
      root.style.setProperty('--tg-link-color', tgColors.value.link_color || '#2678b6')
      root.style.setProperty('--tg-button-color', tgColors.value.button_color || '#50a8eb')
      root.style.setProperty('--tg-button-text-color', tgColors.value.button_text_color || '#ffffff')
      root.style.setProperty('--tg-secondary-bg-color', tgColors.value.secondary_bg_color || '#f1f1f1')
    } else {
      // Стандартные цвета для веб-версии
      if (theme === 'dark') {
        root.style.setProperty('--tg-bg-color', '#1c1c1d')
        root.style.setProperty('--tg-text-color', '#ffffff')
        root.style.setProperty('--tg-hint-color', '#98989e')
        root.style.setProperty('--tg-link-color', '#5eafff')
        root.style.setProperty('--tg-button-color', '#50a8eb')
        root.style.setProperty('--tg-button-text-color', '#ffffff')
        root.style.setProperty('--tg-secondary-bg-color', '#2d2d2f')
      } else {
        root.style.setProperty('--tg-bg-color', '#ffffff')
        root.style.setProperty('--tg-text-color', '#000000')
        root.style.setProperty('--tg-hint-color', '#707579')
        root.style.setProperty('--tg-link-color', '#2678b6')
        root.style.setProperty('--tg-button-color', '#50a8eb')
        root.style.setProperty('--tg-button-text-color', '#ffffff')
        root.style.setProperty('--tg-secondary-bg-color', '#f1f1f1')
      }
    }
    
    // Применяем тему к документу
    document.documentElement.classList.toggle('tg-dark', theme === 'dark')
    document.documentElement.classList.toggle('tg-light', theme === 'light')
  }

  onMounted(() => {
    initTelegramTheme()
  })

  return {
    isTelegram,
    tgTheme,
    tgColors,
    applyTelegramTheme
  }
}
