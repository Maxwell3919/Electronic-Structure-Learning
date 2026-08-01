const milestone = (id, titleZh, titleEn, href, status = 'available') => ({
  id,
  titleZh,
  titleEn,
  href,
  status,
});

export const learningPaths = [
  {
    id: 'dft-foundations',
    titleZh: 'DFT 理论入门',
    titleEn: 'DFT foundations',
    summaryZh: '从量子态和多电子问题进入 DFT、SCF 与周期体系表示。',
    summaryEn: 'Move from quantum states and many-electron problems to DFT, SCF, and periodic representations.',
    audience: ['初次系统学习电子结构与 DFT 的读者'],
    prerequisites: ['基础量子力学', '线性代数与微积分'],
    milestones: [
      milestone('quantum-electronic-structure', '量子态与电子结构问题', 'Quantum states and electronic structure', '/part-01-overview-and-background/chapter-01-introduction/'),
      milestone('many-electron-hamiltonian', '多电子 Hamiltonian', 'Many-electron Hamiltonian', '/part-01-overview-and-background/chapter-03-theoretical-background/'),
      milestone('bo-hartree-hf', 'Born–Oppenheimer / Hartree / Hartree–Fock', 'Born–Oppenheimer / Hartree / Hartree–Fock', '/part-01-overview-and-background/chapter-03-theoretical-background/'),
      milestone('hohenberg-kohn', 'Hohenberg–Kohn', 'Hohenberg–Kohn', '/part-02-density-functional-theory/chapter-06-density-functional-theory-foundations/'),
      milestone('kohn-sham', 'Kohn–Sham', 'Kohn–Sham', '/part-02-density-functional-theory/chapter-07-the-kohn-sham-auxiliary-system/'),
      milestone('exchange-correlation', '交换关联', 'Exchange and correlation', '/part-02-density-functional-theory/chapter-08-functionals-for-exchange-and-correlation-i/'),
      milestone('scf', 'SCF', 'SCF', '/part-02-density-functional-theory/chapter-07-the-kohn-sham-auxiliary-system/'),
      milestone('periodicity-bloch-bz', '周期性、Bloch 与 BZ', 'Periodicity, Bloch, and the BZ', '/part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/'),
      milestone('plane-waves-pseudopotentials', '平面波和赝势', 'Plane waves and pseudopotentials', '/part-04-determination-of-electronic-structure/chapter-12-plane-waves-and-grids-basics/'),
    ],
    status: 'available',
  },
  {
    id: 'first-real-calculation',
    titleZh: '第一次真实计算',
    titleEn: 'First real calculation',
    summaryZh: '按对象身份、离散、SCF、目标量和证据门组织未来实验准备。',
    summaryEn: 'Organize future lab preparation around identity, discretization, SCF, observables, and evidence gates.',
    audience: ['准备开始真实平面波 DFT 计算的读者'],
    prerequisites: ['完成 DFT 理论入门路线', '具备基础 Linux 命令能力'],
    milestones: [
      milestone('structure-boundaries', '结构与边界条件', 'Structure and boundary conditions', '/part-01-overview-and-background/chapter-02-overview/'),
      milestone('pseudopotential-identity', '赝势身份', 'Pseudopotential identity', '/part-03-important-preliminaries-on-atoms/chapter-11-pseudopotentials/'),
      milestone('plane-wave-cutoff', '平面波 cutoff', 'Plane-wave cutoff', '/part-04-determination-of-electronic-structure/chapter-12-plane-waves-and-grids-basics/'),
      milestone('k-points', 'k 点', 'k points', '/part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/'),
      milestone('calculation-scf', 'SCF', 'SCF', '/part-04-determination-of-electronic-structure/chapter-13-plane-waves-and-real-space-methods-full-calculations/'),
      milestone('relaxation', '结构优化', 'Structural relaxation', '/part-04-determination-of-electronic-structure/chapter-13-plane-waves-and-real-space-methods-full-calculations/'),
      milestone('bands', 'bands', 'Bands', '/part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/'),
      milestone('dos', 'DOS', 'DOS', '/part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/'),
      milestone('convergence-evidence', '收敛和证据边界', 'Convergence and evidence boundaries', '/reference/#convergence-checklists'),
    ],
    status: 'structured',
  },
  {
    id: 'properties-and-advanced-topics',
    titleZh: '材料性质与进阶专题',
    titleEn: 'Properties and advanced topics',
    summaryZh: '连接力、响应、界面、局域表示和拓扑等已存在理论入口。',
    summaryEn: 'Connect existing theory entries for forces, response, interfaces, localization, and topology.',
    audience: ['已经理解基础 DFT 与周期体系表示的读者'],
    prerequisites: ['完成 DFT 理论入门路线', '理解 SCF 与基础数值收敛'],
    milestones: [
      milestone('forces-md', '力和分子动力学', 'Forces and molecular dynamics', '/part-05-properties-of-matter/chapter-19-quantum-molecular-dynamics-qmd/'),
      milestone('phonon-dfpt', 'phonon / DFPT', 'Phonons / DFPT', '/part-05-properties-of-matter/chapter-20-response-functions-phonons-and-magnons/'),
      milestone('optical-response', '光学响应', 'Optical response', '/part-05-properties-of-matter/chapter-21-excitation-spectra-and-optical-properties/'),
      milestone('surfaces-interfaces', '表面与界面', 'Surfaces and interfaces', '/part-05-properties-of-matter/chapter-22-surfaces-interfaces-and-lower-dimensional-systems/'),
      milestone('wannier', 'Wannier', 'Wannier', '/part-05-properties-of-matter/chapter-23-wannier-functions/', 'outline'),
      milestone('berry-topology', 'Berry / topology', 'Berry / topology', '/part-06-electronic-structure-and-topology/chapter-25-topology-of-the-electronic-structure-of-a-crystal-introduction/'),
    ],
    status: 'structured',
  },
];

export default learningPaths;

