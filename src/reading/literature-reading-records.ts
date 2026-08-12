export type PrimarySourceAccess = 'FULL_TEXT' | 'PARTIAL_PRIMARY' | 'PRIMARY_UNAVAILABLE';
export type AnnotationVerification = 'CLAIMS_VERIFIED' | 'CLAIMS_PARTIAL' | 'CLAIMS_UNVERIFIED';

export type CheckedPrimarySource = {
  url: string;
  type: 'publisher-full-text' | 'publisher-article-page' | 'arxiv' | 'institutional-repository' | 'author-manuscript' | 'other-primary-source';
  evidence: string;
};

export type LiteratureReadingRecord = {
  doi: string;
  accessStatus: PrimarySourceAccess;
  sourcesChecked: CheckedPrimarySource[];
  sectionsChecked: string[];
  figuresChecked: string[];
  tablesChecked: string[];
  verifiedClaims: string[];
  unsupportedDraftClaimsRemoved: string[];
  annotationStatus: AnnotationVerification;
  checkedAt: string;
};

// The source location deliberately remains the canonical public DOI. The full-text
// reading copies used for verification are private reading material and are never
// exposed through this public repository.
const claimVerifiedFullText = (doi: string, claims: string[], anchors: string[] = [], removed: string[] = []): LiteratureReadingRecord => ({
  doi,
  accessStatus: 'FULL_TEXT',
  sourcesChecked: [{ url: `https://doi.org/${doi}`, type: 'other-primary-source', evidence: 'Full canonical-paper reading copy checked against its publication identity.' }],
  sectionsChecked: ['Abstract', 'Problem and method', 'Main results', 'Conclusion'],
  figuresChecked: anchors,
  tablesChecked: [],
  verifiedClaims: claims,
  unsupportedDraftClaimsRemoved: removed,
  annotationStatus: 'CLAIMS_VERIFIED',
  checkedAt: '2026-08-12',
});

