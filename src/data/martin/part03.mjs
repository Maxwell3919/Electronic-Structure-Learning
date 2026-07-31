const rawUnits = [["10","Electronic Structure of Atoms","chapter-10-electronic-structure-of-atoms",215,[["10.1","One-Electron Radial Schrödinger Equation",215],["10.2","Independent-Particle Equations: Spherical Potentials",217],["10.3","Spin–Orbit Interaction",219],["10.4","Open-Shell Atoms: Nonspherical Potentials",219],["10.5","Example of Atomic States: Transition Elements",221],["10.6","Delta-SCF: Electron Addition, Removal, and Interaction Energies",224],["10.7","Atomic Sphere Approximation in Solids",225]],228],["11","Pseudopotentials","chapter-11-pseudopotentials",230,[["11.1","Scattering Amplitudes and Pseudopotentials",230],["11.2","Orthogonalized Plane Waves (OPWs) and Pseudopotentials",233],["11.3","Model Ion Potentials",237],["11.4","Norm-Conserving Pseudopotentials (NCPPs)",238],["11.5","Generation of l-Dependent Norm-Conserving Pseudopotentials",241],["11.6","Unscreening and Core Corrections",245],["11.7","Transferability and Hardness",246],["11.8","Separable Pseudopotential Operators and Projectors",247],["11.9","Extended Norm Conservation: Beyond the Linear Regime",248],["11.10","Optimized Norm-Conserving Potentials",249],["11.11","Ultrasoft Pseudopotentials",250],["11.12","Projector Augmented Waves (PAWs): Keeping the Full Wavefunction",252],["11.13","Additional Topics",255]],256]];

export const part03 = {
  number: 3,
  roman: "III",
  title: "Important Preliminaries on Atoms",
  titleZh: "原子与赝势基础",
  label: "Part III · Important Preliminaries on Atoms",
  slug: "part-03-important-preliminaries-on-atoms",
  overview: null,
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${3 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part03;
