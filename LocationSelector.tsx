import React, { useState, useRef, useEffect } from 'react';

interface Location {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  selectedLocation?: Location;
  onLocationSelect: (location: Location | undefined) => void;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  selectedLocation, 
  onLocationSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search locations when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const searchLocations = async () => {
      setLoading(true);
      try {
        // Using Nominatim API for geocoding (free and no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=5`
        );
        
        if (response.ok) {
          const data = await response.json();
          const locations: Location[] = data.map((item: any) => ({
            name: item.display_name,
            coordinates: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }
          }));
          setSearchResults(locations);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Location search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchLocations();
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

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveLocation = () => {
    onLocationSelect(undefined);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const locationName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            handleLocationSelect({
              name: locationName,
              coordinates: {
                lat: latitude,
                lng: longitude
              }
            });
          } else {
            handleLocationSelect({
              name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              coordinates: {
                lat: latitude,
                lng: longitude
              }
            });
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          const { latitude, longitude } = position.coords;
          handleLocationSelect({
            name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coordinates: {
              lat: latitude,
              lng: longitude
            }
          });
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your browser settings.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Common locations for quick selection
  const commonLocations: Location[] = [
    { name: 'New York, NY, USA' },
    { name: 'Los Angeles, CA, USA' },
    { name: 'Chicago, IL, USA' },
    { name: 'Houston, TX, USA' },
    { name: 'Phoenix, AZ, USA' },
    { name: 'Philadelphia, PA, USA' },
    { name: 'San Antonio, TX, USA' },
    { name: 'San Diego, CA, USA' },
    { name: 'Dallas, TX, USA' },
    { name: 'San Jose, CA, USA' }
  ];

  return (
    <div className={`location-selector ${className}`} ref={dropdownRef}>
      {/* Selected Location Display */}
      {selectedLocation ? (
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm">
          <i className="fa-solid fa-location-dot"></i>
          <span className="font-medium">{selectedLocation.name}</span>
          <button
            onClick={handleRemoveLocation}
            className="ml-1 text-red-600 hover:text-red-800"
          >
            <i className="fa-solid fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm transition-colors"
        >
          <i className="fa-solid fa-location-dot text-red-500"></i>
          Add location
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
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                autoFocus
              />
            </div>
          </div>

          {/* Current Location Button */}
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {gettingLocation ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Getting location...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-crosshairs"></i>
                  Use current location
                </>
              )}
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((location, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <i className="fa-solid fa-location-dot text-red-500 mt-0.5"></i>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {location.name}
                    </div>
                    {location.coordinates && (
                      <div className="text-xs text-gray-500">
                        {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No locations found
              </div>
            ) : (
              /* Common Locations */
              <div className="p-3">
                <div className="text-xs text-gray-500 font-medium mb-2">Popular locations</div>
                <div className="space-y-1">
                  {commonLocations.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-start gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded"
                    >
                      <i className="fa-solid fa-location-dot text-red-500 mt-0.5 text-xs"></i>
                      <div className="text-sm text-gray-700">{location.name}</div>
                    </div>
                  ))}
                </div>
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

export default LocationSelector;
