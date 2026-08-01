# Part III Chapter 10 spin-orbit unit audit

- scope: Chapter 10, Section 10.3 and the original spin-orbit teaching model
- source: Richard M. Martin, 2nd ed., printed page 219, Eq. (10.14), with Appendix O as the derivation dependency
- result: dimensionally ambiguous site notation corrected without changing the numerical model

## Reproduced issue

The page and interactive model used the dimensionless angular eigenvalues `l/2` and `-(l+1)/2` while writing the model Hamiltonian as `H_SO = xi L dot S` and reporting `xi` directly in eV. Physical angular-momentum operators carry factors of hbar, so `L dot S` has dimensions of hbar squared. The previous notation was therefore incomplete unless one silently assumed dimensionless angular momenta or hbar equals one.

## Accepted convention

The site now defines

```text
Lambda_LS = (L dot S) / hbar^2
H_SO(model) = xi Lambda_LS
```

with `xi` in energy units. A coefficient multiplying the dimensional operator `L dot S` directly must instead have units of energy divided by hbar squared.

The spherical Pauli expression is also written with `U(r)` identified as the electron potential energy. If an electrostatic scalar potential is used instead, the charge sign remains explicit.

## Evidence boundary

This audit fixes units and notation only. It does not determine a physical atomic spin-orbit coupling, solve the Dirac equation, validate a relativistic pseudopotential, or establish a material-level band splitting.
