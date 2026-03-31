import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Video {
  id: string;
  file_path: string;
  thumbnail_path?: string;
  duration?: number;
  aspect_ratio: string;
}

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  onVideoEnd?: () => void;
  onDoubleTap?: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  isActive, 
  onVideoEnd,
  onDoubleTap,
  className = '' 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const lastTapRef = useRef<number>(0);

  // Auto-play when video becomes active
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Play video with sound (like TikTok)
      video.muted = isMuted;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Auto-play failed:', error);
        // Try muted play as fallback
        video.muted = true;
        video.play().then(() => {
          setIsPlaying(true);
          setIsMuted(true);
        }).catch(() => {
          console.log('Muted auto-play also failed');
        });
      });
    } else {
      // Pause when not active
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isMuted]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsPlaying(false);
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onVideoEnd]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Play failed:', error);
      });
    }
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Handle seek
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * video.duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  }, []);

  // Show/hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Handle double-tap for like
  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const now = Date.now();
    const tapLength = now - lastTapRef.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (onDoubleTap) {
        onDoubleTap();
      }
      
      // Show heart animation at click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setShowHeart(true);
      
      // Create heart element at click position
      const heartElement = document.createElement('div');
      heartElement.className = 'fixed pointer-events-none z-50';
      heartElement.style.left = `${e.clientX}px`;
      heartElement.style.top = `${e.clientY}px`;
      heartElement.style.transform = 'translate(-50%, -50%)';
      heartElement.innerHTML = `
        <div class="animate-ping">
          <i class="fas fa-heart text-6xl text-red-500"></i>
        </div>
      `;
      
      document.body.appendChild(heartElement);
      
      // Remove heart after animation
      setTimeout(() => {
        document.body.removeChild(heartElement);
        setShowHeart(false);
      }, 1000);
      
      lastTapRef.current = 0; // Reset to prevent triple taps
    } else {
      // Single tap - toggle play/pause
      togglePlay();
    }
    
    lastTapRef.current = now;
  }, [onDoubleTap, togglePlay]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`relative w-full h-full bg-black ${className}`}
      onClick={handleVideoClick}
      onDoubleClick={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'}`}
        src={video.file_path}
        poster={video.thumbnail_path}
        loop={!onVideoEnd} // Loop unless we have an end handler
        playsInline
        x5-playsinline
        webkit-playsinline
        preload="metadata"
      />
      
      {/* Loading indicator */}
      {!isPlaying && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Play/Pause button overlay */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4">
            {isPlaying ? (
              <i className="fas fa-pause text-white text-2xl"></i>
            ) : (
              <i className="fas fa-play text-white text-2xl ml-1"></i>
            )}
          </div>
        </div>
      )}

      {/* Video controls overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {/* Progress bar */}
          <div 
            className="relative h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              {/* Play/Pause button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <i className="fas fa-pause text-xl"></i>
                ) : (
                  <i className="fas fa-play text-xl ml-0.5"></i>
                )}
              </button>

              {/* Time display */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Mute button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="hover:scale-110 transition-transform"
              >
                {isMuted ? (
                  <i className="fas fa-volume-mute text-xl"></i>
                ) : (
                  <i className="fas fa-volume-up text-xl"></i>
                )}
              </button>

              {/* Fullscreen button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="hover:scale-110 transition-transform"
              >
                <i className="fas fa-expand text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music indicator (if available) */}
      {video.duration && (
        <div className="absolute bottom-20 left-4 right-20 flex items-center gap-2 text-white pointer-events-none">
          <div className="animate-spin">
            <i className="fas fa-music text-sm"></i>
          </div>
          <span className="text-xs">Original sound</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
