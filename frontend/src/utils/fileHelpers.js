export const validateImageFile = (file, maxSizeMB = 5) => {
  const errors = []
  
  // Проверка типа файла
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    errors.push('Допустимые форматы: JPEG, PNG, WebP, GIF')
  }
  
  // Проверка размера файла
  const maxSize = maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    errors.push(`Максимальный размер файла: ${maxSizeMB}MB`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const compressImage = (file, quality = 0.8, maxWidth = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    reader.onload = (e) => {
      img.onload = () => {
        // Рассчитываем новые размеры
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Рисуем сжатое изображение
        ctx.drawImage(img, 0, 0, width, height)
        
        // Конвертируем в blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Не удалось сжать изображение'))
              return
            }
            
            // Создаем новый файл с тем же именем
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Ошибка загрузки изображения'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsDataURL(file)
  })
}

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Ошибка создания превью'))
    reader.readAsDataURL(file)
  })
}
