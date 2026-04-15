export interface PanelEntry {
  number: number;
  title: string;
  works: string[];
  summary: string;
}

export const panelCatalog: PanelEntry[] = [
  {
    number: 1,
    title: "The Wayfarer and The Story Brought by Brigit",
    works: [
      "The Wayfarer by Patrick Pearse",
      "The Story Brought by Brigit by Lady Gregory",
    ],
    summary:
      "This panel pairs Pearse's poem with Lady Gregory's Saint Brigid story and opens the window with Irish literary nationalism and spiritual symbolism.",
  },
  {
    number: 2,
    title: "St. Joan",
    works: ["St. Joan by George Bernard Shaw"],
    summary:
      "This panel depicts Joan of Arc from Shaw's play as a forceful, idealistic, and sacrificial figure.",
  },
  {
    number: 3,
    title: "The Playboy of the Western World and The Others",
    works: [
      "The Playboy of the Western World by J. M. Synge",
      "The Others by Seumas O'Sullivan",
    ],
    summary:
      "This panel combines Christy Mahon and Pegeen Mike from Synge's play with fairy imagery from O'Sullivan's poem.",
  },
  {
    number: 4,
    title: "Demi-Gods and Juno and the Paycock",
    works: [
      "Demi-Gods by James Stephens",
      "Juno and the Paycock by Seán O'Casey",
    ],
    summary:
      "This panel places Stephens' demigods beside Joxer Daly from O'Casey's play, mixing fantasy with social satire.",
  },
  {
    number: 5,
    title: "The Dreamers and The Countess Cathleen",
    works: [
      "The Dreamers by Lennox Robinson",
      "The Countess Cathleen by W. B. Yeats",
    ],
    summary:
      "This panel links Robert Emmet's nationalist legacy with Yeats's Countess Cathleen through themes of sacrifice and idealism.",
  },
  {
    number: 6,
    title: "Mr. Gilhooley and Deirdre",
    works: [
      "Mr. Gilhooley by Liam O'Flaherty",
      "Deirdre by George Russell",
    ],
    summary:
      "This panel juxtaposes O'Flaherty's provocative Mr. Gilhooley with Russell's tragic Deirdre.",
  },
  {
    number: 7,
    title: "A Cradle Song and The Magic Glasses",
    works: [
      "A Cradle Song by Padraic Colum",
      "The Magic Glasses by George Fitzmaurice",
    ],
    summary:
      "This panel contrasts the melancholy mood of Colum's lullaby with the hallucinatory energy of Fitzmaurice's play and Jamoney Shanahan.",
  },
  {
    number: 8,
    title: "The Weaver's Grave and Chamber Music",
    works: [
      "The Weaver's Grave by Seumas O'Kelly",
      "Chamber Music by James Joyce",
    ],
    summary:
      "This panel pairs the graveyard imagery of O'Kelly's story with a bardic image tied to Joyce's Chamber Music.",
  },
];

export const getPanelEntry = (panelNumber: number) =>
  panelCatalog.find((panel) => panel.number === panelNumber);

export const panelCatalogPrompt = panelCatalog
  .map(
    (panel) =>
      `Panel ${panel.number}: ${panel.title}. Works: ${panel.works.join("; ")}. Summary: ${panel.summary}`,
  )
  .join("\n");
