/**
 * Продвинутые утилиты для работы с датами и временем
 */

// Локализация
const LOCALE = 'ru-RU'
const TIMEZONE = 'Europe/Moscow'

// Форматы дат
export const DATE_FORMATS = {
  SHORT: 'dd.MM.yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd.MM.yyyy HH:mm',
  DATETIME_FULL: 'dd MMMM yyyy, HH:mm',
  ISO: 'yyyy-MM-dd',
  RELATIVE: 'relative'
}

// Единицы времени в миллисекундах
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
}

/**
 * Форматирование даты с учетом локали
 */
export const formatDate = (date, format = DATE_FORMATS.SHORT, options = {}) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date')
    }

    // Относительное время
    if (format === DATE_FORMATS.RELATIVE) {
      return getRelativeTime(dateObj)
    }

    const defaultOptions = {
      timeZone: TIMEZONE,
      ...options
    }

    switch (format) {
      case DATE_FORMATS.SHORT:
        return dateObj.toLocaleDateString(LOCALE, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          ...defaultOptions
        })
      
      case DATE_FORMATS.LONG:
        return dateObj.toLocaleDateString(LOCALE, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          ...defaultOptions
        })
      
      case DATE_FORMATS.TIME:
        return dateObj.toLocaleTimeString(LOCALE, {
          hour: '2-digit',
          minute: '2-digit',
          ...defaultOptions
        })
      
      case DATE_FORMATS.DATETIME:
        return dateObj.toLocaleDateString(LOCALE, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          ...defaultOptions
        })
      
      case DATE_FORMATS.DATETIME_FULL:
        return dateObj.toLocaleDateString(LOCALE, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          ...defaultOptions
        })
      
      case DATE_FORMATS.ISO:
        return dateObj.toISOString().split('T')[0]
      
      default:
        return dateObj.toLocaleDateString(LOCALE, defaultOptions)
    }
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Неверная дата'
  }
}

/**
 * Получение относительного времени (например, "2 часа назад")
 */
export const getRelativeTime = (date, options = {}) => {
  const {
    thresholds = {
      minute: 60,
      hour: 24,
      day: 7,
      week: 4,
      month: 12
    },
    formats = {
      past: {
        minute: 'меньше минуты назад',
        minutes: '%d минут назад',
        hour: 'час назад',
        hours: '%d часов назад',
        day: 'вчера',
        days: '%d дней назад',
        week: 'неделю назад',
        weeks: '%d недель назад',
        month: 'месяц назад',
        months: '%d месяцев назад',
        year: 'год назад',
        years: '%d лет назад'
      },
      future: {
        minute: 'через несколько секунд',
        minutes: 'через %d минут',
        hour: 'через час',
        hours: 'через %d часов',
        day: 'завтра',
        days: 'через %d дней',
        week: 'через неделю',
        weeks: 'через %d недель',
        month: 'через месяц',
        months: 'через %d месяцев',
        year: 'через год',
        years: 'через %d лет'
      }
    }
  } = options

  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diff = now.getTime() - targetDate.getTime()
  const absDiff = Math.abs(diff)
  const isPast = diff > 0

  const timeFormats = isPast ? formats.past : formats.future

  if (absDiff < TIME_UNITS.MINUTE) {
    return timeFormats.minute
  } else if (absDiff < TIME_UNITS.HOUR) {
    const minutes = Math.floor(absDiff / TIME_UNITS.MINUTE)
    if (minutes === 1) return timeFormats.minute.replace('minutes', 'minute')
    return timeFormats.minutes.replace('%d', minutes)
  } else if (absDiff < TIME_UNITS.DAY) {
    const hours = Math.floor(absDiff / TIME_UNITS.HOUR)
    if (hours === 1) return timeFormats.hour
    return timeFormats.hours.replace('%d', hours)
  } else if (absDiff < TIME_UNITS.WEEK) {
    const days = Math.floor(absDiff / TIME_UNITS.DAY)
    if (days === 1) return timeFormats.day
    return timeFormats.days.replace('%d', days)
  } else if (absDiff < TIME_UNITS.MONTH) {
    const weeks = Math.floor(absDiff / TIME_UNITS.WEEK)
    if (weeks === 1) return timeFormats.week
    return timeFormats.weeks.replace('%d', weeks)
  } else if (absDiff < TIME_UNITS.YEAR) {
    const months = Math.floor(absDiff / TIME_UNITS.MONTH)
    if (months === 1) return timeFormats.month
    return timeFormats.months.replace('%d', months)
  } else {
    const years = Math.floor(absDiff / TIME_UNITS.YEAR)
    if (years === 1) return timeFormats.year
    return timeFormats.years.replace('%d', years)
  }
}

