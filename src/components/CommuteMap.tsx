'use client';

import React, { useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { COMMUTE_EMPLOYERS, type CommuteEmployer } from '@/data/commuteEmployers';
import type { RankedNeighborhood } from '@/data/neighborhoods';
import { SHARED_GOOGLE_MAPS_LOADER_ID } from '@/lib/googleMapsLoaderId';

type Props = {
  employer: CommuteEmployer;
  neighborhoods: RankedNeighborhood[];
  isMatch: (n: RankedNeighborhood) => boolean;
  selectedId: string;
  onSelect: (id: string) => void;
};

/**
 * Explorer map. Uses Google Maps when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set; otherwise an SVG map
 * positioned by real latitude/longitude (equirectangular), with a scale bar. Not a road map.
 */
export default function CommuteMap(props: Props) {
  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
  return hasMapsKey ? <GoogleMapPanel {...props} /> : <LatLngMap {...props} />;
}

function GoogleMapPanel({ employer, neighborhoods, isMatch, selectedId, onSelect }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? '';
  const { isLoaded, loadError } = useJsApiLoader({ id: SHARED_GOOGLE_MAPS_LOADER_ID, googleMapsApiKey: apiKey });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: employer.lat, lng: employer.lng });
      neighborhoods.forEach((n) => bounds.extend({ lat: n.lat, lng: n.lng }));
      map.fitBounds(bounds, 40);
    },
    [employer, neighborhoods],
  );

  if (loadError) return <LatLngMap employer={employer} neighborhoods={neighborhoods} isMatch={isMatch} selectedId={selectedId} onSelect={onSelect} />;
  if (!isLoaded)
    return <div className="flex aspect-[5/4] items-center justify-center rounded-[var(--radius-card)] bg-fog text-sm text-ink-soft">Loading map…</div>;

  return (
    <div className="aspect-[5/4] w-full overflow-hidden rounded-[var(--radius-card)]">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat: 35.82, lng: -78.78 }}
        zoom={10}
        onLoad={onLoad}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, gestureHandling: 'cooperative' }}
      >
        <Marker
          position={{ lat: employer.lat, lng: employer.lng }}
          title={employer.name}
          icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#1F1F1F', fillOpacity: 1, strokeColor: '#FEFEFF', strokeWeight: 3 }}
        />
        {neighborhoods.map((n) => {
          const sel = n.id === selectedId;
          const ok = isMatch(n);
          return (
            <Marker
              key={n.id}
              position={{ lat: n.lat, lng: n.lng }}
              title={n.name}
              onClick={() => onSelect(n.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: sel ? 10 : 7,
                fillColor: sel ? '#FF791A' : ok ? '#1F1F1F' : '#FEFEFF',
                fillOpacity: 1,
                strokeColor: sel ? '#1F1F1F' : ok ? '#FEFEFF' : '#8A8A8A',
                strokeWeight: 2,
              }}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

// Fixed bounds covering every neighborhood and employer, so the map doesn't jump between filters.
const B = { minLat: 35.6, maxLat: 36.03, minLng: -79.11, maxLng: -78.47 };
const COS = Math.cos((35.8 * Math.PI) / 180);
const W = 1000;
const H = Math.round((W * (B.maxLat - B.minLat)) / ((B.maxLng - B.minLng) * COS));
const project = (lat: number, lng: number) => ({
  x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * W,
  y: ((B.maxLat - lat) / (B.maxLat - B.minLat)) * H,
});
const UNITS_PER_KM = H / ((B.maxLat - B.minLat) * 111.2);

/** Where to place each label so close neighbors don't collide. */
const LABEL: Record<string, 'r' | 'l' | 't' | 'b'> = {
  morrisville: 't',
  cary: 'b',
  'north-raleigh': 't',
  'downtown-raleigh': 'b',
  'chapel-hill': 'b',
  'south-durham': 't',
  apex: 'l',
  'holly-springs': 'r',
  'wake-forest': 'l',
};

const REFERENCE = [
  { name: 'RTP', lat: 35.9, lng: -78.86 },
  { name: 'Durham', lat: 35.995, lng: -78.9 },
  { name: 'Raleigh', lat: 35.81, lng: -78.6 },
];

function LatLngMap({ employer, neighborhoods, isMatch, selectedId, onSelect }: Props) {
  const e = project(employer.lat, employer.lng);
  const bar = 10 * UNITS_PER_KM;

  return (
    <figure className="w-full">
      <div className="overflow-hidden rounded-[var(--radius-card)] bg-[#f3f1ec]">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label={`Map of neighborhoods around ${employer.name}`}>
          {/* Faint graticule */}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1="0" x2={W} y1={(H / 5) * (i + 0.5)} y2={(H / 5) * (i + 0.5)} stroke="#1F1F1F" strokeOpacity="0.04" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`v${i}`} y1="0" y2={H} x1={(W / 6) * (i + 0.5)} x2={(W / 6) * (i + 0.5)} stroke="#1F1F1F" strokeOpacity="0.04" />
          ))}
          {REFERENCE.map((r) => {
            const p = project(r.lat, r.lng);
            return (
              <text key={r.name} x={p.x} y={p.y} textAnchor="middle" fontSize="30" fontWeight="600" fill="#1F1F1F" fillOpacity="0.09" letterSpacing="4">
                {r.name.toUpperCase()}
              </text>
            );
          })}

          {/* Other employers, faint */}
          {COMMUTE_EMPLOYERS.filter((x) => x.id !== employer.id).map((x) => {
            const p = project(x.lat, x.lng);
            return <rect key={x.id} x={p.x - 4} y={p.y - 4} width="8" height="8" fill="#1F1F1F" fillOpacity="0.15" />;
          })}

          {/* Routes from work to each matching neighborhood */}
          {neighborhoods.filter(isMatch).map((n) => {
            const p = project(n.lat, n.lng);
            return <line key={`r-${n.id}`} x1={e.x} y1={e.y} x2={p.x} y2={p.y} stroke="#1F1F1F" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />;
          })}

          {/* Employer */}
          <g>
            <rect x={e.x - 11} y={e.y - 11} width="22" height="22" rx="4" fill="#1F1F1F" stroke="#FEFEFF" strokeWidth="4" />
            <text x={e.x} y={e.y - 22} textAnchor="middle" fontSize="22" fontWeight="600" fill="#1F1F1F" paintOrder="stroke" stroke="#f3f1ec" strokeWidth="6">
              {employer.name}
            </text>
          </g>

          {neighborhoods.map((n) => {
            const p = project(n.lat, n.lng);
            const sel = n.id === selectedId;
            const ok = isMatch(n);
            const pos = LABEL[n.id] ?? 'r';
            const lx = pos === 'r' ? p.x + 20 : pos === 'l' ? p.x - 20 : p.x;
            const ly = pos === 't' ? p.y - 22 : pos === 'b' ? p.y + 36 : p.y + 8;
            const anchor = pos === 'r' ? 'start' : pos === 'l' ? 'end' : 'middle';
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={sel}
                aria-label={`${n.name}${ok ? ', matches your filters' : ', outside your filters'}`}
                className="cursor-pointer outline-none [&:focus-visible_circle.dot]:stroke-[#3741B5]"
                onClick={() => onSelect(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    onSelect(n.id);
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r="28" fill="transparent" />
                {sel && <circle cx={p.x} cy={p.y} r="22" fill="none" stroke="#1F1F1F" strokeWidth="2.5" />}
                <circle
                  className="dot"
                  cx={p.x}
                  cy={p.y}
                  r={sel ? 13 : 10}
                  fill={sel ? '#FF791A' : ok ? '#1F1F1F' : '#FEFEFF'}
                  stroke={sel ? '#FEFEFF' : ok ? '#FEFEFF' : '#8A8A8A'}
                  strokeWidth={ok || sel ? 4 : 3}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  fontSize={sel ? 25 : 22}
                  fontWeight={sel ? 700 : ok ? 600 : 400}
                  fill={ok || sel ? '#1F1F1F' : '#6E6E6E'}
                  paintOrder="stroke"
                  stroke="#f3f1ec"
                  strokeWidth="6"
                >
                  {n.name}
                </text>
              </g>
            );
          })}

          {/* Scale bar */}
          <g transform={`translate(${W - bar - 36}, ${H - 34})`}>
            <line x1="0" x2={bar} y1="0" y2="0" stroke="#1F1F1F" strokeWidth="3" />
            <line x1="0" x2="0" y1="-7" y2="7" stroke="#1F1F1F" strokeWidth="3" />
            <line x1={bar} x2={bar} y1="-7" y2="7" stroke="#1F1F1F" strokeWidth="3" />
            <text x={bar / 2} y="-12" textAnchor="middle" fontSize="20" fill="#1F1F1F">
              10 km (6 mi)
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full bg-ink" /> Matches your filters
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full border-2 border-[#8A8A8A] bg-paper" /> Outside your filters
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full bg-ember ring-2 ring-ink" /> Selected
        </span>
        <span>Approximate locations by latitude and longitude, not a road map.</span>
      </figcaption>
    </figure>
  );
}
