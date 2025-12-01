/**
 * Утилиты для экспорта данных в различные форматы
 */

// Типы экспорта
export const EXPORT_TYPES = {
  CSV: 'csv',
  JSON: 'json',
  EXCEL: 'xlsx',
  PDF: 'pdf'
}

// MIME types
export const MIME_TYPES = {
  [EXPORT_TYPES.CSV]: 'text/csv;charset=utf-8;',
  [EXPORT_TYPES.JSON]: 'application/json;charset=utf-8;',
  [EXPORT_TYPES.EXCEL]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

/**
 * Экспорт данных в CSV формат
 */
export const exportToCSV = (data, filename = 'data', options = {}) => {
  try {
    const {
      headers = null,
      delimiter = ',',
      includeHeader = true
    } = options

    // Подготовка данных
    let csvContent = ''
    const actualHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : [])
    
    // Добавляем заголовки
    if (includeHeader && actualHeaders.length > 0) {
      csvContent += actualHeaders.map(header => `"${header}"`).join(delimiter) + '\n'
    }

    // Добавляем данные
    data.forEach(item => {
      const row = actualHeaders.map(header => {
        const value = item[header]
        // Экранирование специальных символов
        if (value === null || value === undefined) return ''
        const stringValue = String(value).replace(/"/g, '""')
        return `"${stringValue}"`
      }).join(delimiter)
      csvContent += row + '\n'
    })

    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: MIME_TYPES[EXPORT_TYPES.CSV] })
    downloadBlob(blob, `${filename}.csv`)
    
    return true
  } catch (error) {
    console.error('CSV export error:', error)
    throw new Error(`Ошибка экспорта в CSV: ${error.message}`)
  }
}

/**
 * Экспорт данных в JSON формат
 */
export const exportToJSON = (data, filename = 'data', options = {}) => {
  try {
    const {
      prettyPrint = true,
      includeMetadata = true
    } = options

    const exportData = {
      ...(includeMetadata && {
        metadata: {
          exportedAt: new Date().toISOString(),
          totalItems: data.length,
          version: '1.0'
        }
      }),
      data
    }

    const jsonContent = prettyPrint 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData)

    const blob = new Blob([jsonContent], { type: MIME_TYPES[EXPORT_TYPES.JSON] })
    downloadBlob(blob, `${filename}.json`)
    
    return true
  } catch (error) {
    console.error('JSON export error:', error)
    throw new Error(`Ошибка экспорта в JSON: ${error.message}`)
  }
}

/**
 * Экспорт избранных мест
 */
export const exportFavorites = async (favorites, format = EXPORT_TYPES.CSV, options = {}) => {
  try {
    // Преобразуем данные избранного в плоскую структуру
    const flattenedData = favorites.map(fav => ({
      'ID': fav.id,
      'Название': fav.name,
      'Категория': fav.category,
      'Адрес': fav.address,
      'Рейтинг': fav.rating || 'Нет',
      'Расстояние (км)': fav.distance || 'Нет',
      'Телефон': fav.phone || 'Нет',
      'Ценовой диапазон': fav.price_range || 'Нет',
      'Открыто сейчас': fav.is_open ? 'Да' : 'Нет',
      'Количество посещений': fav.visit_count || 0,
      'Количество отзывов': fav.review_count || 0,
      'Дата добавления': formatDateForExport(fav.added_at),
      'Теги': Array.isArray(fav.tags) ? fav.tags.join(', ') : '',
      'Описание': fav.description || ''
    }))

    switch (format) {
      case EXPORT_TYPES.CSV:
        return exportToCSV(flattenedData, 'my-favorites', options)
      
      case EXPORT_TYPES.JSON:
        return exportToJSON(flattenedData, 'my-favorites', options)
      
      case EXPORT_TYPES.EXCEL:
        return await exportToExcel(flattenedData, 'my-favorites', options)
      
      default:
        throw new Error(`Неподдерживаемый формат экспорта: ${format}`)
    }
  } catch (error) {
    console.error('Favorites export error:', error)
    throw new Error(`Ошибка экспорта избранного: ${error.message}`)
  }
}

