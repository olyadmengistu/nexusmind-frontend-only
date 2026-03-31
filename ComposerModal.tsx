import React, { useState } from 'react';
import { User, Post, MediaItem } from '../src/types';
import MediaUpload from './MediaUpload';
import UserTagger from './UserTagger';
import FeelingSelector from './FeelingSelector';
import LocationSelector from './LocationSelector';
import MoreOptions from './MoreOptions';
import { Feeling } from '../constants/feelings';
import { BackgroundColor } from '../constants/backgroundColors';

interface ComposerModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (post: Post) => void;
}

const ComposerModal: React.FC<ComposerModalProps> = ({ user, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [privacy, setPrivacy] = useState('Public');
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; coordinates?: { lat: number; lng: number } } | undefined>();
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<BackgroundColor | undefined>();
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showUserTagger, setShowUserTagger] = useState(false);
  const [showFeelingSelector, setShowFeelingSelector] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const categories = ['General', 'Technology', 'Business', 'Creative', 'Personal', 'Science', 'Social'];

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 11),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      title,
      content,
      category,
      timestamp: Date.now(),
      votes: 0,
      solutions: [],
      isSolved: false,
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      taggedUsers: taggedUsers.length > 0 ? taggedUsers : undefined,
      feeling: selectedFeeling,
      location: selectedLocation,
      backgroundColor: selectedBackgroundColor
    };

    onSubmit(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="w-8"></div>
          <h2 className="text-xl font-bold">Create Problem Post</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <img src={user.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{user.name}</h4>
            <div className="flex gap-2">
              <div className="bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                <i className="fa-solid fa-users text-xs"></i> {privacy} <i className="fa-solid fa-caret-down"></i>
              </div>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-200 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2">
          <input 
            type="text" 
            placeholder="Problem Title (optional)" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold focus:outline-none placeholder-gray-400"
          />
          <textarea 
            placeholder={`What problem are you facing, ${user.name.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[150px] text-xl focus:outline-none resize-none placeholder-gray-400"
            style={{
              backgroundColor: selectedBackgroundColor?.gradient ? undefined : selectedBackgroundColor?.color || '#FFFFFF',
              background: selectedBackgroundColor?.gradient || undefined
            }}
          ></textarea>
          
          {/* More Options Component */}
          {showMoreOptions && (
            <MoreOptions 
              selectedBackgroundColor={selectedBackgroundColor}
              onBackgroundColorSelect={setSelectedBackgroundColor}
              className="relative"
            />
          )}
          
          {/* Location Selector Component */}
          {showLocationSelector && (
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationSelect={setSelectedLocation}
              className="relative"
            />
          )}
          
          {/* Feeling Selector Component */}
          {showFeelingSelector && (
            <FeelingSelector 
              selectedFeeling={selectedFeeling}
              onFeelingSelect={setSelectedFeeling}
              className="relative"
            />
          )}
          
          {/* User Tagger Component */}
          {showUserTagger && (
            <UserTagger 
              taggedUsers={taggedUsers}
              onTaggedUsersChange={setTaggedUsers}
              className="relative"
            />
          )}
          
          {/* Media Upload Component */}
          {showMediaUpload && (
            <MediaUpload 
              mediaFiles={mediaFiles} 
              onMediaChange={setMediaFiles} 
            />
          )}
        </div>

        {/* Add to Post */}
        <div className="mx-4 mb-4 p-3 border border-gray-300 rounded-lg flex items-center justify-between">
          <span className="font-semibold text-sm">Add to your post</span>
          <div className="flex gap-3 text-2xl">
            <i 
              className="fa-solid fa-images text-[#45BD62] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMediaUpload(!showMediaUpload)}
              title="Add photos/videos"
            ></i>
            <i 
              className="fa-solid fa-user-tag text-[#1877F2] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowUserTagger(!showUserTagger)}
              title="Tag friends"
            ></i>
            <i 
              className="fa-regular fa-face-smile text-[#F7B928] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowFeelingSelector(!showFeelingSelector)}
              title="Add feeling/activity"
            ></i>
            <i 
              className="fa-solid fa-location-dot text-[#F3425E] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              title="Add location"
            ></i>
            <i 
              className="fa-solid fa-ellipsis text-gray-400 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              title="More options"
            ></i>
          </div>
        </div>

        {/* Submit */}
        <div className="p-4">
          <button 
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="w-full bg-[#1877F2] disabled:bg-gray-300 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Post Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComposerModal;
