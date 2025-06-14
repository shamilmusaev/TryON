import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, X, Bookmark, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import replicateService from "../services/replicate";
import wardrobeStorage from "../services/wardrobeStorage";

const ResultPage = ({ onBack, onNavigation, tryOnData }) => {
  const { isDark } = useTheme();
  
  // Processing states
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("initializing");
  const [predictionId, setPredictionId] = useState(null);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [canCancel, setCanCancel] = useState(true);
  const startGenerationTimeoutRef = useRef(null);
  
  // UI states
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Отладочный лог для проверки данных
  useEffect(() => {
    console.log("🔍 ResultPage tryOnData:", tryOnData);
  }, [tryOnData]);

  // Определяем isGenerating (используется для логики, но можно убрать если не нужно)
  // const isGenerating = !isCompleted && processingStatus !== "failed" && !error && !canCancel;

  const handleSuccess = useCallback((result) => {
    console.log("✅ Try-on generation completed:", result);

    setProgress(100);
    setProcessingStatus("completed");
    setIsCompleted(true);

    // Устанавливаем результат
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    setResultImage({
      url: imageUrl,
      title: "AI Generated Result",
      generatedAt: new Date().toISOString(),
      predictionId: result.id,
    });

    // Автоматически сохраняем результат в гардероб
    if (result.output) {
      wardrobeStorage.saveItem({
        url: imageUrl,
        title: "AI Generated Look",
        category: tryOnData?.category || 'upper_body',
        generatedAt: new Date().toISOString(),
      });
      console.log("💾 Result automatically saved to wardrobe");
    }
  }, [tryOnData]);

  const handleError = useCallback((error) => {
    console.error("❌ Try-on generation failed:", error);
    setError(error.message || "Generation failed");
    setProcessingStatus("failed");
    setIsCompleted(true);
  }, []);

  // PRODUCTION REPLICATE CODE
  const startGeneration = useCallback(async () => {
    if (canCancel) return;
    
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

  const handleSave = () => {
    if (resultImage && !isSaved && isCompleted) {
      wardrobeStorage.saveItem({
        url: resultImage.url,
        title: "AI Result",
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleRetry = () => {
    if (isCompleted) {
      onNavigation("home");
    }
  };

  const handleBack = () => {
    if (canCancel || isCompleted) {
      onBack();
    }
  };

  const handleImageClick = () => {
    if (isCompleted && resultImage) {
      setShowFullscreen(true);
    }
  };

  const handleCloseFullscreen = () => {
    setShowFullscreen(false);
  };

  const getStatusText = () => {
    switch (processingStatus) {
      case "initializing": return "Initializing...";
      case "starting": return "Starting generation...";
      case "analyzing": return "Analyzing images...";
      case "generating": return "Generating result...";
      case "finalizing": return "Finalizing...";
      case "completed": return "Generation complete!";
      case "failed": return "Generation failed";
      default: return "Processing...";
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50/30 to-white'
    }`}>
      <div className="pt-safe-top pb-safe-bottom">
        <div className="flex flex-col h-screen">
          {/* Result Image Section */}
          <div className={`flex-1 flex items-center justify-center p-4`}>
            <div className={`relative max-w-sm w-full aspect-[3/4] overflow-hidden ${
              isDark ? 'apple-glass-dark' : 'apple-glass-light'
            } rounded-3xl shadow-2xl`}>
            {!isCompleted ? (
              // Processing State
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                  {canCancel ? (
                    // Cancel countdown
                    <div>
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 border-4 border-t-transparent rounded-full ${
                          isDark ? 'border-red-400' : 'border-red-500'
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
                        Preparing generation...
                      </h3>
                      <p className={`text-sm mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        You can cancel within 5 seconds
                      </p>
                    </div>
                  ) : (
                    // Generation in progress
                    <div>
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
                        {getStatusText()}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Progress: {progress}%
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
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className={`mt-4 p-3 rounded-xl ${
                      isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                    }`}>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
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
                  className="w-full h-full object-contain rounded-3xl"
                />

                {/* Success indicator */}
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

                {/* Tap hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-lg ${
                    isDark 
                      ? 'bg-black/60 text-white border border-white/20' 
                      : 'bg-white/80 text-gray-800 border border-gray-200/50'
                  }`}>
                    Tap to enlarge
                  </div>
                </div>
              </motion.div>
            )}
            </div>
          </div>

          {/* Bottom Section - кнопки всегда видны */}
          <div className="px-4 py-4">
            <div className="flex space-x-3">
              {/* Back Button */}
              <motion.button
                onClick={canCancel ? handleCancelGeneration : handleBack}
                disabled={!canCancel && !isCompleted}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  (!canCancel && !isCompleted)
                    ? isDark 
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                    : isDark
                      ? "apple-glass-dark border border-white/10 text-white hover:border-white/20"
                      : "apple-glass-light border border-gray-200/50 text-gray-700 hover:border-gray-300"
                }`}
                whileHover={(canCancel || isCompleted) ? { scale: 1.02 } : {}}
                whileTap={(canCancel || isCompleted) ? { scale: 0.98 } : {}}
              >
                <ArrowLeft size={16} />
                <span>{canCancel ? "Cancel" : "Back"}</span>
              </motion.button>

              {/* Add to Wardrobe Button */}
              <motion.button
                onClick={handleSave}
                disabled={!isCompleted || isSaved}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  isSaved 
                    ? 'bg-green-500 text-white' 
                    : !isCompleted
                      ? isDark 
                        ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                      : isDark
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                }`}
                whileHover={isCompleted && !isSaved ? { scale: 1.02 } : {}}
                whileTap={isCompleted && !isSaved ? { scale: 0.98 } : {}}
              >
                {isSaved ? (
                  <>
                    <Check size={16} />
                    <span>Added to Wardrobe</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Add to Wardrobe</span>
                  </>
                )}
              </motion.button>
              
              {/* Retry Button */}
              <motion.button
                onClick={handleRetry}
                disabled={!isCompleted}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 rounded-2xl font-medium text-sm transition-all touch-manipulation ${
                  !isCompleted
                    ? isDark 
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300/50 text-gray-500 cursor-not-allowed"
                    : isDark
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg"
                }`}
                whileHover={isCompleted ? { scale: 1.02 } : {}}
                whileTap={isCompleted ? { scale: 0.98 } : {}}
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
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
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleCloseFullscreen}
              className="absolute top-6 right-6 z-60 w-11 h-11 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors touch-manipulation"
            >
              <X size={20} />
            </motion.button>

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
                  Tap background or X to close
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
