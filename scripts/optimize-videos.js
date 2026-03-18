import { readdir, stat, mkdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const INPUT_DIR = './public/assets/characters';
const OUTPUT_DIR = './public/assets-videos-optimized';
const TARGET_SIZE = 288; // Match Result page display size (w-72 = 288px)
const CRF = 30; // Constant Rate Factor (23=high quality, 30=good quality, smaller size)
const MAX_BITRATE = '250k'; // Maximum bitrate
const FPS = 24; // Frame rate

async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install FFmpeg first.');
    console.error('   Windows: choco install ffmpeg OR download from https://ffmpeg.org');
    console.error('   Mac: brew install ffmpeg');
    console.error('   Linux: apt install ffmpeg');
    return false;
  }
}

async function optimizeVideo(inputPath, outputDir) {
  try {
    const fileName = inputPath.split(/[/\\]/).pop();
    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, fileName);

    const inputStats = await stat(inputPath);

    console.log(`🎬 Processing: ${fileName}`);

    // FFmpeg command for optimal web video compression
    // -i: input file
    // -vf scale: resize to target size, maintain aspect ratio
    // -c:v libx264: H.264 codec (best compatibility)
    // -crf: quality (lower = better quality, larger file)
    // -preset: encoding speed vs compression (slow = better compression)
    // -maxrate: maximum bitrate
    // -bufsize: rate control buffer
    // -movflags +faststart: optimize for web streaming
    // -r: frame rate
    // -an: remove audio (if any)
    const command = `ffmpeg -i "${inputPath}" -vf "scale=${TARGET_SIZE}:${TARGET_SIZE}:force_original_aspect_ratio=increase,crop=${TARGET_SIZE}:${TARGET_SIZE}" -c:v libx264 -crf ${CRF} -preset slow -maxrate ${MAX_BITRATE} -bufsize ${parseInt(MAX_BITRATE) * 2}k -r ${FPS} -movflags +faststart -an -y "${outputPath}"`;

    await execAsync(command);

    const outputStats = await stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${fileName}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(0)}KB → ${(outputStats.size / 1024).toFixed(0)}KB (${reduction}% reduction)`);
    console.log('');

    return { inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function findMP4Files(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findMP4Files(fullPath));
    } else if (entry.name.endsWith('.mp4')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log('🎥 Starting video optimization for web...\n');

  // Check FFmpeg availability
  const hasFFmpeg = await checkFFmpeg();
  if (!hasFFmpeg) {
    process.exit(1);
  }

  console.log('✓ FFmpeg is available\n');
  console.log(`Settings:
  - Target size: ${TARGET_SIZE}x${TARGET_SIZE}px
  - CRF: ${CRF} (quality)
  - Max bitrate: ${MAX_BITRATE}
  - Frame rate: ${FPS}fps
  - Codec: H.264 (libx264)\n`);

  const mp4Files = await findMP4Files(INPUT_DIR);
  console.log(`Found ${mp4Files.length} MP4 files\n`);

  let totalInput = 0;
  let totalOutput = 0;
  let successCount = 0;

  for (const mp4File of mp4Files) {
    const result = await optimizeVideo(mp4File, OUTPUT_DIR);
    if (result) {
      totalInput += result.inputSize;
      totalOutput += result.outputSize;
      successCount++;
    }
  }

  const totalReduction = ((1 - totalOutput / totalInput) * 100).toFixed(1);
  console.log('📊 Summary:');
  console.log(`Processed: ${successCount}/${mp4Files.length} videos`);
  console.log(`Total input:  ${(totalInput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total output: ${(totalOutput / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Saved:        ${totalReduction}% (${((totalInput - totalOutput) / 1024 / 1024).toFixed(2)}MB)`);
  console.log(`\nOptimized files are in: ${OUTPUT_DIR}`);
  console.log('To apply: copy files from assets-videos-optimized/characters back to public/assets/characters');
}

main().catch(console.error);
