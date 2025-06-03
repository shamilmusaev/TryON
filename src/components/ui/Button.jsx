import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'large',
  className = '',
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'gradient-neon text-black font-bold shadow-lg shadow-neon-green/25',
    secondary: 'glassmorphism text-white border-white/20',
    outline: 'border-2 border-neon-green text-neon-green bg-transparent'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: variant === 'primary' ? '0 0 30px rgba(0, 255, 136, 0.4)' : undefined
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-2xl
        transition-all duration-300
        relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {/* Shimmer effect */}
      {variant === 'primary' && !disabled && (
        <motion.div
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-15deg)',
          }}
        />
      )}
      
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
    </motion.button>
  );
};

export default Button; 