# Theory final resource build — Batch 01: numerical solvers and representations

Reviewed 2026-08-04 against `origin/main` `bd2a0b3800e283fffec3610af318f317c03c91cd`, the page-local source, and the candidate inventory in `docs/external-resource-audit-2026-08-04/theory-resource-backlog.md`. The page-state extraction contains 39 Theory pages and 152 normalized external URLs; no candidate below supplies a missing primary role without duplicating an existing route or turning a page into a solver catalogue.

| Page | Candidate | Role | Decision | Reason | Version/access | Boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Linear Algebra | T-LA-01 | applied continuation | deferred | Existing 18.335 is the needed numerical bridge; data-analysis framing is specialist. | OCW course page | Matrix practice is not sparse electronic-structure convergence. |
| Linear Algebra | T-LA-02 | numerical spine | duplicate | Already linked on the page. | OCW course page | Completion does not establish solver or basis convergence. |
| Linear Algebra | T-LA-03 | accessible text | deferred | Existing Axler, Hefferon, UCAS, and 18.335 cover the page's entry roles. | Open text | Interactive exercises do not replace numerical analysis. |
| Linear Algebra | T-LA-04 | sparse eigensolver | deferred | Useful library specialist, but no page-local implementation gap remains. | SLEPc tutorials | A successful eigensolve does not validate a physical model. |
| Differential Equations | T-DE-01 | ODE course | deferred | The page is intentionally PDE/analytic-to-numerical; this would be an alternative first course. | OCW course page | ODE completion does not provide weak-form or modelling validation. |
| Differential Equations | T-DE-02 | numerical bridge | duplicate | FNC already supplies this role on Numerical Analysis. | Open book | General examples do not validate electronic-structure operators. |
| Differential Equations | T-DE-03 | weak-form executable bridge | duplicate | iFEM is already the shared finite-element bridge; a second package is not needed. | Maintainer tutorial | A mesh solution does not establish model or mesh convergence. |
| Numerical Analysis | T-NA-01, T-NA-02 | rigorous spine | duplicate | Both FNC and MIT 18.335 are current page resources. | Open book; OCW | Numerical course completion is not observable convergence. |
| Numerical Analysis | T-NA-03, T-NA-04 | scalable solver tutorials | deferred | PETSc/SLEPc are implementation-specialist alternatives to the page's general numerical route. | Project documentation | Tolerances do not establish basis, sampling, or physical validity. |
| Numerical Analysis | T-NA-05 | Krylov reference | deferred | Valuable reference, but it adds no readable primary route beyond the existing spine. | Netlib archive | Preconditioner choice is not scientific validation. |
| Self-Consistent Field Methods | T-SCF-01, T-SCF-02 | SCF/mixing bridge | duplicate | DFTK and SIESTA SCF routes are already linked on the page. | Current project docs | An SCF residual does not prove a unique ground state. |
| Self-Consistent Field Methods | T-SCF-03, T-SCF-05 | molecular SCF variants | deferred | Molecular-code alternatives would obscure the periodic/nonlinear fixed-point focus. | Versioned project docs | DIIS or stability output is not universal convergence evidence. |
| Self-Consistent Field Methods | T-SCF-04 | GPW troubleshooting | deferred | Code-specific specialist; no absent learning role. | CP2K manual | Troubleshooting settings do not validate a calculation. |
| Discretization and Basis Representations | T-DB-01 | basis metadata | deferred | Basis Set Exchange belongs to localized-orbital use, not a general representation directory. | Versioned database | Selecting a named basis does not establish completeness. |
| Discretization and Basis Representations | T-DB-02 | finite-element bridge | duplicate | iFEM is already linked elsewhere and in the Theory index. | Open Jupyter book | A weak-form notebook does not prove variational representability. |
| Discretization and Basis Representations | T-DB-03 | DFT finite elements | deferred | Advanced code alternative; the current DFTK/GPAW/SIESTA comparison already spans the role. | Project documentation | Implementation output does not establish representation convergence. |
| Discretization and Basis Representations | T-DB-04, T-DB-05 | wavelet alternatives | deferred | Specialist alternatives would make the page a package list. | Project documentation | Different bases retain separate boundary and convergence controls. |
| Plane-Wave and Real-Space Methods | T-PW-01 | official plane-wave route | duplicate | QE documentation is already linked. | Official documentation | A tutorial run is not a convergence protocol. |
| Plane-Wave and Real-Space Methods | T-PW-02 | broad plane-wave route | deferred | A second code spine does not add the missing comparison framework. | ABINIT tutorials | Syntax and defaults are version-specific. |
| Plane-Wave and Real-Space Methods | T-PW-03 | multi-representation route | duplicate | GPAW documentation is already linked. | GPAW documentation | Mode agreement still needs independent controls. |
| Plane-Wave and Real-Space Methods | T-PW-04 | real-space route | deferred | Octopus is a specialist alternative; DFTK, GPAW, and DFT-FE already support comparison. | Octopus tutorials | Grid and boundary settings remain problem-specific. |
| Plane-Wave and Real-Space Methods | T-PW-05, T-PW-06, T-PW-07 | specialist implementations | deferred | No distinct page-local learning role; retain in the candidate inventory. | Versioned project pages | A code example does not validate representation or observable convergence. |

Disposition totals: adopted 0; duplicate 7; deferred 22; rejected 0; inaccessible 0. No public Theory page changed: each reviewed page retains its existing rigorous spine and the necessary scientific boundary.
