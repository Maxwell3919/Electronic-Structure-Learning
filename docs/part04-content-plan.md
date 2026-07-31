# Part IV 内容规划：电子结构基本求解方法

状态：`active-plan`

基线：`Maxwell3919/Electronic-Structure-Learning@7e0a73d74322828f0626b7174aaa61f1677dbf98`

范围：Martin 第 2 版 Part IV，印刷页 259–408；Chapter 12–18。本文是网站原创内容的执行规划，不转录教材正文。

## 1. 来源定位与边界

### 1.1 主来源

- Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed.
  - Part IV overview：印刷页 259–261；
  - Chapter 12：262–280；练习始于 280；
  - Chapter 13：283–292；练习始于 293；
  - Chapter 14：295–315；练习始于 317；
  - Chapter 15：320–330；练习始于 331；
  - Chapter 16：332–360；练习始于 362；
  - Chapter 17：365–383；练习始于 385；
  - Chapter 18：386–407；练习始于 408。
- 直接相关附录：
  - Appendix F · Coulomb Interactions in Extended Systems，607–619；
  - Appendix J · Scattering and Phase Shifts，644–646；
  - Appendix K · Useful Relations and Formulas，647–650；
  - Appendix L · Numerical Methods，651–659；
  - Appendix M · Iterative Methods in Electronic Structure，661–676；
  - Appendix N · Two-Center Matrix Elements，677–678；
  - Appendix R · Codes for Electronic Structure Calculations for Solids，701–703。

### 1.2 实践交叉参考

Sholl–Steckel 仅用于实践层连接，不改变 Martin 的理论主线：

- Chapter 2 · DFT Calculations for Simple Solids，印刷页 35–47：周期结构、超胞、晶格参数和计算细节；
- Chapter 4 · DFT Calculations for Surfaces of Solids，83–109：表面边界条件、表面能、真空和吸附体系；
- Chapter 10 · Accuracy and Methods beyond “Standard” Calculations，209–225：数值精度、物理精度与泛函选择的区分。

### 1.3 版权和证据边界

- 允许公开：书目、章节/分节标题、印刷页码、原创概括、原创推导、原创图形、原创练习。
- 不进入仓库：教材 PDF、扫描页、教材图表复刻、习题原文、答案、大段连续翻译。
- `【Martin 原书 | Martin source】` 只表示该节的组织和主题由原书直接支持。
- `【补充推导 | Supplemental derivation】` 是为补足中间数学步骤而写的原创推导。
- `【原创教学模型 | Original teaching model】` 只验证声明的简化模型，不代表实际材料或生产 DFT。
- 软件版本、输入参数和当前功能必须在对应章节写作时以官方文档重新核验。

## 2. Part IV 的统一数学框架

```text
连续独立粒子问题
H ψ = ε ψ
        │
        ├── 选择表示空间：平面波、实空间网格、原子中心轨道、增强函数
        ├── 选择边界条件：周期、孤立、表面/界面超胞、开放边界近似
        └── 选择核附近处理：赝势、PAW、全电子增强、局域原子函数
        ↓
有限表示或离散算子
H c = ε S c
或 Green's-function / density-matrix 方程
        ↓
本征求解、迭代子空间、递归、稀疏矩阵或多重散射
        ↓
构造 n(r)、ρ(r,r') 或 G(E)
        ↓
进入 Kohn–Sham 自洽循环
        ↓
分别检查
表示误差 / 离散误差 / 边界误差 / 求解器误差 / SCF 误差
        ↓
检查目标 observable 的收敛与科学解释边界
```

所有方法在相同 Hamiltonian、边界条件和收敛极限下应描述同一个独立粒子问题。实际差异来自有限表示、核附近处理、矩阵结构、算法和误差控制。程序退出、残差下降、SCF 收敛、总能收敛、力收敛以及目标 observable 收敛分别构成不同判定门。

## 3. 贯穿七章的对象与符号

