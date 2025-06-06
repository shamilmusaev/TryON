import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, X } from 'lucide-react';

const ResultPage = ({ onBack, onNavigation, resultData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [resultImage, setResultImage] = useState(null);

  // Обрабатываем входящие данные результата
  useEffect(() => {
    console.log('🔍 ResultPage получил данные:', resultData);
    
    if (resultData && resultData.output) {
      // Если есть готовый результат, сразу показываем его
      const imageUrl = Array.isArray(resultData.output) ? resultData.output[0] : resultData.output;
      setResultImage({
        url: imageUrl,
        title: 'AI Generated Result',
        generatedAt: resultData.generatedAt,
        predictionId: resultData.id
      });
      setIsLoading(false);
    } else {
      // Если результата нет, показываем состояние загрузки
      console.log('⏳ Результат еще генерируется...');
      
      // Симуляция ожидания результата (в реальном приложении это будет приходить от ProcessingPage)
      const timer = setTimeout(() => {
        // Fallback изображение если результат так и не пришел
        setResultImage({
          url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face',
          title: 'Demo Result',
          generatedAt: new Date().toISOString()
        });
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resultData]);

  const handleRetry = () => {
    if (!isLoading) {
      onNavigation('upload');
    }
  };

  const handleBack = () => {
    if (!isLoading) {
      onBack();
    }
  };

  const handleImageClick = () => {
    if (!isLoading && resultImage) {
      setShowFullscreen(true);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Safe area для iPhone 14 Pro */}
      <div className="pt-safe-top pb-safe-bottom">
        <div className="flex flex-col h-screen">
          {/* Result Image Section - занимает основную часть экрана */}
          <div className="flex-1 relative bg-white shadow-lg overflow-hidden">
            {isLoading ? (
              // Loading State
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Генерируем результат</h3>
                  <p className="text-gray-500 text-sm mb-3">Пожалуйста, подождите...</p>
                  <div className="w-full">
                    <div className="bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Result Image
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full cursor-pointer relative"
                onClick={handleImageClick}
              >
                <img
                  src={resultImage.url}
                  alt={resultImage.title}
                  className="w-full h-full object-cover"
                />

                {/* Success indicator */}
                {!isLoading && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                  >
                    <div className="w-3 h-3 flex items-center justify-center text-xs">✓</div>
                  </motion.div>
                )}

                {/* Tap hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                    Нажмите для увеличения
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Section - кнопки */}
          <div className="px-4 py-4 bg-white border-t border-gray-100">
            {/* Action Buttons */}
            <div className="flex space-x-3 mb-4">
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-medium text-sm transition-all touch-manipulation ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <ArrowLeft size={16} />
                <span>Назад</span>
              </motion.button>

              {/* Retry Button */}
              <motion.button
                onClick={handleRetry}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-medium text-sm transition-all touch-manipulation ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <RotateCcw size={16} />
                <span>Попробовать еще</span>
              </motion.button>
            </div>

            {/* Result Info - компактная версия */}
            {!isLoading && resultImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center bg-gray-50 rounded-xl p-3"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🎉</span>
                  <span className="text-sm font-medium text-gray-800">Результат готов!</span>
                </div>
                {resultImage.generatedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(resultImage.generatedAt).toLocaleString('ru-RU')}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {showFullscreen && resultImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={handleCloseFullscreen}
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleCloseFullscreen}
              className="absolute top-6 right-6 z-60 w-11 h-11 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors touch-manipulation"
            >
              <X size={20} />
            </motion.button>

            {/* Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resultImage.url}
                alt={resultImage.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Image Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-6 left-4 right-4 text-center"
            >
              <div className="bg-black/80 backdrop-blur-xl text-white px-4 py-3 rounded-2xl inline-block max-w-sm">
                <h3 className="font-medium text-sm mb-1">{resultImage.title}</h3>
                <p className="text-xs text-gray-300">
                  Нажмите на фон или X чтобы закрыть
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultPage; 