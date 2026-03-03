import { Router } from 'express';
import config from '../config.js';
import * as mock from '../services/signinghub-mock.js';
import * as graph from '../services/graph.js';

const router = Router();

// Pick signing backend based on config
function hub() {
  if (config.signingMode === 'mock') return mock;
  // Dynamic import of real client would go here
  return mock;
}

// In-memory job tracking
const jobs = new Map();

// POST /api/sign — start signing flow
router.post('/sign', async (req, res) => {
  try {
    const { filename, content_base64, signer_email, signer_name } = req.body;
    if (!filename || !content_base64) {
      return res.status(400).json({ error: 'filename and content_base64 required' });
    }

    const email = signer_email || 'ceo@sgr5.be';
    const name = signer_name || 'SGR5 User';

    const client = hub();
    await client.authenticate();
    const { packageId } = await client.createWorkflow(filename);
    await client.uploadDocument(packageId, filename, content_base64);
    await client.addSigner(packageId, email, name);
    await client.shareWorkflow(packageId);

    jobs.set(packageId, { filename, signerEmail: email, signerName: name, status: 'pending', createdAt: new Date().toISOString() });

    res.json({ id: packageId, status: 'pending' });
  } catch (err) {
    console.error('POST /api/sign error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/status/:id — poll for signing status
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = jobs.get(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const client = hub();
    const status = await client.getStatus(id);
    job.status = status;

    // If signed, download and save
    if (status === 'signed' && !job.saved) {
      const doc = await client.downloadDocument(id);
      const result = await graph.uploadSigned(doc.filename, doc.contentBase64);
      job.onedrivePath = result.onedrivePath;
      job.localPath = result.localPath;
      job.saved = true;
    }

    res.json({ status, filename: job.filename });
  } catch (err) {
    console.error('GET /api/status error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/result/:id — get signed document
router.get('/result/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = jobs.get(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'signed') return res.status(409).json({ error: 'Document not yet signed', status: job.status });

    const client = hub();
    const doc = await client.downloadDocument(id);

    res.json({
      filename: doc.filename,
      content_base64: doc.contentBase64,
      onedrive_path: job.onedrivePath || null,
    });
  } catch (err) {
    console.error('GET /api/result error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
