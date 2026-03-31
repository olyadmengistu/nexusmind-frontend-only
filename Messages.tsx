
import React, { useState, useEffect } from 'react';
import { User, Conversation, Message } from '../src/types';
import { messageService } from '../src/messageService';

interface MessagesProps {
  user: User;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const userConversations = await messageService.getUserConversations(user.id);
        setConversations(userConversations);
        if (userConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(userConversations[0]);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user.id]);

  // Real-time conversations update
  useEffect(() => {
    const unsubscribe = messageService.onConversationsUpdate(user.id, (updatedConversations) => {
      setConversations(updatedConversations);
    });

    return unsubscribe;
  }, [user.id]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const loadMessages = async () => {
        try {
          const conversationMessages = await messageService.getConversationMessages(selectedConversation.id);
          setMessages(conversationMessages);
          
          // Mark messages as read
          await messageService.markMessagesAsRead(selectedConversation.id, user.id);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      };

      loadMessages();

      // Real-time messages update
      const unsubscribe = messageService.onMessagesUpdate(selectedConversation.id, (updatedMessages) => {
        setMessages(updatedMessages);
      });

      return unsubscribe;
    }
  }, [selectedConversation, user.id]);

  // Search users
  useEffect(() => {
    if (searchTerm) {
      const searchUsers = async () => {
        try {
          const results = await messageService.searchUsers(searchTerm, user.id);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      const timeoutId = setTimeout(searchUsers, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, user.id]);

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await messageService.sendMessage(selectedConversation.id, user.id, messageText.trim());
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartConversation = async (otherUser: User) => {
    try {
      const conversationId = await messageService.getOrCreateConversation(user.id, otherUser.id);
      
      // Refresh conversations and select the new one
      const updatedConversations = await messageService.getUserConversations(user.id);
      setConversations(updatedConversations);
      
      const newConversation = updatedConversations.find(c => c.id === conversationId);
      if (newConversation) {
        setSelectedConversation(newConversation);
      }
      
      setShowNewChat(false);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-56px)] bg-white items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-white">
      {/* Sidebar */}
      <div className="w-[360px] border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center justify-between">
           <h1 className="text-2xl font-bold">Chats</h1>
           <div className="flex gap-2">
             <button 
               onClick={() => setShowNewChat(true)}
               className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
             >
               <i className="fa-solid fa-pen-to-square"></i>
             </button>
           </div>
        </div>
        
        {!showNewChat ? (
          <>
            <div className="px-4 mb-4">
               <div className="relative">
                 <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                 <input 
                   type="text" 
                   placeholder="Search Messenger" 
                   className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-full outline-none"
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`flex items-center gap-3 p-2 mx-2 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <img src={conversation.participants[0]?.avatar} className="w-14 h-14 rounded-full" alt="Chat" />
                  <div className="flex-1">
                     <p className="font-semibold">{conversation.participants[0]?.name}</p>
                     <p className="text-sm text-gray-500 truncate w-[180px]">{conversation.lastMessage}</p>
                  </div>
                  <div className="text-xs text-gray-500">{conversation.time}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 p-4">
            <div className="mb-4">
              <button 
                onClick={() => setShowNewChat(false)}
                className="text-blue-600 hover:text-blue-700 mb-2"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back
              </button>
              <h3 className="font-semibold">New Chat</h3>
            </div>
            <div className="relative mb-4">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              {searchResults.map((searchUser) => (
                <div 
                  key={searchUser.id}
                  onClick={() => handleStartConversation(searchUser)}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <img src={searchUser.avatar} className="w-10 h-10 rounded-full" alt="User" />
                  <div>
                    <p className="font-semibold">{searchUser.name}</p>
                    <p className="text-sm text-gray-500">{searchUser.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-3 border-b border-gray-200 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
               <img src={selectedConversation.participants[0]?.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
               <div>
                 <p className="font-bold">{selectedConversation.participants[0]?.name}</p>
                 <p className="text-xs text-gray-500">Active now</p>
               </div>
             </div>
             <div className="flex gap-5 text-[#1877F2] text-xl">
               <i className="fa-solid fa-phone cursor-pointer"></i>
               <i className="fa-solid fa-video cursor-pointer"></i>
               <i className="fa-solid fa-circle-info cursor-pointer"></i>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-white p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`self-end bg-[#1877F2] text-white p-3 rounded-2xl max-w-[60%] ${
                  message.senderId === user.id ? 'self-end bg-[#1877F2] text-white' : 'self-start bg-gray-200'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex items-center gap-3">
            <div className="flex gap-4 text-[#1877F2] text-xl">
              <i className="fa-solid fa-circle-plus"></i>
              <i className="fa-solid fa-image"></i>
              <i className="fa-solid fa-note-sticky"></i>
              <i className="fa-solid fa-gift"></i>
            </div>
            <div className="flex-1 relative">
               <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Aa" 
                  className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none"
               />
               <i className="fa-regular fa-face-smile absolute right-3 top-1/2 -translate-y-1/2 text-[#1877F2]"></i>
            </div>
            <i onClick={handleSend} className="fa-solid fa-paper-plane text-[#1877F2] text-xl cursor-pointer"></i>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <i className="fa-brands fa-facebook-messenger text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
