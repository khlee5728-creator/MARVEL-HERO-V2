import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const INPUT_DIR = './public/assets';
const QUALITY = 85; // WebP quality (0-100)
const MAX_WIDTH = 1200; // Maximum width for images

async function optimizeImage(inputPath, outputPath) {
  try {
    const info = await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${parse(inputPath).base}`);
    console.log(`  ${(inputStats.size / 1024 / 1024).toFixed(2)}MB → ${(outputStats.size / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);

    return { inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function findPngFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findPngFiles(fullPath));
    } else if (entry.name.endsWith('.png')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('🎨 Starting image optimization...\n');

  const pngFiles = await findPngFiles(INPUT_DIR);
  console.log(`Found ${pngFiles.length} PNG files\n`);

  let totalInput = 0;
  let totalOutput = 0;

  for (const pngFile of pngFiles) {
    const parsed = parse(pngFile);
    const outputPath = join(parsed.dir, `${parsed.name}.webp`);

    const result = await optimizeImage(pngFile, outputPath);
    if (result) {
      totalInput += result.inputSize;
      totalOutput += result.outputSize;
    }
    console.log('');
  }

  const totalReduction = ((1 - totalOutput / totalInput) * 100).toFixed(1);
  console.log('📊 Summary:');
  console.log(`Total input:  ${(totalInput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total output: ${(totalOutput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Saved:        ${(totalReduction)}% (${((totalInput - totalOutput) / 1024 / 1024).toFixed(2)}MB)`);
}

main().catch(console.error);
