import { motion } from 'framer-motion';

const ImageViewer = ({ images = [], currentIndex = 0, onSwipe }) => {
  const currentImage = images[currentIndex];
  
  return (
    <motion.div 
      className="relative w-full h-96 bg-gray-900 rounded-2xl overflow-hidden"
      layoutId="image-viewer"
    >
      {currentImage ? (
        <motion.img
          key={currentIndex}
          src={currentImage.url}
          alt={`Result ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p>AI Result</p>
          </div>
        </div>
      )}
      
      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-neon-green' : 'bg-white/50'
              }`}
              onClick={() => onSwipe?.(index)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ImageViewer; 