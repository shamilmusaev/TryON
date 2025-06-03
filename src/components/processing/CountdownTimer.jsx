import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ 
  totalDuration = 30000, // 30 seconds in milliseconds
  currentProgress = 0,
  isActive = true,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(totalDuration);

  useEffect(() => {
    if (!isActive) return;

    // Вычисляем оставшееся время на основе прогресса
    const remaining = Math.max(0, totalDuration * (1 - currentProgress / 100));
    setTimeRemaining(remaining);
  }, [currentProgress, totalDuration, isActive]);

  // Форматируем время в MM:SS
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const { minutes, seconds } = formatTime(timeRemaining);
  
  // Цвет в зависимости от оставшегося времени
  const getTimerColor = () => {
    const progressPercent = (timeRemaining / totalDuration) * 100;
    if (progressPercent > 66) return 'text-green-400';
    if (progressPercent > 33) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGlowColor = () => {
    const progressPercent = (timeRemaining / totalDuration) * 100;
    if (progressPercent > 66) return '#22C55E';
    if (progressPercent > 33) return '#EAB308';
    return '#EF4444';
  };

  return (
    <div className={`text-center ${className}`}>
      {/* Timer display */}
      <div className="flex items-center justify-center space-x-2">
        {/* Minutes */}
        <motion.div
          key={minutes}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700
            ${getTimerColor()}
          `}
          style={{
            boxShadow: isActive ? `0 0 20px ${getGlowColor()}40` : 'none'
          }}
        >
          <div className="text-3xl font-bold font-mono">
            {minutes}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Minutes
          </div>
          
          {/* Pulse effect */}
          {isActive && timeRemaining < 10000 && (
            <motion.div
              className="absolute inset-0 border-2 border-red-400 rounded-2xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Separator */}
        <motion.div
          animate={{
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`text-3xl font-bold ${getTimerColor()}`}
        >
          :
        </motion.div>

        {/* Seconds */}
        <motion.div
          key={seconds}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700
            ${getTimerColor()}
          `}
          style={{
            boxShadow: isActive ? `0 0 20px ${getGlowColor()}40` : 'none'
          }}
        >
          <div className="text-3xl font-bold font-mono">
            {seconds}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Seconds
          </div>
          
          {/* Pulse effect */}
          {isActive && timeRemaining < 10000 && (
            <motion.div
              className="absolute inset-0 border-2 border-red-400 rounded-2xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4"
      >
        <p className="text-gray-400 text-sm">
          {timeRemaining > 5000 
            ? 'Sit back and relax. You\'re experiencing our premium AI processing. ✨'
            : 'Almost ready! Final touches in progress...'
          }
        </p>
      </motion.div>

      {/* Progress ring around timer */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-gray-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={getGlowColor()}
              strokeWidth="2"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 45 * (timeRemaining / totalDuration)
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 6px ${getGlowColor()})` }}
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer; 