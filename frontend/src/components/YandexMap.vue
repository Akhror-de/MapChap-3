<template>
  <div class="yandex-map-container">
    <div 
      ref="mapContainer" 
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
          +
        </button>
        <button 
          class="control-btn zoom-out"
          @click="zoomOut"
          title="Отдалить"
        >
          −
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
        <span v-else>📍</span>
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
import { yandexMapsService } from '../services/yandexMaps.js'

export default {
  name: 'YandexMap',
  setup() {
    const mapContainer = ref(null)
    const isMapLoading = ref(false)
    const isLocating = ref(false)
    const userLocation = ref(null)
    const offersStore = useOffersStore()

    let map = null

    // Инициализация карты
    const initMap = async () => {
      isMapLoading.value = true
      try {
        map = await yandexMapsService.init('yandex-map', {
          center: offersStore.mapCenter,
          zoom: offersStore.mapZoom
        })

        // Слушаем события карты
        map.events.add('boundschange', (e) => {
          offersStore.setMapCenter(e.get('newCenter'))
          offersStore.setMapZoom(e.get('newZoom'))
        })

        // Добавляем маркеры
        updateMarkers()

      } catch (error) {
        console.error('Ошибка инициализации карты:', error)
      } finally {
        isMapLoading.value = false
      }
    }

    // Обновление маркеров
    const updateMarkers = () => {
      if (!map) return

      // Удаляем старые маркеры
      yandexMapsService.clearMarkers()

      // Добавляем новые маркеры
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

        // Событие клика на маркер
        marker.then(m => {
          m.events.add('click', () => {
            offersStore.setSelectedOffer(offer)
          })
        })
      })
    }

    // Получение пресета маркера по категории
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

    // Управление зумом
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

    // Центрирование на местоположении пользователя
    const centerToUserLocation = () => {
      if (navigator.geolocation) {
        isLocating.value = true
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = [position.coords.latitude, position.coords.longitude]
            userLocation.value = { lat: coords[0], lng: coords[1] }
            offersStore.setUserLocation(userLocation.value)
            yandexMapsService.setCenter(coords, 14)
            
            // Добавляем кастомный маркер пользователя
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

    // Наблюдаем за изменениями предложений
    watch(() => offersStore.filteredOffers, updateMarkers)
    watch(() => offersStore.mapCenter, (center) => {
      if (map) {
        yandexMapsService.setCenter(center)
      }
    })

    onMounted(() => {
      initMap()
      
      // Глобальная функция для балунов
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
      mapContainer,
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
  border-radius: 8px;
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
  color: #333;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
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
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.zoom-in, .zoom-out {
  font-weight: bold;
  font-size: 20px;
}

.zoom-in {
  border-radius: 8px 8px 0 0;
}

.zoom-out {
  border-radius: 0 0 8px 8px;
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
  padding: 10px;
  max-width: 250px;
}

:deep(.balloon-content h3) {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

:deep(.balloon-content p) {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

:deep(.balloon-btn) {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
}

:deep(.balloon-btn:hover) {
  background: #5a6fd8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .map-controls {
    top: 10px;
    right: 10px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .location-text {
    font-size: 10px;
  }
}
</style>
