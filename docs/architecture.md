# Electronic-Structure-Atlas Architecture

## Project Philosophy

Electronic-Structure-Atlas is a concise and rigorous knowledge base for electronic-structure theory, computational methods, and scientific tools.

The project does not aim to replace textbooks, software manuals, or research literature. It provides a structured view of the field, helping readers understand the relationships between fundamental knowledge, computational methods, and practical tools.

The content should remain focused on essential concepts, assumptions, methods, limitations, and reliable external resources.

## Information Architecture

```text
Electronic-Structure-Atlas

├── Home
├── Theory
├── Methods
├── Computational Tools
└── Reference
```

## Home

The homepage introduces electronic structure through an accessible overview.

Future design direction:

- Talos, the interactive tuxedo cow cat mascot, may serve as a visual guide throughout the homepage.
- The mascot should support navigation and exploration without replacing scientific content.
- The homepage should introduce the field, the knowledge structure, and available paths of exploration.

## Theory

Theory provides the fundamental knowledge structure required to understand electronic-structure research.

It follows the conceptual development of electronic structure rather than a simplified DFT tutorial.

```text
Theory

├── Mathematical Foundations
├── Physical Foundations
├── Chemical Foundations
├── Electronic Structure Theory
└── Learning Map
```

### Mathematical Foundations

The website introduces prerequisite subjects at the course level rather than reproducing complete university courses.

Examples:

```text
Mathematical Foundations
├── Linear Algebra
├── Calculus
├── Differential Equations
├── Numerical Methods
└── Probability and Statistics
```

Each subject page provides:

- why this subject is needed;
- recommended books and websites;
- reasons for recommendation;
- a concept map summarizing the common essential knowledge extracted from these resources;
- connections to electronic-structure theory.

The website does not reproduce the full curriculum of these subjects.

### Physical Foundations

```text
Physical Foundations
├── Classical Mechanics
├── Electromagnetism
├── Quantum Mechanics
├── Statistical Mechanics
└── Solid State Physics
```

### Chemical Foundations

```text
Chemical Foundations
├── Atomic Structure
├── Chemical Bonding
├── Molecular Orbitals
├── Periodic Trends
└── Surface Chemistry
```

### Electronic Structure Theory

```text
Electronic Structure Theory
├── Many-Electron Problem
├── Density Functional Theory
├── Hohenberg-Kohn Theory
├── Kohn-Sham Theory
├── Exchange-Correlation
├── Self-Consistent Field
├── Basis Representations
├── Plane Waves
├── Localized Basis Methods
├── Pseudopotentials and PAW
├── Brillouin-Zone Sampling
└── Electronic Structure Methods
```

### Learning Map

Learning Map is a part of Theory.

It describes dependency relationships between concepts rather than a fixed reading order.

Examples:

```text
Crystal Vector
↓
Crystal Structure
↓
Symmetry
↓
Reciprocal Space
↓
Brillouin Zone
↓
Bloch Theorem
↓
Band Structure
```

The final representation should be a knowledge graph with multiple entry points.

## Methods

Methods introduces computational and theoretical methods used in electronic-structure research.

It does not serve as a literature database and does not store detailed paper analysis.

```text
Methods

├── Structural Methods
├── Electronic Structure Analysis
├── Stability Analysis
├── Lattice Dynamics
├── Magnetic Methods
├── Surface and Interface Methods
├── Defect Methods
├── Transport Methods
├── Superconductivity Methods
└── Advanced Methods
```

Each method page may discuss:

- physical meaning;
- theoretical basis;
- computational approach;
- required inputs;
- important outputs;
- applicability;
- limitations;
- references for deeper study.

## Computational Tools

Computational Tools describes software packages, workflow systems, visualization tools, databases, and auxiliary utilities.

```text
Computational Tools

├── DFT Packages
├── Workflow Frameworks
├── Visualization Tools
├── Databases
└── Auxiliary Tools
```

Software-specific input files, output files, and validation commands belong to the corresponding software or program pages.

Example:

```text
Quantum ESPRESSO

├── Overview
├── pw.x
│   ├── Input
│   ├── Output
│   ├── Validation Commands
│   └── Common Errors
├── ph.x
└── EPW
```

## Reference

Reference provides external knowledge resources.

```text
Reference

├── Books
├── Websites
├── Software Documentation
├── Databases
├── Courses
└── Visualization Resources
```

Resources should explain their purpose and relation to the knowledge structure instead of being simple collections of links.

## Content Style

The website does not enforce a single writing style.

Different content types may use different styles:

- theory pages: textbook style;
- tool pages: documentation style;
- method pages: scientific review style;
- resource pages: concise evaluation style.

Avoid:

- unnecessary introductions;
- repetitive summaries;
- artificial learning guidance;
- excessive sectioning;
- AI-generated writing patterns.

Prefer:

- precise definitions;
- clear equations;
- physical interpretation;
- explicit assumptions;
- limitations and references.

## Technical Principles

The website remains static-first. Interactive components are used only when they provide clear explanatory value.

Large production calculations, databases requiring backend services, and computational workloads remain outside the browser.
