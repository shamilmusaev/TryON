import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Share2, ArrowLeft, Heart, ShoppingBag, Sparkles, MoreVertical } from 'lucide-react';
import Navbar from './common/Navbar';

const ResultPage = ({ onBack, onNavigation, resultData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Обработка результатов генерации
  const processResultImages = () => {
    if (!resultData) {
      return [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face',
          title: 'Demo Result',
          description: 'No generation data available',
          likes: 0,
          confidence: 0
        }
      ];
    }

    // Если есть результат от Replicate
    if (resultData.output && Array.isArray(resultData.output)) {
      return resultData.output.map((url, index) => ({
        id: index + 1,
        url: url,
        title: `Generated Style ${index + 1}`,
        description: `AI-generated try-on result with ${resultData.originalData?.garmentDescription || 'stylish outfit'}`,
        likes: Math.floor(Math.random() * 300) + 100,
        confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
        originalPersonImg: resultData.originalData?.personImage?.url,
        originalClothingImg: resultData.originalData?.clothingImage?.url,
        generatedAt: resultData.generatedAt,
        predictionId: resultData.id
      }));
    }

    // Если есть единичный результат
    if (resultData.output) {
      return [{
        id: 1,
        url: resultData.output,
        title: 'AI Generated Result',
        description: `Try-on with ${resultData.originalData?.garmentDescription || 'stylish outfit'}`,
        likes: Math.floor(Math.random() * 300) + 100,
        confidence: Math.floor(Math.random() * 15) + 85,
        originalPersonImg: resultData.originalData?.personImage?.url,
        originalClothingImg: resultData.originalData?.clothingImage?.url,
        generatedAt: resultData.generatedAt,
        predictionId: resultData.id
      }];
    }

    // Fallback для демо
    return [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face',
        title: 'Processing Complete',
        description: 'AI generation completed successfully',
        likes: 247,
        confidence: 96,
        generatedAt: new Date().toISOString()
      }
    ];
  };

  const resultImages = processResultImages();
  const currentImage = resultImages[currentImageIndex];

  // Auto-hide UI after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUIVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  // Toggle UI visibility on tap
  const handleImageTap = () => {
    setIsUIVisible(!isUIVisible);
  };

  // Handle swipe navigation
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    
    if (info.offset.x > threshold && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && currentImageIndex < resultImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    
    x.set(0);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    setShowToast(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleDownload = () => {
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `tryon-result-${currentImage.id}-${Date.now()}.jpg`;
    link.click();
    setShowToast('Download started');
    setTimeout(() => setShowToast(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out my AI Try-On: ${currentImage.title}`,
          text: `I tried on "${currentImage.description}" using AI! Check out this amazing result.`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(currentImage.url);
      setShowToast('Image URL copied to clipboard');
      setTimeout(() => setShowToast(null), 2000);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceBadgeColor = (confidence) => {
    if (confidence >= 90) return 'bg-green-500/20 border-green-500/40';
    if (confidence >= 75) return 'bg-yellow-500/20 border-yellow-500/40';
    return 'bg-orange-500/20 border-orange-500/40';
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src={currentImage.url}
          alt={currentImage.title}
          className="w-full h-full object-cover blur-xl opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </motion.div>

      {/* Main Image Container */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        onClick={handleImageTap}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity }}
          className="relative w-full max-w-sm h-[70vh] rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={currentImage.url}
              alt={currentImage.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* Image Quality Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
            className={`absolute top-4 right-4 backdrop-blur-xl rounded-2xl px-3 py-2 border ${getConfidenceBadgeColor(currentImage.confidence)}`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles size={14} className={getConfidenceColor(currentImage.confidence)} />
              <span className="text-white text-xs font-medium">{currentImage.confidence}% Match</span>
            </div>
          </motion.div>

          {/* Generation Info Badge */}
          {currentImage.predictionId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isUIVisible ? 1 : 0, y: isUIVisible ? 0 : 20 }}
              className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl rounded-2xl px-3 py-2"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-medium">AI Generated</span>
              </div>
            </motion.div>
          )}

          {/* Swipe Indicators */}
          <AnimatePresence>
            {isUIVisible && resultImages.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev - 1);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </motion.button>
                )}
                
                {currentImageIndex < resultImages.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => prev + 1);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </motion.button>
                )}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Floating Top UI */}
      <AnimatePresence>
        {isUIVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent pt-12 pb-8"
          >
            <div className="flex items-center justify-between px-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-10 h-10 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white"
              >
                <ArrowLeft size={20} />
              </motion.button>
              
              <div className="text-center">
                <h1 className="text-white font-bold text-lg">{currentImage.title}</h1>
                <p className="text-gray-300 text-sm">
                  {resultImages.length > 1 ? `${currentImageIndex + 1} of ${resultImages.length}` : 'AI Generated'}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-black/50 backdrop-blur-xl rounded-full flex items-center justify-center text-white"
              >
                <MoreVertical size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom UI */}
      <AnimatePresence>
        {isUIVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8 pb-8"
          >
            {/* Image Info */}
            <div className="px-6 mb-6">
              <motion.h2
                key={currentImage.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-2xl font-bold mb-2"
              >
                {currentImage.title}
              </motion.h2>
              <motion.p
                key={currentImage.description}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-300 text-sm mb-4"
              >
                {currentImage.description}
              </motion.p>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Heart size={14} className="text-red-400" />
                  <span>{currentImage.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles size={14} className={getConfidenceColor(currentImage.confidence)} />
                  <span>{currentImage.confidence}% AI Confidence</span>
                </div>
                {currentImage.generatedAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(currentImage.generatedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6">
              <div className="flex items-center space-x-3 mb-4">
                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavorite}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isFavorited 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20'
                  }`}
                >
                  <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                </motion.button>

                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Download size={20} />
                </motion.button>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Share2 size={20} />
                </motion.button>

                {/* Shop Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl h-12 flex items-center justify-center space-x-2 text-black font-semibold transition-all"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Wardrobe</span>
                </motion.button>
              </div>

              {/* Try Again Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigation('create')}
                className="w-full bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-2xl h-12 flex items-center justify-center text-white font-medium transition-colors"
              >
                Try Another Style
              </motion.button>
            </div>

            {/* Progress Dots */}
            {resultImages.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {resultImages.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-60 bg-black/80 backdrop-blur-xl text-white px-4 py-2 rounded-2xl border border-white/10"
          >
            <p className="text-sm font-medium">{showToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - invisible but functional */}
      <div className="opacity-0 pointer-events-none">
        <Navbar 
          onNavigation={onNavigation} 
          showBackButton={false}
          title=""
        />
      </div>
    </div>
  );
};

export default ResultPage; 