// Composable для локализации
import { ref, computed } from 'vue'
import { translations, LANGUAGES, getTranslation } from '../locales/index.js'

// Глобальный стейт языка
const currentLanguage = ref(localStorage.getItem('mapchap-language') || 'ru')

export function useLocale() {
  // Получить текущий язык
  const language = computed(() => currentLanguage.value)
  
  // Список языков
  const languages = LANGUAGES
  
  // Функция перевода
  const t = (key) => {
    return getTranslation(key, currentLanguage.value)
  }
  
  // Установить язык
  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      currentLanguage.value = langCode
      localStorage.setItem('mapchap-language', langCode)
      return true
    }
    return false
  }
  
  // Получить информацию о языке
  const getCurrentLanguageInfo = computed(() => {
    return LANGUAGES.find(l => l.code === currentLanguage.value) || LANGUAGES[0]
  })
  
  return {
    language,
    languages,
    t,
    setLanguage,
    getCurrentLanguageInfo
  }
}