| 对象 | 统一符号 | 说明 |
|---|---|---|
| 连续 Hamiltonian | `\hat H` | 作用于给定函数空间的算符；与有限矩阵分开书写 |
| 有限 Hamiltonian matrix | `H_{\mu\nu}` 或 `H_{GG'}` | 由基函数或离散点定义 |
| overlap matrix | `S_{\mu\nu}` | 非正交基中的度量；正交基时为单位矩阵 |
| 波函数 | `\psi_{n\mathbf k}(\mathbf r)` | 物理/辅助单粒子态，需说明归一化体积 |
| cell-periodic function | `u_{n\mathbf k}(\mathbf r)` | 满足晶格周期性 |
| 展开系数 | `c_{\mu n}(\mathbf k)`、`c_{n\mathbf k}(\mathbf G)` | 与波函数、基函数分开 |
| 密度 | `n(\mathbf r)` | 占据态的局域对角量 |
| 密度矩阵 | `\rho(\mathbf r,\mathbf r')` 或 `P_{\mu\nu}` | Chapter 15、18 的核心对象 |
| Green’s function | `G(z)=(zS-H)^{-1}` | 非正交情形必须保留 `S` |
| residual | `r_n=Hc_n-\varepsilon_nSc_n` | 求解器收敛量，不自动代表 observable 收敛 |
| 基组/离散参数 | `E_cut`、`h`、`R_c`、`l_max` | 必须给单位、单调性和适用范围 |

单位约定：推导默认使用 Hartree atomic units 时明确说明 `\hbar=m_e=e=4\pi\epsilon_0=1`；涉及实验或输入参数时给出 eV、bohr、Å 等转换语境，不混用未声明单位。

## 4. 七章知识依赖和边界

### Chapter 12 · Plane Waves and Grids: Basics

来源：262–280；§§12.1–12.9。

任务：建立表示与离散的基础。从周期边界条件、Fourier 展开和平面波矩阵开始，推导 Bloch 形式和能带；用近自由电子二态模型解释 Bragg 面附近的能隙；把原子 form factor 与晶体 structure factor 分离；说明经验赝势如何连接弱散射与能带；最后进入密度网格、FFT、有限差分、DG、有限元、wavelet 和自适应坐标。

不在本章完成：第一性原理赝势的完整 SCF 工作流、PAW、混合泛函和超胞实践；这些属于 Chapter 13。

主要推导：

1. 周期盒中平面波正交归一与离散波矢；
2. `H_{GG'}(k)` 的动能对角项和势能卷积项；
3. Bloch theorem、`k` 与 `k+G` 等价、BZ 平均；
4. Bragg 条件附近 `2×2` Hamiltonian、avoided crossing 和 `2|V_G|` 能隙；
5. `V(G)=Σ_κ S_κ(G)v_κ(G)`；
6. 波函数 cutoff、密度 Fourier support 与 FFT grid 的关系；
7. 二阶中心差分及 `O(h²)` 截断误差；高阶 stencil 的一般边界；
8. Nyquist 波矢、aliasing 和边界条件。

首批可视化：

- 平面波叠加与 Fourier 截断；
- 近自由电子两态能隙；
- 结构因子相消/增强；
- 有限差分 Laplacian 色散误差。

### Chapter 13 · Plane Waves and Real-Space Methods: Full Calculations

来源：283–292；§§13.1–13.7。

任务：把 Chapter 12 的表示层嵌入自洽 Kohn–Sham 计算。覆盖第一性原理赝势 Hamiltonian、局域/非局域项、FFT 数据流、迭代本征求解、dielectric screening 与 mixing、PAW、平面波 exact exchange、超胞、表面/界面/缺陷、孤立体系和应用验证。

不重复：Chapter 11 的赝势生成理论；Chapter 19 的完整分子动力学算法。

主要推导：

- density-to-potential-to-orbitals 的 SCF 映射与 residual；
- `δn_out=χ₀δV_eff`、Jacobian/dielectric matrix 与 mixing 稳定性；
- nonlocal projector 作用；
- 周期 Coulomb kernel 和 exact exchange 的 occupied-state sum；
- supercell 中 image interaction、k folding 和有限尺寸误差。

可视化：FFT/SCF 数据流、charge sloshing、preconditioner、slab image、k folding、cutoff/k mesh/cell-size 三轴收敛。

### Chapter 14 · Localized Orbitals: Tight-Binding

来源：295–315；§§14.1–14.12。

任务：建立局域轨道模型、矩阵元和物理直觉。覆盖非正交 Bloch sums、Slater–Koster、单带/双带模型、graphene、nanotube、CuO₂、半导体/过渡金属、SOC、模型总能/力/应力及 transferability。

不在本章完成：全自洽 Gaussian/numerical-orbital Kohn–Sham 实现；属于 Chapter 15。

主要推导：`H(k)c=εS(k)c`、归一化、Löwdin 极限、单带色散、双带本征值、graphene `f(k)`、Dirac 展开、Slater–Koster 方向余弦。

### Chapter 15 · Localized Orbitals: Full Calculations

来源：320–330；§§15.1–15.8。

任务：进入非正交局域基的全计算。覆盖 Gaussian、numerical atomic orbitals、basis confinement/completeness、density matrix、总能、Pulay force/stress、Green’s function、recursion、mixed basis 和 BSSE。

