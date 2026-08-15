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

type PreReadingMetadata = Pick<LiteraturePaper, 'authors' | 'journal' | 'year' | 'doi' | 'sourceVersion' | 'companionCorrections'>;

const preReadingMetadataById: Record<string, PreReadingMetadata> = {
  'stable-semiconducting-1t-prime-hfcl2-monolayer': {
    authors: ['Celso Alves Do Nascimento Júnior', 'Elie Albert Moujaes', 'Maurício Jeomar Piotrowski', 'Celso Ricardo Caldeira Rêgo', 'Diego Guedes-Sobrinho', 'Luiz Antônio Ribeiro Júnior', 'Teldo Anderson da Silva Pereira', 'Alexandre Cavalheiro Dias'],
    journal: 'ACS Omega',
    year: 2025,
    doi: '10.1021/acsomega.4c10560',
    sourceVersion: 'Records reading copy derived from the published Europe PMC JATS package; it is not the ACS typeset pagination.',
  },
  'hfx2-type-ii-photovoltaic-heterostructures': {
    authors: ['Xingyong Huang', 'Liujiang Zhou', 'Luo Yan', 'You Wang', 'Wei Zhang', 'Xiumin Xie', 'Qiang Xu', 'Hai-Zhi Song'],
    journal: 'Chinese Physics Letters',
    year: 2020,
    doi: '10.1088/0256-307X/37/12/127101',
    sourceVersion: 'Published journal PDF.',
  },
  'dfpt-phonons-crystal-properties': {
    authors: ['Stefano Baroni', 'Stefano de Gironcoli', 'Andrea Dal Corso', 'Paolo Giannozzi'],
    journal: 'Reviews of Modern Physics',
    year: 2001,
    doi: '10.1103/RevModPhys.73.515',
    sourceVersion: 'Published journal PDF.',
  },
  'electron-phonon-interactions-first-principles': {
    authors: ['Feliciano Giustino'],
    journal: 'Reviews of Modern Physics',
    year: 2017,
    doi: '10.1103/RevModPhys.89.015003',
    sourceVersion: 'Author preprint, arXiv:1603.06965v2; the canonical article identity remains the RMP DOI.',
    companionCorrections: [{ label: 'Erratum', doi: '10.1103/RevModPhys.91.019901' }],
  },
  'gated-2d-dfpt': {
    authors: ['Thibault Sohier', 'Matteo Calandra', 'Francesco Mauri'],
    journal: 'Physical Review B',
    year: 2017,
    doi: '10.1103/PhysRevB.96.075448',
    sourceVersion: 'Author preprint, arXiv:1705.04973v2; the canonical article identity remains the PRB DOI.',
  },
  'allen-dynes-transition-temperature': {
    authors: ['P. B. Allen', 'R. C. Dynes'],
    journal: 'Physical Review B',
    year: 1975,
    doi: '10.1103/PhysRevB.12.905',
    sourceVersion: 'Published journal PDF.',
  },
  'snse2-ptte2-interfacial-superconductivity': {
    authors: ['Jun Fan', 'Xiao-Le Qiu', 'Zhong-Yi Lu', 'Kai Liu', 'Ben-Chao Gong'],
    journal: 'Chinese Physics Letters',
    year: 2026,
    doi: '10.1088/0256-307X/43/1/010711',
    sourceVersion: 'Author preprint, arXiv:2502.13690v1; the canonical article identity remains the CPL DOI.',
  },
  'bilayer-cote2-superconductivity': {
    authors: ['Wenping Chen', 'Ziyun Zhang', 'Feipeng Zheng'],
    journal: 'Physical Review B',
    year: 2026,
    doi: '10.1103/l89c-t2s4',
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
    sourceVersion: 'Published journal PDF.',
  },
  'nbse2-stacking-superconductivity-cdw': {
    authors: ['Sandra Sajan', 'Xinze Yang', 'Haojie Guo', 'Tarushi Agarwal', 'Samuel Mañas-Valero', 'Carla Boix-Constant', 'Eugenio Coronado', 'Fernando de Juan', 'Eduardo H. da Silva Neto', 'Ravi P. Singh', 'Maria N. Gastiasoro', 'Miguel M. Ugeda'],
    journal: 'arXiv',
    year: 2026,
    doi: '10.48550/arXiv.2607.20335',
    sourceVersion: 'arXiv:2607.20335 preprint; no later publication identity is asserted.',
  },
  'functionalized-double-mxene-superconductivity': {
    authors: ['Mohammad Keivanloo', 'Fateme Dinmohammad', 'Shashi B. Mishra', 'Mohammad Sandoghchi', 'Mohammad Javad Arshia', 'Mitsuaki Kawamura', 'Elena R. Margine', 'Muhammad Haris Mahyuddin', 'Hannes Raebiger', 'Reza Pamungkas Putra Sukanli', 'Kenta Hongo', 'Ryo Maezono', 'Mohammad Khazaei'],
    journal: 'npj Computational Materials',
    year: 2026,
    doi: '10.1038/s41524-026-02245-0',
    sourceVersion: 'Formal npj Computational Materials article-in-press PDF.',
  },
  'layered-dihalides-trihalides-structures': {
    authors: ['Michael A. McGuire'],
    journal: 'Crystals',
    year: 2017,
    doi: '10.3390/cryst7050121',
    sourceVersion: 'Author preprint, arXiv:1704.08225v1; the canonical article identity remains the Crystals DOI.',
  },
  'trigonal-symmetry-breaking-dihalides-trihalides': {
    authors: ['Alexandru B. Georgescu', 'Andrew J. Millis', 'James M. Rondinelli'],
    journal: 'Physical Review B',
    year: 2022,
    doi: '10.1103/PhysRevB.105.245153',
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
      : undefined,
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
