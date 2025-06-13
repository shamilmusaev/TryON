// Типы и константы для страницы онбординга TryOn AI

export const FEATURE_TYPES = {
  PHOTO: 'photo',
  STYLE: 'style', 
  RESULTS: 'results'
};

export const ANIMATION_DELAYS = {
  LOGO: 0.2,
  TITLE: 0.4,
  DESCRIPTION: 0.6,
  FEATURES: 0.8,
  CTA: 1.0
};

// Данные для фич
export const onboardingFeatures = [
  {
    id: 1,
    icon: '📸',
    title: 'One Photo',
    description: 'Upload your photo',
    type: FEATURE_TYPES.PHOTO
  },
  {
    id: 2,
    icon: '🎨',
    title: 'Any Style',
    description: 'Choose clothes',
    type: FEATURE_TYPES.STYLE
  },
  {
    id: 3,
    icon: '⚡',
    title: 'Instant Results',
    description: 'Get AI-generated results',
    type: FEATURE_TYPES.RESULTS
  }
];

// URL фонового изображения split-screen
export const HERO_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1200&fit=crop&crop=faces';

export const SPLIT_IMAGES = {
  LEFT: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=800&fit=crop&crop=face',
  RIGHT: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=800&fit=crop&crop=face'
}; 