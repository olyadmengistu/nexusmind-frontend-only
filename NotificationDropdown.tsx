import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../src/NotificationContext';
import { groupNotifications, getGroupedMessage, getGroupedAvatars, shouldGroupNotification } from '../src/notificationUtils';
import { Link } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'solution_posted':
        return 'fa-lightbulb';
      case 'solution_upvoted':
        return 'fa-thumbs-up';
      case 'follow':
        return 'fa-user-plus';
      case 'problem_upvoted':
        return 'fa-star';
      case 'comment_on_solution':
        return 'fa-comment';
      case 'solution_accepted':
        return 'fa-check-circle';
      case 'problem_solved':
        return 'fa-trophy';
      default:
        return 'fa-bell';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'solution_posted':
        return 'bg-blue-500';
      case 'solution_upvoted':
        return 'bg-green-500';
      case 'follow':
        return 'bg-purple-500';
      case 'problem_upvoted':
        return 'bg-yellow-500';
      case 'comment_on_solution':
        return 'bg-indigo-500';
      case 'solution_accepted':
        return 'bg-emerald-500';
      case 'problem_solved':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNotificationClick = (notificationIds: string | string[]) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    ids.forEach(id => markAsRead(id));
    setIsOpen(false);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  // Group notifications for display
  const groupedNotifications = groupNotifications(notifications.slice(0, 10)); // Show only 10 most recent
  const recentNotifications = notifications.slice(0, 5); // Fallback for non-groupable

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center relative transition-colors"
      >
        <i className="fa-solid fa-bell text-gray-700"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {groupedNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <i className="fa-solid fa-bell text-3xl mb-3"></i>
                <p>No notifications yet</p>
              </div>
            ) : (
              groupedNotifications.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleNotificationClick(group.notificationIds)}
                  className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                    !group.read ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Avatars */}
                  <div className="flex -space-x-2 flex-shrink-0">
                    {getGroupedAvatars(group.users, 3).map((user, index) => (
                      <img
                        key={user.id}
                        src={user.avatar}
                        alt={user.name}
                        className={`w-8 h-8 rounded-full border-2 border-white ${
                          index === 0 ? '' : '-ml-2'
                        }`}
                      />
                    ))}
                    {group.count > 3 && (
                      <div className={`w-8 h-8 ${getNotificationColor(group.type)} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium -ml-2`}>
                        +{group.count - 3}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!group.read ? 'font-semibold' : 'font-normal'} text-gray-900`}>
                      {getGroupedMessage(group)}
                    </p>
                    {group.target.title && (
                      <p className="text-xs text-gray-600 mt-1 truncate">{group.target.title}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(group.timestamp)}</p>
                  </div>

                  {/* Unread indicator */}
                  {!group.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
              >
                See all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
