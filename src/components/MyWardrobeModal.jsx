import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import wardrobeStorage from '../services/wardrobeStorage';

const MyWardrobeModal = ({ wardrobeItems: allItems, onBackToHome }) => {
  const { isDark } = useTheme();
  
  // Локальное состояние для управления элементами гардероба
  const [items, setItems] = useState(allItems);

  // Функция удаления
  const handleDelete = (e, itemId) => {
    e.stopPropagation(); // Предотвращаем клик по карточке
    wardrobeStorage.deleteItem(itemId);
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
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
              My Wardrobe
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
                  isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'
                }`}>
                  <Shirt className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {items.length} Generated Looks
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Your AI creations
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Scrollable content */}
          <div className="h-[calc(100vh-15rem)] overflow-y-auto pb-8">
            {items.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                      isDark ? 'bg-gray-800/50' : 'bg-white/50'
                    } backdrop-blur-sm border ${
                      isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}
                    style={{ aspectRatio: '3/4' }}
                  >
                    {/* Превью изображения */}
                    <img
                      src={item.url}
                      alt={`Generated look ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Кнопка удаления */}
                    <motion.button
                      onClick={(e) => handleDelete(e, item.id)}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 z-10 p-2 bg-black/40 rounded-full text-white"
                    >
                      <Trash2 size={16} />
                    </motion.button>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shirt className="w-4 h-4 text-white" />
                          <span className="text-white text-xs font-medium">
                            AI Generated
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white/80 text-xs">
                            {new Date(item.savedAt).toLocaleDateString('ru-RU', {
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Shirt size={32} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Your Wardrobe is Empty
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Generate some AI looks to see them here
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
};

export default MyWardrobeModal; 