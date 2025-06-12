import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { PROCESSING_STEPS } from "../../types/processing.types";

const ProcessingTimeline = ({
  currentStep = 0,
  progress = 0,
  className = "",
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };

  const getStepIcon = (step, status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;

      case "active":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-purple-400" />
          </motion.div>
        );

      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {PROCESSING_STEPS.map((step, index) => {
        const status = getStepStatus(index);
        const isActive = status === "active";
        const isCompleted = status === "completed";

        // Вычисляем прогресс для текущего шага
        const stepProgress = isActive
          ? Math.max(
              0,
              Math.min(
                100,
                ((progress - step.progress.min) /
                  (step.progress.max - step.progress.min)) *
                  100,
              ),
            )
          : isCompleted
            ? 100
            : 0;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              flex items-center space-x-4 p-4 rounded-2xl border transition-all duration-300
              ${
                isActive
                  ? "bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/20"
                  : isCompleted
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-900/30 border-gray-700"
              }
            `}
          >
            {/* Icon */}
            <div
              className={`
              relative flex items-center justify-center w-12 h-12 rounded-full
              ${
                isActive
                  ? "bg-purple-500/20"
                  : isCompleted
                    ? "bg-green-500/20"
                    : "bg-gray-700/50"
              }
            `}
            >
              {getStepIcon(step, status)}

              {/* Pulse animation for active step */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`
                  font-semibold text-sm
                  ${
                    isActive
                      ? "text-purple-300"
                      : isCompleted
                        ? "text-green-300"
                        : "text-gray-400"
                  }
                `}
                >
                  {step.title}
                </h4>

                {/* Progress percentage for active step */}
                {isActive && (
                  <motion.span
                    key={Math.floor(stepProgress)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-purple-400 text-xs font-medium"
                  >
                    {Math.round(stepProgress)}%
                  </motion.span>
                )}
              </div>

              <p
                className={`
                text-xs
                ${
                  isActive
                    ? "text-purple-400/80"
                    : isCompleted
                      ? "text-green-400/80"
                      : "text-gray-500"
                }
              `}
              >
                {step.description}
              </p>

              {/* Progress bar for active step */}
              {isActive && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <motion.div
                      className="h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stepProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step emoji */}
            <div className="text-2xl opacity-60">{step.icon}</div>
          </motion.div>
        );
      })}

      {/* Overall progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm font-medium">
            Overall Progress
          </span>
          <span className="text-purple-400 text-sm font-semibold">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-green-500 via-purple-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessingTimeline;
