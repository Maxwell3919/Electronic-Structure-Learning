import { literaturePreprocessingQueue } from './literature-preprocessing';

export type ImpactFactor = {
  value: number | null;
  year: number | null;
  source: string;
};

export type CompanionCorrection = {
  label: string;
  doi: string;
};

export type LiteraturePaper = {
  id: string;
  topicId: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  href?: string;
  abstract?: string;
  impactFactor: ImpactFactor;
  readerState: 'complete_reader' | 'pre_reading';
  sourceVersion?: string;
  companionCorrections?: CompanionCorrection[];
};

type PreReadingMetadata = Pick<LiteraturePaper, 'authors' | 'journal' | 'year' | 'doi' | 'abstract' | 'sourceVersion' | 'companionCorrections'>;

const preReadingMetadataById: Record<string, PreReadingMetadata> = {
  'stable-semiconducting-1t-prime-hfcl2-monolayer': {
    authors: ['Celso Alves Do Nascimento Júnior', 'Elie Albert Moujaes', 'Maurício Jeomar Piotrowski', 'Celso Ricardo Caldeira Rêgo', 'Diego Guedes-Sobrinho', 'Luiz Antônio Ribeiro Júnior', 'Teldo Anderson da Silva Pereira', 'Alexandre Cavalheiro Dias'],
    journal: 'ACS Omega',
    year: 2025,
    doi: '10.1021/acsomega.4c10560',
    abstract: 'Designing novel 2D materials is crucial for advancing next-generation optoelectronic technologies. This work introduces and analyzes the 1T′-HfCl₂ monolayer, a novel low-symmetry variant within the 2D transition metal dichloride family. Phonon dispersion calculations reveal no imaginary frequencies, suggesting its dynamical stability. 1T′-HfCl₂ exhibits semiconducting behavior with a direct band gap of 1.52 eV, promising for optoelectronics. Strong excitonic effects with a binding energy of 525 meV highlight significant electron–hole interactions typical of 2D systems. Furthermore, the monolayer achieves total reflection of linearly polarized light along the ŷ direction at photon energies above 2.5 eV, showcasing its potential as an optical polarizing filter. Raman spectra calculations also reveal distinct peaks between 96.72 and 270.38 cm⁻¹. The tunable excitonic and optical properties of 1T′-HfCl₂ highlight its potential in future functional devices, paving the way for its integration into semiconducting and optoelectronic applications.',
    sourceVersion: 'Records reading copy derived from the published Europe PMC JATS package; it is not the ACS typeset pagination.',
  },
  'hfx2-type-ii-photovoltaic-heterostructures': {
    authors: ['Xingyong Huang', 'Liujiang Zhou', 'Luo Yan', 'You Wang', 'Wei Zhang', 'Xiumin Xie', 'Qiang Xu', 'Hai-Zhi Song'],
    journal: 'Chinese Physics Letters',
    year: 2020,
    doi: '10.1088/0256-307X/37/12/127101',
    abstract: 'Two-dimensional (2D) materials and their corresponding van der Waals (vdW) heterostructures are considered as promising candidates for highly efficient solar cell applications. A series of 2D HfX₂ (X = Cl, Br, I) monolayers are proposed, via first-principle calculations. The vibrational phonon spectra and molecular dynamics simulation results indicate that HfX₂ monolayers possess dynamical and thermodynamical stability. Moreover, their electronic structure shows that their Heyd–Scuseria–Ernzerhof (HSE06)-based band values (1.033–1.475 eV) are suitable as donor systems for excitonic solar cells (XSCs). The material’s significant visible-light absorbing capability (~10⁵ cm⁻¹) and superior power conversion efficiency (~20%) are demonstrated by establishing a reasonable type II vdW heterostructure. This suggests the significant potential of HfX₂ monolayers as a candidate material for XSCs.',
    sourceVersion: 'Published journal PDF.',
  },
  'dfpt-phonons-crystal-properties': {
    authors: ['Stefano Baroni', 'Stefano de Gironcoli', 'Andrea Dal Corso', 'Paolo Giannozzi'],
    journal: 'Reviews of Modern Physics',
    year: 2001,
    doi: '10.1103/RevModPhys.73.515',
    abstract: 'This article reviews the current status of lattice-dynamical calculations in crystals, using density-functional perturbation theory, with emphasis on the plane-wave pseudopotential method. Several specialized topics are treated, including the implementation for metals, the calculation of the response to macroscopic electric fields and their relevance to long-wavelength vibrations in polar materials, the response to strain deformations, and higher-order responses. The success of this methodology is demonstrated with a number of applications existing in the literature.',
    sourceVersion: 'Published journal PDF.',
  },
  'electron-phonon-interactions-first-principles': {
    authors: ['Feliciano Giustino'],
    journal: 'Reviews of Modern Physics',
    year: 2017,
    doi: '10.1103/RevModPhys.89.015003',
    abstract: 'This article reviews the theory of electron-phonon interactions in solids from the point of view of ab initio calculations. While the electron-phonon interaction has been studied for almost a century, predictive non-empirical calculations have become feasible only during the past two decades. Today it is possible to calculate from first principles many materials properties related to the electron-phonon interaction, including the critical temperature of conventional superconductors, the carrier mobility in semiconductors, the temperature dependence of optical spectra in direct and indirect-gap semiconductors, the relaxation rates of photoexcited carriers, the electron mass renormalization in angle-resolved photoelectron spectra, and the non-adiabatic corrections to phonon dispersion relations. Here we review the theoretical and computational framework underlying modern electron-phonon calculations from first principles, as well as landmark investigations of the electron-phonon interaction in real materials. In the first part of the article we summarize the elementary theory of electron-phonon interactions and their calculations based on density-functional theory. In the second part we discuss a general field-theoretic formulation of the electron-phonon problem, and establish the connection with practical first-principles calculations. In the third part we review a number of recent investigations of electron-phonon interactions in the areas of vibrational spectroscopy, photoelectron spectroscopy, optical spectroscopy, transport, and superconductivity.',
    sourceVersion: 'Author preprint, arXiv:1603.06965v2; the canonical article identity remains the RMP DOI.',
    companionCorrections: [{ label: 'Erratum', doi: '10.1103/RevModPhys.91.019901' }],
  },
  'gated-2d-dfpt': {
    authors: ['Thibault Sohier', 'Matteo Calandra', 'Francesco Mauri'],
    journal: 'Physical Review B',
    year: 2017,
    doi: '10.1103/PhysRevB.96.075448',
    abstract: 'The ability to perform first-principles calculations of electronic and vibrational properties of two-dimensional heterostructures in a field-effect setup is crucial for the understanding and design of next-generation devices. We present here an implementation of density functional perturbation theories tailored for the case of two-dimensional heterostructures in field-effect configuration. Key ingredients are the inclusion of a truncated Coulomb interaction in the direction perpendicular to the slab and the possibility of simulating charging of the slab via field-effects. With this implementation we can access total energies, force and stress tensors, the vibrational properties and the electron phonon interaction. We demonstrate the relevance of the method by studying flexural acoustic phonons and their coupling to electrons in graphene doped by field-effect. In particular, we show that while the electron-phonon coupling to those phonons can be significant in neutral graphene, it is strongly screened and negligible in doped graphene, in disagreement with other recent first-principles reports. Consequently, the gate-induced coupling with flexural acoustic modes would not be detectable in transport measurements on doped graphene.',
    sourceVersion: 'Author preprint, arXiv:1705.04973v2; the canonical article identity remains the PRB DOI.',
  },
  'allen-dynes-transition-temperature': {
    authors: ['P. B. Allen', 'R. C. Dynes'],
    journal: 'Physical Review B',
    year: 1975,
    doi: '10.1103/PhysRevB.12.905',
    abstract: 'A thorough analysis is made of the dependence of the superconducting transition temperature Tᶜ on material properties (λ, μ*, phonon spectrum) as contained in Eliashberg theory. The most striking new feature of the analysis is in the asymptotic regime of very large λ where Tᶜ is found to equal 0.15(λ〈ω²〉)½ (assuming μ*=0.1). This result implies the surprising conclusion that within Eliashberg theory Tᶜ is not limited by the phonon frequencies, and also shows that McMillan’s “λ=2 limit” is spurious. The McMillan equation (with a prefactor altered from ΘD/1.45 to ωlog/1.2) is found to be highly accurate for all known materials with λ<1.5 but in error for large values of λ. Correction factors to McMillan’s equation are found in terms of λ, μ*, and one additional parameter, 〈ω²〉½/ωlog. The frequency ωlog is defined as exp〈lnω〉 where the averages 〈lnω〉 and 〈ω²〉 are defined using (2/λω)α²F(ω) as a weight factor. These conclusions are based on a combination of analytic and numerical solutions of the Eliashberg equations, and are supported by a comparison with tunneling data. Especially strong support comes from a new experimental result for amorphous Pb₀.₄₅Bi₀.₅₅ reported herein. This material has parameters λ=2.59 and Tᶜ/ωlog=0.284, in serious disagreement with McMillan’s formula but in good agreement when the correction factors are included. The McMillan-Hopfield parameter η [or N(0)〈I²〉] is extracted from tunneling measurements or from a combination of empirical values of λ and neutron-scattering measurements of phonon dispersion. It is proposed that η (which is now known not to be accurately constant) is the most significant single parameter in understanding the origin of high Tᶜ and the limitation of Tᶜ by covalent instabilities.',
    sourceVersion: 'Published journal PDF.',
  },
  'snse2-ptte2-interfacial-superconductivity': {
    authors: ['Jun Fan', 'Xiao-Le Qiu', 'Zhong-Yi Lu', 'Kai Liu', 'Ben-Chao Gong'],
    journal: 'Chinese Physics Letters',
    year: 2026,
    doi: '10.1088/0256-307X/43/1/010711',
    abstract: 'Interfacial superconductivity (IS) has been a topic of intense interest in condensed matter physics, due to its unique properties and exotic photoelectrical performance. However, there are few reports about IS systems consisting of two insulators. Here, motivated by the emergence of an insulator-metal transition in the type-III heterostructure and the superconductivity in some “special” two-dimensional (2D) semiconductors via electron doping, we predict that 2D heterostructure SnSe₂/PtTe₂ is a model system for realizing IS by using first-principles calculations. Our results show that due to the slight but crucial interlayer charge transfer, SnSe₂/PtTe₂ turns to be a type-III heterostructure with metallic properties and shows a superconducting transition with the critical temperature (Tᶜ) of 3.73 K. Similar to the enhanced electron-phonon coupling (EPC) in the electron-doped SnSe₂ monolayer, the IS in the heterostructure SnSe₂/PtTe₂ mainly originates from the metallized SnSe₂ layer. Furthermore, we find that the superconductivity is sensitive to tensile lattice strain, forming a dome-shaped superconducting phase diagram. Remarkably, at 7% tensile strain, the superconducting Tᶜ can increase more than twofold (8.80 K), resulting from the softened acoustic phonon at the M point and the enhanced EPC strength. Our study provides a concrete example for realizing IS in the type-III heterostructure, which waits for future experimental verification.',
    sourceVersion: 'Author preprint, arXiv:2502.13690v1; the canonical article identity remains the CPL DOI.',
  },
  'bilayer-cote2-superconductivity': {
    authors: ['Wenping Chen', 'Ziyun Zhang', 'Feipeng Zheng'],
    journal: 'Physical Review B',
    year: 2026,
    doi: '10.1103/l89c-t2s4',
    abstract: 'Interlayer coupling plays a critical role in van der Waals materials by governing lattice stability and emergent quantum phases, yet its impact on few-layer hexagonal CoTe₂ remains unclear. Here, using first-principles calculations, we systematically investigate monolayer and bilayer CoTe₂ with an emphasis on their electronic structures, lattice dynamics, and electron-phonon coupling, and elucidate the underlying mechanisms driven by interlayer interactions. Our results show that monolayer CoTe₂ exhibits pronounced dynamical instability at low temperatures, whereas interlayer coupling stabilizes the bilayer crystal structure and gives rise to phonon-mediated superconductivity with a predicted critical temperature of about 4.7 K when spin-orbit coupling is included. The stabilization and superconductivity in bilayer CoTe₂ are primarily attributed to interlayer-coupling-induced Te-pz charge redistribution and the associated modification of the Fermi surface and electron-phonon coupling. Finally, we discuss how spin-orbit coupling in bilayer CoTe₂ weakens the EPC and superconductivity. Our work clarifies how interlayer coupling can jointly tune structural stability and superconductivity in few-layer CoTe₂, providing insights for engineering quantum phases in layered transition-metal dichalcogenides.',
    sourceVersion: 'Author preprint; the canonical article identity is Physical Review B 114, 055413 (2026).',
  },
  'electron-doped-hfncl-superconductivity': {
    authors: ['Betül Pamuk', 'Francesco Mauri', 'Matteo Calandra'],
    journal: 'Physical Review B',
    year: 2017,
    doi: '10.1103/PhysRevB.96.024518',
  },
  'cu2n-electron-phonon-topology': {
    authors: ['Guang-ren Na', 'Meng-hui Wang', 'Rui Bian', 'Zhong-hua Cui'],
    journal: 'Physical Review B',
    year: 2025,
    doi: '10.1103/t7nc-p31n',
    abstract: 'Two-dimensional materials with intrinsic superconductivity and nontrivial topology represent a frontier for discovering exotic quantum states and potential applications in quantum devices. Here, we report the first comprehensive theoretical investigation of superconductivity in monolayer and bilayer Cu₂N. The monolayer Cu₂N has been recently synthesized experimentally and features a unique checkerboard lattice with topological nodal lines. Following this experimental breakthrough, we predict phonon-mediated superconductivity with transition temperatures (Tᶜ) of 3.8 K (monolayer) and 7.9 K (bilayer) arising from strong electron-phonon coupling (λ=0.76 and 0.84, respectively) mediated primarily by Cu d-orbitals and low-frequency phonon modes. The bilayer shows 84% Tᶜ enhancement through additional interlayer vibrational modes that strengthen Cu d-orbital coupling via enhanced out-of-plane vibrations. Strain engineering enhances monolayer Tᶜ to 4.5 K under 0.2% compressive strain through optimized electronic density of states and phonon softening. We identify a practical synthesis pathway involving multilayer growth followed by controlled exfoliation with moderate energy cost (0.97 J/m²). Our results demonstrate that Cu₂N, featuring coexisting topological nodal lines and phonon-mediated superconductivity, represents a promising experimental platform for investigating potential topological superconducting behavior in accessible two-dimensional systems.',
    sourceVersion: 'Published journal PDF.',
  },
  'fese-srtio3-interfacial-mode-coupling': {
    authors: ['J. J. Lee', 'F. T. Schmitt', 'R. G. Moore', 'S. Johnston', 'Y.-T. Cui', 'W. Li', 'M. Yi', 'Z. K. Liu', 'M. Hashimoto', 'Y. Zhang', 'D. H. Lu', 'T. P. Devereaux', 'D.-H. Lee', 'Z.-X. Shen'],
    journal: 'Nature',
    year: 2014,
    doi: '10.1038/nature13894',
  },
  'wannier-electron-phonon-interaction': {
    authors: ['Feliciano Giustino', 'Marvin L. Cohen', 'Steven G. Louie'],
    journal: 'Physical Review B',
    year: 2007,
    doi: '10.1103/PhysRevB.76.165108',
  },
  'cross-dimensional-electron-phonon-coupling': {
    authors: ['Miao-Ling Lin', 'Yu Zhou', 'Jiang-Bin Wu', 'Xin Cong', 'Xue-Lu Liu', 'Jun Zhang', 'Hai Li', 'Wang Yao', 'Ping-Heng Tan'],
    journal: 'Nature Communications',
    year: 2019,
    doi: '10.1038/s41467-019-10400-z',
    abstract: 'The electron-phonon coupling (EPC) in a material is at the frontier of the fundamental research, underlying many quantum behaviors. van der Waals heterostructures (vdWHs) provide an ideal platform to reveal the intrinsic interaction between their electrons and phonons. In particular, the flexible van der Waals stacking of different atomic crystals leads to multiple opportunities to engineer the interlayer phonon modes for EPC. Here, in hBN/WS₂ vdWH, we report the strong cross-dimensional coupling between the layer-breathing phonons well extended over tens to hundreds of layer thick vdWH and the electrons localized within the few-layer WS₂ constituent. The strength of such cross-dimensional EPC can be well reproduced by a microscopic picture through the mediation by the interfacial coupling and also the interlayer bond polarizability model in vdWHs. The study on cross-dimensional EPC paves the way to manipulate the interaction between electrons and phonons in various vdWHs by interfacial engineering for possible interesting physical phenomena.',
    sourceVersion: 'Published journal PDF.',
  },
  'nbse2-stacking-superconductivity-cdw': {
    authors: ['Sandra Sajan', 'Xinze Yang', 'Haojie Guo', 'Tarushi Agarwal', 'Samuel Mañas-Valero', 'Carla Boix-Constant', 'Eugenio Coronado', 'Fernando de Juan', 'Eduardo H. da Silva Neto', 'Ravi P. Singh', 'Maria N. Gastiasoro', 'Miguel M. Ugeda'],
    journal: 'arXiv',
    year: 2026,
    doi: '10.48550/arXiv.2607.20335',
    abstract: 'Layer stacking provides a powerful yet underexplored route for reshaping collective quantum order in van der Waals materials. Here we use high-resolution scanning tunneling microscopy and spectroscopy to show that the stacking sequence alone can qualitatively transform the charge density and superconducting orders in NbSe₂, while preserving the same in-plane atomic structure. Comparing the 4Ha and 2H polytypes, we find that, unlike the ubiquitous triangular incommensurate 3Qᴵ order of 2H-NbSe₂, 4Ha-NbSe₂ hosts two competing CDW states with no measurable correlation with local strain: a unidirectional commensurate 1Qᶜ phase and a triangular incommensurate 3Qᴵ phase, with Qᴵ = Qᶜ + δ. We introduce a phase-resolved analysis that directly maps the gradient of the CDW phases and reveals vortices bound to the 1Qᶜ–3Qᴵ phase boundaries. These vortices accommodate the momentum mismatch δ through abrupt 2π phase slips, providing a mechanism by which distinct charge orders coexist. Superconductivity is also reshaped by stacking, while both polytypes exhibit multiband pairing.',
    sourceVersion: 'arXiv:2607.20335 preprint; no later publication identity is asserted.',
  },
  'functionalized-double-mxene-superconductivity': {
    authors: ['Mohammad Keivanloo', 'Fateme Dinmohammad', 'Shashi B. Mishra', 'Mohammad Sandoghchi', 'Mohammad Javad Arshia', 'Mitsuaki Kawamura', 'Elena R. Margine', 'Muhammad Haris Mahyuddin', 'Hannes Raebiger', 'Reza Pamungkas Putra Sukanli', 'Kenta Hongo', 'Ryo Maezono', 'Mohammad Khazaei'],
    journal: 'npj Computational Materials',
    year: 2026,
    doi: '10.1038/s41524-026-02245-0',
    abstract: 'Two-dimensional (2D) superconductors attracted growing interest in condensed matter physics research. In this work, we explore the superconducting properties of surface-functionalized, out-of-plane ordered double transition-metal MXenes (o-MXenes), which exhibit distinctive structural and electronic characteristics. Using first-principles calculations, we investigate the effects of electronic structure, electron–phonon coupling (EPC), anharmonicity, and anisotropy effect in superconductivity properties of o-MXenes. We examine a wide range of o-MXene systems, M₂M′X₂T₂ (M = Mo, W; M′ = Sc, Ti, V, Mo, Zr, Nb, Ta; X = C, N), functionalized with F, O, Cl, and H groups. Out of 128 candidates, 32 compounds are found to be mechanically, dynamically, and thermodynamically stable, exhibiting superconducting transition temperatures (Tᶜ) from 0.1 K to 52 K. Notably, Mo₂ScN₂O₂ exhibits the highest predicted Tᶜ of 52 K and anisotropic two-gap superconductivity, with a weaker gap near 8–9 meV and a larger gap above 10.5 meV; incorporating anharmonic effects decreases its Tᶜ slightly. We further analyze flat-band-induced EPC enhancement and present EPC matrix elements as functions of phonon wavevector q for distinct vibrational modes that show anharmonic behavior of these materials.',
    sourceVersion: 'Formal npj Computational Materials article-in-press PDF.',
  },
  'layered-dihalides-trihalides-structures': {
    authors: ['Michael A. McGuire'],
    journal: 'Crystals',
    year: 2017,
    doi: '10.3390/cryst7050121',
    abstract: 'Materials composed of two dimensional layers bonded to one another through weak van der Waals interactions often exhibit strongly anisotropic behaviors and can be cleaved into very thin specimens and sometimes into monolayer crystals. Interest in such materials is driven by the study of low dimensional physics and the design of functional heterostructures. Binary compounds with the compositions MX₂ and MX₃ where M is a metal cation and X is a halogen anion often form such structures. Magnetism can be incorporated by choosing a transition metal with a partially filled d-shell for M, enabling ferroic responses for enhanced functionality. Here a brief overview of binary transition metal dihalides and trihalides is given, summarizing their crystallographic properties and long-range-ordered magnetic structures, focusing on those materials with layered crystal structures and partially filled d-shells required for combining low dimensionality and cleavability with magnetism.',
    sourceVersion: 'Author preprint, arXiv:1704.08225v1; the canonical article identity remains the Crystals DOI.',
  },
  'trigonal-symmetry-breaking-dihalides-trihalides': {
    authors: ['Alexandru B. Georgescu', 'Andrew J. Millis', 'James M. Rondinelli'],
    journal: 'Physical Review B',
    year: 2022,
    doi: '10.1103/PhysRevB.105.245153',
    abstract: 'We study the consequences of the approximately trigonal (D₃d) point symmetry of the transition metal (M) site in two-dimensional van der Waals MX₂ dihalides and MX₃ trihalides. The trigonal symmetry leads to a 2-2-1 orbital splitting of the transition metal d shell, which is best represented by d-orbitals that describe the trigonal – rather than Oₕ symmetry. The ligand-ligand bond length differences (rather than metal-ligand) take the role of a Jahn-Teller-like mode, and in combination with interlayer distances and dimensionality effects tune the crystal field splittings and bandwidths. These effects, in turn, are amplified by electronic correlation effects – leading to crystal field splittings of the order of 0.1–1 eV between the singlet and the lowest orbital doublet – as opposed to the often assumed degenerate 3 t₂g states. Our calculations explain why most of the materials in this family are insulating, and why these considerations have to be taken into account in realistic models of them. Further, orbital order coupled to various lower symmetry lattice modes may lift the remaining orbital degeneracies, and we explain how these may support unique electronic states using ZrI₂ and CuCl₂ as examples, and offer a brief overview of possible electronic configurations in this class of materials. By building and analysing Wannier models adapted to the appropriate symmetry we examine how the interplay among trigonal symmetry, electronic correlation effects, and p-d orbital charge transfer leads to insulating, orbitally polarized magnetic and/or orbital-selective Mott states, and we provide a simple framework and numerical tool for others. Our work establishes a rigorous framework to understand, control, and tune the electronic states in low-dimensional correlated halides. Our analysis shows that trigonal symmetry and its breaking is a key feature of the 2D halides that needs to be accounted for in search of novel electronic states in materials ranging from CrI₃ to α-RuCl₃.',
    sourceVersion: 'Author manuscript; the canonical article identity remains the PRB DOI.',
  },
};

