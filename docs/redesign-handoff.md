# Relocate Raleigh redesign: owner handoff

What the business owner needs to supply, verify or decide. Last updated 16 Nov 2026.

## 1. Photography still needed

Current local photos are Creative Commons images from Wikimedia Commons (credited on `/credits`).
Replace them with the business's own photography when possible. Register new images in
`src/data/photos.ts` (one entry per image, with honest alt text) and they flow through the site.

| Needed | Where it appears | Notes |
| --- | --- | --- |
| Portrait of Nick (and his wife, if they agree) | About section (`<NickBio portrait={...} />`) | Natural light, landscape and square crops, at least 1600px wide |
| A recognizable RTP or Triangle workplace scene | Journey section, stage 1 | Currently American Tobacco Campus, Durham |
| One real home photo per neighborhood (9) | Explorer cards, neighborhood guides | Streetscapes rather than listing photos; no identifiable people or house numbers |
| A family-friendly park or greenway moment | Everyday life, journey stage 3 | Currently Dix Park sunflowers and an Umstead trail |
| Optional short intro video | About section | Only if a real one exists |

### Homepage hero (farmhouse model, illustrative)

The earlier concept-home explorer section was removed at the owner's request; the homepage keeps the
original order (intro, journey, neighborhoods, calculator, scouting, everyday life, about, guide, FAQ).


`scripts/prepare-hero-media.sh "<folder with the Google Flow masters>"` writes `public/media/hero/`:
`hero-home-wide.webp` + `.mp4` (the full 16:9 scene, shown uncropped at about half the page width with
feathered edges on every screen size) and `hero-home-square.jpg` (link-preview image). The clip is a slow push-in, so it plays once
and hold the last frame with a "Replay animation" control; they pause offscreen and are skipped for reduced
motion and Save-Data. The navigation is transparent over the hero at the top of the homepage and turns solid
on scroll; its height is published as `--header-h` so the hero sits underneath it.

Section backdrops (`public/media/sketches/`, placed by `src/components/ui/SketchBackdrop.tsx`):
- `ref-tower-sketch-top.webp` (neighborhoods), `ref-blueprint-building.webp` (calculator),
  `ref-looking-up.webp` (journey, edges only) and `ref-city-haze.webp` (everyday life) come from reference
  images supplied by the site owner, who confirmed (Nov 16, 2026) that they have the rights to use them on the
  site. Keep that licence record with the project; replace them under the same file names if it ever lapses.
- `sketch-skyline.webp` (dark closing section, inverted to chalk lines) was generated with Z-Image Turbo.
All are decorative and illustrative, not Raleigh or a real listing. The page also carries a faint blueprint
grid (`.bp-grid` in `globals.css`).

The hero stats strip shows site coverage (neighborhoods, employers, states), not client counts: replace or
add numbers only when Nick can verify them.

## 2. Data to verify

- **Raleigh home-price benchmark in the calculator** (`RALEIGH_METRO_MEDIAN_HOME = $420,000` in
  `src/data/relocationStateData.ts`) is labeled "illustrative" in the code with no source. The guide's
  March 2026 neighborhood medians run $435K–$630K. Replace it with a sourced metro figure and date.
- **State income tax rates** are single "effective rate near $200K, single filer" approximations with no
  source or date in the code. Confirm and add a source, or keep the on-page caveat.
- **State median home prices** say "Rocket Mortgage 2024" in comments; confirm the year and link.
- **Neighborhood figures** now come from the guide (Redfin/Homes.com, March 2026; GreatSchools early
  2026). Refresh both the guide and `src/data/neighborhoods.ts` together.
- **Neighborhood list changed** to match the guide's nine. Old URLs redirect:
  `/neighborhoods/west-cary` → `/cary`, `/north-hills` → `/north-raleigh`, `/fuquay-varina` → `/neighborhoods`.
  Fuquay-Varina had no sourced data, so it was dropped.
- **Specialty grocers** (`src/data/cultureStores.ts`) were provided by the owner without sources; confirm
  they are open and addresses are current.
- **Broken link fixed**: the guide's Wake County school lookup (`/domain/4783`) returned 404; it now points
  to `https://www.wcpss.net/enroll/base-schools` in the guide, PDF and site.
- **Events feed is stale** (last generated 25 Apr 2026). The weekly GitHub Action appears to have
  stopped. The homepage no longer shows events; `/events` shows an honest empty state. Fix the
  `ANTHROPIC_API_KEY` secret / workflow, or retire the page.
- **Credentials copy**: "Medical professional on the team" and the household languages come from the
  original site. Confirm wording.
- **Response time**: forms promise "usually replies within a day or two" (from the original site and
  guide). Change it if that is no longer realistic.

## 3. Integrations

- **Email (Resend)**: set `RESEND_API_KEY` in Vercel. Without it, both forms show an honest failure
  message with the phone number. The code now checks Resend's `{ error }` result, so a failed send is
  never reported as success. Successful delivery could not be tested without the key.
- **Google Maps (optional)**: set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (restricted by referrer) for live
  maps. Without it the explorer shows an SVG map positioned by real latitude/longitude.
- **Scheduling**: there is no calendar integration, so buttons say "Request a relocation call", not "Book".
  If a real scheduler is added, update the labels in `SiteNav`, `HeroActions`, `ClosingCta`, `NickBio`.
- **Testimonials**: none exist, so there is no testimonial section. Add one only with real, attributed
  stories and permission.

## 4. Analytics plan (not installed)

No analytics provider is installed. `src/lib/analytics.ts` exposes `trackEvent()` which only forwards
to `window.dataLayer` if a tag manager is added later. Events already wired:

| Event | Fired when | Properties |
| --- | --- | --- |
| `hero_cta_clicked` | A hero action is clicked | `action`: explore / request_call / guide |
| `neighborhood_filter_changed` | Employer, drive limit or budget changes | `filter` |
| `neighborhood_saved` | A neighborhood is added to the shortlist | none |
| `comparison_opened` | The compare dialog opens | `count` |
| `scouting_planner_started` | First stop is added in the planner | none |
| `guide_signup_completed` | The guide email was actually sent | none |
| `contact_submitted` | A call request was actually delivered | none |

Never add names, emails, salary, message text or other personal details as properties.
