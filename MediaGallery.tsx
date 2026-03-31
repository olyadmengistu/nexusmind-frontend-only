import React, { useState } from 'react';
import { MediaItem } from '../src/types';
import { buildMediaUrl } from '../src/config/api';

interface MediaGalleryProps {
  media: MediaItem[];
  onMediaClick?: (media: MediaItem) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

  const currentMedia = media[currentMediaIndex];

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrevious = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentMediaIndex(index);
  };

  const handleVideoPlayPause = (mediaId: string, videoElement: HTMLVideoElement) => {
    if (playingVideos.has(mediaId)) {
      videoElement.pause();
      setPlayingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(mediaId);
        return newSet;
      });
    } else {
      videoElement.play();
      setPlayingVideos(prev => new Set(prev).add(mediaId));
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const renderMedia = (media: MediaItem, className = "") => {
    // Use the new API configuration
    const fullUrl = buildMediaUrl(media.url);

    if (media.type === 'image') {
      return (
        <img
          src={fullUrl}
          alt={media.name || 'Post image'}
          className={`${className} cursor-pointer object-cover touch-manipulation`}
          onClick={openFullscreen}
          onLoad={() => console.log('✅ Image loaded successfully:', fullUrl)}
          onError={(e) => {
            console.error('❌ Image failed to load:', fullUrl);
            console.error('Media object:', media);
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
      );
    } else if (media.type === 'video') {
      const isPlaying = playingVideos.has(media.id);
      
      return (
        <div className="relative">
          <video
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.onplay = () => setPlayingVideos(prev => new Set(prev).add(media.id));
                videoElement.onpause = () => setPlayingVideos(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(media.id);
                  return newSet;
                });
              }
            }}
            src={fullUrl}
            className={`${className} object-cover cursor-pointer touch-manipulation`}
            preload="metadata"
            playsInline
            onClick={(e) => {
              e.stopPropagation();
              handleVideoPlayPause(media.id, e.currentTarget);
            }}
            onLoadStart={() => console.log('Video loading started:', fullUrl)}
            onError={(e) => {
              console.error('❌ Video failed to load:', fullUrl);
              console.error('Media object:', media);
              
              // Show error message for video
              const errorDiv = document.createElement('div');
              errorDiv.className = 'flex items-center justify-center h-32 sm:h-64 bg-gray-200 text-gray-600';
              errorDiv.innerHTML = '<i class="fa-solid fa-video-slash mr-2"></i>Video unavailable';
              e.currentTarget.parentNode?.replaceChild(errorDiv, e.currentTarget);
            }}
          />
          
          {/* Play button overlay - only visible when video is paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 rounded-full p-4 sm:p-6 backdrop-blur-sm touch-manipulation">
                <i className="fas fa-play text-white text-xl sm:text-3xl ml-1"></i>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (media.length === 1) {
    return (
      <div className="relative bg-black">
        {renderMedia(media[0], "w-full max-h-[400px] sm:max-h-[600px] mx-auto")}
        {media[0].type === 'image' && (
          <button
            onClick={openFullscreen}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-70 transition-all touch-manipulation"
          >
            <i className="fa-solid fa-expand text-white text-sm sm:text-base"></i>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Main Media Display */}
      <div className="relative bg-black">
        {renderMedia(currentMedia, "w-full max-h-[400px] sm:max-h-[600px] mx-auto")}
        
        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-opacity-80 transition-all shadow-lg touch-manipulation"
            >
              <i className="fa-solid fa-chevron-left text-white text-sm sm:text-base"></i>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-opacity-80 transition-all shadow-lg touch-manipulation"
            >
              <i className="fa-solid fa-chevron-right text-white text-sm sm:text-base"></i>
            </button>
          </>
        )}

        {/* Media Type Indicator */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black bg-opacity-60 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg">
          {currentMedia.type === 'video' ? (
            <><i className="fa-solid fa-video mr-1 sm:mr-2"></i>Video</>
          ) : (
            <><i className="fa-solid fa-image mr-1 sm:mr-2"></i>Photo</>
          )}
          <span className="ml-1 sm:ml-2 opacity-80">{currentMediaIndex + 1} / {media.length}</span>
        </div>

        {/* Fullscreen Button */}
        {currentMedia.type === 'image' && (
          <button
            onClick={openFullscreen}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 transition-all shadow-lg touch-manipulation"
          >
            <i className="fa-solid fa-expand text-white text-sm sm:text-base"></i>
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 overflow-x-auto bg-gray-100">
          {media.map((file, index) => (
            <button
              key={file.id}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative transition-all ${index === currentMediaIndex ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'} touch-manipulation`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                {file.type === 'image' ? (
                  <img
                    src={buildMediaUrl(file.url)}
                    alt={file.name || 'Thumbnail'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ Thumbnail failed to load:', e.currentTarget.src);
                      e.currentTarget.src = '/placeholder-image.svg';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gray-300 flex items-center justify-center relative" style={{display: file.type === 'image' ? 'none' : 'flex'}}>
                  <i className="fa-solid fa-video text-gray-600 text-lg sm:text-xl"></i>
                  {/* Small play button overlay for video thumbnails */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-1.5 sm:p-2">
                      <i className="fas fa-play text-white text-xs sm:text-xs ml-0.5"></i>
                    </div>
                  </div>
                </div>
              </div>
              {index === currentMediaIndex && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
