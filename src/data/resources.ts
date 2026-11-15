import type { PhotoKey } from './photos';

/**
 * Everyday-life resources. Only categories with verified entries are listed; every URL was checked
 * to resolve on 15 Nov 2026. Groceries come from cultureStores.ts. Keep resource browsing separate
 * from neighborhood ranking: these never change which neighborhoods "match".
 */
export const RESOURCES_REVIEWED = 'November 2026';

export type Resource = {
  id: string;
  name: string;
  area: string;
  note: string;
  url: string;
  lat?: number;
  lng?: number;
};

export type ResourceCategory = {
  id: 'parks' | 'groceries' | 'libraries' | 'health' | 'essentials';
  label: string;
  intro: string;
  photo?: PhotoKey;
  items: Resource[];
};

export const RESOURCE_CATEGORIES: Omit<ResourceCategory, 'items'>[] = [
  { id: 'parks', label: 'Parks and greenways', intro: 'Big state parks, a downtown destination park and trails close to home.', photo: 'umstead-trail' },
  { id: 'groceries', label: 'Groceries and food', intro: 'Specialty grocers across the Triangle, from Eastern European to South Asian.', photo: 'durham-american-tobacco' },
  { id: 'libraries', label: 'Libraries', intro: 'Free cards, story times and community programs in each county.', photo: 'chapel-hill-franklin' },
  { id: 'health', label: 'Healthcare', intro: 'The region’s three large health systems. Check in-network status first.' },
  { id: 'essentials', label: 'Moving essentials', intro: 'The offices and lookups you need in your first weeks.' },
];

export const RESOURCES: Record<Exclude<ResourceCategory['id'], 'groceries'>, Resource[]> = {
  parks: [
    {
      id: 'umstead',
      name: 'William B. Umstead State Park',
      area: 'Between Raleigh and RTP',
      note: 'Forest trails, lakes and bridle paths minutes from RDU. The guide’s pick for “quick nature after work.”',
      url: 'https://www.ncparks.gov/state-parks/william-b-umstead-state-park',
      lat: 35.8906,
      lng: -78.7505,
    },
    {
      id: 'dix',
      name: 'Dorothea Dix Park',
      area: 'Raleigh',
      note: 'A large open park near downtown, known for its summer sunflower field and city views.',
      url: 'https://dixpark.org',
      lat: 35.768,
      lng: -78.656,
    },
    {
      id: 'cary-park',
      name: 'Downtown Cary Park',
      area: 'Cary',
      note: 'A newer downtown park with lawns, play areas and events in the center of Cary.',
      url: 'https://downtowncarypark.com',
      lat: 35.7869,
      lng: -78.782,
    },
    {
      id: 'jordan-lake',
      name: 'Jordan Lake State Recreation Area',
      area: 'Southwest of Durham and Chapel Hill',
      note: 'Beaches, boating and camping on a large lake. Good for weekends on the water.',
      url: 'https://www.ncparks.gov/state-parks/jordan-lake-state-recreation-area',
      lat: 35.7286,
      lng: -79.0128,
    },
  ],
  libraries: [
    { id: 'wake-lib', name: 'Wake County Public Libraries', area: 'Raleigh, Cary, Apex and all of Wake County', note: 'Branches across the county; one card works at all of them.', url: 'https://www.wake.gov/departments-government/libraries' },
    { id: 'durham-lib', name: 'Durham County Library', area: 'Durham', note: 'Main library downtown plus neighborhood branches.', url: 'https://durhamcountylibrary.org' },
    { id: 'ch-lib', name: 'Chapel Hill Public Library', area: 'Chapel Hill', note: 'A well-used library and community space in a park setting.', url: 'https://www.chapelhillpubliclibrary.org' },
  ],
  health: [
    { id: 'wakemed', name: 'WakeMed', area: 'Raleigh, Cary and Wake County', note: 'Hospitals and clinics across Wake County, including children’s services.', url: 'https://www.wakemed.org' },
    { id: 'duke', name: 'Duke Health', area: 'Durham and across the Triangle', note: 'Duke University Hospital and a wide clinic network.', url: 'https://www.dukehealth.org' },
    { id: 'unc', name: 'UNC Health', area: 'Chapel Hill and across the state', note: 'UNC Medical Center and Rex Hospital in Raleigh.', url: 'https://www.unchealth.org' },
  ],
  essentials: [
    { id: 'dmv', name: 'NC DMV', area: 'Statewide', note: 'You have 60 days after becoming a resident to get an NC license and registration. Book early.', url: 'https://www.ncdot.gov/dmv/' },
    { id: 'wcpss', name: 'Wake County base-school lookup', area: 'Wake County', note: 'Check the assigned schools for a specific address before you sign.', url: 'https://www.wcpss.net/enroll/base-schools' },
    { id: 'chccs', name: 'Chapel Hill-Carrboro City Schools', area: 'Chapel Hill and Carrboro', note: 'Enrollment and school assignment information.', url: 'https://www.chccs.org' },
    { id: 'ncsbe', name: 'NC State Board of Elections', area: 'Statewide', note: 'Register to vote at your new address (you can also do it at the DMV).', url: 'https://www.ncsbe.gov' },
    { id: 'drivenc', name: 'DriveNC traffic', area: 'Statewide', note: 'Real traffic conditions. Use it to test a commute during your scouting trip.', url: 'https://www.drivenc.gov' },
  ],
};
