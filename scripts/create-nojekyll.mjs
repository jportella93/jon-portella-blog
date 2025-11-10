import fs from 'fs';
import path from 'path';

// Ensure .nojekyll file exists in output directory for GitHub Pages
// This is required for non-Jekyll static sites on GitHub Pages
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
console.log('✓ .nojekyll file created in out/ directory for GitHub Pages');

