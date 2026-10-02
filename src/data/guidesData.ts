import { DrivingGuide } from '../types';

export const DRIVING_GUIDES: DrivingGuide[] = [
  {
    id: 'erp-rates-2026',
    title: 'ERP Rates Singapore 2026 — Complete Guide',
    badge: '2026 EDITION',
    summary: 'Updated ERP 2.0 on-board unit (OBU) gantries, peak hours, and rate card for expressways and arterial CBD cordons.',
    sections: [
      {
        heading: 'ERP Operating Hours & Windows',
        body: 'Electronic Road Pricing (ERP) manages traffic congestion along heavily utilized corridors. Rates are adjusted on a quarterly basis based on average travel speeds across expressways and arterial roads.',
        highlights: [
          'CTE Peak Windows: 07:30 to 09:30 & 17:30 to 19:30 (Max $5.00)',
          'AYE Peak Windows: 07:30 to 09:30 (Max $3.00)',
          'CBD Cordon: 08:00 to 09:30 & 18:00 to 19:30',
          'Sundays and Gazetted Public Holidays are completely ERP-free.',
        ],
      },
      {
        heading: 'ERP 2.0 Satellite GNSS Integration',
        body: 'Under the ERP 2.0 system rollout, vehicles equipped with the 3-piece On-Board Unit (OBU) receive live road pricing audio prompts and gantry alerts through the interactive touchscreen display.',
      },
    ],
  },
  {
    id: 'free-parking-singapore',
    title: 'Free Parking in Singapore — Where to Park Free',
    badge: 'FREE LUNCH / SUN',
    summary: 'Comprehensive list of HDB Free Parking Scheme (FPS) locations, mall grace periods, and park board lots.',
    sections: [
      {
        heading: 'HDB Free Parking Scheme (FPS)',
        body: 'Most HDB non-residential and residential carparks carrying the yellow FPS badge provide free parking for cars and motorcycles on Sundays and Public Holidays from 7:00am to 10:30pm.',
        highlights: [
          'Applicable only to carparks displaying the official yellow FPS plate.',
          'Season parking lots reserved for residents (red lots) remain restricted.',
          'Grace period for all HDB Electronic Parking System (EPS) is 10 minutes.',
        ],
      },
      {
        heading: 'Malls with Free Lunchtime Parking',
        body: 'Several shopping centers across Singapore offer 1 to 2 hours of complimentary parking during weekday lunch windows (12:00pm - 2:00pm) with minimum spend or open admission.',
      },
    ],
  },
  {
    id: 'cheapest-orchard-parking',
    title: 'Cheapest Parking Near Orchard Road',
    badge: 'MONEY SAVER',
    summary: 'Beat exorbitant central parking tariffs with our top budget recommendations along Orchard and Somerset.',
    sections: [
      {
        heading: 'Top Value Carpark Choices in Orchard',
        body: 'While premier luxury malls charge upwards of $3.50 to $4.50 per hour, neighboring buildings offer significantly more economical rates:',
        highlights: [
          'Far East Shopping Centre: $2.50 per entry after 5:00pm on weekdays.',
          'Plaza Singapura: $1.95 for first 2 hours (before 5:00pm weekdays).',
          'The Centrepoint: $2.20 for first hour with seamless covered walkway.',
          'SCAPE / Youth Park: Flat evening rates within walking distance to 313@Somerset.',
        ],
      },
    ],
  },
  {
    id: 'hdb-parking-rates-complete',
    title: 'HDB Parking Rates Singapore — Complete Guide',
    badge: 'OFFICIAL HDB TARIFFS',
    summary: 'Official Housing & Development Board electronic parking tariffs, night parking caps, and motorcycle season pass regulations.',
    sections: [
      {
        heading: 'Standard Non-Central Carpark Rates',
        body: 'For HDB carparks outside the designated Central Area:',
        highlights: [
          'Short-term car parking: $0.60 per 30 minutes ($1.20/hour).',
          'Central Area HDB carparks: $1.20 per 30 minutes ($2.40/hour).',
          'Night Parking Scheme: Capped at $5.00 per night (10:30pm to 7:00am next day).',
          'Motorcycles: $0.65 per session (day) or $0.65 per session (night).',
        ],
      },
    ],
  },
];
