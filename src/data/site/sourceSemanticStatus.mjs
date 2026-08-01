import martin from '../martin/index.mjs';

export const sourceSemanticAuditStatuses = [
  'not-audited',
  'structure-audited',
  'heading-corrected',
  'body-review-needed',
];

const titleZh = {
  '1': '引言',
  '2': '概览',
  '3': '理论背景',
  '4': '周期固体与电子能带',
  '5': '均匀电子气与 sp 成键金属',
  '6': '密度泛函理论：基础',
  '7': 'Kohn–Sham 辅助体系',
  '8': '交换与关联泛函 I',
  '9': '交换与关联泛函 II',
  '10': '原子的电子结构',
  '11': '赝势',
  '12': '平面波与网格：基础',
  '13': '平面波与实空间方法：完整计算',
  '14': '局域轨道：紧束缚',
  '15': '局域轨道：完整计算',
  '16': '增强函数：APW、KKR 与 MTO',
  '17': '增强函数：线性方法',
  '18': '局域性与线性标度 O(N) 方法',
  '19': '量子分子动力学',
  '20': '响应函数：声子与磁振子',
  '21': '激发谱与光学性质',
  '22': '表面、界面与低维体系',
  '23': 'Wannier 函数',
  '24': '极化、局域化与 Berry 相位',
  '25': '晶体电子结构的拓扑：导论',
  '26': '双能带模型：Berry 相位、绕数与拓扑',
  '27': '拓扑绝缘体 I：二维',
  '28': '拓扑绝缘体 II：三维',
  A: '泛函方程',
  B: 'LSDA 与 GGA 泛函',
  C: '绝热近似',
  D: '微扰理论、响应函数与 Green 函数',
  E: '介电函数与光学性质',
  F: '扩展体系中的 Coulomb 相互作用',
  G: '电子结构中的应力',
  H: '能量与应力密度',
  I: '力的其他表达式',
  J: '散射与相移',
  K: '常用关系与公式',
  L: '数值方法',
  M: '电子结构中的迭代方法',
  N: '双中心矩阵元：任意角动量 l 的表达式',
  O: 'Dirac 方程与自旋–轨道相互作用',
  P: 'Berry 相位、曲率与 Chern 数',
  Q: '量子 Hall 效应与边缘电导',
  R: '固体电子结构计算程序',
};

const headingCorrected = new Set(['3', '5', '13', '14', 'C', 'G']);
const bodyReviewNeeded = new Map([
  ['3', 'Review the remaining uses of “full nonrelativistic Hamiltonian” against the stated nonrelativistic Coulomb scope.'],
  ['13', 'Review “full calculation” wording outside the catalog title for representation and convergence scope.'],
  ['C', 'Review body-level “full Hamiltonian” wording against the stated electron–nuclear nonrelativistic model.'],
  ['G', 'Review stationarity and total-derivative wording across basis, grid, projector, and occupation terms.'],
]);

const flat = martin.parts.flatMap((part) => part.units.map((unit) => ({ part, unit })));

export const sourceSemanticStatus = flat.map(({ part, unit }, index) => {
  const next = flat[index + 1]?.unit;
  const end = next ? next.page - 1 : null;
  const unitId = part.number === 7
    ? `martin-appendix-${unit.id.toLowerCase()}`
    : `martin-chapter-${unit.id.padStart(2, '0')}`;
  const auditStatus = bodyReviewNeeded.has(unit.id)
    ? 'body-review-needed'
    : headingCorrected.has(unit.id) ? 'heading-corrected' : 'structure-audited';

  return {
    unitId,
    route: `/${part.slug}/${unit.slug}/`,
    sourceTitle: unit.title,
    sourceTitleZh: titleZh[unit.id],
    sourcePageRange: end ? `printed pp. ${unit.page}–${end}` : `printed p. ${unit.page} onward`,
    catalogSections: unit.sections.map((section) => ({ ...section })),
    renderedSourceSections: unit.sections.map((section) => section.id),
    headingHierarchyState: 'catalog-source-sections-separated',
    sourceLayerState: 'textbook-baseline-separated-from-exposition',
    strongClaimHeadingState: headingCorrected.has(unit.id) ? 'heading-corrected' : 'scoped-or-not-found',
    terminologyState: 'registry-linked',
    auditStatus,
    notes: bodyReviewNeeded.get(unit.id) ?? 'Structure audited; no body-level rewrite is authorized by this record.',
  };
});

export default sourceSemanticStatus;
