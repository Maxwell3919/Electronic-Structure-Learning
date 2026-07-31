# Part IV Chapter 14 来源与执行地图

状态：`active`

基线：`Maxwell3919/Electronic-Structure-Learning@ab10964fe03bb8b0aac92501abef031013cd1c50`

范围：Martin 第 2 版 Chapter 14，印刷页 295–315，§§14.1–14.12。练习从印刷页 317 开始，不转录教材正文、图表、练习或答案。

## 1. 章节定位

Chapter 12–13 从全空间平面波/网格表示进入完整自洽计算；Chapter 14 改用与原子位点关联的局域、能量无关基函数。它首先建立一般非正交局域基的 Bloch 和广义本征方程，然后在不显式指定径向轨道的 tight-binding / Slater–Koster 模型中研究能带、对称性、SOC、总能、力与 transferability。

```text
局域原子中心函数 χ_m(r−R)
        ↓ 晶格平移与 Bloch 和
H_mm'(T), S_mm'(T)
        ↓ Fourier 变换
H(k)c_n(k)=ε_n(k)S(k)c_n(k)
        ↓ 模型化矩阵元
on-site / hopping / overlap / SOC / SK σπδ
        ↓
单带、双带、graphene、nanotube、CuO2 与材料模型
        ↓
占据态能量、力/应力与参数 transferability 边界
```

本章重点是模型结构和物理直觉。Gaussian、数值原子轨道、全自洽局域基组、Pulay force、Green's function 与 recursion 的完整实现属于 Chapter 15。

## 2. Martin 来源地图

| 分节 | 印刷页 | 网站任务 |
|---|---:|---|
| Chapter summary | 295 | 局域表示、模型角色、与 Chapter 15/18/22–28 的关系 |
| 14.1 Localized Atom-Centered Orbitals | 296 | 实空间矩阵元、Bloch sums、H(k)/S(k)、广义本征问题与局域性 |
| 14.2 Matrix Elements with Atomic-Like Orbitals | 297 | 径向函数 × 球谐、σ/π/δ 二中心矩阵元、方向旋转、多中心边界 |
| 14.3 Spin–Orbit Interaction | 301 | 原子中心 L·σ 近似、spinor matrix、p/d shell 与 on-site SOC |
| 14.4 Slater–Koster Two-Center Approximation | 302 | two-center 参数化、band-fit 与 total-energy-fit 的不同需求、适用域 |
| 14.5 Tight-Binding Bands: Example of a Single s Band | 303 | 1D/2D/3D cosine bands、particle-hole-like symmetry、DOS/van Hove、nonorthogonality |
| 14.6 Two-Band Models | 305 | 2×2 Hamiltonian、hybridization、gap、sublattice/on-site asymmetry |
| 14.7 Graphene | 306 | honeycomb two-sublattice Hamiltonian、structure factor、K 点、Dirac expansion |
| 14.8 Nanotubes | 308 | rolling/quantization lines、zone folding、metal/semiconductor boundary、BN tubes |
| 14.9 Square Lattice and CuO2 Planes | 310 | square-lattice orbital models、Cu–O downfolding intuition、model boundary |
| 14.10 Semiconductors and Transition Metals | 311 | empirical parameterizations、sp3/transition-metal bands、band-fit limits |
| 14.11 Total Energy, Force, and Stress in Tight-Binding | 312 | band energy + repulsion、force/stress theorem、stationarity and parameter derivatives |
| 14.12 Transferability: Nonorthogonality and Environment Dependence | 315 | overlap、orthogonalization range、environment-dependent on-site/hopping、fit-domain evidence |
| Exercises | 317 | not reproduced; website exercises are original |

## 3. Direct dependencies and cross-chapter boundaries

- Chapter 3: finite-basis linear algebra, Hermitian/generalized eigenproblems and variational structure.
- Chapter 4: Bravais lattices, reciprocal space, Bloch theorem and Brillouin-zone sampling.
- Chapter 10: atomic angular momentum, shell states and spin–orbit splitting.
- Chapter 12: reciprocal-space/Bloch formulation used as a comparison to local Bloch sums.
- Appendix N: rotation of two-centre matrix elements for arbitrary angular momentum.
- Appendix O: relativistic origin and limits of spin–orbit interaction.
- Chapter 15: full localized-orbital Kohn–Sham calculations and explicit integrals.
- Chapter 18: locality and linear-scaling algorithms.
- Chapters 22–28: surface states and topological two-band models that reuse Chapter 14 structures.

## 4. Mathematical objects and notation

| Object | Symbol | Boundary |
|---|---|---|
| atom-centred basis function | `χ_m(r−τ_m−T)` | fixed, energy-independent basis function |
| real-space Hamiltonian matrix | `H_mm'(T)` | between orbital `m` in reference cell and `m'` in cell `T` |
| real-space overlap matrix | `S_mm'(T)` | metric of a generally nonorthogonal basis |
| Bloch sum | `χ_mk(r)` | phase-coherent lattice sum, normalized with the overlap convention |
| reciprocal matrices | `H(k)`, `S(k)` | lattice Fourier transforms of real-space matrices |
| eigenvector coefficients | `c_n(k)` | satisfy `c_n† S c_m = δ_nm` |
| on-site energy | `ε_m` | diagonal model parameter; can depend on environment in empirical models |
| hopping / overlap | `t_mm'(R)`, `s_mm'(R)` | finite-range model choice, not guaranteed exact truncation |
| SK channels | `ssσ`, `spσ`, `ppσ`, `ppπ`, `ddσ`, `ddπ`, `ddδ`, … | irreducible two-centre integrals in bond-aligned axes |
| SOC parameter | `ζ_l` | on-site shell parameter in the stated atomic-centre approximation |
| density matrix / band energy | `P`, `E_band` | occupied-state quantities; not a complete total energy without repulsion/double counting model |

