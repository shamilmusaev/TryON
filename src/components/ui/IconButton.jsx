import { motion } from 'framer-motion';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  size = 'medium',
  variant = 'default',
  className = '',
  isActive = false,
  ...props 
}) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-14 h-14'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  const variants = {
    default: 'bg-black/20 backdrop-blur-md border border-white/20',
    active: 'bg-neon-green/90 backdrop-blur-md border border-neon-green',
    danger: 'bg-red-500/90 backdrop-blur-md border border-red-400'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizes[size]}
        ${isActive ? variants.active : variants[variant]}
        rounded-full
        flex items-center justify-center
        text-white
        transition-all duration-200
        shadow-lg
        ${className}
      `}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </motion.button>
  );
};

export default IconButton; 