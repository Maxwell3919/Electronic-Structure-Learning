# Appendix E convention audit

This note records source-sensitive conventions that can change signs, units, or numerical interpretation in Martin Appendix E. It is an implementation aid for the public Appendix E page, not a replacement for the source text.

## Source locator

- Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed.
- Appendix E, printed pp. 600–606.
- Sections E.1–E.6; equations E.1–E.23.

## Electromagnetic units

Martin Appendix E uses Gaussian electromagnetic units. The website therefore preserves:

```math
\mathbf D=\mathbf E+4\pi\mathbf P,
\qquad
v_C(q)=\frac{4\pi e^2}{q^2},
\qquad
\omega_p^2=\frac{4\pi nQ^2}{m_e}.
```

Any SI crosswalk must display the corresponding factors of `epsilon_0`; it must not silently reuse the Gaussian formula.

## Time convention and Eq. E.11

The Part VII default is a physical time dependence `exp(-i omega t)`. With

```math
\partial_t\mathbf P=\mathbf j,
```

this gives

```math
\boldsymbol\epsilon(\omega)
=\mathbf 1+\frac{4\pi i}{\omega}\boldsymbol\sigma(\omega),
```

which matches Martin Eq. E.11.

The prose on printed p. 602 also states a time dependence proportional to `exp(+i omega t)`. Applying that prose convention literally reverses the conductivity prefactor. The website records this prose-equation mismatch and uses `exp(-i omega t)` consistently for dielectric loss, absorbed power, retarded denominators, and the vector-potential relation.

## Source and response objects

- `epsilon` and `sigma` respond to the total material field `E`.
- `epsilon^{-1}` responds to the external-source field `D` or external scalar potential.
- Longitudinal scalar-potential response and transverse current/vector-potential response are distinct at finite wave vector.
- The macroscopic dielectric function of a crystal is extracted as

```math
\epsilon_M=\frac{1}{[\epsilon^{-1}]_{00}},
```

not generally as the microscopic head `epsilon_00`.

## Born-effective-charge normalization

Martin Eq. E.20 is printed without an explicit cell-volume factor:

```math
Z^*_{I,\alpha\beta}|e|
=\left.\frac{\partial P_\alpha}{\partial R_{I\beta}}\right|_{E_{\mathrm{mac}}}.
```

When `P` is a polarization density, the common modern convention contains the cell volume:

```math
Z^*_{I,\alpha\beta}|e|
=\Omega\left.\frac{\partial P_\alpha}{\partial R_{I\beta}}\right|_{E_{\mathrm{mac}}}.
```

A numerical comparison must identify whether `P` denotes a cell dipole, a polarization density, or a quantity with volume normalization already absorbed. The website does not infer equivalence from matching symbol names alone.

## Electrical boundary

The intrinsic electronic dielectric tensor, Born charges, force constants, and piezoelectric derivatives in E.6 are defined at fixed macroscopic electric field. Fixed-`D`, open-circuit, short-circuit, slab, and finite-shape responses require separate boundary transformations and cannot be inferred from the intrinsic tensor without additional information.
