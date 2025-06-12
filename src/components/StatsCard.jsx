import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const StatsCard = ({ stats, userRecentTryOns }) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-2xl p-6 mb-6 transition-all duration-300 ${
        isDark ? 'glass-card-dark' : 'glass-card-light'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className={`font-semibold text-lg transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-primary-light'
            }`}>
              {stats.totalTryOns} AI Try-Ons Completed
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-secondary-light'
            }`}>This week +12</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {userRecentTryOns.map((avatar, index) => (
              <motion.img
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                src={avatar}
                alt={`Try-on ${index + 1}`}
                className={`w-8 h-8 rounded-full border-2 object-cover transition-colors duration-300 ${
                  isDark ? 'border-gray-700' : 'border-white'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-1 ml-3">
            <Users className={`w-4 h-4 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-secondary-light'
            }`} />
            <span className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-secondary-light'
            }`}>Recent styles</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-neon-green font-bold text-sm">
            95% match rate
          </div>
          <div className={`text-xs transition-colors duration-300 ${
            isDark ? 'text-gray-500' : 'text-secondary-light'
          }`}>AI accuracy</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
