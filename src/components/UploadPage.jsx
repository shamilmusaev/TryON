import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, User, Plus, ChevronDown } from 'lucide-react';
import ProcessingPage from './ProcessingPage';
import imageConverter from '../services/imageConverter';

const UploadPage = ({ onBack, onContinue, onNavigation }) => {
  const [uploadedPersonPhoto, setUploadedPersonPhoto] = useState(null);
  const [uploadedOutfitPhoto, setUploadedOutfitPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStates, setProcessingStates] = useState({
    person: false,
    outfit: false
  });
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handlePhotoUpload = async (type, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Показываем состояние обработки
        setProcessingStates(prev => ({ ...prev, [type]: true }));
        
        console.log(`🔄 Начинаю обработку ${type} изображения:`, file.name);
        
        // Конвертация HEIC если необходимо
        let processedFile = await imageConverter.processImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file: processedFile,
            originalFile: file,
            url: e.target.result,
            name: processedFile.name,
            isProcessed: processedFile !== file
          };
          
          if (type === 'person') {
            setUploadedPersonPhoto(imageData);
          } else {
            setUploadedOutfitPhoto(imageData);
          }
          
          // Скрываем состояние обработки
          setProcessingStates(prev => ({ ...prev, [type]: false }));
        };
        reader.readAsDataURL(processedFile);
        
      } catch (error) {
        console.error(`❌ Ошибка обработки ${type} изображения:`, error);
        
        // В случае ошибки используем оригинальный файл
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file: file,
            originalFile: file,
            url: e.target.result,
            name: file.name,
            isProcessed: false
          };
          
          if (type === 'person') {
            setUploadedPersonPhoto(imageData);
          } else {
            setUploadedOutfitPhoto(imageData);
          }
          
          setProcessingStates(prev => ({ ...prev, [type]: false }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleContinue = () => {
    if (uploadedPersonPhoto && uploadedOutfitPhoto) {
      setIsProcessing(true);
    }
  };

  const handleProcessingBack = () => {
    setIsProcessing(false);
  };

  const handleProcessingComplete = (result) => {
    onContinue(result);
  };

  // Если идет обработка, показываем ProcessingPage
  if (isProcessing) {
    return (
      <ProcessingPage
        onBack={handleProcessingBack}
        onComplete={handleProcessingComplete}
        tryOnData={{
          personImage: uploadedPersonPhoto,
          outfitImage: uploadedOutfitPhoto,
          timestamp: Date.now()
        }}
      />
    );
  }

  const GuideModal = () => (
    <AnimatePresence>
      {showGuideModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowGuideModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-sm w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Гайд по фотосъемке</h2>
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Фото человека */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ваше фото</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Снимайте в полный рост или по пояс</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Хорошее освещение</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Простой фон</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Стойте прямо, руки по бокам</p>
                    </div>
                  </div>
                </div>

                {/* Фото одежды */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Фото одежды</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Одежда должна быть хорошо видна</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Можно снимать на вешалке или модели</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Избегайте складок и теней</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm text-gray-700">Нейтральный фон предпочтителен</p>
                    </div>
                  </div>
                </div>

                {/* Примеры */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Примеры</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-16 flex items-center justify-center mb-1">
                        <User size={24} className="text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-600">Хорошо</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-16 flex items-center justify-center mb-1">
                        <User size={24} className="text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-600">Отлично</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-16 flex items-center justify-center mb-1">
                        <User size={24} className="text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-600">Идеально</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-white">
            <div className="flex items-center justify-between">
              <button 
                onClick={onBack}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-600" />
              </button>
              
              <h1 className="text-xl font-semibold text-gray-900">Clothing Pairing</h1>
              
              <button 
                onClick={() => setShowGuideModal(true)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <HelpCircle size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Your Photo Section */}
          <div className="px-6 pb-4">
            {uploadedPersonPhoto ? (
              <div className="relative">
                <img 
                  src={uploadedPersonPhoto.url} 
                  alt="Your photo" 
                  className="w-full h-48 object-contain rounded-xl mb-4 bg-gray-50"
                />
                {/* Индикатор обработки HEIC */}
                {uploadedPersonPhoto.isProcessed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✓ HEIC → JPG
                  </div>
                )}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Photo</h2>
                </div>
                <button
                  onClick={() => document.getElementById('person-upload').click()}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
                  disabled={processingStates.person}
                >
                  {processingStates.person ? 'Обрабатываю...' : 'Change photo'}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {processingStates.person ? (
                      <motion.div
                        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <User size={36} className="text-gray-400" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Photo</h2>
                  <p className="text-gray-500 text-sm">Take a selfie or upload from gallery</p>
                </div>

                <button
                  onClick={() => document.getElementById('person-upload').click()}
                  className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors font-medium"
                  disabled={processingStates.person}
                >
                  {processingStates.person ? 'Обрабатываю...' : 'Tap to upload photo'}
                </button>
              </div>
            )}

            <input
              id="person-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload('person', e)}
              className="hidden"
              disabled={processingStates.person}
            />
          </div>
          
          {/* Arrow pointing down */}
          <div className="flex justify-center py-2">
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        {/* Upload Outfit Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mt-4">
          <div className="px-6 py-6">
            {uploadedOutfitPhoto ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={uploadedOutfitPhoto.url} 
                    alt="Outfit" 
                    className="w-32 h-32 object-contain rounded-xl mx-auto mb-4 bg-gray-50"
                  />
                  {/* Индикатор обработки HEIC */}
                  {uploadedOutfitPhoto.isProcessed && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-medium">
                      ✓
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Outfit Image</h2>
                <p className="text-gray-500 text-sm mb-4">Choose clothing item or complete outfit to try on</p>
                <button
                  onClick={() => document.getElementById('outfit-upload').click()}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
                  disabled={processingStates.outfit}
                >
                  {processingStates.outfit ? 'Обрабатываю...' : 'Change outfit'}
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-green-400 rounded-xl p-8 bg-green-50">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                    {processingStates.outfit ? (
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Plus size={24} className="text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Outfit Image</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose clothing item or complete outfit to try on</p>
                  <button
                    onClick={() => document.getElementById('outfit-upload').click()}
                    className="w-full py-4 bg-white border border-green-400 rounded-xl text-green-600 font-medium hover:bg-green-50 transition-colors"
                    disabled={processingStates.outfit}
                  >
                    {processingStates.outfit ? 'Обрабатываю...' : 'Choose from gallery'}
                  </button>
                </div>
              </div>
            )}

            <input
              id="outfit-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload('outfit', e)}
              className="hidden"
              disabled={processingStates.outfit}
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleContinue}
          disabled={!uploadedPersonPhoto || !uploadedOutfitPhoto || processingStates.person || processingStates.outfit}
          className={`w-full py-4 rounded-2xl font-semibold text-lg mt-6 transition-all ${
            uploadedPersonPhoto && uploadedOutfitPhoto && !processingStates.person && !processingStates.outfit
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>

      {/* Guide Modal */}
      <GuideModal />
    </div>
  );
};

export default UploadPage; 