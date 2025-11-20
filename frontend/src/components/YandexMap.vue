<template>
  <div id="yandex-map" ref="mapContainer" class="yandex-map"></div>
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  name: 'YandexMap',
  setup() {
    const mapContainer = ref(null)
    let map = null
    let ymaps = null

    const initMap = () => {
      // Проверяем, загружены ли Яндекс.Карты
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
          // Создаем карту
          map = new ymaps.Map(mapContainer.value, {
            center: [55.751244, 37.618423], // Москва
            zoom: 10,
            controls: [
              'zoomControl',
              'fullscreenControl'
            ]
          })

          // Добавляем кастомные элементы управления
          addCustomControls(map, ymaps)
          
          // Загружаем тестовые метки
          addTestPlacemarks(map, ymaps)

          console.log('Yandex Map initialized successfully')

        } catch (error) {
          console.error('Error initializing Yandex Map:', error)
        }
      })
    }

    const addCustomControls = (map, ymaps) => {
      // Кастомная кнопка для поиска
      const searchButton = new ymaps.control.Button({
        data: {
          content: '🔍 Поиск',
          title: 'Поиск мест'
        },
        options: {
          selectOnClick: false,
          maxWidth: 120
        }
      })
      
      searchButton.events.add('press', function () {
        alert('Функция поиска будет реализована позже')
      })

      map.controls.add(searchButton, {
        float: 'right',
        floatIndex: 0
      })
    }

    const addTestPlacemarks = (map, ymaps) => {
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
        const marker = new ymaps.Placemark(
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

        map.geoObjects.add(marker)
      })
    }

    onMounted(() => {
      console.log('YandexMap component mounted')
      
      // Загружаем Яндекс.Карты API
      const script = document.createElement('script')
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=07b74146-5f5a-46bf-a2b1-cf6d052a41bb&lang=ru_RU'
      script.onload = () => {
        // Даем время на рендеринг DOM
        setTimeout(() => {
          initMap()
        }, 500)
      }
      document.head.appendChild(script)
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
