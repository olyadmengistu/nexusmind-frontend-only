import React, { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../src/config/api';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserTaggerProps {
  taggedUsers: string[];
  onTaggedUsersChange: (userIds: string[]) => void;
  className?: string;
}

const UserTagger: React.FC<UserTaggerProps> = ({ 
  taggedUsers, 
  onTaggedUsersChange, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search users when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_SEARCH(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.users || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

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

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      onTaggedUsersChange(newSelectedUsers.map(u => u.id));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    const newSelectedUsers = selectedUsers.filter(u => u.id !== userId);
    setSelectedUsers(newSelectedUsers);
    onTaggedUsersChange(newSelectedUsers.map(u => u.id));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <div className={`user-tagger ${className}`} ref={dropdownRef}>
      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map(user => (
            <div 
              key={user.id}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{user.name}</span>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tag People Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
      >
        <i className="fa-solid fa-user-tag text-blue-500"></i>
        {selectedUsers.length === 0 ? 'Tag friends' : `Tag more friends`}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search for friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => {
                const isAlreadySelected = selectedUsers.find(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => !isAlreadySelected && handleUserSelect(user)}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer ${
                      isAlreadySelected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      {isAlreadySelected && (
                        <div className="text-xs text-gray-500">Already tagged</div>
                      )}
                    </div>
                    {isAlreadySelected ? (
                      <i className="fa-solid fa-check text-green-500"></i>
                    ) : (
                      <i className="fa-solid fa-plus text-gray-400"></i>
                    )}
                  </div>
                );
              })
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No friends found
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Type at least 2 characters to search
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={toggleDropdown}
              className="w-full py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTagger;
