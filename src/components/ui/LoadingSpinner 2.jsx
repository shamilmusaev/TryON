import { motion } from "framer-motion";

const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variants = {
    primary: "border-neon-green",
    white: "border-white",
    gray: "border-gray-400",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizes[size]}
          border-2 border-t-transparent rounded-full
          ${variants[variant]}
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// AI Processing Spinner с частицами
export const AIProcessingSpinner = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Основной спиннер */}
      <motion.div
        className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Внутренний спиннер */}
      <motion.div
        className="absolute w-6 h-6 border border-neon-green/50 border-b-transparent rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Частицы вокруг */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-neon-green rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "0 0",
          }}
          animate={{
            rotate: [0, 360],
            x: [0, 30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
