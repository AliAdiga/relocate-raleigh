'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { SHARED_GOOGLE_MAPS_LOADER_ID } from '@/lib/googleMapsLoaderId';
import {
  CULTURE_STORES,
  CULTURE_TABS,
  type CultureStore,
  type CultureTabId,
} from '@/data/cultureStores';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const TRIANGLE = { lat: 35.82, lng: -78.78 };

const TAB_SHORT: Record<CultureTabId, string> = {
  slavic: 'Slavic',
  asian: 'Asian',
  indian: 'Indian',
  american: 'American',
};

function fitBoundsForStores(map: google.maps.Map, list: CultureStore[]) {
  if (list.length === 0) return;
  const bounds = new google.maps.LatLngBounds();
  list.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
  map.fitBounds(bounds, 56);
}

type CultureStoresGoogleMapProps = {
  apiKey: string;
  stores: CultureStore[];
  tab: CultureTabId;
  selectedId: string | null;
  selectedStore: CultureStore | null;
  onMapReady: (map: google.maps.Map | null) => void;
  onSelectStore: (s: CultureStore) => void;
  onCloseInfo: () => void;
};

function CultureStoresGoogleMap({
  apiKey,
  stores,
  tab,
  selectedId,
  selectedStore,
  onMapReady,
  onSelectStore,
  onCloseInfo,
}: CultureStoresGoogleMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: SHARED_GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      fitBoundsForStores(mapRef.current, stores);
    }
  }, [tab, stores, isLoaded]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      onMapReady(map);
      fitBoundsForStores(map, stores);
    },
    [stores, onMapReady],
  );

  useEffect(() => {
    return () => onMapReady(null);
  }, [onMapReady]);

  if (loadError) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center p-6 text-center text-sm text-ink-soft">
        The map couldn&apos;t load. Check that the Maps JavaScript API is enabled for this key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-ink-soft">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={TRIANGLE}
      zoom={9}
      onLoad={onLoad}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        gestureHandling: 'greedy',
      }}
    >
      {stores.map((s) => {
        const isSel = s.id === selectedId;
        return (
          <Marker
            key={s.id}
            position={{ lat: s.lat, lng: s.lng }}
            title={s.name}
            onClick={() => onSelectStore(s)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: isSel ? 11 : 7,
              fillColor: isSel ? '#3741B5' : '#9B9B9B',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        );
      })}
      {selectedStore && (
        <InfoWindow
          position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
          onCloseClick={onCloseInfo}
        >
          <div className="max-w-[220px] p-1 text-ink">
            <p className="text-sm font-semibold">{selectedStore.name}</p>
            <p className="mt-1 text-xs font-medium leading-snug">{selectedStore.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default function InfrastructureCultureMap() {
  const [tab, setTab] = useState<CultureTabId>('slavic');
  const stores = CULTURE_STORES[tab];
  const [selectedId, setSelectedId] = useState<string | null>(CULTURE_STORES.slavic[0]?.id ?? null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? '';
  const hasMapsKey = Boolean(apiKey);

  const onMapReady = useCallback((map: google.maps.Map | null) => {
    mapInstanceRef.current = map;
  }, []);

  const changeTab = (id: CultureTabId) => {
    setTab(id);
    setSelectedId(CULTURE_STORES[id][0]?.id ?? null);
  };

  const focusStore = useCallback((s: CultureStore) => {
    setSelectedId(s.id);
    const m = mapInstanceRef.current;
    if (m) {
      m.panTo({ lat: s.lat, lng: s.lng });
      m.setZoom(14);
    }
  }, []);

  const tabMeta = CULTURE_TABS.find((t) => t.id === tab);
  const selectedStore = stores.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-paper">
      <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Store groups">
          {CULTURE_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => changeTab(t.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-ink text-paper' : 'bg-fog text-ink-soft hover:text-ink'
              }`}
            >
              {TAB_SHORT[t.id]}
            </button>
          ))}
        </div>
        {tabMeta && <p className="max-w-md text-sm leading-relaxed text-ink-soft">{tabMeta.blurb}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="border-b border-line p-3 sm:p-4 lg:border-b-0 lg:border-r">
          <ul className="max-h-[440px] space-y-1 overflow-y-auto" aria-label={`${tabMeta?.label ?? ''} stores`}>
            {stores.map((s) => {
              const active = s.id === selectedId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => focusStore(s)}
                    aria-pressed={active}
                    className={`w-full rounded-xl px-4 py-3 text-left transition-colors ${
                      active ? 'bg-fog' : 'hover:bg-fog/60'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-violet' : 'bg-line'}`} aria-hidden />
                      {s.name}
                    </span>
                    <span className="mt-0.5 block pl-4 text-sm text-ink-soft">{s.address}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 px-4 text-xs text-stone">Pins are approximate. Check hours and addresses before you go.</p>
        </div>

        <div className="min-h-[360px] bg-fog lg:min-h-[480px]">
          {hasMapsKey ? (
            <CultureStoresGoogleMap
              apiKey={apiKey}
              stores={stores}
              tab={tab}
              selectedId={selectedId}
              selectedStore={selectedStore}
              onMapReady={onMapReady}
              onSelectStore={focusStore}
              onCloseInfo={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 p-8 text-center">
              {selectedStore ? (
                <>
                  <p className="text-xl font-semibold tracking-tight">{selectedStore.name}</p>
                  <p className="max-w-sm text-ink-soft">{selectedStore.address}</p>
                  <a
                    className="btn-outline mt-2 px-6 py-3 text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedStore.name} ${selectedStore.address}`)}`}
                  >
                    Open in Google Maps
                  </a>
                </>
              ) : (
                <p className="text-ink-soft">Choose a store to see where it is.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
