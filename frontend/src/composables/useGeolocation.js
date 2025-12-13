import { ref } from 'vue'

export function useGeolocation() {
  const isLoading = ref(false)
  const error = ref(null)

  // Демо координаты Москвы для тестирования
  const DEMO_LOCATION = {
    latitude: 55.753215,
    longitude: 37.622504,
    accuracy: 100,
    isDemo: true
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      isLoading.value = true
      error.value = null

      // Проверяем поддержку геолокации
      if (!navigator.geolocation) {
        console.log('📍 Geolocation not supported, using demo location')
        isLoading.value = false
        resolve(DEMO_LOCATION)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          isLoading.value = false
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (err) => {
          isLoading.value = false
          console.log('📍 Geolocation error, using demo location:', err.message)
          // Используем демо локацию при ошибке
          resolve(DEMO_LOCATION)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000
        }
      )
    })
  }

  return {
    isLoading,
    error,
    getCurrentLocation
  }
}
