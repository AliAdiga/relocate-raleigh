'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PHOTOS } from '@/data/photos';
import { RESOURCES, RESOURCES_REVIEWED, RESOURCE_CATEGORIES, type ResourceCategory } from '@/data/resources';
import InfrastructureCultureMap from '../InfrastructureCultureMap';

type CatId = ResourceCategory['id'];

const mapsLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** Interest-led browsing of everyday resources. Separate from neighborhood matching by design. */
export default function EverydayLife() {
  const [cat, setCat] = useState<CatId>('parks');
  const meta = RESOURCE_CATEGORIES.find((c) => c.id === cat)!;
  const photo = meta.photo ? PHOTOS[meta.photo] : null;

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="What matters to you" className="flex w-max gap-2">
          {RESOURCE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              id={`tab-${c.id}`}
              role="tab"
              type="button"
              aria-selected={cat === c.id}
              aria-controls={`panel-${c.id}`}
              onClick={() => setCat(c.id)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${cat === c.id ? 'bg-ink text-paper' : 'bg-fog text-ink-soft hover:text-ink'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`panel-${cat}`} role="tabpanel" aria-labelledby={`tab-${cat}`} className="mt-8">
        {cat === 'groceries' ? (
          <div className="space-y-4">
            <p className="max-w-[640px] text-[0.9375rem] leading-relaxed text-ink-soft">{meta.intro}</p>
            <InfrastructureCultureMap />
          </div>
        ) : (
          <div className={`grid gap-8 ${photo ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14' : ''}`}>
            {photo && (
              <figure className="relative self-start overflow-hidden rounded-[var(--radius-panel)]">
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 520px, 92vw" className="aspect-[4/3] h-auto w-full object-cover" />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-xs text-ink-soft">{photo.place}</figcaption>
              </figure>
            )}
            <div>
              <p className="max-w-[560px] text-[0.9375rem] leading-relaxed text-ink-soft">{meta.intro}</p>
              <ul className={`mt-5 divide-y divide-line border-y border-line ${photo ? '' : 'md:grid md:grid-cols-2 md:gap-x-10 md:divide-y-0 md:border-0'}`}>
                {RESOURCES[cat as Exclude<CatId, 'groceries'>].map((r) => (
                  <li key={r.id} className={`py-4 ${photo ? '' : 'md:border-t md:border-line'}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold tracking-tight text-ink underline-offset-4 hover:underline">
                        {r.name}
                        <span className="sr-only"> (official site, opens in a new tab)</span>
                      </a>
                      <span className="text-sm text-ink-soft">{r.area}</span>
                    </div>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{r.note}</p>
                    {r.lat && (
                      <a href={mapsLink(r.name)} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-ink underline underline-offset-4">
                        Map
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <p className="mt-6 text-xs text-ink-soft">
          Links checked {RESOURCES_REVIEWED}. Confirm hours and details on each official site.
        </p>
      </div>
    </div>
  );
}
