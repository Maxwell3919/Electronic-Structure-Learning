# Part II Content Plan · Density Functional Theory

## 1. Scope and authority

This plan covers Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed., Part II, printed pages 129–213. The exact directory structure is taken from `src/data/martin/part02.mjs` and checked against the current PDF.

Sholl–Steckel, *Density Functional Theory: A Practical Introduction*, is used only as a practical cross-reference, principally Chapter 1 §§1.4–1.7 and Chapter 3 §3.4. It does not replace Martin's theory sequence.

All public prose, derivations, diagrams, exercises, and teaching models must be original. Source titles and printed-page locators may be recorded; textbook body text, scans, figures, exercises, and answers must not enter the repository.

## 2. Dependency graph

```text
Chapter 6: exact density-based foundations
  ├─ admissible densities and universal functional
  ├─ Hohenberg–Kohn mapping and variational principle
  └─ Levy constrained search and representability
             │
             ▼
Chapter 7: Kohn–Sham auxiliary system
  ├─ non-interacting kinetic functional
  ├─ orbital-constrained variation and effective potential
  ├─ self-consistent fixed point, force and stress
  └─ total energy, eigenvalues and exact-theory intricacies
             │
             ▼
Chapter 8: exchange–correlation functionals I
  ├─ exchange–correlation hole and sum rules
  ├─ LDA/LSDA and why locality can work
  ├─ GGA and the functional derivative of semilocal forms
  └─ ADA/WDA and database-fitted functionals
             │
             ▼
Chapter 9: exchange–correlation functionals II
  ├─ generalized Kohn–Sham and band gaps
  ├─ hybrids, range separation and meta-GGA
  ├─ OEP, SIC and DFT+U
  ├─ response-derived and nonlocal dispersion functionals
  └─ mBJ and property-dependent comparison
```

## 3. Cross-chapter ownership

| Topic | Primary chapter | Boundary |
|---|---:|---|
| Thomas–Fermi–Dirac approximation | 6 | Historical density-only approximation; no Kohn–Sham orbitals. |
| Hohenberg–Kohn theorems | 6 | Mapping, variational principle, assumptions, degeneracy and extensions. |
| Levy constrained search | 6 | Defines the universal functional over admissible densities. |
| Kohn–Sham equations | 7 | Derived by constrained orbital variation; not pre-derived in Chapter 6. |
| Self-consistent iteration | 7 | Mathematical fixed-point and numerical convergence are kept separate from exact DFT existence statements. |
| Exchange–correlation hole | 8 | Defined and connected to `E_xc`; exact sum rules precede approximations. |
| Uniform electron gas and LDA/LSDA | 8 | Local reference system and spin dependence. |
| GGA | 8 | Martin places GGA in §8.5; Chapter 9 must not claim ownership. |
| Functional derivative for LDA/GGA potentials | 8 | Includes gradient integration by parts and boundary assumptions. |
| Generalized Kohn–Sham and derivative discontinuity | 9 | Chapter 7 introduces eigenvalue meaning; Chapter 9 connects nonlocal operators and band gaps. |
| Hybrid and range-separated functionals | 9 | Exact-exchange fraction is a model choice, not a universal constant. |
| meta-GGA | 9 | Kinetic-energy-density dependence and generalized Kohn–Sham consequences. |
| Self-interaction correction and DFT+U | 9 | Localized-orbital corrections, projector and parameter dependence. |
| van der Waals / nonlocal correlation | 9 | Response-derived and nonlocal-density functionals. |
| Functional selection | 9 | Property- and system-dependent comparison; no universal ranking. |

## 4. Chapter 6 · Density Functional Theory: Foundations

### Source structure

- 6.1 Overview, p. 129
- 6.2 Thomas–Fermi–Dirac Approximation, p. 130
- 6.3 The Hohenberg–Kohn Theorems, p. 131
- 6.4 Constrained Search Formulation of DFT, p. 135
- 6.5 Extensions of Hohenberg–Kohn Theorems, p. 137
- 6.6 Intricacies of Exact Density Functional Theory, p. 139
- 6.7 Difficulties in Proceeding from the Density, p. 141
- Exercises begin p. 143; website exercises must be original.

### Derivation targets

1. Fixed-`N` interacting Hamiltonian and one-body density.
2. Thomas–Fermi kinetic term, Hartree term, Dirac exchange term and constrained Euler equation.
3. Hohenberg–Kohn uniqueness proof, including additive constants and nondegenerate/degenerate boundaries.
4. Ground-state variational inequality over densities.
5. Levy constrained search and the nested minimization over wavefunctions and densities.
6. Particle-number constraint, functional derivative/subgradient form and chemical potential.
7. Pure-state, ensemble, `N`-representable and `v`-representable density sets.

### Visualizations

