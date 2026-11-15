# Relocate Raleigh

Relocation and real-estate website for families moving to Raleigh, Durham, Cary and the Research
Triangle. Next.js 16 (App Router), React 19, Tailwind CSS 4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npm run build-pdf  # regenerate content/relocation-guide.pdf from the Markdown guide
```

## Environment variables

| Name | Needed for |
| --- | --- |
| `RESEND_API_KEY` | Sending the guide email and call requests (server only) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional live Google maps (otherwise an SVG lat/long map) |
| `ANTHROPIC_API_KEY` | `npm run update-events` and the weekly events workflow |

## Where content lives

- `content/relocation-guide.md`: the guide (source of neighborhood data, scouting plan, checklist)
- `src/data/neighborhoods.ts`: the nine neighborhoods, from guide Chapter 2
- `src/data/photos.ts`: every photo with credits and alt text (rendered on `/credits`)
- `src/data/resources.ts`: everyday-life resources (verified links)
- `src/data/scoutingTrip.ts`, `src/data/checklist.ts`: from guide Chapter 3 and Appendix B
- `src/data/relocationStateData.ts`: calculator inputs

Browser-only state (shortlist, explorer filters, trip plan, checklist) is in `localStorage`; see
`src/lib/useStoredState.ts`.

See `docs/redesign-handoff.md` for photos still needed, data to verify and the analytics plan.
The internal brand reference lives at `/styleguide` (not indexed, not linked from the footer).
