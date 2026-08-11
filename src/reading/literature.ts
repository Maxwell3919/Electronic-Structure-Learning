import { normalizedReferenceGroups } from '../reference/normalized-works';
import { publicationByDoi } from './literature-publication';

export type LiteratureRole = 'LITERATURE_GUIDE' | 'BIBLIOGRAPHY_REFERENCE';
export type LiteraturePriority = 'core' | 'supporting' | 'case-study';
export type LiteratureVisualStatus = 'REAL_PRESENT' | 'NO_VISUAL_NEEDED' | 'SOURCE_UNRESOLVED';

export type LiteratureRecord = {
  id: string;
  title: string;
  authors: string;
  year: string;
  venue: string;
  locator: string;
  doi: string;
  canonical_url: string;
  topic: string;
  role: LiteratureRole;
  priority: LiteraturePriority;
  guideHref?: string;
  currentlyCitedFrom: string[];
  currentlyHasLearningContext: boolean;
  visualStatus: LiteratureVisualStatus;
  whyUse: string;
  boundary: string;
};

const topicForGroup: Record<string, string> = {
  'Foundational papers': 'Foundations of electronic structure',
  'Major reviews': 'Reviews and field maps',
  'Electronic-structure methods': 'Electronic-structure methods',
  'Response, phonons, and EPC': 'Response, phonons, and electron–phonon coupling',
  'Many-body, GW, and BSE': 'Many-body and excitations',
  'Wannier, Berry, and topology': 'Wannier, Berry, and topology',
  'Materials and application case studies': 'Applications and representative systems',
};

const guideByDoi: Record<string, string> = {
  '10.1103/physrev.136.b864': '/reading/literature/hohenberg-kohn-1964/',
  '10.1103/physrev.140.a1133': '/reading/literature/kohn-sham-1965/',
  '10.1073/pnas.76.12.6062': '/reading/literature/levy-1979/',
  '10.1103/physrev.139.a796': '/reading/literature/hedin-1965/',
  '10.1103/revmodphys.74.601': '/reading/literature/onida-reining-rubio-2002/',
  '10.1103/physrevb.52.6301': '/reading/literature/zhong-vanderbilt-rabe-1995/',
};

const visualStatusByDoi: Record<string, LiteratureVisualStatus> = {
  '10.1103/physrev.136.b864': 'REAL_PRESENT',
  '10.1103/physrev.139.a796': 'REAL_PRESENT',
  '10.1103/physrev.140.a1133': 'NO_VISUAL_NEEDED',
  '10.1073/pnas.76.12.6062': 'NO_VISUAL_NEEDED',
  '10.1103/physrevb.52.6301': 'REAL_PRESENT',
};

