import React from 'react';

interface Video {
  id: string;
  user_id: string;
  caption: string;
  display_name: string;
  profile_image?: string;
  problem_category?: string;
  problem_urgency?: string;
  problem_severity?: string;
  solution_count?: number;
  created_at: string;
}

interface VideoInfoProps {
  video: Video;
  className?: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video, className = '' }) => {
  // Parse problem tags from caption
  const parseProblemTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    return matches || [];
  };

  // Format caption with clickable problem tags
  const formatCaption = (caption: string, tags: string[]) => {
    if (!caption) return '';
    
    let formattedText = caption;
    tags.forEach(tag => {
      const tagWithoutHash = tag.substring(1);
      formattedText = formattedText.replace(
        new RegExp(tag, 'g'),
        `<span class="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">${tag}</span>`
      );
    });
    
    return formattedText;
  };

  // Get problem tags from caption
  const problemTags = parseProblemTags(video.caption || '');

  // Get urgency color
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  // Get severity color
  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just posted';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle problem tag click
  const handleProblemTagClick = (tag: string) => {
    // TODO: Navigate to problem category page
    console.log('Navigate to problem category:', tag);
  };

  return (
    <div className={`text-white ${className}`}>
      {/* User info and problem status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
            {video.profile_image ? (
              <img 
                src={video.profile_image} 
                alt={video.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm flex items-center gap-2">
              <span>{video.display_name}</span>
              {video.problem_category && (
                <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                  {video.problem_category}
                </span>
              )}
            </p>
            <p className="text-xs text-white/70">{formatDate(video.created_at)}</p>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors">
          Follow
        </button>
      </div>

      {/* Problem Description */}
      {video.caption && (
        <div className="mb-3">
          <p 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: formatCaption(video.caption, problemTags) 
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'SPAN' && target.textContent?.startsWith('#')) {
                handleProblemTagClick(target.textContent);
              }
            }}
          />
        </div>
      )}

      {/* Problem Tags */}
      {problemTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {problemTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleProblemTagClick(tag)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Problem Severity and Urgency */}
      <div className="flex gap-2 mb-3">
        {video.problem_severity && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(video.problem_severity)}`}>
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {video.problem_severity} Severity
          </div>
        )}
        {video.problem_urgency && (
          <div className={`text-xs font-medium ${getUrgencyColor(video.problem_urgency)}`}>
            <i className="fas fa-clock mr-1"></i>
            {video.problem_urgency} Urgency
          </div>
        )}
      </div>

      {/* Problem Stats */}
      <div className="flex items-center gap-4 text-xs text-white/70 mb-3">
        <div className="flex items-center gap-1">
          <i className="fas fa-eye"></i>
          <span>{video.views?.toLocaleString() || 0} views</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-lightbulb"></i>
          <span>{video.solution_count?.toLocaleString() || 0} solutions</span>
        </div>
        <div className="flex items-center gap-1">
          <i className="fas fa-share"></i>
          <span>{video.shares_count?.toLocaleString() || 0} shares</span>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600/20 border border-blue-400/30 rounded-lg p-3 mb-3">
        <p className="text-sm font-medium text-blue-200 mb-1">
          <i className="fas fa-hands-helping mr-2"></i>
          Help Solve This Problem
        </p>
        <p className="text-xs text-blue-300">
          Share your expertise and provide a solution to help the community
        </p>
      </div>
    </div>
  );
};

export default VideoInfo;
