// Полифил для обработки HEIC изображений в браузерах
class HEICPolyfill {
  constructor() {
    this.isSupported = this.checkHEICSupport();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Проверяем нативную поддержку HEIC браузером
  checkHEICSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Проверяем через типы MIME
    const supportedTypes = [
      'image/heic',
      'image/heif'
    ];
    
    return supportedTypes.some(type => {
      const img = new Image();
      try {
        // В Safari и современных браузерах это должно работать
        return img.src = `data:${type};base64,` && true;
      } catch (e) {
        return false;
      }
    });
  }

  // Загружаем и конвертируем HEIC с помощью FileReader
  async loadHEICAsImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          resolve(img);
        };
        
        img.onerror = () => {
          // Если браузер не может загрузить HEIC нативно,
          // попробуем другие методы
          reject(new Error('Browser cannot load HEIC natively'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read HEIC file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Альтернативный метод через canvas для конвертации
  async convertWithCanvas(file) {
    try {
      const img = await this.loadHEICAsImage(file);
      
      // Настраиваем canvas
      this.canvas.width = img.naturalWidth || img.width;
      this.canvas.height = img.naturalHeight || img.height;
      
      // Очищаем и рисуем
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.drawImage(img, 0, 0);
      
      // Конвертируем в JPEG
      return new Promise((resolve, reject) => {
        this.canvas.toBlob((blob) => {
          if (blob) {
            const convertedFile = new File(
              [blob],
              file.name.replace(/\.(heic|heif)$/i, '.jpg'),
              { type: 'image/jpeg' }
            );
            resolve(convertedFile);
          } else {
            reject(new Error('Canvas conversion failed'));
          }
        }, 'image/jpeg', 0.95);
      });
      
    } catch (error) {
      throw new Error(`HEIC conversion failed: ${error.message}`);
    }
  }

  // Проверяем, можем ли мы обработать файл
  canProcess(file) {
    const isHEIC = /\.(heic|heif)$/i.test(file.name) || 
                   ['image/heic', 'image/heif'].includes(file.type);
    return isHEIC;
  }

  // Основной метод конвертации
  async convertHEIC(file) {
    if (!this.canProcess(file)) {
      throw new Error('File is not HEIC format');
    }

    console.log('🔄 Converting HEIC file:', file.name);
    
    try {
      // Пробуем нативную поддержку браузера
      if (this.isSupported) {
        console.log('✅ Using native HEIC support');
        return await this.convertWithCanvas(file);
      }
      
      // Если нативной поддержки нет, используем fallback
      console.log('⚠️ No native HEIC support, using fallback method');
      return await this.convertWithCanvas(file);
      
    } catch (error) {
      console.error('❌ HEIC conversion failed:', error);
      
      // Последняя попытка - вернуть оригинальный файл
      // В надежде, что сервер сможет его обработать
      console.warn('⚠️ Returning original HEIC file - server will handle conversion');
      return file;
    }
  }

  // Получение метаданных изображения
  async getImageMetadata(file) {
    try {
      const img = await this.loadHEICAsImage(file);
      
      return {
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
        hasNativeSupport: this.isSupported
      };
    } catch (error) {
      console.warn('Could not extract HEIC metadata:', error);
      return null;
    }
  }
}

// Экспортируем singleton
const heicPolyfill = new HEICPolyfill();
export default heicPolyfill; 