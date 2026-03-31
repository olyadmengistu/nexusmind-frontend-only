import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Notification } from './types';

const NOTIFICATIONS_COLLECTION = 'userNotifications';

// Create a new notification for a user
export const createNotification = async (
  userId: string,
  notification: Omit<Notification, 'id' | 'read' | 'timestamp'>
): Promise<string> => {
  try {
    const notificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id: notificationId,
      read: false,
      timestamp: Date.now(),
    };

    const userNotificationRef = doc(db, NOTIFICATIONS_COLLECTION, userId);
    const userNotificationDoc = await getDoc(userNotificationRef);

    if (!userNotificationDoc.exists()) {
      // Create new notification document for user
      await setDoc(userNotificationRef, {
        notifications: [newNotification],
        unreadCount: 1,
        lastUpdated: Timestamp.now(),
      });
    } else {
      // Add notification to existing user document
      await updateDoc(userNotificationRef, {
        notifications: arrayUnion(newNotification),
        unreadCount: (userNotificationDoc.data().unreadCount || 0) + 1,
        lastUpdated: Timestamp.now(),
      });
    }

    return notificationId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (userId: string, notificationId: string): Promise<void> => {
  try {
    const userNotificationRef = doc(db, NOTIFICATIONS_COLLECTION, userId);
    const userNotificationDoc = await getDoc(userNotificationRef);

    if (userNotificationDoc.exists()) {
      const notifications = userNotificationDoc.data().notifications;
      const updatedNotifications = notifications.map((notif: Notification) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      
      const unreadCount = updatedNotifications.filter((notif: Notification) => !notif.read).length;
      
      await updateDoc(userNotificationRef, {
        notifications: updatedNotifications,
        unreadCount,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const userNotificationRef = doc(db, NOTIFICATIONS_COLLECTION, userId);
    const userNotificationDoc = await getDoc(userNotificationRef);

    if (userNotificationDoc.exists()) {
      const notifications = userNotificationDoc.data().notifications;
      const updatedNotifications = notifications.map((notif: Notification) => ({
        ...notif,
        read: true,
      }));
      
      await updateDoc(userNotificationRef, {
        notifications: updatedNotifications,
        unreadCount: 0,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Real-time listener for user notifications
export const listenToNotifications = (
  userId: string,
  callback: (notifications: Notification[], unreadCount: number) => void
) => {
  const userNotificationRef = doc(db, NOTIFICATIONS_COLLECTION, userId);
  
  return onSnapshot(userNotificationRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const notifications = data.notifications || [];
      const unreadCount = data.unreadCount || 0;
      
      // Sort notifications by timestamp (newest first)
      const sortedNotifications = notifications.sort((a: Notification, b: Notification) => 
        b.timestamp - a.timestamp
      );
      
      callback(sortedNotifications, unreadCount);
    } else {
      callback([], 0);
    }
  }, (error) => {
    console.error('Error listening to notifications:', error);
    callback([], 0);
  });
};

// Get notification count for a user
export const getNotificationCount = async (userId: string): Promise<number> => {
  try {
    const userNotificationRef = doc(db, NOTIFICATIONS_COLLECTION, userId);
    const userNotificationDoc = await getDoc(userNotificationRef);
    
    if (userNotificationDoc.exists()) {
      return userNotificationDoc.data().unreadCount || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting notification count:', error);
    return 0;
  }
};

// Helper functions to create specific notification types
export const notificationHelpers = {
  solutionPosted: (fromUser: { id: string; name: string; avatar: string }, postId: string, postTitle: string) => ({
    type: 'solution_posted' as const,
    fromUser,
    target: { id: postId, type: 'post' as const, title: postTitle },
    message: `${fromUser.name} posted a solution to your problem`,
  }),

  solutionUpvoted: (fromUser: { id: string; name: string; avatar: string }, solutionId: string, solutionText: string) => ({
    type: 'solution_upvoted' as const,
    fromUser,
    target: { id: solutionId, type: 'solution' as const, title: solutionText.substring(0, 50) + '...' },
    message: `${fromUser.name} upvoted your solution`,
  }),

  userFollowed: (fromUser: { id: string; name: string; avatar: string }) => ({
    type: 'follow' as const,
    fromUser,
    target: { id: fromUser.id, type: 'user' as const },
    message: `${fromUser.name} started following you`,
  }),

  problemUpvoted: (fromUser: { id: string; name: string; avatar: string }, postId: string, postTitle: string) => ({
    type: 'problem_upvoted' as const,
    fromUser,
    target: { id: postId, type: 'post' as const, title: postTitle },
    message: `${fromUser.name} upvoted your problem`,
  }),

  commentOnSolution: (fromUser: { id: string; name: string; avatar: string }, solutionId: string, solutionText: string) => ({
    type: 'comment_on_solution' as const,
    fromUser,
    target: { id: solutionId, type: 'solution' as const, title: solutionText.substring(0, 50) + '...' },
    message: `${fromUser.name} commented on your solution`,
  }),
};