/**
 * Экспорт статистики пользователя
 */
export const exportUserStats = async (userStats, format = EXPORT_TYPES.JSON, options = {}) => {
  try {
    const statsData = {
      basicStats: {
        'Всего избранных мест': userStats.totalFavorites,
        'Просмотры профиля': userStats.totalViews,
        'Комментарии': userStats.totalComments,
        'Отзывы': userStats.totalReviews,
        'Дней активности': userStats.daysActive,
        'Категории': userStats.favoriteCategories,
        'Средний рейтинг': userStats.avgRating
      },
      categoryDistribution: userStats.categoryDistribution,
      achievements: userStats.achievements,
      monthlyActivity: userStats.monthlyActivity
    }

    switch (format) {
      case EXPORT_TYPES.JSON:
        return exportToJSON(statsData, 'my-statistics', {
          ...options,
          includeMetadata: true
        })
      
      case EXPORT_TYPES.CSV:
        // Преобразуем базовую статистику в CSV
        const basicStatsArray = [statsData.basicStats]
        return exportToCSV(basicStatsArray, 'my-statistics-basic', options)
      
      default:
        throw new Error(`Экспорт статистики поддерживается только в JSON и CSV форматах`)
    }
  } catch (error) {
    console.error('User stats export error:', error)
    throw new Error(`Ошибка экспорта статистики: ${error.message}`)
  }
}

/**
 * Вспомогательная функция для скачивания Blob
 */
const downloadBlob = (blob, filename) => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Очистка URL
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Форматирование даты для экспорта
 */
const formatDateForExport = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

/**
 * Экспорт в Excel (использует стороннюю библиотеку)
 */
export const exportToExcel = async (data, filename = 'data', options = {}) => {
  try {
    // Динамический импорт библиотеки
    const XLSX = await import('xlsx').then(module => module.default)
    
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    
    // Генерируем Excel файл
    XLSX.writeFile(workbook, `${filename}.xlsx`)
    
    return true
  } catch (error) {
    console.error('Excel export error:', error)
    throw new Error(`Ошибка экспорта в Excel: ${error.message}`)
  }
}

/**
 * Создание отчета в PDF (базовый вариант)
 */
export const exportToPDF = async (data, filename = 'report', options = {}) => {
  try {
    // Для полноценного PDF экспорта обычно используется библиотека типа jsPDF
    // Здесь базовая реализация через print
    const { title = 'Отчет', headers = [], rows = [] } = options
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Не удалось открыть окно для печати')
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .metadata { color: #666; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="metadata">
            Сгенерировано: ${new Date().toLocaleDateString('ru-RU')}
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
    
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error(`Ошибка экспорта в PDF: ${error.message}`)
  }
}

/**
 * Хук для использования утилит экспорта в Vue компонентах
 */
export const useExport = () => {
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const exportError = ref(null)

  const executeExport = async (exportFn, ...args) => {
    try {
      isExporting.value = true
      exportError.value = null
      exportProgress.value = 10
      
      await exportFn(...args)
      
      exportProgress.value = 100
      return true
    } catch (error) {
      exportError.value = error.message
      console.error('Export execution error:', error)
      throw error
    } finally {
      isExporting.value = false
      setTimeout(() => {
        exportProgress.value = 0
      }, 1000)
    }
  }

  const resetExport = () => {
    exportError.value = null
    exportProgress.value = 0
  }

  return {
    isExporting,
    exportProgress,
    exportError,
    executeExport,
    resetExport
  }
}

export default {
  EXPORT_TYPES,
  MIME_TYPES,
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportToPDF,
  exportFavorites,
  exportUserStats,
  useExport
}
