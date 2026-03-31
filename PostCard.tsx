
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, User, MediaItem } from '../src/types';
import { createNotification, notificationHelpers } from '../src/notificationService';
import { API_CONFIG } from '../src/config/api';
import MediaGallery from './MediaGallery';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onVote?: (postId: string, delta: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onVote }) => {
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const [taggedUsersDetails, setTaggedUsersDetails] = useState<User[]>([]);
  const [showHelpfulPopup, setShowHelpfulPopup] = useState(false);

// Fetch tagged users details
  useEffect(() => {
    const fetchTaggedUsers = async () => {
      if (post.taggedUsers && post.taggedUsers.length > 0) {
        try {
          const userPromises = post.taggedUsers.map(userId => 
            fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(userId)}`).then(res => {
              if (res.ok) return res.json();
              return null;
            }).catch(() => null)
          );
          
          const users = await Promise.all(userPromises);
          const validUsers = users.filter(user => user !== null).map(user => ({
            id: user.id,
            name: user.displayName,
            avatar: user.profileImage || '/default-avatar.png'
          }));
          
          setTaggedUsersDetails(validUsers);
        } catch (error) {
          console.error('Error fetching tagged users:', error);
        }
      }
    };

    fetchTaggedUsers();
  }, [post.taggedUsers]);

  const handleVoteClick = async () => {
    if (onVote) {
      onVote(post.id, hasVoted ? -1 : 1);
    }
    
    // Show popup animation
    if (!hasVoted) {
      setShowHelpfulPopup(true);
      setTimeout(() => setShowHelpfulPopup(false), 1500);
    }
    
    // Create notification for the post author (if not the same user and this is a new upvote)
    if (!hasVoted && post.userId !== currentUser.id) {
      try {
        const notification = notificationHelpers.problemUpvoted(
          {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          post.id,
          post.title || 'Your problem'
        );
        
        await createNotification(post.userId, notification);
      } catch (error) {
        console.error('Error creating problem upvote notification:', error);
      }
    }
    
    setHasVoted(!hasVoted);
  };

  const handleSuggestSolution = () => {
    navigate(`/solutions/${post.id}`);
  };

  const formatDate = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
             <img 
               src={post.userAvatar} 
               className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" 
               alt={post.userName} 
             />
             {post.isSolved && (
               <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white text-[8px] sm:text-[10px]">
                 <i className="fa-solid fa-check"></i>
               </div>
             )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <h4 className="font-semibold text-[15px] sm:text-[16px] leading-tight cursor-pointer hover:underline truncate">{post.userName}</h4>
              <span className="text-gray-500 text-xs">•</span>
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">{post.category}</span>
            </div>
            <p className="text-gray-500 text-[13px] sm:text-[14px]">{formatDate(post.timestamp)} · <i className="fa-solid fa-earth-americas"></i></p>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-colors touch-manipulation">
          <i className="fa-solid fa-ellipsis text-sm sm:text-base"></i>
        </button>
      </div>

      {/* Content */}
      <div 
        className="px-3 sm:px-4 pb-2 sm:pb-3 space-y-2"
        style={{
          backgroundColor: post.backgroundColor?.gradient ? undefined : post.backgroundColor?.color || undefined,
          background: post.backgroundColor?.gradient || undefined,
          borderRadius: post.backgroundColor ? '0.5rem' : undefined
        }}
      >
        {/* Feeling/Activity */}
        {post.feeling && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-lg sm:text-xl">{post.feeling.emoji}</span>
            <span className="text-sm sm:text-base">
              is <span className="font-medium">{post.feeling.label}</span>
            </span>
          </div>
        )}
        
        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <i className="fa-solid fa-location-dot text-red-500"></i>
            <span className="font-medium text-sm sm:text-base">{post.location.name}</span>
          </div>
        )}
        
        {post.title && <h3 className="font-bold text-[17px] sm:text-[18px] leading-tight">{post.title}</h3>}
        <p className="text-[15px] sm:text-[16px] whitespace-pre-wrap leading-relaxed">{post.content}</p>
        
        {/* Tagged Users */}
        {taggedUsersDetails.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <span className="text-sm sm:text-base">with</span>
            <div className="flex items-center gap-1 flex-wrap">
              {taggedUsersDetails.slice(0, 3).map((user, index) => (
                <React.Fragment key={user.id}>
                  {index > 0 && <span>,</span>}
                  <span 
                    className="font-medium text-blue-600 hover:underline cursor-pointer text-sm sm:text-base"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    {user.name}
                  </span>
                </React.Fragment>
              ))}
              {taggedUsersDetails.length > 3 && (
                <span className="text-gray-500 text-sm sm:text-base">
                  and {taggedUsersDetails.length - 3} others
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Display */}
      {(post.media && post.media.length > 0) || post.imageUrl ? (
        <div className="w-full border-y border-gray-100 bg-gray-50">
          {(() => {
            console.log('PostCard - Post media data:', post.media);
            console.log('PostCard - Post imageUrl:', post.imageUrl);
            return null;
          })()}
          {post.media && post.media.length > 0 ? (
            <MediaGallery media={post.media} />
          ) : post.imageUrl ? (
            <div className="relative">
              <img 
                src={post.imageUrl} 
                className="w-full object-cover max-h-[400px] sm:max-h-[600px] cursor-pointer" 
                alt="Post Content"
                onLoad={() => console.log('Post image loaded successfully:', post.imageUrl)}
                onError={(e) => {
                  console.error('Post image failed to load:', post.imageUrl);
                  e.currentTarget.src = '/placeholder-image.svg';
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Stats */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-1.5 cursor-pointer hover:underline group touch-manipulation">
          <div className="flex -space-x-1">
             <div className="bg-blue-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] text-white">
               <i className="fa-solid fa-thumbs-up"></i>
             </div>
             <div className="bg-yellow-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] text-white">
               <i className="fa-solid fa-lightbulb"></i>
             </div>
          </div>
          <span className="text-gray-500 text-[14px] sm:text-[15px]">{post.votes} helpful votes</span>
        </div>
        <div className="flex gap-2 sm:gap-3 text-[14px] sm:text-[15px] text-gray-500">
           <span className="hover:underline cursor-pointer touch-manipulation">{post.solutions.length} solutions</span>
           <span className="hover:underline cursor-pointer touch-manipulation">12 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-around relative">
        <button 
          onClick={handleVoteClick}
          className={`flex items-center gap-2 sm:gap-3 hover:bg-gray-100 flex-1 justify-center py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 touch-manipulation ${hasVoted ? 'text-blue-500 bg-blue-50' : 'text-[#65676B]'}`}
        >
          <i className={`fa-regular fa-thumbs-up text-base sm:text-lg ${hasVoted ? 'fa-solid' : ''}`}></i> 
          <span className="text-sm sm:text-base">Helpful</span>
        </button>
        <button 
          onClick={handleSuggestSolution}
          className="flex items-center gap-2 sm:gap-3 hover:bg-gray-100 flex-1 justify-center py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-[#65676B] font-bold text-base sm:text-lg transition-all transform hover:scale-105 touch-manipulation"
        >
          <i className="fa-regular fa-comment text-base sm:text-lg"></i> 
          <span className="text-sm sm:text-base">Suggest Solution</span>
        </button>
        <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-100 flex-1 justify-center py-3 sm:py-3.5 px-2 sm:px-4 rounded-xl text-[#65676B] font-bold text-base sm:text-lg transition-all transform hover:scale-105 touch-manipulation">
          <i className="fa-solid fa-share text-base sm:text-lg"></i> 
          <span className="text-sm sm:text-base">Share</span>
        </button>
        
        {/* Helpful Popup Animation */}
        {showHelpfulPopup && (
          <div className="absolute top-0 left-1/4 sm:left-1/3 transform -translate-x-1/2 -translate-y-full mb-2 animate-bounce pointer-events-none">
            <div className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <i className="fas fa-heart text-white text-sm"></i>
              <span className="font-bold text-xs sm:text-sm">Thanks for being helpful!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
