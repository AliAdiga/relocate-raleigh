/**
 * Relocation checklist, adapted from Appendix B ("First 90 Days Checklist") of the Relocate Raleigh
 * guide. Edit the guide and this file together.
 */
export type ChecklistItem = { id: string; text: string; href?: string };
export type ChecklistGroup = { id: string; title: string; when: string; items: ChecklistItem[] };

export const CHECKLIST: ChecklistGroup[] = [
  {
    id: 'before',
    title: 'Before the move',
    when: 'As soon as you are under contract or sign a lease',
    items: [
      { id: 'b-daycare', text: 'Join 3–5 daycare or preschool waitlists, if you need them' },
      { id: 'b-doctors', text: 'Join pediatrician and primary-care waitlists (check in-network status first)' },
      { id: 'b-dental', text: 'Join pediatric dental and orthodontist waitlists; these are often the longest' },
      { id: 'b-utilities', text: 'Set up electricity, water/sewer and gas transfers for move-in day' },
      { id: 'b-internet', text: 'Book internet installation for move-in day (2–4 weeks’ notice is common)' },
      { id: 'b-schools', text: 'Confirm assigned schools for your exact address', href: 'https://www.wcpss.net/enroll/base-schools' },
    ],
  },
  {
    id: 'arrival',
    title: 'Arrival week',
    when: 'Your first week in North Carolina',
    items: [
      { id: 'a-insurance', text: 'Get North Carolina auto insurance' },
      { id: 'a-docs', text: 'Gather proof of residency: lease or mortgage, a utility bill, other official mail' },
      { id: 'a-dmv', text: 'Book your NC DMV driver’s license appointment. Do this first; it’s the bottleneck.', href: 'https://www.ncdot.gov/dmv/' },
      { id: 'a-title', text: 'Start vehicle title and registration paperwork' },
    ],
  },
  {
    id: 'thirty',
    title: 'First 30 days',
    when: 'Weeks 1 to about 6',
    items: [
      { id: 't-license', text: 'Complete your driver’s license appointment (you get a temporary certificate)' },
      { id: 't-ins-update', text: 'Give your insurer your new NC license number' },
      { id: 't-inspection', text: 'Get the annual vehicle safety inspection (needed before registration)' },
      { id: 't-register', text: 'Title and register your vehicles; budget for title fee, 3% highway-use tax, vehicle property tax and registration fees' },
      { id: 't-vote', text: 'Register to vote (you can do this at the DMV)', href: 'https://www.ncsbe.gov' },
      { id: 't-enroll', text: 'Submit school enrollment paperwork' },
    ],
  },
  {
    id: 'ninety',
    title: 'By day 90',
    when: 'Settling in',
    items: [
      { id: 'n-providers', text: 'Find an in-network dentist, orthodontist and optometrist' },
      { id: 'n-bank', text: 'Set up a local bank if you are moving from outside the Southeast' },
      { id: 'n-address', text: 'Update your address with the IRS, employer, banks and subscriptions' },
      { id: 'n-routine', text: 'Pick your everyday grocery, coffee shop and pharmacy' },
      { id: 'n-community', text: 'Join one community thing: a congregation, sports league, meetup or HOA committee' },
    ],
  },
];

export const CHECKLIST_DEADLINE =
  'You have 60 days after establishing NC residency to get an NC driver’s license and register your vehicles. Appointments fill up, so don’t leave this to week 8.';
