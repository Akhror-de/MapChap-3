const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Контактные данные для поддержки
export const SUPPORT_CONTACTS = {
  email: 'khabibullaevakhrorjon@gmail.com',
  phone: '+7 (999) 821-47-58',
  founder: 'Хабибуллаев Ахрор',
  financeDirector: 'Яна Владимировна Ивченко'
}

export const apiService = {
  async getOffers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers`)
      if (!response.ok) throw new Error('Network response was not ok')
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  async createOffer(offer) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offer)
      })
      if (!response.ok) throw new Error('Network response was not ok')
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  async uploadImage(file) {
    // TODO: Реализовать загрузку изображений
    return Promise.resolve({ url: 'https://via.placeholder.com/300' })
  },

  // Метод для связи с поддержкой
  async contactSupport(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          supportEmail: SUPPORT_CONTACTS.email
        })
      })
      if (!response.ok) throw new Error('Network response was not ok')
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}
