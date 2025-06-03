import React, { useState } from 'react';
import { ArrowLeft, Menu, X, Home, Search, Plus, Heart, User, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onNavigation, showBackButton = false, onBack, title = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', action: () => onNavigation('home') },
    { id: 'discover', icon: Search, label: 'Discover', action: () => onNavigation('discover') },
    { id: 'create', icon: Plus, label: 'Create Try-On', action: () => onNavigation('create') },
    { id: 'favorites', icon: Heart, label: 'Favorites', action: () => onNavigation('favorites') },
    { id: 'profile', icon: User, label: 'Profile', action: () => onNavigation('profile') },
    { id: 'settings', icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { id: 'about', icon: Info, label: 'About', action: () => console.log('About') },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (item) => {
    item.action();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Верхняя навигация */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3 h-16">
          {showBackButton ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMenuToggle}
              className="w-10 h-10 glassmorphism rounded-full flex items-center justify-center text-white"
            >
              <Menu size={20} />
            </motion.button>
          )}
          
          {title && (
            <h1 className="text-white font-semibold text-lg">{title}</h1>
          )}
          
          <div className="w-10" />
        </div>
      </div>

      {/* Гамбургер меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-black/95 backdrop-blur-xl border-r border-white/10"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-white text-xl font-bold">TryOn AI</h2>
                  <p className="text-gray-400 text-sm">Fashion Studio</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-4">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center space-x-4 px-6 py-4 text-left text-white hover:text-green-400 transition-colors"
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Menu Footer */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-black">AI</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Premium User</p>
                    <p className="text-gray-400 text-xs">Unlimited Try-Ons</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 