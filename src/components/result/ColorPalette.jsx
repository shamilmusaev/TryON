import { motion } from 'framer-motion';
import ColorSwatch from '../ui/ColorSwatch';

const ColorPalette = ({ 
  colors, 
  selectedColorId, 
  onColorSelect,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring"
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-white text-sm font-medium">Choose Color</h3>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center space-x-3"
      >
        {colors.map((color) => (
          <motion.div
            key={color.id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <ColorSwatch
              color={color}
              isSelected={selectedColorId === color.id}
              onClick={onColorSelect}
              size="medium"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Selected Color Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <span className="text-gray-300 text-xs">
          {colors.find(c => c.id === selectedColorId)?.name || 'Unknown'}
        </span>
      </motion.div>
    </div>
  );
};

export default ColorPalette; 