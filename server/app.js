import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from './config.js';
import signRoutes from './routes/sign.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '50mb' }));

// CORS for Office.js origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    'https://outlook.office.com',
    'https://outlook.office365.com',
    'https://outlook.live.com',
    config.baseUrl,
  ];
  if (origin && allowed.some(a => origin.startsWith(a))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Serve add-in static files
app.use(express.static(join(__dirname, '..', 'addin')));

// API routes
app.use('/api', signRoutes);

app.listen(config.port, () => {
  console.log(`Sign-Flow server running on port ${config.port}`);
  console.log(`Mode: ${config.signingMode}`);
  console.log(`Add-in URL: ${config.baseUrl}/taskpane.html`);
});
