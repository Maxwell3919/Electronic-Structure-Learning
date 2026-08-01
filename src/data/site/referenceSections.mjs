export const referenceSections = [
  ['glossary', '术语表', 'Glossary'],
  ['symbols-units', '符号与单位', 'Symbols and units'],
  ['software-parameter-map', '软件参数映射', 'Software parameter map'],
  ['pseudopotential-provenance', '赝势 provenance', 'Pseudopotential provenance'],
  ['convergence-checklists', '收敛检查清单', 'Convergence checklists'],
  ['failure-diagnostics', '失败诊断', 'Failure diagnostics'],
  ['appendices', 'Martin Appendices', 'Martin appendices'],
].map(([id, titleZh, titleEn]) => ({
  id,
  titleZh,
  titleEn,
  status: id === 'appendices' ? 'available' : 'planned',
  route: id === 'appendices' ? '/part-07-appendices/' : `/reference/#${id}`,
}));

export default referenceSections;

