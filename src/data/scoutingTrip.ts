/**
 * Scouting-trip itinerary, adapted from Chapter 3 of the Relocate Raleigh guide
 * (content/relocation-guide.md). Edit the guide and this file together.
 */
export type TripTask = { id: string; text: string; href?: string };
export type TripDay = { id: string; title: string; focus: string; tasks: TripTask[] };

export const BEFORE_YOU_BOOK: string[] = [
  'Avoid late March through April. Pollen season gives a false first impression.',
  'Arrive on a weekday so you can drive the real rush-hour commute.',
  'Fly into RDU and rent a car. There is no transit version of this trip.',
  'Pick three or four candidate addresses and look up their assigned schools before you land.',
];

const DAY_1: TripDay = {
  id: 'd1',
  title: 'Cary, Morrisville and RTP',
  focus: 'Live a west-Wake weekday.',
  tasks: [
    { id: 'd1-loop', text: 'Drive a loop through newer Cary and Morrisville neighborhoods' },
    { id: 'd1-commute', text: 'Do a peak-hour drive into RTP on the exact route from your shortlist address', href: 'https://drivenc.gov' },
    { id: 'd1-grocery', text: 'Midday stop at H Mart Cary or Grand Asia, not a polished brunch' },
    { id: 'd1-umstead', text: 'Late afternoon at Umstead State Park via Reedy Creek or Crabtree Creek', href: 'https://www.ncparks.gov/state-parks/william-b-umstead-state-park' },
    { id: 'd1-rtp', text: 'If you have energy, end at Boxyard RTP or Frontier' },
  ],
};

const DAY_2: TripDay = {
  id: 'd2',
  title: 'Raleigh and North Raleigh',
  focus: 'Test schools and daily errands.',
  tasks: [
    { id: 'd2-midtown', text: 'Walk Midtown and the streets around North Hills' },
    { id: 'd2-north', text: 'Visit one quieter North Raleigh area that maps to your candidate schools' },
    { id: 'd2-schools', text: 'Go see the actual elementary and middle/high schools for your addresses', href: 'https://www.wcpss.net/enroll/base-schools' },
    { id: 'd2-errands', text: 'Midday: run a real grocery and errand loop' },
    { id: 'd2-pickup', text: 'Drive a major road at school pickup time, then have dinner in the neighborhood' },
  ],
};

const DAY_3: TripDay = {
  id: 'd3',
  title: 'Durham and Chapel Hill',
  focus: 'Compare suburban and in-town Durham.',
  tasks: [
    { id: 'd3-southpoint', text: 'Start at Southpoint as the suburban Durham anchor' },
    { id: 'd3-intown', text: 'Contrast with an older in-town neighborhood and downtown Durham restaurants' },
    { id: 'd3-market', text: "Market stop at Li Ming's or Compare Foods" },
    { id: 'd3-choice', text: 'Choose: Jordan Lake in the late afternoon, or an evening of Durham food', href: 'https://www.ncparks.gov/state-parks/jordan-lake-state-recreation-area' },
    { id: 'd3-ch', text: 'If Chapel Hill is in the running, drive Southern Village, Meadowmont, downtown and Carrboro' },
  ],
};

const DAY_4: TripDay = {
  id: 'd4',
  title: 'Second pass at your favorite',
  focus: 'Repeat the leading area, or Chapel Hill and Carrboro.',
  tasks: [
    { id: 'd4-schools', text: 'Visit the assigned schools for your top address' },
    { id: 'd4-town', text: 'Walk one town center in daylight' },
    { id: 'd4-rec', text: 'One family outing: Jordan Lake for weekends on the water, Umstead for quick nature after work' },
  ],
};

const DAY_5: TripDay = {
  id: 'd5',
  title: 'Verification day',
  focus: 'No sightseeing. Rehearse your real week.',
  tasks: [
    { id: 'd5-commute', text: 'Redo your favorite commute in peak traffic' },
    { id: 'd5-shop', text: "Shop at the store you'd actually use" },
    { id: 'd5-park', text: "Sit in the park you'd actually go back to" },
    { id: 'd5-cowork', text: 'Work a few hours at Frontier, Raleigh Founded, American Underground or Junction' },
    { id: 'd5-meetup', text: 'Go to one evening meetup' },
  ],
};

export const TRIP_PLANS: Record<3 | 5, TripDay[]> = {
  3: [DAY_1, DAY_2, DAY_3],
  5: [DAY_1, DAY_2, DAY_3, DAY_4, DAY_5],
};

export const SKIP_LIST: string[] = [
  'Model homes in brand-new subdivisions 40 minutes from RTP. The commute will wear you down.',
  'The State Fairgrounds, unless it is October.',
  'Trying to see all of Durham or all of Raleigh. Two neighborhoods a day, at most.',
];
