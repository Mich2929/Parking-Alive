import React, { useState } from 'react';
import { X, Car, Bike, Truck, Check, Bell, Shield, Navigation } from 'lucide-react';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleType: 'car' | 'bike' | 'heavy';
  setVehicleType: (type: 'car' | 'bike' | 'heavy') => void;
  evMode: boolean;
  setEvMode: (enabled: boolean) => void;
}

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  vehicleType,
  setVehicleType,
  evMode,
  setEvMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Driver Profile &amp; Preferences</h3>
            <p className="text-xs text-slate-500 mt-0.5">Customise your navigation &amp; parking parameters</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-sm">
          {/* Default Vehicle Type */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Default Vehicle Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setVehicleType('car')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  vehicleType === 'car'
                    ? 'border-[#3525cd] bg-indigo-50/50 text-[#3525cd] font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Car className="w-5 h-5" />
                <span className="text-xs">Motor Car</span>
              </button>

              <button
                onClick={() => setVehicleType('bike')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  vehicleType === 'bike'
                    ? 'border-[#3525cd] bg-indigo-50/50 text-[#3525cd] font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Bike className="w-5 h-5" />
                <span className="text-xs">Motorcycle</span>
              </button>

              <button
                onClick={() => setVehicleType('heavy')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  vehicleType === 'heavy'
                    ? 'border-[#3525cd] bg-indigo-50/50 text-[#3525cd] font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs">Heavy / Lorry</span>
              </button>
            </div>
          </div>

          {/* EV Preference */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                EV Driver Mode
              </span>
              <span className="text-xs text-slate-500">
                Prioritise carparks with active EV fast chargers
              </span>
            </div>
            <button
              onClick={() => setEvMode(!evMode)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                evMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  evMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Singapore Civic Standards notice */}
          <div className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-200/60 leading-relaxed">
            <span className="font-bold text-blue-900 block mb-1">
              Data Privacy &amp; Civic Standards
            </span>
            ParkWhere SG is built strictly according to Singapore Open Data standards. Your GPS
            location is calculated on-device and never stored or transmitted to external servers.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-[#3525cd] hover:bg-[#2b1ea6] font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
