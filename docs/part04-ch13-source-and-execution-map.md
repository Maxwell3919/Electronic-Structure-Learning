# Part IV Chapter 13 来源与执行地图

状态：`active`

基线：`Maxwell3919/Electronic-Structure-Learning@3b434e4debf2e0d9c667b5329ff654dcbc201a9e`

范围：Martin 第 2 版 Chapter 13，印刷页 283–292，§§13.1–13.7。本文只记录网站原创内容的来源边界、数学对象和执行批次，不转录教材正文或练习。

## 1. 章节定位

Chapter 12 建立平面波、Fourier 截断和实空间离散；Chapter 13 把这些表示嵌入完整的 Kohn–Sham 计算。统一链条为：

```text
平滑轨道与赝势 Hamiltonian
        ↓
在 G 空间/实空间间应用算符
        ↓
求解有限维本征问题并构造 n_out
        ↓
由 n_out 构造 V_H、V_xc 与新的输入势/密度
        ↓
混合、预条件和自洽停止
        ↓
计算总能、力、应力及目标 observable
        ↓
分别检查表示、k 点、SCF、超胞和 observable 收敛
```

本章不重新推导 Chapter 11 的赝势生成，也不把 Chapter 19 的分子动力学、Chapter 20 的声子响应或 Chapter 22 的表面物理完整搬入此处。

## 2. Martin 来源地图

| 分节 | 印刷页 | 网站任务 |
|---|---:|---|
| Chapter summary | 283 | 平面波/网格、FFT、迭代方法和赝势如何组成完整计算 |
| 13.1 Ab initio Pseudopotential Method | 284 | reciprocal-space total energy, force, stress and KS operator |
| 13.2 Approach to Self-Consistency and Dielectric Screening | 286 | mixing, dielectric matrix, charge sloshing, Jacobian and preconditioning |
| 13.3 Projector Augmented Waves (PAWs) | 287 | smooth auxiliary functions, augmentation and all-electron reconstruction |
| 13.4 Hybrid Functionals and Hartree–Fock in Plane Wave Methods | 288 | nonlocal exchange, Coulomb singularity and localization route |
| 13.5 Supercells: Surfaces, Interfaces, Molecular Dynamics | 289 | artificial periodicity, finite-size scaling and long-range Coulomb boundary |
| 13.6 Clusters and Molecules | 292 | open versus periodic boundaries and image interactions |
| 13.7 Applications of Plane Wave and Grid Methods | 292 | applications as evidence map rather than software catalogue |
| Exercises | 293 | not reproduced; website exercises are original |

## 3. Direct dependencies

- Chapter 7: Kohn–Sham energy, eigenvalue double counting, self-consistent map, force and stress boundaries.
- Chapter 11: local/nonlocal pseudopotentials, separable projectors, ultrasoft methods and PAW transformation.
- Chapter 12: plane-wave Hamiltonian, density Fourier support, FFT grids and real-space methods.
- Appendix F: periodic Coulomb sums, neutral groupings, surface dipoles and artificial images.
- Appendix G: stress in Fourier components.
- Appendix M: residual minimization, preconditioning, Krylov/Davidson/RMM-DIIS and complexity.
- Sholl–Steckel Chapter 2: periodic cells, lattice parameters and practical convergence.
- Sholl–Steckel Chapter 4: slab models, vacuum, in-plane k meshes and periodic-image checks.
- Sholl–Steckel Chapter 10: numerical accuracy versus functional/model accuracy.

## 4. Mathematical objects and notation

| Object | Symbol | Boundary |
|---|---|---|
| smooth Bloch orbital | `\tilde\psi_{n\mathbf k}` | primary plane-wave/PAW auxiliary object |
| plane-wave coefficient | `c_{n\mathbf k}(\mathbf G)` | finite representation coefficient |
| local KS potential | `V_{\mathrm{KS,local}}^\sigma(\mathbf G)` | external local + Hartree + xc; average gauge treated separately |
| nonlocal projector operator | `\hat V_{\mathrm{NL}}` | not represented by one scalar Fourier component |
| input/output density | `n_{\mathrm{in}}`, `n_{\mathrm{out}}` | fixed-point variables; not physical alternatives at convergence |
| residual | `R=n_{\mathrm{out}}-n_{\mathrm{in}}` | numerical convergence object, not observable |
| dielectric/Jacobian | `\epsilon_{\mathbf G\mathbf G'}` | linearized response near a fixed point |
| mixing/preconditioner | `M` | approximate inverse response used to update the iterate |
| PAW transformation | `\mathcal T` | maps smooth auxiliary states to all-electron valence states |
| supercell length/vacuum | `L`, `L_{\mathrm{vac}}` | boundary-control parameters, not basis-cutoff parameters |

