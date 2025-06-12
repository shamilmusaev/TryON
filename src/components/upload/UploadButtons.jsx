import { motion } from "framer-motion";
import { Camera, ShoppingBag, FolderOpen } from "lucide-react";
import Button from "../ui/Button";

const UploadButtons = ({
  type = "user_photo",
  onCameraClick,
  onGalleryClick,
  onCatalogClick,
  isUploading = false,
  className = "",
}) => {
  const isUserPhoto = type === "user_photo";
  const primaryColor = isUserPhoto ? "neon-green" : "orange-400";

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file && onGalleryClick) {
      onGalleryClick(file);
    }
    // Reset input для повторного выбора того же файла
    e.target.value = "";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary buttons row */}
      <div className="flex items-center space-x-3">
        {/* Camera Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button
            variant={isUserPhoto ? "primary" : "secondary"}
            size="large"
            onClick={onCameraClick}
            disabled={isUploading}
            className={`
              w-full flex items-center justify-center space-x-2 h-14
              ${
                isUserPhoto
                  ? "bg-neon-green text-black hover:bg-neon-green/90"
                  : "bg-orange-400 text-black hover:bg-orange-400/90"
              }
              font-medium transition-all duration-300
              shadow-lg shadow-${primaryColor}/25
            `}
          >
            <Camera className="w-5 h-5" />
            <span>Camera</span>
          </Button>
        </motion.div>

        {/* Gallery Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 relative"
        >
          <Button
            variant="outline"
            size="large"
            disabled={isUploading}
            className={`
              w-full flex items-center justify-center space-x-2 h-14
              border-2 border-${primaryColor} text-${primaryColor}
              hover:bg-${primaryColor}/10 hover:border-${primaryColor}/80
              font-medium transition-all duration-300
            `}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Gallery</span>
          </Button>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
        </motion.div>
      </div>

      {/* Catalog button for clothing items */}
      {!isUserPhoto && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="large"
            onClick={onCatalogClick}
            disabled={isUploading}
            className={`
              w-full flex items-center justify-center space-x-2 h-14
              border border-gray-600 text-gray-300
              hover:bg-white/5 hover:border-gray-500
              font-medium transition-all duration-300
            `}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Browse Catalog</span>
          </Button>
        </motion.div>
      )}

      {/* Upload hints */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-2"
      >
        <div className="text-xs text-gray-400">
          {isUserPhoto
            ? "📱 Mobile: Use front camera for best results"
            : "📸 Clear, well-lit photos work best"}
        </div>

        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>• Max 10MB</span>
          <span>• JPG, PNG, WebP</span>
          <span>• Min 480x640</span>
        </div>
      </motion.div>

      {/* Loading state overlay */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <div className="text-center space-y-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full mx-auto"
            />

            <p className="text-white text-sm font-medium">Processing...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UploadButtons;
