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
  
  // Random cursor position variations
  const cursorX = 19 + Math.floor(Math.random() * 4); // 19-22
  const cursorY = 16 + Math.floor(Math.random() * 3); // 16-18
  
  // Random grid opacity
  const gridOpacity = 0.05 + Math.random() * 0.1; // 0.05-0.15
  
  // Random border intensity
  const borderOpacity = 0.6 + Math.random() * 0.3; // 0.6-0.9
  
  // Timestamp-based seed for consistent builds on same day
  const today = new Date().toDateString();
  const timeBasedSeed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const dollarRotation = (timeBasedSeed % 10) - 5; // -5 to 5 degrees
  
  return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Green glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Subtle grid pattern -->
    <pattern id="grid" width="3" height="3" patternUnits="userSpaceOnUse">
      <path d="M 3 0 L 0 0 0 3" fill="none" stroke="${primaryColor}" stroke-width="0.1" opacity="${gridOpacity}"/>
    </pattern>
  </defs>
  
  <!-- Black background -->
  <rect width="32" height="32" fill="#000000"/>
  
  <!-- Grid overlay -->
  <rect x="2" y="8" width="28" height="22" fill="url(#grid)"/>
  
  <!-- Terminal window frame -->
  <rect 
    x="1" 
    y="1" 
    width="30" 
    height="30" 
    fill="none" 
    stroke="${primaryColor}" 
    stroke-width="0.8"
    opacity="${borderOpacity}"
    filter="url(#glow)"
  />
  
  <!-- Terminal header bar -->
  <rect x="1" y="1" width="30" height="6" fill="#001100" stroke="${primaryColor}" stroke-width="0.2" opacity="0.8"/>
  <rect x="2" y="2" width="28" height="4" fill="#000800"/>
  
  <!-- Terminal prompt and status indicators -->
  <text x="4" y="5.5" font-family="monospace" font-size="2.5" fill="${primaryColor}" opacity="0.8">></text>
  <rect x="26" y="3" width="3" height="0.5" fill="${accentColor}" opacity="0.7"/>
  <rect x="26" y="4.5" width="2" height="0.5" fill="${primaryColor}" opacity="0.5"/>
  
  <!-- Main dollar sign with slight rotation -->
  <text
    x="16"
    y="22"
    text-anchor="middle"
    font-size="11"
    font-family="monospace"
    font-weight="bold"
    fill="${primaryColor}"
    filter="url(#glow)"
    transform="rotate(${dollarRotation} 16 22)"
  >
    $
  </text>
  
  <!-- Terminal cursor with random position -->
  <rect x="${cursorX}" y="${cursorY}" width="0.8" height="5" fill="${cursorColor}" filter="url(#glow)">
    <animate 
      attributeName="opacity" 
      values="1;0.2;1" 
      dur="1.2s" 
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
  const accentIntensity = 100 + (buildHash % 156); // 100-255
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 255;
      
      const refX = Math.floor(x / scale);
      const refY = Math.floor(y / scale);
      
      // Black background
      r = g = b = 0;
      
      // Terminal border with build-time intensity variation
      if ((refX === 1 || refX === 30 || refY === 1 || refY === 30) && 
          refX >= 1 && refX <= 30 && refY >= 1 && refY <= 30) {
        g = primaryGreen;
      }
      
      // Header area
      if (refY >= 1 && refY <= 6 && refX >= 1 && refX <= 30) {
        g = 17; // Dark green
      }
      
      // Terminal prompt character (>) in header
      if (refX >= 4 && refX <= 5 && refY >= 4 && refY <= 5) {
        r = 0; g = primaryGreen; b = 0;
      }
      
      // Dollar sign with build-time positioning
      const dollarCenterX = 16 * scale;
      const dollarCenterY = 22 * scale;
      const dollarSize = 5 * scale;
      
      if (Math.abs(x - dollarCenterX) <= dollarSize/2 && Math.abs(y - dollarCenterY) <= dollarSize/2) {
        // Vertical line
        if (Math.abs(x - dollarCenterX) <= scale/3) {
          r = 0; g = primaryGreen; b = 0;
        }
        // Horizontal lines
        else if ((Math.abs(y - (dollarCenterY - dollarSize/3)) <= scale/3 || 
                  Math.abs(y - dollarCenterY) <= scale/3 ||
                  Math.abs(y - (dollarCenterY + dollarSize/3)) <= scale/3) &&
                 Math.abs(x - dollarCenterX) <= dollarSize/2) {
          r = 0; g = primaryGreen; b = 0;
        }
      }
      
      // Cursor with build-time position variation
      const cursorX = 19 + (buildHash % 4);
      const cursorY = 16 + (buildHash % 3);
      if (refX >= cursorX && refX <= cursorX + 1 && refY >= cursorY && refY <= cursorY + 5) {
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