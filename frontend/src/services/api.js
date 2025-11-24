const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com'

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

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getOffers(filters = {}) {
    return this.request('/api/offers', { method: 'GET' })
  }

  async createOffer(offerData) {
    return this.request('/api/offers', {
      method: 'POST',
      body: offerData,
    })
  }

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
}

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
}

export const apiService = import.meta.env.PROD 
  ? new ApiService() 
  : new MockApiService()

export { SUPPORT_CONTACTS }
