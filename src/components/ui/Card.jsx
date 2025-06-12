import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  title,
  subtitle,
  icon,
  variant = "default",
  className = "",
  onClick,
  isHoverable = false,
  glowEffect = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "premium":
        return "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30";
      case "success":
        return "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30";
      case "warning":
        return "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30";
      case "error":
        return "bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30";
      case "glass":
        return "bg-white/5 backdrop-blur-sm border-white/10";
      default:
        return "bg-gray-900/50 border-gray-700";
    }
  };

  const getGlowStyles = () => {
    if (!glowEffect) return "";

    switch (variant) {
      case "premium":
        return "shadow-lg shadow-purple-500/20";
      case "success":
        return "shadow-lg shadow-green-500/20";
      case "warning":
        return "shadow-lg shadow-yellow-500/20";
      case "error":
        return "shadow-lg shadow-red-500/20";
      default:
        return "shadow-lg shadow-gray-500/20";
    }
  };

  const CardComponent = onClick || isHoverable ? motion.button : motion.div;

  return (
    <CardComponent
      onClick={onClick}
      whileHover={isHoverable ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        relative p-6 rounded-2xl border transition-all duration-300
        ${getVariantStyles()}
        ${getGlowStyles()}
        ${isHoverable ? "hover:border-opacity-50 cursor-pointer" : ""}
        ${onClick ? "focus:outline-none focus:ring-2 focus:ring-purple-500/50" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {(title || subtitle || icon) && (
        <div className="flex items-start space-x-3 mb-4">
          {/* Icon */}
          {icon && (
            <div
              className={`
              flex-shrink-0 p-2 rounded-xl
              ${variant === "premium" ? "bg-purple-500/20" : ""}
              ${variant === "success" ? "bg-green-500/20" : ""}
              ${variant === "warning" ? "bg-yellow-500/20" : ""}
              ${variant === "error" ? "bg-red-500/20" : ""}
              ${variant === "default" || variant === "glass" ? "bg-gray-700/50" : ""}
            `}
            >
              {typeof icon === "string" ? (
                <span className="text-xl">{icon}</span>
              ) : (
                icon
              )}
            </div>
          )}

          {/* Title and subtitle */}
          {(title || subtitle) && (
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="text-gray-300 leading-relaxed">{children}</div>

      {/* Animated background for premium variant */}
      {variant === "premium" && glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-blue-500/5"
          animate={{
            background: [
              "linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
              "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))",
              "linear-gradient(to right, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Ripple effect on click */}
      {onClick && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
        />
      )}
    </CardComponent>
  );
};

export default Card;
