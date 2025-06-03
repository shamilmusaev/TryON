import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ArrowDown } from 'lucide-react';
import EnhancedUploadZone from './upload/EnhancedUploadZone';
import TipsPanel from './upload/TipsPanel';
import ProgressIndicator from './ui/ProgressIndicator';

const UploadPage = ({ onBack, onContinue, onNavigation }) => {
  const [uploadedImages, setUploadedImages] = useState({
    person: null,
    clothing: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [garmentDescription, setGarmentDescription] = useState('');

  const handleImageUpload = (type, imageData) => {
    setUploadedImages(prev => ({
      ...prev,
      [type]: imageData
    }));
  };

  const handleImageRemove = (type) => {
    setUploadedImages(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    
    setIsProcessing(true);
    
    try {
      // Подготавливаем данные для генерации
      const tryOnData = {
        personImage: uploadedImages.person,
        clothingImage: uploadedImages.clothing,
        garmentDescription: garmentDescription || 'stylish outfit',
        timestamp: Date.now()
      };

      console.log('🚀 Starting try-on with data:', {
        personImage: uploadedImages.person?.name,
        clothingImage: uploadedImages.clothing?.name,
        description: tryOnData.garmentDescription
      });

      // Передаем данные в ProcessingPage
      onContinue(tryOnData);
      
    } catch (error) {
      console.error('❌ Error preparing try-on data:', error);
      setIsProcessing(false);
      // Можно добавить toast уведомление об ошибке
    }
  };

  const canContinue = uploadedImages.person && uploadedImages.clothing;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Custom scrollbar styles */}
      <style>{`
        .scrollable-content {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .scrollable-content::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-gray-300 transition-colors"
            disabled={isProcessing}
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">Upload Photos</h1>
            <p className="text-gray-400 text-sm">AI needs both photos to create magic</p>
          </div>
          
          <div className="w-6" />
        </div>
        
        {/* Progress indicator */}
        <div className="px-4 pb-4">
          <ProgressIndicator currentStep={1} totalSteps={2} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scrollable-content pt-32 pb-32 px-4 max-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto space-y-8">
          
          {/* Your Photo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EnhancedUploadZone
              type="person"
              title="Your Photo"
              subtitle="Step 1: Upload your photo"
              placeholder="Take your selfie"
              uploadedImage={uploadedImages.person}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              disabled={isProcessing}
            />
          </motion.div>

          {/* Tips for person photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TipsPanel type="person" />
          </motion.div>

          {/* Connection Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center py-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 font-medium">AI combines both</span>
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-6 h-6 text-gray-400" />
            </motion.div>
          </motion.div>

          {/* Clothing Item Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnhancedUploadZone
              type="clothing"
              title="Clothing Item"
              subtitle="Step 2: Choose outfit to try"
              placeholder="Choose outfit to try"
              uploadedImage={uploadedImages.clothing}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              disabled={isProcessing}
            />
          </motion.div>

          {/* Tips for clothing photos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TipsPanel type="clothing" />
          </motion.div>

          {/* Garment Description Input */}
          {canContinue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-medium">Describe the style (optional)</h3>
              </div>
              <input
                type="text"
                value={garmentDescription}
                onChange={(e) => setGarmentDescription(e.target.value)}
                placeholder="e.g., elegant evening wear, casual summer outfit, business attire"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={isProcessing}
              />
              <p className="text-gray-500 text-sm">
                Help AI understand the style you want to achieve
              </p>
            </motion.div>
          )}

          {/* Browse Catalog Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button 
              className="w-full p-6 border border-gray-700 rounded-2xl bg-gray-900/30 hover:bg-gray-800/50 transition-all duration-300 group"
              disabled={isProcessing}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium">Browse Our Catalog</h3>
                    <p className="text-gray-400 text-sm">Choose from thousands of items</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* AI Processing Info */}
          {canContinue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-2xl p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-white font-medium">AI Processing Info</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Advanced neural networks will analyze both images</p>
                <p>• Generation typically takes 30-60 seconds</p>
                <p>• Multiple style variations will be created</p>
                <p>• High-quality 1024x1024 resolution output</p>
              </div>
            </motion.div>
          )}

          {/* Spacing for fixed button */}
          <div className="h-20" />
        </div>
      </div>

      {/* Fixed Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        <motion.button
          onClick={handleContinue}
          disabled={!canContinue || isProcessing}
          className={`
            w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300
            ${canContinue && !isProcessing
              ? 'bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          whileHover={canContinue && !isProcessing ? { scale: 1.02 } : {}}
          whileTap={canContinue && !isProcessing ? { scale: 0.98 } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
              <span>Preparing...</span>
            </div>
          ) : (
            <>
              Start AI Generation
              {canContinue && (
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              )}
            </>
          )}
        </motion.button>
        
        {!canContinue && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-gray-500 text-sm mt-3"
          >
            Upload both photos to continue
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default UploadPage; 