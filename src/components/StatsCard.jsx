import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';

const StatsCard = ({ stats, userRecentTryOns }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glassmorphism rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">
              {stats.totalTryOns} AI Try-Ons Completed
            </h3>
            <p className="text-gray-400 text-sm">This week +12</p>
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
                className="w-8 h-8 rounded-full border-2 border-gray-700 object-cover"
              />
            ))}
          </div>
          <div className="flex items-center space-x-1 ml-3">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Recent styles</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-neon-green font-bold text-sm">95% match rate</div>
          <div className="text-gray-500 text-xs">AI accuracy</div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard; 