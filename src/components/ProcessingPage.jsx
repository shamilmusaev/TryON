import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Zap, AlertCircle } from 'lucide-react';
import AIAnimation from './processing/AIAnimation';
import replicateService from '../services/replicate';

const ProcessingPage = ({ onBack, onComplete, tryOnData }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [processingStatus, setProcessingStatus] = useState('starting');
  const [statusMessage, setStatusMessage] = useState('Initializing AI model...');
  const [predictionId, setPredictionId] = useState(null);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const steps = [
    {
      id: 'analyzing',
      title: 'Analyzing Images',
      description: 'AI is studying your photo and clothing item',
      icon: '🔍',
      duration: 15
    },
    {
      id: 'merging',
      title: 'Creating Try-On',
      description: 'Advanced neural networks are generating your result',
      icon: '🔄',
      duration: 25
    },
    {
      id: 'enhancing',
      title: 'Enhancing Quality',
      description: 'Final touches and quality optimization',
      icon: '✨',
      duration: 15
    }
  ];

  const handleSuccess = useCallback((result) => {
    console.log('✅ Try-on generation completed:', result);
    
    setProgress(100);
    setCurrentStep(2);
    setTimeRemaining(0);
    setProcessingStatus('completed');
    setStatusMessage('Try-on generated successfully!');

    // Через 2 секунды переходим к результату
    setTimeout(() => {
      onComplete({
        ...result,
        originalData: tryOnData,
        generatedAt: new Date().toISOString()
      });
    }, 2000);
  }, [onComplete, tryOnData]);

  const handleError = useCallback((error) => {
    console.error('❌ Try-on generation failed:', error);
    setError(error.message || 'Generation failed');
    setProcessingStatus('failed');
    setStatusMessage('Something went wrong. Please try again.');
  }, []);

  const startGeneration = useCallback(async () => {
    try {
      console.log('🚀 Starting real try-on generation...');
      
      const generation = await replicateService.generateTryOn(
        tryOnData.personImage,
        tryOnData.clothingImage,
        tryOnData.garmentDescription
      );

      setPredictionId(generation.id);
      
      // Ожидаем завершения с отслеживанием прогресса
      generation.wait(handleProgress).then(handleSuccess).catch(handleError);
      
    } catch (error) {
      handleError(error);
    }
  }, [tryOnData, handleSuccess, handleError]);

  // Запуск генерации при монтировании компонента
  useEffect(() => {
    if (tryOnData && !predictionId && !error) {
      startGeneration();
    }
  }, [tryOnData, predictionId, error, startGeneration]);

  const handleProgress = (newProgress, status, message) => {
    setProgress(newProgress);
    setProcessingStatus(status);
    setStatusMessage(message);
    
    // Обновляем текущий шаг на основе прогресса
    if (newProgress <= 20) {
      setCurrentStep(0);
      setTimeRemaining(Math.max(45, 60 - Math.floor(newProgress * 0.6)));
    } else if (newProgress <= 70) {
      setCurrentStep(1);
      setTimeRemaining(Math.max(15, 40 - Math.floor(newProgress * 0.4)));
    } else {
      setCurrentStep(2);
      setTimeRemaining(Math.max(0, 10 - Math.floor((newProgress - 70) * 0.3)));
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    setProgress(0);
    setCurrentStep(0);
    setTimeRemaining(60);
    setProcessingStatus('starting');
    setStatusMessage('Retrying generation...');
    setPredictionId(null);
    
    setTimeout(() => {
      setIsRetrying(false);
      startGeneration();
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getAIState = () => {
    if (error) return 'error';
    if (currentStep === 0) return 'analyzing';
    if (currentStep === 1) return 'merging';
    if (currentStep === 2) return 'enhancing';
    return 'analyzing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          disabled={processingStatus === 'completed'}
        >
          <ArrowLeft size={20} />
        </motion.button>

        <div className="text-center">
          <h1 className="text-xl font-bold">AI Try-On</h1>
          <p className="text-gray-400 text-sm">
            {error ? 'Generation Failed' : 'Creating your perfect look'}
          </p>
        </div>

        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        
        {/* AI Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <AIAnimation 
            progress={progress}
            currentState={getAIState()}
            isActive={!error && processingStatus !== 'completed'}
          />
        </motion.div>

        {/* Progress Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: error ? 0 : 360 }}
              transition={{ duration: 2, repeat: error ? 0 : Infinity, ease: "linear" }}
            >
              {error ? (
                <AlertCircle className="w-6 h-6 text-red-400" />
              ) : (
                <Zap className="w-6 h-6 text-green-400" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold">
              {error ? 'Generation Failed' : steps[currentStep]?.title || 'Processing'}
            </h2>
          </div>

          <p className="text-gray-400 text-lg mb-4">
            {error ? error : statusMessage}
          </p>

          {!error && (
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400">
                  {formatTime(timeRemaining)} remaining
                </span>
              </div>
              <div className="text-gray-500">|</div>
              <div className="text-gray-400">
                {progress.toFixed(0)}% complete
              </div>
            </div>
          )}
        </motion.div>

        {/* Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`
                    flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300
                    ${status === 'active' ? 'bg-green-500/10 border border-green-500/30' : ''}
                    ${status === 'completed' ? 'bg-green-500/5 border border-green-500/20' : ''}
                    ${status === 'pending' ? 'bg-gray-800/30 border border-gray-700/30' : ''}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${status === 'active' ? 'bg-green-500 text-black' : ''}
                    ${status === 'completed' ? 'bg-green-500 text-black' : ''}
                    ${status === 'pending' ? 'bg-gray-700 text-gray-400' : ''}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className={`
                      font-semibold
                      ${status === 'active' ? 'text-white' : ''}
                      ${status === 'completed' ? 'text-green-400' : ''}
                      ${status === 'pending' ? 'text-gray-400' : ''}
                    `}>
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {step.description}
                    </p>
                  </div>

                  {status === 'active' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 bg-green-400 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Error Actions */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  <span>Retrying...</span>
                </div>
              ) : (
                'Try Again'
              )}
            </motion.button>

            <button
              onClick={onBack}
              className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-2xl transition-colors"
            >
              Back to Upload
            </button>
          </motion.div>
        )}

        {/* Processing Info Panel */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 w-full max-w-md bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold">AI Insights</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span className="text-white">IDM-VTON v2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolution:</span>
                <span className="text-white">1024×1024px</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Processing:</span>
                <span className="text-green-400">GPU Accelerated</span>
              </div>
              {predictionId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-purple-400 font-mono text-xs">
                    {predictionId.slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Success Animation */}
        <AnimatePresence>
          {processingStatus === 'completed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 1, repeat: Infinity },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-black" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessingPage; 