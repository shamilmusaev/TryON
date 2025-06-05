import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Share2, X } from 'lucide-react';

const FullscreenImageViewer = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title = "Generated Result",
  onDownload,
  onShare 
}) => {
  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-result-${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
    } else if (navigator.share && imageUrl) {
      try {
        await navigator.share({
          title: title,
          text: 'Check out my AI generated try-on result!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Кнопки управления сверху */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-0 left-0 right-0 z-[10000] bg-gradient-to-b from-black/80 to-transparent"
        >
          <div className="flex items-center justify-between p-4 sm:p-6 pt-safe">
            {/* Кнопка назад */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full px-3 sm:px-4 py-2 sm:py-3 transition-colors"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Back</span>
            </motion.button>

            {/* Заголовок */}
            <div className="text-center">
              <h1 className="text-white font-semibold text-lg sm:text-xl">
                {title}
              </h1>
              <p className="text-white/70 text-sm">
                Tap image to close
              </p>
            </div>

            {/* Кнопка закрытия */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Изображение в центре */}
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 pt-20 pb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative max-w-full max-h-full"
            onClick={onClose}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-pointer"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
            />
          </motion.div>
        </div>

        {/* Кнопки действий снизу */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-0 left-0 right-0 z-[10000] bg-gradient-to-t from-black/80 to-transparent"
        >
          <div className="flex items-center justify-center space-x-4 p-4 sm:p-6 pb-safe">
            {/* Кнопка скачивания */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full px-4 sm:px-6 py-3 sm:py-4 transition-colors"
            >
              <Download size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Download</span>
            </motion.button>

            {/* Кнопка поделиться */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full px-4 sm:px-6 py-3 sm:py-4 transition-colors"
            >
              <Share2 size={18} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Share</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenImageViewer; 