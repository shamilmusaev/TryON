// Сервис для удаления фона с изображений одежды
class BackgroundRemoverService {
  constructor() {
    this.apiKey = null; // В продакшене нужно будет добавить API ключ для remove.bg
    this.isEnabled = true; // Можно отключить в development режиме
  }

  // Проверка, нужно ли удалять фон (для одежды - да, для людей - нет)
  shouldRemoveBackground(type) {
    return type === 'outfit' || type === 'clothing';
  }

  // Основной метод удаления фона
  async removeBackground(file, type = 'outfit') {
    try {
      if (!this.shouldRemoveBackground(type)) {
        console.log('🚫 Удаление фона не требуется для типа:', type);
        return file;
      }

      console.log('🎭 Начинаю удаление фона с изображения одежды...');

      // Для продакшена можно использовать remove.bg API
      if (this.apiKey) {
        return await this.removeBackgroundWithAPI(file);
      }

      // Всегда пытаемся использовать простую обработку (убрал проверку development режима)
      return await this.simpleBackgroundRemoval(file);

    } catch (error) {
      console.error('❌ Ошибка удаления фона:', error);
      // В случае ошибки возвращаем оригинальный файл
      return file;
    }
  }

  // Удаление фона через remove.bg API (для продакшена)
  async removeBackgroundWithAPI(file) {
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    
    return new File(
      [blob], 
      file.name.replace(/\.[^/.]+$/, '_no_bg.png'),
      { type: 'image/png' }
    );
  }

  // Простое удаление фона (fallback метод)
  async simpleBackgroundRemoval(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const url = URL.createObjectURL(file);

      img.onload = () => {
        try {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          // Рисуем изображение
          ctx.drawImage(img, 0, 0);

          // Получаем данные пикселей
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Определяем фоновый цвет из углов изображения
          const corners = [
            [0, 0], // Верхний левый
            [canvas.width - 1, 0], // Верхний правый
            [0, canvas.height - 1], // Нижний левый
            [canvas.width - 1, canvas.height - 1] // Нижний правый
          ];

          let backgroundColors = [];
          
          corners.forEach(([x, y]) => {
            const pixelIndex = (y * canvas.width + x) * 4;
            backgroundColors.push({
              r: data[pixelIndex],
              g: data[pixelIndex + 1],
              b: data[pixelIndex + 2]
            });
          });

          // Улучшенный алгоритм удаления фона
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            let isBackground = false;

            // Проверяем на белый/светлый фон
            const brightness = (r + g + b) / 3;
            const isWhitish = brightness > 180 && 
                             Math.abs(r - g) < 40 && 
                             Math.abs(g - b) < 40 && 
                             Math.abs(r - b) < 40;

            // Проверяем схожесть с углами изображения
            const isSimilarToCorners = backgroundColors.some(bg => {
              const colorDiff = Math.abs(r - bg.r) + Math.abs(g - bg.g) + Math.abs(b - bg.b);
              return colorDiff < 80; // Порог схожести
            });

            // Проверяем на очень светлые или очень темные однотонные области
            const isPlainBackground = brightness > 220 || brightness < 40;

            isBackground = isWhitish || isSimilarToCorners || isPlainBackground;
            
            if (isBackground) {
              data[i + 3] = 0; // Делаем прозрачным
            }
          }

          // Применяем изменения
          ctx.putImageData(imageData, 0, 0);

          // Конвертируем в blob
          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File(
                [blob], 
                file.name.replace(/\.[^/.]+$/, '_no_bg.png'),
                { type: 'image/png' }
              );
              
              console.log('✅ Улучшенное удаление фона завершено');
              resolve(processedFile);
            } else {
              reject(new Error('Не удалось обработать изображение'));
            }
          }, 'image/png', 0.95);

        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Не удалось загрузить изображение'));
      };

      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  // Установка API ключа для remove.bg
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Включение/выключение сервиса
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}

// Экспортируем singleton
const backgroundRemover = new BackgroundRemoverService();
export default backgroundRemover; 