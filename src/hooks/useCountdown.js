import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (initialTime = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startCountdown = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pauseCountdown = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resetCountdown = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(false);
    setIsPaused(false);
  }, [initialTime]);

  const stopCountdown = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  // Форматирование времени в MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    isPaused,
    startCountdown,
    pauseCountdown,
    resetCountdown,
    stopCountdown,
    isFinished: timeLeft === 0
  };
}; 