export const methodPageContract = {
  required: ['id', 'nameZh', 'nameEn', 'route', 'responsibility'],
  relevantWhenApplicable: ['problem', 'basis', 'inputs', 'outputs', 'conditions', 'numericalRequirements', 'misuse', 'claimBoundary', 'resources'],
  excluded: ['paperIds', 'paperReadingNotes', 'claimLedger', 'privateResults', 'dynamicPaperLists'],
};

export const methodCategories = [
  ['structural-methods', '结构方法', 'Structural Methods', '结构表示、生成、比较与弛豫策略。'],
  ['electronic-structure-analysis', '电子结构分析', 'Electronic Structure Analysis', '能带、态密度、电荷与轨道等电子结构表征。'],
  ['stability-analysis', '稳定性分析', 'Stability Analysis', '区分力学、动力学、热力学与有限温度稳定性证据。'],
  ['lattice-dynamics', '晶格动力学', 'Lattice Dynamics', '声子、振动与电子-声子相关方法。'],
  ['magnetic-methods', '磁性方法', 'Magnetic Methods', '磁序、磁各向异性与磁激发的建模和判据。'],
  ['surface-interface-methods', '表面与界面方法', 'Surface and Interface Methods', '低维、表面、界面与吸附问题的方法边界。'],
  ['defect-methods', '缺陷方法', 'Defect Methods', '缺陷构型、形成能、有限尺寸与电荷修正。'],
  ['transport-methods', '输运方法', 'Transport Methods', '电子与热输运的模型、输入及适用条件。'],
  ['superconductivity-methods', '超导方法', 'Superconductivity Methods', '超导相关观测量、近似与证据边界。'],
  ['advanced-methods', '高级方法', 'Advanced Methods', '超出基础平均场框架的方法及其适用范围。'],
].map(([id, nameZh, nameEn, responsibility]) => ({
  id: `method-category:${id}`,
  nameZh, nameEn, responsibility,
  route: `/methods/#${id}`,
  entries: [],
  contentState: 'foundation',
}));

export default methodCategories;
