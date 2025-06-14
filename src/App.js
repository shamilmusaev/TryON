import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import './index.css';
import OnboardingPage from './components/OnboardingPage';
import HomePage from './components/HomePage';
import ProcessingPage from './components/ProcessingPage';
import ResultPage from './components/ResultPage';


function AppContent() {
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState('home'); // home, processing, result, onboarding, wardrobe
  const [tryOnData, setTryOnData] = useState(null); // Данные для генерации
  const [resultData, setResultData] = useState(null); // Результаты генерации

  // Оптимизация для Safari iOS
  useEffect(() => {
    // Фиксируем высоту viewport для iOS Safari
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Предотвращаем zoom на double tap в Safari
    let lastTouchEnd = 0;
    const preventZoom = (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    
    document.addEventListener('touchend', preventZoom, { passive: false });

    // Устанавливаем theme-color для Safari
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#000000';
      document.head.appendChild(meta);
    }

    // Добавляем meta для полноэкранного режима
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  // Навигационные обработчики
  const handleNavigation = (page, data = null) => {
    console.log(`📱 Navigating to: ${page}`, data ? '(with data)' : '');
    
    if (data) {
      if (page === 'processing') {
        setTryOnData(data);
      } else if (page === 'result') {
        setResultData(data);
      }
    }
    
    setCurrentView(page);
  };

  // Начало процесса try-on
  const handleStartTryOn = () => {
    // Эта функция больше не нужна, так как загрузка происходит на главной странице
    // Оставляем ее пустой или удаляем, если она больше нигде не используется
  };



  // Завершение обработки и переход к результату
  const handleProcessingComplete = (generationResult) => {
    console.log('✅ Processing complete, showing result...', generationResult);
    handleNavigation('result', generationResult);
  };

  // Возврат на предыдущую страницу
  const handleBack = () => {
    switch (currentView) {
      case 'processing':
      case 'result':
      case 'onboarding':
      case 'wardrobe':
        handleNavigation('home');
        break;
      default:
        handleNavigation('home');
    }
  };

  // Рендер текущей страницы
  const renderCurrentPage = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onStartProcessing={handleStartTryOn}
            onNavigation={handleNavigation}
          />
        );

      case 'processing':
        return (
          <ProcessingPage
            onBack={handleBack}
            onComplete={handleProcessingComplete}
            tryOnData={tryOnData}
          />
        );

      case 'result':
        return (
          <ResultPage
            onBack={handleBack}
            onNavigation={handleNavigation}
            resultData={resultData}
          />
        );



      case 'onboarding':
        return (
          <OnboardingPage
            onBack={handleBack}
            onNavigation={handleNavigation}
          />
        );

      default:
        return (
          <HomePage
            onStartProcessing={handleStartTryOn}
            onNavigation={handleNavigation}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden transition-all duration-500 ${
      isDark 
        ? 'gradient-bg text-white' 
        : 'gradient-bg-light text-primary-light'
    }`}>
      {/* Page transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>

      {/* Global error boundary */}
      {/* Можно добавить ErrorBoundary компонент здесь */}
      
      {/* Service worker для offline support */}
      {/* Можно добавить PWA функционал */}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 