import React from "react";
import { motion } from "framer-motion";
import ProgressCircle from "../ui/ProgressCircle";
import ParticleSystem from "../effects/ParticleSystem";

const AIAnimation = ({
  progress = 0,
  currentState = "analyzing",
  isActive = true,
  className = "",
}) => {
  const getAIIcon = () => {
    switch (currentState) {
      case "analyzing":
        return "🔍";
      case "merging":
        return "🔄";
      case "enhancing":
        return "✨";
      default:
        return "🤖";
    }
  };

  const getStateColor = () => {
    switch (currentState) {
      case "analyzing":
        return "#3B82F6"; // Blue
      case "merging":
        return "#8B5CF6"; // Purple
      case "enhancing":
        return "#F59E0B"; // Amber
      default:
        return "#8B5CF6";
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${getStateColor()}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particle effects around the circle */}
      <ParticleSystem
        count={15}
        type="spark"
        intensity={0.8}
        sourcePosition={{ x: 50, y: 50 }}
        targetPosition={{ x: 50, y: 50 }}
        containerBounds={{ width: 200, height: 200 }}
        isActive={isActive}
        className="absolute inset-0"
      />

      {/* Main progress circle */}
      <ProgressCircle
        progress={progress}
        size={140}
        strokeWidth={10}
        color={getStateColor()}
        glowEffect={true}
        showPercentage={false}
        className="z-10"
      >
        {/* Central AI Icon */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            rotate: currentState === "merging" ? [0, 360] : 0,
          }}
          transition={{
            duration: currentState === "merging" ? 2 : 0,
            repeat: currentState === "merging" ? Infinity : 0,
            ease: "linear",
          }}
        >
          {/* Background for icon */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gray-900/80 backdrop-blur-sm"
            style={{ width: 60, height: 60 }}
            animate={{
              boxShadow: [
                `0 0 20px ${getStateColor()}40`,
                `0 0 40px ${getStateColor()}60`,
                `0 0 20px ${getStateColor()}40`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* AI Icon */}
          <motion.div
            className="relative z-10 text-4xl"
            animate={{
              scale: [1, 1.1, 1],
              rotateY: currentState === "analyzing" ? [0, 360] : 0,
            }}
            transition={{
              duration: currentState === "analyzing" ? 3 : 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {getAIIcon()}
          </motion.div>

          {/* Sparkle effects */}
          {isActive && (
            <div className="absolute inset-0">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                    transformOrigin: `0 ${30 + i * 5}px`,
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </ProgressCircle>

      {/* Orbiting elements */}
      {isActive && (
        <div className="absolute inset-0">
          {/* Data streams */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: `0 ${80 + i * 10}px`,
                background: `linear-gradient(45deg, ${getStateColor()}, ${getStateColor()}80)`,
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Neural network lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="neural-gradient" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  style={{ stopColor: getStateColor(), stopOpacity: 0.8 }}
                />

                <stop
                  offset="100%"
                  style={{ stopColor: getStateColor(), stopOpacity: 0.1 }}
                />
              </radialGradient>
            </defs>

            {/* Neural connections */}
            {[...Array(6)].map((_, i) => {
              const angle = i * 60 * (Math.PI / 180);
              const x1 = 100 + Math.cos(angle) * 40;
              const y1 = 100 + Math.sin(angle) * 40;
              const x2 = 100 + Math.cos(angle) * 70;
              const y2 = 100 + Math.sin(angle) * 70;

              return (
                <motion.line
                  key={`neural-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#neural-gradient)"
                  strokeWidth="2"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    pathLength: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* State transition effect */}
      <motion.div
        key={currentState}
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: getStateColor() }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

export default AIAnimation;
