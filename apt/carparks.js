/**
 * CarPark Availability API Route Handler
 * Endpoint: /apt/carparks or /api/carparks
 * Ingests live data from LTA DataMall v2 CarParkAvailabilityv2
 */

import { getCarParkAvailability } from './carparkService.js';

export default async function handler(req, res) {
  try {
    const area = req?.query?.area || req?.query?.Area || '';
    const query = req?.query?.q || req?.query?.query || '';
    const lotType = req?.query?.lotType || req?.query?.LotType || '';

    const data = await getCarParkAvailability({ area, query, lotType });

    if (res && typeof res.status === 'function') {
      res.setHeader?.('Content-Type', 'application/json');
      res.setHeader?.('Access-Control-Allow-Origin', '*');
      res.setHeader?.('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader?.('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
      return res.status(200).json(data);
    }
    return data;
  } catch (err) {
    if (res && typeof res.status === 'function') {
      return res.status(500).json({
        error: 'Failed to retrieve carpark availability from LTA DataMall',
        details: err.message,
      });
    }
    throw err;
  }
}
