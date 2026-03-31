import React, { useState, useRef, useEffect } from 'react';
import { BackgroundColor, BACKGROUND_COLORS, getBackgroundColorsByType } from '../constants/backgroundColors';

interface MoreOptionsProps {
  selectedBackgroundColor?: BackgroundColor;
  onBackgroundColorSelect: (color: BackgroundColor | undefined) => void;
  className?: string;
}

const MoreOptions: React.FC<MoreOptionsProps> = ({ 
  selectedBackgroundColor, 
  onBackgroundColorSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'background' | 'more'>('background');
  const [colorType, setColorType] = useState<'solid' | 'gradient'>('solid');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleBackgroundColorSelect = (color: BackgroundColor) => {
    onBackgroundColorSelect(color);
    setIsOpen(false);
  };

  const handleRemoveBackgroundColor = () => {
    onBackgroundColorSelect(undefined);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const colors = colorType === 'solid' 
    ? getBackgroundColorsByType('solid') 
    : getBackgroundColorsByType('gradient');

  return (
    <div className={`more-options ${className}`} ref={dropdownRef}>
      {/* Selected Background Display */}
      {selectedBackgroundColor ? (
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{
              backgroundColor: selectedBackgroundColor.gradient ? undefined : selectedBackgroundColor.color,
              background: selectedBackgroundColor.gradient || undefined
            }}
          ></div>
          <span className="font-medium">{selectedBackgroundColor.name}</span>
          <button
            onClick={handleRemoveBackgroundColor}
            className="ml-1 text-gray-600 hover:text-gray-800"
          >
            <i className="fa-solid fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
        >
          <i className="fa-solid fa-ellipsis text-gray-400"></i>
          More options
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('background')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'background'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className="fa-solid fa-palette mr-1"></i>
              Background
            </button>
            <button
              onClick={() => setActiveTab('more')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'more'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className="fa-solid fa-cog mr-1"></i>
              More
            </button>
          </div>

          {/* Background Tab Content */}
          {activeTab === 'background' && (
            <div className="p-3">
              {/* Color Type Toggle */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setColorType('solid')}
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                    colorType === 'solid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Solid Colors
                </button>
                <button
                  onClick={() => setColorType('gradient')}
                  className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
                    colorType === 'gradient'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Gradients
                </button>
              </div>

              {/* Color Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleBackgroundColorSelect(color)}
                    className={`relative group rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      selectedBackgroundColor?.id === color.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    title={color.name}
                  >
                    <div 
                      className="w-full h-12 border border-gray-200"
                      style={{
                        backgroundColor: color.gradient ? undefined : color.color,
                        background: color.gradient || undefined
                      }}
                    ></div>
                    {selectedBackgroundColor?.id === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <i className="fa-solid fa-check text-white text-lg"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Remove Background Button */}
              {selectedBackgroundColor && (
                <button
                  onClick={handleRemoveBackgroundColor}
                  className="w-full mt-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Remove background
                </button>
              )}
            </div>
          )}

          {/* More Tab Content */}
          {activeTab === 'more' && (
            <div className="p-3">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-font text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Font size</div>
                    <div className="text-xs text-gray-500">Change text size</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-bold text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Bold text</div>
                    <div className="text-xs text-gray-500">Make text bold</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-align-left text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Text alignment</div>
                    <div className="text-xs text-gray-500">Align text left, center, or right</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-poll text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Create poll</div>
                    <div className="text-xs text-gray-500">Add a poll to your post</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-calendar text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Schedule post</div>
                    <div className="text-xs text-gray-500">Schedule for later</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-gif text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Add GIF</div>
                    <div className="text-xs text-gray-500">Search and add GIFs</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <i className="fa-solid fa-question-circle text-gray-500 w-5"></i>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Help & support</div>
                    <div className="text-xs text-gray-500">Get help with posting</div>
                  </div>
                </button>
              </div>
            </div>
          )}

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

export default MoreOptions;
