import React from 'react';
import { motion } from 'framer-motion';
import { SPLIT_IMAGES } from '../types/onboarding.types';

const HeroBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Split-screen background images */}
      <div className="absolute inset-0 flex">
        {/* Left side - Male model */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-1/2 relative overflow-hidden"
        >
          <img
            src={SPLIT_IMAGES.LEFT}
            alt="Male model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        </motion.div>

        {/* Right side - Female model */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="w-1/2 relative overflow-hidden"
        >
          <img
            src={SPLIT_IMAGES.RIGHT}
            alt="Female model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
        </motion.div>
      </div>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(45deg, rgba(0,255,136,0.1) 0%, rgba(138,92,246,0.1) 100%)',
            'linear-gradient(45deg, rgba(138,92,246,0.1) 0%, rgba(0,255,136,0.1) 100%)',
            'linear-gradient(45deg, rgba(0,255,136,0.1) 0%, rgba(138,92,246,0.1) 100%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-2 h-2 bg-neon-green/30 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default HeroBackground; 