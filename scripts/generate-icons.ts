/**
 * Generate PWA Icons Script
 * Creates simple placeholder icons for PWA
 * Run: npx tsx scripts/generate-icons.ts
 */

import fs from 'fs';
import path from 'path';

// Simple SVG icon template - Green background with "M" for Munafa
const createSvgIcon = (size: number) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#22c55e"/>
  <text
    x="50%"
    y="55%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="white"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="bold"
    font-size="${size * 0.5}"
  >M</text>
</svg>
`.trim();

// Convert SVG to PNG using a simple approach
// Note: For production, use proper image generation tools
async function generateIcons() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');

  // Create icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const sizes = [192, 512];

  for (const size of sizes) {
    const svg = createSvgIcon(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);

    // Write SVG file
    fs.writeFileSync(svgPath, svg);
    console.log(`Created: ${svgPath}`);
  }

  console.log('\nSVG icons created successfully!');
  console.log('\nTo convert to PNG, use one of these options:');
  console.log('1. Online: https://svgtopng.com/');
  console.log('2. Install sharp: npm install sharp --save-dev');
  console.log('3. Use ImageMagick: convert icon.svg icon.png');
  console.log('\nOr update manifest.json to use SVG icons directly.');
}

generateIcons().catch(console.error);
