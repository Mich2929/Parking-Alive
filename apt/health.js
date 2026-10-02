/**
 * API Health & Connectivity Monitor
 * Checks LTA DataMall v2 endpoint connectivity, LTA_ACCOUNT_KEY configuration, and system status.
 * Can be run via CLI (`node apt/health.js`) or invoked as a Vercel/Express route handler.
 */

import { fileURLToPath } from 'url';

export const LTA_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

/**
 * Diagnostic health check evaluator
 */
export async function checkHealth() {
  const accountKey = process.env.LTA_ACCOUNT_KEY?.trim();
  const startTime = Date.now();

  let ltaStatus = {
    reachable: false,
    httpStatus: null,
    latencyMs: 0,
    recordCount: 0,
    message: '',
  };

  // Test LTA DataMall v2 connectivity
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const headers = {
      accept: 'application/json',
    };
    if (accountKey) {
      headers.AccountKey = accountKey;
    }

    const res = await fetch(LTA_ENDPOINT, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    ltaStatus.httpStatus = res.status;
    ltaStatus.latencyMs = Date.now() - startTime;

    if (res.ok) {
      const data = await res.json();
      ltaStatus.reachable = true;
      ltaStatus.recordCount = Array.isArray(data?.value) ? data.value.length : 0;
      ltaStatus.message = `LTA DataMall responded successfully with ${ltaStatus.recordCount} live records.`;
    } else if (res.status === 401 || res.status === 403) {
      ltaStatus.reachable = true;
      ltaStatus.message = accountKey
        ? 'LTA DataMall rejected the AccountKey (401/403 Unauthorized). Please verify key validity.'
        : 'LTA DataMall is online and responsive (HTTP 401: Key required for full live production ingestion).';
    } else {
      ltaStatus.reachable = true;
      ltaStatus.message = `LTA DataMall returned status code ${res.status}: ${res.statusText}`;
    }
  } catch (err) {
    ltaStatus.latencyMs = Date.now() - startTime;
    ltaStatus.message = `Could not reach LTA DataMall endpoint directly: ${err.message}`;
  }

  // Determine overall service status
  const keyConfigured = Boolean(accountKey && accountKey.length > 5);
  const overallStatus = keyConfigured && ltaStatus.reachable ? 'healthy' : 'degraded';

  const maskedKey = accountKey
    ? `${accountKey.slice(0, 4)}••••••••${accountKey.slice(-4)}`
    : 'NOT_CONFIGURED (Pending in Vercel)';

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      isVercel: Boolean(process.env.VERCEL),
    },
    ltaDataMall: {
      endpoint: LTA_ENDPOINT,
      keyConfigured,
      maskedKey,
      connectivity: ltaStatus,
      instructions: keyConfigured
        ? 'LTA_ACCOUNT_KEY is active.'
        : 'To activate full live LTA data in Vercel: go to Project Settings -> Environment Variables -> Add "LTA_ACCOUNT_KEY".',
    },
    internalApis: {
      carparksEndpoint: '/apt/carparks',
      healthEndpoint: '/apt/health',
      heathEndpointAlias: '/a/apt/heath.js',
      status: 'operational',
    },
    memoryUsageMB: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  };
}

/**
 * Standard Express / Vercel Serverless Function HTTP Handler
 */
export default async function handler(req, res) {
  try {
    const healthData = await checkHealth();
    if (res && typeof res.status === 'function') {
      res.setHeader?.('Content-Type', 'application/json');
      res.setHeader?.('Cache-Control', 'no-store');
      return res.status(200).json(healthData);
    }
    return healthData;
  } catch (err) {
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ status: 'error', error: err.message });
    }
    throw err;
  }
}

// If executed directly from command line (e.g. `node apt/health.js` or `node a/apt/heath.js`)
try {
  const currentArg = process.argv[1] || '';
  if (currentArg.includes('health.js') || currentArg.includes('heath.js')) {
    (async () => {
      console.log('\n==================================================');
      console.log('  🔍 ParkWhere SG - API & LTA DataMall Health Monitor');
      console.log('==================================================\n');
      console.log('Probing endpoint: ' + LTA_ENDPOINT + ' ...');

      const result = await checkHealth();

      console.log(`\nOverall Status:    ${result.status.toUpperCase()}`);
      console.log(`LTA_ACCOUNT_KEY:   ${result.ltaDataMall.maskedKey}`);
      console.log(`Endpoint Status:   HTTP ${result.ltaDataMall.connectivity.httpStatus || 'N/A'}`);
      console.log(`Latency:           ${result.ltaDataMall.connectivity.latencyMs} ms`);
      console.log(`Message:           ${result.ltaDataMall.connectivity.message}`);
      console.log(`Uptime:            ${result.uptimeSeconds}s`);
      console.log(`Memory RSS:        ${result.memoryUsageMB.rss} MB`);
      console.log(`\nNext Steps:        ${result.ltaDataMall.instructions}\n`);
    })();
  }
} catch {
  // Ignore CLI detection errors in bundled contexts
}
