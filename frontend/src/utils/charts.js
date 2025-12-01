import { ref, computed, onMounted, onUnmounted } from 'vue'

// Конфигурация цветовой палитры
export const CHART_COLORS = {
  primary: [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ],
  gradient: {
    blue: ['#3B82F6', '#1D4ED8'],
    green: ['#10B981', '#047857'],
    purple: ['#8B5CF6', '#7C3AED']
  }
}

// Типы графиков
export const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  RADAR: 'radar',
  POLAR_AREA: 'polarArea'
}

/**
 * Создает конфигурацию для столбчатой диаграммы
 */
export const createBarChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    title = '',
    showGrid = true,
    stacked = false,
    horizontal = false
  } = data

  const {
    responsive = true,
    maintainAspectRatio = false,
    animationDuration = 800
  } = options

  return {
    type: horizontal ? 'bar' : CHART_TYPES.BAR,
    data: {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || CHART_COLORS.primary[index % CHART_COLORS.primary.length],
        borderColor: dataset.borderColor || '#FFFFFF',
        borderWidth: dataset.borderWidth || 1,
        borderRadius: dataset.borderRadius || 4,
        borderSkipped: false,
        barPercentage: dataset.barPercentage || 0.7,
        categoryPercentage: dataset.categoryPercentage || 0.8
      }))
    },
    options: {
      responsive,
      maintainAspectRatio,
      animation: {
        duration: animationDuration,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "'Inter', sans-serif",
              size: 12
            }
          }
        },
        title: {
          display: !!title,
          text: title,
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: '600'
          },
          padding: {
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.formattedValue}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: showGrid,
            drawBorder: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            maxRotation: 45
          },
          stacked
        },
        y: {
          grid: {
            display: showGrid,
            drawBorder: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            precision: 0
          },
          beginAtZero: true,
          stacked
        }
      }
    }
  }
}

/**
 * Создает конфигурацию для линейного графика
 */
export const createLineChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    title = '',
    showGrid = true,
    fill = false
  } = data

  const {
    responsive = true,
    maintainAspectRatio = false,
    animationDuration = 1000
  } = options

  return {
    type: CHART_TYPES.LINE,
    data: {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        borderColor: dataset.borderColor || CHART_COLORS.primary[index % CHART_COLORS.primary.length],
        backgroundColor: dataset.backgroundColor || `${CHART_COLORS.primary[index % CHART_COLORS.primary.length]}20`,
        borderWidth: dataset.borderWidth || 3,
        pointBackgroundColor: dataset.pointBackgroundColor || '#FFFFFF',
        pointBorderColor: dataset.borderColor || CHART_COLORS.primary[index % CHART_COLORS.primary.length],
        pointBorderWidth: dataset.pointBorderWidth || 2,
        pointRadius: dataset.pointRadius || 4,
        pointHoverRadius: dataset.pointHoverRadius || 6,
        fill: dataset.fill !== undefined ? dataset.fill : fill,
        tension: dataset.tension || 0.4
      }))
    },
    options: {
      responsive,
      maintainAspectRatio,
      animation: {
        duration: animationDuration,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "'Inter', sans-serif",
              size: 12
            }
          }
        },
        title: {
          display: !!title,
          text: title,
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: '600'
          },
          padding: {
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          usePointStyle: true,
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            display: showGrid,
            drawBorder: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            }
          }
        },
        y: {
          grid: {
            display: showGrid,
            drawBorder: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            precision: 0
          },
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'nearest'
      }
    }
  }
}

/**
 * Создает конфигурацию для круговой диаграммы
 */
export const createPieChartConfig = (data, options = {}) => {
  const {
    labels = [],
    datasets = [],
    title = ''
  } = data

  const {
    responsive = true,
    maintainAspectRatio = false,
    cutout = '0%'
  } = options

  return {
    type: CHART_TYPES.PIE,
    data: {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || CHART_COLORS.primary,
        borderColor: dataset.borderColor || '#FFFFFF',
        borderWidth: dataset.borderWidth || 2,
        hoverOffset: dataset.hoverOffset || 12
      }))
    },
    options: {
      responsive,
      maintainAspectRatio,
      cutout,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "'Inter', sans-serif",
              size: 12
            },
            generateLabels: function(chart) {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0]
                  const value = dataset.data[i]
                  const percentage = ((value / dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
                  
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.borderColor,
                    lineWidth: dataset.borderWidth,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        title: {
          display: !!title,
          text: title,
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: '600'
          },
          padding: {
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 11
          },
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      }
    }
  }
}

