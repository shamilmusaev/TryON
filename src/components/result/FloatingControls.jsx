import { motion } from 'framer-motion';
import { Heart, Share, Download, MoreVertical } from 'lucide-react';

const FloatingControls = ({ onLike, onShare, onDownload, onMore, isLiked = false }) => {
  const controls = [
    { icon: Heart, action: onLike, color: isLiked ? 'text-red-500' : 'text-white', fill: isLiked },
    { icon: Share, action: onShare, color: 'text-white' },
    { icon: Download, action: onDownload, color: 'text-white' },
    { icon: MoreVertical, action: onMore, color: 'text-white' },
  ];

  return (
    <motion.div 
      className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {controls.map((control, index) => {
        const Icon = control.icon;
        return (
          <motion.button
            key={index}
            onClick={control.action}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-12 h-12 rounded-full bg-black/50 backdrop-blur-md
              border border-white/20 flex items-center justify-center
              ${control.color} transition-all duration-200
              hover:bg-white/10
            `}
          >
            <Icon size={20} fill={control.fill ? 'currentColor' : 'none'} />
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FloatingControls; 