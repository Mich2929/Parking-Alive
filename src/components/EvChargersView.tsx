import React, { useState } from 'react';
import { EV_CHARGERS } from '../data/evChargersData';
import { Zap, MapPin, Navigation, Clock, ShieldCheck, BatteryCharging } from 'lucide-react';
import { EvCharger } from '../types';

export const EvChargersView: React.FC = () => {
  const [selectedOperator, setSelectedOperator] = useState<string>('ALL');

  const filteredChargers = EV_CHARGERS.filter((ch) =>
    selectedOperator === 'ALL' ? true : ch.operator === selectedOperator
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            SINGAPORE GREEN PLAN 2030
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            EV Fast Charging Points &amp; Live Connector Availability
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Locate high-power DC fast chargers and AC destination points with live availability.
          </p>
        </div>
      </div>

      {/* Operator Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {['ALL', 'SP Mobility', 'Shell Recharge', 'CDG ENGIE', 'Tesla Supercharger'].map((op) => (
          <button
            key={op}
            onClick={() => setSelectedOperator(op)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer border ${
              selectedOperator === op
                ? 'bg-[#0F172A] text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {op === 'ALL' ? 'All Networks' : op}
          </button>
        ))}
      </div>

      {/* EV Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChargers.map((ch) => {
          const isFull = ch.availablePlugs === 0;

          return (
            <div
              key={ch.id}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                  <span className="font-extrabold text-[11px] text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {ch.operator}
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {ch.powerKw} kW Max
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{ch.locationName}</h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{ch.address}</span>
                </p>

                {/* Live Plugs Banner */}
                <div
                  className={`mt-3 p-3 rounded-lg border flex items-center justify-between ${
                    isFull
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-emerald-50/80 border-emerald-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">
                      AVAILABLE CONNECTORS
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span
                        className={`text-2xl font-black ${
                          isFull ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {ch.availablePlugs}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        / {ch.totalPlugs} plugs total
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isFull
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isFull ? 'All In Use' : 'Ready to Plug'}
                    </span>
                    <span className="block text-[11px] text-slate-600 font-bold mt-1">
                      {ch.pricePerKwh}
                    </span>
                  </div>
                </div>

                {/* Connector Types */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {ch.connectors.map((conn) => (
                    <span
                      key={conn}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200"
                    >
                      {conn}
                    </span>
                  ))}
                  {ch.speeds.map((sp, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-slate-500 font-medium"
                    >
                      • {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{ch.parkingGracePeriod}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${ch.locationName}, ${ch.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#3525cd] hover:bg-[#2b1ea6] text-white text-xs font-bold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
