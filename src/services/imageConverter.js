// Сервис для конвертации изображений, включая HEVC в JPEG
import heicPolyfill from './heicPolyfill';
import imagePreprocessor from './imagePreprocessor';

class ImageConverterService {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Проверка, является ли файл HEVC/HEIF форматом
  isHEVCFormat(file) {
    return heicPolyfill.canProcess(file);
  }

  // Проверка, является ли изображение с iPhone
  isiPhoneImage(file) {
    return imagePreprocessor.needsAdvancedProcessing(file);
  }

  // Конвертация HEVC в JPEG с сохранением качества
  async convertHEVCToJPEG(file, quality = 0.95) {
    try {
      // Используем наш полифил для обработки HEIC
      const convertedFile = await heicPolyfill.convertHEIC(file);
      
      // Если полифил вернул тот же файл (не смог конвертировать),
      // пробуем стандартный метод через canvas
      if (convertedFile === file) {
        return await this.fallbackConversion(file, quality);
      }
      
      return convertedFile;
      
    } catch (error) {
      console.warn('HEIC polyfill failed, trying fallback:', error.message);
      return await this.fallbackConversion(file, quality);
    }
  }

  // Fallback метод конвертации через обычный Image + Canvas
  async fallbackConversion(file, quality = 0.95) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Создаем URL для файла
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          // Настраиваем canvas под размер изображения
          this.canvas.width = img.naturalWidth;
          this.canvas.height = img.naturalHeight;
          
          // Очищаем canvas
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Рисуем изображение на canvas с оптимальными настройками
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';
          this.ctx.drawImage(img, 0, 0);
          
          // Конвертируем в blob с высоким качеством JPEG
          this.canvas.toBlob((blob) => {
            if (blob) {
              // Создаем новый File объект
              const convertedFile = new File(
                [blob], 
                file.name.replace(/\.(heic|heif)$/i, '.jpg'),
                { type: 'image/jpeg' }
              );
              
              console.log(`✅ HEVC конвертирован: ${file.name} (${(file.size/1024/1024).toFixed(2)}MB) → ${convertedFile.name} (${(convertedFile.size/1024/1024).toFixed(2)}MB)`);
              resolve(convertedFile);
            } else {
              reject(new Error('Не удалось конвертировать HEVC изображение'));
            }
          }, 'image/jpeg', quality);
          
        } catch (error) {
          reject(error);
        } finally {
          // Освобождаем память
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить HEVC изображение для конвертации'));
      };
      
      // Устанавливаем crossOrigin для избежания CORS проблем
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  // Оптимизация любого изображения (уменьшение размера при сохранении качества)
  async optimizeImage(file, maxWidth = 2048, maxHeight = 2048, quality = 0.9) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        try {
          let { width, height } = img;
          
          // Рассчитываем новые размеры с сохранением пропорций
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          
          this.canvas.width = width;
          this.canvas.height = height;
          
          this.ctx.clearRect(0, 0, width, height);
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';
          this.ctx.drawImage(img, 0, 0, width, height);
          
          this.canvas.toBlob((blob) => {
            if (blob) {
              const optimizedFile = new File(
                [blob], 
                file.name,
                { type: file.type }
              );
              
              console.log(`🔧 Оптимизировано: ${(file.size/1024/1024).toFixed(2)}MB → ${(optimizedFile.size/1024/1024).toFixed(2)}MB`);
              resolve(optimizedFile);
            } else {
              reject(new Error('Не удалось оптимизировать изображение'));
            }
          }, file.type, quality);
          
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение для оптимизации'));
      };
      
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  // Главный метод: автоматическая обработка файла
  async processImage(file) {
    console.log(`🖼️ Начало обработки изображения: ${file.name}, размер: ${(file.size / 1024).toFixed(2)} KB`);
    try {
      let processedFile = file;
      
      // Если это HEVC, конвертируем в JPEG
      if (this.isHEVCFormat(file)) {
        console.log('🔄 Обнаружен HEVC формат, конвертирую в JPEG...');
        processedFile = await this.convertHEVCToJPEG(file, 0.95);
      }
      
      // Если это изображение с iPhone, применяем продвинутую обработку
      if (this.isiPhoneImage(file)) {
        console.log('📱 Обнаружено изображение iPhone, применяю базовую обработку...');
        processedFile = await imagePreprocessor.preprocessForAI(processedFile, {
          normalizeColors: false,  // Сохраняем оригинальные цвета
          enhanceQuality: false,   // Сохраняем оригинальную контрастность
          optimizeSize: true,      // Только изменение размера для AI
          stripMeta: true,         // Очистка метаданных для безопасности
          targetWidth: 768,
          targetHeight: 1024
        });
      } else {
        // Для обычных изображений - стандартная оптимизация
        const maxSizeForOptimization = 8 * 1024 * 1024; // 8MB
        if (processedFile.size > maxSizeForOptimization) {
          console.log('📉 Файл большой, оптимизирую...');
          processedFile = await this.optimizeImage(processedFile, 2048, 2048, 0.9);
        }
      }
      
      return processedFile;
    } catch (error) {
      console.error('❌ Ошибка обработки изображения:', error);
      throw error;
    }
  }

  // Получение информации об изображении
  async getImageInfo(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        const info = {
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          isPortrait: img.naturalHeight > img.naturalWidth,
          isLandscape: img.naturalWidth > img.naturalHeight,
          isSquare: img.naturalWidth === img.naturalHeight,
          isiPhoneImage: this.isiPhoneImage(file),
          isHEVC: this.isHEVCFormat(file)
        };
        
        URL.revokeObjectURL(url);
        resolve(info);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось получить информацию об изображении'));
      };
      
      img.src = url;
    });
  }

  // Конвертировать файл в Base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}

// Экспортируем singleton instance
const imageConverter = new ImageConverterService();
export default imageConverter; 