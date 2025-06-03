import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const CloseButton = ({
  onClick,
  size = 'md',
  variant = 'default',
  className = '',
  icon: CustomIcon = X,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 p-1';
      case 'lg':
        return 'w-12 h-12 p-3';
      default:
        return 'w-10 h-10 p-2';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600';
      case 'danger':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30';
      case 'ghost':
        return 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10';
      case 'glass':
        return 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 border border-white/10';
      default:
        return 'bg-black/50 text-white hover:bg-black/70 border border-gray-600';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative rounded-full transition-all duration-200 
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-white/20
        ${getSizeStyles()}
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        whileHover={{
          boxShadow: variant === 'danger' 
            ? '0 0 20px rgba(239, 68, 68, 0.4)' 
            : '0 0 15px rgba(255, 255, 255, 0.2)'
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon */}
      <CustomIcon 
        size={getIconSize()} 
        className="relative z-10"
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  );
};

export default CloseButton; 