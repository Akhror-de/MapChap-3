export class YandexMapsService {
  constructor() {
    this.map = null
    this.ymaps = null
    this.markers = []
    this.isLoaded = false
    this.userMarker = null
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

  // Создание карты БЕЗ стандартных элементов управления
  createMap(containerId, options) {
    return new Promise((resolve, reject) => {
      try {
        const defaultOptions = {
          center: [55.7558, 37.6173],
          zoom: 10,
          controls: []
        }

        this.map = new this.ymaps.Map(containerId, {
          ...defaultOptions,
          ...options
        })

        resolve(this.map)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Добавление маркера бизнеса
  addMarker(coordinates, properties = {}, options = {}) {
    return new Promise((resolve) => {
      const marker = new this.ymaps.Placemark(
        coordinates,
        properties,
        {
          preset: 'islands#blueIcon',
          ...options
        }
      )

      this.map.geoObjects.add(marker)
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
    this.markers.forEach(marker => {
      this.map.geoObjects.remove(marker)
    })
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

  // Поиск по адресу
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
}

// Создаем singleton экземпляр
export const yandexMapsService = new YandexMapsService()
