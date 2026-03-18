#!/bin/bash

INPUT_DIR="public/assets/characters"
echo "🎬 Starting character video optimization..."
echo ""

count=0
total=0
for file in "$INPUT_DIR"/*.mp4; do
    if [ -f "$file" ]; then
        total=$((total + 1))
    fi
done

for file in "$INPUT_DIR"/*.mp4; do
    if [ -f "$file" ]; then
        count=$((count + 1))
        filename=$(basename "$file")
        tempfile="${file%.mp4}_temp.mp4"

        echo "[$count/$total] Processing $filename..."

        # Get original size
        orig_size=$(du -h "$file" | cut -f1)

        # Optimize: reduce resolution to max 720p, lower bitrate, compress audio
        ffmpeg -i "$file" \
            -c:v libx264 -preset slow -crf 30 \
            -vf "scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" \
            -c:a aac -b:a 96k \
            -movflags +faststart \
            -y "$tempfile" 2>/dev/null

        if [ -f "$tempfile" ]; then
            new_size=$(du -h "$tempfile" | cut -f1)
            mv "$tempfile" "$file"
            echo "  ✓ $orig_size → $new_size"
        else
            echo "  ✗ Failed"
        fi
        echo ""
    fi
done

echo "✅ Optimization complete!"