/**
 * Создает конфигурацию для диаграммы-пончика
 */
export const createDoughnutChartConfig = (data, options = {}) => {
  const config = createPieChartConfig(data, {
    ...options,
    cutout: '50%'
  })
  config.type = CHART_TYPES.DOUGHNUT
  return config
}

/**
 * Хук для работы с графиками в Vue компонентах
 */
export const useChart = (initialConfig = null) => {
  const chartInstance = ref(null)
  const canvasRef = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const initChart = async (ChartLibrary, config, canvasElement = null) => {
    try {
      isLoading.value = true
      error.value = null

      const canvas = canvasElement || canvasRef.value
      if (!canvas) {
        throw new Error('Canvas element not found')
      }

      // Уничтожаем предыдущий экземпляр
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      // Создаем новый график
      chartInstance.value = new ChartLibrary(canvas, config)
      
      return chartInstance.value
    } catch (err) {
      error.value = err.message
      console.error('Chart initialization error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateChart = async (newData) => {
    if (!chartInstance.value) {
      throw new Error('Chart not initialized')
    }

    try {
      chartInstance.value.data = newData
      chartInstance.value.update('none') // Обновление без анимации
    } catch (err) {
      error.value = 'Failed to update chart'
      console.error('Chart update error:', err)
      throw err
    }
  }

  const updateChartData = (datasetIndex, newData) => {
    if (!chartInstance.value) {
      throw new Error('Chart not initialized')
    }

    try {
      chartInstance.value.data.datasets[datasetIndex].data = newData
      chartInstance.value.update()
    } catch (err) {
      error.value = 'Failed to update chart data'
      console.error('Chart data update error:', err)
      throw err
    }
  }

  const destroyChart = () => {
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }
  }

  // Автоматическая очистка при уничтожении компонента
  onUnmounted(() => {
    destroyChart()
  })

  return {
    chartInstance,
    canvasRef,
    isLoading,
    error,
    initChart,
    updateChart,
    updateChartData,
    destroyChart
  }
}

/**
 * Генератор данных для демонстрационных графиков
 */
export const generateDemoData = (type = 'bar', itemCount = 5) => {
  const labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'].slice(0, itemCount)
  
  switch (type) {
    case 'bar':
      return {
        labels,
        datasets: [
          {
            label: 'Посещения',
            data: labels.map(() => Math.floor(Math.random() * 100) + 20)
          },
          {
            label: 'Лайки',
            data: labels.map(() => Math.floor(Math.random() * 50) + 10)
          }
        ]
      }
    
    case 'line':
      return {
        labels,
        datasets: [
          {
            label: 'Активность',
            data: labels.map(() => Math.floor(Math.random() * 100) + 10)
          }
        ]
      }
    
    case 'pie':
      return {
        labels: ['Кафе', 'Рестораны', 'Магазины', 'Услуги', 'Развлечения'].slice(0, itemCount),
        datasets: [
          {
            data: Array.from({ length: itemCount }, () => Math.floor(Math.random() * 100) + 10)
          }
        ]
      }
    
    default:
      return { labels: [], datasets: [] }
  }
}

/**
 * Утилита для экспорта графика как изображения
 */
export const exportChartAsImage = (chartInstance, format = 'png', quality = 1.0) => {
  if (!chartInstance) {
    throw new Error('Chart instance not provided')
  }

  const canvas = chartInstance.canvas
  const imageData = canvas.toDataURL(`image/${format}`, quality)
  
  const link = document.createElement('a')
  link.download = `chart-${new Date().getTime()}.${format}`
  link.href = imageData
  link.click()
}

export default {
  CHART_COLORS,
  CHART_TYPES,
  createBarChartConfig,
  createLineChartConfig,
  createPieChartConfig,
  createDoughnutChartConfig,
  useChart,
  generateDemoData,
  exportChartAsImage
}
