/**
 * Core type definitions for NexusMind platform
 */

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  birthday?: string;
  gender?: string;
  reputation: number;
  bio?: string;
  isAdmin?: boolean;
  joinedAt?: number;
  lastLogin?: number;
  isBanned?: boolean;
}

export interface Solution {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
  upvotes: number;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
  upvotes: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
  media?: MediaItem[];
  feeling?: string;
  location?: string;
  taggedUsers?: string[];
  isPinned?: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
  size?: number;
  name?: string;
  fileName?: string;
  width?: number;
  height?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'solution_posted' | 'solution_upvoted' | 'follow' | 'problem_upvoted' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
  media?: MediaItem[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  participants: number;
  deadline?: number;
  createdBy: string;
  createdAt: number;
}

export interface VideoProblem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: number;
  views: number;
  upvotes: number;
  solutions: number;
  tags: string[];
  status: 'open' | 'solved' | 'closed';
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: number;
  expiresAt: number;
  viewed?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: number;
  };
  updatedAt: number;
  unreadCount?: number;
}
