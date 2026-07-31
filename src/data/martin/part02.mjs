const rawUnits = [["6","Density Functional Theory: Foundations","chapter-06-density-functional-theory-foundations",129,[["6.1","Overview",129],["6.2","Thomas–Fermi–Dirac Approximation",130],["6.3","The Hohenberg–Kohn Theorems",131],["6.4","Constrained Search Formulation of DFT",135],["6.5","Extensions of Hohenberg–Kohn Theorems",137],["6.6","Intricacies of Exact Density Functional Theory",139],["6.7","Difficulties in Proceeding from the Density",141]],143],["7","The Kohn–Sham Auxiliary System","chapter-07-the-kohn-sham-auxiliary-system",145,[["7.1","Replacing One Problem with Another",145],["7.2","The Kohn–Sham Variational Equations",148],["7.3","Solution of the Self-Consistent Coupled Kohn–Sham Equations",150],["7.4","Achieving Self-Consistency",157],["7.5","Force and Stress",160],["7.6","Interpretation of the Exchange–Correlation Potential Vxc",161],["7.7","Meaning of the Eigenvalues",162],["7.8","Intricacies of Exact Kohn–Sham Theory",163],["7.9","Time-Dependent Density Functional Theory",166],["7.10","Other Generalizations of the Kohn–Sham Approach",167]],168],["8","Functionals for Exchange and Correlation I","chapter-08-functionals-for-exchange-and-correlation-i",171,[["8.1","Overview",171],["8.2","Exc and the Exchange–Correlation Hole",172],["8.3","Local (Spin) Density Approximation (LSDA)",174],["8.4","How Can the Local Approximation Possibly Work As Well As It Does?",175],["8.5","Generalized-Gradient Approximations (GGAs)",179],["8.6","LDA and GGA Expressions for the Potential V σxc (r)",183],["8.7","Average and Weighted Density Formulations: ADA and WDA",185],["8.8","Functionals Fitted to Databases",185]],186],["9","Functionals for Exchange and Correlation II","chapter-09-functionals-for-exchange-and-correlation-ii",188,[["9.1","Beyond the Local Density and Generalized Gradient Approximations",188],["9.2","Generalized Kohn–Sham and Bandgaps",189],["9.3","Hybrid Functionals and Range Separation",191],["9.4","Functionals of the Kinetic Energy Density: Meta-GGAs",195],["9.5","Optimized Effective Potential",197],["9.6","Localized-Orbital Approaches: SIC and DFT+U",199],["9.7","Functionals Derived from Response Functions",203],["9.8","Nonlocal Functionals for van der Waals Dispersion Interactions",205],["9.9","Modified Becke–Johnson Functional for Vxc",209],["9.10","Comparison of Functionals",209]],213]];

export const part02 = {
  number: 2,
  roman: "II",
  title: "Density Functional Theory",
  titleZh: "密度泛函理论",
  label: "Part II · Density Functional Theory",
  slug: "part-02-density-functional-theory",
  overview: null,
  units: rawUnits.map(([id, title, slug, page, sections, exercisesPage]) => ({
    id: String(id),
    title,
    slug,
    page,
    label: `${2 === 7 ? 'Appendix' : 'Chapter'} ${id} · ${title}`,
    sections: sections.map(([sectionId, sectionTitle, sectionPage]) => ({
      id: sectionId,
      title: sectionTitle,
      page: sectionPage,
    })),
    exercisesPage,
  })),
};

export default part02;