主要推导：广义本征问题、`P_{μν}` 与 `n(r)`、overlap derivative、Pulay 项、resolvent 与 local DOS、Lanczos/continued fraction。

### Chapter 16 · Augmented Functions: APW, KKR, MTO

来源：332–360；§§16.1–16.8。

任务：用空间分区和散射理论处理核附近快速变化。覆盖 muffin-tin sphere/interstitial、APW 匹配与非线性本征值问题、KKR 多重散射、t matrix、structure constants、CPA、MTO、canonical bands 和增强方法中的能量/力/压力。

主要推导：APW 球内外基函数、边界匹配、logarithmic derivative、KKR determinant、Dyson equation、single-site CPA 条件、MTO head/tail。

### Chapter 17 · Augmented Functions: Linear Methods

来源：365–383；§§17.1–17.10。

任务：把能量依赖基函数在参考能量附近线性化，得到标准 Hamiltonian/overlap secular equation。覆盖 `u_l`、`\dot u_l`、LAPW、local orbitals、LMTO、tight-binding LMTO、NMTO 和 full-potential。

主要推导：radial equation 对能量求导、Taylor 线性化、匹配系数、linearization error、LAPW 与 APW 的方程结构差别。

### Chapter 18 · Locality and Linear-Scaling O(N) Methods

来源：386–407；§§18.1–18.9。

任务：把求解对象从全部本征态转向局域密度矩阵或局域轨道。覆盖计算阶段的独立标度、nearsightedness、稀疏 Hamiltonian、非变分方法、density-matrix minimization/purification、generalized Wannier functions、linear-scaling SCF、factorized density matrix 和方法组合。

主要推导：密度矩阵 projector/idempotency、绝缘体/金属/有限温度衰减、purification eigenvalue map、trace/idempotency 约束、稀疏截断误差与 variational boundary。

## 5. 方法间 crosswalk

| 维度 | 平面波/均匀网格 | 局域轨道 | APW/KKR/MTO | 线性标度变体 |
|---|---|---|---|---|
| 表示 | 全空间平滑 Fourier 或点值 | 原子中心有限支撑/衰减函数 | 球内原子解 + 间隙区平滑函数/散射解 | 任一局域表示上的稀疏对象 |
| overlap | 平面波通常正交；FE/DG 可非正交 | 通常非正交 | 线性化后通常为广义本征问题 | 依方法保留或消去 `S` |
| 矩阵 | 动能对角、势能一般稠密；FFT 避免显式构造 | 局域时稀疏 | APW 基较全局；KKR 用 Green’s function/结构常数 | 强制稀疏与局域截断 |
| 系统可收敛 | plane-wave cutoff/FE polynomial order 可系统提高 | 依赖基组层级和 confinement，通常更难证明完备 | cutoff、`l_max`、sphere radius、linearization energy | 截断半径与稀疏阈值增加到常规解极限 |
| 核附近 | 通常赝势/PAW；全电子网格需局部细化 | 原子函数直接承载快速变化 | 核附近是方法设计核心 | 继承母方法 |
| 真空 | 均匀平面波成本高；自适应网格较有利 | 有限支撑基通常较省 | 依具体边界和实现 | 大体系达到 crossover 后才可能有利 |
| 主要误差 | cutoff、grid、aliasing、supercell、k mesh | completeness、BSSE、Pulay、confinement | sphere、`l_max`、potential shape、linearization | localization/truncation、金属性、温度、稀疏代数 |

跨章比较表只在各章完成后写入已经论证的列，不预填未经正文支持的“优劣排序”。

## 6. 可视化统一合同

每个 Part IV 交互模型必须包含：

1. 明确的教学问题；
2. 解析模型或确定性算法；
3. 输入名称、范围、默认值和单位；
4. 输出 observable 和参考零点；
5. 至少一个解析极限；
6. 至少一个数值回归情形；
7. 键盘可操作控件和 `aria-label`；
8. JavaScript 关闭时可读的静态 SVG 或语义 HTML；
9. 与真实 DFT、具体材料和生产代码的边界；
10. 不从视觉相似性推导科学结论。

Chapter 12 的教学模型只使用无材料身份的无量纲一维/二维解析模型。后续若使用真实软件或数据，另附 provenance、版本和许可。

## 7. 与实际计算的连接原则

固定链条：

```text
理论方法
→ 程序实现
→ 输入参数
→ 数值残差/停止条件
→ 表示与边界收敛
→ 目标 observable 收敛
→ 方法适用性
→ 科学解释
```

