<template>
  <div class="map-wrapper">
    <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
    
    <!-- Кастомные контролы зума -->
    <div class="custom-controls">
      <button class="control-btn zoom-in" @click="zoomIn" title="Приблизить">
        <span>+</span>
      </button>
      <button class="control-btn zoom-out" @click="zoomOut" title="Отдалить">
        <span>−</span>
      </button>
    </div>
    
    <!-- Индикатор GPS трекинга -->
    <div v-if="isTracking" class="tracking-indicator">
      <span class="tracking-dot"></span>
      <span class="tracking-text">GPS активен</span>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'
import { storeToRefs } from 'pinia'

// Кастомные иконки для категорий
const CATEGORY_ICONS = {
  food: { emoji: '🍕', color: '#FF6B6B', preset: 'islands#redFoodIcon' },
  shopping: { emoji: '🛍️', color: '#4ECDC4', preset: 'islands#darkGreenShoppingCartIcon' },
  grocery: { emoji: '🛒', color: '#22C55E', preset: 'islands#greenIcon' },
  beauty: { emoji: '💄', color: '#FFD166', preset: 'islands#pinkBeautyIcon' },
  services: { emoji: '🔧', color: '#06D6A0', preset: 'islands#orangeRepairShopIcon' },
  medical: { emoji: '⚕️', color: '#118AB2', preset: 'islands#blueMedicalIcon' },
  furniture: { emoji: '🛋️', color: '#073B4C', preset: 'islands#brownHomeIcon' },
  pharmacy: { emoji: '💊', color: '#EF476F', preset: 'islands#redDrugstoreIcon' },
  fitness: { emoji: '💪', color: '#F97316', preset: 'islands#orangeSportIcon' },
  entertainment: { emoji: '🎭', color: '#7209B7', preset: 'islands#violetTheaterIcon' },
  education: { emoji: '📚', color: '#F72585', preset: 'islands#blueScienceIcon' },
  auto: { emoji: '🚗', color: '#4361EE', preset: 'islands#blueAutoIcon' },
  hotel: { emoji: '🏨', color: '#4CC9F0', preset: 'islands#blueHotelIcon' },
  default: { emoji: '📍', color: '#ff6b00', preset: 'islands#orangeCircleDotIcon' }
}

