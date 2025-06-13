import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Shirt } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import wardrobeStorage from '../services/wardrobeStorage';

const MyWardrobePage = ({ onBack }) => {
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(wardrobeStorage.getAllItems());
  }, []);

  const handleDelete = (e, itemId) => {
    e.stopPropagation();
    wardrobeStorage.deleteItem(itemId);
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div 
      className="fixed inset-0 z-60 bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -60 }} animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b safe-area-top ${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200'}`}
      >
        <div className="max-w-mobile mx-auto px-4 py-3 pt-safe flex items-center justify-between">
          <motion.button onClick={onBack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full">
            <ArrowRight size={20} className="transform rotate-180" />
          </motion.button>
          <h1 className="text-lg font-semibold">My Wardrobe</h1>
          <div className="w-10" />
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="h-screen overflow-y-auto pt-24 pb-20 px-4">
        <div className="max-w-mobile mx-auto">
          {items.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <motion.div key={item.id} variants={itemVariants} className="relative group">
                  <img src={item.url} alt="Wardrobe item" className="rounded-lg aspect-[3/4] object-cover w-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-3 bg-red-500/80 rounded-full text-white"
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <Shirt size={48} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-bold">Your Wardrobe is Empty</h3>
              <p className="text-gray-400">Save generated images to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyWardrobePage; 