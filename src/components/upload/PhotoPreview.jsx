import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, X, CheckCircle } from "lucide-react";

const PhotoPreview = ({
  image,
  type = "person",
  onRetake,
  onRemove,
  className = "",
}) => {
  const isPersonPhoto = type === "person";
  const borderColor = isPersonPhoto ? "border-green-500" : "border-orange-500";
  const glowColor = isPersonPhoto
    ? "shadow-green-500/25"
    : "shadow-orange-500/25";

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group ${className}`}
    >
      {/* Preview Image Container - фиксированный размер */}
      <div
        className={`
        relative overflow-hidden rounded-2xl border-2 ${borderColor}
        shadow-xl ${glowColor} bg-gray-900
        w-full h-80
      `}
      >
        <img
          src={image.url || image}
          alt={isPersonPhoto ? "Your photo" : "Clothing item"}
          className="w-full h-full object-cover"
        />

        {/* Success indicator */}
        <div className="absolute top-3 right-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`
              p-1.5 rounded-full 
              ${isPersonPhoto ? "bg-green-500" : "bg-orange-500"}
              text-white shadow-lg
            `}
          >
            <CheckCircle size={16} />
          </motion.div>
        </div>

        {/* Overlay controls (показываются при hover) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {/* Retake button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRetake}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            title="Retake photo"
          >
            <RotateCcw size={20} />
          </motion.button>

          {/* Remove button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className="p-3 bg-red-500/20 backdrop-blur-sm rounded-full text-red-400 hover:bg-red-500/30 transition-colors"
            title="Remove photo"
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      </div>

      {/* Image info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-center"
      >
        <p
          className={`
          text-sm font-medium
          ${isPersonPhoto ? "text-green-400" : "text-orange-400"}
        `}
        >
          ✓ {isPersonPhoto ? "Your photo uploaded" : "Clothing item uploaded"}
        </p>
        {image.wasConverted && (
          <p className="text-xs text-blue-400 mt-1">
            🔄 Converted from HEVC for optimal results
          </p>
        )}
        {image.wasOptimizedForAI && (
          <p className="text-xs text-purple-400 mt-1">
            📱 iPhone image prepared for AI (metadata cleaned, resized)
          </p>
        )}
        {image.name && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {image.name}
            {image.originalSize && image.originalSize !== image.size && (
              <span className="text-gray-400">
                {" "}
                • Optimized:{" "}
                {(
                  ((image.originalSize - image.size) / image.originalSize) *
                  100
                ).toFixed(1)}
                % smaller
              </span>
            )}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PhotoPreview;
