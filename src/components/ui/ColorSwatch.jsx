import { motion } from 'framer-motion';

const ColorSwatch = ({ 
  color, 
  isSelected = false, 
  onClick, 
  size = 'medium',
  className = '' 
}) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  return (
    <motion.button
      onClick={() => onClick(color)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizes[size]}
        rounded-full
        relative
        border-2
        ${isSelected ? 'border-white shadow-lg' : 'border-white/30'}
        transition-all duration-200
        ${className}
      `}
      style={{ backgroundColor: color.hex }}
    >
      {/* Внутренний круг для выбранного цвета */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-1 rounded-full border-2 border-white/50"
        />
      )}
      
      {/* Checkmark для выбранного цвета */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default ColorSwatch; 