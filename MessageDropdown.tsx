import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Conversation } from '../src/types';
import { messageService } from '../src/messageService';

interface MessageDropdownProps {
  user: User;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const userConversations = await messageService.getUserConversations(user.id);
        setConversations(userConversations.slice(0, 5)); // Show only 5 recent conversations
        
        const count = await messageService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    // Real-time updates
    const unsubscribeConversations = messageService.onConversationsUpdate(user.id, async (updatedConversations) => {
      setConversations(updatedConversations.slice(0, 5));
      
      const count = await messageService.getUnreadCount(user.id);
      setUnreadCount(count);
    });

    return unsubscribeConversations;
  }, [user.id]);

  const formatMessageTime = (conversation: Conversation): string => {
    const timeParts = conversation.time.split(' ');
    if (timeParts[1] === 'm' || timeParts[1] === 'h') {
      return conversation.time;
    }
    return timeParts[0]; // For days, just show the number
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
      >
        <i className="fa-brands fa-facebook-messenger text-gray-700"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-12 w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Messages</h3>
              <Link 
                to="/messages"
                onClick={() => setIsOpen(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                See all
              </Link>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  Loading messages...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <i className="fa-brands fa-facebook-messenger text-4xl mb-4"></i>
                  <p className="font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Start a conversation with other users</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/messages?conversation=${conversation.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative">
                      <img 
                        src={conversation.participants[0]?.avatar} 
                        className="w-12 h-12 rounded-full" 
                        alt={conversation.participants[0]?.name}
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.participants[0]?.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conversation)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || 'Start a conversation'}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link 
                to="/messages"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span className="font-medium">New Message</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageDropdown;
