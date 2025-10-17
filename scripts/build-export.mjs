import fs from 'fs';
import { execSync } from 'child_process';

console.log('🚀 Building for static export...');

const originalConfig = 'next.config.mjs';
const exportConfig = 'next.config.export.mjs';
const backupConfig = 'next.config.mjs.backup';

try {
  // Backup original config
  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, backupConfig);
  }

  // Use export config
  fs.copyFileSync(exportConfig, originalConfig);

  // Build
  console.log('📦 Running next build...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ Static export build complete! Check the /out folder.');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
  }
}