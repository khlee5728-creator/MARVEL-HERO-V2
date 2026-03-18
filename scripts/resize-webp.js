import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const INPUT_DIR = './public/assets';
const OUTPUT_DIR = './public/assets-optimized';
const QUALITY = 80; // WebP quality (0-100)
const TARGET_SIZE = 600; // Target size for square images

async function optimizeImage(inputPath, outputDir) {
  try {
    const inputStats = await stat(inputPath);
    const parsed = parse(inputPath);

    // Create output directory structure
    const relativeDir = inputPath.replace(INPUT_DIR, '').replace(parsed.base, '');
    const outputDirPath = join(OUTPUT_DIR, relativeDir);
    await mkdir(outputDirPath, { recursive: true });

    const outputPath = join(outputDirPath, parsed.base);

    await sharp(inputPath)
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const outputStats = await stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${parsed.base}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(0)}KB → ${(outputStats.size / 1024).toFixed(0)}KB (${reduction}% reduction)`);

    return { inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function findWebPFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findWebPFiles(fullPath));
    } else if (entry.name.endsWith('.webp')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('🎨 Starting WebP image resizing to 600x600...\n');

  const webpFiles = await findWebPFiles(INPUT_DIR);
  console.log(`Found ${webpFiles.length} WebP files\n`);

  let totalInput = 0;
  let totalOutput = 0;

  for (const webpFile of webpFiles) {
    const result = await optimizeImage(webpFile, OUTPUT_DIR);
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
  console.log(`Saved:        ${totalReduction}% (${((totalInput - totalOutput) / 1024 / 1024).toFixed(2)}MB)`);
  console.log(`\nOptimized files are in: ${OUTPUT_DIR}`);
  console.log('To apply: copy files from assets-optimized back to assets folders');
}

main().catch(console.error);
