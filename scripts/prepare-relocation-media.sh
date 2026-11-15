#!/usr/bin/env bash
# Builds web-ready media for the architectural hero and concept-home explorer.
#
# Usage: scripts/prepare-relocation-media.sh "/path/to/source folder"
#
# Source masters (Google Flow exports, kept OUTSIDE the repo and never modified):
#   Architectural_roof_reveal_transi_*.mp4  -> roof-reveal.mp4     (one-time reveal)
#   Animating_living-room_photograph_*.mp4  -> living-room.mp4
#   Animate_home_office_photograph_*.mp4    -> home-office.mp4
#   Animating_bedroom_photograph_arc_*.mp4  -> primary-bedroom.mp4
#   Furnished Roof-Off Raleigh Dollhouse.png           -> (reference only, see note)
#   Raleigh Miniature Home, Roof Restored.png          -> rr-03-explore-roof-on.webp
#   Sunlit Raleigh Living Room with Garden Views.png   -> rr-04-living-room.webp
#   Cozy oak home office with garden view.png          -> rr-05-home-office.webp
#   Warm olive-toned primary bedroom.png               -> rr-06-primary-bedroom.webp
#
# Note: the cutaway PNG is slightly offset from the reveal video's last frame, so the static
# cutaway (rr-02-explore-cutaway.webp) is the reveal's exact final frame. Hotspot coordinates in
# src/data/conceptHome.ts are measured against that file.
#
# The homepage hero now uses scripts/prepare-hero-media.sh.
set -euo pipefail
SRC="${1:?source folder required}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media/relocation"
mkdir -p "$OUT"

pick() { ls "$SRC"/$1 | head -n 1; }
H264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -an)

REVEAL="$(pick 'Architectural_roof_reveal*.mp4')"
LIVING="$(pick 'Animating_living-room*.mp4')"
OFFICE="$(pick 'Animate_home_office*.mp4')"
BEDROOM="$(pick 'Animating_bedroom*.mp4')"

for pair in "$REVEAL:roof-reveal" "$LIVING:living-room" "$OFFICE:home-office" "$BEDROOM:primary-bedroom"; do
  ffmpeg -v error -y -i "${pair%%:*}" "${H264[@]}" -crf 22 "$OUT/${pair##*:}.mp4"
done

# Static cutaway = exact final frame of the reveal (lossless extract, then WebP).
LAST=$(( $(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$REVEAL") - 1 ))
ffmpeg -v error -y -i "$REVEAL" -vf "select=eq(n\,$LAST)" -frames:v 1 "$OUT/rr-02-explore-cutaway.png"
ffmpeg -v error -y -i "$OUT/rr-02-explore-cutaway.png" -c:v libwebp -quality 90 "$OUT/rr-02-explore-cutaway.webp"
rm "$OUT/rr-02-explore-cutaway.png"

# Stills: WebP at native resolution (Next/Image makes responsive sizes).
webp() { ffmpeg -v error -y -i "$SRC/$1" -c:v libwebp -quality 86 "$OUT/$2"; }
webp "Raleigh Miniature Home, Roof Restored.png" rr-03-explore-roof-on.webp
webp "Sunlit Raleigh Living Room with Garden Views.png" rr-04-living-room.webp
webp "Cozy oak home office with garden view.png" rr-05-home-office.webp
webp "Warm olive-toned primary bedroom.png" rr-06-primary-bedroom.webp

ls -la "$OUT"
