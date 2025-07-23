import React, { useState, useEffect } from "react";
import { Loader2, MapPin, X } from "lucide-react";

import { useDebounce } from "../../hooks/useDebounce";
import { useMap } from "../../context/map-context";
import { cn } from "../../lib/utils";
import { iconMap } from "../../lib/mapbox/utils";

export default function MapSearch() {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);

      try {
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) {
          console.error("Mapbox token not found");
          return;
        }

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            debouncedQuery
          )}.json?access_token=${token}&limit=5&country=IN`
        );

        const data = await res.json();
        setResults(data.features ?? []);
      } catch (err) {
        console.error("Geocoding error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setDisplayValue(value);
  };

  const handleSelect = (feature) => {
    if (map && feature.center) {
      map.flyTo({
        center: feature.center,
        zoom: 14,
        speed: 1.5,
        curve: 1,
        essential: true,
      });

      setDisplayValue(feature.place_name);
      setResults([]);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setDisplayValue("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <section className="absolute top-4 left-1/2 sm:left-4 z-10 w-[90vw] sm:w-[350px] -translate-x-1/2 sm:translate-x-0">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className={cn(
          "flex items-center justify-between px-3 py-2 gap-2",
          isOpen && "border-b border-gray-200"
        )}>
          <input
            type="text"
            placeholder="Search for factory location..."
            value={displayValue}
            onChange={handleInputChange}
            className="flex-1 outline-none text-sm placeholder-gray-500"
          />
          {displayValue && !isSearching && (
            <X
              className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              onClick={clearSearch}
            />
          )}
          {isSearching && (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          )}
        </div>

        {isOpen && (
          <div className="max-h-60 overflow-y-auto">
            {!query.trim() || isSearching ? null : results.length === 0 ? (
              <div className="py-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <p className="text-sm font-medium text-gray-900">No locations found</p>
                  <p className="text-xs text-gray-500">
                    Try a different search term
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-1">
                {results.map((location) => (
                  <div
                    key={location.id}
                    onClick={() => handleSelect(location)}
                    className="flex items-center py-3 px-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-1.5 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[270px]">
                          {location.text}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[270px]">
                          {location.place_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}