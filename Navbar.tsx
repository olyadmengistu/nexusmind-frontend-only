
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { User } from '../src/types';
import FeedbackForm from './FeedbackForm';
import NotificationDropdown from './NotificationDropdown';
import MessageDropdown from './MessageDropdown';
import MenuDropdown from './MenuDropdown';
import UserDropdown from './UserDropdown';
import SearchDropdown from './SearchDropdown';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: 'fa-house', path: '/', label: 'Home' },
    { icon: 'fa-video', path: '/videos', label: 'Problems' },
    { icon: 'fa-store', path: '/marketplace', label: 'Marketplace' },
    { icon: 'fa-users-viewfinder', path: '/groups', label: 'Groups' },
    { icon: 'fa-puzzle-piece', path: '/challenges', label: 'Challenges' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-gray-300 shadow-sm z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center justify-center w-10 h-10">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-brain text-white text-xl"></i>
              </div>
          </Link>
          <div className="hidden sm:block">
            <SearchDropdown user={user} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center h-full gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center w-[110px] h-full border-b-4 transition-all ${
                location.pathname === item.path ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xl`}></i>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Feedback Button - Desktop only */}
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="hidden lg:flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <i className="fa-solid fa-comment-dots mr-2"></i>
            Feedback
          </button>
          
          {/* Admin Link - Desktop only */}
          {user && user.isAdmin && (
            <Link 
              to="/admin"
              className="hidden lg:flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <i className="fa-solid fa-shield-halved mr-2"></i>
              Admin
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-700`}></i>
          </button>

          {/* Desktop dropdowns */}
          <div className="hidden md:flex items-center gap-2">
            <MenuDropdown user={user} onLogout={onLogout} />
            <MessageDropdown user={user} />
            <NotificationDropdown />
            <UserDropdown user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-[56px] left-0 right-0 bg-white shadow-lg border-b border-gray-200">
            <div className="p-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchDropdown user={user} />
              </div>
              
              {/* Mobile Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} text-lg w-5`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => {
                    setShowFeedbackForm(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <i className="fa-solid fa-comment-dots"></i>
                  Feedback
                </button>
                
                {user && user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    Admin
                  </Link>
                )}
                
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fa-solid fa-bell text-lg"></i>
                  </button>
                  <button className="flex-1 p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fa-solid fa-message text-lg"></i>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="flex-1 p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-sign-out-alt text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showFeedbackForm && (
        <FeedbackForm
          user={user}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={(feedback) => {
            setShowFeedbackForm(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