const doiFromUrl = (url: string) => {
  const doi = url.match(/doi\.org\/(10\.[^?#]+)/i)?.[1];
  if (doi) return doi.toLowerCase();
  const arxiv = url.match(/arxiv\.org\/abs\/([^/?#]+)/i)?.[1];
  return arxiv ? `10.48550/arxiv.${arxiv.toLowerCase()}` : null;
};

const slugFrom = (title: string, year: string) => {
  const slug = title
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${slug.slice(0, 72)}-${year}`;
};

const priorityFor = (guideHref: string | undefined, topic: string): LiteraturePriority => {
  if (guideHref) return 'core';
  if (topic === 'Applications and representative systems') return 'case-study';
  return 'supporting';
};

const recordFromNormalized = (groupTitle: string, entry: (typeof normalizedReferenceGroups)[number]['entries'][number]): LiteratureRecord | null => {
  const doi = doiFromUrl(entry.url);
  if (!doi) return null;
  const publication = publicationByDoi[doi];
  if (!publication) return null;
  const topic = topicForGroup[groupTitle] ?? groupTitle;
  const guideHref = entry.guideHref ?? guideByDoi[doi];
  return {
    id: guideHref ? guideHref.split('/').filter(Boolean).pop()! : slugFrom(entry.title, entry.year),
    title: entry.title,
    authors: entry.authors,
    year: entry.year,
    venue: publication.venue,
    locator: publication.locator,
    doi,
    canonical_url: publication.canonicalUrl,
    topic,
    role: guideHref ? 'LITERATURE_GUIDE' : 'BIBLIOGRAPHY_REFERENCE',
    priority: priorityFor(guideHref, topic),
    guideHref,
    currentlyCitedFrom: ['/reference/', ...(guideHref ? [guideHref] : [])],
    currentlyHasLearningContext: Boolean(guideHref),
    visualStatus: visualStatusByDoi[doi] ?? 'NO_VISUAL_NEEDED',
    whyUse: entry.whyUse,
    boundary: entry.boundary,
  };
};

const extraLiterature: LiteratureRecord[] = [
  {
    id: 'lieb-1983',
    title: 'Density Functionals for Coulomb Systems',
    authors: 'Elliott H. Lieb',
    year: '1983',
    venue: 'International Journal of Quantum Chemistry',
    locator: '24 (3) 243-277',
    doi: '10.1002/qua.560240302',
    canonical_url: 'https://doi.org/10.1002/qua.560240302',
    topic: 'Foundations of electronic structure',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/lieb-1983/',
    currentlyCitedFrom: ['/reference/', '/reading/literature/hohenberg-kohn-1964/', '/reading/literature/levy-1979/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it for the rigorous convex-analytic form of density-functional theory and the distinction between an admissible density domain and a merely formal trial function.',
    boundary: 'The paper gives a mathematical foundation and bounds; it is not a numerical exchange–correlation functional or a code recipe.',
  },
  {
    id: 'onida-reining-rubio-2002',
    title: 'Electronic excitations: density-functional versus many-body Green’s-function theories',
    authors: 'Giovanni Onida, Lucia Reining, and Angel Rubio',
    year: '2002',
    venue: 'Reviews of Modern Physics',
    locator: '74 (2) 601-659',
    doi: '10.1103/revmodphys.74.601',
    canonical_url: 'https://doi.org/10.1103/RevModPhys.74.601',
    topic: 'Many-body and excitations',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/onida-reining-rubio-2002/',
    currentlyCitedFrom: ['/reference/', '/reading/literature/hedin-1965/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it as a source-aligned map from ground-state DFT to quasiparticle and optical excitation methods.',
    boundary: 'This review is a route through GW, BSE, and TDDFT, not a current software manual or a universal prescription for starting points and kernels.',
  },
  {
    id: 'ceperley-alder-1980',
    title: 'Ground-State of the Electron Gas by a Stochastic Method',
    authors: 'D. M. Ceperley and B. J. Alder',
    year: '1980',
    venue: 'Physical Review Letters',
    locator: '45 (7) 566-569',
    doi: '10.1103/physrevlett.45.566',
    canonical_url: 'https://doi.org/10.1103/PhysRevLett.45.566',
    topic: 'Exchange and correlation',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/ceperley-alder-1980/',
    currentlyCitedFrom: ['/reference/', '/theory/exchange-correlation-functionals-and-approximations/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it as the quantum Monte Carlo benchmark that supplied correlation energies for the uniform electron gas and later informed local-density parameterizations.',
    boundary: 'The result is a benchmark for a specified homogeneous gas and finite simulation protocol; it is not a proof that an LDA is accurate for every inhomogeneous material.',
  },
  {
    id: 'perdew-zunger-1981',
    title: 'Self-Interaction Correction to Density-Functional Approximations for Many-Electron Systems',
    authors: 'John P. Perdew and Alex Zunger',
    year: '1981',
    venue: 'Physical Review B',
    locator: '23 (10) 5048-5079',
    doi: '10.1103/physrevb.23.5048',
    canonical_url: 'https://doi.org/10.1103/PhysRevB.23.5048',
    topic: 'Exchange and correlation',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/perdew-zunger-1981/',
    currentlyCitedFrom: ['/reference/', '/theory/exchange-correlation-functionals-and-approximations/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it to see how the one-electron self-interaction error is identified and how orbital-by-orbital corrections are constructed on top of a density-functional approximation.',
    boundary: 'The correction introduces orbital dependence and its own approximation and localization choices; removing one formal error does not make every observable exact.',
  },
  {
    id: 'perdew-burke-ernzerhof-1996',
    title: 'Generalized Gradient Approximation Made Simple',
    authors: 'John P. Perdew, Kieron Burke, and Matthias Ernzerhof',
    year: '1996',
    venue: 'Physical Review Letters',
    locator: '77 (18) 3865-3868',
    doi: '10.1103/physrevlett.77.3865',
    canonical_url: 'https://doi.org/10.1103/PhysRevLett.77.3865',
    topic: 'Exchange and correlation',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/perdew-burke-ernzerhof-1996/',
    currentlyCitedFrom: ['/reference/', '/theory/exchange-correlation-functionals-and-approximations/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it to connect the gradient expansion, exact constraints, and the practical PBE generalized-gradient approximation.',
    boundary: 'PBE is a semilocal approximation with a defined constraint set; its success on a test set does not remove functional, dispersion, self-interaction, or band-gap limitations.',
  },
  {
    id: 'vanderbilt-1990',
    title: 'Soft Self-Consistent Pseudopotentials in a Generalized Eigenvalue Formalism',
    authors: 'David Vanderbilt',
    year: '1990',
    venue: 'Physical Review B',
    locator: '41 (11) 7892-7895',
    doi: '10.1103/physrevb.41.7892',
    canonical_url: 'https://doi.org/10.1103/PhysRevB.41.7892',
    topic: 'Electronic-structure methods',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/vanderbilt-1990/',
    currentlyCitedFrom: ['/reference/', '/theory/pseudopotentials-paw-and-core-valence-treatments/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it to understand why relaxing norm conservation can reduce the plane-wave cutoff while retaining a self-consistent pseudopotential construction.',
    boundary: 'Softness is an input-efficiency property, not a guarantee of transferability; angular channels, reference configurations, nonlinear core effects, and the target observable still matter.',
  },
  {
    id: 'blochl-1994',
    title: 'Projector Augmented-Wave Method',
    authors: 'Peter E. Blöchl',
    year: '1994',
    venue: 'Physical Review B',
    locator: '50 (24) 17953-17979',
    doi: '10.1103/physrevb.50.17953',
    canonical_url: 'https://doi.org/10.1103/PhysRevB.50.17953',
    topic: 'Electronic-structure methods',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/blochl-1994/',
    currentlyCitedFrom: ['/reference/', '/theory/pseudopotentials-paw-and-core-valence-treatments/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it to follow the transformation that combines a smooth auxiliary state with atom-centred augmentation to recover all-electron information.',
    boundary: 'PAW accuracy depends on the dataset, augmentation construction, cutoff choices, and observable; the formal transformation does not certify a particular supplied dataset.',
  },
  {
    id: 'baroni-2001',
    title: 'Phonons and Related Crystal Properties from Density-Functional Perturbation Theory',
    authors: 'Stefano Baroni, Stefano de Gironcoli, Andrea Dal Corso, and Paolo Giannozzi',
    year: '2001',
    venue: 'Reviews of Modern Physics',
    locator: '73 (2) 515-562',
    doi: '10.1103/revmodphys.73.515',
    canonical_url: 'https://doi.org/10.1103/RevModPhys.73.515',
    topic: 'Response, phonons, and electron–phonon coupling',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/baroni-2001/',
    currentlyCitedFrom: ['/reference/', '/theory/linear-response-and-excited-states/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use this review to see how first-order density responses turn crystal perturbations into force constants, phonons, dielectric responses, and related observables.',
    boundary: 'The review is a route through DFPT, not evidence that a calculation is converged; q meshes, electronic sampling, smearing, symmetries, and the observable remain system-specific.',
  },
  {
    id: 'runge-gross-1984',
    title: 'Density-Functional Theory for Time-Dependent Systems',
    authors: 'Erich Runge and E. K. U. Gross',
    year: '1984',
    venue: 'Physical Review Letters',
    locator: '52 (12) 997-1000',
    doi: '10.1103/physrevlett.52.997',
    canonical_url: 'https://doi.org/10.1103/PhysRevLett.52.997',
    topic: 'Many-body and excitations',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/runge-gross-1984/',
    currentlyCitedFrom: ['/reference/', '/theory/linear-response-and-excited-states/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it for the time-dependent density–potential mapping that makes a time-dependent Kohn–Sham construction possible in principle.',
    boundary: 'The mapping theorem does not provide an exact practical exchange–correlation kernel, a complete excitation spectrum, or a license to read every Kohn–Sham eigenvalue difference as an excitation.',
  },
  {
    id: 'marzari-vanderbilt-1997',
    title: 'Maximally Localized Generalized Wannier Functions for Composite Energy Bands',
    authors: 'Nicola Marzari and David Vanderbilt',
    year: '1997',
    venue: 'Physical Review B',
    locator: '56 (20) 12847-12865',
    doi: '10.1103/physrevb.56.12847',
    canonical_url: 'https://doi.org/10.1103/PhysRevB.56.12847',
    topic: 'Wannier, Berry, and topology',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/marzari-vanderbilt-1997/',
    currentlyCitedFrom: ['/reference/', '/theory/localized-orbital-methods/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it for the spread-minimization construction that turns a selected composite band subspace into localized Wannier functions and interpretable centres.',
    boundary: 'Localization depends on the chosen subspace, gauge, disentanglement window, and minimization; a localized representation is not itself a topological invariant.',
  },
  {
    id: 'king-smith-vanderbilt-1993',
    title: 'Theory of Polarization of Crystalline Solids',
    authors: 'R. D. King-Smith and David Vanderbilt',
    year: '1993',
    venue: 'Physical Review B',
    locator: '47 (3) 1651-1654',
    doi: '10.1103/physrevb.47.1651',
    canonical_url: 'https://doi.org/10.1103/PhysRevB.47.1651',
    topic: 'Wannier, Berry, and topology',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/king-smith-vanderbilt-1993/',
    currentlyCitedFrom: ['/reference/', '/theory/berry-phases-and-electronic-topology/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it to distinguish an absolute polarization branch from the physically meaningful change accumulated along an insulating adiabatic path.',
    boundary: 'The result is branch- and path-sensitive and assumes an insulating path; it does not make a raw phase, arbitrary gauge, or metallic Berry integral a polarization measurement.',
  },
  {
    id: 'fu-kane-mele-2007',
    title: 'Topological Insulators without Inversion Symmetry',
    authors: 'Liang Fu, C. L. Kane, and E. J. Mele',
    year: '2007',
    venue: 'Physical Review Letters',
    locator: '98 (10) 106803',
    doi: '10.1103/physrevlett.98.106803',
    canonical_url: 'https://doi.org/10.1103/PhysRevLett.98.106803',
    topic: 'Wannier, Berry, and topology',
    role: 'LITERATURE_GUIDE',
    priority: 'core',
    guideHref: '/reading/literature/fu-kane-mele-2007/',
    currentlyCitedFrom: ['/reference/', '/theory/berry-phases-and-electronic-topology/'],
    currentlyHasLearningContext: true,
    visualStatus: 'NO_VISUAL_NEEDED',
    whyUse: 'Use it for the Z2 formulation that extends the quantum spin Hall logic to three-dimensional time-reversal-invariant insulators without inversion symmetry.',
    boundary: 'A topological label requires the stated symmetry, bulk gap, occupied subspace, and invariant calculation; band inversion or one surface crossing alone is not the paper’s criterion.',
  },
];

const baseLiterature = normalizedReferenceGroups.flatMap((group) => {
  if (group.title === 'Books and monographs') return [];
  return group.entries.map((entry) => recordFromNormalized(group.title, entry)).filter((record): record is LiteratureRecord => Boolean(record));
});

export const literatureRecords = [...baseLiterature, ...extraLiterature].sort((a, b) => a.year.localeCompare(b.year) || a.title.localeCompare(b.title));

export const literatureById = Object.fromEntries(literatureRecords.map((record) => [record.id, record])) as Record<string, LiteratureRecord>;
export const literatureGuides = literatureRecords.filter((record) => record.role === 'LITERATURE_GUIDE');
export const literatureBibliography = literatureRecords.filter((record) => record.role === 'BIBLIOGRAPHY_REFERENCE');
export const literatureTopics = [...new Set(literatureRecords.map((record) => record.topic))];

export const literatureCitation = (record: LiteratureRecord) => `${record.authors}, “${record.title},” ${record.venue} ${record.locator} (${record.year}).`;
