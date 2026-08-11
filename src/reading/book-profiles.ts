export type BookProfileId = 'martin' | 'sholl-steckel' | 'cohen-louie' | 'giustino' | 'liu-conceptual-dft';

export interface BookProfile {
  id: BookProfileId;
  title: string;
  authors: string;
  edition: string;
  publisher: string;
  role: string;
  teaches: string[];
  bestUse: string;
  atlasRole: string;
  readingPath: string;
  sourceUrl: string;
  guideHref?: string;
}

export const bookProfiles: Record<BookProfileId, BookProfile> = {
  martin: {
    id: 'martin',
    title: 'Electronic Structure: Basic Theory and Practical Methods',
    authors: 'Richard M. Martin',
    edition: 'Second edition',
    publisher: 'Cambridge University Press, 2020',
    role: 'The continuous theory-to-computation spine for readers who need one book to connect the many-electron problem, DFT, numerical representations, response, Berry phases, and topology.',
    teaches: ['how the many-electron problem is reorganized into usable electronic-structure objects', 'which approximation, representation, and response choices change the calculated object', 'how modern electronic-structure topics connect rather than forming isolated techniques'],
    bestUse: 'Read in sequence for theory consolidation; return to individual Parts when a calculation or paper introduces an unfamiliar formal object.',
    atlasRole: 'The closest book-level companion to Core and the bridge from Foundations to method-aware reading.',
    readingPath: 'Start with Parts I–III for the ground-state and periodic basis, then Part IV for properties; use the later Berry/topology chapters after the Core route has reached those objects.',
    sourceUrl: 'https://doi.org/10.1017/9781108555586',
    guideHref: '/reading/books/martin/',
  },
  'sholl-steckel': {
    id: 'sholl-steckel',
    title: 'Density Functional Theory: A Practical Introduction',
    authors: 'David S. Sholl and Janice A. Steckel',
    edition: 'First edition',
    publisher: 'Wiley, 2009',
    role: 'The practical plane-wave DFT entry point: it makes model, numerical, and interpretation choices visible before they become a production workflow.',
    teaches: ['how a plane-wave DFT model is assembled for solids, surfaces, and reactions', 'why cutoff, k-point, smearing, and cell choices are separate numerical questions', 'how common calculated quantities relate to the physical question being asked'],
    bestUse: 'Read as a practical introduction or consult by problem type before moving to an executable workflow.',
    atlasRole: 'A learning bridge between Core theory and the DFT Research Workflow’s current execution and validation guidance.',
    readingPath: 'Read Chapters 1–4 before using its application chapters; return to the relevant application chapter only after declaring the target observable and its validation question.',
    sourceUrl: 'https://doi.org/10.1002/9780470447710',
    guideHref: '/reading/books/sholl-steckel/',
  },
  'cohen-louie': {
    id: 'cohen-louie',
    title: 'Fundamentals of Condensed Matter Physics',
    authors: 'Marvin L. Cohen and Steven G. Louie',
    edition: 'First edition',
    publisher: 'Cambridge University Press, 2016',
    role: 'The broad condensed-matter companion for moving from electronic states to collective response, many-body propagation, and experimental signatures.',
    teaches: ['how excitations and response functions connect microscopic models to measurements', 'how quasiparticle, collective, transport, optical, magnetic, and superconducting descriptions differ', 'how reduced-dimensional systems inherit and modify these ideas'],
    bestUse: 'Read selectively for conceptual depth and cross-check an unfamiliar response or excitation against a wider physical setting.',
    atlasRole: 'The Atlas’s wide-angle companion for Foundations topics that extend beyond ground-state DFT.',
    readingPath: 'Use Parts I–II for states and response, then choose Parts III–IV by phenomenon; do not treat a chapter’s model limit as a material-specific prediction.',
    sourceUrl: 'https://www.cambridge.org/9780521513319',
    guideHref: '/reading/books/cohen-louie/',
  },
  giustino: {
    id: 'giustino',
    title: 'Materials Modelling Using Density Functional Theory: Properties and Predictions',
    authors: 'Feliciano Giustino',
    edition: 'First edition',
    publisher: 'Oxford University Press, 2014',
    role: 'A compact materials-focused bridge that keeps formal DFT, calculable response, and experimentally recognizable properties in the same view.',
    teaches: ['how ground-state theory becomes structures, elastic quantities, vibrational modes, bands, and responses', 'which physical and numerical layers must be kept distinct in a materials calculation', 'how calculated objects relate to measurement without collapsing them into the same claim'],
    bestUse: 'Read in order for a materials-modelling introduction; revisit the property chapters when choosing a method for a declared observable.',
    atlasRole: 'The best compact companion when Core concepts need to be connected to materials properties and response calculations.',
    readingPath: 'Use Chapters 1–4 for foundations, then read Chapters 5–11 by property; keep the appendices nearby for the representation and core-treatment vocabulary.',
    sourceUrl: 'https://global.oup.com/academic/product/materials-modelling-using-density-functional-theory-9780199662449',
    guideHref: '/reading/books/giustino/',
  },
  'liu-conceptual-dft': {
    id: 'liu-conceptual-dft',
    title: 'Conceptual Density Functional Theory: Towards a New Chemical Reactivity Theory',
    authors: 'Shubin Liu (editor)',
    edition: 'Two-volume set, first edition',
    publisher: 'Wiley-VCH, 2022',
    role: 'A specialist reference for conceptual-DFT and chemical-reactivity questions that sit outside the Atlas’s continuous electronic-structure spine.',
    teaches: ['how density derivatives and response concepts are used to define chemical-reactivity descriptors', 'where conceptual DFT connects to charge transfer, bonding, and information-theoretic descriptors', 'why definition, reference state, and scope must be checked before applying a descriptor'],
    bestUse: 'Use as a chapter-level reference after the ground-state DFT foundation is secure, not as a first DFT textbook.',
    atlasRole: 'A bounded extension for readers whose question is chemical reactivity rather than a general solid-state DFT workflow.',
    readingPath: 'Begin with the foundational and basic-functions chapters, then select a descriptor or application chapter only after specifying the chemical question and its reference conventions.',
    sourceUrl: 'https://doi.org/10.1002/9783527829941',
  },
};
