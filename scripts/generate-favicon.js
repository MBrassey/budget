const fs = require('fs');
const path = require('path');

// Terminal color palette from your app
const TERMINAL_COLORS = [
  '#00FF00', // Bright Green (primary)
  '#00FFFF', // Cyan
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#FF6600', // Orange
  '#0066FF', // Blue
  '#66FF00', // Lime
  '#FF0066', // Pink
  '#00FF66', // Green-Cyan
  '#6600FF', // Purple
  '#FFFFFF', // White
];

function generateFaviconSVG() {
  // Random variations for each build
  const primaryColor = TERMINAL_COLORS[0]; // Always green
  const accentColor = TERMINAL_COLORS[Math.floor(Math.random() * TERMINAL_COLORS.length)];
  const cursorColor = Math.random() > 0.7 ? accentColor : primaryColor;
  
  // Cursor positioned right next to the dollar sign
  const cursorX = 22 + Math.floor(Math.random() * 2); // 22-23 (right of dollar sign)
  const cursorY = 24 + Math.floor(Math.random() * 2); // 24-25 (at baseline of dollar sign)
  
  // Random grid opacity
  const gridOpacity = 0.02 + Math.random() * 0.05; // 0.02-0.07 (reduced)
  
  // Random border intensity
  const borderOpacity = 0.4 + Math.random() * 0.2; // 0.4-0.6 (reduced)
  
  // Timestamp-based seed for consistent builds on same day
  const today = new Date().toDateString();
  const timeBasedSeed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const dollarRotation = (timeBasedSeed % 6) - 3; // -3 to 3 degrees (reduced rotation)
  
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Green glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Subtle grid pattern -->
    <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
      <path d="M 4 0 L 0 0 0 4" fill="none" stroke="${primaryColor}" stroke-width="0.1" opacity="${gridOpacity}"/>
    </pattern>
  </defs>
  
  <!-- Black background -->
  <rect width="32" height="32" fill="#000000"/>
  
  <!-- Grid overlay (reduced area) -->
  <rect x="1" y="1" width="30" height="30" fill="url(#grid)"/>
  
  <!-- Minimal terminal window frame (thinner) -->
  <rect 
    x="0.5" 
    y="0.5" 
    width="31" 
    height="31" 
    fill="none" 
    stroke="${primaryColor}" 
    stroke-width="0.5"
    opacity="${borderOpacity}"
  />
  
  <!-- Minimal terminal header bar (smaller) -->
  <rect x="1" y="1" width="30" height="3" fill="#001100" opacity="0.6"/>
  
  <!-- Small terminal prompt indicator -->
  <text x="2" y="3.2" font-family="monospace" font-size="1.8" fill="${primaryColor}" opacity="0.6">></text>
  
  <!-- MAIN DOLLAR SIGN - Much bigger and centered -->
  <text
    x="16"
    y="23"
    text-anchor="middle"
    font-size="24"
    font-family="monospace"
    font-weight="bold"
    fill="${primaryColor}"
    filter="url(#glow)"
    transform="rotate(${dollarRotation} 16 23)"
  >
    $
  </text>
  
  <!-- Terminal cursor positioned right next to dollar sign -->
  <rect x="${cursorX}" y="${cursorY}" width="6" height="1" fill="${cursorColor}" filter="url(#glow)">
    <animate 
      attributeName="opacity" 
      values="1;0.3;1" 
      dur="1.5s" 
      repeatCount="indefinite"
    />
  </rect>
  
  <!-- Build timestamp (invisible but affects SVG hash) -->
  <metadata>
    <build-time>${new Date().toISOString()}</build-time>
    <build-seed>${timeBasedSeed}</build-seed>
  </metadata>
</svg>`;
}

function generateFaviconICO(size = 32) {
  // ICO file header
  const icoHeader = Buffer.from([
    0x00, 0x00, // Reserved
    0x01, 0x00, // Type (1 = ICO)
    0x01, 0x00  // Number of images
  ]);
  
  // ICO directory entry
  const dataSize = size * size * 4;
  const icoEntry = Buffer.from([
    size & 0xFF,        // Width
    size & 0xFF,        // Height
    0x00,               // Color palette
    0x00,               // Reserved
    0x01, 0x00,         // Color planes
    0x20, 0x00,         // Bits per pixel (32)
    ...Buffer.from([(dataSize) & 0xFF, (dataSize >> 8) & 0xFF, (dataSize >> 16) & 0xFF, (dataSize >> 24) & 0xFF]),
    0x16, 0x00, 0x00, 0x00  // Offset
  ]);
  
  const pixels = [];
  const scale = size / 32;
  
  // Build-time variations
  const buildHash = Date.now() % 1000;
  const primaryGreen = 255;
  const accentIntensity = 150 + (buildHash % 106); // 150-255
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 255;
      
      const refX = Math.floor(x / scale);
      const refY = Math.floor(y / scale);
      
      // Black background
      r = g = b = 0;
      
      // Minimal terminal border
      if ((refX === 0 || refX === 31 || refY === 0 || refY === 31)) {
        g = Math.floor(primaryGreen * 0.4);
      }
      
      // Minimal header area
      if (refY >= 1 && refY <= 3 && refX >= 1 && refX <= 30) {
        g = 8; // Very dark green
      }
      
             // MUCH BIGGER Dollar sign - takes up most of the icon
       const dollarCenterX = 16 * scale;
       const dollarCenterY = 23 * scale;
       const dollarSize = 12 * scale; // Much bigger!
       const strokeThickness = Math.max(1, scale * 1.5);
      
      if (Math.abs(x - dollarCenterX) <= dollarSize/2 && Math.abs(y - dollarCenterY) <= dollarSize/2) {
        // Vertical line of $
        if (Math.abs(x - dollarCenterX) <= strokeThickness) {
          r = 0; g = primaryGreen; b = 0;
        }
        // Top horizontal line of $
        else if (Math.abs(y - (dollarCenterY - dollarSize/3)) <= strokeThickness &&
                 Math.abs(x - dollarCenterX) <= dollarSize/3) {
          r = 0; g = primaryGreen; b = 0;
        }
        // Middle horizontal line of $
        else if (Math.abs(y - dollarCenterY) <= strokeThickness &&
                 Math.abs(x - dollarCenterX) <= dollarSize/3) {
          r = 0; g = primaryGreen; b = 0;
        }
        // Bottom horizontal line of $
        else if (Math.abs(y - (dollarCenterY + dollarSize/3)) <= strokeThickness &&
                 Math.abs(x - dollarCenterX) <= dollarSize/3) {
          r = 0; g = primaryGreen; b = 0;
        }
      }
      
                           // Cursor positioned next to dollar sign (horizontal)
        const cursorX = 22 + (buildHash % 2);
        const cursorY = 24 + (buildHash % 2);
        if (refX >= cursorX && refX <= cursorX + 5 && refY >= cursorY && refY <= cursorY + 1) {
          r = 0; g = accentIntensity; b = 0;
        }
      
      pixels.push(b, g, r, a); // BGRA format
    }
  }
  
  return Buffer.concat([icoHeader, icoEntry, Buffer.from(pixels)]);
}

function generateFavicons() {
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log('🎨 Generating new favicon for this build...');
  
  // Generate SVG
  const svgContent = generateFaviconSVG();
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  
  // Generate ICO
  const icoContent = generateFaviconICO(32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoContent);
  
  const buildTime = new Date().toLocaleTimeString();
  console.log(`✅ New favicon generated at ${buildTime}`);
  console.log('   - Terminal-style design with build-specific variations');
  console.log('   - SVG with animated cursor and unique positioning');
  console.log('   - ICO with build-time color and position variations');
}

// Run if called directly
if (require.main === module) {
  generateFavicons();
}

module.exports = { generateFavicons }; 