import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../src/types';

interface MenuDropdownProps {
  user: User;
  onLogout: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Check if mobile based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: 'fa-house', label: 'Home', path: '/', color: 'text-blue-500' },
        { icon: 'fa-user', label: 'Profile', path: '/profile', color: 'text-blue-500' },
        { icon: 'fa-puzzle-piece', label: 'My Challenges', path: '/challenges', color: 'text-purple-500' },
        { icon: 'fa-video', label: 'Watch Solutions', path: '/solutions', color: 'text-red-500' },
        { icon: 'fa-store', label: 'Marketplace', path: '/marketplace', color: 'text-green-500' },
      ]
    },
    {
      title: 'Discover',
      items: [
        { icon: 'fa-user-group', label: 'Find Solvers', path: '/users', color: 'text-blue-400' },
        { icon: 'fa-ranking-star', label: 'Expert Rankings', path: '/rankings', color: 'text-yellow-500' },
        { icon: 'fa-layer-group', label: 'Categories', path: '/categories', color: 'text-green-500' },
        { icon: 'fa-handshake', label: 'Collaboration Hub', path: '/collaboration', color: 'text-blue-400' },
        { icon: 'fa-box-archive', label: 'Solved Archive', path: '/archive', color: 'text-gray-500' },
      ]
    },
    {
      title: 'Resources',
      items: [
        { icon: 'fa-book-bookmark', label: 'Saved Methods', path: '/saved', color: 'text-red-500' },
        { icon: 'fa-chart-line', label: 'Problem Analytics', path: '/analytics', color: 'text-blue-600' },
        { icon: 'fa-graduation-cap', label: 'Learning Resources', path: '/learning', color: 'text-indigo-500' },
        { icon: 'fa-people-arrows', label: 'Mentorship', path: '/mentorship', color: 'text-teal-500' },
        { icon: 'fa-lightbulb', label: 'Idea Incubator', path: '/incubator', color: 'text-yellow-400' },
      ]
    },
    {
      title: 'Community',
      items: [
        { icon: 'fa-star', label: 'Success Stories', path: '/success', color: 'text-orange-500' },
        { icon: 'fa-coins', label: 'Funding/Grants', path: '/funding', color: 'text-yellow-600' },
        { icon: 'fa-location-dot', label: 'Local Struggles', path: '/local', color: 'text-red-400' },
        { icon: 'fa-users-viewfinder', label: 'Groups', path: '/groups', color: 'text-purple-400' },
      ]
    }
  ];

  const quickActions = [
    { icon: 'fa-plus', label: 'Create Post', action: 'create-post' },
    { icon: 'fa-flag', label: 'New Challenge', action: 'new-challenge' },
    { icon: 'fa-comment', label: 'New Message', action: 'new-message' },
    { icon: 'fa-calendar', label: 'Create Event', action: 'create-event' },
  ];

  const handleQuickAction = (action: string) => {
    // Handle quick actions here
    console.log('Quick action:', action);
    setIsOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  // Mobile Menu
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-bars text-gray-700"></i>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-out Menu */}
            <div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-times text-gray-600"></i>
                  </button>
                </div>

                {/* User Section */}
                <div className="p-4 border-b border-gray-200">
                  <Link 
                    to="/profile" 
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="User" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">View Profile</p>
                    </div>
                  </Link>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto">
                  {menuSections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="mb-4">
                      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      {section.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          to={item.path}
                          onClick={handleMenuItemClick}
                          className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors ${
                            location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          <div className={`w-8 h-8 flex items-center justify-center ${item.color}`}>
                            <i className={`fa-solid ${item.icon}`}></i>
                          </div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action.action)}
                        className="flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                      >
                        <i className={`fa-solid ${action.icon} text-gray-600`}></i>
                        <span className="text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/help"
                    onClick={handleMenuItemClick}
                    className="block px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Help & Support
                  </Link>
                  <Link
                    to="/settings"
                    onClick={handleMenuItemClick}
                    className="block px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Settings & Privacy
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={handleMenuItemClick}
                      className="block px-2 py-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
      >
        <i className="fa-solid fa-bars text-gray-700"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Menu</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <i className="fa-solid fa-times text-gray-600 text-sm"></i>
              </button>
            </div>
            
            {/* User Profile */}
            <Link 
              to="/profile" 
              onClick={handleMenuItemClick}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="User" />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </Link>
          </div>

          {/* Menu Grid */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {menuSections.flatMap(section => section.items).map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center ${item.color}`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 flex items-center justify-center text-gray-600">
                    <i className={`fa-solid ${action.icon}`}></i>
                  </div>
                  <span className="text-xs text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 text-xs">
            <Link
              to="/help"
              onClick={handleMenuItemClick}
              className="text-gray-600 hover:text-gray-800"
            >
              Help
            </Link>
            <Link
              to="/settings"
              onClick={handleMenuItemClick}
              className="text-gray-600 hover:text-gray-800"
            >
              Settings
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                onClick={handleMenuItemClick}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Admin
              </Link>
            )}
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-800"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
