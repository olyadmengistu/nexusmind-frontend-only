import React, { useState } from 'react';

interface Video {
  id: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  solution_count?: number;
  display_name: string;
  profile_image?: string;
}

interface VideoActionsProps {
  video: Video;
  user: any;
  onLike: (videoId: string) => void;
  onComment: (videoId: string, content: string) => Promise<any>;
  className?: string;
}

const VideoActions: React.FC<VideoActionsProps> = ({ 
  video, 
  user, 
  onLike, 
  onComment,
  className = '' 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Handle like
  const handleLike = () => {
    if (!user) return;
    
    setIsLiked(!isLiked);
    onLike(video.id);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onComment(video.id, commentText.trim());
      setCommentText('');
      // Update local comment count
      video.comments_count += 1;
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle share
  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/videos/${video.id}`;
    const shareText = `Check out this video by ${video.display_name} on NexusMind!`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      default:
        break;
    }
    setShowShareOptions(false);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Profile Picture */}
      <div className="relative group">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
          {video.profile_image ? (
            <img 
              src={video.profile_image} 
              alt={video.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div>
          )}
        </div>
        <button className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fas fa-plus text-xs"></i>
        </button>
      </div>

      {/* Upvote Button (instead of like) */}
      <button
        onClick={handleLike}
        disabled={!user}
        className={`flex flex-col items-center gap-1 transition-all duration-200 ${
          isLiked ? 'scale-110' : 'hover:scale-105'
        } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isLiked ? 'bg-green-600' : 'bg-white/20 backdrop-blur-sm'
        }`}>
          <i className={`fas fa-arrow-up text-xl ${isLiked ? 'text-white' : 'text-white'}`}></i>
        </div>
        <span className="text-white text-xs font-medium">
          {video.likes_count > 0 ? video.likes_count.toLocaleString() : ''}
        </span>
      </button>

      {/* Solutions Button (instead of comments) */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex flex-col items-center gap-1 hover:scale-105 transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <i className="fas fa-lightbulb text-white text-xl"></i>
        </div>
        <span className="text-white text-xs font-medium">
          {video.solution_count ? video.solution_count.toLocaleString() : '0'} Solutions
        </span>
      </button>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex flex-col items-center gap-1 hover:scale-105 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <i className="fas fa-share text-white text-xl"></i>
          </div>
          <span className="text-white text-xs font-medium">
            {video.shares_count > 0 ? video.shares_count.toLocaleString() : ''}
          </span>
        </button>

        {/* Share Options Dropdown */}
        {showShareOptions && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 min-w-[150px] z-50">
            <button
              onClick={() => handleShare('copy')}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              <i className="fas fa-link text-gray-600"></i>
              Copy Link
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              <i className="fab fa-twitter text-blue-400"></i>
              Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              <i className="fab fa-facebook text-blue-600"></i>
              Facebook
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center gap-2"
            >
              <i className="fab fa-whatsapp text-green-600"></i>
              WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* More Options */}
      <button className="flex flex-col items-center gap-1 hover:scale-105 transition-all duration-200">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <i className="fas fa-ellipsis-h text-white text-xl"></i>
        </div>
      </button>

      {/* Solutions Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg max-h-[80vh] rounded-t-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Solutions & Discussion</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Solutions List */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[50vh]">
              {video.solution_count === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <i className="fas fa-lightbulb text-4xl mb-2"></i>
                  <p>No solutions yet. Be the first to help solve this problem!</p>
                </div>
              ) : (
                // TODO: Fetch and display actual solutions
                <div className="text-center text-gray-500 py-8">
                  <p>Solutions loading...</p>
                </div>
              )}
            </div>

            {/* Solution Input */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your solution or insight..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingComment ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-paper-plane"></i>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t text-center text-gray-500">
                <p>Please log in to share solutions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoActions;
