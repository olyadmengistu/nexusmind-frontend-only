import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../src/types';

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    if (isOpen || showLogoutConfirm) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, showLogoutConfirm]);

  // Dark mode toggle
  useEffect(() => {
    const isDarkMode = localStorage.getItem('nexusmind_dark_mode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('nexusmind_dark_mode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
    setIsOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  // Mock user stats (replace with real data)
  const userStats = {
    posts: 12,
    challenges: 8,
    points: 245
  };

  const quickActions = [
    { 
      icon: 'fa-user-edit', 
      label: 'Edit Profile', 
      path: '/profile/edit',
      color: 'bg-blue-500',
      description: 'Update your information'
    },
    { 
      icon: 'fa-plus-circle', 
      label: 'Create Post', 
      path: '/create',
      color: 'bg-green-500',
      description: 'Share your thoughts'
    },
    { 
      icon: 'fa-trophy', 
      label: 'My Challenges', 
      path: '/challenges',
      color: 'bg-purple-500',
      description: 'View your challenges'
    }
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'fa-user', label: 'View Profile', path: '/profile', description: 'See your profile' },
        { icon: 'fa-cog', label: 'Settings & Privacy', path: '/settings', description: 'Manage your settings' },
        { icon: 'fa-bell', label: 'Notifications', path: '/notifications', description: 'Notification preferences' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'fa-palette', label: 'Display & Accessibility', path: '/display', description: 'Customize your experience' },
        { icon: 'fa-language', label: 'Language', path: '/language', description: 'Change language' },
        { icon: 'fa-shield-alt', label: 'Privacy Checkup', path: '/privacy', description: 'Review privacy settings' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'fa-question-circle', label: 'Help Center', path: '/help', description: 'Get help and support' },
        { icon: 'fa-comment-dots', label: 'Send Feedback', path: '/feedback', description: 'Help us improve' },
        { icon: 'fa-info-circle', label: 'About', path: '/about', description: 'About NexusMind' },
      ]
    }
  ];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          <i className="fa-solid fa-caret-down text-gray-700"></i>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Profile Card Section */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
              <Link 
                to="/profile" 
                onClick={handleMenuItemClick}
                className="flex items-center gap-4 group"
              >
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg" 
                    alt="User" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{userStats.posts}</span> posts
                    </span>
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{userStats.challenges}</span> challenges
                    </span>
                    <span className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{userStats.points}</span> points
                    </span>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
              </Link>
            </div>

            {/* Quick Actions Section */}
            <div className="p-4 border-b border-gray-200/50">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h4>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.path}
                    onClick={handleMenuItemClick}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group hover:scale-105"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                      <i className={`fas ${action.icon}`}></i>
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center group-hover:text-gray-900">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Menu Sections */}
            <div className="max-h-64 overflow-y-auto">
              {menuSections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="border-b border-gray-100 last:border-b-0">
                  <h4 className="px-4 pt-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h4>
                  {section.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      onClick={handleMenuItemClick}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className={`fas ${item.icon} text-sm text-gray-600`}></i>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400"></i>
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-200/50">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <i className="fas fa-moon text-white text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-sign-out-alt text-sm"></i>
                </div>
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sign-out-alt text-red-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h3>
              <p className="text-gray-600">Are you sure you want to log out of your account?</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDropdown;
