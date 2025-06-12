import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, User, Shirt, ChevronDown, CheckCircle } from "lucide-react";
import imageConverter from "../services/imageConverter";
import { useTheme } from "../contexts/ThemeContext";
import userImageStorage from "../services/userImageStorage";

const UploadPage = ({ onBack, onContinue, onNavigation }) => {
  const { isDark } = useTheme();
  const [uploadedPersonPhoto, setUploadedPersonPhoto] = useState(null);
  const [uploadedOutfitPhoto, setUploadedOutfitPhoto] = useState(null);

  const [processingStates, setProcessingStates] = useState({ person: false, outfit: false });
  const [showGuideModal, setShowGuideModal] = useState(false);

  const personInputRef = useRef(null);
  const outfitInputRef = useRef(null);

  // Загружаем последние использованные изображения при монтировании компонента
  useEffect(() => {
    const loadLastUsedImages = () => {
      console.log('🔄 Загружаем последние использованные изображения...');
      
      // Загружаем последнее фото пользователя
      const lastPersonImage = userImageStorage.getLastUsedImage('person');
      if (lastPersonImage && !uploadedPersonPhoto) {
        console.log('📸 Найдено последнее фото пользователя:', lastPersonImage);
        setUploadedPersonPhoto({
          url: lastPersonImage.url,
          name: lastPersonImage.name,
          isProcessed: true,
          fromStorage: true
        });
      }

      // Загружаем последнее фото одежды
      const lastOutfitImage = userImageStorage.getLastUsedImage('outfit');
      if (lastOutfitImage && !uploadedOutfitPhoto) {
        console.log('👕 Найдено последнее фото одежды:', lastOutfitImage);
        setUploadedOutfitPhoto({
          url: lastOutfitImage.url,
          name: lastOutfitImage.name,
          isProcessed: true,
          fromStorage: true
        });
      }
    };

    loadLastUsedImages();
  }, [uploadedPersonPhoto, uploadedOutfitPhoto]); // Добавляем зависимости

  const handlePhotoUpload = async (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

        setProcessingStates(prev => ({ ...prev, [type]: true }));
    try {
      const processedFile = await imageConverter.processImage(file);
      const url = URL.createObjectURL(processedFile);
          const imageData = {
            file: processedFile,
        url: url,
            name: processedFile.name,
        isProcessed: processedFile !== file,
          };

      // Сохраняем изображение в storage
      const savedImage = userImageStorage.saveImage(imageData, type);
      if (savedImage) {
        console.log(`✅ ${type} изображение сохранено в storage:`, savedImage.id);
      }
          
      if (type === "person") {
            setUploadedPersonPhoto(imageData);
          } else {
            setUploadedOutfitPhoto(imageData);
          }
      } catch (error) {
        console.error(`❌ Ошибка обработки ${type} изображения:`, error);
      // Fallback with original file
      const url = URL.createObjectURL(file);
      const imageData = { file: file, url: url, name: file.name, isProcessed: false };
      
      // Сохраняем изображение в storage (fallback)
      const savedImage = userImageStorage.saveImage(imageData, type);
      if (savedImage) {
        console.log(`✅ ${type} изображение (fallback) сохранено в storage:`, savedImage.id);
      }
      
      if (type === "person") setUploadedPersonPhoto(imageData);
      else setUploadedOutfitPhoto(imageData);
    } finally {
          setProcessingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleContinue = () => {
    if (uploadedPersonPhoto && uploadedOutfitPhoto) {
      onContinue({
        personImage: uploadedPersonPhoto,
        outfitImage: uploadedOutfitPhoto,
      });
    }
  };

  const UploadBox = ({ type, uploadedPhoto, processing, onUploadClick, gradientClass }) => {
    const isPerson = type === 'person';
    const title = isPerson ? "Your Photo" : "Outfit Photo";
    const Icon = isPerson ? User : Shirt;
    const buttonText = isPerson ? "Upload Your Image" : "Upload Clothing";



    return (
      <motion.div
        className={`rounded-3xl p-6 w-full text-center relative overflow-hidden group ${
          isDark 
            ? 'glass-upload-card-dark' 
            : 'glass-upload-card-light'
        }`}
        whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
      >
        {uploadedPhoto ? (
          <div className="relative">
            <motion.img
              src={uploadedPhoto.url}
              alt={title}
              className="w-full h-48 object-contain rounded-2xl mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            {uploadedPhoto.isProcessed && (
              <motion.div 
                className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <CheckCircle size={14} className="mr-1 text-green-400" />
                Optimized
              </motion.div>
            )}
            <h3 className={`font-bold text-xl mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>{title}</h3>
            <button
              onClick={onUploadClick}
              disabled={processing}
              className={`w-full py-3 rounded-xl font-medium transition-colors touch-manipulation ${
                isDark 
                  ? 'bg-black/20 hover:bg-black/40 border border-white/20 text-white' 
                  : 'bg-white/30 hover:bg-white/50 border border-white/40 text-gray-800'
              }`}
            >
              {processing ? 'Processing...' : 'Change Photo'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48">
             <motion.div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border-2 border-dashed transition-colors duration-300 ${
                isDark 
                  ? 'bg-black/20 border-white/30 group-hover:border-white/70' 
                  : 'bg-white/20 border-gray-500/40 group-hover:border-gray-700/60'
              }`}
            >
              {processing ? (
                <motion.div
                  className={`w-8 h-8 border-4 border-t-transparent rounded-full ${
                    isDark ? 'border-white' : 'border-gray-700'
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Icon size={32} className={`transition-colors duration-300 ${
                  isDark 
                    ? 'text-white/70 group-hover:text-white' 
                    : 'text-gray-600 group-hover:text-gray-800'
                }`} />
              )}
            </motion.div>
            <h3 className={`font-bold text-xl mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>{title}</h3>
             <button
              onClick={onUploadClick}
              disabled={processing}
              className={`w-full py-3 rounded-xl font-medium transition-colors touch-manipulation mt-4 ${
                isDark 
                  ? 'bg-black/20 hover:bg-black/40 border border-white/20 text-white' 
                  : 'bg-white/30 hover:bg-white/50 border border-white/40 text-gray-800'
              }`}
            >
              {processing ? 'Processing...' : buttonText}
            </button>
          </div>
        )}
      </motion.div>
    );
  };
  
  const Examples = () => (
    <div className="mt-8">
      <h3 className={`text-xl font-bold mb-4 text-center ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>Examples</h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { src: '/assets/images/modelphoto.png', label: 'Model Photo' },
          { src: '/assets/images/combination.png', label: 'Combination' },
          { src: '/assets/images/singleitem.png', label: 'Single Item' },
        ].map((example, index) => (
          <div key={index} className="text-center">
            <img src={example.src} alt={example.label} className="rounded-lg aspect-square object-cover" />
            <div className="flex items-center justify-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className={`text-xs font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>{example.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col w-full overflow-hidden ${
      isDark ? 'gradient-bg' : 'gradient-bg-light'
    }`}>
        {/* Header with theme adaptation */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b safe-area-top ${
              isDark 
                ? 'bg-gray-900/80 border-gray-700/50' 
                : 'bg-white/80 border-gray-200'
            }`}
        >
            <div className="max-w-mobile mx-auto px-4 py-3 pt-safe">
                <div className="flex items-center justify-between">
                    <motion.button 
                        onClick={onBack}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDark 
                            ? 'bg-gray-700/60 hover:bg-gray-600/80' 
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <X size={20} className={isDark ? 'text-gray-200' : 'text-gray-700'} />
                    </motion.button>
                    <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upload Images</h1>
                    <motion.button 
                        onClick={() => setShowGuideModal(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isDark 
                            ? 'bg-gray-700/60 hover:bg-gray-600/80' 
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <HelpCircle size={20} className={isDark ? 'text-gray-200' : 'text-gray-700'} />
                    </motion.button>
                </div>
            </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-24 pb-40 px-4">
            <div className="max-w-mobile mx-auto">
                <div className="space-y-6">
                    <UploadBox
                        type="person"
                        uploadedPhoto={uploadedPersonPhoto}
                        processing={processingStates.person}
                        onUploadClick={() => personInputRef.current?.click()}
                        gradientClass="bg-gradient-to-br from-indigo-500 to-purple-600"
                    />
                    <div className="flex justify-center">
                        <ChevronDown size={24} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <UploadBox
                        type="outfit"
                        uploadedPhoto={uploadedOutfitPhoto}
                        processing={processingStates.outfit}
                        onUploadClick={() => outfitInputRef.current?.click()}
                        gradientClass="bg-gradient-to-r from-neon-green to-teal-400"
                    />
                </div>
                {!uploadedOutfitPhoto && <Examples />}
            </div>
        </div>

        {/* Hidden file inputs */}
        <input id="person-upload" ref={personInputRef} type="file" accept="image/*" onChange={(e) => handlePhotoUpload('person', e)} className="hidden" />
        <input id="outfit-upload" ref={outfitInputRef} type="file" accept="image/*" onChange={(e) => handlePhotoUpload('outfit', e)} className="hidden" />
        
        {/* Footer with theme adaptation */}
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t pb-safe z-50 ${
              isDark 
                ? 'bg-gray-900/90 border-gray-700/50' 
                : 'bg-white/90 border-gray-200'
            }`}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
            <div className="max-w-mobile mx-auto px-4 py-4">
                <motion.button
                    onClick={() => {
                      console.log('Next button clicked', { uploadedPersonPhoto, uploadedOutfitPhoto, processingStates });
                      handleContinue();
                    }}
                    disabled={!uploadedPersonPhoto || !uploadedOutfitPhoto || processingStates.person || processingStates.outfit}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      uploadedPersonPhoto && uploadedOutfitPhoto && !processingStates.person && !processingStates.outfit
                        ? isDark 
                          ? 'bg-gradient-to-r from-neon-green to-teal-400 text-white cursor-pointer'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-pointer shadow-lg'
                        : isDark
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Next
                </motion.button>
            </div>
        </motion.div>

        {/* Guide Modal */}
    <AnimatePresence>
      {showGuideModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
          onClick={() => setShowGuideModal(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-4 border-b border-gray-100">
              {/* Drag indicator */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Гайд по фотосъемке
                    </h2>
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="w-10 h-10 bg-white-100 rounded-full flex items-center justify-center touch-manipulation"
                >
                  <X size={18} className="text-gray-800" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-4 py-4 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="space-y-6">
                {/* Фото человека */}
                <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Ваше фото
                      </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            Снимайте в полный рост или по пояс
                          </p>
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
                          <p className="text-sm text-gray-700">
                            Стойте прямо, руки по бокам
                          </p>
                    </div>
                  </div>
                </div>

                {/* Фото одежды */}
                <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Фото одежды
                      </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            Одежда должна быть хорошо видна
                          </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            Можно снимать на вешалке или модели
                          </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            Избегайте складок и теней
                          </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            Нейтральный фон предпочтителен
                          </p>
                    </div>
                  </div>
                </div>

                {/* Примеры */}
                <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Примеры
                      </h3>
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
    </div>
  );
};

export default UploadPage; 
