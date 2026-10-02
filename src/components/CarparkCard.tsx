import React from 'react';
import { Car, Bike, Truck, Zap, Calendar, ExternalLink, AlertTriangle, Clock, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { Carpark } from '../types';

interface CarparkCardProps {
  carpark: Carpark;
  onOpenDirections: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onOpenErpModal: (carpark: Carpark) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  onOpenDirections,
  onOpenDetails,
  onOpenErpModal,
}) => {
  // Determine vacancy status color
  const vacancyRatio = carpark.availableLots / Math.max(carpark.totalLots, 1);
  const isRed = carpark.availableLots <= 5 || vacancyRatio < 0.05;
  const isAmber = !isRed && (carpark.availableLots <= 20 || vacancyRatio < 0.18);
  const isGreen = !isRed && !isAmber;

  // Agency styling
  const getAgencyBadge = () => {
    switch (carpark.agency) {
      case 'HDB':
        return 'text-blue-600';
      case 'URA':
        return 'text-teal-600';
      case 'COMMERCIAL':
        return 'text-indigo-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between p-4 relative group">
      <div>
        {/* Header: Type, Code & Distance */}
        <div className="flex items-start justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className={`font-bold tracking-wider uppercase text-[11px] ${getAgencyBadge()}`}>
              {carpark.type}
            </span>
            <span className="text-slate-400 font-medium text-[11px]">{carpark.code}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-extrabold text-slate-900 text-xs">{carpark.distanceMeters}m</span>
            <span className="text-[11px] text-slate-500 block leading-none">{carpark.walkMinutes} min walk</span>
          </div>
        </div>

        {/* Carpark Name & Address */}
        <h2 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#3525cd] transition-colors">
          {carpark.name}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{carpark.address}</p>

        {/* Vacant Parking Status Box */}
        <div
          className={`mt-3 p-2.5 rounded-lg border transition-all ${
            isRed
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : isAmber
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                VACANT PARKING {isRed || isAmber ? 'SPACE' : ''}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-2xl font-black tabular-nums leading-none ${
                    isRed ? 'text-rose-600' : isAmber ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {carpark.availableLots}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / {carpark.totalLots} lots total
                </span>
              </div>
            </div>

            {/* Status Pills */}
            <div className="text-right">
              {isRed && (
                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-rose-600 text-white shadow-2xs">
                    RED
                  </span>
                  <span className="text-[11px] font-bold text-rose-700 mt-1">
                    • Almost Full ({carpark.availableLots} Lots)
                  </span>
                  <span className="text-[10px] text-rose-600 font-medium">Divert Recommended</span>
                </div>
              )}
              {isAmber && (
                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-white shadow-2xs">
                    AMBER
                  </span>
                  <span className="text-[11px] font-bold text-amber-700 mt-1">
                    • Busy ({carpark.availableLots} Lots Left)
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">
                    Time-to-Park: ~{carpark.timeToParkMinutes || 3} mins
                  </span>
                </div>
              )}
              {isGreen && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Plenty Available</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    {Math.round((carpark.availableLots / carpark.totalLots) * 100)}% capacity
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning notice if present */}
          {carpark.warningNotice && (
            <div className="mt-2 pt-2 border-t border-rose-200/70 flex items-center gap-1.5 text-xs text-rose-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{carpark.warningNotice}</span>
            </div>
          )}
        </div>

        {/* Capacity Breakdown */}
        <div className="mt-3 flex items-center gap-3.5 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{carpark.carLots} Car</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{carpark.motorLots} Motor</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            <span className="tabular-nums">{carpark.heavyLots} Heavy</span>
          </div>
        </div>

        {/* Pricing & Free Parking Details */}
        <div className="mt-2.5 space-y-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="font-bold text-slate-900">$</span>
            <span className="font-medium">{carpark.rateDescription}</span>
          </div>

          {/* EV Charging Info */}
          {carpark.hasEv ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-1">{carpark.evChargingInfo}</span>
            </div>
          ) : carpark.evChargingInfo ? (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="line-clamp-1">{carpark.evChargingInfo}</span>
            </div>
          ) : null}

          {/* Free Parking Sunday & PH */}
          {carpark.hasFreeSunPh && carpark.freeParkingInfo && (
            <div className="flex items-center gap-1.5 text-blue-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="line-clamp-1">{carpark.freeParkingInfo}</span>
            </div>
          )}

          {/* Grace Period or height limit notes */}
          {carpark.notes && (
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="line-clamp-1">{carpark.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Main CTA: Google Maps / Directions */}
        <button
          onClick={() => onOpenDirections(carpark)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#3525cd] hover:bg-[#2c1eb0] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-white" />
          <span>{carpark.id === 'tp04' ? 'Directions' : carpark.id === 'oth-b1' ? 'Maps' : 'Google Maps'}</span>
        </button>

        {/* Secondary CTA: ERP pill or Details / Rates / Info / Alt Nearby */}
        {carpark.id === 'oth-b1' ? (
          <button
            onClick={() => onOpenDetails(carpark)}
            className="flex items-center gap-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>⇄ Alt Nearby</span>
          </button>
        ) : carpark.id === 'tp04' ? (
          <button
            onClick={() => onOpenDetails(carpark)}
            className="flex items-center gap-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Rates</span>
          </button>
        ) : carpark.id === 't81a' ? (
          <button
            onClick={() => onOpenDetails(carpark)}
            className="flex items-center gap-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Info</span>
          </button>
        ) : carpark.id === 'cs-p1' ? (
          <button
            onClick={() => onOpenDetails(carpark)}
            className="flex items-center gap-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Details</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenErpModal(carpark)}
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Check ERP gantry charges"
          >
            <span className="w-2.5 h-2.5 rounded-full border border-amber-500 bg-amber-400"></span>
            <span>ERP: ${carpark.erpGantryFee.toFixed(2)}</span>
          </button>
        )}
      </div>
    </div>
  );
};
