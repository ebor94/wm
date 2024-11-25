// scripts/version-bump.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const versionFile = join(__dirname, '../src/version.js');

const generateVersion =  async () => {
  const date = new Date();
  let currentVersion = { buildNumber: 0 };
  
  if (fs.existsSync(versionFile)) {
    const content = await import('../src/version.js');
    currentVersion = content;
  }
    
  return {
    version: `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`,
    buildNumber: currentVersion.buildNumber + 1,
    environment: process.env.NODE_ENV || 'development'
  };
};

try {
  const { version, buildNumber, environment } = await generateVersion();
  const content = `
export const version = '${version}';
export const buildNumber = ${buildNumber};
export const buildDate = '${new Date().toISOString()}';
export const environment = '${environment}';
export const fullVersion = '${version}-build.${buildNumber}';
`;

  fs.writeFileSync(versionFile, content);
  console.log(`
    Version actualizada:
    Versión: ${version}
    Build: ${buildNumber}
    Ambiente: ${environment}
    Fecha: ${new Date().toLocaleString()}
  `);
} catch (err) {
  console.error('Error actualizando versión:', err);
  process.exit(1);
}