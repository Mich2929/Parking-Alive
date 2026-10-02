import React from 'react';
import { Navigation, User, MapPin, Activity } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: 'parking' | 'erp' | 'cameras' | 'ev';
  setActiveTab: (tab: 'parking' | 'erp' | 'cameras' | 'ev') => void;
  gpsActive: boolean;
  onToggleGps: () => void;
  onOpenUserModal?: () => void;
  onOpenHealthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gpsActive,
  onToggleGps,
  onOpenUserModal,
  onOpenHealthModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('parking')}
              className="flex items-center text-left focus:outline-hidden group cursor-pointer"
            >
              <Logo size="md" />
            </button>

            {/* Singapore GPS Active Pill */}
            <button
              onClick={onToggleGps}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                gpsActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle GPS Simulation"
            >
              <span className="relative flex h-2 w-2">
                {gpsActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    gpsActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                ></span>
              </span>
              <span>{gpsActive ? 'Singapore GPS Active' : 'Enable SG GPS'}</span>
            </button>
          </div>

          {/* Center Navigation Segmented Buttons */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab('parking')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'parking'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parking Lots
            </button>
            <button
              onClick={() => setActiveTab('erp')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'erp'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ERP Gantries
            </button>
            <button
              onClick={() => setActiveTab('cameras')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cameras'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Traffic Cameras
            </button>
            <button
              onClick={() => setActiveTab('ev')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ev'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EV Charging
            </button>
          </nav>

          {/* Right Agency, API Health & User */}
          <div className="flex items-center gap-2.5">
            {/* LTA API Health button */}
            <button
              onClick={onOpenHealthModal}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-[#3525cd] border border-slate-200 transition-colors"
              title="Monitor LTA API & System Health"
            >
              <Activity className="w-3.5 h-3.5 text-[#3525cd]" />
              <span>API Health</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold">
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                HDB
              </span>
              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                URA
              </span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                LTA
              </span>
            </div>

            <button
              onClick={onOpenUserModal}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              aria-label="User Profile"
              title="Driver Profile & Preferences"
            >
              <User className="w-5 h-5 text-indigo-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
