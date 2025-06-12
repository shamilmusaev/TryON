import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, RefreshCw, Sun, Moon } from "lucide-react";
import ActionGrid from "./ActionGrid";
import AIRecommendations from "./AIRecommendations";
import MyUploadedImages from "./MyUploadedImages";
import Navbar from "./common/Navbar";
import Logo from "./common/Logo";
import {
  mockRecommendations,
  mockUserData,
} from "../types/home.types";
import { useTheme } from "../contexts/ThemeContext";
import userImageStorage from "../services/userImageStorage";

const HomePage = ({ onStartProcessing, onNavigation }) => {
  const { toggleTheme, isDark } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showUploadedImages, setShowUploadedImages] = useState(false);
  const [userImages, setUserImages] = useState([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = "Good morning";
      if (hour >= 12 && hour < 17) greeting = "Good afternoon";
      if (hour >= 17) greeting = "Good evening";
      setCurrentTime(greeting);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Имитация загрузки
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  // Загружаем пользовательские изображения при монтировании
  useEffect(() => {
    const loadUserImages = () => {
      let images = userImageStorage.getAllImages();

      

      
              setUserImages(images);
    };

    loadUserImages();
  }, []);

  const handleActionClick = (actionId) => {
    console.log("Action clicked:", actionId);
    if (actionId === "camera" && onStartProcessing) {
      onStartProcessing();
    } else if (actionId === "uploaded-images") {
      // Обновляем изображения перед показом галереи
      const currentImages = userImageStorage.getAllImages();
      setUserImages(currentImages);
      setShowUploadedImages(true);
    }
  };

  const handleImageSelect = (selectedImage) => {
    if (selectedImage) {
      console.log('🖼️ Изображение выбрано:', selectedImage);
      // Здесь можно добавить логику для предзаполнения UploadPage выбранным изображением
    }
    setShowUploadedImages(false);
    onNavigation('upload');
  };

  const handleBackToHome = () => {
    setShowUploadedImages(false);
  };

  const handleRecommendationClick = (recommendationId) => {
    console.log("Recommendation clicked:", recommendationId);
    if (onStartProcessing) {
      onStartProcessing();
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-opacity-50 safe-area-top transition-all duration-300 ${
          isDark 
            ? 'gradient-header-dark border-white/10' 
            : 'gradient-header-light border-black/10'
        }`}
      >
        <div className="max-w-mobile mx-auto px-4 py-2 pt-safe">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size="small" className="text-lg" />

            <div className="flex items-center space-x-3">
              {/* Existing buttons with theme adaptation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDark 
                    ? 'glass-card-dark hover:bg-white/10' 
                    : 'glass-card-light hover:bg-white/40 shadow-lg'
                }`}
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{
                    duration: 1,
                    repeat: isRefreshing ? Infinity : 0,
                  }}
                >
                  <RefreshCw className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-indigo-600'}`} />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-all duration-300 ${
                  isDark 
                    ? 'glass-card-dark hover:bg-white/10' 
                    : 'glass-card-light hover:bg-white/40 shadow-lg'
                }`}
              >
                <Bell className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-indigo-600'}`} />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 ${
                    isDark ? 'border-gray-900' : 'border-white'
                  }`}
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
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden pt-20 pb-safe"
        style={{ paddingTop: "5rem" }}
      >
        <div className="max-w-mobile mx-auto px-4 py-4 w-full">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-primary-light'
            }`}>
              {currentTime}, {mockUserData.name}!
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block ml-2"
              >
                ✨
              </motion.span>
            </h1>
            <p className={`text-base sm:text-lg transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-secondary-light'
            }`}>
              Ready for your fashion experiment?
            </p>
          </motion.div>



          {/* Main CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleActionClick("camera")}
            className="w-full gradient-neon rounded-2xl p-6 mb-8 relative overflow-hidden group"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                transform: "skewX(-15deg)",
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
                      animate={{ width: ["0%", "60%", "0%"] }}
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
            className={`rounded-2xl p-6 ${
              isDark ? 'glassmorphism' : 'apple-glass-light'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Your Fashion Journey
                </h2>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Track your style evolution
                </p>
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
                <div className="text-2xl font-bold text-neon-green mb-1">
                  47
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Try-Ons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  12
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  23
                </div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Saved</div>
              </div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, delay: 1 }}
              className="h-2 bg-gradient-to-r from-neon-green to-purple-500 rounded-full mt-4"
            />

            <p className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Style confidence: 75%</p>
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

      {/* Floating Theme Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed bottom-20 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden group z-50 shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' 
            : 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-300 hover:to-pink-300'
        }`}
        style={{
          boxShadow: isDark 
            ? '0 8px 32px rgba(99, 102, 241, 0.3)' 
            : '0 8px 32px rgba(251, 146, 60, 0.3)'
        }}
      >
        {/* Pulse effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full ${
            isDark 
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-orange-300 to-pink-300'
          }`}
        />
        
        {/* Icon container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'sun' : 'moon'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="relative z-10"
          >
            {isDark ? (
              <Sun className="w-8 h-8 text-yellow-300" />
            ) : (
              <Moon className="w-8 h-8 text-white" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.6), transparent)",
            transform: "skewX(-15deg)",
          }}
        />
      </motion.button>

      {/* My Uploaded Images Modal */}
      <AnimatePresence>
        {showUploadedImages && (
          <MyUploadedImages
            userImages={userImages}
            onImageSelect={handleImageSelect}
            onBackToHome={handleBackToHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
