import { useState, useCallback, useRef } from 'react';

export const useCamera = (options = {}) => {
  const {
    facingMode = 'user', // 'user' для фронтальной камеры, 'environment' для основной
    width = 640,
    height = 480,
    onCapture,
    onError
  } = options;

  const [isActive, setIsActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      const constraints = {
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [facingMode, width, height, onError]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    setError(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !isActive) {
      setError('Camera not ready');
      return null;
    }

    try {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      
      // Устанавливаем размеры canvas равными видео
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Для фронтальной камеры делаем зеркальное отражение
      if (facingMode === 'user') {
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Конвертируем в blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            
            const photoData = {
              file,
              url: URL.createObjectURL(blob),
              name: file.name,
              size: file.size,
              type: file.type,
              width: canvas.width,
              height: canvas.height
            };
            
            onCapture?.(photoData);
            resolve(photoData);
          } else {
            setError('Failed to capture photo');
            resolve(null);
          }
          
          setIsCapturing(false);
        }, 'image/jpeg', 0.9);
      });

    } catch (err) {
      setError('Failed to capture photo');
      setIsCapturing(false);
      return null;
    }
  }, [isActive, facingMode, onCapture]);

  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    
    stopCamera();
    
    // Небольшая задержка перед запуском новой камеры
    setTimeout(() => {
      startCamera();
    }, 100);
    
  }, [facingMode, stopCamera, startCamera]);

  // Проверяем поддержку камеры
  const isCameraSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Получаем список доступных камер
  const getAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
      console.error('Failed to get camera devices:', err);
      return [];
    }
  }, []);

  const reset = useCallback(() => {
    stopCamera();
    setError(null);
    setIsCapturing(false);
  }, [stopCamera]);

  return {
    // Состояние
    isActive,
    isCapturing,
    error,
    stream,
    
    // Методы
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    reset,
    
    // Утилиты
    isCameraSupported,
    getAvailableCameras,
    
    // Refs для компонентов
    videoRef,
    canvasRef
  };
};

// Утилитарная функция для обработки ошибок камеры
const getErrorMessage = (error) => {
  switch (error.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Camera access denied. Please allow camera permissions and try again.';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'No camera found. Please connect a camera and try again.';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Camera is already in use by another application.';
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'Camera does not support the requested settings.';
    case 'NotSupportedError':
      return 'Camera is not supported in this browser.';
    case 'AbortError':
      return 'Camera access was aborted.';
    default:
      return `Camera error: ${error.message || 'Unknown error'}`;
  }
}; 