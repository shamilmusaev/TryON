import { motion } from "framer-motion";
import { SPLIT_IMAGES } from "../../types/onboarding.types";

const HeroBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Split Screen Background */}
      <div className="absolute inset-0 flex">
        {/* Left Image - Male */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-1/2 relative"
        >
          <img
            src={SPLIT_IMAGES.LEFT}
            alt="Male model"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </motion.div>

        {/* Right Image - Female */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="w-1/2 relative"
        >
          <img
            src={SPLIT_IMAGES.RIGHT}
            alt="Female model"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent"></div>
        </motion.div>
      </div>

      {/* Center Divider with Analyzing Effect */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent transform -translate-x-0.5"
      />

      {/* Analyzing Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="glassmorphism px-6 py-3 rounded-full flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full"
          />

          <span className="text-white text-sm font-medium">
            Analyzing fit...
          </span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
        className="absolute left-1/2 bottom-1/3 transform -translate-x-1/2 h-1 bg-neon-green rounded-full"
        style={{ width: "200px" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-neon-green to-green-400 rounded-full"></div>
      </motion.div>

      {/* Main Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

      {/* Parallax Effect Container */}
      <motion.div
        className="relative z-10 h-full"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute w-2 h-2 bg-neon-green/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroBackground;
