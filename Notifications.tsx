
import React from 'react';
import { useNotifications } from '../src/NotificationContext';

const Notifications: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    createTestNotification,
    requestPushPermission,
    pushPermissionGranted,
    soundEnabled,
    toggleSound
  } = useNotifications();

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
      default:
        return 'fa-bell';
    }
  };

  const handleRequestPushPermission = async () => {
    const granted = await requestPushPermission();
    if (granted) {
      alert('Push notifications enabled! You will receive notifications even when the tab is inactive.');
    } else {
      alert('Push notifications were denied. You can enable them in your browser settings.');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto p-4 bg-white min-h-screen shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2 flex-wrap">
          {!pushPermissionGranted && (
            <button 
              onClick={handleRequestPushPermission}
              className="text-green-600 hover:bg-green-50 p-2 rounded-full font-semibold text-sm"
            >
              Enable Push Notifications
            </button>
          )}
          <button 
            onClick={toggleSound}
            className={`${soundEnabled ? 'text-gray-600 hover:bg-gray-50' : 'text-red-600 hover:bg-red-50'} p-2 rounded-full font-semibold text-sm`}
          >
            <i className={`fa-solid ${soundEnabled ? 'fa-volume-up' : 'fa-volume-xmark'} mr-1`}></i>
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>
          <button 
            onClick={createTestNotification}
            className="text-blue-500 hover:bg-blue-50 p-2 rounded-full font-semibold text-sm"
          >
            Test Notification
          </button>
          <button 
            onClick={markAllAsRead}
            className="text-blue-500 hover:bg-blue-50 p-2 rounded-full font-semibold"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fa-solid fa-bell text-4xl mb-4"></i>
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <h3 className="font-bold text-[17px] py-2 px-2">New</h3>
            )}
            
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="relative">
                  <img src={notif.fromUser.avatar} className="w-14 h-14 rounded-full" alt="User" />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 ${getNotificationColor(notif.type)} border-4 border-white rounded-full flex items-center justify-center text-white text-[10px]`}>
                    <i className={`fa-solid ${getNotificationIcon(notif.type)}`}></i>
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-[15px] ${!notif.read ? 'font-bold' : ''}`}>{notif.message}</p>
                  {notif.target.title && (
                    <p className="text-xs text-gray-600 mt-1">{notif.target.title}</p>
                  )}
                  <p className="text-xs text-blue-500 font-semibold">{formatTimeAgo(notif.timestamp)}</p>
                </div>
                {!notif.read && (
                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
                <div className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  <i className="fa-solid fa-ellipsis"></i>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
