/**
 * API Configuration for NexusMind
 * Handles environment-based API URL configuration
 */

// Get API URL from environment variables or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');

// Export API configuration
export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    // Videos
    VIDEOS: '/api/videos',
    VIDEO_UPLOAD: '/api/videos/upload',
    VIDEO_LIKE: (videoId: string) => `/api/videos/${videoId}/like`,
    VIDEO_COMMENTS: (videoId: string) => `/api/videos/${videoId}/comments`,
    
    // Upload
    UPLOAD_MULTIPLE: '/api/upload/multiple',
    
    // Search
    SEARCH_SUGGESTIONS: '/api/search/suggestions',
    SEARCH: '/api/search',
    
    // Users
    USER_SEARCH: (query: string) => `/users/search/${query}`,
    USER_BY_ID: (userId: string) => `/users/${userId}`,
    
    // Feedback
    FEEDBACK: '/api/feedback',
  }
} as const;

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for media URLs
export const buildMediaUrl = (mediaPath: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = mediaPath.startsWith('/') ? mediaPath.slice(1) : mediaPath;
  return `${API_CONFIG.BASE_URL}/${cleanPath}`;
};
