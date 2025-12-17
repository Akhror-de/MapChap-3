<template>
  <div class="map-wrapper">
    <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
    
    <!-- Кастомные контролы зума -->
    <div class="custom-controls">
      <button class="control-btn zoom-in" @click="zoomIn" title="Приблизить">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <button class="control-btn zoom-out" @click="zoomOut" title="Отдалить">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
    
    <!-- Индикатор GPS трекинга -->
    <div v-if="isTracking" class="tracking-indicator">
      <span class="tracking-dot"></span>
      <span class="tracking-text">GPS</span>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'
import { storeToRefs } from 'pinia'

// Иконки категорий
const CATEGORY_ICONS = {
  food: { color: '#888', preset: 'islands#grayFoodIcon' },
  shopping: { color: '#888', preset: 'islands#grayShoppingCartIcon' },
  grocery: { color: '#888', preset: 'islands#grayIcon' },
  beauty: { color: '#888', preset: 'islands#grayBeautyIcon' },
  services: { color: '#888', preset: 'islands#grayRepairShopIcon' },
  medical: { color: '#888', preset: 'islands#grayMedicalIcon' },
  furniture: { color: '#888', preset: 'islands#grayHomeIcon' },
  pharmacy: { color: '#888', preset: 'islands#grayDrugstoreIcon' },
  fitness: { color: '#888', preset: 'islands#graySportIcon' },
  entertainment: { color: '#888', preset: 'islands#grayTheaterIcon' },
  education: { color: '#888', preset: 'islands#grayScienceIcon' },
  auto: { color: '#888', preset: 'islands#grayAutoIcon' },
  hotel: { color: '#888', preset: 'islands#grayHotelIcon' },
  default: { color: '#fff', preset: 'islands#grayCircleDotIcon' }
}

export default {
  name: 'YandexMap',
  emits: ['offer-click'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    const offersStore = useOffersStore()
    const { filteredOffers, selectedCategory, userLocation } = storeToRefs(offersStore)
    
    let map = null
    let ymaps = null
    let clusterer = null
    let userMarker = null
    let watchId = null
    let isFirstLocation = true // Флаг для первого получения локации
    const isTracking = ref(false)
    const currentHeading = ref(0)

    const initMap = () => {
      if (typeof window.ymaps === 'undefined') {
        setTimeout(initMap, 100)
        return
      }

      ymaps = window.ymaps

      ymaps.ready(() => {
        if (!mapContainer.value) return

        try {
          // Инициализация карты БЕЗ стандартных контролов
          map = new ymaps.Map(mapContainer.value, {
            center: [55.751244, 37.618423],
            zoom: 12,
            controls: [] // Убираем ВСЕ контролы
          }, {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
            copyrightUa498LProvidersVisible: false,
            copyrightLogoVisible: false,
            copyrightProvidersVisible: false
          })

          // Отключаем все поведения которые мешают
          map.behaviors.disable('scrollZoom') // Можно включить если нужно
          map.behaviors.enable('drag')
          map.behaviors.enable('multiTouch')
          
          // Включаем зум жестами
          map.behaviors.enable('scrollZoom')

          // Кластеризатор с белым стилем
          clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedGrayClusterIcons',
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            groupByCoordinates: false,
            clusterIconColor: '#ffffff'
          })

          map.geoObjects.add(clusterer)
          updateMarkers()

          map.events.add('boundschange', () => {
            offersStore.setMapBounds(map.getBounds())
          })

          startLocationTracking()
          console.log('Map initialized')

        } catch (error) {
          console.error('Map init error:', error)
        }
      })
    }

    const zoomIn = () => {
      if (map) {
        map.setZoom(Math.min(map.getZoom() + 1, 19), { duration: 200 })
      }
    }

    const zoomOut = () => {
      if (map) {
        map.setZoom(Math.max(map.getZoom() - 1, 3), { duration: 200 })
      }
    }

    // Отслеживание позиции БЕЗ автоматического центрирования
    // Карта НЕ центрируется автоматически - только по кнопке геолокации
    const startLocationTracking = () => {
      if (!navigator.geolocation) return

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
          // Только обновляем маркер, НЕ центрируем карту
          updateUserMarker(newLocation, false)
          
          // Сохраняем локацию в store для кнопки
          offersStore.setUserLocation(newLocation)
        },
        (error) => {
          console.log('Location error:', error.message)
          isTracking.value = false
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 3000
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

      const placemark = new ymaps.Placemark(
        coords,
        {
          hintContent: offer.title,
          offerId: offer.id
        },
        {
          preset: categoryIcon.preset,
          iconColor: categoryIcon.color
        }
      )

      placemark.events.add('click', () => {
        offersStore.setSelectedOffer(offer)
        emit('offer-click', offer)
      })

      return placemark
    }

    const updateMarkers = () => {
      if (!clusterer || !ymaps) return

      clusterer.removeAll()
      const placemarks = []

      filteredOffers.value.forEach(offer => {
        const placemark = createCustomPlacemark(offer)
        if (placemark) placemarks.push(placemark)
      })

      clusterer.add(placemarks)
    }

    // Чёрно-белый маркер пользователя
    const createUserMarkerLayout = (heading = 0) => {
      if (!ymaps) return null
      
      return ymaps.templateLayoutFactory.createClass(`
        <div class="user-marker-container">
          <div class="user-marker-accuracy"></div>
          <div class="user-marker-pulse"></div>
          <div class="user-marker-core">
            <div class="user-marker-dot"></div>
          </div>
          <div class="user-marker-direction" style="transform: translate(-50%, -100%) rotate(${heading}deg)"></div>
        </div>
      `)
    }

    const updateUserMarker = (location, shouldAnimate = false) => {
      if (!map || !ymaps || !location) return

      const coords = [location.latitude, location.longitude]
      const heading = location.heading || currentHeading.value || 0

      if (userMarker) {
        // Просто обновляем позицию маркера без анимации центрирования
        userMarker.geometry.setCoordinates(coords)
        const UserMarkerLayout = createUserMarkerLayout(heading)
        userMarker.options.set('iconLayout', UserMarkerLayout)
      } else {
        const UserMarkerLayout = createUserMarkerLayout(heading)

        userMarker = new ymaps.Placemark(
          coords,
          { hintContent: 'Вы здесь' },
          {
            iconLayout: UserMarkerLayout,
            iconShape: { type: 'Circle', coordinates: [0, 0], radius: 40 }
          }
        )

        map.geoObjects.add(userMarker)
      }

      offersStore.setUserLocation(location)
    }

    // Ручное центрирование при нажатии на кнопку локации
    const setUserMarker = (location) => {
      if (!location || !map) return
      
      const lat = location.latitude || location[0]
      const lng = location.longitude || location[1]
      
      updateUserMarker({
        latitude: lat,
        longitude: lng,
        accuracy: location.accuracy || 100
      })
      
      // Центрируем только при РУЧНОМ запросе (кнопка)
      map.setCenter([lat, lng], 15, { duration: 400 })
    }

    // Центрирование на текущей позиции пользователя (для внешней кнопки)
    const centerOnUser = () => {
      const location = userLocation.value
      if (location && map) {
        const lat = location.latitude || location[0]
        const lng = location.longitude || location[1]
        map.setCenter([lat, lng], 15, { duration: 400 })
      }
    }

    watch(filteredOffers, () => updateMarkers(), { deep: true })

    // Убрали автоматическое центрирование при обновлении локации
    // Центрирование только по кнопке через setUserMarker

    onMounted(() => {
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '07b74146-5f5a-46bf-a2b1-cf6d052a41bb'
      
      if (!window.ymaps) {
        const script = document.createElement('script')
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
        script.onload = () => setTimeout(initMap, 300)
        document.head.appendChild(script)
      } else {
        setTimeout(initMap, 300)
      }
    })

    onUnmounted(() => {
      stopLocationTracking()
      if (map) map.destroy()
    })

    return { mapContainer, isTracking, zoomIn, zoomOut }
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
  overflow: hidden;
  /* Тёмная тема через инверсию */
  filter: invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9);
}

