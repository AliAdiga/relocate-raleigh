import type { CommuteEmployer } from './commuteEmployers';

/**
 * Example Triangle neighborhoods for the explorer.
 * Prices are rough median home values and school scores are simplified 1–10 ratings —
 * conversation starters, not quotes. Verify with current listings and school assignment tools.
 */
export type Neighborhood = {
  id: string;
  name: string;
  /** Approximate median home value, USD */
  price: number;
  /** Simplified school rating, 1–10 */
  schools: number;
  lat: number;
  lng: number;
  /** Position on the schematic fallback map (0–100) */
  x: number;
  y: number;
  blurb: string;
  image: string;
};

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'west-cary',
    name: 'West Cary',
    price: 750_000,
    schools: 10,
    lat: 35.8031,
    lng: -78.8789,
    x: 42,
    y: 48,
    blurb: 'Established suburbs with greenways and some of the most sought-after school assignments in Wake County.',
    image: '/renders/house-modern-pool.png',
  },
  {
    id: 'apex',
    name: 'Apex',
    price: 620_000,
    schools: 9,
    lat: 35.7327,
    lng: -78.8503,
    x: 38,
    y: 68,
    blurb: 'A walkable historic downtown, newer subdivisions, and quick access to US-1 and NC-540.',
    image: '/renders/house-white-terraces.png',
  },
  {
    id: 'morrisville',
    name: 'Morrisville',
    price: 550_000,
    schools: 8,
    lat: 35.8238,
    lng: -78.8256,
    x: 44,
    y: 38,
    blurb: 'Next to RTP and RDU airport, with townhomes, a large Indian community, and short commutes.',
    image: '/renders/house-blue-roof.png',
  },
  {
    id: 'holly-springs',
    name: 'Holly Springs',
    price: 510_000,
    schools: 9,
    lat: 35.6513,
    lng: -78.8336,
    x: 32,
    y: 82,
    blurb: 'Family-focused and fast-growing, with newer schools and more house for the money.',
    image: '/renders/house-modern-pool.png',
  },
  {
    id: 'downtown-raleigh',
    name: 'Downtown Raleigh',
    price: 680_000,
    schools: 7,
    lat: 35.7796,
    lng: -78.6382,
    x: 78,
    y: 58,
    blurb: 'Restaurants, parks and older homes. The most city-like option if you want to walk places.',
    image: '/renders/house-white-terraces.png',
  },
  {
    id: 'south-durham',
    name: 'South Durham',
    price: 480_000,
    schools: 7,
    lat: 35.908,
    lng: -78.939,
    x: 28,
    y: 28,
    blurb: 'Close to RTP and Duke, with Southpoint shopping and a mix of older and new construction.',
    image: '/renders/house-blue-roof.png',
  },
  {
    id: 'north-hills',
    name: 'North Hills',
    price: 850_000,
    schools: 8,
    lat: 35.8406,
    lng: -78.6427,
    x: 72,
    y: 45,
    blurb: 'Midtown Raleigh living around a busy shopping and dining district, with larger lots nearby.',
    image: '/renders/house-modern-pool.png',
  },
  {
    id: 'fuquay-varina',
    name: 'Fuquay-Varina',
    price: 420_000,
    schools: 7,
    lat: 35.5843,
    lng: -78.8,
    x: 35,
    y: 95,
    blurb: 'Small-town feel at the southern edge of Wake County, with the lowest prices on this list.',
    image: '/renders/house-white-terraces.png',
  },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/** Rough door-to-door minutes from straight-line distance (illustrative, not traffic-aware). */
export function estimateCommuteMinutes(employer: CommuteEmployer, n: Pick<Neighborhood, 'lat' | 'lng'>): number {
  const km = haversineKm(employer.lat, employer.lng, n.lat, n.lng);
  return Math.min(90, Math.max(8, Math.round((km / 28) * 60)));
}

export type RankedNeighborhood = Neighborhood & { commute: number };

export function withCommutes(employer: CommuteEmployer): RankedNeighborhood[] {
  return NEIGHBORHOODS.map((n) => ({ ...n, commute: estimateCommuteMinutes(employer, n) }));
}

export function formatK(usd: number): string {
  return usd >= 1_000_000 ? `$${(usd / 1_000_000).toFixed(2)}M` : `$${Math.round(usd / 1000)}k`;
}
