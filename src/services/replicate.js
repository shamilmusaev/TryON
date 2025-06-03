// Сервис для работы с Replicate API через n8n
const N8N_BASE_URL = 'http://89.117.63.81:5678/webhook';

class ReplicateService {
  constructor() {
    this.baseURL = N8N_BASE_URL;
  }

  // Конвертация файла в base64 data URL
  async fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Загрузка изображения на временный хостинг (можно использовать imgbb, cloudinary или другой)
  async uploadImage(file) {
    try {
      // Для демо конвертируем в data URL
      const dataUrl = await this.fileToDataUrl(file);
      return dataUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Создание задачи на генерацию
  async createPrediction(humanImg, garmImg, garmentDescription = 'fashionable clothing') {
    try {
      console.log('📡 Using n8n webhook:', `${this.baseURL}/replicate`);
      
      const response = await fetch(`${this.baseURL}/replicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          human_img: humanImg,
          garm_img: garmImg,
          garment_des: garmentDescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const prediction = await response.json();
      return prediction;
    } catch (error) {
      console.error('Error creating prediction:', error);
      
      // Если n8n не работает, показываем полезную ошибку
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('n8n webhook недоступен. Проверьте что workflow активирован и n8n запущен на ' + this.baseURL);
      }
      
      throw error;
    }
  }

  // Получение статуса задачи
  async getPrediction(predictionId) {
    try {
      const response = await fetch(`${this.baseURL}/replicate-status?id=${predictionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get prediction status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    }
  }

  // Основной метод для генерации try-on
  async generateTryOn(personImage, clothingImage, garmentDescription = "clothing item") {
    try {
      console.log('🚀 Starting try-on generation with n8n + Replicate...');
      
      // Конвертируем изображения в base64 data URLs если они File объекты
      const personImageData = await this.fileToDataURL(personImage);
      const clothingImageData = await this.fileToDataURL(clothingImage);

      // Создаем prediction через n8n
      const response = await fetch(`${this.baseURL}/replicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          human_img: personImageData,
          garm_img: clothingImageData,
          garment_des: garmentDescription
        })
      });

      // Логируем сырой текстовый ответ
      const rawResponseText = await response.clone().text(); // Клонируем, чтобы можно было прочитать тело дважды
      console.log('📦 Raw response from n8n:', rawResponseText);

      if (!response.ok) {
        // Попытаемся распарсить ошибку как JSON, если возможно, или используем текстовый ответ
        let errorData = {};
        try {
          errorData = JSON.parse(rawResponseText); 
        } catch (e) {
          errorData.message = rawResponseText || `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const prediction = await response.json();
      console.log('✅ Prediction created via n8n:', prediction.id);

      // Возвращаем объект с методом wait для отслеживания прогресса
      return {
        id: prediction.id,
        status: prediction.status,
        wait: (onProgress) => this.waitForCompletion(prediction.id, onProgress)
      };

    } catch (error) {
      console.error('❌ n8n + Replicate generation failed:', error);
      
      // Если n8n не работает, показываем полезную ошибку
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('n8n недоступен. Убедитесь что:\n1. n8n запущен на ' + this.baseURL + '\n2. Workflow активирован\n3. Webhook настроен правильно');
      }
      
      throw error;
    }
  }

  // Ожидание завершения генерации с колбэком прогресса
  async waitForCompletion(predictionId, onProgress) {
    const maxAttempts = 60; // 5 минут максимум
    const pollInterval = 5000; // 5 секунд между запросами
    
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        
        // Получаем статус prediction через n8n
        const statusUrl = `${this.baseURL}/replicate-status?id=${predictionId}`;

        const response = await fetch(statusUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to get prediction status: ${response.statusText}`);
        }

        const prediction = await response.json();
        
        // Рассчитываем прогресс на основе статуса
        let progress = 0;
        let status = 'processing';
        let message = 'Processing your try-on...';

        switch (prediction.status) {
          case 'starting':
            progress = 10;
            status = 'starting';
            message = 'Initializing AI model...';
            break;
          case 'processing':
            // Имитируем прогресс на основе времени
            progress = Math.min(20 + (attempts * 10), 90);
            status = 'processing';
            message = 'AI is creating your try-on...';
            break;
          case 'succeeded':
            progress = 100;
            status = 'completed';
            message = 'Try-on completed successfully!';
            if (onProgress) onProgress(progress, status, message);
            return prediction;
          case 'failed':
            throw new Error(prediction.error || 'Generation failed');
          case 'canceled':
            throw new Error('Generation was canceled');
        }

        // Вызываем callback с прогрессом
        if (onProgress) {
          onProgress(progress, status, message);
        }

        // Если еще не завершено, продолжаем polling
        if (prediction.status === 'starting' || prediction.status === 'processing') {
          if (attempts >= maxAttempts) {
            throw new Error('Generation timeout - please try again');
          }
          
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          return poll();
        }

        return prediction;

      } catch (error) {
        console.error('❌ Polling error:', error);
        throw error;
      }
    };

    return poll();
  }

  // Вспомогательная функция для конвертации File в Data URL
  async fileToDataURL(imageInput) {
    console.log('🔄 Converting to data URL:', imageInput);
    
    // Если это уже строка (URL), возвращаем как есть
    if (typeof imageInput === 'string') {
      return imageInput;
    }

    // Если это объект с file свойством (из UploadPage)
    if (imageInput && typeof imageInput === 'object' && imageInput.file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageInput.file);
      });
    }

    // Если это прямо File объект
    if (imageInput instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageInput);
      });
    }

    // Если это объект с url свойством, возвращаем url
    if (imageInput && typeof imageInput === 'object' && imageInput.url) {
      return imageInput.url;
    }

    console.error('❌ Invalid file format:', imageInput);
    throw new Error(`Invalid file format: received ${typeof imageInput}, expected File object or string URL`);
  }

  // Получение информации о модели (не используется с n8n)
  async getModelInfo() {
    console.log('ℹ️ Model info not available through n8n webhook');
    return null;
  }

  // Метод для создания множественных вариаций
  async generateVariations(personImage, clothingImage) {
    const descriptions = [
      'elegant and sophisticated style',
      'casual and comfortable look', 
      'trendy and fashionable outfit',
      'professional business attire'
    ];

    const results = [];
    
    for (let i = 0; i < descriptions.length; i++) {
      try {
        const result = await this.generateTryOn(personImage, clothingImage, descriptions[i]);
        results.push({
          id: result.id,
          description: descriptions[i],
          title: `Style Variation ${i + 1}`,
          promise: result
        });
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
      }
    }

    return results;
  }
}

// Экспортируем singleton instance
const replicateService = new ReplicateService();
export default replicateService; 