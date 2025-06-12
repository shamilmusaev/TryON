import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb, Camera, User, Shirt } from "lucide-react";

const TipsPanel = ({ type = "person", className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const personTips = [
    {
      icon: Camera,
      title: "Best lighting",
      text: "Use natural light or bright indoor lighting for clear photos",
    },
    {
      icon: User,
      title: "Full body shot",
      text: "Include your full body in the frame for accurate try-on results",
    },
    {
      icon: Lightbulb,
      title: "Clean background",
      text: "Plain wall or simple background works best for AI processing",
    },
  ];

  const clothingTips = [
    {
      icon: Shirt,
      title: "Flat lay preferred",
      text: "Lay clothing flat or hang it straight for best results",
    },
    {
      icon: Camera,
      title: "Clear details",
      text: "Ensure all clothing details and textures are visible",
    },
    {
      icon: Lightbulb,
      title: "Remove background",
      text: "Clean, white background helps AI focus on the clothing",
    },
  ];

  const tips = type === "person" ? personTips : clothingTips;
  const accentColor = type === "person" ? "green" : "orange";

  return (
    <div className={`${className}`}>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between p-4 
          bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700
          hover:border-${accentColor}-500/50 transition-all duration-300
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl bg-${accentColor}-500/20`}>
            <Lightbulb className={`w-5 h-5 text-${accentColor}-400`} />
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium">
              {type === "person" ? "Photo Tips" : "Clothing Tips"}
            </h3>
            <p className="text-gray-400 text-sm">
              Get better results with these tips
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Tips content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800"
                >
                  <div
                    className={`
                    p-2 rounded-lg flex-shrink-0
                    bg-${accentColor}-500/10 border border-${accentColor}-500/20
                  `}
                  >
                    <tip.icon className={`w-4 h-4 text-${accentColor}-400`} />
                  </div>

                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Quick action tips */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`
                  p-4 rounded-xl border border-${accentColor}-500/30
                  bg-gradient-to-br from-${accentColor}-500/10 to-transparent
                `}
              >
                <h4
                  className={`text-${accentColor}-400 font-medium text-sm mb-2`}
                >
                  💡 Pro Tip
                </h4>
                <p className="text-gray-300 text-xs">
                  {type === "person"
                    ? "Stand about 3-4 feet from the camera and wear fitted clothing for the most accurate virtual try-on experience."
                    : "Take photos against a white wall or use a clothing photo from an online store for professional results."}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TipsPanel;
