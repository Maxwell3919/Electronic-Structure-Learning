export interface MartinReadingUnit {
  id: string;
  kind: 'chapter' | 'appendix';
  number: string;
  title: string;
  route: string | null;
}

export interface MartinReadingPart {
  id: string;
  numeral: string;
  title: string;
  units: MartinReadingUnit[];
}

const chapter = (number: number, title: string): MartinReadingUnit => ({
  id: `martin-ch${String(number).padStart(2, '0')}`,
  kind: 'chapter',
  number: String(number),
  title,
  route: null,
});

const appendix = (letter: string, title: string): MartinReadingUnit => ({
  id: `martin-app-${letter.toLowerCase()}`,
  kind: 'appendix',
  number: letter,
  title,
  route: null,
});

export const martinParts: MartinReadingPart[] = [
  {
    id: 'martin-part-i',
    numeral: 'I',
    title: 'Overview and Background Topics',
    units: [
      chapter(1, 'Introduction'),
      chapter(2, 'Overview'),
      chapter(3, 'Theoretical Background'),
      chapter(4, 'Periodic Solids and Electron Bands'),
      chapter(5, 'Uniform Electron Gas and sp-Bonded Metals'),
    ],
  },
  {
    id: 'martin-part-ii',
    numeral: 'II',
    title: 'Density Functional Theory',
    units: [
      chapter(6, 'Density Functional Theory: Foundations'),
      chapter(7, 'The Kohn–Sham Auxiliary System'),
      chapter(8, 'Functionals for Exchange and Correlation I'),
      chapter(9, 'Functionals for Exchange and Correlation II'),
    ],
  },
  {
    id: 'martin-part-iii',
    numeral: 'III',
    title: 'Important Preliminaries on Atoms',
    units: [
      chapter(10, 'Electronic Structure of Atoms'),
      chapter(11, 'Pseudopotentials'),
    ],
  },
  {
    id: 'martin-part-iv',
    numeral: 'IV',
    title: 'Determination of Electronic Structure: The Basic Methods',
    units: [
      chapter(12, 'Plane Waves and Grids: Basics'),
      chapter(13, 'Plane Waves and Real-Space Methods: Full Calculations'),
      chapter(14, 'Localized Orbitals: Tight-Binding'),
      chapter(15, 'Localized Orbitals: Full Calculations'),
      chapter(16, 'Augmented Functions: APW, KKR, MTO'),
      chapter(17, 'Augmented Functions: Linear Methods'),
      chapter(18, 'Locality and Linear-Scaling O(N) Methods'),
    ],
  },
  {
    id: 'martin-part-v',
    numeral: 'V',
    title: 'From Electronic Structure to Properties of Matter',
    units: [
      chapter(19, 'Quantum Molecular Dynamics (QMD)'),
      chapter(20, 'Response Functions: Phonons and Magnons'),
      chapter(21, 'Excitation Spectra and Optical Properties'),
      chapter(22, 'Surfaces, Interfaces, and Lower-Dimensional Systems'),
      chapter(23, 'Wannier Functions'),
      chapter(24, 'Polarization, Localization, and Berry Phases'),
    ],
  },
  {
    id: 'martin-part-vi',
    numeral: 'VI',
    title: 'Electronic Structure and Topology',
    units: [
      chapter(25, 'Topology of the Electronic Structure of a Crystal: Introduction'),
      chapter(26, 'Two-Band Models: Berry Phase, Winding, and Topology'),
      chapter(27, 'Topological Insulators I: Two Dimensions'),
      chapter(28, 'Topological Insulators II: Three Dimensions'),
    ],
  },
  {
    id: 'martin-part-vii',
    numeral: 'VII',
    title: 'Appendices',
    units: [
      appendix('A', 'Functional Equations'),
      appendix('B', 'LSDA and GGA Functionals'),
      appendix('C', 'Adiabatic Approximation'),
      appendix('D', 'Perturbation Theory, Response Functions, and Green’s Functions'),
      appendix('E', 'Dielectric Functions and Optical Properties'),
      appendix('F', 'Coulomb Interactions in Extended Systems'),
      appendix('G', 'Stress from Electronic Structure'),
      appendix('H', 'Energy and Stress Densities'),
      appendix('I', 'Alternative Force Expressions'),
      appendix('J', 'Scattering and Phase Shifts'),
      appendix('K', 'Useful Relations and Formulas'),
      appendix('L', 'Numerical Methods'),
      appendix('M', 'Iterative Methods in Electronic Structure'),
      appendix('N', 'Two-Center Matrix Elements: Expressions for Arbitrary Angular Momentum l'),
      appendix('O', 'Dirac Equation and Spin–Orbit Interaction'),
      appendix('P', 'Berry Phase, Curvature, and Chern Numbers'),
      appendix('Q', 'Quantum Hall Effect and Edge Conductivity'),
      appendix('R', 'Codes for Electronic Structure Calculations for Solids'),
    ],
  },
];

export const martinReadingUnits = martinParts.flatMap((part) => part.units);
