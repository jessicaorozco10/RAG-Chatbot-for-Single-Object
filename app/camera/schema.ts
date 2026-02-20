export interface PrimaryText {
  id: string;
  title: string;
  source: string;
  year: string;
  excerpt: string;
}

export interface ExhibitHotspot {
  id: string;
  exhibitId: string;
  label: string;
  xPercent: number;
  yPercent: number;
}

export interface Exhibit {
  id: string;
  name: string;
  description: string;
  hotspots: ExhibitHotspot[];
  primaryTexts: PrimaryText[];
}

export const exhibits: Exhibit[] = [
  {
    id: 'city-vessel',
    name: 'City Vessel and Industry',
    description:
      'Industrial design and civic infrastructure artifacts showing how city services shaped public life.',
    hotspots: [
      { id: 'city-vessel-1', exhibitId: 'city-vessel', label: 'Main vessel', xPercent: 34, yPercent: 44 },
      { id: 'city-vessel-2', exhibitId: 'city-vessel', label: 'Side engraving', xPercent: 56, yPercent: 61 },
    ],
    primaryTexts: [
      {
        id: 'cv-1',
        title: 'Municipal Works Bulletin',
        source: 'City Archive',
        year: '1931',
        excerpt:
          'A vessel intended for public display should express both utility and trust in civic institutions.',
      },
      {
        id: 'cv-2',
        title: 'Design Notes on Urban Hardware',
        source: 'Curatorial Collection',
        year: '1934',
        excerpt:
          'The polished exterior masked a practical engineering choice: durability in humid environments.',
      },
    ],
  },
  {
    id: 'poster-movement',
    name: 'Poster and Public Movement',
    description:
      'Graphic poster work exploring political and social messaging in museum-adjacent public spaces.',
    hotspots: [
      { id: 'poster-movement-1', exhibitId: 'poster-movement', label: 'Typography block', xPercent: 43, yPercent: 37 },
      { id: 'poster-movement-2', exhibitId: 'poster-movement', label: 'Lower corner motif', xPercent: 68, yPercent: 72 },
    ],
    primaryTexts: [
      {
        id: 'pm-1',
        title: 'Public Wall Posting Ordinance',
        source: 'County Records',
        year: '1940',
        excerpt:
          'Poster distribution was regulated yet remained central to neighborhood communication and organizing.',
      },
      {
        id: 'pm-2',
        title: 'Letter from Exhibition Designer',
        source: 'Museum Correspondence',
        year: '1942',
        excerpt:
          'Color and scale were selected to command attention from viewers crossing crowded transit corridors.',
      },
    ],
  },
  {
    id: 'radio-room',
    name: 'Radio Room Installation',
    description: 'Domestic media objects illustrating shifts in listening habits and home architecture.',
    hotspots: [
      { id: 'radio-room-1', exhibitId: 'radio-room', label: 'Speaker grill', xPercent: 29, yPercent: 53 },
      { id: 'radio-room-2', exhibitId: 'radio-room', label: 'Dial cluster', xPercent: 49, yPercent: 46 },
    ],
    primaryTexts: [
      {
        id: 'rr-1',
        title: 'Home Receiver User Guide',
        source: 'Manufacturer Pamphlet',
        year: '1938',
        excerpt:
          'The receiver cabinet was marketed as furniture first, communication instrument second.',
      },
      {
        id: 'rr-2',
        title: 'Field Notes on Evening Broadcasts',
        source: 'Oral History Program',
        year: '1941',
        excerpt:
          'Families reorganized seating and schedules around nightly transmissions and national addresses.',
      },
    ],
  },
];

export const exhibitHashMap = new Map<string, string>([
  ['h0', 'city-vessel'],
  ['h1', 'poster-movement'],
  ['h2', 'radio-room'],
  ['fallback', 'city-vessel'],
]);
