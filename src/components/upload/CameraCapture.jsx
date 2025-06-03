import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, CheckCircle } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

const CameraCapture = ({ 
  isOpen, 
  onClose, 
  onCapture, 
  type = 'person',
  className = '' 
}) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const {
    isActive,
    isCapturing,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    reset,
    isCameraSupported,
    videoRef,
    canvasRef
  } = useCamera({
    facingMode: type === 'person' ? 'user' : 'environment',
    onCapture: (photoData) => {
      setCapturedPhoto(photoData);
      setShowPreview(true);
    },
    onError: (error) => {
      console.error('Camera error:', error);
    }
  });

  const isPersonPhoto = type === 'person';
  const accentColor = isPersonPhoto ? 'green' : 'orange';

  useEffect(() => {
    if (isOpen && isCameraSupported()) {
      startCamera();
    }

    return () => {
      reset();
    };
  }, [isOpen, startCamera, reset, isCameraSupported]);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      // capturePhoto уже вызывает onCapture callback
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture?.(capturedPhoto);
      onClose?.();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
    // Камера уже активна, просто скрываем превью
  };

  const handleClose = () => {
    reset();
    setCapturedPhoto(null);
    setShowPreview(false);
    onClose?.();
  };

  if (!isOpen) return null;

  if (!isCameraSupported()) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full text-center"
        >
          <div className="text-red-400 text-4xl mb-4">📷</div>
          <h3 className="text-white font-semibold mb-2">Camera Not Supported</h3>
          <p className="text-gray-400 text-sm mb-4">
            Your browser doesn't support camera access. Please use the gallery option instead.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <h2 className="text-white font-semibold">
                {showPreview ? 'Review Photo' : `Take ${isPersonPhoto ? 'Selfie' : 'Clothing Photo'}`}
              </h2>
              <p className="text-gray-400 text-sm">
                {showPreview 
                  ? 'Confirm or retake the photo' 
                  : isPersonPhoto 
                    ? 'Face the camera directly'
                    : 'Show the clothing item clearly'
                }
              </p>
            </div>
            
            {!showPreview && (
              <button
                onClick={switchCamera}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <RotateCcw size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Camera View or Preview */}
        <div className="relative w-full h-full flex items-center justify-center">
          {showPreview && capturedPhoto ? (
            // Photo Preview
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full"
            >
              <img
                src={capturedPhoto.url}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
              
              {/* Preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
            </motion.div>
          ) : (
            // Camera View
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`
                  w-full h-full object-cover
                  ${isPersonPhoto ? 'scale-x-[-1]' : ''} // Зеркало для селфи
                `}
              />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
              
              {/* Loading state */}
              {!isActive && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-12 h-12 border-4 border-${accentColor}-500 border-t-transparent rounded-full mx-auto mb-4`}
                    />
                    <p className="text-white">Starting camera...</p>
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {error && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h3 className="text-white font-semibold mb-2">Camera Error</h3>
                    <p className="text-gray-400 text-sm mb-4">{error}</p>
                    <button
                      onClick={startCamera}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          {showPreview ? (
            // Preview Controls
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetake}
                className="flex-1 max-w-32 bg-gray-700 text-white py-3 px-6 rounded-2xl font-medium hover:bg-gray-600 transition-colors"
              >
                Retake
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className={`
                  flex-1 max-w-32 py-3 px-6 rounded-2xl font-medium transition-colors
                  ${isPersonPhoto 
                    ? 'bg-green-500 hover:bg-green-600 text-black' 
                    : 'bg-orange-500 hover:bg-orange-600 text-black'
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Use Photo</span>
                </div>
              </motion.button>
            </div>
          ) : (
            // Camera Controls
            <div className="flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                disabled={!isActive || isCapturing}
                className={`
                  w-20 h-20 rounded-full border-4 border-white bg-transparent
                  flex items-center justify-center
                  ${!isActive || isCapturing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}
                  transition-all duration-200
                `}
              >
                {isCapturing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Camera size={32} className="text-white" />
                )}
              </motion.button>
            </div>
          )}
          
          {/* Capture hints */}
          {!showPreview && isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-4"
            >
              <p className="text-gray-300 text-sm">
                {isPersonPhoto 
                  ? 'Position your face in the center and tap to capture'
                  : 'Show the clothing item clearly and tap to capture'
                }
              </p>
            </motion.div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraCapture; 