<template>
  <div class="yandex-map-container">
    <div 
      id="yandex-map"
      class="yandex-map"
      :class="{ loading: isMapLoading }"
    ></div>
    
    <div v-if="isMapLoading" class="map-loading">
      <div class="loading-spinner"></div>
      <p>Загрузка карты...</p>
    </div>

    <!-- Кастомные контролы поверх карты -->
    <div class="map-controls">
      <!-- Кнопки зума -->
      <div class="zoom-controls">
        <button 
          class="control-btn zoom-in"
          @click="zoomIn"
          title="Приблизить"
        >
          <span class="control-icon">+</span>
        </button>
        <button 
          class="control-btn zoom-out"
          @click="zoomOut"
          title="Отдалить"
        >
          <span class="control-icon">−</span>
        </button>
      </div>

      <!-- Кнопка местоположения -->
      <button 
        class="control-btn location-btn"
        @click="centerToUserLocation"
        title="Мое местоположение"
        :disabled="isLocating"
      >
        <span v-if="isLocating" class="locating-spinner"></span>
        <span v-else class="control-icon">📍</span>
      </button>
    </div>

    <!-- Индикатор текущего местоположения -->
    <div v-if="userLocation" class="location-indicator">
      <div class="pulse-ring"></div>
      <div class="location-dot"></div>
      <span class="location-text">Вы здесь</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'

// Сервис Яндекс.Карт прямо в компоненте
class YandexMapsService {
  constructor() {
    this.map = null
    this.ymaps = null
    this.markers = []
    this.isLoaded = false
    this.userMarker = null
  }

  init(containerId, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.isLoaded && this.ymaps) {
        this.createMap(containerId, options).then(resolve).catch(reject)
        return
      }

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

