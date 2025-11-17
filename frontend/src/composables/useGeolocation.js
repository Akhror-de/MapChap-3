import { ref } from 'vue'

export function useGeolocation() {
  const location = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      isLoading.value = true
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          isLoading.value = false
          resolve(location.value)
        },
        (err) => {
          error.value = err.message
          isLoading.value = false
          reject(err)
        }
      )
    })
  }

  return {
    location,
    error,
    isLoading,
    getCurrentLocation
  }
}
