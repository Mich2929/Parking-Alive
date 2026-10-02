import React from 'react';
import { ChevronRight, Eye, ShieldAlert, Sparkles, Video, Zap, Compass, Car } from 'lucide-react';
import { DRIVING_GUIDES } from '../data/guidesData';
import { DrivingGuide } from '../types';

interface CivicDataEngineSectionProps {
  onSelectGuide: (guide: DrivingGuide) => void;
  onNavigateTab: (tab: 'parking' | 'erp' | 'cameras' | 'ev') => void;
}

export const CivicDataEngineSection: React.FC<CivicDataEngineSectionProps> = ({
  onSelectGuide,
  onNavigateTab,
}) => {
  return (
    <section className="py-8 my-4 border-t border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols on desktop): Problem Proposal, Civic Engine description, and 4 Feature Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Proposal Callout Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  SOLVING THE CORE PROBLEM
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  Proposal Focus
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                Eliminating Driver Wastage of Time in Downtown & Busy Areas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Time is precious. During peak hours, drivers lose up to 20 minutes circling blocks
                for parking. ParkWhere SG displays real-time lot availability with instant{' '}
                <strong className="text-emerald-700 font-bold">Green</strong> /{' '}
                <strong className="text-amber-700 font-bold">Amber</strong> /{' '}
                <strong className="text-rose-700 font-bold">Red</strong> indicators so you make
                efficient decisions before setting off.
              </p>
            </div>
          </div>

          {/* Civic Mobility Data Engine Heading */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#3525cd]">
              CIVIC MOBILITY DATA ENGINE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Find available parking in Singapore, in real time
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3 mt-3">
              <p>
                <strong>ParkWhere SG</strong> shows you live carpark availability across Singapore —
                HDB, URA, and LTA carparks — sorted by distance from wherever you are. Allow
                location access and you'll instantly see the nearest carparks that still have free
                lots, colour-coded so you can read availability at a glance, with one tap to open
                Google Maps directions. The data refreshes automatically every minute, drawn from
                Singapore's official LTA DataMall open-data feeds.
              </p>
              <p>
                Beyond finding a space, ParkWhere SG helps you drive smarter. Check{' '}
                <button
                  onClick={() => onNavigateTab('erp')}
                  className="text-[#3525cd] font-semibold underline underline-offset-2 hover:text-indigo-800 cursor-pointer"
                >
                  ERP rates
                </button>{' '}
                and which gantries a trip will pass before you set off, glance at{' '}
                <button
                  onClick={() => onNavigateTab('cameras')}
                  className="text-[#3525cd] font-semibold underline underline-offset-2 hover:text-indigo-800 cursor-pointer"
                >
                  live traffic cameras
                </button>{' '}
                to gauge expressway congestion, and locate nearby{' '}
                <button
                  onClick={() => onNavigateTab('ev')}
                  className="text-[#3525cd] font-semibold underline underline-offset-2 hover:text-indigo-800 cursor-pointer"
                >
                  EV fast-charging stations
                </button>
                . It's completely free, works smoothly in any mobile browser, and requires no app
                install or sign-up.
              </p>
            </div>
          </div>

          {/* 4 Feature Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {/* Card 1: Real-time Carpark lots */}
            <div
              onClick={() => onNavigateTab('parking')}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-[#3525cd]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3525cd] font-extrabold text-sm flex items-center justify-center mb-2.5">
                P
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#3525cd] transition-colors">
                Real-time carpark lots
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Nearest HDB, URA and LTA carparks with available lots, sorted by distance and refreshed every minute.
              </p>
            </div>

            {/* Card 2: ERP rates */}
            <div
              onClick={() => onNavigateTab('erp')}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-amber-500 border-dashed animate-spin"></span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                ERP rates & route planning
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                See which ERP gantries your trip passes and the exact charges at your departure time.
              </p>
            </div>

            {/* Card 3: Live Traffic Cameras */}
            <div
              onClick={() => onNavigateTab('cameras')}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2.5">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Live traffic cameras
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Peek at LTA expressway camera snapshots near your route to check congestion before leaving home.
              </p>
            </div>

            {/* Card 4: EV Charging Stations */}
            <div
              onClick={() => onNavigateTab('ev')}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                EV charging stations
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Find nearby electric-vehicle charging points, power rating (kW), and live connector availability.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols on desktop): 3 Quick Steps & Singapore Driving Guides */}
        <div className="lg:col-span-5 space-y-6">
          {/* How it works in 3 quick steps */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-4">
              How it works in 3 quick steps
            </h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3525cd] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-semibold">Share your location</strong> (or search an area name or postal code) so we know where to search.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3525cd] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-semibold">Scan the live list</strong> of nearest carparks, with free-lot counts color-coded green, amber, or red.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3525cd] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-semibold">Tap any carpark</strong> to launch turn-by-turn driving directions in Google Maps, with ERP and traffic checked along the way.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Singapore Driving Guides (2026 EDITION) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Singapore Driving Guides
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                2026 EDITION
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {DRIVING_GUIDES.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => onSelectGuide(guide)}
                  className="w-full text-left py-3 flex items-center justify-between group hover:text-[#3525cd] transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-[#3525cd] transition-colors pr-2">
                    {guide.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#3525cd] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
