/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, MapPin, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { LiveStatusBar } from './components/LiveStatusBar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ResultsSummary } from './components/ResultsSummary';
import { CarparkCard } from './components/CarparkCard';
import { SpatialMap } from './components/SpatialMap';
import { CivicDataEngineSection } from './components/CivicDataEngineSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { GuideModal } from './components/GuideModal';
import { ErpView } from './components/ErpView';
import { TrafficCamerasView } from './components/TrafficCamerasView';
import { EvChargersView } from './components/EvChargersView';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { HealthMonitorModal } from './components/HealthMonitorModal';
import {
  TAMPINES_CARPARKS,
  MARINA_CARPARKS,
  ORCHARD_CARPARKS,
  BISHAN_CARPARKS,
  JURONG_CARPARKS,
  ANGMOKIO_CARPARKS,
  BEDOK_CARPARKS,
  BUGIS_CARPARKS,
  ALL_PRESET_CARPARKS,
  searchCarparksByQuery,
  HOTSPOTS,
  convertLtaItemToCarpark,
} from './data/carparksData';
import { Carpark, DrivingGuide, Hotspot } from './types';

export default function App() {
  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState<'parking' | 'erp' | 'cameras' | 'ev'>('parking');
  const [gpsActive, setGpsActive] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('520284');
  const [searchMode, setSearchMode] = useState<'postal' | 'gps'>('postal');
  const [radiusKm, setRadiusKm] = useState<number>(1.5);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('tampines');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showMap, setShowMap] = useState<boolean>(true);
  const [searchToast, setSearchToast] = useState<string | null>(null);

  // Active Modals State
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<DrivingGuide | null>(null);
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [healthModalOpen, setHealthModalOpen] = useState<boolean>(false);

  // User preferences
  const [vehicleType, setVehicleType] = useState<'car' | 'bike' | 'heavy'>('car');
  const [evMode, setEvMode] = useState<boolean>(false);

  // Dynamic LTA DataMall Ingest State
  const [ltaFeedData, setLtaFeedData] = useState<Carpark[] | null>(null);
  const [isLtaLoading, setIsLtaLoading] = useState<boolean>(false);

  // Fetch from /apt/carparks
  const fetchLtaFeed = useCallback(async (areaName?: string) => {
    setIsLtaLoading(true);
    try {
      const areaParam = areaName ? `?area=${encodeURIComponent(areaName)}` : '';
      const res = await fetch(`/apt/carparks${areaParam}`);
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.value) && json.value.length > 0) {
          const converted = json.value.map((item: any, idx: number) =>
            convertLtaItemToCarpark(item, idx)
          );
          setLtaFeedData(converted);
        }
      }
    } catch {
      // Graceful fallback to built-in datasets
    } finally {
      setIsLtaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLtaFeed();
  }, [fetchLtaFeed]);

  // Master catalog merging live DataMall feeds with preset catalog
  const masterCarparks = useMemo(() => {
    if (ltaFeedData && ltaFeedData.length > 0) {
      const liveCodes = new Set(ltaFeedData.map((d) => d.code.toLowerCase()));
      const remainingPresets = ALL_PRESET_CARPARKS.filter(
        (p) => !liveCodes.has(p.code.toLowerCase())
      );
      return [...ltaFeedData, ...remainingPresets];
    }
    return ALL_PRESET_CARPARKS;
  }, [ltaFeedData]);

  // Active hotspot information (if selected)
  const currentHotspot: Hotspot = useMemo(() => {
    const found = HOTSPOTS.find((h) => h.id === selectedHotspotId);
    return found || HOTSPOTS[0];
  }, [selectedHotspotId]);

  // Handle Hotspot selection
  const handleSelectHotspot = (hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
    const target = HOTSPOTS.find((h) => h.id === hotspotId);
    if (target) {
      setSearchQuery(target.postalCode);
      fetchLtaFeed(target.areaName);
      setSearchToast(`Switched to ${target.areaName} (${target.postalCode})`);
      setTimeout(() => setSearchToast(null), 2500);
    }
  };

  // Trigger search execution
  const handleTriggerSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchQuery('520284');
      setSelectedHotspotId('tampines');
      return;
    }

    // Check if query matches any known hotspot
    const matched = HOTSPOTS.find(
      (h) =>
        h.postalCode.includes(trimmed) ||
        h.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        h.areaName.toLowerCase().includes(trimmed.toLowerCase()) ||
        h.id.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      setSelectedHotspotId(matched.id);
      fetchLtaFeed(matched.areaName);
      setSearchToast(`Found ${matched.areaName} lots`);
    } else {
      setSelectedHotspotId('custom');
      fetchLtaFeed(trimmed);
      setSearchToast(`Searched for "${trimmed}"`);
    }

    setTimeout(() => setSearchToast(null), 2500);

    // Scroll to results section
    const resultsEl = document.getElementById('carparks-results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter Carparks based on search query, radius, and active filter pill
  const filteredCarparks = useMemo(() => {
    let list: Carpark[] = [];
    const trimmed = searchQuery.trim();

    if (trimmed) {
      // If default Tampines postal code and Tampines hotspot active:
      if (trimmed === '520284' && selectedHotspotId === 'tampines') {
        list = [...TAMPINES_CARPARKS];
      } else {
        // Perform instant fuzzy search across the catalog
        list = searchCarparksByQuery(trimmed, masterCarparks);

        // Fallback check: if no direct match, check if query matched hotspot area
        if (list.length === 0) {
          const matchedHotspot = HOTSPOTS.find(
            (h) =>
              h.name.toLowerCase().includes(trimmed.toLowerCase()) ||
              h.areaName.toLowerCase().includes(trimmed.toLowerCase()) ||
              h.postalCode.includes(trimmed)
          );
          if (matchedHotspot) {
            if (matchedHotspot.id === 'marinabay') list = [...MARINA_CARPARKS];
            else if (matchedHotspot.id === 'orchard') list = [...ORCHARD_CARPARKS];
            else if (matchedHotspot.id === 'bishan') list = [...BISHAN_CARPARKS];
            else if (matchedHotspot.id === 'jurong') list = [...JURONG_CARPARKS];
            else if (matchedHotspot.id === 'angmokio') list = [...ANGMOKIO_CARPARKS];
            else list = [...TAMPINES_CARPARKS];
          }
        }
      }
    } else {
      // Empty search query -> fallback to selected hotspot or default
      if (selectedHotspotId === 'marinabay') list = [...MARINA_CARPARKS];
      else if (selectedHotspotId === 'orchard') list = [...ORCHARD_CARPARKS];
      else if (selectedHotspotId === 'bishan') list = [...BISHAN_CARPARKS];
      else if (selectedHotspotId === 'jurong') list = [...JURONG_CARPARKS];
      else if (selectedHotspotId === 'angmokio') list = [...ANGMOKIO_CARPARKS];
      else list = [...TAMPINES_CARPARKS];
    }

    // Radius Scope Filter
    if (radiusKm && list.length > 0) {
      const maxMeters = radiusKm * 1000;
      const withinRadius = list.filter((c) => c.distanceMeters <= maxMeters);
      if (withinRadius.length > 0) {
        list = withinRadius;
      }
    }

    // Filter pills
    if (activeFilter === 'hdb') {
      list = list.filter((c) => c.agency === 'HDB');
    } else if (activeFilter === 'ura') {
      list = list.filter((c) => c.agency === 'URA');
    } else if (activeFilter === 'ev' || evMode) {
      list = list.filter((c) => c.hasEv);
    } else if (activeFilter === 'freesun') {
      list = list.filter((c) => c.hasFreeSunPh);
    } else if (activeFilter === 'motor' || vehicleType === 'bike') {
      list = list.filter((c) => c.motorLots > 0);
    }

    return list;
  }, [
    searchQuery,
    selectedHotspotId,
    masterCarparks,
    radiusKm,
    activeFilter,
    evMode,
    vehicleType,
  ]);

  const scrollToMap = () => {
    const el = document.getElementById('spatial-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute live totals from filtered carparks
  const liveAvailableCount = useMemo(() => {
    if (filteredCarparks.length === 0) return 0;
    return filteredCarparks.reduce((sum, cp) => sum + cp.availableLots, 0);
  }, [filteredCarparks]);

  const liveTotalCount = useMemo(() => {
    if (filteredCarparks.length === 0) return 0;
    return filteredCarparks.reduce((sum, cp) => sum + cp.totalLots, 0);
  }, [filteredCarparks]);

  // Dynamic Results Summary content
  const summaryData = useMemo(() => {
    const trimmed = searchQuery.trim();

    if (trimmed === '520284' && selectedHotspotId === 'tampines') {
      return {
        areaName: 'Tampines Central',
        postalCode: '520284',
        totalLots: 1420,
        availableLots: 486,
        avgRate: '$0.60 /30m',
        nearestDistance: '180m (2 min walk)',
        erpCount: 0,
      };
    }

    const matchedHotspot = HOTSPOTS.find(
      (h) =>
        h.postalCode === trimmed ||
        h.id === selectedHotspotId ||
        h.name.toLowerCase() === trimmed.toLowerCase() ||
        h.areaName.toLowerCase() === trimmed.toLowerCase()
    );

    if (matchedHotspot) {
      return {
        areaName: matchedHotspot.areaName,
        postalCode: matchedHotspot.postalCode,
        totalLots: liveTotalCount > 0 ? liveTotalCount : matchedHotspot.totalLots,
        availableLots: liveAvailableCount > 0 ? liveAvailableCount : matchedHotspot.availableLots,
        avgRate: matchedHotspot.avgRate.includes('/30m') ? matchedHotspot.avgRate : `${matchedHotspot.avgRate} /30m`,
        nearestDistance: matchedHotspot.nearestDistance,
        erpCount: matchedHotspot.erpCount,
      };
    }

    // Custom Search Query Display
    const firstMatch = filteredCarparks[0];
    return {
      areaName: trimmed ? `Search: "${trimmed}"` : 'All Singapore',
      postalCode: firstMatch ? firstMatch.postalCode : 'Singapore',
      totalLots: liveTotalCount,
      availableLots: liveAvailableCount,
      avgRate: firstMatch ? firstMatch.shortRate : '$0.60 /30m',
      nearestDistance: firstMatch
        ? `${firstMatch.distanceMeters}m (${firstMatch.walkMinutes} min walk)`
        : 'N/A',
      erpCount: firstMatch?.erpGantryFee ? 2 : 0,
    };
  }, [
    searchQuery,
    selectedHotspotId,
    filteredCarparks,
    liveTotalCount,
    liveAvailableCount,
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* 1. Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gpsActive={gpsActive}
        onToggleGps={() => setGpsActive(!gpsActive)}
        onOpenUserModal={() => setUserModalOpen(true)}
        onOpenHealthModal={() => setHealthModalOpen(true)}
      />

      {/* 2. Live Data Status Bar */}
      <LiveStatusBar
        onManualRefresh={() => fetchLtaFeed()}
        onOpenHealthModal={() => setHealthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'parking' && (
          <>
            {/* Search, Scope, Hotspots, and Filter Pills */}
            <SearchAndFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              radiusKm={radiusKm}
              setRadiusKm={setRadiusKm}
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={handleSelectHotspot}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              totalFoundCount={filteredCarparks.length}
              onTriggerSearch={handleTriggerSearch}
              onScrollToMap={scrollToMap}
              showMap={showMap}
              setShowMap={setShowMap}
            />

            {/* Results Summary Bar */}
            <ResultsSummary
              areaName={summaryData.areaName}
              postalCode={summaryData.postalCode}
              count={filteredCarparks.length}
              radiusKm={radiusKm}
              nearestDistance={summaryData.nearestDistance}
              erpCount={summaryData.erpCount}
              totalLots={summaryData.totalLots}
              availableLots={summaryData.availableLots}
              estRate={summaryData.avgRate}
            />

            {/* Live Search Status Feedback Banner */}
            {searchToast && (
              <div className="bg-indigo-50 border-b border-indigo-100 py-2 px-4 transition-all animate-in fade-in slide-in-from-top-2">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-[#3525cd]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#3525cd] animate-pulse" />
                    <span>{searchToast}</span>
                  </div>
                  <span className="text-[11px] text-indigo-500 font-medium">
                    Showing {filteredCarparks.length} matching lots
                  </span>
                </div>
              </div>
            )}

            {/* Container for Carpark Cards Grid & Map */}
            <div id="carparks-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* 3-Column Carpark Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCarparks.map((carpark) => (
                  <CarparkCard
                    key={carpark.id}
                    carpark={carpark}
                    onOpenDirections={(cp) => setSelectedCarpark(cp)}
                    onOpenDetails={(cp) => setSelectedCarpark(cp)}
                    onOpenErpModal={() => setActiveTab('erp')}
                  />
                ))}
              </div>

              {filteredCarparks.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 my-4 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    No carparks found matching "{searchQuery}"
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    We couldn't find any parking facilities matching this search query within {radiusKm} km. Try one of our popular Singapore transit hubs below:
                  </p>

                  <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                    <button
                      onClick={() => handleSelectHotspot('tampines')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tampines Hub (520284)
                    </button>
                    <button
                      onClick={() => handleSelectHotspot('marinabay')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Marina Bay CBD (018956)
                    </button>
                    <button
                      onClick={() => handleSelectHotspot('orchard')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Orchard Shopping Belt (238801)
                    </button>
                    <button
                      onClick={() => handleSelectHotspot('bishan')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Bishan Junction 8 (579837)
                    </button>
                    <button
                      onClick={() => handleSelectHotspot('jurong')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Jurong East MRT (609731)
                    </button>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSearchQuery('520284');
                        setSelectedHotspotId('tampines');
                        setActiveFilter('all');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#3525cd] hover:bg-[#2a1ca8] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      Reset to Tampines (520284)
                    </button>
                  </div>
                </div>
              )}

              {/* Spatial GPS Overlay Map */}
              {showMap && (
                <SpatialMap
                  carparks={filteredCarparks}
                  areaName={summaryData.areaName}
                  postalCode={summaryData.postalCode}
                  onSelectCarpark={(cp) => setSelectedCarpark(cp)}
                  onOpenDirections={(cp) => setSelectedCarpark(cp)}
                />
              )}

              {/* Civic Mobility Data Engine, Proposal Focus & Driving Guides */}
              <CivicDataEngineSection
                onSelectGuide={(g) => setSelectedGuide(g)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Frequently Asked Questions */}
              <FaqSection />
            </div>
          </>
        )}

        {/* Tab 2: ERP Gantries View */}
        {activeTab === 'erp' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErpView />
          </div>
        )}

        {/* Tab 3: Traffic Cameras View */}
        {activeTab === 'cameras' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrafficCamerasView />
          </div>
        )}

        {/* Tab 4: EV Charging Stations View */}
        {activeTab === 'ev' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EvChargersView />
          </div>
        )}
      </main>

      {/* Global GovTech Footer */}
      <Footer
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenHealthModal={() => setHealthModalOpen(true)}
      />

      {/* Carpark Detail / Directions Modal */}
      <CarparkDetailModal
        carpark={selectedCarpark}
        onClose={() => setSelectedCarpark(null)}
      />

      {/* Singapore Driving Guide Modal */}
      <GuideModal
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
      />

      {/* Driver Preferences Modal */}
      <UserPreferencesModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        evMode={evMode}
        setEvMode={setEvMode}
      />

      {/* API Health & LTA DataMall Monitor Modal */}
      <HealthMonitorModal
        isOpen={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
      />
    </div>
  );
}

