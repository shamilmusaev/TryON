// Upload types and constants
export const UPLOAD_TYPES = {
  USER_PHOTO: 'user_photo',
  CLOTHING_ITEM: 'clothing_item'
};

export const UPLOAD_SOURCES = {
  CAMERA: 'camera',
  GALLERY: 'gallery',
  CATALOG: 'catalog'
};

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 15 * 1024 * 1024, // 15MB (увеличено для HEVC файлов)
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  MIN_RESOLUTION: { width: 480, height: 640 },
  MAX_RESOLUTION: { width: 4096, height: 4096 }
};

export const UPLOAD_ZONES = {
  USER_PHOTO: {
    id: 'user_photo',
    title: 'Your Photo',
    subtitle: 'Take your selfie',
    description: 'Face camera directly',
    icon: '👤',
    borderColor: 'border-neon-green',
    accentColor: 'neon-green',
    bgColor: 'bg-neon-green/5',
    tips: [
      'Face the camera directly',
      'Good lighting is important',
      'Stand against a plain background',
      'Show your full upper body'
    ]
  },
  CLOTHING_ITEM: {
    id: 'clothing_item',
    title: 'Clothing Item',
    subtitle: 'Choose outfit to try',
    description: 'Clear background works best',
    icon: '👗',
    borderColor: 'border-orange-400',
    accentColor: 'orange-400',
    bgColor: 'bg-orange-400/5',
    tips: [
      'Use clear, well-lit photos',
      'Plain background preferred',
      'Show the complete garment',
      'Avoid wrinkles and shadows'
    ]
  }
};

export const mockCatalogItems = [
  {
    id: 1,
    name: 'Black T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    category: 'T-Shirts',
    brand: 'TryOn Studio'
  },
  {
    id: 2,
    name: 'Blue Denim Jacket',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop',
    category: 'Jackets',
    brand: 'TryOn Studio'
  },
  {
    id: 3,
    name: 'White Hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    category: 'Hoodies',
    brand: 'TryOn Studio'
  },
  {
    id: 4,
    name: 'Red Dress',
    image: 'https://images.unsplash.com/photo-1566479179817-c5e97a33b3e4?w=300&h=400&fit=crop',
    category: 'Dresses',
    brand: 'TryOn Studio'
  }
];

export const UPLOAD_TIPS = {
  GENERAL: [
    'Ensure good lighting for best results',
    'Keep backgrounds simple and uncluttered',
    'Use high-resolution images when possible',
    'Make sure the subject is clearly visible'
  ],
  USER_PHOTO: [
    'Stand 2-3 feet away from camera',
    'Look directly at the camera',
    'Wear fitted clothes for accurate sizing',
    'Neutral pose with arms at your sides'
  ],
  CLOTHING_ITEM: [
    'Lay flat or hang the garment properly',
    'Capture the full item in frame',
    'Use natural lighting when possible',
    'Avoid busy backgrounds or patterns'
  ]
}; 