import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { Carpark } from '../types';

interface SpatialMapProps {
  carparks: Carpark[];
  areaName: string;
  postalCode: string;
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDirections: (carpark: Carpark) => void;
}

export const SpatialMap: React.FC<SpatialMapProps> = ({
  carparks,
  areaName,
  postalCode,
  onSelectCarpark,
  onOpenDirections,
}) => {
  const [activePinId, setActivePinId] = useState<string | null>('tm31');
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedCarpark = carparks.find((c) => c.id === activePinId) || carparks[0];

  return (
    <div id="spatial-map" className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-6 my-6">
      {/* Top Header & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3525cd] block">
            SPATIAL GPS OVERLAY
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Nearby {areaName} Availability Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visual pin distribution for {carparks.length} carparks within walking & driving distance.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Green (&gt;20 lots)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Amber (5-20 lots)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Red (&lt;5 lots)</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
            <span>🏛️ Rush Hours Monitored</span>
          </div>
        </div>
      </div>

      {/* Map Graphic Canvas Container */}
      <div className="relative w-full h-[340px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-[#E8F5E9] select-none">
        {/* Stylized Singapore East Coast / Tampines Cartographic SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9E6FD" />
              <stop offset="100%" stopColor="#A8D5F9" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2F4E7" />
              <stop offset="100%" stopColor="#D5EFE0" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D0E7D8" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Water Body (Singapore Straits / Sungei Serangoon / Johor Straits) */}
          <rect width="1000" height="500" fill="url(#waterGrad)" />

          {/* Singapore Mainland Coastline Path */}
          <path
            d="M -50 0 L 1050 0 L 1050 240 Q 980 230 920 270 Q 860 310 800 370 Q 740 430 650 420 Q 570 410 500 450 Q 420 500 330 480 Q 250 460 170 430 Q 90 400 -50 420 Z"
            fill="url(#landGrad)"
          />

          {/* Soft Grid overlay */}
          <rect width="1000" height="500" fill="url(#grid)" />

          {/* Nature Parks & Reservoirs (Bedok Reservoir, Tampines Eco Green) */}
          <ellipse cx="380" cy="340" rx="42" ry="24" fill="#A8D8B9" opacity="0.8" />
          <text x="380" y="343" fontSize="10" fill="#2E6B46" fontWeight="bold" textAnchor="middle">
            Bedok Reservoir
          </text>

          <ellipse cx="580" cy="200" rx="35" ry="18" fill="#A8D8B9" opacity="0.7" />
          <text x="580" y="204" fontSize="9" fill="#2E6B46" fontWeight="bold" textAnchor="middle">
            Tampines Eco Green
          </text>

          {/* Major Expressways (PIE, TPE, ECP) in crisp white/amber road ribbons */}
          {/* TPE (Tampines Expressway) */}
          <path
            d="M 120 80 Q 300 90 520 120 T 820 210"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 120 80 Q 300 90 520 120 T 820 210"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="8 4"
          />

          {/* PIE (Pan Island Expressway) */}
          <path
            d="M 80 320 Q 300 280 500 290 T 880 280"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 80 320 Q 300 280 500 290 T 880 280"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="8 4"
          />

          {/* Secondary Arterial Roads (Tampines Ave 2, 4, 5, 7, 10) */}
          <path d="M 420 120 L 460 380" fill="none" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M 520 130 L 530 380" fill="none" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M 320 230 L 680 240" fill="none" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M 300 180 L 650 200" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M 350 300 L 660 300" fill="none" stroke="#FFFFFF" strokeWidth="5" />

          {/* MRT Transit Network Lines */}
          {/* East-West Line (Green EW) */}
          <path
            d="M 160 320 Q 300 300 480 270 T 840 250"
            fill="none"
            stroke="#008D36"
            strokeWidth="3.5"
          />
          {/* Downtown Line (Blue DT) */}
          <path
            d="M 220 200 Q 380 220 490 240 T 700 290"
            fill="none"
            stroke="#005EC4"
            strokeWidth="3.5"
          />
          {/* Cross Island Line (Light Green CR) */}
          <path
            d="M 200 100 Q 500 110 820 190"
            fill="none"
            stroke="#9ACD32"
            strokeWidth="3"
            strokeDasharray="6 3"
          />

          {/* MRT Stations and Town Landmarks */}
          <g fill="#4F46E5" opacity="0.85">
            <circle cx="480" cy="240" r="5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="495" y="244" fontSize="11" fill="#1E293B" fontWeight="800">
              TAMPINES
            </text>

            <circle cx="580" cy="115" r="4.5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="592" y="119" fontSize="10" fill="#334155" fontWeight="700">
              Pasir Ris
            </text>

            <circle cx="280" cy="160" r="4.5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="292" y="164" fontSize="10" fill="#334155" fontWeight="700">
              Sengkang
            </text>

            <circle cx="240" cy="220" r="4.5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="185" y="224" fontSize="10" fill="#334155" fontWeight="700">
              Hougang
            </text>

            <circle cx="340" cy="380" r="4.5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="340" y="398" fontSize="10" fill="#334155" fontWeight="700" textAnchor="middle">
              Bedok
            </text>

            <circle cx="820" cy="220" r="5" fill="#3525cd" stroke="#FFFFFF" strokeWidth="2" />
            <text x="820" y="240" fontSize="11" fill="#1E293B" fontWeight="800" textAnchor="middle">
              Singapore
            </text>
            <text x="820" y="253" fontSize="11" fill="#1E293B" fontWeight="800" textAnchor="middle">
              Changi Airport
            </text>

            {/* IKEA Tampines Landmark */}
            <rect x="360" y="135" width="12" height="12" rx="2" fill="#0051BA" />
            <text x="380" y="145" fontSize="10" fill="#0051BA" fontWeight="bold">
              IKEA Tampines
            </text>

            {/* Singapore Air Force Museum */}
            <circle cx="360" cy="255" r="4" fill="#9333EA" />
            <text x="360" y="272" fontSize="9" fill="#6B21A8" fontWeight="bold" textAnchor="middle">
              Singapore Air Force
            </text>
            <text x="360" y="283" fontSize="9" fill="#6B21A8" fontWeight="bold" textAnchor="middle">
              Museum
            </text>

            {/* NEX Shopping Mall */}
            <rect x="140" y="240" width="10" height="10" rx="2" fill="#2563EB" />
            <text x="156" y="249" fontSize="10" fill="#1E40AF" fontWeight="bold">
              NEX
            </text>

            {/* Century Square Shopping Mall */}
            <rect x="440" y="255" width="9" height="9" rx="1.5" fill="#DC2626" />
            <text x="440" y="276" fontSize="9" fill="#991B1B" fontWeight="bold" textAnchor="middle">
              Century Square
            </text>

            {/* Changi Bay Point */}
            <text x="880" y="215" fontSize="10" fill="#1E3A8A" fontWeight="bold">
              Changi Bay Point
            </text>
          </g>

          {/* Searched Anchor Center Pulse Circle */}
          <circle cx="480" cy="235" r="60" fill="#4F46E5" fillOpacity="0.08" stroke="#4F46E5" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="480" cy="235" r="30" fill="#4F46E5" fillOpacity="0.12" stroke="#4F46E5" strokeWidth="1.5" />
        </svg>

        {/* Searched Anchor Tag Callout */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border-2 border-[#3525cd] shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd] animate-ping"></span>
            <div>
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block tracking-wider leading-none">
                SEARCHED ANCHOR
              </span>
              <span className="text-xs font-black text-slate-900 leading-tight">
                Postal {postalCode}
              </span>
            </div>
          </div>
          <div className="w-2 h-2 bg-[#3525cd] rotate-45 mx-auto -mt-1"></div>
        </div>

        {/* Interactive Carpark Map Pins */}
        {carparks.slice(0, 10).map((cp, idx) => {
          const isCurrent = activePinId === cp.id;
          const isRed = cp.availableLots <= 5;
          const isAmber = !isRed && cp.availableLots <= 20;

          // Compute responsive pin positioning
          const posX = cp.coordinates.mapX || 45 + (idx % 4) * 6;
          const posY = cp.coordinates.mapY || 40 + (idx % 3) * 7;

          return (
            <button
              key={cp.id}
              onClick={() => {
                setActivePinId(cp.id);
                onSelectCarpark(cp);
              }}
              style={{ left: `${posX}%`, top: `${posY}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform hover:scale-110 cursor-pointer focus:outline-hidden ${
                isCurrent ? 'scale-125 z-40' : ''
              }`}
              title={`${cp.name} - ${cp.availableLots} lots available`}
            >
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[11px] shadow-md border transition-all ${
                  isRed
                    ? 'bg-rose-600 text-white border-white ring-2 ring-rose-300'
                    : isAmber
                    ? 'bg-amber-500 text-white border-white ring-2 ring-amber-300'
                    : 'bg-emerald-600 text-white border-white ring-2 ring-emerald-300'
                }`}
              >
                <span>P</span>
                <span className="tabular-nums">{cp.availableLots}</span>
              </div>
            </button>
          );
        })}

        {/* Floating Active Selected Card Tooltip */}
        {selectedCarpark && (
          <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200/90 shadow-lg max-w-[280px]">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>{selectedCarpark.code}</span>
              <span className="text-slate-800">{selectedCarpark.distanceMeters}m away</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
              {selectedCarpark.name}
            </h4>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold text-emerald-600">
                {selectedCarpark.availableLots} lots free
              </span>
              <button
                onClick={() => onOpenDirections(selectedCarpark)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#3525cd] hover:underline"
              >
                <span>Navigate</span>
                <Navigation className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Live GPS Tracking Active Badge in bottom right */}
        <div className="absolute bottom-3 right-3 z-20">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live GPS Tracking Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
