import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { listenToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './notificationService';
import { usePushNotifications } from './pushNotifications';
import { useSoundEffects } from './soundEffects';
import { Notification, NotificationState } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createTestNotification: () => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  pushPermissionGranted: boolean;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  userId: string | null;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, userId }) => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
  });

  const { 
    showActivityNotification, 
    showFollowerNotification, 
    showSolutionNotification, 
    showUpvoteNotification,
    requestPermission 
  } = usePushNotifications();

  const { playNotificationSound, setEnabled, isEnabled } = useSoundEffects();

  const [previousNotificationCount, setPreviousNotificationCount] = useState(0);
  const [pushPermissionGranted, setPushPermissionGranted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(isEnabled);

  useEffect(() => {
    if (!userId) {
      setState({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    const unsubscribe = listenToNotifications(userId, (notifications, unreadCount) => {
      setState({
        notifications,
        unreadCount,
        isLoading: false,
      });

      // Show push notification for new notifications
      if (unreadCount > previousNotificationCount && notifications.length > 0) {
        const latestNotification = notifications[0]; // Most recent
        
        // Play sound effect
        switch (latestNotification.type) {
          case 'solution_upvoted':
          case 'problem_upvoted':
            playNotificationSound('like');
            break;
          case 'follow':
          case 'solution_posted':
            playNotificationSound('message');
            break;
          default:
            playNotificationSound('default');
        }
        
        switch (latestNotification.type) {
          case 'follow':
            showFollowerNotification(latestNotification.fromUser.name, latestNotification.fromUser.avatar);
            break;
          case 'solution_posted':
            showSolutionNotification(
              latestNotification.fromUser.name, 
              latestNotification.target.title || 'Your problem',
              latestNotification.fromUser.avatar
            );
            break;
          case 'solution_upvoted':
            showUpvoteNotification(latestNotification.fromUser.name, 'solution', 1, latestNotification.fromUser.avatar);
            break;
          case 'problem_upvoted':
            showUpvoteNotification(latestNotification.fromUser.name, 'problem', 1, latestNotification.fromUser.avatar);
            break;
          default:
            showActivityNotification(
              latestNotification.fromUser.name,
              latestNotification.message,
              latestNotification.target.title,
              latestNotification.fromUser.avatar
            );
        }
      }
      
      setPreviousNotificationCount(unreadCount);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const markAsRead = async (notificationId: string): Promise<void> => {
    if (!userId) return;
    
    try {
      await markNotificationAsRead(userId, notificationId);
      // The real-time listener will update the state
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!userId) return;
    
    try {
      await markAllNotificationsAsRead(userId);
      // The real-time listener will update the state
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Test function for development
  const createTestNotification = async (): Promise<void> => {
    if (!userId) return;
    
    try {
      const { createNotification, notificationHelpers } = await import('./notificationService');
      
      const testNotification = notificationHelpers.solutionPosted(
        {
          id: 'test-user',
          name: 'Test User',
          avatar: 'https://picsum.photos/seed/test/100/100',
        },
        'test-post-id',
        'Test Problem Title'
      );

      await createNotification(userId, testNotification);
    } catch (error) {
      console.error('Error creating test notification:', error);
    }
  };

  // Request push notification permission
  const requestPushPermissionHandler = async (): Promise<boolean> => {
    const granted = await requestPermission();
    setPushPermissionGranted(granted);
    return granted;
  };

  // Toggle sound effects
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    setEnabled(newState);
  };

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    createTestNotification,
    requestPushPermission: requestPushPermissionHandler,
    pushPermissionGranted,
    soundEnabled,
    toggleSound,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
