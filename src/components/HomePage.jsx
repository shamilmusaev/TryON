import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import ActionGrid from "./ActionGrid";
import AIRecommendations from "./AIRecommendations";
import MyUploadedImages from "./MyUploadedImages";
import Navbar from "./common/Navbar";
import Logo from "./common/Logo";
import VirtualTryOn from './VirtualTryOn';
import {
  mockRecommendations,
  mockUserData,
} from "../types/home.types";
import { useTheme } from "../contexts/ThemeContext";
import userImageStorage from "../services/userImageStorage";
import wardrobeStorage from "../services/wardrobeStorage";

const HomePage = ({ onStartProcessing, onNavigation }) => {
  const { toggleTheme, isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState("");
  const [showUploadedImages, setShowUploadedImages] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [selectedUserImage, setSelectedUserImage] = useState(null);

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



  // Загружаем пользовательские изображения и элементы гардероба при монтировании
  useEffect(() => {
    const loadUserImages = () => {
      let images = userImageStorage.getAllImages();
      setUserImages(images);
    };

    const loadWardrobeItems = () => {
      let items = wardrobeStorage.getAllItems();
      setWardrobeItems(items);
    };

    loadUserImages();
    loadWardrobeItems();
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
    } else if (actionId === 'wardrobe') {
      onNavigation('wardrobe');
    }
  };

  const handleImageSelect = (selectedImage) => {
    if (selectedImage) {
      console.log('🖼️ Изображение выбрано из галереи:', selectedImage);
      setSelectedUserImage(selectedImage);
    }
    setShowUploadedImages(false);
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

            <div className="flex items-center">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={mockUserData.avatar}
                alt="Profile"
                className={`w-10 h-10 rounded-full object-cover border-2 shadow-lg transition-all duration-300 ${
                  isDark 
                    ? 'border-green-400 shadow-green-400/20' 
                    : 'border-emerald-500 shadow-emerald-500/20'
                }`}
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



          {/* Main AI virtual try-on component */}
          <VirtualTryOn onNavigation={onNavigation} selectedImage={selectedUserImage} />


          {/* Action Grid */}
          <ActionGrid 
            onActionClick={handleActionClick}
            uploadedImagesPreview={userImages.filter(i => i.type === 'person').slice(0, 3)}
            wardrobePreview={wardrobeItems.slice(0, 4)}
          />

          {/* AI Recommendations */}
          <AIRecommendations
            recommendations={mockRecommendations}
            onRecommendationClick={handleRecommendationClick}
          />

        </div>
      </div>

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
