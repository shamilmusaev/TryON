import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image, User, Shirt, Upload } from 'lucide-react';
import PhotoPreview from './PhotoPreview';

const EnhancedUploadZone = ({ 
  type = 'person', 
  title,
  subtitle,
  placeholder,
  uploadedImage, 
  onImageUpload, 
  onImageRemove,
  disabled = false,
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isPersonPhoto = type === 'person';
  const colors = {
    border: isPersonPhoto ? 'border-green-500' : 'border-orange-500',
    borderDashed: isPersonPhoto ? 'border-green-500/50' : 'border-orange-500/50',
    borderHover: isPersonPhoto ? 'border-green-400' : 'border-orange-400',
    bg: isPersonPhoto ? 'bg-green-500/5' : 'bg-orange-500/5',
    bgHover: isPersonPhoto ? 'bg-green-500/10' : 'bg-orange-500/10',
    text: isPersonPhoto ? 'text-green-400' : 'text-orange-400',
    textSecondary: isPersonPhoto ? 'text-green-300' : 'text-orange-300',
    glow: isPersonPhoto ? 'shadow-green-500/25' : 'shadow-orange-500/25',
    icon: isPersonPhoto ? User : Shirt
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || disabled) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const imageData = {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    onImageUpload?.(type, imageData);
    setIsUploading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onImageRemove?.(type);
  };

  // Если фото уже загружено, показываем превью
  if (uploadedImage && !isUploading) {
    return (
      <PhotoPreview
        image={uploadedImage}
        type={type}
        onRetake={handleGallerySelect}
        onRemove={handleRemove}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${colors.bg}`}>
          <colors.icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.div
        className={`
          relative w-full h-80 border-2 border-dashed rounded-3xl
          backdrop-blur-sm transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? `${colors.borderHover} ${colors.bgHover} ${colors.glow} shadow-lg` 
            : uploadedImage 
              ? `${colors.border} ${colors.bg}` 
              : `${colors.borderDashed} hover:${colors.borderHover} hover:${colors.bgHover}`
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
        onClick={!disabled ? handleGallerySelect : undefined}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          {isUploading ? (
            // Loading State - правильное центрирование
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-16 h-16 border-4 ${colors.text.replace('text-', 'border-')} border-t-transparent rounded-full`}
              />
              <div className="text-center">
                <p className="text-white font-medium">Uploading...</p>
                <p className="text-gray-400 text-sm">Processing your image</p>
              </div>
            </motion.div>
          ) : (
            // Default State
            <>
              {/* Main Icon */}
              <motion.div
                animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  p-6 rounded-full mb-4
                  ${isDragOver ? colors.bg : 'bg-gray-800/50'}
                  border border-gray-700
                `}
              >
                {isDragOver ? (
                  <Upload className={`w-8 h-8 ${colors.text}`} />
                ) : (
                  <colors.icon className={`w-8 h-8 ${colors.text}`} />
                )}
              </motion.div>

              {/* Text Content */}
              <div className="space-y-2 mb-6">
                <h4 className="text-white font-semibold text-lg">
                  {isDragOver ? 'Drop to upload' : placeholder}
                </h4>
                <p className="text-gray-400 text-sm">
                  {isDragOver 
                    ? 'Release to start processing' 
                    : isPersonPhoto 
                      ? 'Face camera directly for best results'
                      : 'Clear background works best'
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 w-full max-w-xs">
                {/* Camera Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCameraCapture();
                  }}
                  disabled={disabled}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl
                    ${isPersonPhoto 
                      ? 'bg-green-500 hover:bg-green-600 text-black' 
                      : 'bg-orange-500 hover:bg-orange-600 text-black'
                    }
                    font-medium transition-all duration-200 shadow-lg
                  `}
                >
                  <Camera className="w-4 h-4" />
                  <span>Camera</span>
                </motion.button>

                {/* Gallery Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGallerySelect();
                  }}
                  disabled={disabled}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl
                    border-2 ${colors.border} ${colors.text} hover:${colors.bgHover}
                    font-medium transition-all duration-200
                  `}
                >
                  <Image className="w-4 h-4" />
                  <span>Gallery</span>
                </motion.button>
              </div>
            </>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </motion.div>

      {/* Upload hints */}
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-400">
          {isPersonPhoto 
            ? '📱 Use front camera for selfies, back camera for full body shots'
            : '📸 Clear, well-lit photos work best • Remove background if possible'
          }
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>• Max 10MB</span>
          <span>• JPG, PNG, WebP</span>
          <span>• Min 480x640</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUploadZone; 