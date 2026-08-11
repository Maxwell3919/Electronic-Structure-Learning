import { literatureById, literatureCitation } from './literature';

export type PaperProfileId = 'hohenberg-kohn-1964' | 'kohn-sham-1965' | 'levy-1979' | 'hedin-1965';

export interface PaperProfile {
  id: PaperProfileId;
  citation: string;
  whyItMatters: string;
  lookFor: string;
  connection: string;
  sourceUrl: string;
  visualNote: string;
}

export const paperProfiles: Record<PaperProfileId, PaperProfile> = {
  'hohenberg-kohn-1964': {
    id: 'hohenberg-kohn-1964',
    citation: literatureCitation(literatureById['hohenberg-kohn-1964']),
    whyItMatters: 'It establishes the density–potential and variational footing that lets a ground-state electronic problem be posed in terms of the electron density rather than the many-electron wavefunction alone.',
    lookFor: 'Read the two theorem statements first, then the way the paper moves from exact statements to the nearly-uniform and slowly-varying limits. Keep the theorem separate from any later exchange–correlation approximation.',
    connection: 'This is the historical source behind Core Part IV’s density-functional route; the guide preserves the paper’s theorem and approximation order rather than retrofitting Kohn–Sham machinery into it.',
    sourceUrl: literatureById['hohenberg-kohn-1964'].canonical_url,
    visualNote: 'The original Figs. 1–2 are embedded as exact source-linked crops at the point where the response argument is discussed. The media manifest records the APS source, page, retrieval URL, hash, and the absence of an open-licence claim.',
  },
  'kohn-sham-1965': {
    id: 'kohn-sham-1965',
    citation: literatureCitation(literatureById['kohn-sham-1965']),
    whyItMatters: 'It turns the density variational problem into an auxiliary one-particle construction, giving modern DFT its practical self-consistent computational object.',
    lookFor: 'Follow the separation of the auxiliary kinetic energy from the remaining functional, then read the proof note carefully: it distinguishes the exact formal construction from the paper’s local approximation development.',
    connection: 'Core Part IV uses the modern Kohn–Sham formulation; this guide identifies the original paper’s narrower problem and notation before later practice is added.',
    sourceUrl: literatureById['kohn-sham-1965'].canonical_url,
    visualNote: 'The paper has no separately necessary visual for this guide; its contribution is followed through the equations and argument. The DOI remains the direct documentary source.',
  },
  'levy-1979': {
    id: 'levy-1979',
    citation: literatureCitation(literatureById['levy-1979']),
    whyItMatters: 'It supplies the constrained-search definition that makes the density variational domain explicit, repairing the restriction that every trial density must come from a local-potential ground state.',
    lookFor: 'Watch the order of minimization: first over wavefunctions giving a chosen density, then over densities. The representability distinction is the point, not a decorative alternative notation for the Hohenberg–Kohn theorem.',
    connection: 'The guide gives the variational-domain foundation behind the modern Core explanation of universal functionals and makes clear why it is not itself a practical exchange–correlation approximation.',
    sourceUrl: literatureById['levy-1979'].canonical_url,
    visualNote: 'This short foundational paper is read for its variational construction. No paper figure is embedded because no separately reusable scientific figure was identified in the accessible source record.',
  },
  'hedin-1965': {
    id: 'hedin-1965',
    citation: literatureCitation(literatureById['hedin-1965']),
    whyItMatters: 'It reorganizes many-body perturbation theory around a screened interaction and gives the coupled objects from which the GW approximation is obtained by a controlled vertex truncation.',
    lookFor: 'Start with Figs. 1–2 as diagrams for propagator and screened-interaction expansions, then compare the exact coupled equations with the first screened-interaction truncation and the electron-gas calculation actually reported.',
    connection: 'Core Part VIII distinguishes one-particle spectra from ground-state DFT. This source guide makes the screened-interaction and quasiparticle language behind that distinction inspectable.',
    sourceUrl: literatureById['hedin-1965'].canonical_url,
    visualNote: 'The original Figs. 1–2 are embedded as exact source-linked crops at the point where the diagram vocabulary is discussed. The media manifest records the APS source, page, retrieval URL, hash, and the absence of an open-licence claim.',
  },
};
