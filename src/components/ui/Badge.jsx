import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  animated = false,
  className = '' 
}) => {
  const variants = {
    primary: 'bg-neon-green text-black',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    ghost: 'bg-white/20 text-white border border-white/30'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const badgeClasses = `
    inline-flex items-center justify-center
    rounded-full font-medium
    transition-all duration-200
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const animationProps = animated ? {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1, repeat: Infinity }
  } : {};

  return (
    <motion.span
      className={badgeClasses}
      {...animationProps}
    >
      {children}
    </motion.span>
  );
};

export default Badge; 