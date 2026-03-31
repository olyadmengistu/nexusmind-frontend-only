import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Message, Conversation } from './types';

export interface ConversationData {
  id: string;
  participants: string[];
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  updatedAt: Timestamp;
  unreadCounts: { [userId: string]: number };
  createdAt: Timestamp;
}

export interface MessageData {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
  type: 'text' | 'image' | 'file';
  conversationId: string;
}

class MessageService {
  private conversationsCollection = collection(db, 'conversations');

  // Create a new conversation
  async createConversation(participants: string[]): Promise<string> {
    try {
      const conversationData = {
        participants,
        lastMessage: {
          text: '',
          senderId: '',
          timestamp: serverTimestamp()
        },
        unreadCounts: participants.reduce((acc, userId) => {
          acc[userId] = 0;
          return acc;
        }, {} as { [userId: string]: number }),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.conversationsCollection, conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(user1Id: string, user2Id: string): Promise<string> {
    try {
      // Check if conversation already exists
      const q = query(
        this.conversationsCollection,
        where('participants', 'array-contains', user1Id)
      );
      
      const querySnapshot = await getDocs(q);
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data() as ConversationData;
        if (data.participants.includes(user2Id)) {
          return doc.id; // Conversation exists
        }
      }

      // Create new conversation
      return await this.createConversation([user1Id, user2Id]);
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(conversationId: string, senderId: string, text: string): Promise<void> {
    try {
      // Add message to messages subcollection
      const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
      const messageData = {
        senderId,
        text,
        timestamp: serverTimestamp(),
        read: false,
        type: 'text' as const,
        conversationId
      };

      await addDoc(messagesCollection, messageData);

      // Update conversation's last message
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data() as ConversationData;
        const unreadCounts = { ...conversationData.unreadCounts };
        
        // Increment unread count for all participants except sender
        Object.keys(unreadCounts).forEach(userId => {
          if (userId !== senderId) {
            unreadCounts[userId] = (unreadCounts[userId] || 0) + 1;
          }
        });

        await updateDoc(conversationRef, {
          lastMessage: {
            text,
            senderId,
            timestamp: serverTimestamp()
          },
          updatedAt: serverTimestamp(),
          unreadCounts
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get conversations for a user
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        this.conversationsCollection,
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const conversations: Conversation[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as ConversationData;
        
        // Get participant details
        const otherUserId = data.participants.find(id => id !== userId);
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            
            conversations.push({
              id: doc.id,
              participants: [userData],
              messages: [],
              lastMessage: data.lastMessage.text,
              time: this.formatTime(data.lastMessage.timestamp)
            });
          }
        }
      }

      return conversations;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesCollection,
        orderBy('timestamp', 'asc'),
        limit(50) // Load last 50 messages
      );

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as MessageData;
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp.toMillis()
        });
      });

      return messages;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      return [];
    }
  }

  // Real-time listener for conversations
  onConversationsUpdate(userId: string, callback: (conversations: Conversation[]) => void): () => void {
    const q = query(
      this.conversationsCollection,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, async (querySnapshot) => {
      const conversations: Conversation[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as ConversationData;
        
        // Get participant details
        const otherUserId = data.participants.find(id => id !== userId);
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            
            conversations.push({
              id: doc.id,
              participants: [userData],
              messages: [],
              lastMessage: data.lastMessage.text,
              time: this.formatTime(data.lastMessage.timestamp)
            });
          }
        }
      }

      callback(conversations);
    });
  }

  // Real-time listener for messages
  onMessagesUpdate(conversationId: string, callback: (messages: Message[]) => void): () => void {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    const q = query(
      messagesCollection,
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as MessageData;
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp.toMillis()
        });
      });

      callback(messages);
    });
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const conversationRef = doc(db, 'conversations', conversationId);
      
      // Reset unread count for this user
      await updateDoc(conversationRef, {
        [`unreadCounts.${userId}`]: 0
      });

      // Mark individual messages as read
      const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesCollection,
        where('read', '==', false),
        where('senderId', '!=', userId)
      );

      const querySnapshot = await getDocs(q);
      const batch = querySnapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Get unread count for user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        this.conversationsCollection,
        where('participants', 'array-contains', userId)
      );

      const querySnapshot = await getDocs(q);
      let totalUnread = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as ConversationData;
        totalUnread += data.unreadCounts[userId] || 0;
      });

      return totalUnread;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Search users
  async searchUsers(searchTerm: string, currentUserId: string): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(
        usersCollection,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.id !== currentUserId) {
          users.push(userData);
        }
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Helper method to format time
  private formatTime(timestamp: Timestamp): string {
    const now = Date.now();
    const messageTime = timestamp.toMillis();
    const diff = now - messageTime;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return new Date(messageTime).toLocaleDateString();
  }
}

export const messageService = new MessageService();
