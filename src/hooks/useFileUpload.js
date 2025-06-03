import { useState, useCallback } from 'react';
import { UPLOAD_STATUS } from '../types/upload.types';

export const useFileUpload = (options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    onUploadStart,
    onUploadComplete,
    onUploadError
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > maxFileSize) {
      throw new Error(`File size too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Дополнительные проверки для изображений
    if (file.type.startsWith('image/')) {
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

      onUploadStart?.(file);

      // Валидация файла
      await validateFile(file);

      // Симуляция загрузки с прогрессом
      const simulateUpload = () => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve();
            }
            setUploadProgress(Math.round(progress));
          }, 100);
        });
      };

      await simulateUpload();

      // Создаем объект файла с превью
      const fileData = {
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      };

      onUploadComplete?.(fileData);
      return fileData;

    } catch (err) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
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
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    reset
  };
};

export default useFileUpload; 