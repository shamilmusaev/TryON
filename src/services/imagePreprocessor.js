// Сервис для продвинутой предварительной обработки изображений
class ImagePreprocessorService {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Нормализация цветового пространства для AI моделей
  async normalizeColorSpace(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          // Устанавливаем размеры canvas
          this.canvas.width = img.naturalWidth;
          this.canvas.height = img.naturalHeight;
          
          // Очищаем canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Рисуем изображение с принудительной конвертацией в sRGB
          this.ctx.drawImage(img, 0, 0);
          
          // Получаем данные пикселей для нормализации
          const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          const data = imageData.data;
          
          // Нормализуем цвета (убираем P3 цветовое пространство iPhone)
          for (let i = 0; i < data.length; i += 4) {
            // Применяем гамма-коррекцию для sRGB
            data[i] = this.gammaCorrection(data[i]);     // Red
            data[i + 1] = this.gammaCorrection(data[i + 1]); // Green
            data[i + 2] = this.gammaCorrection(data[i + 2]); // Blue
            // Alpha остается без изменений
          }
          
          // Применяем исправленные данные обратно
          this.ctx.putImageData(imageData, 0, 0);
          
          // Конвертируем в blob
          this.canvas.toBlob((blob) => {
            if (blob) {
              const normalizedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_normalized.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log('🎨 Цветовое пространство нормализовано для AI');
              resolve(normalizedFile);
            } else {
              reject(new Error('Не удалось нормализовать цвета'));
            }
          }, 'image/jpeg', 0.95);
          
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение для нормализации'));
      };
      
