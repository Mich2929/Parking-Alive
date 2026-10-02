import React, { useState } from 'react';
import { TRAFFIC_CAMERAS } from '../data/trafficCamerasData';
import { Video, RefreshCw, Gauge, AlertCircle, CheckCircle2 } from 'lucide-react';

export const TrafficCamerasView: React.FC = () => {
  const [selectedExpressway, setSelectedExpressway] = useState<string>('ALL');
  const [refreshedAt, setRefreshedAt] = useState<string>('Just now');

  const filteredCameras = TRAFFIC_CAMERAS.filter((cam) =>
    selectedExpressway === 'ALL' ? true : cam.expressway === selectedExpressway
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            LTA EXPRESSWAY SURVEILLANCE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Singapore Live Expressway Traffic Cameras
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live photographic snapshots from LTA roadside surveillance webcams to monitor congestion.
          </p>
        </div>

        <button
          onClick={() => setRefreshedAt('Just now')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Snapshots</span>
        </button>
      </div>

      {/* Expressway Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {['ALL', 'PIE', 'CTE', 'AYE', 'ECP', 'TPE', 'KPE'].map((exp) => (
          <button
            key={exp}
            onClick={() => setSelectedExpressway(exp)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer border ${
              selectedExpressway === exp
                ? 'bg-[#0F172A] text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {exp === 'ALL' ? 'All Expressways' : exp}
          </button>
        ))}
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCameras.map((cam) => {
          const isHeavy = cam.status === 'Heavy';
          const isModerate = cam.status === 'Moderate';

          return (
            <div
              key={cam.id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Camera Image Preview */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={cam.imageUrl}
                  alt={cam.name}
                  className="w-full h-full object-cover brightness-95 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/70 text-white backdrop-blur-xs border border-white/20">
                    {cam.expressway}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-slate-200 backdrop-blur-xs">
                    {cam.timestamp}
                  </span>
                </div>

                {/* Bottom Overlay Status */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isHeavy ? 'bg-rose-500 animate-pulse' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="font-extrabold tracking-wide">
                      {cam.status.toUpperCase()} TRAFFIC
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>~{cam.speedKmH} km/h</span>
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{cam.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{cam.location}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Snapshot: Camera ID #{cam.id.replace('cam-', '')}</span>
                  <span
                    className={`font-bold ${
                      isHeavy ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {isHeavy ? 'Delays Expected' : isModerate ? 'Moving Steady' : 'Free Flow'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
