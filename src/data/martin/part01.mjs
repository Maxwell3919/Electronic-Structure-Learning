const rawUnits = [["1","Introduction","chapter-01-introduction",1,[["1.1","Quantum Theory and the Origins of Electronic Structure",2],["1.2","Why Is the Independent-Electron Picture So Successful?",3],["1.3","Emergence of Quantitative Calculations",7],["1.4","The Greatest Challenge: Electron Interaction and Correlation",10],["1.5","Density Functional Theory",11],["1.6","Electronic Structure Is Now an Essential Part of Research",11],["1.7","Materials by Design",12],["1.8","Topology of Electronic Structure",13]],null],["2","Overview","chapter-02-overview",15,[["2.1","Electronic Structure and the Properties of Matter",15],["2.2","Electronic Ground State: Bonding and Characteristic Structures",17],["2.3","Volume or Pressure As the Most Fundamental Variable",19],["2.4","How Good Is DFT for Calculation of Structures?",21],["2.5","Phase Transitions under Pressure",23],["2.6","Structure Prediction: Nitrogen Solids and Hydrogen Sulfide Superconductors at High Pressure",26],["2.7","Magnetism and Electron–Electron Interactions",31],["2.8","Elasticity: Stress–Strain Relations",33],["2.9","Phonons and Displacive Phase Transitions",35],["2.10","Thermal Properties: Solids, Liquids, and Phase Diagrams",38],["2.11","Surfaces and Interfaces",44],["2.12","Low-Dimensional Materials and van der Waals Heterostructures",47],["2.13","Nanomaterials: Between Molecules and Condensed Matter",48],["2.14","Electronic Excitations: Bands and Bandgaps",50],["2.15","Electronic Excitations and Optical Spectra",54],["2.16","Topological Insulators",57],["2.17","The Continuing Challenge: Electron Correlation",57]],null],["3","Theoretical Background","chapter-03-theoretical-background",60,[["3.1","Basic Equations for Interacting Electrons and Nuclei",60],["3.2","Coulomb Interaction in Condensed Matter",64],["3.3","Force and Stress Theorems",65],["3.4","Generalized Force Theorem and Coupling Constant Integration",67],["3.5","Statistical Mechanics and the Density Matrix",68],["3.6","Independent-Electron Approximations",69],["3.7","Exchange and Correlation",74]],78],["4","Periodic Solids and Electron Bands","chapter-04-periodic-solids-and-electron-bands",81,[["4.1","Structures of Crystals: Lattice + Basis",81],["4.2","Reciprocal Lattice and Brillouin Zone",90],["4.3","Excitations and the Bloch Theorem",94],["4.4","Time-Reversal and Inversion Symmetries",98],["4.5","Point Symmetries",100],["4.6","Integration over the Brillouin Zone and Special Points",101],["4.7","Density of States",105]],106],["5","Uniform Electron Gas and sp-Bonded Metals","chapter-05-uniform-electron-gas-and-sp-bonded-metals",109,[["5.1","The Electron Gas",109],["5.2","Noninteracting and Hartree–Fock Approximations",111],["5.3","Correlation Hole and Energy",117],["5.4","Binding in sp-Bonded Metals",121],["5.5","Excitations and the Lindhard Dielectric Function",122]],126]];

export const part01 = {
  number: 1,
  roman: "I",
  title: "Overview and Background Topics",
  titleZh: "概览与背景主题",
  label: "Part I · Overview and Background Topics",
  slug: "part-01-overview-and-background",
  overview: null,
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${1 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part01;
