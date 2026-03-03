import { randomUUID } from 'node:crypto';

const workflows = new Map();

export async function authenticate() {
  return { token: 'mock-token-' + Date.now() };
}

export async function createWorkflow(name) {
  const packageId = randomUUID();
  workflows.set(packageId, {
    name,
    status: 'draft',
    documents: [],
    signers: [],
    signedAt: null,
  });
  return { packageId };
}

export async function uploadDocument(packageId, filename, contentBase64) {
  const wf = workflows.get(packageId);
  if (!wf) throw new Error('Workflow not found');
  const documentId = randomUUID();
  wf.documents.push({ documentId, filename, contentBase64 });
  return { documentId };
}

export async function addSigner(packageId, email, name) {
  const wf = workflows.get(packageId);
  if (!wf) throw new Error('Workflow not found');
  wf.signers.push({ email, name });
}

export async function shareWorkflow(packageId) {
  const wf = workflows.get(packageId);
  if (!wf) throw new Error('Workflow not found');
  wf.status = 'pending';

  // Simulate CEO signing via ITSME after 15 seconds
  setTimeout(() => {
    const current = workflows.get(packageId);
    if (current && current.status === 'pending') {
      current.status = 'signed';
      current.signedAt = new Date().toISOString();
    }
  }, 15_000);
}

export async function getStatus(packageId) {
  const wf = workflows.get(packageId);
  if (!wf) throw new Error('Workflow not found');
  return wf.status;
}

export async function downloadDocument(packageId) {
  const wf = workflows.get(packageId);
  if (!wf) throw new Error('Workflow not found');
  if (!wf.documents.length) throw new Error('No document in workflow');
  return {
    filename: wf.documents[0].filename,
    contentBase64: wf.documents[0].contentBase64,
  };
}