/**
 * Проверка, является ли дата сегодняшним днем
 */
export const isToday = (date) => {
  const today = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  return today.toDateString() === targetDate.toDateString()
}

/**
 * Проверка, является ли дата вчерашним днем
 */
export const isYesterday = (date) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  return yesterday.toDateString() === targetDate.toDateString()
}

/**
 * Проверка, является ли дата завтрашним днем
 */
export const isTomorrow = (date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  return tomorrow.toDateString() === targetDate.toDateString()
}

/**
 * Получение разницы между двумя датами
 */
export const getDateDiff = (date1, date2, unit = 'days') => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  
  const diff = Math.abs(d2.getTime() - d1.getTime())
  
  switch (unit) {
    case 'seconds':
      return Math.floor(diff / TIME_UNITS.SECOND)
    case 'minutes':
      return Math.floor(diff / TIME_UNITS.MINUTE)
    case 'hours':
      return Math.floor(diff / TIME_UNITS.HOUR)
    case 'days':
      return Math.floor(diff / TIME_UNITS.DAY)
    case 'weeks':
      return Math.floor(diff / TIME_UNITS.WEEK)
    case 'months':
      return Math.floor(diff / TIME_UNITS.MONTH)
    case 'years':
      return Math.floor(diff / TIME_UNITS.YEAR)
    default:
      return diff
  }
}

/**
 * Добавление времени к дате
 */
export const addToDate = (date, amount, unit = 'days') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const result = new Date(dateObj)
  
  switch (unit) {
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount)
      break
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount)
      break
    case 'hours':
      result.setHours(result.getHours() + amount)
      break
    case 'days':
      result.setDate(result.getDate() + amount)
      break
    case 'weeks':
      result.setDate(result.getDate() + (amount * 7))
      break
    case 'months':
      result.setMonth(result.getMonth() + amount)
      break
    case 'years':
      result.setFullYear(result.getFullYear() + amount)
      break
  }
  
  return result
}

/**
 * Получение начала периода (дня, недели, месяца, года)
 */
export const getStartOfPeriod = (date, period = 'day') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const result = new Date(dateObj)
  
  switch (period) {
    case 'minute':
      result.setSeconds(0, 0)
      break
    case 'hour':
      result.setMinutes(0, 0, 0)
      break
    case 'day':
      result.setHours(0, 0, 0, 0)
      break
    case 'week':
      const day = result.getDay()
      const diff = result.getDate() - day + (day === 0 ? -6 : 1)
      result.setDate(diff)
      result.setHours(0, 0, 0, 0)
      break
    case 'month':
      result.setDate(1)
      result.setHours(0, 0, 0, 0)
      break
    case 'year':
      result.setMonth(0, 1)
      result.setHours(0, 0, 0, 0)
      break
  }
  
  return result
}

/**
 * Получение конца периода
 */
export const getEndOfPeriod = (date, period = 'day') => {
  const start = getStartOfPeriod(date, period)
  
  switch (period) {
    case 'minute':
      return addToDate(start, 1, 'minute')
    case 'hour':
      return addToDate(start, 1, 'hour')
    case 'day':
      return addToDate(start, 1, 'day')
    case 'week':
      return addToDate(start, 7, 'days')
    case 'month':
      return addToDate(start, 1, 'month')
    case 'year':
      return addToDate(start, 1, 'year')
    default:
      return start
  }
}

/**
 * Проверка, находится ли дата в диапазоне
 */
export const isDateInRange = (date, startDate, endDate) => {
  const d = typeof date === 'string' ? new Date(date) : date
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  return d >= start && d <= end
}