  createMap(containerId, options) {
    return new Promise((resolve, reject) => {
      try {
        const defaultOptions = {
          center: [55.7558, 37.6173],
          zoom: 10,
          controls: [] // УБИРАЕМ ВСЕ СТАНДАРТНЫЕ ЭЛЕМЕНТЫ
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

  clearMarkers() {
    this.markers.forEach(marker => {
      this.map.geoObjects.remove(marker)
    })
    this.markers = []
  }

  setCenter(coordinates, zoom = null) {
    if (zoom) {
      this.map.setCenter(coordinates, zoom)
    } else {
      this.map.setCenter(coordinates)
    }
  }

  setZoom(zoom) {
    this.map.setZoom(zoom)
  }
}

const yandexMapsService = new YandexMapsService()

export default {
  name: 'YandexMap',
  setup() {
    const isMapLoading = ref(false)
    const isLocating = ref(false)
    const userLocation = ref(null)
    const offersStore = useOffersStore()

    let map = null

    const initMap = async () => {
      isMapLoading.value = true
      try {
        map = await yandexMapsService.init('yandex-map', {
          center: offersStore.mapCenter,
          zoom: offersStore.mapZoom
        })

        map.events.add('boundschange', (e) => {
          offersStore.setMapCenter(e.get('newCenter'))
          offersStore.setMapZoom(e.get('newZoom'))
        })

        updateMarkers()

      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      } finally {
        isMapLoading.value = false
      }
    }

    const updateMarkers = () => {
      if (!map) return

      yandexMapsService.clearMarkers()

      offersStore.filteredOffers.forEach(offer => {
        const marker = yandexMapsService.addMarker(
          offer.coordinates,
          {
            balloonContent: `
              <div class="balloon-content">
                <h3>${offer.title}</h3>
                <p>${offer.description}</p>
                <p><strong>Адрес:</strong> ${offer.address}</p>
                <p><strong>Телефон:</strong> ${offer.phone}</p>
                <p><strong>Часы работы:</strong> ${offer.workingHours}</p>
                <button onclick="window.selectOffer && window.selectOffer(${offer.id})" class="balloon-btn">
                  Подробнее
                </button>
              </div>
            `
          },
          {
            preset: getMarkerPreset(offer.category)
          }
        )

        marker.then(m => {
          m.events.add('click', () => {
            offersStore.setSelectedOffer(offer)
          })
        })
      })
    }

    const getMarkerPreset = (category) => {
      const presets = {
        food: 'islands#redIcon',
        shopping: 'islands#blueIcon',
        beauty: 'islands#pinkIcon',
        services: 'islands#greenIcon',
        medical: 'islands#orangeIcon',
        furniture: 'islands#brownIcon',
        pharmacy: 'islands#violetIcon'
      }
      return presets[category] || 'islands#darkBlueIcon'
    }

    const zoomIn = () => {
      if (map) {
        const currentZoom = map.getZoom()
        map.setZoom(currentZoom + 1, { duration: 300 })
      }
    }

    const zoomOut = () => {
      if (map) {
        const currentZoom = map.getZoom()
        map.setZoom(currentZoom - 1, { duration: 300 })
      }
    }

    const centerToUserLocation = () => {
      if (navigator.geolocation) {
        isLocating.value = true
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = [position.coords.latitude, position.coords.longitude]
            userLocation.value = { lat: coords[0], lng: coords[1] }
            offersStore.setUserLocation(userLocation.value)
            yandexMapsService.setCenter(coords, 14)
            yandexMapsService.addUserMarker(coords)
            isLocating.value = false
          },
          (error) => {
            console.error('Ошибка получения местоположения:', error)
            alert('Не удалось получить ваше местоположение. Проверьте разрешения браузера.')
            isLocating.value = false
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      } else {
        alert('Геолокация не поддерживается вашим браузером')
      }
    }

    watch(() => offersStore.filteredOffers, updateMarkers)
    watch(() => offersStore.mapCenter, (center) => {
      if (map) {
        yandexMapsService.setCenter(center)
      }
    })

    onMounted(() => {
      initMap()
      
      window.selectOffer = (offerId) => {
        const offer = offersStore.offers.find(o => o.id === offerId)
        if (offer) {
          offersStore.setSelectedOffer(offer)
        }
      }
    })

    onUnmounted(() => {
      if (map) {
        map.destroy()
      }
    })

    return {
      isMapLoading,
      isLocating,
      userLocation,
      zoomIn,
      zoomOut,
      centerToUserLocation
    }
  }
}
</script>

<style scoped>
.yandex-map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.yandex-map {
  width: 100%;
  height: 100%;
}

.yandex-map.loading {
  opacity: 0.5;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

/* Кастомные элементы управления */
.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.control-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-icon {
  font-size: 1.1rem;
  font-weight: 500;
}

.zoom-in, .zoom-out {
  font-weight: bold;
}

.zoom-in {
  border-radius: 12px 12px 0 0;
}

.zoom-out {
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #e9ecef;
}

.location-btn {
  background: white;
}

/* Спиннер для локации */
.locating-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Индикатор местоположения */
.location-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.pulse-ring {
  width: 40px;
  height: 40px;
  border: 3px solid #4CAF50;
  border-radius: 50%;
  animation: pulse 2s infinite;
  position: absolute;
  top: 0;
  left: 0;
}

.location-dot {
  width: 16px;
  height: 16px;
  background: #4CAF50;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.location-text {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 10px;
  white-space: nowrap;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Стили для балунов */
:deep(.balloon-content) {
  padding: 12px;
  max-width: 280px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:deep(.balloon-content h3) {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

:deep(.balloon-content p) {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

:deep(.balloon-btn) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
  transition: all 0.3s ease;
}

:deep(.balloon-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Адаптивность */
@media (max-width: 768px) {
  .map-controls {
    top: 10px;
    right: 10px;
  }
  
  .control-btn {
    width: 44px;
    height: 44px;
  }
  
  .location-text {
    font-size: 10px;
  }
}
</style>
