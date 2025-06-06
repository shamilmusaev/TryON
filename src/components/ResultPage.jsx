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
      {/* Main Content */}
      <div className="relative">
        {/* Result Image Section - занимает больше половины экрана (75%) */}
        <div className="relative h-[75vh] bg-white shadow-lg overflow-hidden">
          {isLoading ? (
            // Loading State
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Генерируем результат</h3>
                <p className="text-gray-500 text-lg">Пожалуйста, подождите...</p>
                <div className="mt-4 max-w-md mx-auto">
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
              className="w-full h-full cursor-pointer relative group"
              onClick={handleImageClick}
            >
              <img
                src={resultImage.url}
                alt={resultImage.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay hint - появляется при hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white px-6 py-3 rounded-full text-sm font-medium">
                  Нажмите для полноэкранного просмотра
                </div>
              </div>

              {/* Success indicator */}
              {!isLoading && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                >
                  <div className="w-4 h-4 flex items-center justify-center">✓</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Bottom Section - кнопки и информация */}
        <div className="px-6 py-6">
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl font-semibold text-lg transition-all ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-900 active:scale-95'
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              <ArrowLeft size={22} />
              <span>Назад</span>
            </motion.button>

            {/* Retry Button */}
            <motion.button
              onClick={handleRetry}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl font-semibold text-lg transition-all ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              <RotateCcw size={22} />
              <span>Попробовать еще</span>
            </motion.button>
          </div>

          {/* Result Info */}
          {!isLoading && resultImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                className="text-4xl mb-3"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Результат готов!
              </h2>
              <p className="text-gray-600 mb-4 text-lg">
                Ваше изображение было успешно обработано с помощью ИИ
              </p>
              
              {resultImage.generatedAt && (
                <div className="text-sm text-gray-500">
                  Создано: {new Date(resultImage.generatedAt).toLocaleString('ru-RU')}
                </div>
              )}
            </motion.div>
          )}
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
              className="absolute top-6 right-6 z-60 w-12 h-12 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </motion.button>

            {/* Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-full p-6"
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
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 left-6 right-6 text-center"
            >
              <div className="bg-black/80 backdrop-blur-xl text-white px-6 py-4 rounded-2xl inline-block">
                <h3 className="font-semibold text-lg mb-2">{resultImage.title}</h3>
                <p className="text-sm text-gray-300">
                  Нажмите на фон или кнопку X чтобы закрыть полноэкранный режим
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