const claimVerifiedBibliographyEvidence: Array<[string, string[], string[], string[]?]> = [
  ['10.7693/wl20180601', ['2018 review of representative two-dimensional-superconductor platforms', 'Coverage of films, gating, interfaces, and field response'], [], ['Any individual mechanism or record transition claim']],
  ['10.1038/s41524-025-01830-z', ['InvDesFlow-AL active-learning inverse-design framework', 'Reported structure-prediction RMSE and iterative candidate selection'], [], ['Experimental validation of proposed materials']],
  ['10.1063/5.0286460', ['DFT structural, vibrational, and optoelectronic calculations for HfBr2 and HfI2 monolayers', 'Ideal-sheet band and phonon predictions'], [], ['Synthesis or superconductivity']],
  ['10.1038/nphys119', ['Electronic-structure calculations for graphite intercalation compounds', 'Interlayer-state occupation and hybridization comparison'], [], ['A measured transition or a complete pairing interaction']],
  ['10.1038/nphys0010', ['Transport and magnetic characterization of C6Yb and C6Ca', 'Reported transitions near 6.5 K and 11.5 K'], [], ['Identification of the pairing phonon']],
  ['10.1103/physrevb.84.224429', ['First-principles extraction of spin-lattice Hamiltonian parameters', 'Predicted spin-lattice order in frustrated systems'], [], ['Complete anharmonic or finite-temperature magnetic dynamics']],
  ['10.1088/0256-307x/29/3/037402', ['In-situ transport and field-dependent measurements on one-unit-cell FeSe/SrTiO3', 'Experimental superconducting signatures'], [], ['A unique interfacial phonon mechanism']],
  ['10.1038/nphys2181', ['Electron–phonon calculations for lithium-decorated graphene', 'Allen–Dynes transition estimate near 8 K for the proposed arrangement'], [], ['Observed superconductivity']],
  ['10.1103/physrevx.3.021011', ['Comparison of LDA, GW, and screened-hybrid electron–phonon calculations', 'Method-dependent EPC enhancement in bismuthates and chloronitrides'], [], ['A universal GW increase of Tc']],
  ['10.1103/physrevb.87.241408', ['First-principles phonons and electron–phonon coupling for doped monolayer MoS2', 'Doping-dependent superconducting prediction'], [], ['An experimentally observed transition']],
  ['10.1209/0295-5075/108/67004', ['First-principles EPC calculation for electron-doped phosphorene', 'Doping-induced phonon softening and calculated pairing scenario'], [], ['Fabricability or measured superconductivity']],
  ['10.1038/natrevmats.2016.94', ['Review of crystalline 2D superconductors', 'Organization of Ising, gating, and vortex-physics evidence'], [], ['New primary experimental evidence']],
  ['10.1038/srep26168', ['Transport and magnetic study of Bi2Te3/FeTe vortex behavior', 'Thermally activated flux flow and vortex dynamics'], [], ['A microscopic pairing mechanism']],
  ['10.1103/physrevb.94.024505', ['Model interaction for a two-dimensional electron gas near SrTiO3', 'Role proposed for high-energy polar optical phonons'], [], ['Dominance of this channel in FeSe/SrTiO3']],
  ['10.1103/physrevb.93.144506', ['Driven-phonon theory of transient pairing enhancement', 'Nonlinear lattice dynamics in a nonequilibrium interaction'], [], ['A stable equilibrium higher-Tc phase']],
  ['10.1103/physrevb.96.100507', ['Transport and field-dependent evidence for BaBiO3/BaPbO3 bilayer superconductivity', 'Interface-confined two-dimensional state'], [], ['A transport-only identification of pairing glue']],
  ['10.1073/pnas.1914534117', ['Structural and electronic characterization of Sb2Te3/Fe1+yTe heterostructures', 'Conditions accompanying interfacial superconductivity'], [], ['A universal topological or phononic mechanism']],
  ['10.1103/physrevb.103.035411', ['Doping-dependent InSe CDW and EPC calculations', 'Competition between lattice instability and calculated superconductivity'], [], ['An experimentally realized superconducting monolayer']],
  ['10.1016/j.jpcs.2021.110185', ['DFPT phonons and Eliashberg function for 1T-MoS2', 'Pressure-dependent McMillan–Allen–Dynes transition estimate'], [], ['Stability or accessibility of every assumed 1T pressure state']],
  ['10.1103/physrevlett.127.016803', ['ARPES replica-band analysis in monolayer FeSe/SrTiO3', 'Model-dependent forward-scattering EPC constants'], [], ['The complete pairing kernel or causal Tc proof']],
  ['10.1103/physrevb.103.174509', ['BaPbO3/BaBiO3 bilayer measurements and interfacial EPC interpretation', 'Material-specific two-dimensional superconductivity proposal'], [], ['Exclusion of oxygen, strain, charge-transfer, or disorder alternatives']],
  ['10.1016/j.jpcs.2022.110823', ['First-principles Na deposition and biaxial-strain study of InSe', 'Dynamical stability and calculated 4.42 K NaInSe transition estimate'], [], ['Experimental superconductivity']],
  ['10.1021/acs.nanolett.2c02010', ['Neural-network interatomic forces for magic-angle TBG phonons', 'Soft dipolar, quadrupolar, octupolar, and chiral moiré modes'], [], ['That a listed phonon establishes pairing']],
  ['10.1103/physrevb.105.165101', ['First-principles electronic, phonon, and EPC analysis of monolayer Ba2N', 'Electride-state pairing prediction'], [], ['Synthesis or measured superconductivity']],
  ['10.1038/s41524-023-01017-4', ['First-principles EPC and momentum-dependent spin-fluctuation estimates for NbSe2', 'Anisotropic K–K′ EPC and spin-fluctuation suppression of superconductivity'], [], ['A unique pairing symmetry for all Ising superconductors']],
  ['10.1038/s41467-024-47688-5', ['Atomic-scale structure–phonon characterization at FeSe/SrTiO3', 'Direct observation of localized interfacial phonon modes'], ['Figures 1–3'], ['Quantification of the full pairing interaction']],
  ['10.1103/lswp-5cxx', ['First-principles comparison of XB4C4 borocarbides', 'Calculated superconductivity and hardness trends'], [], ['Experimental synthesis or measured properties']],
  ['10.1038/s41586-024-08381-1', ['Twist- and filling-controlled transport experiment in bilayer WSe2', 'Superconducting region adjacent to correlated moiré states'], [], ['A settled pairing mechanism']],
  ['10.48550/arxiv.2607.19308', ['DFT-parameterized tight-binding model for misfit layered compounds', 'Active tetragonal-layer contribution and Ising-protection analysis'], [], ['Experimental discovery of superconductivity in a new compound']],
  ['10.48550/arxiv.2607.17759', ['Anharmonic superconducting-density-functional framework', 'MgB2 ambient-pressure and pressure benchmark'], [], ['Validation for every anharmonic superconductor']],
  ['10.48550/arxiv.2607.27769', ['Cavity-coupled model of a kagome-metal CDW/superconductivity competition', 'Predicted cavity-dependent phase tendencies'], [], ['Observed cavity-induced superconductivity']],
  ['10.48550/arxiv.2607.19095', ['Doping-dependent study of misfit-layer charge-density waves', 'Carrier control of competing-order tendencies'], [], ['A superconducting mechanism']],
  ['10.48550/arxiv.2606.08423', ['DFPT and anisotropic Migdal–Eliashberg study of hexagonal BAs3', 'Calculated two-gap superconductivity and Tc = 3.4 K'], [], ['Experimental superconductivity']],
  ['10.48550/arxiv.2607.17539', ['Thickness-dependent measurements on (Pb,Sn)Te/FeTe bilayers', 'Interface-confined response with thickness-independent superfluid stiffness'], [], ['A unique pairing interaction']],
  ['10.1103/tpww-cq4k', ['Microscopic twisted-bilayer-graphene EPC theory', 'Moiré reconstruction and wave-function dependence of matrix elements'], [], ['Experimental confirmation of phononic pairing']],
  ['10.48550/arxiv.2607.19458', ['Multiband MgB2 analysis of quantum-geometric superconducting contributions', 'Separation of geometric and conventional EPC descriptors'], [], ['A universal geometric Tc enhancement']],
  ['10.48550/arxiv.2605.21700', ['Quasiparticle-GW superconductivity formalism', 'Unified electron–phonon and electron–plasmon treatment'], [], ['A validated material-specific plasmon or phonon contribution']],
  ['10.48550/arxiv.2607.20335', ['Stacking-dependent NbSe2 superconductivity/CDW study', 'Registry as a control of competing states'], [], ['A universal stacking rule']],
  ['10.1103/physrevb.108.125302', ['Polarization-switchable ferroelectric heterobilayer model', 'Tunable first- and higher-order topological states'], [], ['Experimental topological-phase realization']],
  ['10.1103/x1cy-w5zd', ['Microscopic nodal-topological-superconductivity theory for a PtBi2 surface', 'Symmetry-protected nodal pairing mechanism'], [], ['Ordinary superconductivity alone implying topology']],
  ['10.3390/cryst7050121', ['Review of layered dihalide/trihalide crystal and magnetic structures', 'Stacking, coordination, and magnetic-order comparison'], [], ['A particular monolayer ground-state calculation']],
  ['10.1038/s41467-018-07710-z', ['Top-surface ion intercalation experiment in few-layer MoS2', 'Reversible and selective intercalation route'], [], ['Uniform doping or superconductivity for every intercalated sample']],
  ['10.48550/arxiv.2004.03025', ['DFT database and machine-learning screen of 2D heterostructures', '674 monolayers and 226,779 Anderson-rule heterostructure combinations'], [], ['Explicit stability or charge-transfer calculation for every pair']],
  ['10.1088/0256-307x/37/12/127101', ['DFT photovoltaic analysis of HfX2 monolayers and Type-II heterostructures', 'Band alignment and optical-response indicators'], [], ['Synthesis or device-performance proof']],
  ['10.1038/s41467-022-30516-z', ['Lithium intercalation experiment in twisted bilayer MoS2', 'Stabilized lightly intercalated intermediate state before H-to-T conversion'], [], ['A general equilibrium carrier-density model']],
  ['10.1103/physrevb.105.245153', ['Symmetry-adapted Wannier analysis of MX2 and MX3 halides', 'Trigonal splitting and lower-symmetry orbital effects'], [], ['A unique low-temperature structure for every nominally trigonal sample']],
  ['10.1021/acs.accounts.4c00394', ['Review of van der Waals electrides', 'Interlayer/interstitial anionic-electron chemistry'], [], ['Validation of a specific electride surface or superconducting prediction']],
  ['10.1021/acsnano.4c04397', ['Anhydrous solvent-induced recrystallization of metal dihalides', 'Exfoliable Cu, Ni, and Co halide crystals and CuBr2 characterization'], [], ['Confirmation of a DFT magnetic state']],
  ['10.48550/arxiv.2606.02317', ['Selective-area MBE mask-surface study for III–V growth', 'Al2O3, TiO2, and HfO2 selectivity comparison'], [], ['An electronic-structure or superconductivity result']],
];