- `PotentialDensityMap`: static-first external-potential → ground state → density mapping; control changes a declared toy perturbation and shows that an additive constant does not change the density.
- `ConstrainedSearchExplorer`: finite candidate-space teaching model for inner and outer minimization; acceptance checks compare the displayed minima with explicit formulas.
- `RepresentabilityDiagram`: original static set diagram separating normalized nonnegative trial densities, `N`-representable densities, and ground-state `v`-representable densities.

### Completion boundary

Chapter 6 may state why an auxiliary system is needed, but it must not derive the Kohn–Sham equations or survey functional families beyond the historical Thomas–Fermi–Dirac example.

## 5. Chapter 7 · The Kohn–Sham Auxiliary System

### Source structure

- 7.1 Replacing One Problem with Another, p. 145
- 7.2 The Kohn–Sham Variational Equations, p. 148
- 7.3 Solution of the Self-Consistent Coupled Kohn–Sham Equations, p. 150
- 7.4 Achieving Self-Consistency, p. 157
- 7.5 Force and Stress, p. 160
- 7.6 Interpretation of the Exchange–Correlation Potential, p. 161
- 7.7 Meaning of the Eigenvalues, p. 162
- 7.8 Intricacies of Exact Kohn–Sham Theory, p. 163
- 7.9 Time-Dependent Density Functional Theory, p. 166
- 7.10 Other Generalizations, p. 167

### Derivation targets

- `T_s[n]`, Hartree energy and the definition of `E_xc[n]`.
- Orbital-constrained variation with a Hermitian Lagrange-multiplier matrix.
- Unitary orbital rotation and the canonical Kohn–Sham equations.
- Density reconstruction, occupations and the effective potential.
- Total-energy/eigenvalue-sum relation and double-counting corrections.
- Fixed-point formulation, response, linear mixing and convergence conditions.
- Hellmann–Feynman force, Pulay terms and stress boundaries.
- Ionization-potential statement, Janak-type derivative and derivative-discontinuity boundary only to Martin's scope.

### Visualizations

Interacting vs auxiliary-system diagram; energy decomposition; self-consistency explorer using the existing validated toy kernel; orbital/occupation/density model; basis-dependent force diagram.

## 6. Chapter 8 · Functionals for Exchange and Correlation I

### Source structure

- 8.1 Overview, p. 171
- 8.2 `E_xc` and the exchange–correlation hole, p. 172
- 8.3 LSDA, p. 174
- 8.4 Why the local approximation can work, p. 175
- 8.5 GGA, p. 179
- 8.6 LDA/GGA expressions for `V_xc^σ(r)`, p. 183
- 8.7 ADA/WDA, p. 185
- 8.8 Functionals fitted to databases, p. 185

### Derivation targets

- Pair density, conditional density, hole definition and charge sum rule.
- Coupling-constant averaged hole and `E_xc`.
- Uniform-gas variables, density parameter and spin polarization.
- LDA/LSDA energy and potential.
- Exchange spin scaling.
- Reduced gradient, semilocal GGA form and exact-condition constraints.
- Functional derivative of a density-and-gradient functional using integration by parts.

### Visualizations

Exchange–correlation-hole normalization; local uniform-gas sampling; spin-polarization interpolation; LDA/GGA response to smooth and rapidly varying model densities.

## 7. Chapter 9 · Functionals for Exchange and Correlation II

### Source structure

- 9.1 Beyond LDA and GGA, p. 188
- 9.2 Generalized Kohn–Sham and bandgaps, p. 189
- 9.3 Hybrid functionals and range separation, p. 191
- 9.4 Meta-GGAs, p. 195
- 9.5 Optimized effective potential, p. 197
- 9.6 SIC and DFT+U, p. 199
- 9.7 Functionals derived from response functions, p. 203
- 9.8 Nonlocal functionals for van der Waals dispersion, p. 205
- 9.9 Modified Becke–Johnson potential, p. 209
- 9.10 Comparison of functionals, p. 209

### Derivation targets

- Generalized Kohn–Sham stationarity with a nonmultiplicative operator.
- Global and range-separated hybrid decompositions.
- Kinetic-energy density and representative meta-GGA ingredients.
- OEP chain-rule structure and local-potential boundary.
- One-electron self-interaction condition.
- Rotationally simplified DFT+U correction with projector and `U` dependence.
- Adiabatic-connection/response expression at the level developed in Martin.
- Pairwise and density-nonlocal dispersion models, damping and asymptotic limits.

### Visualizations

Functional-information ladder; hybrid/range-separation explorer; self-interaction curvature model; DFT+U occupation penalty; nonlocal-dispersion kernel; property-dependent comparison matrix.

## 8. Chapter workflow and validation

Each chapter uses one branch and one pull request. Only one Part II chapter may contain active body edits at a time. Before starting the next chapter, the current chapter must be merged, deployed, and checked at the GitHub Pages project base path.

Minimum checks:

```bash
npm ci --no-audit --no-fund
npm run check
```

Chapter-local validators must test deterministic teaching-model claims. The final diff must not modify another Part II chapter body or any Part I page. Framework generation must not be rerun over substantive pages.