/* Кастомные контролы зума - чёрно-белые */
.custom-controls {
  position: absolute;
  right: 16px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 100;
}

.control-btn {
  width: 40px;
  height: 40px;
  background: #000;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #888;
}

.control-btn:hover {
  background: #111;
  border-color: #444;
  color: #fff;
}

.control-btn:active {
  transform: scale(0.95);
}

/* Индикатор GPS - чёрно-белый */
.tracking-indicator {
  position: absolute;
  top: 180px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #000;
  border: 1px solid #333;
  border-radius: 6px;
  z-index: 100;
}

.tracking-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: trackingPulse 1.5s ease-in-out infinite;
}

.tracking-text {
  font-size: 11px;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@keyframes trackingPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Чёрно-белый маркер пользователя */
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
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

:deep(.user-marker-pulse) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: userPulse 2s ease-out infinite;
}

:deep(.user-marker-core) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #000;
  z-index: 10;
}

:deep(.user-marker-dot) {
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
}

:deep(.user-marker-direction) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 20px solid #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
  z-index: 5;
  transition: transform 0.3s ease;
}

@keyframes userPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Полное скрытие элементов Яндекса */
:deep(.ymaps-2-1-79-copyright),
:deep(.ymaps-2-1-79-copyright__wrap),
:deep(.ymaps-2-1-79-map-copyrights-promo),
:deep(.ymaps-2-1-79-copyright__logo),
:deep(.ymaps-2-1-79-copyright__link),
:deep(.ymaps-2-1-79-copyright_ua_logo),
:deep(.ymaps-2-1-79-copyright__agreement),
:deep(.ymaps-2-1-79-controls__toolbar),
:deep(.ymaps-2-1-79-float-button),
:deep(.ymaps-2-1-79-searchbox),
:deep(.ymaps-2-1-79-zoom) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Скрытие ссылок на Яндекс */
:deep(a[href*="yandex"]),
:deep(a[href*="maps.yandex"]) {
  display: none !important;
}
</style>
