import { useState, useEffect, useCallback, useRef } from 'react';
import { PROCESSING_STEPS, PROCESSING_STATES } from '../types/processing.types';

export const useProcessingAnimation = (options = {}) => {
  const {
    totalDuration = 30000, // 30 seconds total
    onComplete,
    onStepChange,
    autoStart = true
  } = options;

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState(PROCESSING_STATES.ANALYZING);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const startTime = useRef(null);
  const animationFrame = useRef(null);

  // Вычисляем текущий этап на основе прогресса
  const getCurrentStep = useCallback((progressValue) => {
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      const step = PROCESSING_STEPS[i];
      if (progressValue >= step.progress.min && progressValue <= step.progress.max) {
        return i;
      }
    }
    return PROCESSING_STEPS.length - 1;
  }, []);

  // Анимация прогресса
  const updateProgress = useCallback(() => {
    if (!startTime.current || !isRunning) return;

    const elapsed = Date.now() - startTime.current;
    const progressValue = Math.min((elapsed / totalDuration) * 100, 100);
    
    setProgress(progressValue);

    const newStep = getCurrentStep(progressValue);
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
      
      // Обновляем состояние
      if (newStep < PROCESSING_STEPS.length) {
        setCurrentState(PROCESSING_STEPS[newStep].id);
        onStepChange?.(newStep, PROCESSING_STEPS[newStep]);
      }
    }

    if (progressValue >= 100) {
      setCurrentState(PROCESSING_STATES.COMPLETED);
      setIsRunning(false);
      setIsCompleted(true);
      
      // Ждем 2 секунды после завершения, затем вызываем onComplete
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } else {
      animationFrame.current = requestAnimationFrame(updateProgress);
    }
  }, [isRunning, totalDuration, currentStep, getCurrentStep, onComplete, onStepChange]);

  // Запуск анимации
  const start = useCallback(() => {
    startTime.current = Date.now();
    setIsRunning(true);
    setProgress(0);
    setCurrentStep(0);
    setCurrentState(PROCESSING_STEPS[0].id);
    setIsCompleted(false);
    
    // Запускаем анимацию
    animationFrame.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  // Остановка анимации
  const stop = useCallback(() => {
    setIsRunning(false);
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  // Пауза/возобновление
  const pause = useCallback(() => {
    setIsRunning(false);
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (progress < 100) {
      startTime.current = Date.now() - (progress / 100) * totalDuration;
      setIsRunning(true);
      animationFrame.current = requestAnimationFrame(updateProgress);
    }
  }, [progress, totalDuration, updateProgress]);

  // Сброс к начальному состоянию
  const reset = useCallback(() => {
    stop();
    setProgress(0);
    setCurrentStep(0);
    setCurrentState(PROCESSING_STEPS[0].id);
    setIsCompleted(false);
    startTime.current = null;
  }, [stop]);

  // Автозапуск
  useEffect(() => {
    if (autoStart) {
      const timer = setTimeout(() => {
        start();
      }, 500); // Увеличил задержку для лучшей инициализации

      return () => clearTimeout(timer);
    }
  }, [autoStart, start]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // Получение информации о текущем этапе
  const getCurrentStepInfo = useCallback(() => {
    return PROCESSING_STEPS[currentStep] || PROCESSING_STEPS[0];
  }, [currentStep]);

  // Прогресс в рамках текущего этапа
  const getStepProgress = useCallback(() => {
    const stepInfo = getCurrentStepInfo();
    const stepRange = stepInfo.progress.max - stepInfo.progress.min;
    const stepProgress = Math.max(0, progress - stepInfo.progress.min);
    return Math.min((stepProgress / stepRange) * 100, 100);
  }, [progress, getCurrentStepInfo]);

  return {
    // Состояние
    progress,
    currentStep,
    currentState,
    isRunning,
    
    // Информация
    currentStepInfo: getCurrentStepInfo(),
    stepProgress: getStepProgress(),
    totalSteps: PROCESSING_STEPS.length,
    
    // Управление
    start,
    stop,
    pause,
    resume,
    reset,
    
    // Утилиты
    isCompleted,
    timeRemaining: Math.max(0, totalDuration - (isRunning && startTime.current ? Date.now() - startTime.current : 0))
  };
}; 