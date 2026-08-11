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
    citation: 'P. Hohenberg and W. Kohn, “Inhomogeneous Electron Gas,” Physical Review 136, B864–B871 (1964).',
    whyItMatters: 'It establishes the density–potential and variational footing that lets a ground-state electronic problem be posed in terms of the electron density rather than the many-electron wavefunction alone.',
    lookFor: 'Read the two theorem statements first, then the way the paper moves from exact statements to the nearly-uniform and slowly-varying limits. Keep the theorem separate from any later exchange–correlation approximation.',
    connection: 'This is the historical source behind Core Part IV’s density-functional route; the guide preserves the paper’s theorem and approximation order rather than retrofitting Kohn–Sham machinery into it.',
    sourceUrl: 'https://doi.org/10.1103/PhysRev.136.B864',
    visualNote: 'The original article’s figures are publisher material without a clear reusable licence in the source record, so this guide links to the original rather than substituting a redraw for a paper figure.',
  },
  'kohn-sham-1965': {
    id: 'kohn-sham-1965',
    citation: 'W. Kohn and L. J. Sham, “Self-Consistent Equations Including Exchange and Correlation Effects,” Physical Review 140, A1133–A1138 (1965).',
    whyItMatters: 'It turns the density variational problem into an auxiliary one-particle construction, giving modern DFT its practical self-consistent computational object.',
    lookFor: 'Follow the separation of the auxiliary kinetic energy from the remaining functional, then read the proof note carefully: it distinguishes the exact formal construction from the paper’s local approximation development.',
    connection: 'Core Part IV uses the modern Kohn–Sham formulation; this guide identifies the original paper’s narrower problem and notation before later practice is added.',
    sourceUrl: 'https://doi.org/10.1103/PhysRev.140.A1133',
    visualNote: 'The paper’s article graphics are not copied because the accessible source does not state a reusable figure licence. The original DOI remains the direct visual and documentary source.',
  },
  'levy-1979': {
    id: 'levy-1979',
    citation: 'M. Levy, “Universal variational functionals of electron densities, first-order density matrices, and natural spin-orbitals and solution of the v-representability problem,” Proceedings of the National Academy of Sciences 76, 6062–6065 (1979).',
    whyItMatters: 'It supplies the constrained-search definition that makes the density variational domain explicit, repairing the restriction that every trial density must come from a local-potential ground state.',
    lookFor: 'Watch the order of minimization: first over wavefunctions giving a chosen density, then over densities. The representability distinction is the point, not a decorative alternative notation for the Hohenberg–Kohn theorem.',
    connection: 'The guide gives the variational-domain foundation behind the modern Core explanation of universal functionals and makes clear why it is not itself a practical exchange–correlation approximation.',
    sourceUrl: 'https://doi.org/10.1073/pnas.76.12.6062',
    visualNote: 'This short foundational paper is read for its variational construction. No paper figure is embedded because no separately reusable scientific figure was identified in the accessible source record.',
  },
  'hedin-1965': {
    id: 'hedin-1965',
    citation: 'L. Hedin, “New Method for Calculating the One-Particle Green’s Function with Application to the Electron-Gas Problem,” Physical Review 139, A796–A823 (1965).',
    whyItMatters: 'It reorganizes many-body perturbation theory around a screened interaction and gives the coupled objects from which the GW approximation is obtained by a controlled vertex truncation.',
    lookFor: 'Start with Figs. 1–2 as diagrams for propagator and screened-interaction expansions, then compare the exact coupled equations with the first screened-interaction truncation and the electron-gas calculation actually reported.',
    connection: 'Core Part VIII distinguishes one-particle spectra from ground-state DFT. This source guide makes the screened-interaction and quasiparticle language behind that distinction inspectable.',
    sourceUrl: 'https://doi.org/10.1103/PhysRev.139.A796',
    visualNote: 'The guide keeps an Atlas-labelled conceptual diagram only for the coupled-equation relationship. It does not reproduce Hedin’s copyrighted article diagrams; use the linked original for those primary figures.',
  },
};
