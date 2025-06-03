// Типы для страницы результата AI Try-On

export const RESULT_ACTIONS = {
  FAVORITE: 'favorite',
  SHARE: 'share',
  DOWNLOAD: 'download',
  SAVE_LOOK: 'save_look',
  ADD_TO_WARDROBE: 'add_to_wardrobe'
};

export const STYLE_CATEGORIES = {
  BUSINESS_CASUAL: 'Business Casual',
  SUMMER_VIBES: 'Summer Vibes',
  EVENING_ELEGANCE: 'Evening Elegance',
  STREET_STYLE: 'Street Style',
  FORMAL_WEAR: 'Formal Wear'
};

// Структура AI результата
export const aiResultExample = {
  id: 'ai-result-001',
  imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop',
  itemName: 'Oversized Blazer',
  category: STYLE_CATEGORIES.BUSINESS_CASUAL,
  confidence: 98,
  currentVariation: 1,
  totalVariations: 4,
  availableColors: [
    { id: 1, name: 'Navy', hex: '#1a237e' },
    { id: 2, name: 'Black', hex: '#000000' },
    { id: 3, name: 'Charcoal', hex: '#424242' },
    { id: 4, name: 'Burgundy', hex: '#880e4f' },
    { id: 5, name: 'Emerald', hex: '#00695c' },
    { id: 6, name: 'Cream', hex: '#f5f5dc' }
  ],
  selectedColorId: 1,
  isFavorite: false,
  isInWardrobe: false
};

// Моковые данные для всех вариаций
export const mockAIResults = [
  {
    ...aiResultExample,
    id: 'variation-1',
    imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop',
    currentVariation: 1
  },
  {
    ...aiResultExample,
    id: 'variation-2',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
    currentVariation: 2,
    itemName: 'Classic Blazer',
    confidence: 95
  },
  {
    ...aiResultExample,
    id: 'variation-3',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
    currentVariation: 3,
    itemName: 'Structured Blazer',
    confidence: 92
  },
  {
    ...aiResultExample,
    id: 'variation-4',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    currentVariation: 4,
    itemName: 'Cropped Blazer',
    confidence: 89
  }
];

// Конфигурация UI
export const UI_CONFIG = {
  swipeThreshold: 50,
  zoomLimits: { min: 1, max: 3 },
  animationDuration: 300,
  infoPanelHeight: '30%',
  floatingControlsMargin: 20
};

// Конфиденность цветовой схемы
export const CONFIDENCE_COLORS = {
  high: '#00ff88', // 90-100%
  medium: '#ffa726', // 70-89%
  low: '#ef5350' // <70%
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return CONFIDENCE_COLORS.high;
  if (confidence >= 70) return CONFIDENCE_COLORS.medium;
  return CONFIDENCE_COLORS.low;
}; 