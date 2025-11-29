import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useUIStore } from '../stores/uiStore'
import { validateEmail, validatePhone, validateUsername, validateName, validateBio, formatPhone } from '../utils/validation'
import { validateImageFile, compressImage, createImagePreview } from '../utils/fileHelpers'

export const useProfile = () => {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const uiStore = useUIStore()

  const { user, isAuthenticated } = authStore
  const { favorites, userStats } = profileStore
  const { showNotification } = uiStore

  // State
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const activeTab = ref('edit')
  const formDirty = ref(false)
  const uploadProgress = ref(0)
  const validationErrors = ref({})

  // Computed
  const hasChanges = computed(() => {
    if (!user.value || !formDirty.value) return false
    
    const hasBasicChanges = 
      editForm.first_name !== user.value.first_name ||
      editForm.last_name !== user.value.last_name ||
      editForm.username !== (user.value.username || '') ||
      editForm.email !== (user.value.email || '') ||
      editForm.bio !== (user.value.bio || '') ||
      editForm.city !== (user.value.city || '') ||
      editForm.phone !== (user.value.phone || '') ||
      editForm.photo_url !== (user.value.photo_url || '')

    const hasNotificationChanges = 
      JSON.stringify(editForm.notifications) !== JSON.stringify(user.value.notifications || {
        email: true,
        news: true,
        promotions: false
      })

    return hasBasicChanges || hasNotificationChanges
  })

  const isValidForm = computed(() => {
    return Object.keys(validationErrors.value).length === 0
  })

  // Form data
  const editForm = ref({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    bio: '',
    city: '',
    phone: '',
    photo_url: '',
    notifications: {
      email: true,
      news: true,
      promotions: false
    }
  })

  // Methods
  const validateField = (field, value) => {
    const errors = []

    switch (field) {
      case 'first_name':
      case 'last_name':
        if (!validateName(value)) {
          errors.push('Имя и фамилия должны содержать от 2 до 50 символов')
        }
        break
      
      case 'email':
        if (value && !validateEmail(value)) {
          errors.push('Введите корректный email адрес')
        }
        break
      
      case 'phone':
        if (value && !validatePhone(value)) {
          errors.push('Введите корректный номер телефона')
        }
        break
      
      case 'username':
        if (value && !validateUsername(value)) {
          errors.push('Username может содержать только латинские буквы, цифры и подчеркивания (3-20 символов)')
        }
        break
      
      case 'bio':
        if (!validateBio(value)) {
          errors.push('Биография не может превышать 200 символов')
        }
        break
    }

    if (errors.length > 0) {
      validationErrors.value[field] = errors
    } else {
      delete validationErrors.value[field]
    }
  }

  const validateForm = () => {
    validateField('first_name', editForm.value.first_name)
    validateField('last_name', editForm.value.last_name)
    validateField('email', editForm.value.email)
    validateField('phone', editForm.value.phone)
    validateField('username', editForm.value.username)
    validateField('bio', editForm.value.bio)
    return isValidForm.value
  }

  const markFormDirty = () => {
    formDirty.value = true
  }

  const resetForm = () => {
    if (!user.value) return
    
    editForm.value = {
      first_name: user.value.first_name || '',
      last_name: user.value.last_name || '',
      username: user.value.username || '',
      email: user.value.email || '',
      bio: user.value.bio || '',
      city: user.value.city || '',
      phone: user.value.phone || '',
      photo_url: user.value.photo_url || '',
      notifications: user.value.notifications || {
        email: true,
        news: true,
        promotions: false
      }
    }
    formDirty.value = false
    validationErrors.value = {}
  }

  const updateProfile = async () => {
    if (!hasChanges.value || isSubmitting.value || !validateForm()) return
    
    isSubmitting.value = true
    try {
      // Форматируем телефон перед отправкой
      const formData = {
        ...editForm.value,
        phone: editForm.value.phone ? formatPhone(editForm.value.phone) : ''
      }

      await profileStore.updateUserProfile(formData)
      await authStore.updateUser(formData)
      
      showNotification('Профиль успешно обновлен', 'success')
      formDirty.value = false
    } catch (error) {
      console.error('Profile update error:', error)
      showNotification(error.message || 'Ошибка при обновлении профиля', 'error')
    } finally {
      isSubmitting.value = false
    }
  }

  const handleAvatarUpload = async (file) => {
    if (!file) return

    try {
      // Валидация файла
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Сжатие изображения
      uploadProgress.value = 30
      const compressedFile = await compressImage(file)
      
      // Создание превью
      uploadProgress.value = 70
      const previewUrl = await createImagePreview(compressedFile)
      
      // Обновление формы
      editForm.value.photo_url = previewUrl
      markFormDirty()
      uploadProgress.value = 100
      
      showNotification('Фото успешно загружено', 'success')
    } catch (error) {
      console.error('Avatar upload error:', error)
      showNotification(error.message || 'Ошибка при загрузке фото', 'error')
    } finally {
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    }
  }

  const removeAvatar = () => {
    editForm.value.photo_url = ''
    markFormDirty()
    showNotification('Фото удалено', 'success')
  }

  // Watchers
  watch(() => user.value, (newUser) => {
    if (newUser) {
      resetForm()
    }
  }, { immediate: true })

  // Дебаунс для валидации
  const debouncedValidation = {}
  const setupDebouncedValidation = (field) => {
    if (!debouncedValidation[field]) {
      debouncedValidation[field] = debounce((value) => {
        validateField(field, value)
      }, 500)
    }
  }

  // Дебаунс функция
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  return {
    // State
    isLoading,
    isSubmitting,
    activeTab,
    formDirty,
    uploadProgress,
    validationErrors,
    
    // Computed
    hasChanges,
    isValidForm,
    isAuthenticated,
    user,
    favorites,
    userStats,
    
    // Form
    editForm,
    
    // Methods
    validateField: (field, value) => {
      setupDebouncedValidation(field)
      debouncedValidation[field](value)
    },
    markFormDirty,
    resetForm,
    updateProfile,
    handleAvatarUpload,
    removeAvatar,
    validateForm
  }
}
