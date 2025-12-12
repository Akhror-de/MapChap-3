const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'

// Контактные данные для поддержки
export const SUPPORT_CONTACTS = {
  email: 'khabibullaevakhrorjon@gmail.com',
  phone: '+7 (999) 821-47-58',
  telegram: '@mapchap_support',
  founder: 'Хабибуллаев Ахрор',
  financeDirector: 'Яна Владимировна Ивченко',
  creationYear: 2024,
  social: {
    telegram: '@mapchap_official',
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

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(error.detail || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // ============ AUTH ============
  async telegramAuth(userData) {
    return this.request('/api/auth/telegram', {
      method: 'POST',
      body: userData,
    })
  }

  // ============ USERS ============
  async getUser(telegramId) {
    return this.request(`/api/users/${telegramId}`)
  }

  async updateUser(telegramId, updates) {
    return this.request(`/api/users/${telegramId}`, {
      method: 'PUT',
      body: updates,
    })
  }

  async updateFavorites(telegramId, offerId) {
    return this.request(`/api/users/${telegramId}/favorites`, {
      method: 'PUT',
      body: { offer_id: offerId },
    })
  }

  async updateFavoriteCategories(telegramId, categories) {
    return this.request(`/api/users/${telegramId}/favorite-categories`, {
      method: 'PUT',
      body: categories,
    })
  }

  async getUserHistory(telegramId, limit = 50) {
    return this.request(`/api/users/${telegramId}/history?limit=${limit}`)
  }

  async getUserFavorites(telegramId) {
    return this.request(`/api/users/${telegramId}/favorites`)
  }

  async updateLocation(telegramId, latitude, longitude) {
    return this.request(`/api/users/${telegramId}/location`, {
      method: 'POST',
      body: { latitude, longitude },
    })
  }

  // ============ VERIFICATION ============
  async verifyByINN(telegramId, inn) {
    return this.request(`/api/verification/inn?telegram_id=${telegramId}`, {
      method: 'POST',
      body: { inn },
    })
  }

  async verifyManually(telegramId, data) {
    return this.request(`/api/verification/manual?telegram_id=${telegramId}`, {
      method: 'POST',
      body: data,
    })
  }

  // ============ OFFERS ============
  async getOffers(params = {}) {
    const query = new URLSearchParams()
    if (params.category) query.append('category', params.category)
    if (params.lat) query.append('lat', params.lat)
    if (params.lng) query.append('lng', params.lng)
    if (params.radius) query.append('radius', params.radius)
    if (params.search) query.append('search', params.search)
    if (params.limit) query.append('limit', params.limit)
    if (params.skip) query.append('skip', params.skip)
    
    return this.request(`/api/offers?${query.toString()}`)
  }

  async getOffer(offerId) {
    return this.request(`/api/offers/${offerId}`)
  }

  async createOffer(telegramId, offerData) {
    return this.request(`/api/offers?telegram_id=${telegramId}`, {
      method: 'POST',
      body: offerData,
    })
  }

  async updateOffer(offerId, telegramId, updates) {
    return this.request(`/api/offers/${offerId}?telegram_id=${telegramId}`, {
      method: 'PUT',
      body: updates,
    })
  }

  async deleteOffer(offerId, telegramId) {
    return this.request(`/api/offers/${offerId}?telegram_id=${telegramId}`, {
      method: 'DELETE',
    })
  }

  async getUserOffers(telegramId) {
    return this.request(`/api/offers/user/${telegramId}`)
  }

  async trackOfferView(offerId, telegramId) {
    return this.request(`/api/offers/${offerId}/view?telegram_id=${telegramId}`, {
      method: 'POST',
    })
  }

  // ============ ARTICLES ============
  async getArticles(params = {}) {
    const query = new URLSearchParams()
    if (params.author_type) query.append('author_type', params.author_type)
    if (params.category) query.append('category', params.category)
    if (params.limit) query.append('limit', params.limit)
    if (params.skip) query.append('skip', params.skip)
    
    return this.request(`/api/articles?${query.toString()}`)
  }

  async createArticle(telegramId, articleData) {
    return this.request(`/api/articles?telegram_id=${telegramId}`, {
      method: 'POST',
      body: articleData,
    })
  }

  // ============ CATEGORIES ============
  async getCategories() {
    return this.request('/api/categories')
  }

  // ============ APP INFO ============
  async getAppInfo() {
    return this.request('/api/app-info')
  }
}

// Mock service for development when API is not available
class MockApiService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  }

  async telegramAuth(userData) {
    await this.delay(300)
    return {
      success: true,
      user: {
        id: String(Date.now()),
        telegram_id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name || '',
        username: userData.username || '',
        photo_url: userData.photo_url || '',
        role: 'user',
        is_verified: false,
        favorite_categories: [],
        favorites: [],
        notifications_enabled: true
      }
    }
  }

  async getOffers() {
    await this.delay(500)
    return {
      offers: [
        {
          id: '1',
          title: 'Кофейня "Уютный уголок"',
          description: 'Лучший кофе в городе',
          category: 'food',
          address: 'ул. Примерная, 123',
          phone: '+7 (999) 123-45-67',
          coordinates: { type: 'Point', coordinates: [37.618423, 55.751244] },
          views: 1245,
          likes: 89,
          rating: 4.8,
          status: 'active'
        }
      ],
      total: 1
    }
  }

  async getCategories() {
    await this.delay(100)
    return {
      categories: [
        { id: 'food', name: 'Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
        { id: 'shopping', name: 'Магазины', icon: '🛍️', color: '#4ECDC4' },
        { id: 'beauty', name: 'Салоны красоты', icon: '💄', color: '#FFD166' },
        { id: 'services', name: 'Услуги', icon: '🔧', color: '#06D6A0' },
        { id: 'medical', name: 'Медицина', icon: '⚕️', color: '#118AB2' },
        { id: 'pharmacy', name: 'Аптеки', icon: '💊', color: '#EF476F' },
        { id: 'entertainment', name: 'Развлечения', icon: '🎭', color: '#7209B7' }
      ]
    }
  }

  async getAppInfo() {
    await this.delay(100)
    return {
      name: 'MapChap',
      version: '3.0.0',
      support: {
        email: 'khabibullaevakhrorjon@gmail.com',
        phone: '+7 (999) 821-47-58',
        telegram: '@mapchap_support'
      },
      team: [
        { name: 'Хабибуллаев Ахрор', role: 'Основатель и CEO' },
        { name: 'Яна Владимировна Ивченко', role: 'Финансовый директор' }
      ]
    }
  }

  async verifyByINN(telegramId, inn) {
    await this.delay(1000)
    if (inn.length === 10 || inn.length === 12) {
      return {
        success: true,
        verification: {
          inn: inn,
          name: 'ООО "Тестовая компания"',
          status: 'ACTIVE'
        },
        message: 'Бизнес успешно верифицирован через ИНН'
      }
    }
    throw new Error('Некорректный ИНН')
  }

  async verifyManually(telegramId, data) {
    await this.delay(800)
    return {
      success: true,
      message: 'Заявка на верификацию принята'
    }
  }

  async getUserHistory() {
    await this.delay(300)
    return { history: [] }
  }

  async getUserFavorites() {
    await this.delay(300)
    return { favorites: [] }
  }

  async updateLocation() {
    await this.delay(100)
    return { success: true }
  }

  async createOffer(telegramId, data) {
    await this.delay(500)
    return { id: String(Date.now()), ...data, status: 'active' }
  }

  async getUserOffers() {
    await this.delay(300)
    return { offers: [] }
  }

  async getArticles() {
    await this.delay(300)
    return { articles: [], total: 0 }
  }

  async createArticle(telegramId, data) {
    await this.delay(500)
    return { id: String(Date.now()), ...data }
  }

  async getUser() {
    await this.delay(200)
    return null
  }

  async updateUser() {
    await this.delay(300)
    return { success: true }
  }

  async updateFavorites() {
    await this.delay(200)
    return { success: true }
  }

  async updateFavoriteCategories() {
    await this.delay(200)
    return { success: true }
  }

  async trackOfferView() {
    await this.delay(100)
    return { success: true }
  }
}

// Use real API or mock based on availability
let apiService

const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' })
    return response.ok
  } catch {
    return false
  }
}

// Initialize API service
const initApiService = async () => {
  const isAvailable = await checkApiAvailability()
  apiService = isAvailable ? new ApiService() : new MockApiService()
  console.log(`🔌 API Service: ${isAvailable ? 'Connected to backend' : 'Using mock data'}`)
  return apiService
}

// Export a proxy that initializes on first use
const apiServiceProxy = new Proxy({}, {
  get(target, prop) {
    if (!apiService) {
      apiService = new ApiService()
    }
    return apiService[prop]?.bind(apiService)
  }
})

export { apiServiceProxy as apiService, initApiService, API_BASE_URL }
