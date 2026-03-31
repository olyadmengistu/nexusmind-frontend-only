import React, { useState, useRef, useEffect } from 'react';
import { Feeling, FEELINGS, getFeelingsByCategory, searchFeelings } from '../constants/feelings';

interface FeelingSelectorProps {
  selectedFeeling?: Feeling;
  onFeelingSelect: (feeling: Feeling | undefined) => void;
  className?: string;
}

const FeelingSelector: React.FC<FeelingSelectorProps> = ({ 
  selectedFeeling, 
  onFeelingSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feeling' | 'activity'>('feeling');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeelings, setFilteredFeelings] = useState<Feeling[]>([]);
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

  // Filter feelings based on search and tab
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredFeelings(searchFeelings(searchQuery));
    } else {
      setFilteredFeelings(getFeelingsByCategory(activeTab));
    }
  }, [searchQuery, activeTab]);

  const handleFeelingClick = (feeling: Feeling) => {
    onFeelingSelect(feeling);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleRemoveFeeling = () => {
    onFeelingSelect(undefined);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setActiveTab('feeling');
    }
  };

  const feelings = searchQuery.trim() ? filteredFeelings : getFeelingsByCategory(activeTab);

  return (
    <div className={`feeling-selector ${className}`} ref={dropdownRef}>
      {/* Selected Feeling Display */}
      {selectedFeeling ? (
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm">
          <span className="text-lg">{selectedFeeling.emoji}</span>
          <span className="font-medium">{selectedFeeling.label}</span>
          <button
            onClick={handleRemoveFeeling}
            className="ml-1 text-yellow-600 hover:text-yellow-800"
          >
            <i className="fa-solid fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
        >
          <i className="fa-regular fa-face-smile text-yellow-500"></i>
          Add feeling/activity
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search feelings or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
                autoFocus
              />
            </div>
          </div>

          {/* Tabs (only show when not searching) */}
          {!searchQuery.trim() && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('feeling')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'feeling'
                    ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                😊 Feelings
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'activity'
                    ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🎯 Activities
              </button>
            </div>
          )}

          {/* Feelings Grid */}
          <div className="max-h-64 overflow-y-auto p-3">
            {feelings.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {feelings.map(feeling => (
                  <button
                    key={feeling.id}
                    onClick={() => handleFeelingClick(feeling)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-yellow-50 transition-colors group"
                    title={feeling.label}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {feeling.emoji}
                    </span>
                    <span className="text-xs text-center text-gray-600 line-clamp-2">
                      {feeling.label.replace('feeling ', '').replace('watching ', '').replace('listening to ', '').replace('reading ', '').replace('playing ', '').replace('eating ', '').replace('drinking ', '').replace('at ', '').replace('on ', '').replace('in ', '').replace('doing ', '').replace('taking ', '').replace('celebrating ', '').replace('starting ', '').replace('enjoying ', '')}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No feelings or activities found
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

export default FeelingSelector;