- 不给所有体系通用的 `Ecut`、k mesh、真空、smearing、sphere radius 或截断半径。
- 比较两个程序时，先对齐 Hamiltonian、泛函、赝势/全电子处理、相对论设置、几何、边界、占据和收敛目标。
- 结果接近只说明在已对齐条件下观察到一致，不自动证明二者正确。
- wall time 必须连同体系规模、精度目标、硬件、并行规模、算法和 I/O 条件报告。

## 8. 与其他 Part 的交叉引用

- Part II：Chapter 6–9 提供 DFT 与 Kohn–Sham 方程；Part IV 不重新证明泛函定理。
- Part III：Chapter 10–11 提供原子态和赝势；Chapter 12–13 只说明其在表示/算法中的作用。
- Part V：Chapter 19–24 使用 Part IV 的能量、力、响应和波函数；Part IV 不提前展开完整性质算法。
- Appendices：F 处理扩展体系 Coulomb；L/M 处理优化与迭代；N 支持 Slater–Koster；R 只作代码索引，不作为当前功能事实。
- Sholl–Steckel：将 cutoff、k points、supercell、surface 和 accuracy 组织为实践检查，不替代 Martin 的方法推导。

## 9. 并行隔离和 Git 策略

已核验的远端活动分支：

- `content/part01-ch02-overview`：只修改 Chapter 2 命名空间和页面；
- `content/part02-ch06-dft-foundations`：只修改 Part II 规划、Chapter 6 局部组件和数据；Draft PR #13 当前暂停；
- `content/part03-ch10-atomic-structure`：当前只新增 Part III 规划。

Part IV 默认写入：

```text
src/content/docs/part-04-determination-of-electronic-structure/
src/components/part04/
src/data/part04/
scripts/validate-part04-*
docs/part04-*
```

共享组件仅复用 `main` 已有稳定接口。Chapter 12 PR 不修改 `custom.css`、Astro 配置或锁文件，除非构建证据表明确实无法局部解决。Talos worktree 的 live 状态本会话无法核验，因此远端分支 diff 只用于 GitHub 冲突判断。

## 10. 分章执行批次

### Chapter 12

- Batch A：来源地图、阅读定位、术语、周期边界、平面波矩阵、Bloch theorem、cutoff、NFE 二态模型；首批交互；
- Batch B：form/structure factor、原子近似势、EPM、密度/FFT/dual-grid；
- Batch C：finite difference、DG、finite elements、wavelets、adaptive coordinates、方法比较、练习、来源边界；
- Batch D：validator、最终 diff、CI、Pages 和浏览器验收。

### Chapter 13

- Batch A：ab initio pseudopotential Hamiltonian 与 FFT 数据流；
- Batch B：SCF response、mixing 与 preconditioning；
- Batch C：PAW、exact exchange；
- Batch D：supercell、surface/interface、cluster、收敛审查与验收。

### Chapter 14

- Batch A：局域轨道、overlap、广义本征问题；
- Batch B：Slater–Koster、单带/双带；
- Batch C：graphene、nanotube、CuO₂、SOC；
- Batch D：能量/力/应力、transferability、验收。

### Chapter 15

- Batch A：全自洽局域基与 density matrix；
- Batch B：Gaussian；
- Batch C：numerical orbitals、BSSE、Pulay；
- Batch D：Green’s function、recursion、mixed basis、验收。

### Chapter 16

- Batch A：muffin-tin 分区和 APW；
- Batch B：KKR/multiple scattering；
- Batch C：CPA、MTO、canonical bands；
- Batch D：总能/力/压力、验收。

### Chapter 17

- Batch A：energy linearization 与 `u, \dot u`；
- Batch B：LAPW/local orbitals；
- Batch C：LMTO/tight-binding form；
- Batch D：NMTO/full-potential、误差和验收。

### Chapter 18

- Batch A：各计算阶段的标度和 locality；
- Batch B：nonvariational/purification；
- Batch C：variational density matrix/Wannier；
- Batch D：linear-scaling SCF、factorization、crossover、验收。

## 11. Chapter 完成门槛

每章必须同时满足：目录全部分节已覆盖；中英文段落级对照；核心推导可检查；严格关系、近似与离散分开；原创可视化合同和 fallback 完整；练习原创；页码可定位；无 TODO/outline 占位；Part IV validator、框架 validator、SCF validator和 Astro build 实际通过；PR diff 仅限本章；GitHub Actions 有实际步骤并成功；Pages 部署和 live browser smoke 对精确 merge SHA 成功；Research-Ops 只在章完成后记录一次。
