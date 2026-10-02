import React, { useState } from 'react';
import { ERP_GANTRIES } from '../data/erpData';
import { ShieldAlert, Clock, Car, Bike, Calculator, ArrowRight } from 'lucide-react';

export const ErpView: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');

  const filteredGantries = ERP_GANTRIES.filter((g) =>
    selectedZone === 'ALL' ? true : g.zone === selectedZone
  );

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            LTA ERP 2.0 INTEGRATION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Singapore ERP Gantry Rates &amp; Peak Windows
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time gantry toll tariffs across CTE, AYE, PIE, and Central Business District.
          </p>
        </div>

        {/* Vehicle Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setVehicleType('car')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              vehicleType === 'car'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Passenger Car / Taxi</span>
          </button>
          <button
            onClick={() => setVehicleType('bike')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              vehicleType === 'bike'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Motorcycle</span>
          </button>
        </div>
      </div>

      {/* Zone filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {['ALL', 'CTE', 'CBD', 'PIE', 'AYE', 'Orchard', 'ECP'].map((zone) => (
          <button
            key={zone}
            onClick={() => setSelectedZone(zone)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer border ${
              selectedZone === zone
                ? 'bg-[#0F172A] text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {zone === 'ALL' ? 'All Expressways & Zones' : `${zone} Zone`}
          </button>
        ))}
      </div>

      {/* Gantries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGantries.map((gantry) => {
          const rateToDisplay =
            vehicleType === 'car' ? gantry.currentRate : gantry.currentRate * 0.5;

          return (
            <div
              key={gantry.id}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                  <span className="font-extrabold text-[11px] text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {gantry.zone}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      gantry.activeNow
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        gantry.activeNow ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    {gantry.activeNow ? 'TOLL ACTIVE' : 'FREE WINDOW'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">{gantry.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{gantry.direction}</p>

                {/* Current Toll Box */}
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      CURRENT RATE ({vehicleType.toUpperCase()})
                    </span>
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      ${rateToDisplay.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      PEAK CAP
                    </span>
                    <span className="text-xs font-extrabold text-amber-700">
                      ${gantry.peakRate.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{gantry.operatingHours}</span>
                </div>
              </div>

              {/* Time Band Breakdown Accordion / List */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  SCHEDULED TIME BANDS
                </span>
                <div className="space-y-1 text-xs">
                  {gantry.ratesByTime.slice(0, 3).map((tb, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 text-slate-600">
                      <span>{tb.timeBand}</span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        ${vehicleType === 'car' ? tb.carRate.toFixed(2) : tb.bikeRate.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
