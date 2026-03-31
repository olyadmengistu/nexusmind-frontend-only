import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User } from '../src/types';

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

interface SearchPageProps {
  user: User;
}

const SearchPage: React.FC<SearchPageProps> = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'problems' | 'videos' | 'users'>('all');

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const type = activeTab === 'all' ? 'all' : activeTab.slice(0, -1); // Remove 's' from plural
      const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchParams({ q: query });
      handleSearch();
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setTimeout(handleSearch, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[56px]">
      <div className="max-w-4xl mx-auto p-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search NexusMind..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Tabs */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
            <div className="flex gap-2">
              {(['all', 'problems', 'videos', 'users'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab !== 'all' && results && (
                    <span className="ml-2 text-sm opacity-75">
                      ({results[tab as keyof Omit<SearchResult, 'total'>].length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {results && !loading && (
          <div className="space-y-4">
            {/* Problems */}
            {(activeTab === 'all' || activeTab === 'problems') && results.problems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-question-circle text-blue-500"></i>
                  Problems ({results.problems.length})
                </h3>
                <div className="space-y-3">
                  {results.problems.map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/solutions/${problem.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-question-circle text-blue-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1">{problem.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{problem.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-user"></i>
                              {problem.author_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-calendar"></i>
                              {formatDate(problem.created_at)}
                            </span>
                            {problem.category && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">
                                {problem.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {(activeTab === 'all' || activeTab === 'videos') && results.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-video text-red-500"></i>
                  Videos ({results.videos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.videos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/videos`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-video text-gray-400"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{video.caption}</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-user"></i>
                              {video.author_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-solid fa-calendar"></i>
                              {formatDate(video.created_at)}
                            </span>
                          </div>
                          {video.problem_category && (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              {video.problem_category}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-users text-green-500"></i>
                  Users ({results.users.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.map((userResult) => (
                    <Link
                      key={userResult.id}
                      to={`/profile`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        {userResult.profile_image ? (
                          <img src={userResult.profile_image} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-user text-gray-600"></i>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{userResult.display_name}</h4>
                        <p className="text-sm text-gray-500 truncate">{userResult.email}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.total === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <i className="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse different categories</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search NexusMind</h3>
            <p className="text-gray-600">Find problems, videos, and users from the community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
