import { motion } from "framer-motion";

const SwipeIndicator = ({ current, total, className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          className={`
            h-1.5 rounded-full transition-all duration-300
            ${index === current - 1 ? "w-6 bg-neon-green" : "w-1.5 bg-white/30"}
          `}
          animate={{
            backgroundColor:
              index === current - 1 ? "#00ff88" : "rgba(255, 255, 255, 0.3)",
            width: index === current - 1 ? "24px" : "6px",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
};

export default SwipeIndicator;
