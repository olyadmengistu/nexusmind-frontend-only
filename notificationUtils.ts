import { Notification } from './types';

export interface GroupedNotification {
  id: string;
  type: string;
  users: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  target: {
    id: string;
    type: 'post' | 'solution' | 'user';
    title?: string;
  };
  message: string;
  timestamp: number;
  read: boolean;
  count: number;
  notificationIds: string[];
}

// Group notifications by type and target
export const groupNotifications = (notifications: Notification[]): GroupedNotification[] => {
  const groups: { [key: string]: GroupedNotification } = {};

  notifications.forEach((notif) => {
    const groupKey = `${notif.type}_${notif.target.id}`;
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        id: groupKey,
        type: notif.type,
        users: [],
        target: notif.target,
        message: notif.message,
        timestamp: notif.timestamp,
        read: notif.read,
        count: 0,
        notificationIds: [],
      };
    }

    // Add user if not already in the group
    const userExists = groups[groupKey].users.some(user => user.id === notif.fromUser.id);
    if (!userExists) {
      groups[groupKey].users.push(notif.fromUser);
    }

    // Update group properties
    groups[groupKey].count += 1;
    groups[groupKey].notificationIds.push(notif.id);
    groups[groupKey].read = groups[groupKey].read && notif.read; // Mark as unread if any is unread
    groups[groupKey].timestamp = Math.max(groups[groupKey].timestamp, notif.timestamp); // Use latest timestamp
  });

  // Convert to array and sort by timestamp
  return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
};

// Generate grouped message text
export const getGroupedMessage = (group: GroupedNotification): string => {
  const { users, count, type } = group;
  
  if (count === 1) {
    return group.message;
  }

  const userNames = users.slice(0, 2).map(u => u.name.split(' ')[0]);
  const remainingCount = count - userNames.length;

  switch (type) {
    case 'solution_upvoted':
      if (remainingCount > 0) {
        return `${userNames.join(' and ')} and ${remainingCount} others upvoted your solution`;
      }
      return `${userNames.join(' and ')} upvoted your solution`;
      
    case 'problem_upvoted':
      if (remainingCount > 0) {
        return `${userNames.join(' and ')} and ${remainingCount} others upvoted your problem`;
      }
      return `${userNames.join(' and ')} upvoted your problem`;
      
    case 'follow':
      if (remainingCount > 0) {
        return `${userNames.join(' and ')} and ${remainingCount} others started following you`;
      }
      return `${userNames.join(' and ')} started following you`;
      
    case 'solution_posted':
      if (remainingCount > 0) {
        return `${userNames.join(' and ')} and ${remainingCount} others posted solutions`;
      }
      return `${userNames.join(' and ')} posted solutions`;
      
    default:
      if (remainingCount > 0) {
        return `${userNames.join(' and ')} and ${remainingCount} others`;
      }
      return `${userNames.join(' and ')}`;
  }
};

// Get display avatars for grouped notifications
export const getGroupedAvatars = (users: Array<{ id: string; name: string; avatar: string }>, maxAvatars: number = 3) => {
  return users.slice(0, maxAvatars);
};

// Check if a notification should be grouped
export const shouldGroupNotification = (type: string): boolean => {
  const groupableTypes = [
    'solution_upvoted',
    'problem_upvoted',
    'follow',
    'solution_posted',
  ];
  return groupableTypes.includes(type);
};
