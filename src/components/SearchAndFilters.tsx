import React from 'react';
import { Search, Crosshair, MapPin, X, Navigation, Map, Zap, Calendar, Bike } from 'lucide-react';
import { HOTSPOTS } from '../data/carparksData';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMode: 'postal' | 'gps';
  setSearchMode: (mode: 'postal' | 'gps') => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  selectedHotspotId: string;
  onSelectHotspot: (id: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  totalFoundCount: number;
  onTriggerSearch: () => void;
  onScrollToMap: () => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  radiusKm,
  setRadiusKm,
  selectedHotspotId,
  onSelectHotspot,
  activeFilter,
  setActiveFilter,
  totalFoundCount,
  onTriggerSearch,
  onScrollToMap,
  showMap,
  setShowMap,
}) => {
  const handleClear = () => {
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTriggerSearch();
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/80 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        {/* Row 1: Search mode tabs & Scope indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchMode('postal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                searchMode === 'postal'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Postal Code / Area</span>
            </button>

            <button
              onClick={() => {
                setSearchMode('gps');
                onTriggerSearch();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                searchMode === 'gps'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Use Current GPS</span>
            </button>
          </div>

          {/* Search scope selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="uppercase text-[11px] font-bold text-slate-500 tracking-wide">
              SEARCH SCOPE:
            </span>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              aria-label="Search Scope Radius"
              className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="0.5">0.5 km Walking</option>
              <option value="1.0">1.0 km Radius</option>
              <option value="1.5">1.5 km Radius</option>
              <option value="3.0">3.0 km Driving</option>
              <option value="5.0">5.0 km District</option>
            </select>
          </div>
        </div>

        {/* Row 2: Search Input and Actions */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onTriggerSearch();
          }}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter 6-digit postal code (e.g. 520284) or area name (e.g. Tampines, Orchard)..."
              className="block w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Action button: Find Nearby Lots */}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 text-[#3525cd] hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-[#3525cd]" />
            <span>Find Nearby Lots</span>
          </button>

          {/* Toggle Map View button */}
          <button
            type="button"
            onClick={() => {
              setShowMap(!showMap);
              if (!showMap) {
                setTimeout(onScrollToMap, 100);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              showMap
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map</span>
          </button>
        </form>

        {/* Row 3: Hotspots */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-bold text-slate-600 uppercase text-[11px] tracking-wider shrink-0">
            HOTSPOTS:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
            {HOTSPOTS.map((hotspot) => {
              const isSelected = selectedHotspotId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => onSelectHotspot(hotspot.id)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span>{hotspot.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs no-scrollbar border-t border-slate-100">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Lots ({totalFoundCount})
          </button>

          <button
            onClick={() => setActiveFilter('hdb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
              activeFilter === 'hdb'
                ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>HDB Only</span>
          </button>

          <button
            onClick={() => setActiveFilter('ura')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
              activeFilter === 'ura'
                ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>URA Surface</span>
          </button>

          <button
            onClick={() => setActiveFilter('ev')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
              activeFilter === 'ev'
                ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>EV Chargers</span>
          </button>

          <button
            onClick={() => setActiveFilter('freesun')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
              activeFilter === 'freesun'
                ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Free Sun/PH</span>
          </button>

          <button
            onClick={() => setActiveFilter('motor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer border ${
              activeFilter === 'motor'
                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-indigo-500" />
            <span>Motorbike lots</span>
          </button>
        </div>
      </div>
    </div>
  );
};
