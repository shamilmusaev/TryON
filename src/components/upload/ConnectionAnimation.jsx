import React from "react";
import { motion } from "framer-motion";

const ConnectionAnimation = ({ isConnecting = false }) => {
  if (!isConnecting) return null;

  return (
    <motion.div
      className="flex items-center justify-center my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-3 h-3 bg-neon-green rounded-full"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-3 h-3 bg-neon-green rounded-full"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-3 h-3 bg-neon-green rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default ConnectionAnimation;
