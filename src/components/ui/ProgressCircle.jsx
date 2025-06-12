import React from "react";
import { motion } from "framer-motion";

const ProgressCircle = ({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  children,
  className = "",
  color = "#8B5CF6",
  backgroundColor = "#374151",
  glowEffect = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          {glowEffect && (
            <filter id="progress-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />

              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}

          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />

            <stop
              offset="50%"
              style={{ stopColor: "#C084FC", stopOpacity: 1 }}
            />

            <stop
              offset="100%"
              style={{ stopColor: "#DDD6FE", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity="0.2"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          filter={glowEffect ? "url(#progress-glow)" : undefined}
          style={{
            filter: glowEffect ? `drop-shadow(0 0 10px ${color}40)` : "none",
          }}
        />

        {/* Animated dots on progress line */}
        <motion.circle
          cx={
            size / 2 +
            radius * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)
          }
          cy={
            size / 2 +
            radius * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)
          }
          r="3"
          fill={color}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          filter={glowEffect ? "url(#progress-glow)" : undefined}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ||
          (showPercentage && (
            <div className="text-center">
              <motion.div
                key={Math.floor(progress)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-white"
              >
                {Math.round(progress)}%
              </motion.div>
            </div>
          ))}
      </div>

      {/* Rotating sparkles around the circle */}
      {glowEffect && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: `0 ${radius + 10}px`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  boxShadow: `0 0 6px ${color}`,
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
