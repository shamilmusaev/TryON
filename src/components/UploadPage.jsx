import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, User, Shirt } from 'lucide-react';
import ProcessingPage from './ProcessingPage';
import Logo from './common/Logo';
import imageConverter from '../services/imageConverter';

const UploadPage = ({ onBack, onContinue, onNavigation }) => {
  const [uploadedImages, setUploadedImages] = useState({
    person: null,
    outfit: null
  });
  const [dragStates, setDragStates] = useState({
    person: false,
    outfit: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStates, setProcessingStates] = useState({
    person: false,
    outfit: false
  });

  const handleImageUpload = async (type, file) => {
    if (file) {
      try {
        // Показываем состояние обработки
        setProcessingStates(prev => ({ ...prev, [type]: true }));
        
        console.log(`🔄 Начинаю обработку ${type} изображения:`, file.name);
        
        // Конвертация HEIC если необходимо
        let processedFile = await imageConverter.processImage(file);
        
        // Создаем превью
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => ({
            ...prev,
            [type]: {
              file: processedFile,
              originalFile: file, // Сохраняем оригинальный файл
              url: e.target.result,
              name: processedFile.name,
              isProcessed: processedFile !== file
            }
          }));
          
          // Скрываем состояние обработки
          setProcessingStates(prev => ({ ...prev, [type]: false }));
        };
        
        reader.readAsDataURL(processedFile);
        
      } catch (error) {
        console.error(`❌ Ошибка обработки ${type} изображения:`, error);
        
        // В случае ошибки используем оригинальный файл
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => ({
            ...prev,
            [type]: { 
              file: file,
              originalFile: file,
              url: e.target.result,
              name: file.name,
              isProcessed: false
            }
          }));
          
          setProcessingStates(prev => ({ ...prev, [type]: false }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSelect = (type, e) => {
    const file = e.target.files[0];
    handleImageUpload(type, file);
  };

  const handleDrop = (type, e) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [type]: false }));
    const file = e.dataTransfer.files[0];
    handleImageUpload(type, file);
  };

  const handleDragOver = (type, e) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (type) => {
    setDragStates(prev => ({ ...prev, [type]: false }));
  };

  const handleContinue = () => {
    if (uploadedImages.person && uploadedImages.outfit) {
      setIsProcessing(true);
    }
  };

  const handleProcessingBack = () => {
    setIsProcessing(false);
  };

  const handleProcessingComplete = (result) => {
    onContinue(result);
  };

  const canContinue = uploadedImages.person && uploadedImages.outfit;

  // Если идет обработка, показываем ProcessingPage
  if (isProcessing) {
    return (
      <ProcessingPage
        onBack={handleProcessingBack}
        onComplete={handleProcessingComplete}
        tryOnData={{
          personImage: uploadedImages.person,
          outfitImage: uploadedImages.outfit,
          timestamp: Date.now()
        }}
      />
    );
  }

  const UploadZone = ({ type, title, icon: IconComponent, placeholder }) => {
    const isUploaded = uploadedImages[type];
    const isDragOver = dragStates[type];
    const isProcessing = processingStates[type];
    
    return (
      <motion.div
        className={`
          relative w-full h-36 sm:h-48 max-h-48 border-2 border-dashed rounded-xl
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : isUploaded 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
        onDrop={(e) => handleDrop(type, e)}
        onDragOver={(e) => handleDragOver(type, e)}
        onDragLeave={() => handleDragLeave(type)}
        onClick={() => !isProcessing && document.getElementById(`file-input-${type}`).click()}
        whileHover={{ scale: isProcessing ? 1 : 1.01 }}
        whileTap={{ scale: isProcessing ? 1 : 0.99 }}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-blue-600 text-sm mt-3 font-medium">
              Обрабатываю...
            </p>
          </div>
        ) : isUploaded ? (
          <div className="relative w-full h-full">
            <img 
              src={isUploaded.url} 
              alt={`Uploaded ${type}`} 
              className="w-full h-full object-contain rounded-lg bg-gray-50"
            />
            {/* Индикатор обработки */}
            {isUploaded.isProcessed && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                ✓ HEIC → JPG
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white/90 px-3 py-2 rounded-full">
                <span className="text-gray-800 text-xs sm:text-sm font-medium">Tap to change</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Upload Icon */}
            <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-2 sm:mb-4">
              <IconComponent className="w-5 h-5 sm:w-8 sm:h-8 text-gray-500" />
              <Plus className="w-2 h-2 sm:w-4 sm:h-4 text-gray-500 -ml-1 sm:-ml-2 -mt-1 sm:-mt-2" />
            </div>

            {/* Upload Text */}
            <h3 className="text-xs sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2 text-center">
              {title}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm text-center max-w-xs px-2 leading-tight">
              {isDragOver 
                ? 'Drop your image here' 
                : placeholder
              }
            </p>
          </>
        )}

        <input
          id={`file-input-${type}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(type, e)}
          className="hidden"
          disabled={isProcessing}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white safe-area-inset">
      {/* Header - адаптирован для мобильных */}
      <div className="flex items-center px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 pt-safe">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-1 btn-mobile"
        >
          <ArrowLeft size={18} className="sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex-1 text-center px-2 sm:px-4">
          <Logo size="small" className="text-gray-900" />
        </div>
        
        <div className="w-5 sm:w-6" />
      </div>

      <div className="max-w-[320px] sm:max-w-sm mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-safe">
        {/* Upload Zones */}
        <div className="space-y-6 sm:space-y-8 mb-8">
          {/* Person Photo Upload */}
          <div>
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold text-sm sm:text-base">1</span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Photo</h2>
            </div>
            <UploadZone 
              type="person"
              title="Upload Your Photo"
              icon={User}
              placeholder="Take a selfie or upload from gallery"
            />
          </div>

          {/* Outfit Photo Upload */}
          <div>
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-semibold text-sm sm:text-base">2</span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Outfit to Try</h2>
            </div>
            <UploadZone 
              type="outfit"
              title="Upload Outfit Image"
              icon={Shirt}
              placeholder="Upload clothing item or outfit"
            />
          </div>
        </div>

        {/* Examples Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">Examples</h2>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Model Photo */}
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative mb-1 sm:mb-3">
                <img 
                  src="/assets/images/modelphoto.png" 
                  alt="Model" 
                  className="w-full h-16 sm:h-28 object-contain bg-gray-50 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <div className="w-2 h-2 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-gray-700">Model Photo</span>
              </div>
            </motion.div>

            {/* Combination */}
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative mb-1 sm:mb-3">
                <img 
                  src="/assets/images/combination.png" 
                  alt="Combination" 
                  className="w-full h-16 sm:h-28 object-contain bg-gray-50 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <div className="w-2 h-2 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-gray-700">Combination</span>
              </div>
            </motion.div>

            {/* Single Item */}
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative mb-1 sm:mb-3">
                <img 
                  src="/assets/images/singleitem.png" 
                  alt="Single Item" 
                  className="w-full h-16 sm:h-28 object-contain bg-gray-50 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <div className="w-2 h-2 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-gray-700">Single Item</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Continue Button */}
        {canContinue && (
          <motion.button
            onClick={handleContinue}
            className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue with these images
          </motion.button>
        )}

        {/* Helper text */}
        {!canContinue && (
          <div className="text-center text-gray-500 text-xs sm:text-sm mt-4">
            Upload both photos to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage; 