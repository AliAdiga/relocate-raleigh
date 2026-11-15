import Image from 'next/image';
import { PHOTOS } from '@/data/photos';
import HeroMovePicker from '../HeroMovePicker';
import { TriangleOutline } from '../ui/BrandLines';
import HeroActions from './HeroActions';

const main = PHOTOS['raleigh-skyline'];
const home = PHOTOS['oakwood-home'];
const trail = PHOTOS['umstead-trail'];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Phones: text, then photo, then the estimate card. Desktop: text and cards left, photos right. */}
      <div className="shell grid gap-10 pb-14 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-8 lg:pb-24 lg:pt-14">
        <div className="relative z-10 space-y-7 lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="kicker">For tech professionals and families moving to Raleigh-Durham</p>
          <h1 id="hero-title" className="t-display max-w-[620px] text-ink">
            Keep your career. Upgrade your life.
          </h1>
          <p className="lead max-w-[540px] text-ink-soft">
            Find your place in Raleigh, Durham, Cary and the rest of the Research Triangle, with local guidance on
            neighborhoods, housing, commutes and the details of your move.
          </p>
          <HeroActions />
        </div>
        <div className="relative z-10 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:col-start-1 lg:row-start-2 lg:max-w-[600px] lg:self-start">
          <HeroMovePicker />
          <TrustNote />
        </div>

        {/* Photo composition: one dominant local image, two supporting, tied together by the brand triangle */}
        <div className="relative row-start-2 mx-auto mb-6 w-full max-w-[640px] self-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:max-w-none">
          <TriangleOutline
            className="pointer-events-none absolute -left-10 -top-16 w-[120%] text-ink"
            opacity={0.07}
            strokeWidth={1.5}
          />
          <figure className="relative ml-auto w-[88%] overflow-hidden rounded-[var(--radius-panel)]">
            <Image
              src={main.src}
              alt={main.alt}
              width={main.width}
              height={main.height}
              priority
              sizes="(min-width: 1024px) 560px, 88vw"
              className="aspect-[4/4.4] h-auto w-full object-cover"
            />
            <figcaption className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-3 py-1 text-xs text-ink-soft">{main.place}</figcaption>
          </figure>
          <figure className="absolute -bottom-6 left-0 w-[46%] overflow-hidden rounded-[var(--radius-card)] border-[5px] border-paper shadow-[0_24px_50px_-30px_rgba(31,31,31,0.6)] sm:-bottom-8">
            <Image src={home.src} alt={home.alt} width={home.width} height={home.height} sizes="(min-width: 1024px) 280px, 44vw" className="aspect-[4/3] h-auto w-full object-cover" />
            <figcaption className="sr-only">{home.place}</figcaption>
          </figure>
          <figure className="absolute -top-5 right-[-4px] hidden w-[30%] overflow-hidden rounded-[var(--radius-card)] border-[5px] border-paper shadow-[0_24px_50px_-30px_rgba(31,31,31,0.6)] sm:block">
            <Image src={trail.src} alt={trail.alt} width={trail.width} height={trail.height} sizes="200px" className="aspect-square h-auto w-full object-cover object-[50%_65%]" />
            <figcaption className="sr-only">{trail.place}</figcaption>
          </figure>
          {/* Destination node */}
          <span aria-hidden className="absolute bottom-[18%] right-[-8px] h-4 w-4 rounded-full bg-ember ring-4 ring-paper" />
        </div>
      </div>
    </section>
  );
}

function TrustNote() {
  return (
    <div className="flex flex-col gap-3 self-start rounded-[var(--radius-card)] bg-sand p-5">
      <p className="text-[0.9375rem] leading-relaxed text-ink">
        <span className="font-semibold">Nick</span> is a licensed North Carolina Realtor® and a senior IT
        professional in RTP who moved here with his family.
      </p>
      <a href="#about" className="text-sm font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
        Meet Nick
      </a>
    </div>
  );
}
