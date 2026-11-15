#!/usr/bin/env bash
# Builds web media for the homepage hero (farmhouse model on drawings).
#
# Usage: scripts/prepare-hero-media.sh "/path/to/Downloads"
#
# Source masters (Google Flow exports, kept outside the repo and never modified):
#   Architectural_scale_model_of_far*_2K.jpg          2752x1536  desktop still
#   Dogwood_blossoms_swaying_in_sunl*_1080p.mp4        1920x1080  desktop motion
#   Dogwood_blossoms_sway_in_sunlight_*.mp4            720x1280   phone motion
#   House_exterior_with_orange_door_*_2K.jpg           2048x2048  share image source
#
# Both clips are slow push-ins: first and last frames differ a lot, so they are NOT looped.
# The hero plays once and holds the final frame. The phone still is the portrait clip's first
# frame because the square JPG is framed differently (no jump when the video starts).
set -euo pipefail
SRC="${1:?source folder required}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media/hero"
mkdir -p "$OUT"
pick() { ls "$SRC"/$1 | head -n 1; }

WIDE_JPG="$(pick 'Architectural_scale_model_of_far*_2K.jpg')"
WIDE_MP4="$(pick 'Dogwood_blossoms_swaying_in_sunl*_1080p.mp4')"
TALL_MP4="$(pick 'Dogwood_blossoms_sway_in_sunlight_*.mp4')"
SQUARE_JPG="$(pick 'House_exterior_with_orange_door_*_2K.jpg')"

H264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an)

# Stills (WebP). Next/Image creates the responsive sizes.
ffmpeg -v error -y -i "$WIDE_JPG" -vf "scale=2400:-2" -c:v libwebp -quality 84 "$OUT/hero-home-wide.webp"
ffmpeg -v error -y -i "$TALL_MP4" -vf "select=eq(n\,0)" -frames:v 1 -c:v libwebp -quality 90 "$OUT/hero-home-tall.webp"
ffmpeg -v error -y -i "$SQUARE_JPG" -vf "scale=1200:-2" -q:v 3 "$OUT/hero-home-square.jpg"

# Videos: no audio, fast start, native resolution (no upscaling).
ffmpeg -v error -y -i "$WIDE_MP4" "${H264[@]}" -crf 22 "$OUT/hero-home-wide.mp4"
ffmpeg -v error -y -i "$TALL_MP4" "${H264[@]}" -crf 22 "$OUT/hero-home-tall.mp4"

ls -la "$OUT"
