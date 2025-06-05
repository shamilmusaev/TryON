import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import anime from 'animejs';
import Logo from './common/Logo';
import replicateService from '../services/replicate'; // ACTIVATED FOR PRODUCTION

const ProcessingPage = ({ onBack, onComplete, tryOnData }) => {
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('starting');
  const [predictionId, setPredictionId] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lowResBlurImage, setLowResBlurImage] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50); // Позиция слайдера для сравнения (в процентах)
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs для anime.js и slider
  const blurOverlayRef = useRef(null);
  const containerRef = useRef(null);
  const placeholderRef = useRef(null);

  // Отладочный лог для проверки данных
  useEffect(() => {
    console.log('🔍 ProcessingPage tryOnData:', tryOnData);
    console.log('🔍 outfitImage:', tryOnData?.outfitImage);
    console.log('🔍 outfitImage.url:', tryOnData?.outfitImage?.url);
  }, [tryOnData]);

  // Определяем isGenerating здесь, до useEffect'ов
  const isGenerating = !isCompleted && processingStatus !== 'failed' && !error;
  const showControls = isCompleted || error;

  // Создание низкоразрешенной версии изображения для blur-заглушки
  const createLowResBlurImage = useCallback((imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Устанавливаем очень маленькое разрешение (15px)
        const lowResSize = 15;
        canvas.width = lowResSize;
        canvas.height = lowResSize;
        
        // Рисуем изображение в маленьком разрешении
        ctx.drawImage(img, 0, 0, lowResSize, lowResSize);
        
        // Получаем data URL низкоразрешенной версии
        const lowResDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(lowResDataUrl);
      };
      
      img.onerror = () => {
        // Если не удалось загрузить, используем оригинал
        resolve(imageUrl);
      };
      
      img.src = imageUrl;
    });
  }, []);

  // Создаем blur-версию при загрузке данных
  useEffect(() => {
    if (tryOnData?.personImage?.url && !lowResBlurImage) {
      createLowResBlurImage(tryOnData.personImage.url)
        .then(setLowResBlurImage);
    }
  }, [tryOnData, createLowResBlurImage, lowResBlurImage]);

  const handleSuccess = useCallback((result) => {
    console.log('✅ Try-on generation completed:', result);
    
    setProgress(100);
    setProcessingStatus('completed');
    setGeneratedImage(result.output);
    setIsCompleted(true);
    
    // Быстро завершаем blur анимацию за 2 секунды
    if (blurOverlayRef.current) {
      console.log('🚀 Быстро завершаю blur анимацию...');
      
      // Останавливаем текущую анимацию
      anime.remove(blurOverlayRef.current);
      
      // Запускаем быстрое завершение
      anime({
        targets: blurOverlayRef.current,
        translateY: '100%', // Доезжаем до конца
        duration: 2000, // 2 секунды
        easing: 'easeOutQuart', // Плавное замедление
        complete: () => {
          // Скрываем overlay после завершения
          if (blurOverlayRef.current) {
            blurOverlayRef.current.style.display = 'none';
          }
        }
      });
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('❌ Try-on generation failed:', error);
    setError(error.message || 'Generation failed');
    setProcessingStatus('failed');
    setIsCompleted(true);
  }, []);

  // Функции для слайдера сравнения
  const handleSliderMove = useCallback((clientX) => {
    if (containerRef.current && generatedImage) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
  }, [generatedImage]);

  const handleMouseDown = useCallback(() => {
    if (generatedImage) {
      setIsDragging(true);
    }
  }, [generatedImage]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  }, [isDragging, handleSliderMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isDragging && e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  }, [isDragging, handleSliderMove]);

  // Event listeners для слайдера
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Запуск blur анимации и движения placeholder
  useEffect(() => {
    if (blurOverlayRef.current && isGenerating && !isCompleted) {
      console.log('🎬 Начинаю blur анимацию при старте генерации...');
      
      // Устанавливаем начальную позицию
      blurOverlayRef.current.style.transform = 'translateY(0%)';
      blurOverlayRef.current.style.display = 'block';
    }

    // Анимация движения placeholder под blur
    if (placeholderRef.current && isGenerating && !isCompleted) {
      anime({
        targets: placeholderRef.current,
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true
      });
    }
  }, [isGenerating, isCompleted]);

  // Обновляем позицию blur overlay с плавными переходами
  useEffect(() => {
    if (blurOverlayRef.current && isGenerating && progress > 0 && !isCompleted) {
      // Более плавное движение blur с easing
      const blurPosition = Math.min(progress * 0.85, 85); // Ограничиваем до 85%
      
      // Используем anime.js для плавного перехода
      anime({
        targets: blurOverlayRef.current,
        translateY: `${blurPosition}%`,
        duration: 800, // Более быстрые переходы
        easing: 'easeOutQuart', // Плавное замедление
        complete: () => {
          console.log(`🎬 Blur позиция обновлена: ${blurPosition}% (прогресс генерации: ${progress}%)`);
        }
      });
    }
  }, [progress, isGenerating, isCompleted]);

  // PRODUCTION REPLICATE CODE - USES OPTIMIZED IMAGES
  const startGeneration = useCallback(async () => {
    try {
      console.log('🚀 Starting try-on generation...');
      setError(null);
      setGeneratedImage(null);
      setProgress(0);
      setProcessingStatus('starting');
      setIsCompleted(false);
      
      // Используем оптимизированные изображения (уже обработанные оптимизатором iPhone)
      const generation = await replicateService.generateTryOn(
        tryOnData.personImage, // Уже оптимизированное изображение
        tryOnData.outfitImage, // Уже оптимизированное изображение
        'stylish outfit'
      );

      setPredictionId(generation.id);
      setProcessingStatus('generating');
      
      // Ожидаем завершения с отслеживанием прогресса
      generation.wait((newProgress) => {
        console.log('Generation progress:', newProgress);
        setProgress(newProgress);
        
        // Обновляем статус на основе прогресса
        if (newProgress <= 25) {
          setProcessingStatus('analyzing');
        } else if (newProgress <= 75) {
          setProcessingStatus('generating');
        } else if (newProgress < 100) {
          setProcessingStatus('finalizing');
        }
        // При 100% handleSuccess установит completed и isCompleted = true
      }).then(handleSuccess).catch(handleError);
      
    } catch (error) {
      handleError(error);
    }
  }, [tryOnData, handleSuccess, handleError]);

  /* MOCK FUNCTION FOR TESTING - COMMENTED BUT KEPT FOR FUTURE TESTS
  const startMockGeneration = useCallback(() => {
    console.log('🚀 Starting MOCK generation...');
    setError(null);
    setGeneratedImage(null);
    setProgress(0);
    setProcessingStatus('starting');
    setIsCompleted(false);
    
    // Имитируем ID генерации
    setPredictionId('mock-prediction-' + Date.now());
    setProcessingStatus('generating');
    
    // Симуляция прогресса генерации
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 2 + Math.random() * 3; // 2-5% за шаг
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        
        // Завершаем генерацию с тестовым изображением
        setTimeout(() => {
          handleSuccess({
            output: '/assets/images/test_output.jpg' // Путь к тестовому изображению
          });
        }, 500);
      }
      
      setProgress(currentProgress);
      
      // Обновляем статус на основе прогресса
      if (currentProgress <= 25) {
        setProcessingStatus('analyzing');
      } else if (currentProgress <= 75) {
        setProcessingStatus('generating');
      } else if (currentProgress < 100) {
        setProcessingStatus('finalizing');
      }
    }, 200); // Обновляем каждые 200ms
    
  }, [handleSuccess]);
  */

  // Запуск генерации при монтировании компонента
  useEffect(() => {
    if (tryOnData && !predictionId && !error && !generatedImage) {
      setTimeout(() => {
        startGeneration(); // PRODUCTION REPLICATE CALL
        // startMockGeneration(); // MOCK CALL FOR TESTING - COMMENTED
      }, 1000);
    }
  }, [tryOnData, predictionId, error, generatedImage, startGeneration]);

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    setGeneratedImage(null);
    setPredictionId(null);
    setIsCompleted(false);
    
    setTimeout(() => {
      setIsRetrying(false);
      startGeneration(); // PRODUCTION REPLICATE CALL
      // startMockGeneration(); // MOCK CALL FOR TESTING - COMMENTED
    }, 500);
  };

  // Генерация дополнительных частиц только во время генерации (в 2 раза больше)
  const generateParticles = () => {
    return Array.from({ length: 50 }, (_, i) => { // Увеличено с 25 до 50
      const size = Math.random() * 2 + 1;
      const speed = Math.random() * 5 + 4;
      const delay = Math.random() * 3;
      
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/30"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 400,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * 400,
            y: Math.random() * 400,
            opacity: [0, 0.4, 0.2, 0],
            scale: [0, 1, 0.3, 0]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative safe-area-inset">
      {/* Логотип в центре сверху - адаптирован для мобильных */}
      <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-30 pt-safe">
        <Logo size="small" className="text-gray-900" />
      </div>

      {/* Кнопки управления - адаптированы для мобильных */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 sm:top-6 left-0 right-0 z-30 flex justify-center gap-3 sm:gap-4 px-4"
        >
          {/* Кнопка назад */}
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Back to Upload</span>
            <span className="sm:hidden">Back</span>
          </motion.button>

          {/* Кнопка повтора */}
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={16} className={`sm:w-[18px] sm:h-[18px] ${isRetrying ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRetrying ? 'Retrying...' : 'Try Again'}</span>
            <span className="sm:hidden">{isRetrying ? 'Retry...' : 'Retry'}</span>
          </motion.button>
        </motion.div>
      )}

      {/* Отладочная информация в левом верхнем углу */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-6 left-6 z-30 bg-black bg-opacity-70 text-white text-xs p-2 rounded max-w-xs">
          <div>isGenerating: {isGenerating ? 'true' : 'false'}</div>
          <div>outfitImage exists: {tryOnData?.outfitImage ? 'true' : 'false'}</div>
          <div>outfitImage.url: {tryOnData?.outfitImage?.url ? 'exists' : 'missing'}</div>
          {tryOnData?.outfitImage?.url && (
            <div className="break-all">URL: {tryOnData.outfitImage.url.substring(0, 50)}...</div>
          )}
        </div>
      )}

      {/* Превью одежды в правом верхнем углу во время генерации */}
      {isGenerating && tryOnData?.outfitImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-6 right-6 z-20 w-20 h-24 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
          <img
            src={tryOnData.outfitImage.url}
            alt="Outfit preview"
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              console.error('❌ Ошибка загрузки превью одежды:', e);
              console.log('🔍 Пытались загрузить URL:', tryOnData.outfitImage.url);
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          {/* Отладочная информация */}
          <div className="absolute bottom-0 left-0 text-xs bg-black bg-opacity-50 text-white p-1 rounded">
            Preview
          </div>
        </motion.div>
      )}

      {/* Центральный контейнер - оптимизирован для мобильных */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          ref={containerRef}
          className="relative w-[280px] h-[280px] sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Плейсхолдер с анимацией - заблюренное превью */}
          <div ref={placeholderRef} className="absolute inset-0">
            {/* Заблюренное превью - всегда показано когда есть */}
            {lowResBlurImage && (
              <img
                src={lowResBlurImage}
                alt="Blurred preview"
                className="w-full h-full object-cover"
                style={{
                  filter: 'blur(20px) brightness(1.1)',
                }}
              />
            )}

            {/* Fallback плейсхолдер если нет заблюренного превью */}
            {!lowResBlurImage && (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
          </div>

          {/* Градиентный оверлей для дополнительного размытия во время генерации */}
          {isGenerating && (
            <div 
              className="absolute inset-0 z-5"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
              }}
            />
          )}

          {/* Сгенерированное изображение с слайдером сравнения */}
          {generatedImage && (
            <>
              {/* Слой с оригинальным изображением */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {lowResBlurImage && (
                  <img
                    src={tryOnData.personImage.url}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>

              {/* Слой с сгенерированным изображением - обрезается по слайдеру */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                }}
              >
                <img
                  src={generatedImage}
                  alt="Generated outfit"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Линия слайдера */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                {/* Кружок на линии */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
                    <div className="w-1 h-4 bg-gray-400 rounded-full mx-0.5"></div>
                  </div>
                </div>
              </motion.div>

              {/* Текстовые метки */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Before
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                After
              </div>
            </>
          )}

          {/* Blur overlay для ChatGPT-анимации - показывается во время генерации */}
          {(isGenerating || generatedImage) && (
            <div
              ref={blurOverlayRef}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(240,240,240,0.98) 0%, rgba(240,240,240,0.95) 5%, rgba(240,240,240,0.9) 15%, rgba(240,240,240,0.7) 30%, rgba(240,240,240,0.4) 50%, rgba(240,240,240,0.2) 70%, rgba(240,240,240,0.05) 85%, transparent 95%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                transform: 'translateY(0%)', // Начальная позиция
                display: 'block'
              }}
            />
          )}

          {/* Частицы только во время генерации */}
          {isGenerating && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
              {generateParticles()}
            </div>
          )}

          {/* Оверлей с ошибкой */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50/95 backdrop-blur-sm z-20">
              <div className="text-center p-6">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-600 font-medium mb-4">Generation failed</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Минимальный текст статуса снизу - адаптирован для мобильных */}
      <div className="text-center p-4 sm:p-6 pb-safe">
        <div className="h-5 sm:h-6 flex items-center justify-center"> {/* Фиксированная высота */}
          <AnimatePresence mode="wait">
            {processingStatus === 'starting' && (
              <motion.p
                key="starting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 text-sm"
              >
                Preparing AI model...
              </motion.p>
            )}
            {processingStatus === 'analyzing' && (
              <motion.p
                key="analyzing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 text-sm"
              >
                Analyzing images...
              </motion.p>
            )}
            {processingStatus === 'generating' && (
              <motion.p
                key="generating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 text-sm"
              >
                <span>Creating image. May take a moment...</span>
                {progress > 0 && (
                  <span className="inline-block w-12 text-left ml-1">
                    {Math.round(progress)}%
                  </span>
                )}
              </motion.p>
            )}
            {processingStatus === 'finalizing' && (
              <motion.p
                key="finalizing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 text-sm"
              >
                Finalizing result...
              </motion.p>
            )}
            {processingStatus === 'completed' && !error && (
              <motion.p
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-green-600 text-sm font-medium"
              >
                Generation complete! 🎉
              </motion.p>
            )}
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-600 text-sm font-medium"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage; 