/**
 * Форматирование длительности
 */
export const formatDuration = (milliseconds, options = {}) => {
  const {
    showMilliseconds = false,
    compact = false
  } = options

  if (milliseconds < TIME_UNITS.SECOND) {
    return showMilliseconds ? `${milliseconds}мс` : '0 сек'
  }

  const seconds = Math.floor(milliseconds / TIME_UNITS.SECOND) % 60
  const minutes = Math.floor(milliseconds / TIME_UNITS.MINUTE) % 60
  const hours = Math.floor(milliseconds / TIME_UNITS.HOUR) % 24
  const days = Math.floor(milliseconds / TIME_UNITS.DAY)

  const parts = []

  if (days > 0) {
    parts.push(`${days}${compact ? 'д' : ' дн'}`)
  }
  if (hours > 0) {
    parts.push(`${hours}${compact ? 'ч' : ' час'}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes}${compact ? 'м' : ' мин'}`)
  }
  if (seconds > 0 && (!compact || parts.length === 0)) {
    parts.push(`${seconds}${compact ? 'с' : ' сек'}`)
  }

  return parts.slice(0, compact ? 2 : undefined).join(compact ? ' ' : ' ')
}

/**
 * Парсинг даты из различных форматов
 */
export const parseDate = (dateString) => {
  if (!dateString) return null
  
  // Пытаемся распарсить как ISO строку
  let date = new Date(dateString)
  if (!isNaN(date.getTime())) return date
  
  // Пытаемся распарсить как российский формат (dd.mm.yyyy)
  const parts = dateString.split('.')
  if (parts.length === 3) {
    const [day, month, year] = parts.map(part => parseInt(part, 10))
    if (day && month && year) {
      date = new Date(year, month - 1, day)
      if (!isNaN(date.getTime())) return date
    }
  }
  
  return null
}

/**
 * Хук для работы с датами в Vue компонентах
 */
export const useDate = (initialDate = null) => {
  const date = ref(initialDate ? parseDate(initialDate) : new Date())
  const formattedDate = computed(() => formatDate(date.value))
  const relativeTime = computed(() => getRelativeTime(date.value))
  const isToday = computed(() => isToday(date.value))

  const updateDate = (newDate) => {
    date.value = parseDate(newDate) || new Date(newDate)
  }

  const addTime = (amount, unit) => {
    date.value = addToDate(date.value, amount, unit)
  }

  const getStart = (period) => {
    return getStartOfPeriod(date.value, period)
  }

  const getEnd = (period) => {
    return getEndOfPeriod(date.value, period)
  }

  return {
    date,
    formattedDate,
    relativeTime,
    isToday,
    updateDate,
    addTime,
    getStart,
    getEnd
  }
}

/**
 * Утилита для работы с временными интервалами
 */
export class TimeInterval {
  constructor(start, end) {
    this.start = typeof start === 'string' ? new Date(start) : start
    this.end = typeof end === 'string' ? new Date(end) : end
  }

  getDuration() {
    return this.end.getTime() - this.start.getTime()
  }

  getFormattedDuration(options = {}) {
    return formatDuration(this.getDuration(), options)
  }

  contains(date) {
    return isDateInRange(date, this.start, this.end)
  }

  overlaps(otherInterval) {
    return this.start < otherInterval.end && this.end > otherInterval.start
  }

  splitIntoChunks(chunkSize, unit = 'days') {
    const chunks = []
    let currentStart = new Date(this.start)
    
    while (currentStart < this.end) {
      const currentEnd = addToDate(currentStart, chunkSize, unit)
      const chunkEnd = currentEnd > this.end ? this.end : currentEnd
      
      chunks.push(new TimeInterval(new Date(currentStart), new Date(chunkEnd)))
      currentStart = chunkEnd
    }
    
    return chunks
  }
}

export default {
  DATE_FORMATS,
  TIME_UNITS,
  formatDate,
  getRelativeTime,
  isToday,
  isYesterday,
  isTomorrow,
  getDateDiff,
  addToDate,
  getStartOfPeriod,
  getEndOfPeriod,
  isDateInRange,
  formatDuration,
  parseDate,
  useDate,
  TimeInterval
}
