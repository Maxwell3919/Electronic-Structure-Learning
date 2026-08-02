export const toolKinds = ['package', 'program', 'workflow', 'visualization', 'database', 'auxiliary'];

export const computationalToolCategories = [
  ['dft-packages', 'DFT 软件包', 'DFT Packages', 'package'],
  ['workflow-frameworks', '工作流框架', 'Workflow Frameworks', 'workflow'],
  ['visualization-tools', '可视化工具', 'Visualization Tools', 'visualization'],
  ['databases', '数据库', 'Databases', 'database'],
  ['auxiliary-tools', '辅助工具', 'Auxiliary Tools', 'auxiliary'],
].map(([id, nameZh, nameEn, kind]) => ({ id: `tool-category:${id}`, nameZh, nameEn, kind, route: `/computational-tools/#${id}` }));

export const computationalTools = [
  {
    id: 'tool:quantum-espresso',
    kind: 'package',
    name: 'Quantum ESPRESSO',
    route: '/computational-tools/#quantum-espresso',
    categoryId: 'tool-category:dft-packages',
    scope: '代表性层级骨架；未复制版本敏感的官方手册内容。',
    programs: [
      ['pw-x', 'pw.x'],
      ['ph-x', 'ph.x'],
      ['epw', 'EPW'],
    ].map(([id, name]) => ({
      id: `program:qe-${id}`,
      kind: 'program',
      name,
      route: `/computational-tools/#qe-${id}`,
      sections: ['overview', 'input', 'output', 'validation-commands', 'common-errors'],
      contentState: 'planned',
    })),
  },
];

export const commandEvidenceContract = ['workingDirectory', 'targetFile', 'objectChecked', 'command', 'matchMeaning', 'passCriterion', 'failureMeaning', 'falsePositiveRisk', 'unsupportedClaims'];

export default computationalTools;
