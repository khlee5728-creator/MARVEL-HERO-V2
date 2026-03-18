import sharp from 'sharp';
import { stat } from 'fs/promises';

const INPUT_PATH = './public/assets/backgrounds/intro-bg-original.webp';
const OUTPUT_PATH = './public/assets/backgrounds/intro-bg.webp';
const QUALITY = 80;
const MAX_WIDTH = 1200; // Keep original width for good quality on large screens

async function optimizeBackground() {
  console.log('🎨 Optimizing intro background image...\n');

  try {
    const inputStats = await stat(INPUT_PATH);
    console.log(`Input: ${INPUT_PATH}`);
    console.log(`Original size: ${(inputStats.size / 1024).toFixed(0)}KB\n`);

    // Get image metadata
    const metadata = await sharp(INPUT_PATH).metadata();
    console.log(`Original dimensions: ${metadata.width}×${metadata.height}`);
    console.log(`Aspect ratio: ${(metadata.width / metadata.height).toFixed(2)}:1\n`);

    // Optimize while maintaining aspect ratio
    await sharp(INPUT_PATH)
      .resize(MAX_WIDTH, null, {
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(OUTPUT_PATH);

    const outputStats = await stat(OUTPUT_PATH);
    const outputMetadata = await sharp(OUTPUT_PATH).metadata();
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log('✓ Optimization complete!');
    console.log(`Output: ${OUTPUT_PATH}`);
    console.log(`New dimensions: ${outputMetadata.width}×${outputMetadata.height}`);
    console.log(`New size: ${(outputStats.size / 1024).toFixed(0)}KB`);
    console.log(`Reduction: ${reduction}%`);
    console.log(`\nAspect ratio preserved: ${(outputMetadata.width / outputMetadata.height).toFixed(2)}:1`);

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

optimizeBackground().catch(console.error);
