const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com'

// Контактные данные для поддержки (2024 год)
export const SUPPORT_CONTACTS = {
  email: 'khabibullaevakhrorjon@gmail.com',
  phone: '+7 (999) 821-47-58',
  founder: 'Хабибуллаев Ахрор',
  financeDirector: 'Яна Владимировна Ивченко',
  creationYear: 2024,
  social: {
    telegram: '@mapchap_support',
    website: 'mapchap.com',
    vk: 'vk.com/mapchap'
  }
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Offers
  async getOffers(filters = {}) {
    return this.request('/api/offers', {
      method: 'GET',
    })
  }

  async createOffer(offerData) {
    return this.request('/api/offers', {
      method: 'POST',
      body: offerData,
    })
  }

  async updateOffer(offerId, offerData) {
    return this.request(`/api/offers/${offerId}`, {
      method: 'PUT',
      body: offerData,
    })
  }

  async deleteOffer(offerId) {
    return this.request(`/api/offers/${offerId}`, {
      method: 'DELETE',
    })
  }

  // Articles
  async getArticles() {
    return this.request('/api/articles')
  }

  async createArticle(articleData) {
    return this.request('/api/articles', {
      method: 'POST',
      body: articleData,
    })
  }

  async getArticle(articleId) {
    return this.request(`/api/articles/${articleId}`)
  }

  // Auth
  async telegramAuth(authData) {
    return this.request('/api/auth/telegram', {
      method: 'POST',
      body: authData,
    })
  }

  async registerBusiness(userId, businessData) {
    return this.request(`/api/users/${userId}/business`, {
      method: 'POST',
      body: businessData,
    })
  }

  // Upload
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Note: Don't set Content-Type for FormData, browser will set it with boundary
      },
    })
  }

  // Analytics
  async getBusinessStats(userId) {
    return this.request(`/api/users/${userId}/stats`)
  }

  async trackView(offerId) {
    return this.request(`/api/offers/${offerId}/view`, {
      method: 'POST',
    })
  }

  async trackLike(offerId) {
    return this.request(`/api/offers/${offerId}/like`, {
      method: 'POST',
    })
  }
}

// Mock service for development
class MockApiService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  }

  async getOffers() {
    await this.delay(500)
    return { offers: [], total: 0 }
  }

  async createOffer(offerData) {
    await this.delay(800)
    return { 
      id: Date.now(),
      ...offerData,
      createdAt: new Date().toISOString()
    }
  }

  async uploadImage(file) {
    await this.delay(1000)
    return { 
      url: URL.createObjectURL(file),
      filename: file.name
    }
  }

  // Auth methods
  async telegramAuth(authData) {
    await this.delay(800)
    return {
      user: {
        id: authData.id,
        name: `${authData.firstName} ${authData.lastName || ''}`.trim(),
        username: authData.username,
        avatar: '👤',
        email: `${authData.username}@telegram.org`,
        phone: 'Не указан',
        role: 'user',
        registrationDate: new Date().toISOString(),
        stats: {
          offers: 0,
          articles: 0,
          favorites: 0
        }
      },
      token: 'mock-jwt-token'
    }
  }

  async registerBusiness(userId, businessData) {
    await this.delay(800)
    return {
      success: true,
      user: {
        role: 'business_owner',
        businessInfo: businessData
      }
    }
  }

  // Articles methods
  async getArticles() {
    await this.delay(500)
    return { articles: [] }
  }

  async createArticle(articleData) {
    await this.delay(800)
    return {
      id: Date.now(),
      ...articleData,
      createdAt: new Date().toISOString()
    }
  }
}

// Export appropriate service based on environment
export const apiService = import.meta.env.PROD 
  ? new ApiService() 
  : new MockApiService()

// УДАЛИТЬ ЭТУ СТРОКУ - она вызывает дублирование экспорта
// export { SUPPORT_CONTACTS }
