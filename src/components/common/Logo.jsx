import { motion } from 'framer-motion';

const Logo = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl md:text-5xl'
  };

  return (
    <motion.div 
      className={`font-bold ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="bg-gradient-to-r from-neon-green via-green-400 to-neon-green bg-[200%_auto] bg-clip-text text-transparent"
      >
        TryOn
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-white/80 text-sm md:text-base font-normal mt-1"
      >
        AI Fashion Studio
      </motion.div>
    </motion.div>
  );
};

export default Logo; 