import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../src/config/api';

interface SearchResult {
  problems: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    author_name: string;
    author_image: string;
    created_at: string;
  }>;
  videos: Array<{
    id: string;
    caption: string;
    problem_category: string;
    author_name: string;
    author_image: string;
    created_at: string;
    file_path: string;
  }>;
  users: Array<{
    id: string;
    display_name: string;
    email: string;
    profile_image: string;
  }>;
  total: number;
}

interface SearchDropdownProps {
  user: any;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{text: string, type: string}>>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_SUGGESTIONS}?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH}?q=${encodeURIComponent(searchQuery)}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: {text: string, type: string}) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative group hidden sm:block">
      <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"></i>
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Search NexusMind..." 
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsOpen(true)}
        className="bg-[#F0F2F5] pl-10 pr-10 py-2 rounded-full w-[240px] focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-sm"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
          {query.length < 2 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}

          {query.length >= 2 && !results && !loading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">SUGGESTIONS</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <i className={`fa-solid fa-${suggestion.type === 'problem' ? 'question-circle' : suggestion.type === 'video' ? 'video' : 'user'} text-gray-400 text-sm`}></i>
                  <span className="text-sm">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="p-4 text-center text-gray-500 text-sm">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Searching...
            </div>
          )}

          {results && (
            <div className="p-2">
              {results.problems.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-2">PROBLEMS ({results.problems.length})</div>
                  {results.problems.slice(0, 3).map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/solutions/${problem.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      <div className="flex items-start gap-2">
                        <i className="fa-solid fa-question-circle text-blue-500 mt-1"></i>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{problem.title}</div>
                          <div className="text-xs text-gray-500 truncate">{problem.description}</div>
                          <div className="text-xs text-gray-400 mt-1">by {problem.author_name}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.videos.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-2">VIDEOS ({results.videos.length})</div>
                  {results.videos.slice(0, 3).map((video) => (
                    <Link
                      key={video.id}
                      to={`/videos`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      <div className="flex items-start gap-2">
                        <i className="fa-solid fa-video text-red-500 mt-1"></i>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{video.caption}</div>
                          <div className="text-xs text-gray-500">{video.problem_category}</div>
                          <div className="text-xs text-gray-400 mt-1">by {video.author_name}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.users.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-2">USERS ({results.users.length})</div>
                  {results.users.slice(0, 3).map((userResult) => (
                    <Link
                      key={userResult.id}
                      to={`/profile`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {userResult.profile_image ? (
                            <img src={userResult.profile_image} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <i className="fa-solid fa-user text-gray-600 text-xs"></i>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{userResult.display_name}</div>
                          <div className="text-xs text-gray-500 truncate">{userResult.email}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.total === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found for "{query}"
                </div>
              )}

              {results.total > 0 && (
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={() => handleSearch()}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all {results.total} results
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
