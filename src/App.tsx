/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

  // Active hotspot information
  const currentHotspot: Hotspot = useMemo(() => {
    const found = HOTSPOTS.find((h) => h.id === selectedHotspotId);
    return found || HOTSPOTS[0];
  }, [selectedHotspotId]);

  // Handle Hotspot switch
  const handleSelectHotspot = (hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
    const target = HOTSPOTS.find((h) => h.id === hotspotId);
    if (target) {
      setSearchQuery(target.postalCode);
      if (target.id === 'marinabay') {
        fetchLtaFeed('Marina');
      } else if (target.id === 'tampines') {
        fetchLtaFeed('Tampines');
      }
    }
  };

  // Trigger search execution
  const handleTriggerSearch = () => {
    const trimmed = searchQuery.trim().toLowerCase();
    const matched = HOTSPOTS.find(
      (h) =>
        h.postalCode.includes(trimmed) ||
        h.name.toLowerCase().includes(trimmed) ||
        h.areaName.toLowerCase().includes(trimmed)
    );
    if (matched) {
      setSelectedHotspotId(matched.id);
      fetchLtaFeed(matched.areaName);
    } else {
      fetchLtaFeed(trimmed);
    }
  };

  // Filter Carparks based on active hotspot and filter
  const filteredCarparks = useMemo(() => {
    let list: Carpark[] = [];

    if (selectedHotspotId === 'marinabay') {
      list = [...MARINA_CARPARKS];
    } else if (selectedHotspotId === 'tampines') {
      list = [...TAMPINES_CARPARKS];
    } else if (ltaFeedData && ltaFeedData.length > 0) {
      list = [...ltaFeedData];
    } else {
      list = [...TAMPINES_CARPARKS];
    }

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
  }, [selectedHotspotId, ltaFeedData, activeFilter, evMode, vehicleType]);

  const scrollToMap = () => {
    const el = document.getElementById('spatial-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute live available sum
  const liveAvailableCount = useMemo(() => {
    if (filteredCarparks.length === 0) return 0;
    return filteredCarparks.reduce((sum, cp) => sum + cp.availableLots, 0);
  }, [filteredCarparks]);

  const liveTotalCount = useMemo(() => {
    if (filteredCarparks.length === 0) return 0;
    return filteredCarparks.reduce((sum, cp) => sum + cp.totalLots, 0);
  }, [filteredCarparks]);

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
              areaName={currentHotspot.areaName}
              postalCode={currentHotspot.postalCode}
              count={filteredCarparks.length}
              radiusKm={radiusKm}
              nearestDistance={currentHotspot.nearestDistance}
              erpCount={currentHotspot.erpCount}
              totalLots={
                selectedHotspotId === 'tampines' ? currentHotspot.totalLots : liveTotalCount
              }
              availableLots={
                selectedHotspotId === 'tampines' ? currentHotspot.availableLots : liveAvailableCount
              }
              estRate={currentHotspot.avgRate}
            />

            {/* Container for Carpark Cards Grid & Map */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 my-4">
                  <p className="text-sm font-semibold text-slate-700">
                    No carparks matched this filter in {currentHotspot.areaName}.
                  </p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-[#3525cd] text-white text-xs font-bold cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Spatial GPS Overlay Map */}
              {showMap && (
                <SpatialMap
                  carparks={filteredCarparks}
                  areaName={currentHotspot.areaName}
                  postalCode={currentHotspot.postalCode}
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

