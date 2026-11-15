'use client';

import React, { useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { COMMUTE_EMPLOYER_XY, type CommuteEmployer } from '@/data/commuteEmployers';
import { formatK, type RankedNeighborhood } from '@/data/neighborhoods';
import { SHARED_GOOGLE_MAPS_LOADER_ID } from '@/lib/googleMapsLoaderId';

const PURPLE = '#3741B5';
const triangleCenter = { lat: 35.82, lng: -78.78 };

type Props = {
  employer: CommuteEmployer;
  neighborhoods: RankedNeighborhood[];
  maxCommute: number;
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Map view for the neighborhood explorer. Uses Google Maps when a key is set, otherwise a schematic. */
export default function CommuteMap(props: Props) {
  const hasMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim());
  return hasMapsKey ? <GoogleMapPanel {...props} /> : <SchematicMap {...props} />;
}

function GoogleMapPanel({ employer, neighborhoods, maxCommute, selectedId, onSelect }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? '';
  const { isLoaded, loadError } = useJsApiLoader({
    id: SHARED_GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: employer.lat, lng: employer.lng });
      neighborhoods.forEach((n) => bounds.extend({ lat: n.lat, lng: n.lng }));
      map.fitBounds(bounds, 48);
    },
    [employer, neighborhoods],
  );

  if (loadError) {
    return (
      <MapMessage>
        The map couldn&apos;t load. Check that the Maps JavaScript API is enabled for this key.
      </MapMessage>
    );
  }
  if (!isLoaded) return <MapMessage>Loading map…</MapMessage>;

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-[var(--radius-card)]">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={triangleCenter}
        zoom={10}
        onLoad={onLoad}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true, gestureHandling: 'cooperative' }}
      >
        <Marker
          position={{ lat: employer.lat, lng: employer.lng }}
          title={employer.name}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#1F1F1F',
            fillOpacity: 1,
            strokeColor: '#FEFEFF',
            strokeWeight: 3,
          }}
        />
        {neighborhoods.map((n) => {
          const ok = n.commute <= maxCommute;
          const sel = n.id === selectedId;
          return (
            <Marker
              key={n.id}
              position={{ lat: n.lat, lng: n.lng }}
              title={`${n.name}, about ${n.commute} min`}
              onClick={() => onSelect(n.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: sel ? 10 : 7,
                fillColor: ok ? PURPLE : '#BDBDBD',
                fillOpacity: 1,
                strokeColor: '#FEFEFF',
                strokeWeight: 2,
              }}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

function SchematicMap({ employer, neighborhoods, maxCommute, selectedId, onSelect }: Props) {
  const e = COMMUTE_EMPLOYER_XY[employer.id] ?? { x: 50, y: 50 };
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[var(--radius-card)] bg-fog">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="schematic-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E4E4E4" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#schematic-grid)" />
        {neighborhoods.map((n) =>
          n.commute <= maxCommute ? (
            <line key={n.id} x1={e.x} y1={e.y} x2={n.x} y2={n.y} stroke={PURPLE} strokeOpacity="0.25" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          ) : null,
        )}
      </svg>

      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
        style={{ left: `${e.x}%`, top: `${Math.min(92, Math.max(8, e.y))}%` }}
      >
        <span className="block h-4 w-4 rounded-full border-[3px] border-paper bg-ink shadow" />
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper">
          {employer.name}
        </span>
      </div>

      {neighborhoods.map((n) => {
        const ok = n.commute <= maxCommute;
        const sel = n.id === selectedId;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            aria-pressed={sel}
            aria-label={`${n.name}, ${formatK(n.price)}, about ${n.commute} minutes`}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${n.x}%`, top: `${Math.min(92, Math.max(8, n.y))}%` }}
          >
            <span
              className={`block rounded-full border-2 border-paper transition-all ${
                sel ? 'h-4 w-4 ring-2 ring-violet/40' : 'h-3 w-3'
              }`}
              style={{ background: ok ? PURPLE : '#BDBDBD' }}
            />
            <span
              className={`absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-paper/95 px-2 py-0.5 text-[11px] shadow-sm ${
                sel ? 'font-semibold text-ink' : 'text-ink-soft'
              } ${ok || sel ? '' : 'hidden group-hover:block'}`}
            >
              {n.name}, {n.commute} min
            </span>
          </button>
        );
      })}

      <p className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] text-ink-soft">
        Schematic layout, not to scale
      </p>
    </div>
  );
}

function MapMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[360px] items-center justify-center rounded-[var(--radius-card)] bg-fog p-6 text-center text-sm text-ink-soft">
      {children}
    </div>
  );
}
