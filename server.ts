import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCarParkAvailability } from './apt/carparkService.js';
import healthHandler from './apt/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Carpark Availability API endpoint
const carparksRoute = async (req: Request, res: Response) => {
  try {
    const area = (req.query.area as string) || (req.query.Area as string) || '';
    const query = (req.query.q as string) || (req.query.query as string) || '';
    const lotType = (req.query.lotType as string) || (req.query.LotType as string) || '';

    const data = await getCarParkAvailability({ area, query, lotType });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Failed to fetch carpark availability from LTA DataMall',
      message: err.message,
    });
  }
};

// Mount across all required route paths
app.get('/apt/carparks', carparksRoute);
app.get('/api/carparks', carparksRoute);

// 2. Health Monitoring endpoints (supporting all user-specified aliases)
app.get('/apt/health', healthHandler);
app.get('/apt/heath', healthHandler);
app.get('/a/apt/heath.js', healthHandler);
app.get('/a/apt/health.js', healthHandler);
app.get('/api/health', healthHandler);
app.get('/api/heath', healthHandler);

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Where2Park] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[LTA API] Carpark Availability: http://localhost:${PORT}/apt/carparks`);
    console.log(`[Health Monitor] Diagnostics: http://localhost:${PORT}/apt/health`);
  });
}

startServer();
