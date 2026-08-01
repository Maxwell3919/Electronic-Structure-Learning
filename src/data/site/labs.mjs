export const labs = [
  ['lab-01-linux-qe', 'Linux 与 QE 环境', 'Linux and QE environment', '建立可追踪的运行环境入口', ['Quantum ESPRESSO']],
  ['lab-02-first-scf', '第一次 SCF', 'First SCF', '识别输入、输出和自洽状态', ['Quantum ESPRESSO', 'VASP']],
  ['lab-03-cutoff-convergence', 'cutoff 收敛', 'Cutoff convergence', '建立基组收敛检查框架', ['Quantum ESPRESSO', 'VASP']],
  ['lab-04-kpoints-smearing', 'k 点与展宽', 'k points and smearing', '区分采样与占据处理', ['Quantum ESPRESSO', 'VASP']],
  ['lab-05-relaxation-forces-stress', '结构优化、力与应力', 'Relaxation, forces, and stress', '分开程序终止与目标量收敛', ['Quantum ESPRESSO', 'VASP']],
  ['lab-06-bands-dos-pdos', 'Bands、DOS 与 PDOS', 'Bands, DOS, and PDOS', '记录路径、全 BZ、参考能与归一化', ['Quantum ESPRESSO', 'VASP']],
  ['lab-07-spin-soc', '自旋与 SOC', 'Spin and SOC', '登记磁性与相对论设置边界', ['Quantum ESPRESSO', 'VASP']],
  ['lab-08-phonons-dfpt', 'Phonons 与 DFPT', 'Phonons and DFPT', '登记声子与响应计算的前置门', ['Quantum ESPRESSO']],
  ['lab-09-wannier-epc-or-2d', 'Wannier、EPC 或二维专题', 'Wannier, EPC, or 2D topic', '为后续进阶实验保留受控入口', ['Quantum ESPRESSO', 'Wannier90']],
].map(([id, titleZh, titleEn, objective, software]) => ({
  id,
  titleZh,
  titleEn,
  objective,
  software,
  prerequisites: ['对应理论里程碑', '明确软件版本与数据身份'],
  relatedTheory: [],
  status: 'planned',
  route: `/labs/#${id}`,
}));

export default labs;

