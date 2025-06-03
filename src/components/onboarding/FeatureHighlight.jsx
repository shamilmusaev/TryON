import { motion } from 'framer-motion';
import { ANIMATION_DELAYS } from '../../types/onboarding.types';

const FeatureHighlight = ({ features }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: ANIMATION_DELAYS.FEATURES
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center space-x-8 md:space-x-12"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Icon Container */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 md:w-20 md:h-20 glassmorphism rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-neon-green/20 rounded-2xl"
            />
            
            <motion.span
              animate={index === 1 ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl md:text-3xl relative z-10"
            >
              {feature.icon}
            </motion.span>

            {/* Sparkle effect for middle feature */}
            {index === 1 && (
              <motion.div
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute top-1 right-1 text-neon-green text-xs"
              >
                ✨
              </motion.div>
            )}
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: ANIMATION_DELAYS.FEATURES + 0.3 + index * 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm md:text-base mb-1">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm">
              {feature.description}
            </p>
          </motion.div>

          {/* Connecting Line (for visual flow) */}
          {index < features.length - 1 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ 
                delay: ANIMATION_DELAYS.FEATURES + 0.5,
                duration: 0.8
              }}
              className="absolute top-8 left-full w-8 h-px bg-gradient-to-r from-neon-green/50 to-transparent hidden md:block"
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureHighlight; 