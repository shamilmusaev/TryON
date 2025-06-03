import React from 'react';
import { motion } from 'framer-motion';

const PhotoPair = ({ 
  personPhoto, 
  clothingPhoto, 
  isAnimating = true,
  className = '' 
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative flex items-center space-x-4">
        {/* Person Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg shadow-green-500/25">
            {personPhoto ? (
              <img
                src={personPhoto.url || personPhoto}
                alt="Person"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-2xl">👤</div>
              </div>
            )}
            
            {/* Animated border */}
            {isAnimating && (
              <motion.div
                className="absolute inset-0 border-2 border-green-400 rounded-xl"
                animate={{
                  boxShadow: [
                    '0 0 8px rgba(34, 197, 94, 0.3)',
                    '0 0 16px rgba(34, 197, 94, 0.6)',
                    '0 0 8px rgba(34, 197, 94, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-2"
          >
            <div className="text-green-400 text-xs font-medium">Your Photo</div>
          </motion.div>
        </motion.div>

        {/* Plus icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <motion.div
            animate={isAnimating ? {
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center"
          >
            <span className="text-purple-400 text-lg font-bold">+</span>
          </motion.div>
        </motion.div>

        {/* Clothing Photo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/25">
            {clothingPhoto ? (
              <img
                src={clothingPhoto.url || clothingPhoto}
                alt="Clothing"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-2xl">👕</div>
              </div>
            )}
            
            {/* Animated border */}
            {isAnimating && (
              <motion.div
                className="absolute inset-0 border-2 border-orange-400 rounded-xl"
                animate={{
                  boxShadow: [
                    '0 0 8px rgba(251, 146, 60, 0.3)',
                    '0 0 16px rgba(251, 146, 60, 0.6)',
                    '0 0 8px rgba(251, 146, 60, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            )}
          </div>
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-2"
          >
            <div className="text-orange-400 text-xs font-medium">Clothing Item</div>
          </motion.div>
        </motion.div>

        {/* Energy flow animation */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Energy particles flowing between photos */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#22C55E', stopOpacity: 0.8 }} />
                  <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FB923C', stopOpacity: 0.8 }} />
                </linearGradient>
                
                <filter id="glow-effect">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Flowing energy line */}
              <motion.path
                d="M 40 50 Q 100 30 160 50"
                stroke="url(#flow-gradient)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#glow-effect)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Energy dots */}
              {[...Array(2)].map((_, i) => (
                <motion.circle
                  key={i}
                  r="2"
                  fill="#8B5CF6"
                  filter="url(#glow-effect)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${i * 0.8}s`}
                    path="M 40 50 Q 100 30 160 50"
                  />
                </motion.circle>
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoPair; 