A consistent choice of phase convention, orbital ordering, bond direction and Hermitian conjugation is part of the model definition. Changing the basis gauge may change matrix entries while leaving eigenvalues invariant.

## 5. Derivation targets

### 5.1 Local Bloch sums and generalized eigenproblem

- derive `H_mm'(k)=Σ_T exp(ik·T) H_mm'(T)` and the analogous overlap matrix;
- show k-block diagonality from translation invariance;
- derive `H(k)c=εS(k)c` and `c†Sc=1`;
- state positivity requirements for `S(k)` and the orthogonal limit;
- distinguish exact locality/decay from an empirical finite-range truncation.

### 5.2 Atomic symmetry and Slater–Koster rotation

- classify bond-axis matrix elements by `σ`, `π`, `δ`;
- derive representative `s–p` and `p–p` matrix elements from direction cosines;
- explain sign conventions for odd-parity orbitals;
- separate the rigorous crystal-symmetry constraints from the two-centre approximation.

### 5.3 Single-band and nonorthogonal models

- derive the nearest-neighbour cosine dispersion in 1D, square and cubic lattices;
- connect bandwidth to coordination and hopping sign;
- derive square-lattice half-filling symmetry, saddle point and van Hove divergence boundary;
- derive the one-orbital nonorthogonal expression `ε(k)=H(k)/S(k)` and identify the overlap-induced asymmetry;
- show that orthogonalization generally generates longer-range Hamiltonian elements.

### 5.4 Two-band, graphene and nanotubes

- diagonalize a general Hermitian 2×2 Hamiltonian;
- separate diagonal sublattice asymmetry from off-diagonal hybridization;
- derive graphene `f(k)`, K-point zeros and the linear Dirac expansion;
- identify which perturbations open a gap and which merely shift/tilt within the teaching model;
- derive nanotube transverse quantization and state the zone-folding metallicity boundary.

### 5.5 Total energy, force, stress and transferability

- separate occupied band energy from short-range/repulsive or double-counting terms;
- derive force/stress from stationarity with respect to coefficients and explicit parameter derivatives;
- state the additional overlap derivative terms in a nonorthogonal basis;
- explain why a band-fitted parameter set need not predict energies, forces or conduction states;
- distinguish interpolation in a fixed structure from transfer to new coordination, distance, charge or magnetic environments.

## 6. Original visualization plan

1. **Nonorthogonal 1D chain**: hopping and overlap controls, analytic `ε(k)` and overlap-positive boundary.
2. **Slater–Koster bond orientation**: direction cosines and `s–p` / `p–p` matrix elements with fixed sign convention.
3. **Two-band hybridization**: on-site difference and coupling, eigenvalues, mixing weight and avoided-crossing/gap boundary.
4. **Graphene lattice/Dirac model**: honeycomb bond vectors, `|f(k)|`, K-point zero and mass-term gap.
5. **Nanotube zone folding**: allowed transverse lines and whether a line intersects a graphene K point.

Every visualization must have static initial output, keyboard controls, a visible model/acceptance/boundary contract, deterministic tests and a no-JavaScript fallback.

## 7. Comparison dimensions

The chapter comparison will keep fixed columns for basis orthogonality, real-space range, symmetry content, parameter source, matrix sparsity, band/energy/force target, computational scaling, transferable domain and dominant failure modes. It will not rank a universal “best” tight-binding model.

## 8. Execution batches

- Batch A: route, contents, source map, reading orientation and §§14.1–14.4.
- Batch B: §§14.5–14.6, nonorthogonal single-band and two-band deterministic models.
- Batch C: §§14.7–14.9 graphene, nanotubes and square/CuO2 models.
- Batch D: §§14.10–14.12 materials, total energy/force/stress, transferability, comparison and original exercises.
- Batch E: chapter-local validator and exact-SHA browser smoke; current-main semantic integration; CI, merge, Pages and Research-Ops handoff.

## 9. Parallel isolation

Substantive files are restricted to:

```text
src/content/docs/part-04-determination-of-electronic-structure/
src/components/part04/ch14/
src/data/part04/ch14TeachingModels.mjs
scripts/validate-part04-ch14.mjs
scripts/smoke-part04-ch14.py
docs/part04-ch14-*
```

Open parallel PRs currently exist in Parts I, V and VI. Shared validator and Pages registration will be added only after synchronizing to the current accepted `main`, preserving every merged gate. No force push or unrelated Part edit is permitted.

## 10. Completion boundary

Chapter 14 is complete only when all twelve Martin sections have bilingual substantive content, derivations and original exercises; chapter-local deterministic tests and the full repository check pass; the PR is merged; exact-SHA Pages deployment and Chapter 14 browser smoke pass; and a Chapter 14 Research-Ops handoff is merged.
