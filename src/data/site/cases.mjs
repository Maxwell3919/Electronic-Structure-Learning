export const cases = [
  ['silicon', 'Silicon', 'Si', ['半导体结构与能带'], ['/learning-paths/first-real-calculation/'], ['lab-02-first-scf', 'lab-06-bands-dos-pdos']],
  ['aluminum', 'Aluminum', 'Al', ['金属采样与展宽'], ['/part-01-overview-and-background/chapter-04-periodic-solids-and-electron-bands/'], ['lab-04-kpoints-smearing']],
  ['magnesium-oxide', 'Magnesium oxide', 'MgO', ['离子固体与能隙证据边界'], ['/part-01-overview-and-background/chapter-02-overview/'], ['lab-03-cutoff-convergence', 'lab-06-bands-dos-pdos']],
  ['iron', 'Iron', 'Fe', ['磁性与自旋设置'], ['/part-01-overview-and-background/chapter-02-overview/'], ['lab-07-spin-soc']],
  ['graphene-or-mos2', 'Graphene or MoS2', '2D material', ['二维边界、采样与拓扑入口'], ['/part-05-properties-of-matter/chapter-22-surfaces-interfaces-and-lower-dimensional-systems/'], ['lab-04-kpoints-smearing', 'lab-09-wannier-epc-or-2d']],
  ['research-case-placeholder', 'Research case placeholder', 'Undecided', ['保留未来研究案例接口'], ['/learning-paths/properties-and-advanced-topics/'], []],
].map(([id, title, material, learningGoals, theoryLinks, labLinks]) => ({
  id,
  title,
  material,
  learningGoals,
  theoryLinks,
  labLinks,
  availableAssets: [],
  status: 'planned',
  route: `/cases/#${id}`,
}));

export default cases;

