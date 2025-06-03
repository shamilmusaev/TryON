import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { UPLOAD_STATUS } from '../../types/upload.types';

const UploadZone = ({ 
  config,
  status = UPLOAD_STATUS.IDLE,
  preview = null,
  error = null,
  onDrop,
  className = '' 
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDrop?.(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onDrop?.(file);
    }
  };

  const getBorderColor = () => {
    if (error) return 'border-red-500';
    if (status === UPLOAD_STATUS.SUCCESS) return 'border-neon-green';
    if (status === UPLOAD_STATUS.UPLOADING) return 'border-blue-500';
    return 'border-gray-600 hover:border-neon-green/50';
  };

  const getBackgroundColor = () => {
    if (status === UPLOAD_STATUS.UPLOADING) return 'bg-blue-900/20';
    if (status === UPLOAD_STATUS.SUCCESS) return 'bg-neon-green/10';
    if (error) return 'bg-red-900/20';
    return 'bg-gray-900/50 hover:bg-gray-800/50';
  };

  return (
    <div className="space-y-3">
      {/* Zone Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">
          {config?.title || 'Upload'}
        </h3>
        {status === UPLOAD_STATUS.SUCCESS && (
          <CheckCircle size={20} className="text-neon-green" />
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm">
        {config?.description || 'Upload your image'}
      </p>

      {/* Upload Zone */}
      <motion.div
        className={`
          relative w-full h-64 border-2 border-dashed
          rounded-2xl flex flex-col items-center justify-center
          backdrop-blur-sm transition-all duration-300 cursor-pointer
          ${getBorderColor()} ${getBackgroundColor()} ${className}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Preview Image */}
        {preview && status === UPLOAD_STATUS.SUCCESS ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm">Click to change</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Upload State */}
            <div className="text-center">
              <div className="text-6xl mb-4">
                {status === UPLOAD_STATUS.UPLOADING ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  config?.icon || '📁'
                )}
              </div>
              
              <div className="text-gray-300">
                <p className="font-medium mb-2">
                  {status === UPLOAD_STATUS.UPLOADING ? 'Uploading...' : 
                   status === UPLOAD_STATUS.SUCCESS ? 'Upload complete!' :
                   config?.placeholder || 'Drag & drop or click to select'}
                </p>
                <p className="text-sm text-gray-400">
                  {status === UPLOAD_STATUS.UPLOADING ? 'Please wait...' :
                   config?.supportedFormats || 'Supports: JPG, PNG, WebP'}
                </p>
              </div>
              
              {status === UPLOAD_STATUS.IDLE && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Upload size={20} className="text-gray-400" />
                  <Camera size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          </>
        )}
        
        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={status === UPLOAD_STATUS.UPLOADING}
        />
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Upload Progress */}
      {status === UPLOAD_STATUS.UPLOADING && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-gray-700 rounded-full h-2"
        >
          <motion.div
            className="bg-neon-green h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone; 