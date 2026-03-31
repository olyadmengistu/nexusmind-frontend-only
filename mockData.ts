/**
 * Mock data for development and testing
 */

import { Post, User, Story, Notification } from '../types';

export const COLORS = {
  fbBlue: '#1877F2',
  fbBg: '#F0F2F5',
  fbWhite: '#FFFFFF',
  fbTextPrimary: '#050505',
  fbTextSecondary: '#65676B',
  fbGreen: '#42B72A'
} as const;

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    reputation: 1250,
    bio: 'Tech Lead & Problem Solver'
  },
  {
    id: 'u2',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    reputation: 840,
    bio: 'Startup Founder & Enthusiast'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content: 'I have a large list of 10k items and even with memoization, the re-renders are sluggish. Anyone found a better way than virtualization?',
    timestamp: Date.now() - 3600000,
    likes: 42,
    comments: 12,
    shares: 5,
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://picsum.photos/seed/tech/800/400',
        thumbnail: 'https://picsum.photos/seed/tech/200/150'
      }
    ],
    taggedUsers: ['u2']
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'Our CAC is climbing higher than our LTV. We are a B2B SaaS. Any creative low-cost strategies for lead gen?',
    timestamp: Date.now() - 7200000,
    likes: 15,
    comments: 8,
    shares: 2
  },
  {
    id: 'p3',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content: 'Working on a sustainable fashion brand. Should I stick with greens or go for a modern beige/earth-tone look?',
    timestamp: Date.now() - 86400000,
    likes: 89,
    comments: 24,
    shares: 15,
    media: [
      {
        id: 'm2',
        type: 'image',
        url: 'https://picsum.photos/seed/design/800/400',
        thumbnail: 'https://picsum.photos/seed/design/200/150'
      }
    ]
  }
];

export const STORIES: Story[] = [
  { 
    id: 'st1', 
    userId: 'u1', 
    userName: 'Sarah Chen', 
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 
    mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=300&fit=crop',
    mediaType: 'image',
    timestamp: Date.now() - 3600000,
    expiresAt: Date.now() + 86400000
  },
  { 
    id: 'st2', 
    userId: 'u2', 
    userName: 'John Doe', 
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 
    mediaUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=300&fit=crop&crop=face',
    mediaType: 'image',
    timestamp: Date.now() - 7200000,
    expiresAt: Date.now() + 86400000
  },
  { 
    id: 'st3', 
    userId: 'u3', 
    userName: 'Alex River', 
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&crop=face',
    mediaType: 'image',
    timestamp: Date.now() - 10800000,
    expiresAt: Date.now() + 86400000
  },
  { 
    id: 'st4', 
    userId: 'u4', 
    userName: 'Maria Lopez', 
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 
    mediaUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=300&fit=crop&crop=face',
    mediaType: 'image',
    timestamp: Date.now() - 14400000,
    expiresAt: Date.now() + 86400000
  }
];

export const NOTIFICATIONS: Notification[] = [
  { 
    id: 'n1', 
    userId: 'u1',
    type: 'solution_posted',
    title: 'New Solution',
    message: 'Sarah Chen suggested a solution to your problem.',
    timestamp: Date.now() - 7200000,
    read: false
  },
  { 
    id: 'n2', 
    userId: 'u1',
    type: 'problem_upvoted',
    title: 'Milestone Reached',
    message: 'Your problem reached 50 helpful votes!',
    timestamp: Date.now() - 18000000,
    read: true
  },
  { 
    id: 'n3', 
    userId: 'u1',
    type: 'follow',
    title: 'New Follower',
    message: 'Alex River started following your solutions.',
    timestamp: Date.now() - 86400000,
    read: false
  }
];
