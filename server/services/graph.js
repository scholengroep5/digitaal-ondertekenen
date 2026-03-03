// Microsoft Graph stub — saves signed PDFs locally for now.
// Will upload to CEO's OneDrive /Ondertekend/ when Graph credentials are configured.

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'data', 'signed');

export async function uploadSigned(filename, contentBase64) {
  await mkdir(dataDir, { recursive: true });
  const filePath = join(dataDir, filename);
  await writeFile(filePath, Buffer.from(contentBase64, 'base64'));
  return { onedrivePath: `/Ondertekend/${filename}`, localPath: filePath };
}
