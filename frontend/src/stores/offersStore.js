// ... предыдущий код без изменений ...

const fetchOffers = async () => {
  isLoading.value = true
  try {
    // TODO: Заменить на реальный API вызов
    const mockOffers = [
      {
        id: 1,
        title: "Кофейня 'Уют'",
        category: "food",
        coordinates: [55.7558, 37.6176],
        address: "ул. Тверская, 1",
        description: "Лучший кофе в городе с домашней атмосферой",
        phone: "+7 (999) 821-47-58", // Обновленный номер
        workingHours: "09:00-22:00",
        rating: 4.8,
        reviews: 124,
        image: "https://via.placeholder.com/300x200/FF6B6B/white?text=Кофейня+Уют"
      },
      {
        id: 2,
        title: "Магазин электроники 'ТехноМир'",
        category: "shopping",
        coordinates: [55.7517, 37.6178],
        address: "ул. Арбат, 15",
        description: "Широкий выбор техники и гаджетов",
        phone: "+7 (999) 821-47-58", // Обновленный номер
        workingHours: "10:00-21:00",
        rating: 4.5,
        reviews: 89,
        image: "https://via.placeholder.com/300x200/4ECDC4/white?text=ТехноМир"
      },
      {
        id: 3,
        title: "Салон красоты 'Элегант'",
        category: "beauty",
        coordinates: [55.7597, 37.6172],
        address: "ул. Петровка, 25",
        description: "Профессиональные услуги красоты",
        phone: "+7 (999) 821-47-58", // Обновленный номер
        workingHours: "09:00-20:00",
        rating: 4.9,
        reviews: 67,
        image: "https://via.placeholder.com/300x200/FFD166/white?text=Элегант"
      }
    ]
    offers.value = mockOffers
  } catch (error) {
    console.error('Ошибка загрузки предложений:', error)
    throw error
  } finally {
    isLoading.value = false
  }
}

// ... остальной код без изменений ...
