import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import userImageStorage from '../services/userImageStorage';

const MyUploadedImages = ({ userImages: allImages, onImageSelect, onBackToHome }) => {
  const { isDark } = useTheme();
  
  // 1. Фильтрация и локальное состояние
  const [images, setImages] = useState(allImages.filter(img => img.type === 'person'));

  // 2. Функция удаления
  const handleDelete = (e, imageId) => {
    e.stopPropagation(); // Предотвращаем клик по карточке
    userImageStorage.deleteImage(imageId);
    setImages(currentImages => currentImages.filter(img => img.id !== imageId));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onBackToHome}
      />
      
      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full h-full overflow-hidden ${
          isDark ? 'gradient-bg' : 'gradient-bg-light'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b safe-area-top ${
          isDark 
            ? 'bg-gray-900/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className="max-w-mobile mx-auto px-4 py-3 pt-safe">
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={onBackToHome}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark 
                  ? 'bg-gray-700/60 hover:bg-gray-600/80' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <ArrowRight size={20} className={`transform rotate-180 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
            </motion.button>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Uploaded Images
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-mobile mx-auto">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`rounded-2xl p-4 mb-6 ${
              isDark ? 'apple-glass-dark' : 'apple-glass-light'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {images.length} Photos
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Ready for try-on
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                📸
              </motion.div>
            </div>
          </motion.div>

          {/* 5. Добавлен скролл */}
          <div className="h-[calc(100vh-15rem)] overflow-y-auto pb-8">
            {images.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onImageSelect(image)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                      isDark ? 'bg-gray-800/50' : 'bg-white/50'
                    } backdrop-blur-sm border ${
                      isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}
                    style={{ aspectRatio: '3/4' }}
                  >
                    {/* 3. Превью всегда видно */}
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* 4. Кнопка удаления */}
                    <motion.button
                      onClick={(e) => handleDelete(e, image.id)}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 z-10 p-2 bg-black/40 rounded-full text-white"
                    >
                      <Trash2 size={16} />
                    </motion.button>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-white" />
                          <span className="text-white text-xs font-medium">
                            {image.type === 'person' ? 'Person' : 'Outfit'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white/80 text-xs">
                            {new Date(image.savedAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Empty state
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`text-center py-12 rounded-2xl ${
                  isDark ? 'apple-glass-dark' : 'apple-glass-light'
                }`}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  ��
                </motion.div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  No Images Yet
                </h3>
                <p className={`text-sm mb-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Upload your first photo to get started
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onImageSelect(null)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  Upload Photo
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
};

export default MyUploadedImages; 