import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        p-3 rounded-full
        bg-white/10 backdrop-blur-md
        border border-white/20
        text-white
        transition-all duration-200
        hover:bg-white/20
        ${className}
      `}
    >
      <ArrowLeft size={20} />
    </motion.button>
  );
};

export default BackButton;
