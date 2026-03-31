export interface Feeling {
  id: string;
  emoji: string;
  label: string;
  category: 'feeling' | 'activity';
}

export const FEELINGS: Feeling[] = [
  // Feelings
  { id: 'feeling-happy', emoji: '😊', label: 'feeling happy', category: 'feeling' },
  { id: 'feeling-loved', emoji: '🥰', label: 'feeling loved', category: 'feeling' },
  { id: 'feeling-excited', emoji: '🤗', label: 'feeling excited', category: 'feeling' },
  { id: 'feeling-blessed', emoji: '😇', label: 'feeling blessed', category: 'feeling' },
  { id: 'feeling-fantastic', emoji: '🤩', label: 'feeling fantastic', category: 'feeling' },
  { id: 'feeling-cool', emoji: '😎', label: 'feeling cool', category: 'feeling' },
  { id: 'feeling-amazing', emoji: '🤯', label: 'feeling amazing', category: 'feeling' },
  { id: 'feeling-great', emoji: '😄', label: 'feeling great', category: 'feeling' },
  { id: 'feeling-sad', emoji: '😢', label: 'feeling sad', category: 'feeling' },
  { id: 'feeling-confused', emoji: '😕', label: 'feeling confused', category: 'feeling' },
  { id: 'feeling-angry', emoji: '😠', label: 'feeling angry', category: 'feeling' },
  { id: 'feeling-anxious', emoji: '😰', label: 'feeling anxious', category: 'feeling' },
  { id: 'feeling-tired', emoji: '😴', label: 'feeling tired', category: 'feeling' },
  { id: 'feeling-sick', emoji: '🤒', label: 'feeling sick', category: 'feeling' },
  { id: 'feeling-proud', emoji: '🥳', label: 'feeling proud', category: 'feeling' },
  { id: 'feeling-grateful', emoji: '🙏', label: 'feeling grateful', category: 'feeling' },
  { id: 'feeling-hopeful', emoji: '🌟', label: 'feeling hopeful', category: 'feeling' },
  { id: 'feeling-thankful', emoji: '💖', label: 'feeling thankful', category: 'feeling' },
  { id: 'feeling-accomplished', emoji: '🏆', label: 'feeling accomplished', category: 'feeling' },
  { id: 'feeling-stressed', emoji: '😓', label: 'feeling stressed', category: 'feeling' },
  { id: 'feeling-overwhelmed', emoji: '😵', label: 'feeling overwhelmed', category: 'feeling' },
  { id: 'feeling-annoyed', emoji: '😤', label: 'feeling annoyed', category: 'feeling' },
  { id: 'feeling-frustrated', emoji: '😤', label: 'feeling frustrated', category: 'feeling' },
  { id: 'feeling-worried', emoji: '😟', label: 'feeling worried', category: 'feeling' },
  { id: 'feeling-lonely', emoji: '😔', label: 'feeling lonely', category: 'feeling' },
  { id: 'feeling-bored', emoji: '🥱', label: 'feeling bored', category: 'feeling' },
  { id: 'feeling-calm', emoji: '😌', label: 'feeling calm', category: 'feeling' },
  { id: 'feeling-peaceful', emoji: '😇', label: 'feeling peaceful', category: 'feeling' },
  { id: 'feeling-energetic', emoji: '⚡', label: 'feeling energetic', category: 'feeling' },
  { id: 'feeling-creative', emoji: '🎨', label: 'feeling creative', category: 'feeling' },
  
  // Activities
  { id: 'watching-movie', emoji: '🎬', label: 'watching movie', category: 'activity' },
  { id: 'watching-tv', emoji: '📺', label: 'watching TV', category: 'activity' },
  { id: 'listening-music', emoji: '🎧', label: 'listening to music', category: 'activity' },
  { id: 'reading-book', emoji: '📚', label: 'reading book', category: 'activity' },
  { id: 'playing-games', emoji: '🎮', label: 'playing games', category: 'activity' },
  { id: 'eating-food', emoji: '🍔', label: 'eating food', category: 'activity' },
  { id: 'drinking-coffee', emoji: '☕', label: 'drinking coffee', category: 'activity' },
  { id: 'working', emoji: '💼', label: 'working', category: 'activity' },
  { id: 'studying', emoji: '📖', label: 'studying', category: 'activity' },
  { id: 'traveling', emoji: '✈️', label: 'traveling', category: 'activity' },
  { id: 'shopping', emoji: '🛍️', label: 'shopping', category: 'activity' },
  { id: 'exercising', emoji: '🏃', label: 'exercising', category: 'activity' },
  { id: 'sleeping', emoji: '😴', label: 'sleeping', category: 'activity' },
  { id: 'cooking', emoji: '👨‍🍳', label: 'cooking', category: 'activity' },
  { id: 'baking', emoji: '🧑‍🍳', label: 'baking', category: 'activity' },
  { id: 'partying', emoji: '🎉', label: 'partying', category: 'activity' },
  { id: 'celebrating', emoji: '🥳', label: 'celebrating', category: 'activity' },
  { id: 'relaxing', emoji: '🛋️', label: 'relaxing', category: 'activity' },
  { id: 'meditating', emoji: '🧘', label: 'meditating', category: 'activity' },
  { id: 'dancing', emoji: '💃', label: 'dancing', category: 'activity' },
  { id: 'singing', emoji: '🎤', label: 'singing', category: 'activity' },
  { id: 'drawing', emoji: '🎨', label: 'drawing', category: 'activity' },
  { id: 'writing', emoji: '✍️', label: 'writing', category: 'activity' },
  { id: 'coding', emoji: '💻', label: 'coding', category: 'activity' },
  { id: 'gaming', emoji: '🎯', label: 'gaming', category: 'activity' },
  { id: 'fishing', emoji: '🎣', label: 'fishing', category: 'activity' },
  { id: 'hiking', emoji: '🥾', label: 'hiking', category: 'activity' },
  { id: 'camping', emoji: '⛺', label: 'camping', category: 'activity' },
  { id: 'swimming', emoji: '🏊', label: 'swimming', category: 'activity' },
  { id: 'driving', emoji: '🚗', label: 'driving', category: 'activity' },
  { id: 'cycling', emoji: '🚴', label: 'cycling', category: 'activity' },
  { id: 'running', emoji: '🏃', label: 'running', category: 'activity' },
  { id: 'walking', emoji: '🚶', label: 'walking', category: 'activity' },
  { id: 'gym', emoji: '🏋️', label: 'at the gym', category: 'activity' },
  { id: 'yoga', emoji: '🧘‍♀️', label: 'doing yoga', category: 'activity' },
  { id: 'meeting', emoji: '🤝', label: 'in a meeting', category: 'activity' },
  { id: 'call', emoji: '📞', label: 'on a call', category: 'activity' },
  { id: 'video-call', emoji: '📹', label: 'on video call', category: 'activity' },
  { id: 'shopping-online', emoji: '🛒', label: 'shopping online', category: 'activity' },
  { id: 'planning', emoji: '📋', label: 'planning', category: 'activity' },
  { id: 'organizing', emoji: '📁', label: 'organizing', category: 'activity' },
  { id: 'cleaning', emoji: '🧹', label: 'cleaning', category: 'activity' },
  { id: 'gardening', emoji: '🌱', label: 'gardening', category: 'activity' },
  { id: 'photography', emoji: '📷', label: 'taking photos', category: 'activity' },
  { id: 'volunteering', emoji: '🤲', label: 'volunteering', category: 'activity' },
  { id: 'church', emoji: '⛪', label: 'at church', category: 'activity' },
  { id: 'mosque', emoji: '🕌', label: 'at mosque', category: 'activity' },
  { id: 'temple', emoji: '🛕', label: 'at temple', category: 'activity' },
  { id: 'beach', emoji: '🏖️', label: 'at the beach', category: 'activity' },
  { id: 'park', emoji: '🌳', label: 'at the park', category: 'activity' },
  { id: 'concert', emoji: '🎵', label: 'at a concert', category: 'activity' },
  { id: 'museum', emoji: '🏛️', label: 'at a museum', category: 'activity' },
  { id: 'restaurant', emoji: '🍽️', label: 'at a restaurant', category: 'activity' },
  { id: 'cafe', emoji: '☕', label: 'at a cafe', category: 'activity' },
  { id: 'bar', emoji: '🍺', label: 'at a bar', category: 'activity' },
  { id: 'club', emoji: '🕺', label: 'at a club', category: 'activity' },
  { id: 'party', emoji: '🎊', label: 'at a party', category: 'activity' },
  { id: 'wedding', emoji: '💒', label: 'at a wedding', category: 'activity' },
  { id: 'birthday', emoji: '🎂', label: 'celebrating birthday', category: 'activity' },
  { id: 'anniversary', emoji: '💑', label: 'celebrating anniversary', category: 'activity' },
  { id: 'graduation', emoji: '🎓', label: 'graduating', category: 'activity' },
  { id: 'new-job', emoji: '💼', label: 'starting new job', category: 'activity' },
  { id: 'vacation', emoji: '🌴', label: 'on vacation', category: 'activity' },
  { id: 'holiday', emoji: '🎄', label: 'on holiday', category: 'activity' },
  { id: 'weekend', emoji: '🌅', label: 'enjoying weekend', category: 'activity' },
];

// Helper functions
export const getFeelingById = (id: string): Feeling | undefined => {
  return FEELINGS.find(feeling => feeling.id === id);
};

export const getFeelingsByCategory = (category: 'feeling' | 'activity'): Feeling[] => {
  return FEELINGS.filter(feeling => feeling.category === category);
};

export const searchFeelings = (query: string): Feeling[] => {
  const lowerQuery = query.toLowerCase();
  return FEELINGS.filter(feeling => 
    feeling.label.toLowerCase().includes(lowerQuery) ||
    feeling.emoji.includes(query)
  );
};
