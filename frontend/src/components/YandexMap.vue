<template>
  <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue'
import { yandexMapsService } from '../services/yandexMaps.js'

export default {
  name: 'YandexMap',
  setup() {
    const mapContainer = ref(null)
    let map = null

    const initMap = async () => {
      try {
        // Загружаем Яндекс.Карты API
        if (!window.ymaps) {
          await loadYandexMaps()
        }

        // Инициализируем карту
        map = await yandexMapsService.init('yandex-map', {
          center: [55.751244, 37.618423], // Москва
          zoom: 10
        })

        // Добавляем тестовые метки
        addTestPlacemarks()

        console.log('Yandex Map initialized successfully')

      } catch (error) {
        console.error('Error initializing Yandex Map:', error)
      }
    }

    const loadYandexMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.ymaps) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`
        script.onload = () => {
          window.ymaps.ready(resolve)
        }
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const addTestPlacemarks = () => {
      // Тестовые метки
      const placemarks = [
        {
          coords: [55.751244, 37.618423],
          title: 'Кофейня "Уютный уголок"',
          description: 'Лучший кофе в городе, свежая выпечка',
          category: 'food'
        },
        {
          coords: [55.753215, 37.622504],
          title: 'ТЦ "Мега"',
          description: 'Крупный торговый центр',
          category: 'shopping'
        },
        {
          coords: [55.749762, 37.621594],
          title: 'Салон красоты "Элегант"',
          description: 'Парикмахерские услуги, маникюр',
          category: 'beauty'
        }
      ]

      placemarks.forEach(placemark => {
        yandexMapsService.addMarker(
          placemark.coords,
          {
            balloonContent: `
              <div class="map-balloon">
                <h3>${placemark.title}</h3>
                <p>${placemark.description}</p>
                <div class="balloon-category">${placemark.category}</div>
              </div>
            `,
            hintContent: placemark.title
          },
          {
            preset: 'islands#blueFoodIcon',
            balloonCloseButton: true,
            hideIconOnBalloonOpen: false
          }
        )
      })
    }

    onMounted(() => {
      console.log('YandexMap component mounted')
      // Даем время на рендеринг DOM
      setTimeout(() => {
        initMap()
      }, 500)
    })

    onUnmounted(() => {
      if (map) {
        // yandexMapsService уже управляет картой
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
  border-radius: 16px;
  overflow: hidden;
}

/* Стили для балунов */
:deep(.map-balloon) {
  padding: 10px;
  max-width: 250px;
}

:deep(.map-balloon h3) {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
}

:deep(.map-balloon p) {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

:deep(.balloon-category) {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
