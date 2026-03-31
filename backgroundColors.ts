export interface BackgroundColor {
  id: string;
  name: string;
  color: string;
  gradient?: string;
}

export const BACKGROUND_COLORS: BackgroundColor[] = [
  // Solid Colors
  { id: 'default', name: 'Default', color: '#FFFFFF' },
  { id: 'light-blue', name: 'Light Blue', color: '#E3F2FD' },
  { id: 'light-green', name: 'Light Green', color: '#E8F5E8' },
  { id: 'light-yellow', name: 'Light Yellow', color: '#FFF9C4' },
  { id: 'light-pink', name: 'Light Pink', color: '#FCE4EC' },
  { id: 'light-purple', name: 'Light Purple', color: '#F3E5F5' },
  { id: 'light-orange', name: 'Light Orange', color: '#FFF4E6' },
  { id: 'light-red', name: 'Light Red', color: '#FFEBEE' },
  { id: 'light-teal', name: 'Light Teal', color: '#E0F2F1' },
  { id: 'light-indigo', name: 'Light Indigo', color: '#E8EAF6' },
  
  // Gradients
  { 
    id: 'sunset', 
    name: 'Sunset', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #667eea 0%, #4ca1af 100%)'
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
  },
  { 
    id: 'candy', 
    name: 'Candy', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
  },
  { 
    id: 'aurora', 
    name: 'Aurora', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  },
  { 
    id: 'lavender', 
    name: 'Lavender', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  { 
    id: 'peach', 
    name: 'Peach', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  { 
    id: 'sky', 
    name: 'Sky', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  { 
    id: 'mint', 
    name: 'Mint', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
  },
  { 
    id: 'coral', 
    name: 'Coral', 
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  }
];

// Helper functions
export const getBackgroundColorById = (id: string): BackgroundColor | undefined => {
  return BACKGROUND_COLORS.find(color => color.id === id);
};

export const getBackgroundColorsByType = (type: 'solid' | 'gradient'): BackgroundColor[] => {
  return BACKGROUND_COLORS.filter(color => {
    if (type === 'solid') {
      return !color.gradient;
    } else {
      return !!color.gradient;
    }
  });
};
