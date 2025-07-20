// Cache-busting favicon script for deployment issues
const fs = require('fs');
const path = require('path');

function addCacheBustToLayout() {
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  const timestamp = Date.now();
  
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  // Add cache-busting timestamp to favicon URLs
  content = content.replace(
    /href="\/favicon\.ico"/g, 
    `href="/favicon.ico?v=${timestamp}"`
  );
  content = content.replace(
    /href="\/favicon\.svg"/g, 
    `href="/favicon.svg?v=${timestamp}"`
  );
  
  fs.writeFileSync(layoutPath, content);
  console.log(`🔄 Added cache-busting timestamp: ${timestamp}`);
  console.log('   This will force browsers to reload the favicon');
}

if (require.main === module) {
  addCacheBustToLayout();
}

module.exports = { addCacheBustToLayout }; 