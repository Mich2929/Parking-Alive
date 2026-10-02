import React from 'react';
import { X, Navigation, Car, Bike, Truck, Zap, Calendar, Clock, ShieldCheck, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { Carpark } from '../types';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  onClose: () => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({ carpark, onClose }) => {
  if (!carpark) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${carpark.name}, ${carpark.address}, Singapore`
  )}`;

  const isRed = carpark.availableLots <= 5;
  const isAmber = !isRed && carpark.availableLots <= 20;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                {carpark.agency}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {carpark.type} • {carpark.code}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">{carpark.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{carpark.address}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Vacant Lots Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isRed
                ? 'bg-rose-50 border-rose-200'
                : isAmber
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                CURRENT LIVE VACANCY
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-3xl font-black tabular-nums ${
                    isRed ? 'text-rose-600' : isAmber ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {carpark.availableLots}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / {carpark.totalLots} total capacity
                </span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                  isRed
                    ? 'bg-rose-600 text-white'
                    : isAmber
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isRed ? 'Critical' : isAmber ? 'Limited' : 'Ample Space'}
              </span>
              <span className="block text-[11px] text-slate-500 mt-1">
                Refreshed within 60s
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Walking</span>
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                {carpark.distanceMeters}m ({carpark.walkMinutes} min)
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Height Limit</span>
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                {carpark.heightLimitMeters ? `${carpark.heightLimitMeters}m Max` : 'No Limit (Open)'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Grace Period</span>
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                {carpark.gracePeriodMinutes || 10} Mins
              </span>
            </div>
          </div>

          {/* Rate Tariff Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2 font-bold text-xs text-slate-700 flex items-center justify-between">
              <span>Electronic Parking Tariff (EPS)</span>
              <span className="text-emerald-700 font-bold">Live Data</span>
            </div>
            <div className="p-3.5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Day Rate (7:00am - 5:00pm)</span>
                <span className="font-bold text-slate-800">{carpark.shortRate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Evening Rate (5:00pm - 10:30pm)</span>
                <span className="font-bold text-slate-800">{carpark.shortRate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Overnight Cap (10:30pm - 7:00am)</span>
                <span className="font-bold text-slate-800">
                  {carpark.agency === 'HDB' ? '$5.00 Maximum Flat' : 'Standard hourly applies'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Sundays &amp; Public Holidays</span>
                <span className="font-bold text-emerald-700">
                  {carpark.hasFreeSunPh ? 'Free Parking (7am – 10:30pm)' : 'Regular charges apply'}
                </span>
              </div>
            </div>
          </div>

          {/* EV Charging & Additional Facilities */}
          {carpark.evChargingInfo && (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block text-xs">
                  EV Charging Infrastructure
                </span>
                <span className="text-xs text-emerald-800">{carpark.evChargingInfo}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#3525cd] hover:bg-[#2b1ea6] font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
