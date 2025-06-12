import { motion } from "framer-motion";

const GradientText = ({
  children,
  className = "",
  gradient = "from-white via-gray-100 to-white",
  animation = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`
        bg-gradient-to-r ${gradient} 
        bg-clip-text text-transparent 
        ${animation ? "bg-[200%_auto]" : ""}
        ${className}
      `}
      style={
        animation
          ? {
              animation: "gradient-shift 3s ease-in-out infinite",
            }
          : {}
      }
    >
      {children}

      {animation && (
        <style jsx>{`
          @keyframes gradient-shift {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}</style>
      )}
    </motion.div>
  );
};

export default GradientText;
