const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
  }
}
