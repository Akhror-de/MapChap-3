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
          center: [55.7558, 37.6173], // Москва по умолчанию
          zoom: 10,
          controls: [] // Убираем ВСЕ стандартные элементы управления
        }

        this.map = new this.ymaps.Map(containerId, {
          ...defaultOptions,
          ...options
        })

        // НЕ добавляем стандартные элементы управления
        // Все управление будет через наши кастомные кнопки

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
    // Сначала удаляем старый маркер пользователя
    if (this.userMarker) {
      this.map.geoObjects.remove(this.userMarker)
    }

    // Создаем кастомный маркер пользователя
    this.userMarker = new this.ymaps.Placemark(
      coordinates,
      {
        hintContent: 'Ваше местоположение',
        balloonContent: 'Вы здесь'
      },
      {
        // Кастомная иконка для пользователя
        preset: 'islands#greenCircleIcon',
        iconColor: '#4CAF50', // Зеленый цвет
        iconLayout: 'default#circle',
        iconShape: {
          type: 'Circle',
          coordinates: [0, 0],
          radius: 15
        }
      }
    )

    this.map.geoObjects.add(this.userMarker)
    return this.userMarker
  }

  // Удаление всех маркеров (кроме пользовательского)
  clearMarkers() {
    // Удаляем только маркеры бизнесов
    this.markers.forEach(marker => {
      this.map.geoObjects.remove(marker)
    })
    this.markers = []
    
    // Маркер пользователя не удаляем
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
      this.ymaps.geocode(address).then((res) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          const coordinates = firstGeoObject.geometry.getCoordinates()
          const bounds = firstGeoObject.properties.get('boundedBy')
          resolve({ coordinates, bounds, address: firstGeoObject.getAddressLine() })
        } else {
          reject(new Error('Адрес не найден'))
        }
      }).catch(reject)
    })
  }

  // Обратное геокодирование (координаты в адрес)
  reverseGeocode(coordinates) {
    return new Promise((resolve, reject) => {
      this.ymaps.geocode(coordinates).then((res) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          resolve(firstGeoObject.getAddressLine())
        } else {
          reject(new Error('Адрес не найден'))
        }
      }).catch(reject)
    })
  }

  // Добавление кастомного элемента управления
  addControl(control, options = {}) {
    this.map.controls.add(control, options)
  }
}

// Создаем singleton экземпляр
export const yandexMapsService = new YandexMapsService()
