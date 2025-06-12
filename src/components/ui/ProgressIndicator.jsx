import React from "react";
import { motion } from "framer-motion";

const ProgressIndicator = ({
  currentStep = 1,
  totalSteps = 2,
  labels = ["Photos", "Results"],
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Step text */}
      <div className="text-gray-400 text-sm font-medium">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Progress dots with labels */}
      <div className="flex items-center space-x-6">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center space-y-2">
                {/* Dot */}
                <motion.div
                  className={`
                    w-3 h-3 rounded-full relative
                    ${
                      isActive
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : isCompleted
                          ? "bg-green-400"
                          : "bg-gray-600"
                    }
                  `}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive
                      ? "0 0 20px rgba(34, 197, 94, 0.6)"
                      : "0 0 0px rgba(34, 197, 94, 0)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`
                  text-xs font-medium
                  ${
                    isActive
                      ? "text-green-400"
                      : isCompleted
                        ? "text-green-300"
                        : "text-gray-500"
                  }
                `}
                >
                  {labels[index]}
                </span>
              </div>

              {/* Connector line */}
              {index < totalSteps - 1 && (
                <motion.div
                  className={`
                    w-12 h-0.5 rounded-full
                    ${isCompleted ? "bg-green-400" : "bg-gray-600"}
                  `}
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isCompleted ? 1 : 0.3,
                    backgroundColor: isCompleted
                      ? "rgb(74, 222, 128)"
                      : "rgb(75, 85, 99)",
                  }}
                  transition={{ duration: 0.5, delay: isCompleted ? 0.2 : 0 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
