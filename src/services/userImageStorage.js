// Сервис для управления пользовательскими изображениями
class UserImageStorage {
  constructor() {
    this.storageKey = 'userUploadedImages';
    this.lastUsedKey = 'lastUsedImages';
  }

  // Получить все сохраненные изображения
  getAllImages() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      return [];
    }
  }

  // Сохранить изображение
  saveImage(imageData, type = 'person') {
    try {
      const images = this.getAllImages();
      const newImage = {
        id: this.generateId(),
        url: imageData.url,
        file: imageData.file ? {
          name: imageData.file.name,
          size: imageData.file.size,
          type: imageData.file.type
        } : null,
        type: type, // 'person' или 'outfit'
        uploadedAt: new Date().toISOString(),
        isLastUsed: false,
        name: imageData.name || `${type}_${Date.now()}`
      };

      // Убираем флаг lastUsed у других изображений того же типа
      images.forEach(img => {
        if (img.type === type) {
          img.isLastUsed = false;
        }
      });

      // Добавляем новое изображение как последнее использованное
      newImage.isLastUsed = true;
      images.push(newImage);

      // Ограничиваем количество сохраненных изображений (максимум 20)
      const maxImages = 20;
      if (images.length > maxImages) {
        // Удаляем самые старые изображения
        images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        images.splice(maxImages);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(images));
      this.setLastUsedImage(type, newImage);
      
      console.log('✅ Изображение сохранено:', newImage);
      return newImage;
    } catch (error) {
      console.error('❌ Ошибка при сохранении изображения:', error);
      return null;
    }
  }

  // Получить изображения по типу
  getImagesByType(type) {
    const images = this.getAllImages();
    return images.filter(img => img.type === type)
                 .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }

  // Получить последнее использованное изображение по типу
  getLastUsedImage(type) {
    try {
      const lastUsed = localStorage.getItem(this.lastUsedKey);
      const lastUsedData = lastUsed ? JSON.parse(lastUsed) : {};
      return lastUsedData[type] || null;
    } catch (error) {
      console.error('Ошибка при загрузке последнего изображения:', error);
      return null;
    }
  }

  // Установить последнее использованное изображение
  setLastUsedImage(type, imageData) {
    try {
      const lastUsed = localStorage.getItem(this.lastUsedKey);
      const lastUsedData = lastUsed ? JSON.parse(lastUsed) : {};
      
      lastUsedData[type] = {
        id: imageData.id,
        url: imageData.url,
        name: imageData.name,
        uploadedAt: imageData.uploadedAt
      };
      
      localStorage.setItem(this.lastUsedKey, JSON.stringify(lastUsedData));
      
      // Обновляем флаг isLastUsed в общем списке
      const images = this.getAllImages();
      images.forEach(img => {
        img.isLastUsed = (img.type === type && img.id === imageData.id);
      });
      localStorage.setItem(this.storageKey, JSON.stringify(images));
      
    } catch (error) {
      console.error('Ошибка при установке последнего изображения:', error);
    }
  }

  // Удалить изображение
  deleteImage(imageId) {
    try {
      const images = this.getAllImages();
      const filteredImages = images.filter(img => img.id !== imageId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredImages));
      
      // Проверяем, было ли это последнее использованное изображение
      const lastUsed = localStorage.getItem(this.lastUsedKey);
      if (lastUsed) {
        const lastUsedData = JSON.parse(lastUsed);
        Object.keys(lastUsedData).forEach(type => {
          if (lastUsedData[type].id === imageId) {
            delete lastUsedData[type];
          }
        });
        localStorage.setItem(this.lastUsedKey, JSON.stringify(lastUsedData));
      }
      
      console.log('✅ Изображение удалено:', imageId);
      return true;
    } catch (error) {
      console.error('❌ Ошибка при удалении изображения:', error);
      return false;
    }
  }

  // Очистить все изображения
  clearAll() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.lastUsedKey);
      console.log('✅ Все изображения очищены');
      return true;
    } catch (error) {
      console.error('❌ Ошибка при очистке изображений:', error);
      return false;
    }
  }

  // Получить статистику
  getStats() {
    const images = this.getAllImages();
    const personImages = images.filter(img => img.type === 'person');
    const outfitImages = images.filter(img => img.type === 'outfit');
    
    return {
      total: images.length,
      person: personImages.length,
      outfit: outfitImages.length,
      storageSize: this.getStorageSize()
    };
  }

  // Получить размер хранилища
  getStorageSize() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? new Blob([data]).size : 0;
    } catch (error) {
      return 0;
    }
  }

  // Генерировать уникальный ID
  generateId() {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Конвертировать File в base64 для хранения
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Проверить, поддерживается ли localStorage
  isStorageSupported() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Создаем единственный экземпляр
const userImageStorage = new UserImageStorage();

export default userImageStorage; 