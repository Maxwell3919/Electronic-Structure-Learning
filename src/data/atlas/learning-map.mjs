export const learningMapVersion = '2026-08-02.foundation.1';

const node = (id, nameZh, nameEn, domain, type, definition, courseIds, topicIds = []) => ({
  id, nameZh, nameEn, domain, type, definition, courseIds, topicIds,
  basis: 'Atlas v3 representative editorial model; requires topic-level source review before expansion.',
  version: learningMapVersion,
});

export const learningMapNodes = [
  node('concept:lattice-vector', '晶格向量', 'Lattice vector', 'physics', 'concept', '描述晶格平移的向量。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:lattice', '晶格', 'Lattice', 'physics', 'concept', '由离散平移生成的周期点集。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:crystal-structure', '晶体结构', 'Crystal structure', 'physics', 'concept', '晶格与基元共同给出的周期结构。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:symmetry', '对称性', 'Symmetry', 'physics', 'concept', '保持研究对象相应性质不变的变换关系。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:reciprocal-space', '倒空间', 'Reciprocal space', 'physics', 'concept', '用于表示周期函数与晶格平移的对偶空间。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:brillouin-zone', '布里渊区', 'Brillouin zone', 'physics', 'concept', '倒格子的 Wigner–Seitz 原胞。', ['course:solid-state-physics'], ['topic:periodic-solids']),
  node('concept:bloch-theorem', 'Bloch 定理', 'Bloch theorem', 'electronic-structure', 'theorem', '周期势中单粒子本征态的平移结构。', ['course:quantum-mechanics', 'course:solid-state-physics'], ['topic:periodic-solids', 'topic:electronic-bands']),
  node('concept:electronic-band', '能带', 'Electronic band', 'electronic-structure', 'concept', '周期体系中随晶体动量变化的能量分支。', ['course:solid-state-physics'], ['topic:electronic-bands']),
  node('concept:linear-algebra', '线性代数', 'Linear algebra', 'mathematics', 'course-bridge', '向量空间、线性映射与谱问题的课程级入口。', ['course:linear-algebra']),
  node('concept:linear-operator', '线性算符', 'Linear operator', 'mathematics', 'concept', '保持线性组合的映射。', ['course:linear-algebra']),
  node('concept:eigenproblem', '本征值问题', 'Eigenvalue problem', 'mathematics', 'problem', '寻找算符作用下仅按比例变化的状态。', ['course:linear-algebra', 'course:numerical-methods']),
  node('concept:schrodinger-equation', 'Schrödinger 方程', 'Schrodinger equation', 'physics', 'equation', '量子态及其动力学或定态谱的基本方程。', ['course:quantum-mechanics']),
  node('concept:kohn-sham-equation', 'Kohn–Sham 方程', 'Kohn–Sham equation', 'electronic-structure', 'equation', 'Kohn–Sham 辅助单粒子体系的自洽方程。', ['course:quantum-mechanics', 'course:numerical-methods'], ['topic:kohn-sham-system']),
];

const edge = (from, to, relation, explanation, strictness) => ({
  id: `${from}->${to}`,
  from, to, relation, explanation, strictness,
  basis: 'Representative Atlas v3 editorial dependency; not a claim of one mandatory curriculum.',
  version: learningMapVersion,
});

export const learningMapEdges = [
  edge('concept:lattice-vector', 'concept:lattice', 'concept-derived', '晶格向量生成晶格平移。', 'recommended-prerequisite'),
  edge('concept:lattice', 'concept:crystal-structure', 'concept-derived', '晶体结构在晶格上配置基元。', 'recommended-prerequisite'),
  edge('concept:crystal-structure', 'concept:symmetry', 'concept-derived', '结构对称性刻画保持晶体不变的操作。', 'recommended-prerequisite'),
  edge('concept:symmetry', 'concept:reciprocal-space', 'implementation-link', '周期性与对称性分析连接实空间和倒空间描述。', 'recommended-prerequisite'),
  edge('concept:reciprocal-space', 'concept:brillouin-zone', 'concept-derived', '第一布里渊区由倒格子构造。', 'strict-prerequisite'),
  edge('concept:brillouin-zone', 'concept:bloch-theorem', 'implementation-link', 'Bloch 态通常按布里渊区中的晶体动量组织。', 'recommended-prerequisite'),
  edge('concept:bloch-theorem', 'concept:electronic-band', 'concept-derived', 'Bloch 态的谱随晶体动量形成能带。', 'recommended-prerequisite'),
  edge('concept:linear-algebra', 'concept:linear-operator', 'concept-derived', '线性算符建立在线性空间之上。', 'strict-prerequisite'),
  edge('concept:linear-operator', 'concept:eigenproblem', 'concept-derived', '本征值问题以算符为对象。', 'strict-prerequisite'),
  edge('concept:eigenproblem', 'concept:schrodinger-equation', 'implementation-link', '定态 Schrödinger 方程可表述为本征值问题。', 'recommended-prerequisite'),
  edge('concept:schrodinger-equation', 'concept:kohn-sham-equation', 'concept-derived', 'Kohn–Sham 方程沿用辅助单粒子 Schrödinger 型问题。', 'recommended-prerequisite'),
];

export default { version: learningMapVersion, nodes: learningMapNodes, edges: learningMapEdges };
