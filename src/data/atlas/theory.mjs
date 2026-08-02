export const theoryDomains = [
  {
    id: 'mathematical-foundations',
    nameZh: '数学基础',
    nameEn: 'Mathematical Foundations',
    route: '/theory/mathematical-foundations/',
    responsibility: '按课程组织电子结构研究所需的数学背景，不复制大学课程目录。',
    courses: [
      ['linear-algebra', '线性代数', 'Linear Algebra'],
      ['calculus', '微积分', 'Calculus'],
      ['differential-equations', '微分方程', 'Differential Equations'],
      ['numerical-methods', '数值方法', 'Numerical Methods'],
      ['probability-statistics', '概率与统计', 'Probability and Statistics'],
    ],
  },
  {
    id: 'physical-foundations',
    nameZh: '物理基础',
    nameEn: 'Physical Foundations',
    route: '/theory/physical-foundations/',
    responsibility: '连接电子结构理论所依赖的物理课程与概念，不规定唯一学习顺序。',
    courses: [
      ['classical-mechanics', '经典力学', 'Classical Mechanics'],
      ['electromagnetism', '电磁学', 'Electromagnetism'],
      ['quantum-mechanics', '量子力学', 'Quantum Mechanics'],
      ['statistical-mechanics', '统计力学', 'Statistical Mechanics'],
      ['solid-state-physics', '固体物理', 'Solid-State Physics'],
    ],
  },
  {
    id: 'chemical-foundations',
    nameZh: '化学基础',
    nameEn: 'Chemical Foundations',
    route: '/theory/chemical-foundations/',
    responsibility: '组织理解成键、结构与材料化学语境所需的课程级背景。',
    courses: [
      ['general-chemistry', '普通化学', 'General Chemistry'],
      ['physical-chemistry', '物理化学', 'Physical Chemistry'],
      ['inorganic-chemistry', '无机化学', 'Inorganic Chemistry'],
      ['quantum-chemistry', '量子化学', 'Quantum Chemistry'],
      ['materials-chemistry', '材料化学', 'Materials Chemistry'],
    ],
  },
].map((domain) => ({
  ...domain,
  courses: domain.courses.map(([id, nameZh, nameEn]) => ({
    id: `course:${id}`,
    nameZh,
    nameEn,
    route: `${domain.route}#${id}`,
    resourceState: 'planned',
    resources: [],
    conceptInterface: { nodeIds: [], learningMapRoute: '/theory/learning-map/' },
  })),
}));

export const electronicStructureTopics = [
  ['many-electron-problem', '多电子问题', 'Many-electron problem'],
  ['density-functional-theory', '密度泛函理论', 'Density-functional theory'],
  ['kohn-sham-system', 'Kohn–Sham 辅助系统', 'Kohn–Sham auxiliary system'],
  ['exchange-correlation', '交换-相关近似', 'Exchange-correlation approximations'],
  ['periodic-solids', '周期性固体', 'Periodic solids'],
  ['electronic-bands', '电子能带', 'Electronic bands'],
].map(([id, nameZh, nameEn]) => ({
  id: `topic:${id}`,
  nameZh,
  nameEn,
  route: `/theory/electronic-structure/#${id}`,
  scopeState: 'foundation',
}));

export default theoryDomains;
