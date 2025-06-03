import { motion } from 'framer-motion';
import { Shirt, Sparkles, Camera, History } from 'lucide-react';

const ActionGrid = ({ onActionClick }) => {
  const actionItems = [
    {
      id: 'wardrobe',
      title: 'My Wardrobe',
      subtitle: '23 items',
      icon: Shirt,
      gradient: 'gradient-purple',
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=40&h=40&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616c819074c?w=40&h=40&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop'
      ]
    },
    {
      id: 'suggestions',
      title: 'Style Suggestions',
      subtitle: 'AI Recommends',
      icon: Sparkles,
      gradient: 'gradient-orange',
      sparkle: true
    },
    {
      id: 'camera',
      title: 'Try Something New',
      subtitle: 'Take a photo',
      icon: Camera,
      gradient: 'gradient-neon',
      highlight: true
    },
    {
      id: 'history',
      title: 'Fashion Journey',
      subtitle: 'Your history',
      icon: History,
      gradient: 'glassmorphism border border-white/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 mb-8"
    >
      {actionItems.map((item, index) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onActionClick?.(item.id)}
          className={`${item.gradient} p-6 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 ${
            item.highlight ? 'shadow-lg shadow-neon-green/25' : ''
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

          {/* AI Robot icon for suggestions */}
          {item.sparkle && (
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-2 right-2 text-white/60"
            >
              🤖
            </motion.div>
          )}

          <div className="flex flex-col h-full">
            <div className="mb-2">
              <item.icon className="w-6 h-6 mb-2 text-white" />
              <h3 className="text-white font-semibold text-base mb-1">
                {item.title}
              </h3>
              <p className="text-white/80 text-sm">
                {item.subtitle}
              </p>
            </div>

            {item.highlight && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs text-white/90 font-medium"
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