import { motion } from "framer-motion";
import { Star, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const AIRecommendations = ({ recommendations, onRecommendationClick }) => {
  const { isDark } = useTheme();
  
  // Theme-adaptive colors
  const neonGreenColor = isDark ? 'text-neon-green' : 'text-emerald-600';
  const neonGreenBg = isDark ? 'bg-neon-green/20' : 'bg-emerald-100';
  const neonGreenFill = isDark ? 'text-neon-green fill-neon-green' : 'text-emerald-600 fill-emerald-600';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`w-8 h-8 ${neonGreenBg} rounded-full flex items-center justify-center`}
          >
            <Sparkles className={`w-4 h-4 ${neonGreenColor}`} />
          </motion.div>
          <div>
            <h2 className={`text-xl font-bold mb-1 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              AI Picked For You
            </h2>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Personalized style recommendations
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 ${neonGreenColor} text-sm font-medium px-3 py-2 rounded-full ${
            isDark ? 'glassmorphism' : 'apple-glass-light'
          }`}
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </motion.button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex space-x-4 overflow-x-auto pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {recommendations.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -12, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRecommendationClick?.(item.id)}
            className={`min-w-[220px] rounded-3xl p-5 cursor-pointer group relative overflow-hidden ${
              isDark ? 'glassmorphism' : 'apple-glass-light'
            }`}
          >
            {/* Glow effect on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className={`absolute inset-0 rounded-3xl ${
                isDark 
                  ? 'bg-gradient-to-br from-neon-green/10 to-purple-500/10'
                  : 'bg-gradient-to-br from-emerald-200/20 to-purple-200/20'
              }`}
            />

            <div className="relative mb-4">
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover rounded-2xl"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Confidence badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="absolute top-3 left-3 bg-black/60 backdrop-blur-lg rounded-full px-3 py-2"
              >
                <div className="flex items-center space-x-1">
                  <Star className={`w-3 h-3 ${neonGreenFill}`} />

                  <span className="text-white text-xs font-semibold">
                    {item.confidence}%
                  </span>
                </div>
              </motion.div>

              {/* Heart button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className={`absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-lg rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDark ? 'group-hover:bg-neon-green/30' : 'group-hover:bg-emerald-500/30'
                }`}
              >
                <Heart className={`w-4 h-4 text-white transition-colors duration-300 ${
                  isDark ? 'group-hover:text-neon-green' : 'group-hover:text-emerald-300'
                }`} />
              </motion.button>

              {/* Hover overlay with Try On button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-black px-6 py-3 rounded-full font-bold text-sm shadow-lg ${
                    isDark 
                      ? 'bg-neon-green shadow-neon-green/25'
                      : 'bg-emerald-400 shadow-emerald-400/25'
                  }`}
                >
                  ✨ Try On
                </motion.div>
              </motion.div>
            </div>

            <div className="relative">
              <h3 className={`font-bold text-lg mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {item.title}
              </h3>
              <p className={`text-sm mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{item.description}</p>

              <div className="flex items-center justify-between">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    item.type === "outfit"
                      ? isDark 
                        ? "bg-purple-500/30 text-purple-200 border border-purple-400/30"
                        : "bg-purple-100 text-purple-700 border border-purple-300/50"
                      : isDark
                        ? "bg-orange-500/30 text-orange-200 border border-orange-400/30"
                        : "bg-orange-100 text-orange-700 border border-orange-300/50"
                  }`}
                >
                  {item.type === "outfit" ? "👗 Complete Look" : "💡 Style Tip"}
                </motion.span>

                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`${neonGreenColor} flex items-center space-x-1`}
                >
                  <span className="text-xs font-medium">Explore</span>
                  <ArrowRight size={14} />
                </motion.div>
              </div>
            </div>

            {/* Floating particles effect */}
            {index === 1 && (
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1,
                }}
                className={`absolute top-4 right-16 ${neonGreenColor} text-xs`}
              >
                ✨
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Add more recommendation placeholder */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className={`min-w-[180px] h-72 rounded-3xl p-5 cursor-pointer flex flex-col items-center justify-center group ${
            isDark ? 'glassmorphism' : 'apple-glass-light'
          }`}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 ${neonGreenBg} rounded-full flex items-center justify-center mb-4`}
          >
            <Sparkles className={`w-8 h-8 ${neonGreenColor}`} />
          </motion.div>
          <h3 className={`font-semibold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Discover More
          </h3>
          <p className={`text-sm text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            AI is finding perfect matches
          </p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`mt-3 ${neonGreenColor} text-xs`}
          >
            ⚡ Coming soon
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AIRecommendations;
