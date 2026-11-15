/**
 * Analytics hook point. The site has no analytics provider installed, so this is a no-op that
 * forwards to `window.dataLayer` only if the owner later adds a tag manager. Event names follow the
 * measurement plan in docs/redesign-handoff.md. Never pass personal data (names, emails, salary,
 * message text) as properties.
 */
export type AnalyticsEvent =
  | 'hero_cta_clicked'
  | 'neighborhood_filter_changed'
  | 'neighborhood_saved'
  | 'comparison_opened'
  | 'scouting_planner_started'
  | 'guide_signup_completed'
  | 'contact_submitted';

type Props = Record<string, string | number | boolean>;

export function trackEvent(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...props });
}
