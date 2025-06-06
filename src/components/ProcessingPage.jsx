import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import anime from 'animejs';
import replicateService from '../services/replicate'; // ACTIVATED FOR PRODUCTION
import Logo from './common/Logo';

const ProcessingPage = ({ onBack, onComplete, tryOnData }) => {
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('starting');
  const [predictionId, setPredictionId] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lowResBlurImage, setLowResBlurImage] = useState(null);
  
  // Refs для anime.js
  const blurOverlayRef = useRef(null);
  const containerRef = useRef(null);
  const placeholderRef = useRef(null);

  // Отладочный лог для проверки данных
  useEffect(() => {
    console.log('🔍 ProcessingPage tryOnData:', tryOnData);
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

  // Запуск генерации при монтировании компонента
  useEffect(() => {
    if (tryOnData && !predictionId && !error && !generatedImage) {
      setTimeout(() => {
        startGeneration(); // PRODUCTION REPLICATE CALL
      }, 1000);
    }
  }, [tryOnData, predictionId, error, generatedImage, startGeneration]);

  const handleRetry = () => {
    if (!isGenerating) {
      setIsRetrying(true);
      setError(null);
      setGeneratedImage(null);
      setPredictionId(null);
      setIsCompleted(false);
      setTimeout(() => {
        startGeneration();
        setIsRetrying(false);
      }, 500);
    }
  };

  const handleBackClick = () => {
    if (!isGenerating) {
      onBack();
    }
  };

  const generateParticles = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 rounded-full"
        initial={{
          x: Math.random() * 300,
          y: Math.random() * 300,
          opacity: 0,
          scale: 0
        }}
        animate={{
          x: Math.random() * 300,
          y: Math.random() * 300,
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Логотип сверху */}
      <div className="w-full px-6 py-4 bg-white">
        <div className="flex justify-center">
          <Logo size="medium" className="text-gray-800" />
        </div>
      </div>

      {/* Главный контейнер для генерации - занимает всю верхнюю часть */}
      <div className="flex-1 flex items-center justify-center p-4 relative" style={{ minHeight: 'calc(100vh - 280px)' }}>
        {/* Превью одежды в маленьком окошке справа - только во время генерации */}
        {isGenerating && tryOnData?.outfitImage?.url && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute top-4 right-4 w-24 h-32 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 z-20"
          >
            <img
              src={tryOnData.outfitImage.url}
              alt="Outfit preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
              Outfit
            </div>
          </motion.div>
        )}

        <motion.div
          ref={containerRef}
          className="relative w-full max-w-lg h-[60vh] rounded-2xl overflow-hidden shadow-2xl bg-white"
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

          {/* Сгенерированное изображение */}
          {generatedImage && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={generatedImage}
                alt="Generated result"
                className="w-full h-full object-cover"
              />
            </motion.div>
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
                <p className="text-red-600 font-medium mb-4">Generation Failed</p>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Нижняя секция с кнопками и статусом */}
      <div className="px-6 py-6 bg-white">
        {/* Статус генерации - только во время генерации */}
        {isGenerating && (
          <div className="text-center mb-6">
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
                  <span>Creating image...</span>
                  {progress > 0 && (
                    <span className="block text-xs text-gray-500 mt-1">
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
        )}

        {/* Кнопки управления - всегда видимы */}
        <div className="flex space-x-3">
          {/* Back Button - всегда показана */}
          <motion.button
            onClick={handleBackClick}
            disabled={isGenerating}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
            whileHover={!isGenerating ? { scale: 1.02 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </motion.button>

          {/* Retry Button - всегда показана */}
          <motion.button
            onClick={handleRetry}
            disabled={isGenerating}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            whileHover={!isGenerating ? { scale: 1.02 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
          >
            <RotateCcw size={16} className={isRetrying ? 'animate-spin' : ''} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
          </motion.button>

          {/* Add to Library Button - показана только после завершения */}
          {isCompleted && !error && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                // Здесь будет логика добавления в библиотеку
                console.log('Adding to library...');
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm bg-green-600 text-white hover:bg-green-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>+</span>
              <span>Add to Library</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage; 