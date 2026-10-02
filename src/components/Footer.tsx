import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: 'parking' | 'erp' | 'cameras' | 'ev') => void;
  onOpenHealthModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenHealthModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 pt-10 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100">
          {/* Brand & Description */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#3525cd] flex items-center justify-center text-white font-extrabold text-xs">
                P
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                ParkWhere<span className="text-[#3525cd]">SG</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Real-time civic mobility and carpark intelligence platform aggregated from official
              Singapore Open Data endpoints. Built for drivers, riders, and transport planners.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SYNCED: LIVE FEED
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                API V2.4 (ONE-MINUTE INTERVALS)
              </span>
            </div>
          </div>

          {/* Mobility Modules */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-[11px] text-slate-900 uppercase tracking-wider">
              MOBILITY MODULES
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('parking')}
                  className="hover:text-[#3525cd] transition-colors cursor-pointer text-left"
                >
                  Carpark Availability
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('erp')}
                  className="hover:text-[#3525cd] transition-colors cursor-pointer text-left"
                >
                  ERP Gantry Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('cameras')}
                  className="hover:text-[#3525cd] transition-colors cursor-pointer text-left"
                >
                  Expressway Webcams
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('ev')}
                  className="hover:text-[#3525cd] transition-colors cursor-pointer text-left"
                >
                  EV Fast Chargers
                </button>
              </li>
              {onOpenHealthModal && (
                <li>
                  <button
                    onClick={onOpenHealthModal}
                    className="text-[#3525cd] font-semibold hover:underline transition-colors cursor-pointer text-left flex items-center gap-1"
                  >
                    <span>API Health Monitor</span>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-200 px-1 rounded">
                      /apt/health
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Official Portals */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-[11px] text-slate-900 uppercase tracking-wider">
              OFFICIAL PORTALS
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://www.hdb.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#3525cd] transition-colors"
                >
                  Housing & Development Board (HDB)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ura.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#3525cd] transition-colors"
                >
                  Urban Redevelopment Authority (URA)
                </a>
              </li>
              <li>
                <a
                  href="https://datamall.lta.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#3525cd] transition-colors"
                >
                  LTA DataMall Singapore
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#3525cd] transition-colors"
                >
                  Data.gov.sg Registry
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© 2026 ParkWhere SG. Licensed under the Singapore Open Data Licence.</p>
          <span className="font-medium text-slate-400">SG GovTech Standard Compliant</span>
        </div>
      </div>
    </footer>
  );
};
