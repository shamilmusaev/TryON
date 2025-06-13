// Сервис для управления пользовательскими изображениями
class UserImageStorage {
  constructor() {
    this.storageKey = 'user_uploaded_images';
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
    if (!imageData || !imageData.url) {
      console.error('Невозможно сохранить изображение: неверные данные', imageData);
      return null;
    }

    try {
      let images = this.getAllImages();
      
      const { file, ...storableImageData } = imageData;

      const newImage = {
        ...storableImageData,
        id: `img_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        type: type, // 'person' or 'outfit'
        uploadedAt: new Date().toISOString(),
      };

      // Убираем старую версию этого фото, если она есть
      images = images.filter(img => img.id !== newImage.id && img.url !== newImage.url);
      
      // Добавляем новое изображение в начало списка
      images.unshift(newImage);

      // Ограничиваем количество
      const MAX_IMAGES = 50;
      if (images.length > MAX_IMAGES) {
        images = images.slice(0, MAX_IMAGES);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(images));
      this.setLastUsedImage(newImage);
      
      console.log(`🖼️ Изображение типа "${type}" сохранено. ID: ${newImage.id}. Всего изображений: ${images.length}`);
      
      // Возвращаем полный объект с файлом для немедленного использования
      return { ...newImage, file };
    } catch (error) {
      console.error('Ошибка сохранения изображения в localStorage:', error);
      if (error instanceof SyntaxError) {
        console.warn('Очистка localStorage из-за неверного JSON.');
        localStorage.removeItem(this.storageKey);
      }
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
      const images = this.getAllImages();
      return images.find(img => img.type === type && img.isLastUsed);
    } catch (error) {
      console.error('Ошибка получения последнего использованного изображения:', error);
      return null;
    }
  }

  // Установить последнее использованное изображение
  setLastUsedImage(imageData) {
    if (!imageData) return;
    try {
      let images = this.getAllImages();
      
      images = images.map(i => ({ ...i, isLastUsed: i.id === imageData.id }));
      
      localStorage.setItem(this.storageKey, JSON.stringify(images));
    } catch (error) {
      console.error('Ошибка обновления последнего использованного изображения:', error);
    }
  }

  // Удалить изображение
  deleteImage(imageId) {
    try {
      let images = this.getAllImages();
      const updatedImages = images.filter(img => img.id !== imageId);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedImages));
      console.log(`🗑️ Изображение удалено. ID: ${imageId}`);
      return true;
    } catch (error) {
      console.error('Ошибка удаления изображения из localStorage:', error);
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