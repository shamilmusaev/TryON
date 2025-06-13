import React from "react";
import { motion } from "framer-motion";
import { Shirt, Camera, History, Image } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ActionGrid = ({ onActionClick, uploadedImagesPreview = [], wardrobePreview = [] }) => {
  const { isDark } = useTheme();
  
  const actionItems = [
    {
      id: "wardrobe",
      title: "My Wardrobe",
      subtitle: "Generated looks",
      icon: Shirt,
      gradient: "gradient-purple",
      wardrobe: true,
    },
    {
      id: "uploaded-images",
      title: "My Uploaded Images",
      subtitle: "Your photos",
      icon: Image,
      gradient: "gradient-orange",
      gallery: true,
    },
    {
      id: "camera",
      title: "Try Something New",
      subtitle: "Take a photo",
      icon: Camera,
      gradient: "gradient-neon",
      highlight: true,
    },
    {
      id: "history",
      title: "Fashion Journey",
      subtitle: "Your history",
      icon: History,
      gradient: "glassmorphism border border-white/20",
    },
  ];

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
    hidden: { opacity: 0, scale: 0.9 },
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 mb-8"
      style={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, auto)'
      }}
    >
      {actionItems.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onActionClick?.(item.id);
          }}
          className={`p-6 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 ${
            isDark 
              ? item.gradient.includes('glassmorphism') 
                ? 'apple-glass-dark' 
                : item.gradient
              : item.gradient.includes('glassmorphism')
                ? 'apple-glass-light'
                : item.gradient.includes('gradient-purple')
                  ? 'light-gradient-purple apple-glass-light'
                  : item.gradient.includes('gradient-orange')
                    ? 'light-gradient-orange apple-glass-light'
                    : item.gradient.includes('gradient-neon')
                      ? 'light-gradient-neon apple-glass-light'
                      : item.gradient
          } ${
            item.highlight ? (isDark ? "shadow-lg shadow-neon-green/25" : "shadow-lg shadow-green-400/25") : ""
          }`}
        >
          {/* Wardrobe preview for generated looks */}
          {item.wardrobe && wardrobePreview.length > 0 && (
            <div className="absolute bottom-2 left-2 flex -space-x-2">
              {wardrobePreview.slice(0, 4).map((image, imgIndex) => (
                <motion.img
                  key={image.id || imgIndex}
                  src={image.url}
                  alt={`Wardrobe ${imgIndex + 1}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: imgIndex * 0.15 }}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white/40 dark:border-gray-800/60 shadow-md"
                  style={{ zIndex: wardrobePreview.length - imgIndex }}
                />
              ))}
            </div>
          )}

          {/* Gallery preview for uploaded images */}
          {item.gallery && uploadedImagesPreview.length > 0 && (
            <div className="absolute bottom-2 right-2 flex -space-x-2">
              {uploadedImagesPreview.map((image, index) => (
                <motion.img
                  key={image.id || index}
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="w-6 h-6 rounded-full object-cover border-2 border-white/40 dark:border-gray-800/60 shadow-md"
                  style={{ zIndex: uploadedImagesPreview.length - index }}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col h-full">
            <div className="mb-2">
              <item.icon className={`w-6 h-6 mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`} />

              <h3 className={`font-semibold text-base mb-1 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {item.title}
              </h3>
              <p className={`text-sm ${
                isDark ? 'text-white/80' : 'text-gray-600'
              }`}>{item.subtitle}</p>
            </div>

            {item.highlight && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-xs font-medium ${
                  isDark ? 'text-white/90' : 'text-gray-700'
                }`}
              >
                👗 Start now
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ActionGrid;
