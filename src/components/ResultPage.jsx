import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, X, Bookmark, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import wardrobeStorage from "../services/wardrobeStorage";

const ResultPage = ({ onBack, onNavigation, resultData }) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Обрабатываем входящие данные результата
  useEffect(() => {
    console.log("🔍 ResultPage получил данные:", resultData);

    if (resultData && resultData.output) {
      // Если есть готовый результат, сразу показываем его
      const imageUrl = Array.isArray(resultData.output)
        ? resultData.output[0]
        : resultData.output;
      setResultImage({
        url: imageUrl,
        title: "AI Generated Result",
        generatedAt: resultData.generatedAt,
        predictionId: resultData.id,
      });
      setIsLoading(false);
    } else {
      // Если результата нет, показываем состояние загрузки
      console.log("⏳ Результат еще генерируется...");

      // Симуляция ожидания результата (в реальном приложении это будет приходить от ProcessingPage)
      const timer = setTimeout(() => {
        // Fallback изображение если результат так и не пришел
        setResultImage({
          url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face",
          title: "Demo Result",
          generatedAt: new Date().toISOString(),
        });
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resultData]);

  const handleSave = () => {
    if (resultImage && !isSaved) {
      wardrobeStorage.saveItem({
        url: resultImage.url,
        title: "AI Result",
      });
      setIsSaved(true);
      // Показать уведомление на 2 секунды
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleRetry = () => {
    if (!isLoading) {
      onNavigation("upload");
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
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50/30 to-white'
    }`}>
      {/* Safe area для iPhone 14 Pro */}
      <div className="pt-safe-top pb-safe-bottom">
        <div className="flex flex-col h-screen">
          {/* Result Image Section - занимает основную часть экрана */}
          <div className={`flex-1 relative overflow-hidden ${
            isDark ? 'apple-glass-dark' : 'apple-glass-light'
          } m-4 rounded-3xl shadow-2xl`}>
            {isLoading ? (
              // Loading State
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full ${
                      isDark ? 'border-purple-400' : 'border-purple-500'
                    }`}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-700'
                  }`}>
                    Генерируем результат
                  </h3>
                  <p className={`text-sm mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Пожалуйста, подождите...
                  </p>
                  <div className="w-full">
                    <div className={`rounded-full h-2 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        className={`h-2 rounded-full ${
                          isDark ? 'bg-purple-400' : 'bg-purple-500'
                        }`}
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
                  className="w-full h-full object-cover rounded-3xl"
                />

                {/* Success indicator */}
                {!isLoading && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg ${
                      isDark ? 'apple-glass-dark' : 'apple-glass-light'
                    }`}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center text-sm font-bold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ✓
                    </div>
                  </motion.div>
                )}

                {/* Tap hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-lg ${
                    isDark 
                      ? 'bg-black/60 text-white border border-white/20' 
                      : 'bg-white/80 text-gray-800 border border-gray-200/50'
                  }`}>
                    Нажмите для увеличения
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Section - кнопки */}
          <div className="px-4 py-4">
            <div className="flex space-x-3">
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  isLoading
                    ? isDark 
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                    : isDark
                      ? "apple-glass-dark border border-white/10 text-white hover:border-white/20"
                      : "apple-glass-light border border-gray-200/50 text-gray-700 hover:border-gray-300"
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <ArrowLeft size={16} />
                <span>Назад</span>
              </motion.button>

              {/* Add to Wardrobe Button */}
              <motion.button
                onClick={handleSave}
                disabled={isLoading || isSaved}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  isSaved 
                    ? 'bg-green-500 text-white' 
                    : isDark
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                }`}
                whileHover={!isSaved ? { scale: 1.02 } : {}}
                whileTap={!isSaved ? { scale: 0.98 } : {}}
              >
                {isSaved ? (
                  <>
                    <Check size={16} />
                    <span>Added to Wardrobe</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Add to my wardrobe</span>
                  </>
                )}
              </motion.button>
              
              {/* Retry Button */}
              <motion.button
                onClick={handleRetry}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  isLoading
                    ? isDark 
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                    : isDark
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg"
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <RotateCcw size={16} />
                <span>Попробовать еще</span>
              </motion.button>
            </div>
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
                <h3 className="font-medium text-sm mb-1">
                  {resultImage.title}
                </h3>
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
