// Типы для главной страницы TryOn AI

export const RECOMMENDATION_TYPES = {
  OUTFIT: 'outfit',
  STYLE: 'style',
  COLOR: 'color'
};

export const ACTION_TYPES = {
  WARDROBE: 'wardrobe',
  SUGGESTIONS: 'suggestions',
  CAMERA: 'camera',
  HISTORY: 'history'
};

// Примеры данных для разработки
export const mockRecommendations = [
  {
    id: 1,
    title: 'Summer Vibes',
    description: 'Light and breezy outfit',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop',
    type: RECOMMENDATION_TYPES.OUTFIT,
    confidence: 95
  },
  {
    id: 2,
    title: 'Business Casual',
    description: 'Professional yet comfortable',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop',
    type: RECOMMENDATION_TYPES.STYLE,
    confidence: 88
  },
  {
    id: 3,
    title: 'Evening Elegance',
    description: 'Perfect for dinner dates',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=400&fit=crop',
    type: RECOMMENDATION_TYPES.OUTFIT,
    confidence: 92
  }
];

export const mockStats = {
  totalTryOns: 47,
  favoriteStyles: 12,
  savedOutfits: 23
};

export const mockUserData = {
  name: 'Shamil',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  recentTryOns: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&h=60&fit=crop',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=60&h=60&fit=crop'
  ]
}; 