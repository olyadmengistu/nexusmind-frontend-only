import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../src/config/api';
import VideoPlayer from './VideoPlayer';
import VideoActions from './VideoActions';
import VideoInfo from './VideoInfo';

interface Video {
  id: string;
  user_id: string;
  caption: string;
  file_path: string;
  thumbnail_path?: string;
  duration?: number;
  aspect_ratio: string;
  file_size?: number;
  views: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  hashtags?: string;
  music_track?: string;
  created_at: string;
  updated_at: string;
  display_name: string;
  profile_image?: string;
}

interface VideoFeedProps {
  user: any;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ user }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        console.log('Fetching videos from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VIDEOS}?limit=20`);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VIDEOS}?limit=20`);
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.log('Response text (first 200 chars):', text.substring(0, 200));
          throw new Error('Server returned non-JSON response. Check if backend is running correctly.');
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        setVideos(data.videos || []);
      } catch (err) {
        console.error('Fetch videos error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        navigateVideo(1);
      } else if (e.key === 'ArrowUp') {
        navigateVideo(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videos.length]);

  // Touch event handlers for swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartY.current || !touchEndY.current) return;
    
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe up - next video
        navigateVideo(1);
      } else {
        // Swipe down - previous video
        navigateVideo(-1);
      }
    }

    touchStartY.current = 0;
    touchEndY.current = 0;
  }, []);

  // Navigate between videos
  const navigateVideo = useCallback((direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, videos.length]);

  // Handle video interactions
  const handleLike = useCallback(async (videoId: string) => {
    try {
      const token = localStorage.getItem('nexusmind_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VIDEO_LIKE(videoId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the video in state
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                likes_count: video.likes_count + (data.liked ? 1 : -1)
              }
            : video
        ));
      }
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  }, []);

  const handleComment = useCallback(async (videoId: string, content: string) => {
    try {
      const token = localStorage.getItem('nexusmind_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VIDEO_COMMENTS(videoId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        const data = await response.json();
        // Update the video in state
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                comments_count: video.comments_count + 1
              }
            : video
        ));
        return data.comment;
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
    return null;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center max-w-md px-4">
          <p className="text-red-500 mb-4 text-lg">Error: {error}</p>
          <p className="text-gray-400 mb-6 text-sm">
            This might be because the backend server isn't running. 
            Please start the backend server with: <code className="bg-gray-800 px-2 py-1 rounded">npm run dev:api</code>
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => {
                // Load mock data for testing
                const mockVideos = [
                  {
                    id: '1',
                    user_id: 'mock-user-1',
                    caption: 'My code is throwing an error I can\'t figure out. #technical #programming #help-needed',
                    file_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    thumbnail_path: '',
                    duration: 60,
                    aspect_ratio: '9:16',
                    views: 1234,
                    likes_count: 89,
                    comments_count: 12,
                    shares_count: 5,
                    problem_category: 'Technical Issue',
                    problem_urgency: 'high',
                    problem_severity: 'medium',
                    solution_count: 3,
                    hashtags: '#technical #programming #help-needed',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    display_name: 'Developer User',
                    profile_image: ''
                  }
                ];
                setVideos(mockVideos);
                setError(null);
              }}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Load Demo Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No videos available</p>
          <p className="text-gray-400">Be the first to upload a video!</p>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Container */}
      <div className="relative h-full">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              index === currentIndex ? 'translate-y-0' : 
              index < currentIndex ? '-translate-y-full' : 'translate-y-full'
            }`}
          >
            <VideoPlayer
              video={video}
              isActive={index === currentIndex}
              onVideoEnd={() => {
                // Auto-play next video when current video ends
                if (currentIndex < videos.length - 1) {
                  navigateVideo(1);
                }
              }}
              onDoubleTap={() => handleLike(video.id)}
            />
            
            {/* Video Info Overlay */}
            <VideoInfo 
              video={video}
              className="absolute bottom-20 left-4 right-20 text-white z-10"
            />
            
            {/* Action Buttons */}
            <VideoActions
              video={video}
              user={user}
              onLike={handleLike}
              onComment={handleComment}
              className="absolute bottom-20 right-4 z-10"
            />
          </div>
        ))}
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col gap-2">
          {videos.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm z-10">
          <p>Swipe up or down to navigate</p>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
