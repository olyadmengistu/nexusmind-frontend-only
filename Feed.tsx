
import React, { useState } from 'react';

import { User, Post } from '../src/types';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import StoryCarousel from './StoryCarousel';
import PostCard from './PostCard';
import ComposerModal from './ComposerModal';

interface FeedProps {
  user: User;
  posts: Post[];
  onAddPost: (post: Post) => void;
  onVote: (postId: string, delta: number) => void;
}

const Feed: React.FC<FeedProps> = ({ user, posts, onAddPost, onVote }) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <div className="flex justify-center min-h-screen">
      {/* Mobile: No sidebars, Tablet: Left sidebar only, Desktop: Both sidebars */}
      <div className="hidden lg:block">
        <LeftSidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[680px] px-2 sm:px-4 py-4 space-y-4 lg:ml-[280px] lg:mr-[300px] xl:ml-0 xl:mr-0">
        <StoryCarousel user={user} onAddPost={onAddPost} />

        {/* Composer Section - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={user.avatar} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" 
              alt="User" 
            />
            <button 
              onClick={() => setIsComposerOpen(true)}
              className="flex-1 bg-[#F0F2F5] hover:bg-gray-200 text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-gray-500 text-sm sm:text-[17px] transition-colors touch-manipulation"
            >
              What problem are you facing, {user.name.split(' ')[0]}?
            </button>
          </div>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-around">
            <button 
              onClick={() => setIsComposerOpen(true)} 
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg text-[#65676B] font-semibold text-xs sm:text-sm touch-manipulation"
            >
              <i className="fa-solid fa-video text-[#F3425E] text-sm sm:text-base"></i> 
              <span className="hidden sm:inline">Live Video</span>
              <span className="sm:hidden">Live</span>
            </button>
            <button 
              onClick={() => setIsComposerOpen(true)} 
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg text-[#65676B] font-semibold text-xs sm:text-sm touch-manipulation"
            >
              <i className="fa-solid fa-images text-[#45BD62] text-sm sm:text-base"></i> 
              <span className="hidden sm:inline">Photo/video</span>
              <span className="sm:hidden">Photo</span>
            </button>
            <button 
              onClick={() => setIsComposerOpen(true)} 
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 flex-1 justify-center py-2 rounded-lg text-[#65676B] font-semibold text-xs sm:text-sm touch-manipulation"
            >
              <i className="fa-regular fa-face-smile text-[#F7B928] text-sm sm:text-base"></i> 
              <span className="hidden sm:inline">Feeling/activity</span>
              <span className="sm:hidden">Feeling</span>
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-3 sm:space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onVote={onVote} currentUser={user} />
          ))}
        </div>
      </div>

      {/* Right Sidebar - Desktop only */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsComposerOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation transition-colors lg:hidden"
        aria-label="Create new post"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      {isComposerOpen && (
        <ComposerModal 
          user={user} 
          onClose={() => setIsComposerOpen(false)} 
          onSubmit={onAddPost}
        />
      )}
    </div>
  );
};

export default Feed;
