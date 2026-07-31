const rawUnits = [["19","Quantum Molecular Dynamics (QMD)","chapter-19-quantum-molecular-dynamics-qmd",411,[["19.1","Molecular Dynamics (MD): Forces from the Electrons",411],["19.2","Born-Oppenheimer Molecular Dynamics",413],["19.3","Car–Parrinello Unified Algorithm for Electrons and Ions",414],["19.4","Expressions for Plane Waves",418],["19.5","Non-self-consistent QMD Methods",419],["19.6","Examples of Simulations",419]],424],["20","Response Functions: Phonons and Magnons","chapter-20-response-functions-phonons-and-magnons",427,[["20.1","Lattice Dynamics from Electronic Structure Theory",427],["20.2","The Direct Approach: “Frozen Phonons,” Magnons",430],["20.3","Phonons and Density Response Functions",433],["20.4","Green’s Function Formulation",435],["20.5","Variational Expressions",436],["20.6","Periodic Perturbations and Phonon Dispersion Curves",438],["20.7","Dielectric Response Functions, Effective Charges",439],["20.8","Electron–Phonon Interactions and Superconductivity",441],["20.9","Magnons and Spin Response Functions",442]],444],["21","Excitation Spectra and Optical Properties","chapter-21-excitation-spectra-and-optical-properties",446,[["21.1","Overview",446],["21.2","Time-Dependent Density Functional Theory (TDDFT)",447],["21.3","Dielectric Response for Noninteracting Particles",448],["21.4","Time-Dependent DFT and Linear Response",450],["21.5","Time-Dependent Density-Functional Perturbation Theory",451],["21.6","Explicit Real-Time Calculations",452],["21.7","Optical Properties of Molecules and Clusters",454],["21.8","Optical Properties of Crystals",459],["21.9","Beyond the Adiabatic Approximation",463]],464],["22","Surfaces, Interfaces, and Lower-Dimensional Systems","chapter-22-surfaces-interfaces-and-lower-dimensional-systems",465,[["22.1","Overview",465],["22.2","Potential at a Surface or Interface",466],["22.3","Surface States: Tamm and Shockley",467],["22.4","Shockley States on Metals: Gold (111) Surface",470],["22.5","Surface States on Semiconductors",471],["22.6","Interfaces: Semiconductors",472],["22.7","Interfaces: Oxides",474],["22.8","Layer Materials",477],["22.9","One-Dimensional Systems",478]],479],["23","Wannier Functions","chapter-23-wannier-functions",481,[["23.1","Definition and Properties",481],["23.2","Maximally Projected Wannier Functions",485],["23.3","Maximally Localized Wannier Functions",487],["23.4","Nonorthogonal Localized Functions",491],["23.5","Wannier Functions for Entangled Bands",492],["23.6","Hybrid Wannier Functions",494],["23.7","Applications",495]],496],["24","Polarization, Localization, and Berry Phases","chapter-24-polarization-localization-and-berry-phases",499,[["24.1","Overview",499],["24.2","Polarization: The Fundamental Difficulty",501],["24.3","Geometric Berry Phase Theory of Polarization",505],["24.4","Relation to Centers of Wannier Functions",508],["24.5","Calculation of Polarization in Crystals",509],["24.6","Localization: A Rigorous Measure",510],["24.7","The Thouless Quantized Particle Pump",512],["24.8","Polarization Lattice",513]],514]];

export const part05 = {
  number: 5,
  roman: "V",
  title: "From Electronic Structure to Properties of Matter",
  titleZh: "从电子结构到物质性质",
  label: "Part V · From Electronic Structure to Properties of Matter",
  slug: "part-05-properties-of-matter",
  overview: null,
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${5 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part05;
