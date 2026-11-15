import type { CommuteEmployer } from './commuteEmployers';
import type { PhotoKey } from './photos';

/**
 * Neighborhood data, taken from Chapter 2 ("Neighborhood Playbook") of the Relocate Raleigh guide
 * (content/relocation-guide.md). Edit both together.
 *
 * - `median`: median sale price snapshot from Redfin, March 2026 (Durham: Homes.com, early 2026).
 *   Citywide medians can understate family-home prices; `band` is the guide's realistic 4BR range.
 * - `rtp`: the guide's rush-hour drive range to central RTP.
 * - `schools`: representative patterns from the guide (GreatSchools, early 2026). Assignments are by
 *   address and change; always point people to the district lookup.
 * - Coordinates are approximate centers for map pins and straight-line commute estimates.
 */
export const NEIGHBORHOOD_DATA_AS_OF = 'March 2026';
export const NEIGHBORHOOD_SOURCES = 'Redfin and Homes.com market snapshots (March 2026), compiled in the Relocate Raleigh guide';

export type District = { name: string; lookupUrl: string };

export const DISTRICTS = {
  wake: { name: 'Wake County Public School System', lookupUrl: 'https://www.wcpss.net/enroll/base-schools' },
  durham: { name: 'Durham Public Schools', lookupUrl: 'https://www.dpsnc.net' },
  chccs: { name: 'Chapel Hill-Carrboro City Schools', lookupUrl: 'https://www.chccs.org' },
} satisfies Record<string, District>;

