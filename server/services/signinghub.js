// Real SigningHub client — stubbed until Vlaanderen API credentials arrive.
// Will implement OAuth2 client_credentials + REST calls to signing.vlaanderen.be

import config from '../config.js';

const { apiUrl, clientId, clientSecret, scope } = config.signinghub;

export async function authenticate() {
  throw new Error('Real SigningHub client not configured — set SIGNING_MODE=mock or provide credentials');
}

export async function createWorkflow(name) {
  throw new Error('Not implemented');
}

export async function uploadDocument(packageId, filename, contentBase64) {
  throw new Error('Not implemented');
}

export async function addSigner(packageId, email, name) {
  throw new Error('Not implemented');
}

export async function shareWorkflow(packageId) {
  throw new Error('Not implemented');
}

export async function getStatus(packageId) {
  throw new Error('Not implemented');
}

export async function downloadDocument(packageId) {
  throw new Error('Not implemented');
}
