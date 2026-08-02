# Theory batch 5 source review

Reviewed on: 2026-08-03 (Asia/Shanghai)

Scope:

- Differential Equations
- Fourier Analysis
- Crystallography
- Group Theory and Symmetry

## Review basis

The primary planning basis is the uploaded report *Electronic Structure Atlas: Theory module systematic review and content-building research report*. The report places these subjects in Tier 2 and gives them distinct responsibilities:

- Differential Equations: ODE/PDE structure, initial and boundary conditions, spectral problems, Sturm–Liouville theory, Green functions, and weak-form awareness.
- Fourier Analysis: Fourier series and transforms, convolution, distributions, sampling, DFT/FFT, multidimensional transforms, reciprocal space, and plane-wave connections.
- Crystallography: lattices, cells, reciprocal lattices, diffraction, space groups, Miller indices, and Wyckoff positions.
- Group Theory and Symmetry: representations, irreducible sectors, direct products, selection rules, degeneracy, symmetry-adapted bases, and symmetry reduction.

The report explicitly states that Tier 2 should not be forced into one linear order. Fourier analysis and crystallography are central to the periodic plane-wave route, while group theory crosses molecular, crystalline, vibrational, magnetic, and topological routes.

## Differential Equations

### Gerald Teschl, *Ordinary Differential Equations and Dynamical Systems*

- Official author page: `https://www.mat.univie.ac.at/~gerald/ftp/book-ode/ode`
- Publisher record: American Mathematical Society, Graduate Studies in Mathematics 140.
- Access: the author hosts lecture-note/book files; the AMS edition is commercial.
- Confirmed role: rigorous ODE foundation including existence and uniqueness, linear equations, initial-value dependence, and Sturm–Liouville boundary-value problems.
- Limitation: not a complete modern PDE course and not a numerical electronic-structure manual.

### Riley, Hobson, and Bence, *Mathematical Methods for Physics and Engineering*, 3rd ed.

- Official publisher page: `https://www.cambridge.org/highereducation/books/mathematical-methods-for-physics-and-engineering/FC466374D5B94E86D969100070CA6483`
- Access: paid or institutional.
- Confirmed role: broad physics reference for separation of variables, special functions, differential equations, and Green functions.
- Limitation: breadth does not replace rigorous PDE existence theory.

### MIT OpenCourseWare 18.330

- Official course: `https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/`
- Role: numerical continuation after the continuous equation, domain, and boundary conditions are specified.
- Limitation: numerical convergence does not establish that the continuous model or boundary conditions are physically appropriate.

### Open gap retained

The report did not complete a second-round review of a single open PDE course broad enough to cover the page title. The public page therefore states this gap rather than presenting an ODE source as a complete PDE curriculum.

## Fourier Analysis

### Stanford Engineering Everywhere EE261

- Official course: `https://see.stanford.edu/Course/EE261`
- Access: free course materials.
- Confirmed scope: Fourier series, continuous and discrete transforms, Dirac delta and distributions, convolution and correlation, sampling, DFT/FFT, multidimensional transforms, imaging, optics, and crystallography applications.
- Role: principal open course.
- Limitation: engineering/science course rather than a full abstract harmonic-analysis sequence.

### IUCr Teaching Pamphlet 4, *The Reciprocal Lattice*

- Official page: `https://www.iucr.org/education/pamphlets/4`
- Access: free web and PDF forms.
- Confirmed role: direct/reciprocal lattice relation and diffraction bridge.
- Limitation: assumes vector fluency and is not a general Fourier-analysis course.

### Richard M. Martin, *Electronic Structure*, 2nd ed.

- Official publisher page: `https://www.cambridge.org/highereducation/books/electronic-structure/0F1D0525EC0BF4084A0F2D00637E5D0F`
- Role: electronic-structure bridge for plane waves, periodic functions, reciprocal-space Coulomb terms, and grids.
- Access: paid or institutional.

## Crystallography

### International Union of Crystallography education resources

- Official hub: `https://www.iucr.org/education`
- Teaching pamphlets: `https://www.iucr.org/education/pamphlets`
- Access: free/varied by item.
- Confirmed scope: symmetry, diffraction, reciprocal lattice, structure factors, matrices, crystal physics, and teaching resources.
- Limitation: heterogeneous collection rather than one sequential course; individual items have different dates and levels.

### Bilbao Crystallographic Server

- Official server: `https://www.cryst.ehu.es/`
- Access: free; output and tools require the requested scholarly citations.
- Confirmed tools relevant here: general positions, Wyckoff positions, reflection conditions, subgroups, structure transformations, k-vector types, Brillouin zones, and standardization utilities.
- Limitation: reference and computational service, not a first introduction and not an automatic validator of scientific structure quality.

### MIT OpenCourseWare 3.091SC

- Official course: `https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/`
- Role: broad materials-chemistry entrance connecting bonding, crystallography, diffraction, defects, and semiconductors.
- Limitation: does not replace a dedicated crystallography reference or International Tables.

### Licensing boundary

The page does not reproduce International Tables of Crystallography. The report identifies detailed International Tables quotation and access boundaries as an unresolved licensing review.

## Group Theory and Symmetry

### Peter F. Bernath, *Spectra of Atoms and Molecules*, 5th ed.

- Official book page: `https://academic.oup.com/book/59280`
- Published by Oxford University Press in 2025.
- Confirmed relevant chapters: Molecular Symmetry, Matrix Representation of Groups, Quantum Mechanics and Group Theory; appendices include character and direct-product tables.
- Role: current molecular and spectroscopic route.
- Access: paid or institutional.
- Limitation: molecular/spectroscopic emphasis; not a complete space-group or magnetic-group text.

### Bilbao Crystallographic Server representation tools

- Official server: `https://www.cryst.ehu.es/`
- Confirmed relevant tools: point- and space-group irreducible representations, direct products, little-group k-vector data, compatibility relations, site-symmetry-induced representations, double groups, magnetic groups, and tensor forms.
- Role: crystalline and advanced reference/tool.
- Limitation: labels and outputs require correct group, setting, wavevector, basis, and physical symmetry assumptions.

### IUCr Teaching Pamphlets

- Official collection: `https://www.iucr.org/education/pamphlets`
- Relevant topics include symmetry, space-group patterns, rotation matrices, translation vectors, metric tensors, and matrices/mappings in crystallographic symmetry.
- Limitation: pamphlets vary in depth; they do not form a single modern group-theory textbook.

### Open gap retained

The report calls for a second-round comparison of a modern cross-disciplinary group-theory text with exercises suitable for both physics and chemistry. No such resource is promoted as a unique best choice in this batch.

## Scientific and publishing boundaries

- Public prose and MathML are original site content; no textbook pages, figures, tables, or exercise solutions are copied.
- Resource identity and scope checks do not independently validate every scientific statement on the new pages.
- Bilbao or standardization output does not establish that a structure, symmetry tolerance, magnetic model, or band-path convention is scientifically appropriate.
- A Fourier transform, FFT, symmetry reduction, or differential-equation solver is a representation or algorithmic operation, not evidence that the model or target observable is converged.
- The pages remain independently organized and do not introduce a mandatory visible section contract.
