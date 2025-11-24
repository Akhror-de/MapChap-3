export class YandexMapsService {
  constructor() {
    this.map = null
    this.ymaps = null
    this.markers = []
    this.isLoaded = false
    this.userMarker = null
    this.clusterer = null
  }

  // Инициализация карты
  init(containerId, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isLoaded && this.ymaps) {
        this.createMap(containerId, options).then(resolve).catch(reject)
        return
      }

      // Ждем загрузку API Яндекс.Карт
      if (window.ymaps) {
        window.ymaps.ready(() => {
          this.ymaps = window.ymaps
          this.isLoaded = true
          this.createMap(containerId, options).then(resolve).catch(reject)
        })
      } else {
        reject(new Error('Yandex Maps API not loaded'))
      }
    })
  }

  // Создание карты
  createMap(containerId, options) {
    return new Promise((resolve, reject) => {
      try {
        const defaultOptions = {
          center: [55.7558, 37.6173], // Москва по умолчанию
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl']
        }

        this.map = new this.ymaps.Map(containerId, {
          ...defaultOptions,
          ...options
        })

        // Инициализируем кластеризатор
        this.clusterer = new this.ymaps.Clusterer({
          preset: 'islands#invertedBlueClusterIcons',
          clusterDisableClickZoom: true,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false
        })

        this.map.geoObjects.add(this.clusterer)

        resolve(this.map)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Добавление маркера бизнеса
  addMarker(coordinates, properties = {}, options = {}) {
    return new Promise((resolve) => {
      const defaultOptions = {
        preset: 'islands#blueIcon',
        balloonCloseButton: true,
        hideIconOnBalloonOpen: false
      }

      const marker = new this.ymaps.Placemark(
        coordinates,
        properties,
        {
          ...defaultOptions,
          ...options
        }
      )

      // Добавляем обработчик клика на маркер
      marker.events.add('click', () => {
        if (properties.balloonContent) {
          marker.balloon.open()
        }
      })

      this.clusterer.add(marker)
      this.markers.push(marker)

      resolve(marker)
    })
  }

  // Добавление кастомного маркера пользователя
  addUserMarker(coordinates) {
    if (this.userMarker) {
      this.map.geoObjects.remove(this.userMarker)
    }

    this.userMarker = new this.ymaps.Placemark(
      coordinates,
      {
        hintContent: 'Ваше местоположение',
        balloonContent: 'Вы здесь'
      },
      {
        preset: 'islands#greenCircleIcon',
        iconColor: '#4CAF50'
      }
    )

    this.map.geoObjects.add(this.userMarker)
    return this.userMarker
  }

  // Удаление всех маркеров (кроме пользовательского)
  clearMarkers() {
    if (this.clusterer) {
      this.clusterer.removeAll()
    }
    this.markers = []
  }

  // Центрирование карты на координатах
  setCenter(coordinates, zoom = null) {
    if (zoom) {
      this.map.setCenter(coordinates, zoom)
    } else {
      this.map.setCenter(coordinates)
    }
  }

  // Установка зума
  setZoom(zoom) {
    this.map.setZoom(zoom)
  }

  // Получение текущих границ карты
  getBounds() {
    return this.map.getBounds()
  }

  // Поиск по адресу (геокодирование)
  geocode(address) {
    return new Promise((resolve, reject) => {
      this.ymaps.geocode(address)
        .then((result) => {
          const firstGeoObject = result.geoObjects.get(0)
          if (firstGeoObject) {
            const coordinates = firstGeoObject.geometry.getCoordinates()
            resolve({
              coordinates,
              address: firstGeoObject.getAddressLine(),
              bounds: firstGeoObject.properties.get('boundedBy')
            })
          } else {
            reject(new Error('Адрес не найден'))
          }
        })
        .catch(reject)
    })
  }

  // Обратное геокодирование (координаты в адрес)
  reverseGeocode(coordinates) {
    return new Promise((resolve, reject) => {
      this.ymaps.geocode(coordinates)
        .then((result) => {
          const firstGeoObject = result.geoObjects.get(0)
          if (firstGeoObject) {
            resolve({
              address: firstGeoObject.getAddressLine(),
              coordinates: firstGeoObject.geometry.getCoordinates()
            })
          } else {
            reject(new Error('Адрес не найден'))
          }
        })
        .catch(reject)
    })
  }

  // Построение маршрута
  buildRoute(from, to, type = 'auto') {
    return new Promise((resolve, reject) => {
      const route = new this.ymaps.multiRouter.MultiRoute({
        referencePoints: [from, to],
        params: {
          routingMode: type
        }
      }, {
        boundsAutoApply: true,
        wayPointVisible: false
      })

      this.map.geoObjects.add(route)
      resolve(route)
    })
  }

  // Получение текущего местоположения пользователя
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = [
            position.coords.latitude,
            position.coords.longitude
          ]
          resolve(coordinates)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  // Создание кастомного балуна
  createBalloonTemplate(content) {
    return `
      <div class="map-balloon">
        ${content}
      </div>
    `
  }

  // Добавление кастомного элемента управления
  addCustomControl(layout, options = {}) {
    const control = new this.ymaps.control.Button({
      data: options.data || { content: 'Button' },
      options: options.options || { selectOnClick: false }
    })

    if (options.onClick) {
      control.events.add('press', options.onClick)
    }

    this.map.controls.add(control, options.position || { float: 'right' })
    return control
  }

  // Установка ограничений по области
  setBounds(bounds) {
    this.map.setBounds(bounds)
  }

  // Включение/выключение поведения карты
  setBehaviors(behaviors) {
    this.map.behaviors.disable(behaviors)
  }

  // Добавление слоя
  addLayer(layer) {
    this.map.layers.add(layer)
  }

  // Удаление слоя
  removeLayer(layer) {
    this.map.layers.remove(layer)
  }

  // Подписка на события карты
  on(event, callback) {
    this.map.events.add(event, callback)
  }

  // Отписка от событий карты
  off(event, callback) {
    this.map.events.remove(event, callback)
  }

  // Уничтожение карты
  destroy() {
    if (this.map) {
      this.map.destroy()
      this.map = null
      this.ymaps = null
      this.isLoaded = false
      this.markers = []
      this.userMarker = null
      this.clusterer = null
    }
  }

  // Получение состояния карты
  getState() {
    return {
      center: this.map.getCenter(),
      zoom: this.map.getZoom(),
      bounds: this.map.getBounds()
    }
  }

  // Восстановление состояния карты
  setState(state) {
    if (state.center) {
      this.map.setCenter(state.center, state.zoom)
    }
  }

  // Создание горячих зон (heatmap)
  createHeatmap(data, options = {}) {
    return new this.ymaps.Heatmap(data, {
      radius: 15,
      dissipating: true,
      opacity: 0.8,
      intensityOfMidpoint: 0.2,
      gradient: {
        0.1: 'rgba(128, 255, 0, 0.7)',
        0.2: 'rgba(255, 255, 0, 0.8)',
        0.7: 'rgba(234, 72, 58, 0.9)',
        1.0: 'rgba(162, 36, 25, 1)'
      },
      ...options
    })
  }
}

// Вспомогательные функции
export const MapUtils = {
  // Расчет расстояния между двумя точками (в км)
  calculateDistance(coords1, coords2) {
    const [lat1, lon1] = coords1
    const [lat2, lon2] = coords2

    const R = 6371 // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  // Форматирование координат
  formatCoordinates(coordinates) {
    return coordinates.map(coord => coord.toFixed(6))
  },

  // Проверка, находится ли точка в границах
  isPointInBounds(point, bounds) {
    const [[south, west], [north, east]] = bounds
    const [lat, lng] = point
    
    return (
      lat >= south &&
      lat <= north &&
      lng >= west &&
      lng <= east
    )
  },

  // Создание bounds из массива точек
  createBoundsFromPoints(points) {
    if (points.length === 0) return null

    let minLat = points[0][0]
    let maxLat = points[0][0]
    let minLng = points[0][1]
    let maxLng = points[0][1]

    points.forEach(point => {
      const [lat, lng] = point
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    })

    return [[minLat, minLng], [maxLat, maxLng]]
  }
}

// Константы для карты
export const MAP_CONSTANTS = {
  DEFAULT_CENTER: [55.7558, 37.6173], // Москва
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  PRESETS: {
    BUSINESS: 'islands#blueIcon',
    USER: 'islands#greenCircleIcon',
    SELECTED: 'islands#redIcon',
    CLUSTER: 'islands#invertedBlueClusterIcons'
  },
  CATEGORY_ICONS: {
    food: 'islands#redFoodIcon',
    shopping: 'islands#blueShoppingIcon',
    beauty: 'islands#violetBeautyIcon',
    services: 'islands#darkOrangeServiceIcon',
    medical: 'islands#greenMedicineIcon',
    furniture: 'islands#brownFurnitureIcon',
    pharmacy: 'islands#orangePharmacyIcon'
  }
}

// Создаем singleton экземпляр
export const yandexMapsService = new YandexMapsService()

export default yandexMapsService
