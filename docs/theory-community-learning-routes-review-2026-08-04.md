# Theory community learning routes review

Review date: 2026-08-04

Website baseline: `ac5f2bcd2a6370a84a3f0a15b283f73a7ffaedf2`

Scope: cross-page learning routes on `/theory/`. This review does not replace the individual resource reviews for the thirty-nine Theory pages and does not modify Methods or Reference.

## Purpose

The individual Theory pages already contain reviewed courses, texts, notes, notebooks, and project documentation. The remaining navigation problem is choosing an order that fits a learner's present background. This review uses recommendations found on Bilibili, Zhihu, Reddit, and other course communities as discovery and repeated-use signals, then checks the named primary course, author page, or clearly self-produced social-platform series before public inclusion.

Popularity is not treated as technical validation. View counts, likes, stars, institutional names, and repeated recommendations can identify candidates, but acceptance still requires identifiable authorship, a visible sequence, a distinct role in the Atlas, and an explicit limitation.

## Accepted route additions

| Route role | Accepted destination | Reason for inclusion and boundary |
| --- | --- | --- |
| Visual linear-algebra intuition | 3Blue1Brown, [Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra) | Frequently paired with Gilbert Strang in Chinese and international study discussions. The official visual sequence helps a learner see span, basis change, determinant, eigenvector, and linear transformation before formal proof. It is not a complete algebra or numerical-linear-algebra course. |
| Formal first linear-algebra course | MIT OpenCourseWare, [18.06 Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) | Repeatedly recommended alongside visual introductions. The official course supplies elimination, subspaces, orthogonality, eigenvalues, positive-definite matrices, and SVD. It does not cover the generalized sparse eigenproblems and conditioning controls required by production electronic-structure calculations. |
| Chinese thermodynamics and statistical mechanics | Huazhong University of Science and Technology, Zou Yuanchuan, [Thermodynamics and Statistical Physics 2022](https://www.bilibili.com/video/BV1Zt4y1E7GV/) | The uploader identifies the course, lecturer, semester, textbook, and sequence; the series is marked as original and covers thermodynamic laws, ensembles, ideal Fermi/Bose gases, phase transitions, and irreversible-process basics. It is a full undergraduate route, not a finite-temperature DFT or simulation-sampling guide. |
| Self-produced Chinese quantum-chemistry bridge | Druid小德, [Introduction to Quantum Chemistry](https://www.bilibili.com/video/av752549261) | A completed self-produced sequence covering quantum postulates, basis representations, Born–Oppenheimer separation, Hartree–Fock, CI, active-space, coupled-cluster, DFT, relativistic effects, vibrations, and transitions. Its breadth makes it useful for chemistry-first learners, but the creator explicitly presents it as an independent course with possible errors; it must be checked against standard texts and the Atlas topic boundaries. |
| Coherent theoretical-physics notes across several prerequisites | David Tong, [Teaching](https://www.davidtong.org/teaching/) | The author-maintained archive provides connected notes for classical mechanics, electromagnetism, quantum mechanics, statistical physics, solid-state physics, kinetic theory, and the quantum Hall effect. It is useful when a learner wants consistent notation across several prerequisite pages. The levels vary from first-year undergraduate to graduate, and the archive is not an electronic-structure curriculum. |

## Existing community routes retained

The existing Theory index already includes reviewed Chinese or independent routes for quantum mechanics, electromagnetism, solid-state physics, density-functional theory, and variational/real-space numerics. These remain in place because they supply roles not duplicated by the additions above.

## Deferred or rejected candidates

- Third-party reuploads of university courses that state “unauthorized reproduction,” “remove if infringing,” or otherwise lack a verifiable publication chain. This includes several high-play-count quantum-mechanics, solid-state-physics, chemistry, and structural-chemistry playlists discovered during the review.
- Incomplete playlists with missing lectures when the missing scope cannot be checked at the original publisher.
- Exam-cram, postgraduate-exam, solved-problem, and paid short-course pages. They do not match the site's explanatory-route purpose.
- Download bundles, unofficial textbook copies, cloud-drive collections, and pages whose main value is access to copyrighted material.
- Recommendation posts that list books or courses without enough information to identify the edition, syllabus, instructor, original destination, or intended level.
- Social-platform popularity as a standalone acceptance reason.

## Learning-map decisions

The public Theory page now exposes four conditional routes instead of one universal order:

1. physics-first, for learners who need quantum states, ensembles, periodic solids, and then electronic-structure theory;
2. chemistry-first, for learners who already reason through bonding, composition, and molecular structure;
3. numerics-first, for learners who can follow the physical model but cannot yet understand discretization, SCF algorithms, or convergence;
4. advanced response and topology, for learners who already understand Kohn–Sham ground-state calculations and need spin, excitations, quasiparticles, or topological observables.

Each route stops at topic pages rather than prescribing a semester plan, completion percentage, or fixed textbook order. The route is a diagnostic connection layer; the individual pages remain authoritative for scope, resources, and limitations.

## Validation boundary

This review confirms that the accepted destinations exposed identifiable authorship and a sufficiently inspectable learning sequence on 2026-08-04. It does not independently validate every lecture statement, translation, subtitle, exercise, or future platform revision. External availability and platform access can change.
