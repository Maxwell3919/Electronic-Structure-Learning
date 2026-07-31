# Part III Chapter 10 validation record

This record separates deterministic mathematics checks, static-site build checks, and post-deployment browser checks for Chapter 10.

## Current integration baseline

- Chapter branch: `content/part03-ch10-atomic-structure`
- Current synchronized `main`: `f0395e320f301e764074c1a424225b3b2bb128ea`
- Semantic integration commit: `d5677f1c67c5d7adf8439162ef7f50f88b7da9b3`
- Parallel content preserved: Part II Chapter 6 and Part V Chapter 19, including their validators and Pages browser-smoke checks.

## Deterministic checks

`scripts/validate-part03-ch10.mjs` verifies:

1. hydrogenic radial normalization for representative 1s, 2s, 2p, 3s, 3p and 3d cases;
2. radial node count `n-l-1`;
3. the vanishing `l=0` centrifugal term and the analytic increment between adjacent `l` channels;
4. the degeneracy-weighted trace of the one-electron `L·S` model;
5. Delta-SCF arithmetic and invariance under a common total-energy shift;
6. removal of generated outline markers and TODO placeholders from the assembled route.

These checks validate the declared analytic teaching models and route completeness. They do not validate a production atomic solver, exchange-correlation approximation, open-shell ground state, or pseudopotential transferability.

## GitHub-hosted build history

- Run `30625349545`: deterministic checks passed; Astro compilation found literal LaTeX braces inside an Astro component.
- Run `30625654580`: deterministic checks and Astro compilation passed; prerendering exposed MDX interpreting inline subscript braces inside JSX children as JavaScript expressions.
- The component markup and JSX-contained inline notation were normalized without changing display equations or derivation content.

The current head must pass the full repository command:

```bash
npm ci --no-audit --no-fund
npm run check
```

This includes framework, SCF, Part II, Part III and Part V deterministic validators plus the complete Astro build.

## Post-merge Pages checks

`scripts/smoke-part03-ch10.py` is compiled in pull-request CI and is executed only after deployment to the public GitHub Pages URL. It checks:

- Part III index and Chapter 10 routes under the repository base path;
- desktop two-column and narrow-screen one-column bilingual layout;
- rendered KaTeX content and chapter navigation;
- all six visualization contracts;
- keyboard operation of the radial-potential, hydrogenic, spin–orbit and Delta-SCF controls;
- static SVGs, formulas and explanatory fallbacks with JavaScript disabled;
- deployment provenance matching the merged commit SHA.

A successful static build is not recorded as a successful browser smoke. Deployment and browser evidence remain separate gates.
