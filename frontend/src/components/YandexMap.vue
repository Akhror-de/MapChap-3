<template>
  <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useOffersStore } from '../stores/offersStore.js'
import { storeToRefs } from 'pinia'

// Кастомные иконки для категорий
const CATEGORY_ICONS = {
  food: { emoji: '🍕', color: '#FF6B6B', preset: 'islands#redFoodIcon' },
  shopping: { emoji: '🛍️', color: '#4ECDC4', preset: 'islands#darkGreenShoppingCartIcon' },
  beauty: { emoji: '💄', color: '#FFD166', preset: 'islands#pinkBeautyIcon' },
  services: { emoji: '🔧', color: '#06D6A0', preset: 'islands#orangeRepairShopIcon' },
  medical: { emoji: '⚕️', color: '#118AB2', preset: 'islands#blueMedicalIcon' },
  furniture: { emoji: '🛋️', color: '#073B4C', preset: 'islands#brownHomeIcon' },
  pharmacy: { emoji: '💊', color: '#EF476F', preset: 'islands#redDrugstoreIcon' },
  entertainment: { emoji: '🎭', color: '#7209B7', preset: 'islands#violetTheaterIcon' },
  education: { emoji: '📚', color: '#F72585', preset: 'islands#blueScienceIcon' },
  auto: { emoji: '🚗', color: '#4361EE', preset: 'islands#blueAutoIcon' },
  hotel: { emoji: '🏨', color: '#4CC9F0', preset: 'islands#blueHotelIcon' },
  default: { emoji: '📍', color: '#667eea', preset: 'islands#blueCircleDotIcon' }
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
          map = new ymaps.Map(mapContainer.value, {
            center: [55.751244, 37.618423],
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          })

          // Создаем кластеризатор с кастомными иконками
          clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            groupByCoordinates: false,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 300,
            clusterBalloonContentLayoutHeight: 200
          })

          map.geoObjects.add(clusterer)

          // Добавляем маркеры
          updateMarkers()

          // Слушаем изменения границ карты
          map.events.add('boundschange', () => {
            offersStore.setMapBounds(map.getBounds())
          })

          console.log('✅ Yandex Map initialized successfully')

        } catch (error) {
          console.error('Error initializing Yandex Map:', error)
        }
      })
    }

    const createCustomPlacemark = (offer) => {
      const categoryIcon = CATEGORY_ICONS[offer.category] || CATEGORY_ICONS.default
      
      // Получаем координаты (поддерживаем оба формата)
      let coords
      if (offer.coordinates) {
        if (Array.isArray(offer.coordinates)) {
          coords = offer.coordinates
        } else if (offer.coordinates.coordinates) {
          // MongoDB GeoJSON format [lng, lat] -> [lat, lng]
          coords = [offer.coordinates.coordinates[1], offer.coordinates.coordinates[0]]
        }
      }
      
      if (!coords) return null

      const balloonContent = `
        <div class="map-balloon">
          <div class="balloon-header">
            <span class="balloon-category-icon">${categoryIcon.emoji}</span>
            <h3 class="balloon-title">${offer.title}</h3>
          </div>
          <p class="balloon-description">${offer.description || ''}</p>
          <div class="balloon-info">
            <div class="balloon-address">📍 ${offer.address}</div>
            <div class="balloon-phone">📞 ${offer.phone}</div>
            ${offer.rating ? `<div class="balloon-rating">⭐ ${offer.rating} (${offer.reviews_count || 0} отзывов)</div>` : ''}
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

      // Обработчик клика
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

    // Создаем кастомный анимированный маркер пользователя
    const createUserMarkerLayout = () => {
      if (!ymaps) return null
      
      return ymaps.templateLayoutFactory.createClass(`
        <div class="user-marker-container">
          <div class="user-marker-pulse"></div>
          <div class="user-marker-pulse-delay"></div>
          <div class="user-marker-core">
            <div class="user-marker-icon">📍</div>
          </div>
          <div class="user-marker-direction"></div>
        </div>
      `)
    }

    const setUserMarker = (location) => {
      if (!map || !ymaps || !location) return

      if (userMarker) {
        map.geoObjects.remove(userMarker)
      }

      const coords = [location.latitude || location[0], location.longitude || location[1]]

      // Создаем кастомный layout для маркера
      const UserMarkerLayout = createUserMarkerLayout()

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
            </div>
          `
        },
        {
          iconLayout: UserMarkerLayout,
          iconShape: {
            type: 'Circle',
            coordinates: [0, 0],
            radius: 30
          }
        }
      )

      map.geoObjects.add(userMarker)
      map.setCenter(coords, 14, { duration: 500 })
      
      console.log('📍 User marker set at:', coords)
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
      if (map) {
        map.destroy()
      }
    })

    return {
      mapContainer
    }
  }
}
</script>

<style scoped>
.yandex-map {
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
}

/* Стили для балунов */
:deep(.map-balloon) {
  padding: 12px;
  max-width: 280px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

:deep(.balloon-description) {
  margin: 0 0 10px 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

:deep(.balloon-info) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #374151;
}

:deep(.balloon-stats) {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
  color: #6b7280;
}

:deep(.balloon-rating) {
  color: #f59e0b;
  font-weight: 500;
}
</style>
