export type ImpactFactor = {
  value: number | null;
  year: number | null;
  source: string;
};

export type LiteraturePaper = {
  id: string;
  topicId: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  href: string;
  abstract: string;
  impactFactor: ImpactFactor;
};

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
    impactFactor: {
      value: null,
      year: null,
      source: 'https://journals.aps.org/prb/',
    },
  },
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
