import React from 'react';
import { Compass } from 'lucide-react';

interface ResultsSummaryProps {
  areaName: string;
  postalCode: string;
  count: number;
  radiusKm: number;
  nearestDistance: string;
  erpCount: number;
  totalLots: number;
  availableLots: number;
  estRate: string;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  areaName,
  postalCode,
  count,
  radiusKm,
  nearestDistance,
  erpCount,
  totalLots,
  availableLots,
  estRate,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Location & Radius Description */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#3525cd] shrink-0 mt-0.5">
              <Compass className="w-5 h-5 text-[#3525cd]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {areaName} (Postal {postalCode})
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {count} Found
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Radius: {radiusKm} km • Nearest carpark is {nearestDistance} •{' '}
                {erpCount} ERP Gantries inside estate
              </p>
            </div>
          </div>

          {/* Right: Key Metric Summary Badges */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
            {/* Total Lots */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-1.5 min-w-[90px] text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                TOTAL LOTS
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-800 tabular-nums">
                {totalLots.toLocaleString()}
              </span>
            </div>

            {/* Available Now */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-1.5 min-w-[100px] text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                AVAILABLE NOW
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600 tabular-nums">
                {availableLots.toLocaleString()}
              </span>
            </div>

            {/* Est. Rate */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-1.5 min-w-[90px] text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                EST. RATE
              </span>
              <span className="text-base sm:text-lg font-extrabold text-slate-800 tabular-nums">
                {estRate}
                <span className="text-xs font-semibold text-slate-500">/30m</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
