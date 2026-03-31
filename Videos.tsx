import React, { useState } from 'react';
import VideoFeed from '../components/VideoFeed';
import VideoUpload from '../components/VideoUpload';

interface VideosProps {
  user: any;
}

const Videos: React.FC<VideosProps> = ({ user }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadSuccess = (video: any) => {
    // Refresh problem feed or update state
    window.location.reload(); // Simple refresh for now
  };

  return (
    <>
      <div className="relative h-screen bg-black">
        {/* Upload Button */}
        <button
          onClick={() => setShowUpload(true)}
          className="fixed top-20 right-4 z-30 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>

        {/* Problem Feed */}
        <VideoFeed user={user} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <VideoUpload
          user={user}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
};

export default Videos;
