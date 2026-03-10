#!/usr/bin/env node

/**
 * Generate placeholder PWA icons
 * This creates simple colored icons with text as placeholders
 * Run: node scripts/generate-placeholder-icons.mjs
 */

import { createCanvas } from 'canvas';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = join(process.cwd(), 'public', 'icons');

// Icon configuration
const config = {
  backgroundColor: '#3b82f6', // Blue
  textColor: '#ffffff',
  text: 'EN',
  fontFamily: 'Arial, sans-serif',
};

async function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Text
  ctx.fillStyle = config.textColor;
  ctx.font = `bold ${size * 0.4}px ${config.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.text, size / 2, size / 2);

  // Save
  const buffer = canvas.toBuffer('image/png');
  const filename = join(outputDir, `icon-${size}x${size}.png`);
  await writeFile(filename, buffer);

  console.log(`✓ Generated icon-${size}x${size}.png`);
}

async function main() {
  console.log('Generating placeholder PWA icons...\n');

  // Create output directory
  await mkdir(outputDir, { recursive: true });

  // Generate all sizes
  for (const size of sizes) {
    await generateIcon(size);
  }

  console.log('\n✓ All placeholder icons generated successfully!');
  console.log('\nNote: These are placeholder icons. Replace them with your actual logo.');
}

main().catch(console.error);
