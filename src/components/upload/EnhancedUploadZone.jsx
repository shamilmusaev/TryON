import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image, User, Shirt } from 'lucide-react';
import PhotoPreview from './PhotoPreview';
import { useFileUpload } from '../../hooks/useFileUpload';

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
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Используем наш обновленный хук для загрузки файлов
  const { uploadFile, isUploading, uploadProgress, processingMessage } = useFileUpload({
    onUploadComplete: (fileData) => {
      onImageUpload?.(type, fileData);
    },
    onUploadError: (error) => {
      console.error('Upload error:', error);
    }
  });

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
    
    if (disabled || isUploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || disabled || isUploading) return;
    
    try {
      await uploadFile(file);
    } catch (error) {
      // Ошибка уже обработана в хуке
    }
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
    if (!disabled && !isUploading) {
      cameraInputRef.current?.click();
    }
  };

  const handleGallerySelect = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
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
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) {
            setIsDragOver(true);
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        whileHover={!disabled && !isUploading ? { scale: 1.01 } : {}}
        whileTap={!disabled && !isUploading ? { scale: 0.99 } : {}}
        onClick={!disabled && !isUploading ? handleGallerySelect : undefined}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          {isUploading ? (
            // Loading State с прогрессом
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
              <div className="text-center space-y-2">
                <p className="text-white font-medium">
                  {processingMessage || 'Processing...'}
                </p>
                <div className="w-48 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-gray-400 text-xs">{uploadProgress}%</p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Upload Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`text-6xl mb-4 ${colors.text}`}
              >
                {type === 'person' ? '🤳' : '👔'}
              </motion.div>

              {/* Upload Text */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white font-medium text-lg">
                  {placeholder || (isPersonPhoto ? 'Upload Your Photo' : 'Upload Clothing')}
                </h4>
                <p className="text-gray-400 text-sm max-w-xs">
                  {isDragOver 
                    ? 'Drop your image here' 
                    : 'Drag & drop an image or choose from camera/gallery'
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
                  disabled={disabled || isUploading}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl
                    ${isPersonPhoto 
                      ? 'bg-green-500 hover:bg-green-600 text-black' 
                      : 'bg-orange-500 hover:bg-orange-600 text-black'
                    }
                    font-medium transition-all duration-200 shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
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
                  disabled={disabled || isUploading}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl
                    border-2 ${colors.border} ${colors.text} hover:${colors.bgHover}
                    font-medium transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
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
          accept="image/*,.heic,.heif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </motion.div>

      {/* Upload hints */}
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-400">
          {isPersonPhoto 
            ? '📱 iPhone photos: metadata cleanup + optimal sizing for AI'
            : '🔧 iPhone images: preserving original quality, optimized for AI processing'
          }
        </div>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>• Max 15MB</span>
          <span>• JPG, PNG, WebP, HEIC</span>
          <span>• AI-optimized processing</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUploadZone; 