      img.src = url;
    });
  }

  // Гамма-коррекция для sRGB
  gammaCorrection(value) {
    const normalized = value / 255;
    const corrected = normalized <= 0.04045 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
    return Math.round(Math.pow(corrected, 1/2.2) * 255);
  }

  // Улучшение контраста и яркости
  async enhanceImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          this.canvas.width = img.naturalWidth;
          this.canvas.height = img.naturalHeight;
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
          
          const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          const data = imageData.data;
          
          // Рассчитываем гистограмму для автоматической коррекции
          const histogram = this.calculateHistogram(data);
          const { brightness, contrast } = this.calculateOptimalAdjustments(histogram);
          
          // Применяем улучшения
          for (let i = 0; i < data.length; i += 4) {
            // Коррекция яркости и контраста
            data[i] = this.clamp((data[i] - 128) * contrast + 128 + brightness);
            data[i + 1] = this.clamp((data[i + 1] - 128) * contrast + 128 + brightness);
            data[i + 2] = this.clamp((data[i + 2] - 128) * contrast + 128 + brightness);
          }
          
          this.ctx.putImageData(imageData, 0, 0);
          
          this.canvas.toBlob((blob) => {
            if (blob) {
              const enhancedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_enhanced.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log('✨ Изображение улучшено: яркость и контраст оптимизированы');
              resolve(enhancedFile);
            } else {
              reject(new Error('Не удалось улучшить изображение'));
            }
          }, 'image/jpeg', 0.95);
          
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение для улучшения'));
      };
      
      img.src = url;
    });
  }

  // Расчет гистограммы
  calculateHistogram(data) {
    const histogram = new Array(256).fill(0);
    
    for (let i = 0; i < data.length; i += 4) {
      const luminance = Math.round(
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      );
      histogram[luminance]++;
    }
    
    return histogram;
  }

  // Расчет оптимальных настроек яркости и контраста
  calculateOptimalAdjustments(histogram) {
    const total = histogram.reduce((sum, count) => sum + count, 0);
    
    // Находим 5% и 95% процентили
    let cumulative = 0;
    let min = 0, max = 255;
    
    for (let i = 0; i < 256; i++) {
      cumulative += histogram[i];
      if (cumulative >= total * 0.05 && min === 0) {
        min = i;
      }
      if (cumulative >= total * 0.95 && max === 255) {
        max = i;
        break;
      }
    }
    
    // Рассчитываем коррекции
    const targetMin = 20;  // Целевой минимум
    const targetMax = 235; // Целевой максимум
    
    const contrast = (targetMax - targetMin) / (max - min);
    const brightness = targetMin - min * contrast;
    
    return {
      brightness: Math.max(-50, Math.min(50, brightness)),
      contrast: Math.max(0.5, Math.min(2.0, contrast))
    };
  }

  // Ограничение значений пикселей
  clamp(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
  }

  // Оптимизация размера для AI (стандартные размеры)
  async resizeForAI(file, targetWidth = 768, targetHeight = 1024) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          // Рассчитываем новые размеры с сохранением пропорций
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          let newWidth, newHeight;
          
          if (aspectRatio > targetWidth / targetHeight) {
            // Изображение шире, ограничиваем по ширине
            newWidth = targetWidth;
            newHeight = Math.round(targetWidth / aspectRatio);
          } else {
            // Изображение выше, ограничиваем по высоте
            newHeight = targetHeight;
            newWidth = Math.round(targetHeight * aspectRatio);
          }
          
          this.canvas.width = newWidth;
          this.canvas.height = newHeight;
          
          this.ctx.clearRect(0, 0, newWidth, newHeight);
          
          // Используем высококачественное масштабирование
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';
          this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          this.canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_ai_ready.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log(`📏 Изображение оптимизировано для AI: ${img.naturalWidth}x${img.naturalHeight} → ${newWidth}x${newHeight}`);
              resolve(resizedFile);
            } else {
              reject(new Error('Не удалось изменить размер изображения'));
            }
          }, 'image/jpeg', 0.95);
          
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение для изменения размера'));
      };
      
      img.src = url;
    });
  }

  // Удаление EXIF данных, которые могут влиять на AI
  async stripMetadata(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          this.canvas.width = img.naturalWidth;
          this.canvas.height = img.naturalHeight;
          
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
          
          this.canvas.toBlob((blob) => {
            if (blob) {
              const cleanFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '_clean.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log('🧹 Метаданные удалены из изображения');
              resolve(cleanFile);
            } else {
              reject(new Error('Не удалось очистить метаданные'));
            }
          }, 'image/jpeg', 0.98);
          
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение для очистки'));
      };
      
      img.src = url;
    });
  }

  // Основной метод: полная обработка изображения для AI
  async preprocessForAI(file, options = {}) {
    const {
      normalizeColors = false,  // Отключено: сохраняем оригинальные цвета iPhone
      enhanceQuality = false,   // Отключено: сохраняем оригинальную контрастность
      optimizeSize = true,      // Включено: изменение размера для AI производительности
      stripMeta = true,         // Включено: очистка метаданных для безопасности
      targetWidth = 768,
      targetHeight = 1024
    } = options;

    console.log('🔧 Начинаю обработку изображения для AI (сохраняем оригинальное качество)...');
    
    try {
      let processedFile = file;
      
      // 1. Удаляем метаданные (безопасно, не влияет на качество)
      if (stripMeta) {
        processedFile = await this.stripMetadata(processedFile);
      }
      
      // 2. Нормализуем цветовое пространство (ОТКЛЮЧЕНО - сохраняем оригинал)
      if (normalizeColors) {
        processedFile = await this.normalizeColorSpace(processedFile);
      }
      
      // 3. Улучшаем качество изображения (ОТКЛЮЧЕНО - сохраняем оригинал)
      if (enhanceQuality) {
        processedFile = await this.enhanceImage(processedFile);
      }
      
      // 4. Оптимизируем размер для AI (только изменение размера)
      if (optimizeSize) {
        processedFile = await this.resizeForAI(processedFile, targetWidth, targetHeight);
      }
      
      console.log('✅ Обработка завершена (оригинальные цвета и контраст сохранены)');
      return processedFile;
      
    } catch (error) {
      console.error('❌ Ошибка при обработке:', error);
      throw error;
    }
  }

  // Определение, нужна ли продвинутая обработка (для iPhone изображений)
  needsAdvancedProcessing(file) {
    // Проверяем признаки iPhone изображения
    const isLargeFile = file.size > 3 * 1024 * 1024; // Больше 3MB
    const isHEVC = /\.(heic|heif)$/i.test(file.name);
    const hasAppleSignature = file.name.includes('IMG_') || file.name.includes('Photo_');
    
    return isLargeFile || isHEVC || hasAppleSignature;
  }
}

// Экспортируем singleton
const imagePreprocessor = new ImagePreprocessorService();
export default imagePreprocessor; 