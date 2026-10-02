export type AgencyType = 'HDB' | 'URA' | 'LTA' | 'COMMERCIAL';

export type CarparkType =
  | 'HDB MULTI-STOREY'
  | 'URA OFF-STREET'
  | 'COMMERCIAL / TOWN HUB'
  | 'HDB SURFACE LOT'
  | 'COMMERCIAL / MALL'
  | 'HDB BASEMENT';

export type VacancyStatus = 'available' | 'amber' | 'full';

export interface Carpark {
  id: string;
  code: string;
  name: string;
  address: string;
  postalCode: string;
  agency: AgencyType;
  type: CarparkType;
  distanceMeters: number;
  walkMinutes: number;
  driveMinutes: number;
  totalLots: number;
  availableLots: number;
  carLots: number;
  motorLots: number;
  heavyLots: number;
  rateDescription: string;
  shortRate: string;
  freeParkingInfo?: string;
  evChargingInfo?: string;
  hasEv: boolean;
  evChargerCount?: number;
  hasFreeSunPh: boolean;
  notes?: string;
  warningNotice?: string;
  timeToParkMinutes?: number;
  erpGantryFee: number;
  heightLimitMeters?: number;
  gracePeriodMinutes?: number;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage on SVG map
    mapY: number; // percentage on SVG map
  };
}

export interface Hotspot {
  id: string;
  name: string;
  areaName: string;
  postalCode: string;
  label: string;
  description: string;
  totalLots: number;
  availableLots: number;
  avgRate: string;
  nearestDistance: string;
  erpCount: number;
}

export interface ErpGantry {
  id: string;
  name: string;
  zone: 'CTE' | 'AYE' | 'PIE' | 'ECP' | 'CBD' | 'Orchard' | 'KPE';
  direction: string;
  currentRate: number;
  peakRate: number;
  activeNow: boolean;
  operatingHours: string;
  ratesByTime: { timeBand: string; carRate: number; bikeRate: number }[];
}

export interface TrafficCamera {
  id: string;
  name: string;
  expressway: 'CTE' | 'PIE' | 'AYE' | 'ECP' | 'BKE' | 'KPE' | 'SLE' | 'TPE';
  location: string;
  status: 'Smooth' | 'Moderate' | 'Heavy';
  speedKmH: number;
  imageUrl: string;
  timestamp: string;
}

export interface EvCharger {
  id: string;
  locationName: string;
  operator: 'SP Mobility' | 'Shell Recharge' | 'CDG ENGIE' | 'Charge+' | 'Tesla Supercharger';
  address: string;
  postalCode: string;
  distanceMeters: number;
  availablePlugs: number;
  totalPlugs: number;
  speeds: string[];
  powerKw: number;
  pricePerKwh: string;
  connectors: ('Type 2' | 'CCS2' | 'CHAdeMO')[];
  parkingGracePeriod: string;
}

export interface DrivingGuide {
  id: string;
  title: string;
  badge: string;
  summary: string;
  sections: { heading: string; body: string; highlights?: string[] }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