export type Neighborhood = {
  id: string;
  name: string;
  /** One word from the guide's comparison matrix */
  inOneWord: string;
  character: string;
  photo: PhotoKey;
  lat: number;
  lng: number;
  median: { label: string; value: number | null; note?: string };
  band: { low: number; high: number };
  rtp: { min: number; max: number };
  walkScore: string;
  housing: string;
  strength: string;
  tradeoff: string;
  pros: string[];
  cons: string[];
  schoolPatterns: string[];
  district: District;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'morrisville',
    name: 'Morrisville',
    inOneWord: 'Efficient',
    character: 'Practical and globally connected, with the shortest drive to RTP and the airport.',
    photo: 'morrisville-townhomes',
    lat: 35.8238,
    lng: -78.8256,
    median: { label: '$576K', value: 576_000 },
    band: { low: 500_000, high: 800_000 },
    rtp: { min: 10, max: 25 },
    walkScore: '27',
    housing: 'Townhomes and detached homes, with detached homes higher near Parkside and Panther Creek.',
    strength: 'Best commute to central RTP in the region',
    tradeoff: 'More utilitarian feel, without a traditional downtown',
    pros: ['Commute efficiency', 'Strong schools', 'Airport access'],
    cons: ['More utilitarian feel', 'Less of a "downtown suburb" identity than Cary or Apex'],
    schoolPatterns: [
      'Cedar Fork Elementary, West Cary Middle, Panther Creek High',
      'Alston Ridge Elementary, Alston Ridge Middle, Panther Creek High',
    ],
    district: DISTRICTS.wake,
  },
  {
    id: 'south-durham',
    name: 'South Durham',
    inOneWord: 'Value',
    character: 'Southpoint and Woodcroft: mixed-age neighborhoods and one of the best value-plus-commute compromises.',
    photo: 'durham-american-tobacco',
    lat: 35.9046,
    lng: -78.9437,
    median: { label: '$435K–$600K', value: 520_000, note: 'Woodcroft about $435K (Homes.com); Southpoint mid-$500Ks to mid-$600Ks' },
    band: { low: 450_000, high: 750_000 },
    rtp: { min: 15, max: 25 },
    walkScore: 'Not listed',
    housing: 'A broad mix of older and newer single-family homes, with trail-connected streets in Woodcroft.',
    strength: '15–25 minute rush-hour drive to RTP',
    tradeoff: 'School ratings vary more by address',
    pros: ['RTP access', 'Broader price range than west Wake'],
    cons: ['More school-rating variability', 'Less of the polished master-planned feel'],
    schoolPatterns: ['Southwest Elementary or Hope Valley Elementary, Sherwood Githens Middle, Jordan High'],
    district: DISTRICTS.durham,
  },
  {
    id: 'cary',
    name: 'Cary',
    inOneWord: 'Polished',
    character: 'Family-oriented and school-driven. The most common landing spot for tech families.',
    photo: 'cary-park',
    lat: 35.788,
    lng: -78.81,
    median: { label: '$600K', value: 600_000 },
    band: { low: 600_000, high: 1_100_000 },
    rtp: { min: 20, max: 35 },
    walkScore: '28',
    housing: 'Mostly detached homes, with the highest prices in west Cary and newer school zones.',
    strength: 'Schools, parks and a strong greenway network',
    tradeoff: 'Prices climb fast in the top school zones',
    pros: ['Schools', 'Parks and greenways', 'RTP access'],
    cons: ['Price pressure in top school zones', '"Cary" varies a lot once you go far west'],
    schoolPatterns: [
      'Green Hope Elementary, Davis Drive Middle, Green Hope High',
      'White Oak Elementary, Mills Park Middle, Green Level High',
    ],
    district: DISTRICTS.wake,
  },
  {
    id: 'apex',
    name: 'Apex',
    inOneWord: 'Newer',
    character: 'Family-first and polished, with newer construction and a small historic downtown.',
    photo: 'apex-salem-street',
    lat: 35.7327,
    lng: -78.8503,
    median: { label: '$630K', value: 630_000 },
    band: { low: 550_000, high: 850_000 },
    rtp: { min: 25, max: 45 },
    walkScore: '26',
    housing: 'Newer subdivisions, plus older homes near the Salem Street downtown.',
    strength: 'Attractive newer neighborhoods and a charming downtown',
    tradeoff: 'Longer RTP commute than Cary or Morrisville',
    pros: ['Strong schools', 'Newer subdivisions', 'Charming downtown'],
    cons: ['Longer RTP commute', 'Prices escalate near top school zones'],
    schoolPatterns: [
      'Olive Chapel Elementary, Lufkin Road Middle, Apex Friendship High',
      'Oakview Elementary and Salem Middle are common cross-shops',
    ],
    district: DISTRICTS.wake,
  },
  {
    id: 'chapel-hill',
    name: 'Chapel Hill',
    inOneWord: 'Academic',
    character: 'A college town with a civic feel, home to UNC, and the most walkable option on this list.',
    photo: 'chapel-hill-franklin',
    lat: 35.9132,
    lng: -79.0558,
    median: { label: '$503K citywide', value: 503_000, note: 'Citywide figure understates detached family homes; use the band' },
    band: { low: 650_000, high: 1_200_000 },
    rtp: { min: 25, max: 40 },
    walkScore: '34 (Transit Score 37)',
    housing: 'Established detached homes, many older, plus Meadowmont and other planned neighborhoods.',
    strength: 'Walkability and university-town amenities',
    tradeoff: 'Price and older-home maintenance',
    pros: ['Civic feel', 'Schools', 'University-town amenities'],
    cons: ['Price', 'Older-housing maintenance', 'Commute good but not Morrisville-short'],
    schoolPatterns: [
      'Rashkis Elementary, Grey Culbreth Middle, East Chapel Hill High',
      'Estes Hills Elementary, Guy Phillips Middle, East Chapel Hill High',
    ],
    district: DISTRICTS.chccs,
  },
  {
    id: 'holly-springs',
    name: 'Holly Springs',
    inOneWord: 'Young-family',
    character: 'Young-family suburban, with newer construction and a strong local identity.',
    photo: 'holly-springs',
    lat: 35.6513,
    lng: -78.8336,
    median: { label: '$613K', value: 613_000 },
    band: { low: 575_000, high: 850_000 },
    rtp: { min: 25, max: 40 },
    walkScore: '19',
    housing: 'Newer construction, including golf-course and amenity communities at the top end.',
    strength: 'Newer homes and plenty of parks',
    tradeoff: 'Least walkable of the major family suburbs',
    pros: ['Newer homes', 'Parks', 'Strong local identity'],
    cons: ['Weak walkability', 'Commute depends heavily on route (and NC-540 tolls)'],
    schoolPatterns: [
      'Oakview Elementary, Apex Friendship Middle, Holly Springs High',
      'Holly Ridge Middle, Apex Friendship High',
    ],
    district: DISTRICTS.wake,
  },
  {
    id: 'north-raleigh',
    name: 'North Raleigh',
    inOneWord: 'Established',
    character: 'Inside the I-540 beltway: established, mixed-age and central, from North Hills to Falls of Neuse.',
    photo: 'north-hills',
    lat: 35.8406,
    lng: -78.6427,
    median: { label: '~$575K (North Hills)', value: 575_000, note: 'One number is hard here; pockets vary widely' },
    band: { low: 650_000, high: 1_250_000 },
    rtp: { min: 25, max: 45 },
    walkScore: 'Low to moderate, better in North Hills',
    housing: 'Mature-tree neighborhoods of older detached homes, plus newer townhomes near North Hills.',
    strength: 'Central, with access to both RTP and downtown',
    tradeoff: 'School ratings and value vary house by house',
    pros: ['Centrality', 'Mature trees', 'Easy reach to RTP and downtown'],
    cons: ['More school-rating variability', 'Uneven value from house to house'],
    schoolPatterns: ['Around Midtown: Brooks or Green Elementary, Carroll Middle, Sanderson High'],
    district: DISTRICTS.wake,
  },
  {
    id: 'downtown-raleigh',
    name: 'Downtown Raleigh',
    inOneWord: 'Urban',
    character: 'The most walkable, city-like choice, from Glenwood South to Oakwood and Boylan Heights.',
    photo: 'downtown-raleigh',
    lat: 35.7796,
    lng: -78.6382,
    median: { label: 'High $300Ks*', value: 390_000, note: 'Mixes condos with very few family houses; use the band' },
    band: { low: 800_000, high: 1_700_000 },
    rtp: { min: 25, max: 40 },
    walkScore: 'Highest in the region (core blocks)',
    housing: 'Condos and townhomes, with scarce historic detached homes in Oakwood and Boylan Heights.',
    strength: 'A genuine urban lifestyle',
    tradeoff: 'Detached family homes are scarce and expensive',
    pros: ['Genuine urban lifestyle', 'In-town access'],
    cons: ['Detached-home scarcity and cost', 'Weaker fit if the RTP commute is the top priority'],
    schoolPatterns: ['Close-in listings often: Wiley Elementary, Oberlin Middle, Broughton High'],
    district: DISTRICTS.wake,
  },
  {
    id: 'wake-forest',
    name: 'Wake Forest',
    inOneWord: 'Spacious',
    character: 'Established with a small-town feel and the most house for the money on this list.',
    photo: 'wake-forest-downtown',
    lat: 35.9799,
    lng: -78.5097,
    median: { label: '$454K', value: 454_000 },
    band: { low: 450_000, high: 750_000 },
    rtp: { min: 35, max: 55 },
    walkScore: '20',
    housing: 'Detached homes on larger lots, many in the Heritage area in the low-to-mid $500Ks.',
    strength: 'Affordability and space',
    tradeoff: 'The longest and least predictable RTP commute here',
    pros: ['Affordability', 'Space', 'Established character'],
    cons: ['Commute friction to RTP', 'Slightly weaker high-school ratings than west Wake'],
    schoolPatterns: ['Heritage area: Heritage Elementary, Heritage Middle, Heritage High'],
    district: DISTRICTS.wake,
  },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/**
 * Rough off-peak drive estimate from straight-line distance (about 28 km/h average door to door,
 * clamped to 8–90 minutes). Not live routing. Rush hour is usually longer; see `rtp` ranges.
 */
export function estimateCommuteMinutes(from: Pick<CommuteEmployer, 'lat' | 'lng'>, to: { lat: number; lng: number }): number {
  const km = haversineKm(from.lat, from.lng, to.lat, to.lng);
  return Math.min(90, Math.max(8, Math.round((km / 28) * 60 / 5) * 5));
}

export const COMMUTE_METHOD =
  'Rounded estimate from straight-line distance, not live traffic. Rush hour is often longer.';

export type RankedNeighborhood = Neighborhood & { commute: number };

export function withCommutes(employer: Pick<CommuteEmployer, 'lat' | 'lng'>): RankedNeighborhood[] {
  return NEIGHBORHOODS.map((n) => ({ ...n, commute: estimateCommuteMinutes(employer, n) }));
}

export function formatK(usd: number): string {
  return usd >= 1_000_000 ? `$${(usd / 1_000_000).toFixed(usd % 100_000 === 0 ? 1 : 2)}M` : `$${Math.round(usd / 1000)}K`;
}

export function formatBand(n: Pick<Neighborhood, 'band'>): string {
  return `${formatK(n.band.low)}–${formatK(n.band.high)}`;
}

export function getNeighborhood(id: string) {
  return NEIGHBORHOODS.find((n) => n.id === id);
}