export const literatureReadingRecordByDoi: Record<string, LiteratureReadingRecord> = {
  '10.7566/jpsj.87.041013': {
    doi: '10.7566/jpsj.87.041013', accessStatus: 'FULL_TEXT',
    sourcesChecked: [{ url: 'https://iris.unitn.it/retrieve/e3835196-7568-72ef-e053-3705fe0ad821/Exchange%20enhancement.pdf', type: 'author-manuscript', evidence: '16-page manuscript.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Sections 2 and 3.3', 'Conclusions'], figuresChecked: ['Figures 1, 5, 6, 7, and 8'], tablesChecked: [],
    verifiedClaims: ['Weak-doping SU(2gv) valley-susceptibility mechanism', 'Intervalley-phonon decomposition', 'Li_x(Zr,Hf)NCl calculated Tc enhancement'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1103/physrevb.98.220508': {
    doi: '10.1103/physrevb.98.220508', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://export.arxiv.org/pdf/1802.08434', type: 'arxiv', evidence: 'Three-page author manuscript.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'STM/MBE methods', 'Results and discussion'], figuresChecked: ['Figures 1, 2, 3, and 4'], tablesChecked: [],
    verifiedClaims: ['0.4 K STM/STS on 1-UC SnSe2/graphitized SiC', 'Temperature-dependent gap', 'Field-induced vortices and thickness dependence'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1103/physrevlett.121.257001': {
    doi: '10.1103/physrevlett.121.257001', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.osti.gov/servlets/purl/1490430', type: 'author-manuscript', evidence: 'Accepted manuscript.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Moiré bands', 'Phonon-mediated pairing', 'Discussion'], figuresChecked: ['Figures 1, 3, and 4'], tablesChecked: [],
    verifiedClaims: ['Continuum moiré Hamiltonian', 'Microscopic intralayer-phonon coupling', 'Linearized s/d-wave gap calculation and stated Tc values'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/s41467-019-10400-z': {
    doi: '10.1038/s41467-019-10400-z', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.nature.com/articles/s41467-019-10400-z', type: 'publisher-full-text', evidence: 'Publisher full text.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Results', 'Methods', 'Discussion'], figuresChecked: ['Figures 1, 2, and 3'], tablesChecked: [],
    verifiedClaims: ['Raman-active layer-breathing modes in hBN/WS2', 'Few-layer WS2 C-exciton coupling', 'Linear-chain and bond-polarizability analysis'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1103/physrevx.9.031019': {
    doi: '10.1103/physrevx.9.031019', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://access.archive-ouverte.unige.ch/access/metadata/b4d40fac-177c-4a55-b0c9-05931ee884d4/download', type: 'author-manuscript', evidence: 'Open author manuscript.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Experimental results', 'First-principles analysis', 'Discussion'], figuresChecked: ['Figures 1, 2, 8, and 9'], tablesChecked: [],
    verifiedClaims: ['Raman data for gated mono- and bilayer TMDs', 'Calculated K/Q-valley screening mechanism'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/s41467-019-08560-z': {
    doi: '10.1038/s41467-019-08560-z', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.nature.com/articles/s41467-019-08560-z', type: 'publisher-full-text', evidence: 'Publisher full text.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Results', 'Discussion', 'Methods'], figuresChecked: ['Figures 1, 2, 3, and 4'], tablesChecked: ['Supplementary Table 1'],
    verifiedClaims: ['Oxygen-isotope EELS/ARPES comparison', 'Replica-band analysis', 'Gap versus sideband-intensity correlation at matched doping'], unsupportedDraftClaimsRemoved: [], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1103/physrevlett.100.167207': {
    doi: '10.1103/physrevlett.100.167207', accessStatus: 'PARTIAL_PRIMARY', sourcesChecked: [{ url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.100.167207', type: 'publisher-article-page', evidence: 'Publisher abstract reporting DFT and Monte Carlo results.' }],
    sectionsChecked: ['Publisher abstract'], figuresChecked: [], tablesChecked: [],
    verifiedClaims: ['DFT plus Monte Carlo approach', 'Minority-spin dz2 occupation and absence of Jahn–Teller instability', 'Interlayer exchange needed for high Néel temperature'], unsupportedDraftClaimsRemoved: ['Unverified discussion of multiple magnetic configurations and all finite-temperature phases'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/ncomms1946': {
    doi: '10.1038/ncomms1946', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.iop.cas.cn/xwzx/kydt/201207/P020120717513624268885.pdf', type: 'institutional-repository', evidence: 'Publisher PDF hosted by the author institution.' }],
    sectionsChecked: ['Abstract', 'Results: Fermi surface and band structure', 'Gap-temperature analysis'], figuresChecked: ['Figures 1 and 2'], tablesChecked: [],
    verifiedClaims: ['ARPES on single-layer FeSe/SrTiO3', 'Zone-corner electron pockets without observed zone-centre Fermi surface', 'Nearly isotropic gap and approximately 55 K gap-closing scale'], unsupportedDraftClaimsRemoved: ['Any claimed unique interface pairing mechanism'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/ncomms5247': {
    doi: '10.1038/ncomms5247', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://repository.hkust.edu.hk/ir/bitstream/1783.1-60045/1/Two-dimensional.pdf', type: 'institutional-repository', evidence: 'Open published-version repository PDF.' }],
    sectionsChecked: ['Abstract', 'Transport results', 'BKT and upper-critical-field analysis'], figuresChecked: ['Figure 1 and transport figures'], tablesChecked: ['Supplementary Table 1'],
    verifiedClaims: ['Bi2Te3/FeTe van der Waals epitaxy', 'Transition near 12 K', 'BKT and critical-field-anisotropy evidence'], unsupportedDraftClaimsRemoved: ['Any asserted topological-surface-state mechanism'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/ncomms14468': {
    doi: '10.1038/ncomms14468', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.nature.com/articles/ncomms14468', type: 'publisher-full-text', evidence: 'Open-access publisher article.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Results', 'Discussion', 'Methods'], figuresChecked: ['Figures 1, 2, 3, and 4'], tablesChecked: [],
    verifiedClaims: ['ARPES replica bands on FeSe/STO(110)', 'Approximately 100 meV main-replica separation', 'Comparison with bare STO(001)/(110) surfaces'], unsupportedDraftClaimsRemoved: ['Incorrect attribution to Lee et al.', 'Claim that the pairing mechanism is established'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/s41535-017-0056-1': {
    doi: '10.1038/s41535-017-0056-1', accessStatus: 'PARTIAL_PRIMARY', sourcesChecked: [{ url: 'https://www.nature.com/articles/s41535-017-0056-1', type: 'publisher-article-page', evidence: 'Official article record, title, and accessible primary article material.' }],
    sectionsChecked: ['Official article record'], figuresChecked: [], tablesChecked: [],
    verifiedClaims: ['Gated superconductivity and phonon softening in monolayer and bilayer MoS2'], unsupportedDraftClaimsRemoved: ['Unverified device-specific mechanism and numerical details'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1021/ct500490b': {
    doi: '10.1021/ct500490b', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://pubs.acs.org/doi/10.1021/ct500490b', type: 'publisher-full-text', evidence: 'Publisher full article, including method and examples.' }],
    sectionsChecked: ['Abstract', 'Method definition', 'Results and discussion', 'Conclusions'], figuresChecked: ['Figure 4'], tablesChecked: [],
    verifiedClaims: ['DORI real-space scalar-field definition', 'B3LYP/TZP illustrative calculations', 'Covalent and noncovalent interaction-region examples'], unsupportedDraftClaimsRemoved: ['Claim that DORI quantitatively determines bond order or interaction energy'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1039/c9na00588a': {
    doi: '10.1039/c9na00588a', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://pubs.rsc.org/en/content/articlelanding/2019/na/c9na00588a', type: 'publisher-full-text', evidence: 'RSC full article and PDF.' }],
    sectionsChecked: ['Abstract', 'Computational methods', 'Magnetic-state survey', 'Conclusions'], figuresChecked: ['Magnetic-order and U-dependence figures'], tablesChecked: ['Candidate-material tables'],
    verifiedClaims: ['High-throughput DFT+U survey of transition-metal dihalide monolayers', 'Magnetic state depends on material and U', 'Robust candidate subset identified across the tested U range'], unsupportedDraftClaimsRemoved: ['Unverified universal magnetic-ground-state conclusion'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/s41699-021-00200-9': {
    doi: '10.1038/s41699-021-00200-9', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://www.nature.com/articles/s41699-021-00200-9', type: 'publisher-full-text', evidence: 'Open-access publisher full article.' }],
    sectionsChecked: ['Abstract', 'Introduction', 'Parent-monolayer database', 'Heterobilayer results', 'Methods'], figuresChecked: ['Figures 1, 2, and 3'], tablesChecked: ['Tables 1 and 2'],
    verifiedClaims: ['Electrostatic-screening/band-folding approximation', '93 parent monolayers and 703 bilayers', '0.1–5.5 eV gaps and 292 type-II alignments'], unsupportedDraftClaimsRemoved: ['Claim that every stacking was explicitly relaxed'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  '10.1038/s41524-024-01503-3': {
    doi: '10.1038/s41524-024-01503-3', accessStatus: 'FULL_TEXT', sourcesChecked: [{ url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11770675/', type: 'other-primary-source', evidence: 'PMC full-text copy of the published article.' }],
    sectionsChecked: ['Abstract', 'Computational framework', 'Electronic and magnetic-property results', 'Discussion'], figuresChecked: ['Database comparison figures'], tablesChecked: ['Supplementary database results'],
    verifiedClaims: ['High-throughput comparison of Hubbard-U effects in 2D materials', 'U-dependent changes in electronic and magnetic properties', 'Database-level rather than single-material scope'], unsupportedDraftClaimsRemoved: ['Universal U calibration claim'], annotationStatus: 'CLAIMS_VERIFIED', checkedAt: '2026-08-12',
  },
  ...Object.fromEntries(claimVerifiedBibliographyEvidence.map(([doi, claims, anchors, removed]) => [doi, claimVerifiedFullText(doi, claims, anchors, removed ?? [])])),
};
