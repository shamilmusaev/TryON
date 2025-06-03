// Типы для страницы AI обработки TryOn AI

// Processing states
export const PROCESSING_STATES = {
  ANALYZING: 'analyzing',
  MERGING: 'merging', 
  ENHANCING: 'enhancing',
  COMPLETED: 'completed'
};

// Processing step interface
export const PROCESSING_STEPS = [
  {
    id: 'analyzing',
    title: 'Analyzing Photos',
    description: 'Feature extraction complete',
    progress: { min: 0, max: 30 },
    duration: 8000, // 8 seconds
    icon: '🔍'
  },
  {
    id: 'merging',
    title: 'Merging Images',
    description: 'Applying style transfer...',
    progress: { min: 30, max: 70 },
    duration: 12000, // 12 seconds
    icon: '🔄'
  },
  {
    id: 'enhancing',
    title: 'Enhancing Details',
    description: 'Awaiting previous step',
    progress: { min: 70, max: 100 },
    duration: 10000, // 10 seconds
    icon: '✨'
  }
];

// Processing status
export const PROCESSING_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// AI Model information
export const AI_MODEL_INFO = {
  name: 'ChimeraNet v3.1',
  version: '3.1.0',
  description: 'Advanced neural network for virtual try-on',
  accuracy: '95%'
};

// Particle types for animation
export const PARTICLE_TYPES = {
  SPARK: 'spark',
  GLOW: 'glow', 
  CONNECT: 'connect',
  FLOAT: 'float'
};

// Animation presets
export const ANIMATION_PRESETS = {
  GENTLE: {
    duration: 2000,
    ease: 'easeInOut',
    intensity: 0.5
  },
  DYNAMIC: {
    duration: 1000,
    ease: 'easeOut',
    intensity: 1.0
  },
  PREMIUM: {
    duration: 1500,
    ease: 'anticipate',
    intensity: 0.8
  }
};

// Интерфейс для этапов обработки
export const processingTimeline = [
  {
    id: 1,
    step: PROCESSING_STEPS.ANALYZING,
    title: 'Analyzing Photos',
    description: 'Feature extraction complete',
    icon: '✓',
    progressRange: [0, 30],
    duration: 8000 // 8 секунд
  },
  {
    id: 2,
    step: PROCESSING_STEPS.MERGING,
    title: 'Merging Images', 
    description: 'Applying style transfer...',
    icon: '🔄',
    progressRange: [30, 70],
    duration: 15000 // 15 секунд
  },
  {
    id: 3,
    step: PROCESSING_STEPS.ENHANCING,
    title: 'Enhancing Details',
    description: 'Awaiting previous step',
    icon: '⚡',
    progressRange: [70, 100],
    duration: 7000 // 7 секунд
  }
];

// Моковые данные для обработки
export const mockProcessingData = {
  userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face',
  clothingPhoto: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop',
  aiModel: 'ChimeraNet v3.1',
  estimatedTime: 30, // секунды
  insights: {
    title: 'AI Insights',
    description: 'Our advanced AI is meticulously blending facial structures, skin tones, and stylistic elements from both source images. Expect a harmonized and high-fidelity result.'
  },
  stats: [
    {
      id: 'accuracy',
      icon: '🎯',
      value: '99.2%',
      label: 'Accuracy'
    },
    {
      id: 'processing',
      icon: '⚡',
      value: '4.8x',
      label: 'Speed'
    },
    {
      id: 'quality',
      icon: '💎',
      value: '4K',
      label: 'Quality'
    }
  ]
};

// Конфигурация анимаций
export const ANIMATION_CONFIG = {
  particles: {
    count: 12,
    speed: 0.5,
    size: { min: 2, max: 4 }
  },
  sparkles: {
    count: 8,
    duration: 2000,
    delay: 300
  },
  progress: {
    duration: 1000,
    easing: 'easeInOut'
  }
};

// Цветовая схема для этапов
export const STEP_COLORS = {
  [PROCESSING_STEPS.ANALYZING]: '#8b5cf6', // purple
  [PROCESSING_STEPS.MERGING]: '#00ff88',   // neon green  
  [PROCESSING_STEPS.ENHANCING]: '#f59e0b'  // amber
}; 