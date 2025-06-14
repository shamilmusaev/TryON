import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, X } from "lucide-react";
import anime from "animejs";
import replicateService from "../services/replicate"; // ACTIVATED FOR PRODUCTION
import wardrobeStorage from "../services/wardrobeStorage";
import Logo from "./common/Logo";

const ProcessingPage = ({ onBack, onComplete, tryOnData }) => {
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("initializing");
  const [predictionId, setPredictionId] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lowResBlurImage, setLowResBlurImage] = useState(null);
  const [canCancel, setCanCancel] = useState(true);
  const startGenerationTimeoutRef = useRef(null);

  // Refs для anime.js
  const blurOverlayRef = useRef(null);
  const containerRef = useRef(null);
  const placeholderRef = useRef(null);

  // Отладочный лог для проверки данных
  useEffect(() => {
    console.log("🔍 ProcessingPage tryOnData:", tryOnData);
  }, [tryOnData]);

  // Определяем isGenerating здесь, до useEffect'ов
  const isGenerating = !isCompleted && processingStatus !== "failed" && !error && !canCancel;

  // Создание низкоразрешенной версии изображения для blur-заглушки
  const createLowResBlurImage = useCallback((imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Устанавливаем очень маленькое разрешение (15px)
        const lowResSize = 15;
        canvas.width = lowResSize;
        canvas.height = lowResSize;

        // Рисуем изображение в маленьком разрешении
        ctx.drawImage(img, 0, 0, lowResSize, lowResSize);

        // Получаем data URL низкоразрешенной версии
        const lowResDataUrl = canvas.toDataURL("image/jpeg", 0.5);
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
      createLowResBlurImage(tryOnData.personImage.url).then(setLowResBlurImage);
    }
  }, [tryOnData, createLowResBlurImage, lowResBlurImage]);

  const handleSuccess = useCallback((result) => {
    console.log("✅ Try-on generation completed:", result);

    setProgress(100);
    setProcessingStatus("completed");
    setGeneratedImage(result.output);
    setIsCompleted(true);

    // Автоматически сохраняем результат в гардероб
    if (result.output) {
      const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      wardrobeStorage.saveItem({
        url: imageUrl,
        title: "AI Generated Look",
        category: tryOnData.category || 'upper_body',
        generatedAt: new Date().toISOString(),
      });
      console.log("💾 Результат автоматически сохранен в гардероб");
    }

    // Быстро завершаем blur анимацию за 2 секунды
    if (blurOverlayRef.current) {
      console.log("🚀 Быстро завершаю blur анимацию...");

      // Останавливаем текущую анимацию
      anime.remove(blurOverlayRef.current);

      // Запускаем быстрое завершение
      anime({
        targets: blurOverlayRef.current,
        translateY: "100%", // Доезжаем до конца
        duration: 2000, // 2 секунды
        easing: "easeOutQuart", // Плавное замедление
        complete: () => {
          // Скрываем overlay после завершения
          if (blurOverlayRef.current) {
            blurOverlayRef.current.style.display = "none";
          }
          
          // Переходим к ResultPage через 2.5 секунды после завершения анимации
          setTimeout(() => {
            if (onComplete) {
              onComplete(result);
            }
          }, 500);
        },
      });
    } else {
      // Если нет blur overlay, переходим сразу
      setTimeout(() => {
        if (onComplete) {
          onComplete(result);
        }
      }, 2500);
    }
  }, [onComplete]);

  const handleError = useCallback((error) => {
    console.error("❌ Try-on generation failed:", error);
    setError(error.message || "Generation failed");
    setProcessingStatus("failed");
    setIsCompleted(true);
  }, []);

  // Запуск blur анимации и движения placeholder
  useEffect(() => {
    if (blurOverlayRef.current && isGenerating && !isCompleted) {
      console.log("🎬 Начинаю blur анимацию при старте генерации...");

      // Устанавливаем начальную позицию
      blurOverlayRef.current.style.transform = "translateY(0%)";
      blurOverlayRef.current.style.display = "block";
    }

    // Анимация движения placeholder под blur
    if (placeholderRef.current && isGenerating && !isCompleted) {
      anime({
        targets: placeholderRef.current,
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
        duration: 3000,
        easing: "easeInOutSine",
        loop: true,
      });
    }
  }, [isGenerating, isCompleted]);

  // Обновляем позицию blur overlay с плавными переходами
  useEffect(() => {
    if (
      blurOverlayRef.current &&
      isGenerating &&
      progress > 0 &&
      !isCompleted
    ) {
      // Более плавное движение blur с easing
      const blurPosition = Math.min(progress * 0.85, 85); // Ограничиваем до 85%

      // Используем anime.js для плавного перехода
      anime({
        targets: blurOverlayRef.current,
        translateY: `${blurPosition}%`,
        duration: 800, // Более быстрые переходы
        easing: "easeOutQuart", // Плавное замедление
        complete: () => {
          console.log(
            `🎬 Blur позиция обновлена: ${blurPosition}% (прогресс генерации: ${progress}%)`,
          );
        },
      });
    }
  }, [progress, isGenerating, isCompleted]);

  // PRODUCTION REPLICATE CODE - USES OPTIMIZED IMAGES
  const startGeneration = useCallback(async () => {
    if (canCancel) return; // Не запускаем, если еще можно отменить
    
    try {
      console.log("🚀 Starting try-on generation...");
      setProcessingStatus("starting");
      
      const generation = await replicateService.generateTryOn(
        tryOnData.personImage.file,
        tryOnData.outfitImage.file,
        "stylish outfit",
        tryOnData.category,
        30
      );
      setPredictionId(generation.id);
      setProcessingStatus("generating");
      generation.wait((newProgress) => {
        console.log("Generation progress:", newProgress);
        setProgress(newProgress);
        if (newProgress <= 25) setProcessingStatus("analyzing");
        else if (newProgress <= 75) setProcessingStatus("generating");
        else if (newProgress < 100) setProcessingStatus("finalizing");
      }).then(handleSuccess).catch(handleError);
    } catch (error) {
      handleError(error);
    }
  }, [tryOnData, handleSuccess, handleError, canCancel]);

  // Запуск 5-секундного таймера
  useEffect(() => {
    if (tryOnData) {
      startGenerationTimeoutRef.current = setTimeout(() => {
        setCanCancel(false);
      }, 5000);
      return () => clearTimeout(startGenerationTimeoutRef.current);
    }
  }, [tryOnData]);
  
  // Запуск генерации после того, как отмена стала невозможной
  useEffect(() => {
      if(!canCancel && !predictionId && !error) {
          startGeneration();
      }
  }, [canCancel, predictionId, error, startGeneration]);

  const handleCancelGeneration = () => {
    clearTimeout(startGenerationTimeoutRef.current);
    onBack();
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    setGeneratedImage(null);
    setPredictionId(null);
    setIsCompleted(false);
    setProgress(0);
    setProcessingStatus("initializing");
    setCanCancel(true); // Даем возможность отменить еще раз
    
    startGenerationTimeoutRef.current = setTimeout(() => {
      setCanCancel(false);
      setIsRetrying(false);
    }, 5000);
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
          scale: 0,
        }}
        animate={{
          x: Math.random() * 300,
          y: Math.random() * 300,
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ));
  };

  const timelineEvents = [
    { name: "Initializing", status: "initializing" },
    { name: "Starting...", status: "starting" },
    { name: "Analyzing Images", status: "analyzing" },
    { name: "Creating Image", status: "generating" },
    { name: "Finalizing Result", status: "finalizing" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Safe area для iPhone 14 Pro */}
      <div className="pt-safe-top pb-safe-bottom">
        <div className="flex flex-col h-screen">
          {/* Логотип сверху с учетом Dynamic Island */}
          <div className="w-full px-4 py-3 bg-white mt-2">
            <div className="flex justify-center">
              <Logo size="medium" className="text-gray-800" />
            </div>
          </div>

          {/* Главный контейнер для генерации */}
          <div
            className="flex-1 flex items-center justify-center p-4 relative"
            style={{ minHeight: "calc(100vh - 320px)" }}
          >
            {/* Превью одежды в маленьком окошке справа - только во время генерации */}
            {isGenerating && tryOnData?.outfitImage?.url && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="absolute top-4 right-4 w-20 h-28 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 z-20"
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
              className="relative w-full max-w-sm h-[55vh] rounded-2xl overflow-hidden shadow-2xl bg-white"
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
                      filter: "blur(20px) brightness(1.1)",
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
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(5px)",
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
                    background:
                      "linear-gradient(180deg, rgba(240,240,240,0.98) 0%, rgba(240,240,240,0.95) 5%, rgba(240,240,240,0.9) 15%, rgba(240,240,240,0.7) 30%, rgba(240,240,240,0.4) 50%, rgba(240,240,240,0.2) 70%, rgba(240,240,240,0.05) 85%, transparent 95%)",
                    backdropFilter: "blur(25px)",
                    WebkitBackdropFilter: "blur(25px)",
                    transform: "translateY(0%)", // Начальная позиция
                    display: "block",
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
                    <p className="text-red-600 font-medium mb-4">
                      Generation Failed
                    </p>
                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                    <button 
                      onClick={handleRetry} 
                      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Нижняя секция с кнопками и статусом */}
          <div className="px-4 py-4 bg-white border-t border-gray-100 flex flex-col items-center">
            {/* Статус генерации - только во время генерации */}
            {!isCompleted && !error && (
              <div className="text-center mb-4">
                {/* Анимация текста статуса (можно оставить простой текст) */}
                <p className="text-gray-600 text-sm">{processingStatus}</p>
              </div>
            )}

            {/* Главная кнопка действия */}
            <div className="w-full max-w-sm">
                <motion.button
                  key={isCompleted ? "back" : "cancel"}
                  onClick={() => {
                    if (isCompleted || error) {
                      onBack();
                    } else if (canCancel) {
                      handleCancelGeneration();
                    }
                  }}
                  disabled={!canCancel && !isCompleted && !error}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-xl font-bold text-base shadow-md transition-all duration-300
                    ${
                      isCompleted || error
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' // Состояние "Back to home"
                        : canCancel
                        ? 'bg-red-500 hover:bg-red-600 text-white' // Состояние "Cancel"
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed' // Состояние "Disabled"
                    }
                  `}
                >
                  {isCompleted || error ? (
                    <>
                      <ArrowLeft size={20} className="mr-2" />
                      Back to home page
                    </>
                  ) : (
                    <>
                      <X size={20} className="mr-2" />
                      Cancel Generation
                    </>
                  )}
                </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pt-safe-bottom"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-mobile mx-auto">
          <AnimatePresence mode="wait">
            {canCancel ? (
              <motion.button
                key="cancel"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleCancelGeneration}
                className="w-full flex items-center justify-center py-4 px-6 rounded-2xl bg-red-500/90 backdrop-blur-lg text-white font-bold text-lg shadow-lg shadow-red-500/30"
              >
                <X size={20} className="mr-2" />
                Cancel Generation
              </motion.button>
            ) : error ? (
              <motion.div 
                key="error-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <button onClick={onBack} className="w-full ...">
                  <ArrowLeft size={20} className="mr-2" /> Back
                </button>
                <button onClick={handleRetry} className="w-full ...">
                  <RotateCcw size={20} className="mr-2" /> Try Again
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessingPage;