const preReadingPapers: LiteraturePaper[] = literaturePreprocessingQueue.map((entry) => {
  const metadata = preReadingMetadataById[entry.paper_id];
  if (!metadata) throw new Error(`Missing preprocessing metadata: ${entry.paper_id}`);
  return {
    id: entry.paper_id,
    topicId: entry.target_literature_topic,
    title: entry.canonical_title,
    ...metadata,
    href: entry.source_status === 'source_ready'
      ? `/reading/literature/${entry.target_literature_topic}/${entry.atlas_slug}/`
      : `https://doi.org/${metadata.doi}`,
    impactFactor: { value: null, year: null, source: '' },
    readerState: 'pre_reading',
  };
});

export const literaturePapers: LiteraturePaper[] = [
  {
    id: 'hbn-sin-superconductivity-cdw',
    topicId: 'electron-phonon-superconductivity',
    title: 'Prediction of superconductivity and charge density wave in monolayer h-BN via functionalization with Si-N layer',
    authors: ['Shu-Ying Shang', 'Shu-Xiang Qiao', 'Yu-Lin Han', 'Kai-Yue Jiang', 'Na Jiao', 'Ping Zhang', 'Hong-Yan Lu'],
    journal: 'Physical Review B',
    year: 2026,
    doi: '10.1103/jmys-zkgs',
    href: '/reading/literature/electron-phonon-superconductivity/hbn-sin-superconductivity-cdw/',
    abstract: 'Inspired by the successful synthesis of two-dimensional (2D) MoSi₂N₄ and WSi₂N₄, which demonstrates that Si-N layers can act as effective modification layers on 2D materials, we investigate superconductivity and charge density waves (CDWs) of hexagonal boron nitride (h-BN) passivated with a Si-N layer based on first-principles calculations. Our results demonstrate that h-BN undergoes a transition from an insulator to a phonon-mediated superconductor with the transition temperature (T₍c₎) of 14.3 K when it is functionalized with a Si-N layer on one side. The electron-phonon coupling (EPC) of BN₂Si is primarily attributed to the coupling between electrons in N-pz orbitals and the low-frequency in-plane vibrational modes of Si and N atoms, as well as higher-frequency out-of-plane vibration modes of N and B atoms. By applying 5% biaxial tensile strain, the EPC constant λ increases from 0.66 to 1.82, resulting in a significantly enhanced T₍c₎ of 34.9 K. However, when the biaxial tensile strain reaches 6%, an obvious soft mode emerges in the lowest acoustic branch of phonon curves, indicating the presence of a CDW. The origin of the instabilities is analyzed based on Lindhard electron susceptibility and the phonon linewidths, revealing that the CDW is driven by both Fermi-surface nesting and EPC. Thus, the predicted BN₂Si presents a promising platform for exploring 2D superconductivity and CDWs.',
    impactFactor: { value: null, year: null, source: 'https://journals.aps.org/prb/' },
    readerState: 'complete_reader',
  },
  ...preReadingPapers,
];

export const papersByTopic = Object.fromEntries(
  literaturePapers.map((paper) => [paper.topicId, [] as LiteraturePaper[]]),
) as Record<string, LiteraturePaper[]>;

for (const paper of literaturePapers) {
  (papersByTopic[paper.topicId] ??= []).push(paper);
}

export const literaturePaperById = Object.fromEntries(
  literaturePapers.map((paper) => [paper.id, paper]),
) as Record<string, LiteraturePaper>;
