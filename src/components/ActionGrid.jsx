import React from "react";
import { motion } from "framer-motion";
import { Shirt, Camera, History, Sun, Moon, Image } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ActionGrid = ({ onActionClick }) => {
  const { isDark, toggleTheme } = useTheme();
  
  // Получаем пользовательские изображения для превью
  const userImages = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('userUploadedImages');
        const images = stored ? JSON.parse(stored) : [];
        return images.slice(0, 3); // Показываем только первые 3
      } catch {
        return [];
      }
    }
    return [];
  }, []);
  const actionItems = [
    {
      id: "wardrobe",
      title: "My Wardrobe",
      subtitle: "23 items",
      icon: Shirt,
      gradient: "gradient-purple",
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=40&h=40&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616c819074c?w=40&h=40&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop",
      ],
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
          {/* Background pattern for wardrobe */}
          {item.images && (
            <div className="absolute bottom-2 left-2 flex space-x-1">
              {item.images.slice(0, 4).map((img, imgIndex) => (
                <img
                  key={imgIndex}
                  src={img}
                  alt=""
                  className="w-5 h-5 rounded-md opacity-60"
                />
              ))}
            </div>
          )}

          {/* Gallery preview for uploaded images */}
          {item.gallery && (
            <div className="absolute bottom-2 right-2 flex space-x-1">
              {userImages.length > 0 ? (
                userImages.map((image, index) => (
                  <motion.img
                    key={image.id}
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-4 h-4 rounded-md object-cover border border-white/30"
                  />
                ))
              ) : (
                [1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-4 h-4 rounded-md ${
                      isDark ? 'bg-white/30' : 'bg-gray-600/30'
                    } border border-white/20`}
                  />
                ))
              )}
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
