import { useState, useCallback } from 'react';
import imageConverter from '../services/imageConverter';

export const useFileUpload = (options = {}) => {
  const {
    maxFileSize = 15 * 1024 * 1024, // 15MB (увеличено для HEVC)
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    onUploadStart,
    onUploadComplete,
    onUploadError
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processingMessage, setProcessingMessage] = useState('');

  const validateFile = useCallback((file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxFileSize) {
      throw new Error(`File size too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
    }

    // Проверяем тип файла (включая HEVC)
    const isHEVC = imageConverter.isHEVCFormat(file);
    const isAllowedType = allowedTypes.includes(file.type) || isHEVC;
    
    if (!isAllowedType) {
      throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}, HEIC, HEIF`);
    }

    // Дополнительные проверки для изображений
    if (file.type.startsWith('image/') || isHEVC) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(url);
          
          // Проверяем минимальные размеры
          if (img.width < 480 || img.height < 640) {
            reject(new Error('Image too small. Minimum size: 480x640px'));
            return;
          }
          
          resolve({ width: img.width, height: img.height });
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Invalid image file'));
        };
        
        img.src = url;
      });
    }

    return Promise.resolve();
  }, [maxFileSize, allowedTypes]);

  const uploadFile = useCallback(async (file) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      setProcessingMessage('Starting upload...');

      onUploadStart?.(file);

      // Валидация файла
      await validateFile(file);
      setUploadProgress(15);

      // Определяем тип обработки
      const isHEVC = imageConverter.isHEVCFormat(file);
      const isiPhone = imageConverter.isiPhoneImage(file);
      
      if (isHEVC) {
        setProcessingMessage('Converting HEVC to JPEG...');
      } else if (isiPhone) {
        setProcessingMessage('Preparing iPhone image for AI...');
      } else {
        setProcessingMessage('Processing image...');
      }
      
      setUploadProgress(30);

      // Обработка изображения (конвертация HEVC, оптимизация, продвинутая обработка)
      const processedFile = await imageConverter.processImage(file);
      setUploadProgress(70);

      // Симуляция загрузки с прогрессом
      setProcessingMessage('Finalizing upload...');
      const simulateUpload = () => {
        return new Promise((resolve) => {
          let progress = 70;
          const interval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve();
            }
            setUploadProgress(Math.round(progress));
          }, 150);
        });
      };

      await simulateUpload();

      // Создаем объект файла с превью
      const fileData = {
        file: processedFile,
        originalFile: file, // Сохраняем оригинальный файл для справки
        url: URL.createObjectURL(processedFile),
        name: processedFile.name,
        size: processedFile.size,
        type: processedFile.type,
        lastModified: processedFile.lastModified,
        wasConverted: imageConverter.isHEVCFormat(file), // Флаг конвертации
        wasOptimizedForAI: imageConverter.isiPhoneImage(file), // Флаг AI оптимизации
        originalSize: file.size
      };

      setProcessingMessage('Upload complete!');
      onUploadComplete?.(fileData);
      return fileData;

    } catch (err) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      setProcessingMessage('');
      onUploadError?.(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onUploadStart, onUploadComplete, onUploadError]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setProcessingMessage('');
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    processingMessage,
    error,
    reset
  };
};

export default useFileUpload; 