export default {
  name: 'YandexMap',
  setup() {
    const mapContainer = ref(null)
    const offersStore = useOffersStore()
    const { filteredOffers, selectedCategory, userLocation } = storeToRefs(offersStore)
    
    let map = null
    let ymaps = null
    let clusterer = null
    let userMarker = null
    let watchId = null
    const isTracking = ref(false)
    const currentHeading = ref(0)

    const initMap = () => {
      if (typeof window.ymaps === 'undefined') {
        console.error('Yandex Maps API not loaded')
        setTimeout(initMap, 100)
        return
      }

      ymaps = window.ymaps

      ymaps.ready(() => {
        if (!mapContainer.value) {
          console.error('Map container not found')
          return
        }

        try {
          // Инициализация карты с тёмной темой
          map = new ymaps.Map(mapContainer.value, {
            center: [55.751244, 37.618423],
            zoom: 12,
            controls: [] // Убираем все стандартные контролы
          }, {
            // Настройки для лучшей производительности
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: false
          })

          // Создаем кластеризатор с тёмным стилем
          clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedOrangeClusterIcons',
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            groupByCoordinates: false,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 200,
            clusterIconColor: '#ff6b00'
          })

          map.geoObjects.add(clusterer)

          // Добавляем маркеры
          updateMarkers()

          // Слушаем изменения границ карты
          map.events.add('boundschange', () => {
            offersStore.setMapBounds(map.getBounds())
          })

          // Начинаем отслеживание позиции
          startLocationTracking()

          console.log('✅ Yandex Map initialized with dark theme')

        } catch (error) {
          console.error('Error initializing Yandex Map:', error)
        }
      })
    }

    // Кастомные контролы зума
    const zoomIn = () => {
      if (map) {
        const currentZoom = map.getZoom()
        map.setZoom(Math.min(currentZoom + 1, 19), { duration: 300 })
      }
    }

    const zoomOut = () => {
      if (map) {
        const currentZoom = map.getZoom()
        map.setZoom(Math.max(currentZoom - 1, 3), { duration: 300 })
      }
    }

    // Отслеживание позиции в реальном времени
    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported')
        return
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          isTracking.value = true
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || 0,
            speed: position.coords.speed || 0
          }
          
          currentHeading.value = newLocation.heading
          updateUserMarker(newLocation)
        },
        (error) => {
          console.log('Location tracking error:', error.message)
          isTracking.value = false
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      )
    }

    const stopLocationTracking = () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        watchId = null
        isTracking.value = false
      }
    }

    const createCustomPlacemark = (offer) => {
      const categoryIcon = CATEGORY_ICONS[offer.category] || CATEGORY_ICONS.default
      
      let coords
      if (offer.coordinates) {
        if (Array.isArray(offer.coordinates)) {
          coords = offer.coordinates
        } else if (offer.coordinates.coordinates) {
          coords = [offer.coordinates.coordinates[1], offer.coordinates.coordinates[0]]
        }
      }
      
      if (!coords) return null

      const balloonContent = `
        <div class="map-balloon dark-balloon">
          <div class="balloon-header">
            <span class="balloon-category-icon">${categoryIcon.emoji}</span>
            <h3 class="balloon-title">${offer.title}</h3>
          </div>
          <p class="balloon-description">${offer.description || ''}</p>
          <div class="balloon-info">
            <div class="balloon-address">📍 ${offer.address}</div>
            <div class="balloon-phone">📞 ${offer.phone}</div>
            ${offer.rating ? `<div class="balloon-rating">⭐ ${offer.rating}</div>` : ''}
          </div>
          <div class="balloon-stats">
            <span>👁️ ${offer.views || 0}</span>
            <span>❤️ ${offer.likes || 0}</span>
          </div>
        </div>
      `

      const placemark = new ymaps.Placemark(
        coords,
        {
          balloonContent: balloonContent,
          hintContent: offer.title,
          offerId: offer.id
        },
        {
          preset: categoryIcon.preset,
          balloonCloseButton: true,
          hideIconOnBalloonOpen: false,
          iconColor: categoryIcon.color
        }
      )

      placemark.events.add('click', () => {
        offersStore.setSelectedOffer(offer)
      })

      return placemark
    }

    const updateMarkers = () => {
      if (!clusterer || !ymaps) return

      clusterer.removeAll()
      const placemarks = []

      filteredOffers.value.forEach(offer => {
        const placemark = createCustomPlacemark(offer)
        if (placemark) {
          placemarks.push(placemark)
        }
      })

      clusterer.add(placemarks)
      console.log(`📍 Added ${placemarks.length} markers to map`)
    }

    // Создаем кастомный анимированный маркер пользователя с направлением
    const createUserMarkerLayout = (heading = 0) => {
      if (!ymaps) return null
      
      return ymaps.templateLayoutFactory.createClass(`
        <div class="user-marker-container">
          <div class="user-marker-accuracy"></div>
          <div class="user-marker-pulse"></div>
          <div class="user-marker-pulse-delay"></div>
          <div class="user-marker-core">
            <div class="user-marker-dot"></div>
          </div>
          <div class="user-marker-direction" style="transform: translate(-50%, -100%) rotate(${heading}deg)"></div>
        </div>
      `)
    }

    const updateUserMarker = (location) => {
      if (!map || !ymaps || !location) return

      const coords = [location.latitude, location.longitude]
      const heading = location.heading || currentHeading.value || 0

      if (userMarker) {
        // Плавное перемещение маркера
        const currentCoords = userMarker.geometry.getCoordinates()
        animateMarkerMove(currentCoords, coords, heading)
      } else {
        // Создаем новый маркер
        const UserMarkerLayout = createUserMarkerLayout(heading)

        userMarker = new ymaps.Placemark(
          coords,
          {
            hintContent: 'Ваше местоположение',
            balloonContent: `
              <div class="user-balloon">
                <div class="user-balloon-header">
                  <span class="user-balloon-icon">📍</span>
                  <strong>Вы здесь</strong>
                </div>
                <p class="user-balloon-coords">${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}</p>
                ${location.speed ? `<p class="user-balloon-speed">🚶 ${(location.speed * 3.6).toFixed(1)} км/ч</p>` : ''}
              </div>
            `
          },
          {
            iconLayout: UserMarkerLayout,
            iconShape: {
              type: 'Circle',
              coordinates: [0, 0],
              radius: 40
            }
          }
        )

        map.geoObjects.add(userMarker)
      }

      // Обновляем store
      offersStore.setUserLocation(location)
      
      console.log('📍 User position updated:', coords)
    }

    // Анимация перемещения маркера
    const animateMarkerMove = (from, to, heading) => {
      if (!userMarker) return

      const steps = 20
      const stepLat = (to[0] - from[0]) / steps
      const stepLng = (to[1] - from[1]) / steps
      let step = 0

      const animate = () => {
        if (step < steps) {
          step++
          const newLat = from[0] + stepLat * step
          const newLng = from[1] + stepLng * step
          userMarker.geometry.setCoordinates([newLat, newLng])
          
          // Обновляем направление
          if (heading && step === steps) {
            const UserMarkerLayout = createUserMarkerLayout(heading)
            userMarker.options.set('iconLayout', UserMarkerLayout)
          }
          
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    // Установка маркера при ручном запросе локации
    const setUserMarker = (location) => {
      if (!location) return
      updateUserMarker({
        latitude: location.latitude || location[0],
        longitude: location.longitude || location[1],
        accuracy: location.accuracy || 100
      })
      
      // Центрируем карту
      if (map) {
        map.setCenter([location.latitude || location[0], location.longitude || location[1]], 15, { duration: 500 })
      }
    }

    // Следим за изменениями
    watch(filteredOffers, () => {
      updateMarkers()
    }, { deep: true })

    watch(userLocation, (newLocation) => {
      if (newLocation) {
        setUserMarker(newLocation)
      }
    })

    onMounted(() => {
      console.log('🗺️ YandexMap component mounted')
      
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '07b74146-5f5a-46bf-a2b1-cf6d052a41bb'
      
      if (!window.ymaps) {
        const script = document.createElement('script')
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
        script.onload = () => {
          setTimeout(() => {
            initMap()
          }, 300)
        }
        document.head.appendChild(script)
      } else {
        setTimeout(() => {
          initMap()
        }, 300)
      }
    })

    onUnmounted(() => {
      stopLocationTracking()
      if (map) {
        map.destroy()
      }
    })

    return {
      mapContainer,
      isTracking,
      zoomIn,
      zoomOut
    }
  }
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.yandex-map {
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  /* Инвертируем цвета для тёмной темы */
  filter: invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9);
}

/* Кастомные контролы зума */
.custom-controls {
  position: absolute;
  right: 16px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.control-btn {
  width: 44px;
  height: 44px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.control-btn:hover {
  background: #ff6b00;
  border-color: #ff6b00;
  transform: scale(1.05);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn span {
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  line-height: 1;
}

/* Индикатор GPS трекинга */
.tracking-indicator {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid #333;
  border-radius: 20px;
  z-index: 100;
}

.tracking-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: trackingPulse 1.5s ease-in-out infinite;
}

.tracking-text {
  font-size: 12px;
  color: #22c55e;
  font-weight: 500;
}

@keyframes trackingPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Кастомный анимированный маркер пользователя */
:deep(.user-marker-container) {
  position: relative;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  /* Отменяем инверсию для маркера */
  filter: invert(90%) hue-rotate(180deg) brightness(1.05) contrast(1.1);
}

:deep(.user-marker-accuracy) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(255, 107, 0, 0.1);
  border: 1px solid rgba(255, 107, 0, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

:deep(.user-marker-pulse) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: rgba(255, 107, 0, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-out infinite;
}

:deep(.user-marker-pulse-delay) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: rgba(255, 107, 0, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-out infinite 0.5s;
}

:deep(.user-marker-core) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(255, 107, 0, 0.6), 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  z-index: 10;
}

:deep(.user-marker-dot) {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
}

:deep(.user-marker-direction) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 24px solid #ff6b00;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 5;
  transition: transform 0.3s ease;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

/* User balloon стили */
:deep(.user-balloon) {
  padding: 12px;
  text-align: center;
  background: #1a1a1a;
  border-radius: 12px;
}

:deep(.user-balloon-header) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

:deep(.user-balloon-icon) {
  font-size: 20px;
}

:deep(.user-balloon-header strong) {
  color: #ff6b00;
  font-size: 15px;
}

:deep(.user-balloon-coords) {
  margin: 0;
  font-size: 11px;
  color: #888;
  font-family: monospace;
}

:deep(.user-balloon-speed) {
  margin: 4px 0 0;
  font-size: 12px;
  color: #22c55e;
}

/* Стили для балунов (тёмная тема) */
:deep(.map-balloon) {
  padding: 12px;
  max-width: 280px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  /* Отменяем инверсию для балунов */
  filter: invert(90%) hue-rotate(180deg);
}

:deep(.dark-balloon) {
  background: #1a1a1a;
  border-radius: 12px;
  color: #fff;
}

:deep(.balloon-header) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

:deep(.balloon-category-icon) {
  font-size: 24px;
}

:deep(.balloon-title) {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

:deep(.balloon-description) {
  margin: 0 0 10px 0;
  color: #888;
  font-size: 13px;
  line-height: 1.4;
}

:deep(.balloon-info) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #aaa;
}

:deep(.balloon-stats) {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #333;
  font-size: 13px;
  color: #888;
}

:deep(.balloon-rating) {
  color: #f59e0b;
  font-weight: 500;
}

/* Скрываем элементы Яндекс карт */
:deep(.ymaps-2-1-79-copyright) {
  filter: invert(90%) hue-rotate(180deg) !important;
}

:deep(.ymaps-2-1-79-map-copyrights-promo) {
  display: none !important;
}
</style>
