import { motion } from "framer-motion";
import { X } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import ColorPalette from "./ColorPalette";
import SwipeIndicator from "./SwipeIndicator";
import { getConfidenceColor } from "../../types/result.types";

const InfoPanel = ({ isVisible = true, onClose, result = {} }) => {
  if (!isVisible) return null;

  const confidenceColor = getConfidenceColor(result.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-6 rounded-t-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white text-lg font-semibold">
          {result.title || "AI Try-On Result"}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-3 text-gray-300">
        <div className="flex justify-between">
          <span>Confidence:</span>
          <span className="text-neon-green">{result.confidence || "95%"}</span>
        </div>

        <div className="flex justify-between">
          <span>Processing time:</span>
          <span>{result.processingTime || "2.3s"}</span>
        </div>

        <div className="flex justify-between">
          <span>Style match:</span>
          <span className="text-neon-green">
            {result.styleMatch || "Excellent"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
