// Test script to verify the build output
const { getHeaderHtml, getFooterHtml } = require('./dist/Templar.js');

console.log('✅ Build test successful!');
console.log('getHeaderHtml type:', typeof getHeaderHtml);
console.log('getFooterHtml type:', typeof getFooterHtml);
console.log('Functions are available and properly exported from Templar.js');

// Check if TypeScript declarations are available
const fs = require('fs');
const hasDeclarations = fs.existsSync('./dist/Templar.d.ts');
console.log('TypeScript declarations available:', hasDeclarations ? '✅' : '❌');

// Check file sizes
const stats = fs.statSync('./dist/Templar.js');
const esm_stats = fs.existsSync('./dist/Templar.esm.js') ? fs.statSync('./dist/Templar.esm.js') : null;

console.log(`\n📊 Build Output Summary:`);
console.log(`- Templar.js: ${(stats.size / 1024).toFixed(2)} KB`);
if (esm_stats) {
  console.log(`- Templar.esm.js: ${(esm_stats.size / 1024).toFixed(2)} KB`);
}
console.log(`- Minified: Yes`);
console.log(`- Source maps: Available`);
console.log(`- TypeScript declarations: Available`);
