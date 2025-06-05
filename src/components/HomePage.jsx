import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';
import StatsCard from './StatsCard';
import ActionGrid from './ActionGrid';
import AIRecommendations from './AIRecommendations';
import Navbar from './common/Navbar';
import Logo from './common/Logo';
import { mockRecommendations, mockStats, mockUserData } from '../types/home.types';

const HomePage = ({ onStartProcessing, onNavigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = 'Good morning';
      if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
      if (hour >= 17) greeting = 'Good evening';
      setCurrentTime(greeting);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Имитация загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleActionClick = (actionId) => {
    console.log('Action clicked:', actionId);
    if (actionId === 'camera' && onStartProcessing) {
      onStartProcessing();
    }
  };

  const handleRecommendationClick = (recommendationId) => {
    console.log('Recommendation clicked:', recommendationId);
    if (onStartProcessing) {
      onStartProcessing();
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col w-full overflow-x-hidden">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50"
      >
        <div className="max-w-mobile mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size="small" className="text-lg" />
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="w-10 h-10 bg-gray-700/60 hover:bg-gray-600/70 border border-gray-600 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
                >
                  <RefreshCw className="w-5 h-5 text-gray-200" />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gray-700/60 hover:bg-gray-600/70 border border-gray-600 rounded-full flex items-center justify-center relative transition-all duration-200"
              >
                <Bell className="w-5 h-5 text-gray-200" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-gray-900"
                />
              </motion.button>

              <motion.img
                whileHover={{ scale: 1.05 }}
                src={mockUserData.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-green-400 shadow-lg shadow-green-400/20"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-16"
        style={{ paddingTop: '4rem' }}
      >
        <div className="max-w-mobile mx-auto px-6 py-8 w-full">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-white text-3xl font-bold mb-2">
              {currentTime}, {mockUserData.name}! 
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block ml-2"
              >
                ✨
              </motion.span>
            </h1>
            <p className="text-gray-400 text-lg">
              Ready for your fashion experiment?
            </p>
          </motion.div>

          {/* Stats Card */}
          <StatsCard 
            stats={mockStats} 
            userRecentTryOns={mockUserData.recentTryOns}
          />

          {/* Main CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleActionClick('camera')}
            className="w-full gradient-neon rounded-2xl p-6 mb-8 relative overflow-hidden group"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ 
                x: ['-100%', '100%']
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-15deg)',
              }}
            />
            
            <div className="flex items-center relative z-10">
              {/* Camera Icon Circle */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mr-4"
              >
                <div className="w-6 h-6 bg-black/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black/50 rounded-full"></div>
                </div>
              </motion.div>

              <div className="flex-1">
                <h3 className="text-black font-bold text-xl mb-1 text-left">
                  Try Something New 👗
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-black/70 text-sm">
                    Upload photo & see magic happen
                  </p>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-black text-lg"
                  >
                    →
                  </motion.div>
                </div>
                
                {/* AI Process indicator */}
                <div className="mt-2 flex items-center">
                  <div className="h-1 bg-black/20 rounded-full flex-1 mr-2">
                    <motion.div
                      animate={{ width: ['0%', '60%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-1 bg-black/40 rounded-full"
                    />
                  </div>
                  <span className="text-black/60 text-xs">AI process</span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Action Grid */}
          <ActionGrid onActionClick={handleActionClick} />

          {/* AI Recommendations */}
          <AIRecommendations 
            recommendations={mockRecommendations}
            onRecommendationClick={handleRecommendationClick}
          />

          {/* Fashion Journey Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glassmorphism rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white text-xl font-bold mb-1">Your Fashion Journey</h2>
                <p className="text-gray-400 text-sm">Track your style evolution</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                📊
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green mb-1">47</div>
                <div className="text-gray-400 text-xs">Try-Ons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">12</div>
                <div className="text-gray-400 text-xs">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">23</div>
                <div className="text-gray-400 text-xs">Saved</div>
              </div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-2 bg-gradient-to-r from-neon-green to-purple-500 rounded-full mt-4"
            />
            <p className="text-gray-400 text-xs mt-2">Style confidence: 75%</p>
          </motion.div>

          {/* Bottom spacing for safe area */}
          <div className="h-8" />
        </div>
      </div>

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 glassmorphism px-4 py-2 rounded-full z-50"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <RefreshCw className="w-4 h-4 text-neon-green" />
              </motion.div>
              <span className="text-white text-sm">Updating styles...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <Navbar onNavigation={onNavigation} />
    </div>
  );
};

export default HomePage; 