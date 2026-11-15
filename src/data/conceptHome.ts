/**
 * Illustrative concept home (Google Flow renders, not a real listing).
 * Media is prepared by scripts/prepare-relocation-media.sh into /public/media/relocation.
 *
 * Hotspot coordinates are percentages of rr-02-explore-cutaway.webp (1280 x 720), which is the
 * exact final frame of roof-reveal.mp4. Re-measure them if either file changes.
 */
const M = '/media/relocation';

export const CONCEPT_HOME = {
  aspect: { w: 1280, h: 720 },
  hero: {
    still: { src: `${M}/rr-01-hero-master.webp`, width: 1672, height: 941 },
    video: `${M}/hero-ambient.mp4`,
    alt: 'Illustration of a cream single-story home with a dark metal roof, a timber front porch, a young tree and a planted front garden',
  },
  exterior: {
    still: { src: `${M}/rr-03-explore-roof-on.webp`, width: 1672, height: 941 },
    alt: 'Illustrated model of a single-story home seen from above, with the roof on',
  },
  revealVideo: `${M}/roof-reveal.mp4`,
  cutaway: {
    still: { src: `${M}/rr-02-explore-cutaway.webp`, width: 1280, height: 720 },
    alt: 'Illustrated model of the same home with the roof removed, showing a living room, kitchen, dining area, two bedrooms, a bathroom and a home office',
  },
} as const;

export type RoomId = 'living-room' | 'home-office' | 'primary-bedroom';

export type Room = {
  id: RoomId;
  name: string;
  description: string;
  still: { src: string; width: number; height: number };
  video: string;
  alt: string;
  /** Percent of the cutaway image */
  hotspot: { x: number; y: number };
};

export const ROOMS: Room[] = [
  {
    id: 'living-room',
    name: 'Living room',
    description: 'Consider seating, natural light, and how the space supports your daily routine.',
    still: { src: `${M}/rr-04-living-room.webp`, width: 1672, height: 941 },
    video: `${M}/living-room.mp4`,
    alt: 'Illustrated living room with a cream sofa, a rust armchair, a round wooden coffee table and large garden windows',
    hotspot: { x: 41, y: 51 },
  },
  {
    id: 'home-office',
    name: 'Home office',
    description: 'Think about a dedicated workspace, daylight, and separation from shared areas.',
    still: { src: `${M}/rr-05-home-office.webp`, width: 1672, height: 941 },
    video: `${M}/home-office.mp4`,
    alt: 'Illustrated home office with an oak desk, a monitor, an olive desk chair, a bookcase and a garden window',
    hotspot: { x: 65, y: 51 },
  },
  {
    id: 'primary-bedroom',
    name: 'Primary bedroom',
    description: 'Consider furniture fit, storage needs, and natural light.',
    still: { src: `${M}/rr-06-primary-bedroom.webp`, width: 1672, height: 941 },
    video: `${M}/primary-bedroom.mp4`,
    alt: 'Illustrated primary bedroom with an upholstered bed, olive and rust pillows, matching nightstands and a garden window',
    hotspot: { x: 64.5, y: 19 },
  },
];