Atomic units are used only where explicitly declared. Energy, force, stress, reciprocal vectors, cell volume and density normalization must retain units and reference conventions.

## 5. Derivation targets

### 5.1 Reciprocal-space energy and force

- derive the kinetic and external-potential expectation from plane-wave coefficients;
- separate Hartree `G\ne0`, Ewald/background and non-Coulomb local-pseudopotential terms into finite neutral groupings;
- explain the eigenvalue-sum form and its double-counting corrections;
- distinguish variational energy expressions from the input-density saddle-point expression;
- derive the phase derivative that generates local and nonlocal force terms;
- state why stress requires cell derivatives and a separate Appendix G treatment.

### 5.2 Self-consistency and dielectric screening

For linear mixing,

```math
V_{i+1}^{\mathrm{in}}
=(1-\alpha)V_i^{\mathrm{in}}+\alpha V_i^{\mathrm{out}},
```

linearize the fixed-point map, diagonalize a teaching response operator, and derive the mode factor

```math
q_j=1-\alpha+\alpha\lambda_j.
```

Convergence requires `|q_j|<1` for every represented mode. Long-wavelength metallic modes can have large response and produce charge sloshing. A preconditioner changes the spectrum of the iteration; it does not change the target fixed point when applied consistently.

### 5.3 PAW

- state the linear transformation from smooth to all-electron functions;
- decompose wavefunctions, density and energy into smooth, one-center all-electron and one-center auxiliary terms;
- explain compensation charges/multipole cancellation;
- distinguish frozen-core approximation, finite partial-wave set and augmentation-sphere assumptions.

### 5.4 Exact exchange in plane waves

- write the occupied-state exchange operator and reciprocal-space Coulomb denominator;
- identify the discrete-k treatment of the `q=0` singularity;
- separate formal nonlocality from algorithmic scaling;
- explain the alternative localization/Wannier route without claiming universal linear scaling.

### 5.5 Supercells and finite systems

- derive reciprocal-grid refinement as cell size increases;
- distinguish physical periodicity from artificial repeated images;
- explain slab vacuum, interface repetition, defect concentration, dipole/charge corrections and k-point folding;
- define finite-size convergence for the target observable rather than for geometry alone.

## 6. Original visualization plan

1. **Plane-wave KS data-flow map**: real/reciprocal operations, local/nonlocal paths and density construction.
2. **Dielectric mixing spectrum**: user controls response eigenvalue and mixing; output shows `q`, convergence/divergence and iteration trace.
3. **Charge-sloshing/preconditioner model**: long- and short-wavelength modes with a declared diagonal model dielectric.
4. **PAW augmentation decomposition**: smooth function plus one-center correction, with reconstruction boundary.
5. **Supercell image model**: vacuum/cell length versus a deterministic image-error law; explicitly a teaching model, not a universal Coulomb correction.

Each visualization must have static initial output, keyboard controls, visible model/acceptance/boundary contract, no-JavaScript fallback and deterministic validation.

## 7. Comparison dimensions

The Chapter 13 comparison will keep fixed columns for representation, core treatment, boundary condition, matrix/operator structure, systematic controls, force/stress handling, dominant errors, memory/communication and suitable observables. It will not contain a universal ranking.

## 8. Execution batches

- Batch A: route, contents, source map, orientation, 13.1 energy/force/stress and KS data flow.
- Batch B: 13.2 mixing/dielectric/charge sloshing and deterministic response models.
- Batch C: 13.3 PAW and 13.4 hybrid/Hartree–Fock.
- Batch D: 13.5–13.7 supercells, finite systems, applications, method comparison and original exercises.
- Batch E: chapter-local validator and exact-SHA browser smoke; current-main semantic integration; CI, merge, Pages and Research-Ops handoff.

## 9. Parallel isolation

Substantive files are restricted to:

```text
src/content/docs/part-04-determination-of-electronic-structure/
src/components/part04/ch13/
src/data/part04/ch13TeachingModels.mjs
scripts/validate-part04-ch13.mjs
scripts/smoke-part04-ch13.py
docs/part04-ch13-*
```

Open parallel PRs may modify `package.json`, CI and deploy workflows. Chapter 13 will integrate those files only after synchronizing to current `main`, preserving every already-merged validator and smoke. No force push or unrelated Part edit is permitted.

## 10. Completion boundary

Chapter 13 is complete only when all seven Martin sections have bilingual substantive content, derivations and original exercises; chapter-local deterministic tests and full `npm run check` pass; the PR is merged; exact-SHA Pages build/deploy and Chapter 13 browser smoke pass; and a Chapter 13 Research-Ops handoff is merged.
