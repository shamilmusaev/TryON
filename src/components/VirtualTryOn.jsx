import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Plus, X, Shirt, Palette, Scissors, Loader } from 'lucide-react';
import heic2any from 'heic2any';
import { useTheme } from '../contexts/ThemeContext';
import imageConverter from '../services/imageConverter';
import userImageStorage from '../services/userImageStorage';

const UploadZone = ({ onDrop, image, title, description, onClear, isUploaded }) => {
  const { isDark } = useTheme();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.heic'] },
    multiple: false,
  });

  const showLoader = image && image.isProcessing;
  const showImage = image && image.url;

  return (
    <div
      {...getRootProps()}
      className={`relative w-1/2 h-48 rounded-2xl border-2 transition-all duration-300 ease-in-out flex items-center justify-center text-center p-4 cursor-pointer overflow-hidden group
        ${isDragActive ? 'border-green-500 scale-105 shadow-2xl' : (isUploaded ? 'border-green-400' : (isDark ? 'border-dashed border-gray-600 hover:border-gray-500' : 'border-dashed border-gray-300 hover:border-gray-400'))}
        ${isUploaded ? (isDark ? 'bg-gray-800/50' : 'bg-gray-100/70') : (isDark ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm')}
      `}
    >
      <input {...getInputProps()} />
      <AnimatePresence>
        {showImage ? (
          <>
            <motion.img
              src={image.url}
              alt="Preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
            {showLoader && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <Loader className="animate-spin text-white" size={32} />
              </div>
            )}
            {!showLoader && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white"
              >
                <X size={16} />
              </motion.button>
            )}
             {!showLoader && (
              <motion.div 
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{delay:0.2}}
                className="absolute bottom-2 left-2 z-10 flex items-center p-1.5 bg-green-500/80 rounded-full text-white text-xs font-bold">
                <CheckCircle size={14} className="mr-1" />
                Uploaded
              </motion.div>
             )}
          </>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 relative z-10"
          >
            {isDragActive ? (
              <motion.div initial={{scale:0.8}} animate={{scale:1}} className="flex flex-col items-center">
                <UploadCloud size={32} className="mb-2 text-green-500" />
                <p className="font-semibold text-green-400">Drop it here!</p>
              </motion.div>
            ) : (
               showLoader ? (
                <div className="flex flex-col items-center">
                  <Loader size={32} className="mb-2 animate-spin" />
                  <p className="font-semibold text-sm">Processing...</p>
                </div>
              ) : (
                <>
                  <div className={`p-3 rounded-full mb-3 transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Plus size={24} />
                  </div>
                  <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</p>
                  <p className="text-xs mt-1">{description}</p>
                </>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryButton = ({ icon, label, onClick, active }) => {
    const {isDark} = useTheme()
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center shadow-md
      ${active 
        ? (isDark ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-emerald-500 text-white shadow-emerald-500/30')
        : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50')}
      `}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </motion.button>
  );
};


const VirtualTryOn = ({ onNavigation, selectedImage }) => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [outfitPhoto, setOutfitPhoto] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (selectedImage) {
      setUserPhoto(selectedImage);
    }
  }, [selectedImage]);

  const handleDrop = async (acceptedFiles, type) => {
    let file = acceptedFiles[0];
    if (!file) return;

    const setter = type === 'user' ? setUserPhoto : setOutfitPhoto;
    const storageType = type === 'user' ? 'person' : 'outfit';

    setter({ name: file.name, isProcessing: true, url: null });

    let tempUrl = null;

    try {
      const isHeic = file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
      if (isHeic) {
        console.log(`HEIC файл обнаружен, начинаю конвертацию: ${file.name}`);
        const conversionResult = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });
        const convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        file = new File([convertedBlob], `${file.name.split('.')[0]}.jpeg`, { type: 'image/jpeg' });
        console.log(`HEIC успешно сконвертирован в JPEG: ${file.name}`);
      }

      tempUrl = URL.createObjectURL(file);
      setter({ url: tempUrl, name: file.name, isProcessing: true });

      const processedFile = await imageConverter.processImage(file);
      const base64Url = await imageConverter.fileToBase64(processedFile);
      
      const finalImageData = {
        file: processedFile,
        url: base64Url,
        name: processedFile.name,
        isProcessed: processedFile !== file,
        isProcessing: false,
      };

      userImageStorage.saveImage(finalImageData, storageType);
      setter(finalImageData);

    } catch (error) {
      console.error(`Ошибка обработки ${type} изображения:`, error);
      setter(null);
    } finally {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
    }
  };

  const onUserDrop = useCallback((acceptedFiles) => {
    handleDrop(acceptedFiles, 'user');
  }, []);

  const onOutfitDrop = useCallback((acceptedFiles) => {
    handleDrop(acceptedFiles, 'outfit');
  }, []);
  
  const clearPhoto = (type) => {
    if (type === 'user') setUserPhoto(null);
    else setOutfitPhoto(null);
  }

  const handleCreateMagic = async () => {
    if (userPhoto && outfitPhoto) {
      setIsProcessing(true);

      try {
        // Убедимся, что оба фото имеют Blob/File объект
        const getFile = async (photo) => {
          if (photo.file) return photo.file;
          // Восстанавливаем Blob из base64 URL
          const response = await fetch(photo.url);
          const blob = await response.blob();
          // Возвращаем как File, чтобы сохранить имя
          return new File([blob], photo.name, { type: blob.type });
        };

        const [userFile, outfitFile] = await Promise.all([
          getFile(userPhoto),
          getFile(outfitPhoto)
        ]);

        onNavigation('result', {
          personImage: { ...userPhoto, file: userFile },
          outfitImage: { ...outfitPhoto, file: outfitFile },
          category: activeCategory || 'upper_body',
        });

      } catch (error) {
        console.error("Ошибка подготовки файлов для генерации:", error);
        // Тут можно показать уведомление об ошибке
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const bothPhotosUploaded = userPhoto && !userPhoto.isProcessing && outfitPhoto && !outfitPhoto.isProcessing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-3xl p-6 mb-8 w-full relative overflow-hidden transition-all duration-300
        ${isDark ? 'bg-gray-800/40 border border-gray-700 shadow-2xl shadow-black/20' : 'bg-white/60 border border-gray-200/80 shadow-2xl shadow-gray-400/20'}
        backdrop-filter backdrop-blur-xl`}
    >
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Create Your Virtual Try-On
          </h2>
          <p className={`text-md transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click to upload photos or drag and drop
          </p>
        </div>

        <div className="flex space-x-4 mb-6">
          <UploadZone
            onDrop={onUserDrop}
            image={userPhoto}
            title="Your Photo"
            description="Upload a full-body photo"
            onClear={() => clearPhoto('user')}
            isUploaded={!!userPhoto}
          />
          <UploadZone
            onDrop={onOutfitDrop}
            image={outfitPhoto}
            title="Outfit Photo"
            description="Upload clothing item"
            onClear={() => clearPhoto('outfit')}
            isUploaded={!!outfitPhoto}
          />
        </div>

        <AnimatePresence>
          {userPhoto && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{duration: 0.4}}
                className="flex justify-center space-x-3 mb-6"
            >
              <CategoryButton label="Upper" icon={<Shirt size={16} />} onClick={() => setActiveCategory('upper_body')} active={activeCategory === 'upper_body'} />
              <CategoryButton label="Lower" icon={<Palette size={16} />} onClick={() => setActiveCategory('lower_body')} active={activeCategory === 'lower_body'} />
              <CategoryButton label="Dress" icon={<Scissors size={16} />} onClick={() => setActiveCategory('dress')} active={activeCategory === 'dress'} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleCreateMagic}
          disabled={!bothPhotosUploaded || !activeCategory || isProcessing}
          className={`w-full py-3.5 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center
            ${!bothPhotosUploaded || !activeCategory || isProcessing
              ? (isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
              : (isDark ? 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white shadow-lg shadow-green-500/20' : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30')
            }
          `}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isProcessing ? "processing" : "ready"}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Starting...
                </>
              ) : (
                 'Create AI Magic ✨'
              )}
            </motion.span>
          </AnimatePresence>

           {bothPhotosUploaded && !isProcessing && (
             <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(45deg, transparent, white, transparent)",
                transform: "skewX(-25deg) translateX(-150%)",
              }}
               animate={{
                x: ["-100%", "200%"],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
            />
           )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VirtualTryOn; 