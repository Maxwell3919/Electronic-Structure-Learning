# Methods, Computational Tools, and Reference external-resource backlog

Baseline reviewed: `8906164574c88a6f76207c6b1cfe77a39de76b34`

This document is a reviewed inventory and integration plan. It is deliberately broader than the public site should become. Talos must verify every destination against the current remote repository and select resources by role; it must not paste this file into a page.

Priority: **P0** fills a structural site gap; **P1** high-value public addition; **P2** specialist option; **P3** Reference-only unless a specific page need appears.

---

## 1. Home: minimal ecosystem map

Home should remain short. A single compact section may point readers to durable external ecosystems that reduce duplicate work across the site. Do not turn Home into a directory.

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| H-01 | [Materials Cloud](https://www.materialscloud.org/) | Open learning, records, archives, discoverable data, AiiDA-related workflows, and electronic-structure schools. | It is an ecosystem rather than one course or one validation standard. | P1 |
| H-02 | [NOMAD](https://nomad-lab.eu/) | Materials data, parsers, provenance, APIs, and FAIR-data infrastructure. | Availability in NOMAD does not certify the scientific validity of a calculation. | P1 |
| H-03 | [Materials Project](https://materialsproject.org/) | Computed materials data, APIs, methodology, and educational access. | Database approximations, corrections, structures, and release must match the claim. | P1 |
| H-04 | [Quantum ESPRESSO](https://www.quantum-espresso.org/) | Representative open plane-wave electronic-structure ecosystem and learning portal. | One code does not define DFT as a whole. | P2 |
| H-05 | [MolSSI Education](https://education.molssi.org/) | Open computational molecular science workshops and reproducible-science training. | Molecular and workshop focus; not a universal materials curriculum. | P2 |
| H-06 | [DFT Research Workflow](https://maxwell3919.github.io/DFT-Research-Workflow/) | Project-local route from method choice to execution, convergence, validation, and provenance. | Keep detailed operational content outside Electronic Structure Atlas. | P0 |

Recommended Home implementation: no more than four external ecosystem links plus the project-local DFT Research Workflow link.

---

## 2. Methods: selective gateways only

Methods is a conceptual map. For each method family, expose at most one theory/school gateway and optionally one implementation comparison or benchmark. Detailed code lists belong to Computational Tools.

### Ground-state DFT and magnetism

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-GS-01 | [École Polytechnique DFT MOOC](https://www.coursera.org/learn/density-functional-theory) | Guided route through DFT foundations, Kohn–Sham construction, and approximations. | Advanced and enrolment/platform dependent; not a production protocol. | P1 |
| M-GS-02 | [CECAM Electronic Structure Library tutorials](https://esl.cecam.org/en/tutorials/) | Cross-code and library-oriented electronic-structure learning gateway. | Coverage changes by event and project version. | P2 |
| M-GS-03 | [Materials Cloud / Quantum ESPRESSO schools](https://www.materialscloud.org/learn/search?query=quantum%20espresso) | Maintained school archive including DFT, magnetism, phonons, and advanced methods. | Select one current school when linking page-locally. | P1 |
| M-GS-04 | [exciting tutorials](https://exciting-code.org/home/tutorials) | All-electron alternative spanning ground-state, magnetism, response, and excited states. | Code-specific LAPW route. | P2 |

### DFT+U, hybrid functionals, and dispersion

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-XC-01 | [DFT+U: Quantum ESPRESSO Hubbard input guide](https://www.quantum-espresso.org/Doc/INPUT_PW.html#idm140091782788416) | Official implementation reference for Hubbard manifolds and inputs. | Syntax and projector definitions are version-specific; U values require justification. | P2 |
| M-XC-02 | [ABINIT PAW+U tutorial](https://docs.abinit.org/tutorial/pawecutdg/) | Hands-on DFT+U/PAW route with explicit code context. | Example parameters are not transferable defaults. | P2 |
| M-XC-03 | [Libxc](https://libxc.gitlab.io/) | Functional implementation catalogue and identifiers. | Implementation availability is not accuracy evidence. | P1 |
| M-XC-04 | [DFT-D4](https://dftd4.readthedocs.io/) | Dispersion-correction theory and implementation gateway. | Must be matched to a declared parent functional and target observable. | P1 |
| M-XC-05 | [libMBD](https://libmbd.github.io/) | Many-body dispersion theory/implementation route. | MBD model and damping choices remain method-specific. | P2 |

### DFPT, phonons, and lattice response

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-PH-01 | [ABINIT DFPT tutorials](https://docs.abinit.org/topics/DFPT/) | Structured response-theory and implementation route. | ABINIT-specific perturbation and convergence settings. | P1 |
| M-PH-02 | [Quantum ESPRESSO PHonon User’s Guide](https://www.quantum-espresso.org/Doc/ph_user_guide/) | Official DFPT and phonon implementation gateway. | User-guide completion does not validate q meshes, thresholds, or harmonic assumptions. | P1 |
| M-PH-03 | [phonopy examples and documentation](https://phonopy.github.io/phonopy/) | Finite-displacement lattice-dynamics route across multiple DFT engines. | Force quality, supercell size, symmetry, and displacement amplitude remain. | P1 |
| M-PH-04 | [ALAMODE tutorials](https://alamode.readthedocs.io/en/latest/tutorial.html) | Harmonic and anharmonic force constants, SCPH, and thermal properties. | Regression, supercell, order, and sampling choices require validation. | P2 |

### Wannier and interpolation

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-WA-01 | [Wannier90 schools](https://www.materialscloud.org/learn/sections/kpbmzt/wannier90-schools) | Maintained lecture-and-hands-on gateway through gauge choice, disentanglement, interpolation, symmetry, and topology. | School exercises do not validate a new subspace or interpolation. | P1 |
| M-WA-02 | [Wannier90 tutorials](https://wannier90.readthedocs.io/en/latest/tutorials/) | Current official example index. | Versioned software examples; projection/window choices remain system-specific. | P1 |
| M-WA-03 | [WannierBerri tutorials](https://tutorial.wannier-berri.org/) | Dense-interpolation route for Berry and transport observables. | Requires a validated Wannier Hamiltonian and observable convergence. | P2 |

### NEB, reaction paths, and molecular dynamics

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-NEB-01 | [ASE NEB documentation](https://wiki.fysik.dtu.dk/ase/ase/neb.html) | Code-independent Python interface and conceptual implementation bridge. | A converged image chain covers one proposed path, not all mechanisms. | P1 |
| M-NEB-02 | [Transition State Tools for VASP](https://theory.cm.utexas.edu/vtsttools/) | Durable NEB/dimer implementation and utility gateway. | VASP-oriented and version-dependent. | P2 |
| M-MD-01 | [i-PI documentation and tutorials](https://ipi-code.org/) | Electronic-structure-independent molecular and path-integral dynamics driver. | Sampling quality, thermostatting, timestep, and force-engine accuracy remain. | P1 |
| M-MD-02 | [PLUMED tutorials](https://www.plumed-tutorials.org/) | Enhanced sampling, collective variables, and free-energy methods. | Collective variables and bias protocols define the scientific question. | P1 |
| M-MD-03 | [ASE molecular dynamics](https://wiki.fysik.dtu.dk/ase/ase/md.html) | Minimal executable MD and thermostat bridge. | Demonstration trajectories are not equilibrated ensemble evidence. | P2 |

### GW, BSE, TDDFT, and correlated methods

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-GW-01 | [BerkeleyGW tutorials](https://berkeleygw.org/documentation/tutorial/) | Maintained GW/BSE workflow gateway. | Software-specific and no universal convergence values. | P1 |
| M-GW-02 | [Yambo tutorials](https://www.yambo-code.eu/wiki/index.php?title=Tutorials) | Alternative open GW/BSE/TDDFT/spectral route. | Some materials and variables are version-bound. | P1 |
| M-GW-03 | [WEST](https://west-code.org/) | Large-scale many-body perturbation and spectral calculations. | Specialist algorithms and HPC requirements. | P2 |
| M-TD-01 | [Octopus tutorials](https://octopus-code.org/main/tutorials/) | Real-time and linear-response TDDFT gateway. | Grid, boundary, propagation, broadening, and functional choices remain. | P1 |
| M-DMFT-01 | [TRIQS tutorials](https://triqs.github.io/triqs/latest/tutorials.html) | Green-function, impurity-solver, and DMFT learning ecosystem. | Impurity construction and double-counting are scientific model choices. | P1 |

### Electron–phonon, superconductivity, and transport

| ID | Resource | Suggested role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| M-EP-01 | [EPW documentation and schools](https://docs.epw-code.org/) | Wannier-interpolated electron–phonon, transport, superconductivity, and spectral calculations. | Requires converged electronic/phonon states, interpolation, meshes, and Coulomb assumptions. | P1 |
| M-EP-02 | [Perturbo tutorials](https://perturbo-code.github.io/mydoc_tutorials.html) | Electron–phonon scattering, mobility, dynamics, and ultrafast carrier route. | Interface, interpolation, temperature, and scattering approximations remain. | P1 |
| M-TR-01 | [BoltzTraP2](https://gitlab.com/sousaw/BoltzTraP2) | Semiclassical band-transport implementation gateway. | Relaxation-time and interpolation assumptions must be declared. | P1 |
| M-TR-02 | [Phoebe](https://phoebe.readthedocs.io/) | Electron and phonon Boltzmann transport from first principles. | Dense interpolation and scattering models require stringent convergence. | P2 |
| M-TR-03 | [ShengBTE](https://www.shengbte.org/) | Anharmonic phonon thermal-transport gateway. | Force-constant, q-mesh, isotope, and iterative-solver convergence remain. | P2 |

---

## 3. Computational Tools: proposed public taxonomy

Computational Tools is currently the largest structural gap. The page should be organized by scientific role, not by popularity or alphabetical software name. A concise public description should explain what each tool class does and link to a reviewed official destination. Detailed commands remain in DFT Research Workflow or code-specific documentation.

### 3.1 Electronic-structure engines

#### Plane-wave and pseudopotential/PAW engines

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-ENG-01 | [Quantum ESPRESSO](https://www.quantum-espresso.org/) | Open plane-wave DFT/DFPT, phonons, electron–phonon, spectroscopy, and post-processing ecosystem. | Input success and SCF convergence do not validate representation or observables. | P0 |
| CT-ENG-02 | [ABINIT](https://www.abinit.org/) | Plane-wave PAW/pseudopotential DFT, DFPT, GW/BSE, DMFT, and advanced response. | Code-specific workflows and dataset compatibility remain. | P0 |
| CT-ENG-03 | [VASP](https://www.vasp.at/) | Widely used commercial plane-wave PAW electronic-structure engine. | Licensed access; official documentation should remain version-linked and no licensed content copied. | P1 |
| CT-ENG-04 | [JDFTx](https://jdftx.org/) | Plane-wave DFT with continuum solvation, electrochemistry, surfaces, and advanced properties. | Specialist conventions and version-specific tutorials. | P2 |
| CT-ENG-05 | [CASTEP](https://www.castep.org/) | Plane-wave materials simulation with geometry, phonons, spectroscopy, and properties. | Licensing and distribution conditions vary. | P2 |

#### All-electron and atom-centred engines

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-ENG-06 | [FHI-aims](https://fhi-aims.org/) | Numeric atom-centred all-electron DFT and beyond-DFT for molecules and solids. | Access terms, basis tiers, grids, and version-specific settings must be stated. | P0 |
| CT-ENG-07 | [exciting](https://exciting-code.org/) | Open full-potential LAPW ground-state, response, spectroscopy, GW/BSE, and materials properties. | LAPW numerical parameters and code version require convergence. | P1 |
| CT-ENG-08 | [Elk](https://elk.sourceforge.io/) | Open full-potential LAPW electronic structure. | Smaller teaching/documentation ecosystem; select maintained guides. | P2 |
| CT-ENG-09 | [WIEN2k](https://www.wien2k.at/) | Full-potential LAPW materials simulation. | Licensed software and version-specific manual. | P2 |
| CT-ENG-10 | [FLEUR](https://www.flapw.de/) | Full-potential LAPW, magnetism, films, SOC, response, and Wannier interfaces. | Specialist setup and convergence. | P2 |

#### Localized-orbital and mixed-representation engines

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-ENG-11 | [SIESTA](https://siesta-project.org/) | Numerical atomic orbitals, pseudopotentials, large systems, transport interfaces, and rich tutorials. | Basis labels and confinement are code-specific. | P0 |
| CT-ENG-12 | [CP2K](https://www.cp2k.org/) | Gaussian/plane-wave and Gaussian/augmented-plane-wave simulations for molecules, liquids, solids, MD, and embedding. | Basis/potential pairs, grids, SCF, and method settings require code-specific validation. | P0 |
| CT-ENG-13 | [DFTB+](https://dftbplus.org/) | Density-functional tight binding for large systems and dynamics. | Parameter sets are versioned scientific inputs with limited transferability. | P1 |
| CT-ENG-14 | [OpenMX](https://www.openmx-square.org/) | Localized pseudoatomic-orbital DFT, transport, and materials calculations. | Verify current documentation, datasets, and license. | P2 |
| CT-ENG-15 | [CONQUEST](https://www.order-n.org/) | Large-scale localized-orbital and linear-scaling DFT. | Specialist installation and convergence. | P2 |

#### Real-space, finite-element, and wavelet engines

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-ENG-16 | [GPAW](https://gpaw.readthedocs.io/) | PAW with finite-difference, plane-wave, and LCAO modes; broad tutorials and Python integration. | Agreement among modes and observable convergence must be tested. | P0 |
| CT-ENG-17 | [Octopus](https://octopus-code.org/) | Real-space ground-state, TDDFT, optimal control, and response for finite and periodic systems. | Boundary, grid, propagation, and functional choices remain. | P0 |
| CT-ENG-18 | [DFT-FE](https://dftfe.org/) | High-order finite-element DFT for large and complex systems. | Advanced HPC code and finite-element convergence. | P2 |
| CT-ENG-19 | [SPARC](https://sparc-x.github.io/) | Real-space finite-difference DFT and materials calculations. | Specialist documentation and release compatibility. | P2 |
| CT-ENG-20 | [BigDFT](https://bigdft-suite.readthedocs.io/) | Wavelet electronic structure, fragments, localization, and workflows. | Representation-specific convergence and ecosystem version. | P2 |
| CT-ENG-21 | [MRChem](https://mrchem.readthedocs.io/) | Multiwavelet molecular electronic structure and response. | Molecular focus and specialist setup. | P2 |

### 3.2 Molecular quantum chemistry and correlated wavefunction engines

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-QC-01 | [PySCF](https://pyscf.org/) | Python molecular and periodic HF/DFT, correlated wavefunction, response, embedding, and multireference toolkit. | Python flexibility does not remove basis/method convergence or stability analysis. | P0 |
| CT-QC-02 | [Psi4](https://psicode.org/) | Open molecular quantum chemistry, education, high-level energies, gradients, and properties. | Molecular Gaussian-basis focus. | P0 |
| CT-QC-03 | [NWChem](https://nwchemgit.github.io/) | Open scalable molecular/periodic quantum chemistry and molecular dynamics. | Method modules and parallel behaviour vary. | P1 |
| CT-QC-04 | [GAMESS (US)](https://www.msg.chem.iastate.edu/gamess/) | Long-standing molecular electronic-structure suite. | Distribution and version-specific documentation. | P2 |
| CT-QC-05 | [ORCA](https://www.faccts.de/orca/) | Broad molecular DFT, correlated, spectroscopic, and relativistic methods. | License and version-specific manual; do not copy restricted content. | P1 |
| CT-QC-06 | [TURBOMOLE](https://www.turbomole.org/) | Commercial molecular electronic-structure and response suite. | Licensed access. | P2 |
| CT-QC-07 | [CFOUR](https://cfour.uni-mainz.de/cfour/) | High-accuracy coupled-cluster spectroscopy and properties. | Specialist finite-molecule focus and demanding basis convergence. | P2 |
| CT-QC-08 | [MRCC](https://www.mrcc.hu/) | High-level coupled-cluster and multireference calculations. | License/access and high computational cost. | P2 |
| CT-QC-09 | [BAGEL](https://nubakery.org/) | Relativistic and multireference quantum chemistry. | Specialist setup and active-space choices. | P2 |
| CT-QC-10 | [Chronus Quantum](https://urania.chem.washington.edu/chronusq/) | Relativistic, magnetic, and response-oriented quantum chemistry. | Specialist and rapidly evolving. | P2 |

### 3.3 Quantum Monte Carlo and stochastic many-electron tools

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-QMC-01 | [QMCPACK](https://qmcpack.readthedocs.io/) | VMC/DMC for molecules and solids with extensive tutorials. | Trial-wavefunction, fixed-node, pseudopotential, finite-size, and statistical errors. | P1 |
| CT-QMC-02 | [CASINO](https://vallico.net/casinoqmc/) | Continuum quantum Monte Carlo suite. | Access and documentation conditions should be checked. | P2 |
| CT-QMC-03 | [TurboRVB](https://turborvb.sissa.it/) | Variational and diffusion Monte Carlo with wavefunction optimization. | Specialist workflow and statistical control. | P2 |
| CT-QMC-04 | [NECI](https://www.neci.readthedocs.io/) | FCIQMC and stochastic correlated wavefunction methods. | Advanced and finite-basis/model specific. | P2 |
| CT-QMC-05 | [HANDE-QMC](https://hande.readthedocs.io/) | FCIQMC, CCMC, and finite-temperature stochastic methods. | Population-control, initiator, and statistical errors. | P2 |

### 3.4 Structure, symmetry, cells, and reciprocal-space utilities

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-STR-01 | [ASE](https://wiki.fysik.dtu.dk/ase/) | Structures, calculators, builders, optimization, MD, NEB, databases, and code interfaces. | Convenience layer; calculator execution is not scientific validation. | P0 |
| CT-STR-02 | [pymatgen](https://pymatgen.org/) | Materials structures, transformations, phase diagrams, defects, interfaces, input/output, and APIs. | Algorithms and defaults require method-specific review. | P0 |
| CT-STR-03 | [spglib](https://spglib.readthedocs.io/) | Symmetry detection, primitive/standard cells, and reciprocal meshes. | Tolerance-dependent and magnetic/SOC constraints matter. | P0 |
| CT-STR-04 | [SeeK-path](https://seekpath.readthedocs.io/) | Standard cells and conventional k paths. | Band paths are not integration meshes or global extrema searches. | P1 |
| CT-STR-05 | [Bilbao Crystallographic Server](https://www.cryst.ehu.es/) | Space groups, subgroups, representations, k vectors, magnetic groups, and crystallographic tools. | Correct setting and physical-model symmetry remain essential. | P0 |
| CT-STR-06 | [ISOTROPY](https://iso.byu.edu/) | Symmetry modes, subgroups, distortions, and phase-transition analysis. | Symmetry-allowed modes do not determine energetics. | P1 |
| CT-STR-07 | [AFLOW Prototype Encyclopedia](https://aflow.org/prototype-encyclopedia/) | Structure-prototype catalogue and standardized labels. | Prototype assignment does not prove stability. | P1 |
| CT-STR-08 | [atomman](https://www.ctcms.nist.gov/potentials/atomman/) | Atomistic structures, defects, dislocations, and simulation preparation. | Often classical-atomistic focus; calculator/model must be declared. | P2 |
| CT-STR-09 | [icet](https://icet.materialsmodeling.org/) | Cluster expansions, alloys, configurations, and Monte Carlo. | Training data, truncation, cross-validation, and phase space determine validity. | P1 |
| CT-STR-10 | [CASM](https://prisms-center.github.io/CASMcode_docs/) | Cluster expansion and configurational thermodynamics. | Model and training-domain limitations. | P2 |

### 3.5 Workflow, provenance, and automation systems

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-WF-01 | [AiiDA](https://www.aiida.net/) | Provenance-native workflows, remote execution, databases, plugins, and reproducibility. | Provenance records what ran; it does not make the scientific protocol valid. | P0 |
| CT-WF-02 | [AiiDA tutorials](https://aiida-tutorials.readthedocs.io/) | Maintained learning route for data, processes, provenance, and HPC execution. | Tutorial examples are not production scientific protocols. | P0 |
| CT-WF-03 | [atomate2](https://materialsproject.github.io/atomate2/) | Materials workflows built on jobflow, pymatgen, FireWorks-compatible ecosystems, and multiple engines. | Workflow defaults and task schemas require scientific review. | P0 |
| CT-WF-04 | [jobflow](https://materialsproject.github.io/jobflow/) | Python job graph and dynamic workflow infrastructure. | General orchestration layer rather than scientific validation. | P1 |
| CT-WF-05 | [pyiron](https://pyiron.org/) | Integrated atomistic simulation environment, workflows, storage, and multiple engines. | Environment consistency and workflow choices remain. | P0 |
| CT-WF-06 | [signac](https://signac.io/) | Lightweight data-space and workflow management for computational research. | General workflow framework, not a DFT protocol. | P2 |
| CT-WF-07 | [FireWorks](https://materialsproject.github.io/fireworks/) | Workflow automation used in materials-science infrastructures. | Legacy/current role should be stated relative to jobflow/atomate2. | P2 |
| CT-WF-08 | [Parsl](https://parsl-project.org/) | Python parallel scripting and distributed workflow execution. | General infrastructure and executor configuration. | P2 |
| CT-WF-09 | [Snakemake](https://snakemake.readthedocs.io/) | Reproducible file-based scientific pipelines. | File completion does not prove calculation correctness. | P2 |
| CT-WF-10 | [Nextflow](https://www.nextflow.io/) | Portable dataflow pipelines and container integration. | General infrastructure; not materials-specific. | P3 |
| CT-WF-11 | [Common Workflow Language](https://www.commonwl.org/) | Portable declarative workflow standard. | Adoption and scientific schemas vary. | P3 |

### 3.6 Data repositories, databases, and interoperability

#### General materials databases

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-DB-01 | [Materials Project](https://materialsproject.org/) | Computed structures, energies, bands, phonons, elasticity, surfaces, molecules, APIs, and methodology. | Database release, correction scheme, task lineage, and property method must match the claim. | P0 |
| CT-DB-02 | [NOMAD](https://nomad-lab.eu/) | Parsed calculations, raw data, schemas, APIs, workflows, and FAIR infrastructure. | Parser availability and uploaded provenance do not guarantee scientific adequacy. | P0 |
| CT-DB-03 | [Materials Cloud](https://www.materialscloud.org/) | Learn, Work, Discover, Explore, and Archive ecosystem. | Records differ in scope and validation. | P0 |
| CT-DB-04 | [OQMD](https://oqmd.org/) | Large computed thermodynamic and structural materials database. | Methodology and release must be cited. | P1 |
| CT-DB-05 | [AFLOW](https://aflow.org/) | Computed materials data, prototypes, standards, and APIs. | Standardization and calculation settings differ from other databases. | P1 |
| CT-DB-06 | [JARVIS](https://jarvis.nist.gov/) | NIST materials data, DFT, force fields, ML, quantum computing, and tools. | Property-specific methodology and dataset version remain. | P1 |
| CT-DB-07 | [C2DB](https://cmr.fysik.dtu.dk/c2db/c2db.html) | Computed two-dimensional materials and properties. | Screening criteria, stability levels, and method approximations must be explicit. | P1 |
| CT-DB-08 | [Computational Materials Repository](https://cmr.fysik.dtu.dk/) | DTU databases including C2DB and related datasets. | Dataset-specific methodology. | P1 |
| CT-DB-09 | [MaterialsWeb](https://materialsweb.org/) | Materials data and analysis ecosystem. | Check current maintenance and dataset scope. | P2 |
| CT-DB-10 | [MatCloud](https://matcloud.cnic.cn/) | Chinese materials-computation data and services ecosystem. | Dataset provenance and access conditions vary. | P2 |

#### Experimental crystallographic and molecular databases

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-DB-11 | [Crystallography Open Database](https://www.crystallography.net/cod/) | Open experimental crystal structures. | Deposited structure quality and disorder require review. | P0 |
| CT-DB-12 | [ICSD](https://icsd.products.fiz-karlsruhe.de/) | Curated inorganic crystal structures. | Licensed access. | P1 |
| CT-DB-13 | [Cambridge Structural Database](https://www.ccdc.cam.ac.uk/solutions/software/csd/) | Molecular and molecular-crystal structures. | Licensed access and terms. | P1 |
| CT-DB-14 | [Protein Data Bank](https://www.rcsb.org/) | Macromolecular structures and metadata. | Experimental uncertainty, protonation, disorder, and biological assembly require interpretation. | P2 |
| CT-DB-15 | [PubChem](https://pubchem.ncbi.nlm.nih.gov/) | Molecular identifiers, structures, properties, and assays. | Aggregated data quality and molecular form vary. | P2 |
| CT-DB-16 | [NIST CCCBDB](https://cccbdb.nist.gov/) | Small-molecule calculated and experimental comparison data. | Coverage and method sets are finite. | P1 |

#### Spectroscopic and thermochemical databases

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-DB-17 | [NIST Atomic Spectra Database](https://physics.nist.gov/asd) | Evaluated atomic levels and transitions. | Reference data, not a solver. | P1 |
| CT-DB-18 | [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/) | Thermochemistry, spectra, and physical properties. | Phase, temperature, uncertainty, and coverage vary. | P1 |
| CT-DB-19 | [HITRAN](https://hitran.org/) | Molecular line parameters. | Domain and access conditions must be matched. | P2 |
| CT-DB-20 | [ExoMol](https://www.exomol.com/) | High-temperature molecular line lists. | Astrophysical/high-temperature focus. | P2 |

#### Interoperability

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-DB-21 | [OPTIMADE](https://www.optimade.org/) | Common API specification for materials databases. | Normalized fields do not erase source-database methodology differences. | P0 |
| CT-DB-22 | [OPTIMADE providers](https://providers.optimade.org/) | Discoverable provider registry. | Provider availability and schema coverage vary. | P1 |
| CT-DB-23 | [ASE database](https://wiki.fysik.dtu.dk/ase/ase/db/db.html) | Lightweight local structure/result database. | Local schema and provenance discipline are user responsibilities. | P2 |
| CT-DB-24 | [HDF5](https://www.hdfgroup.org/solutions/hdf5/) | Durable hierarchical scientific-data container. | File format alone does not define scientific metadata or provenance. | P3 |

### 3.7 Phonons, anharmonicity, electron–phonon, and transport

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-PH-01 | [phonopy](https://phonopy.github.io/phonopy/) | Harmonic force constants, phonons, thermodynamics, symmetry, and many engine interfaces. | Supercell, forces, displacement, q mesh, and non-analytic corrections remain. | P0 |
| CT-PH-02 | [phono3py](https://phonopy.github.io/phono3py/) | Anharmonic force constants and lattice thermal conductivity. | Third-order sampling, supercells, q meshes, isotope and solver convergence. | P0 |
| CT-PH-03 | [ALAMODE](https://alamode.readthedocs.io/) | Harmonic/anharmonic force constants, SCPH, thermal conductivity, and regression. | Model order and training configuration must be validated. | P1 |
| CT-PH-04 | [ShengBTE](https://www.shengbte.org/) | Iterative phonon Boltzmann transport. | Depends on converged harmonic/anharmonic inputs. | P1 |
| CT-PH-05 | [hiPhive](https://hiphive.materialsmodeling.org/) | Machine-learned force constants and sampling. | Training-domain, regularization, symmetry, and validation remain. | P1 |
| CT-PH-06 | [TDEP](https://ollehellman.github.io/) | Temperature-dependent effective potentials and anharmonic phonons. | Ensemble sampling and model fit determine validity. | P2 |
| CT-PH-07 | [SSCHA](https://sscha.eu/) | Stochastic self-consistent harmonic approximation. | Sampling, supercells, force quality, and free-energy minimization convergence. | P2 |
| CT-EP-01 | [EPW](https://docs.epw-code.org/) | Wannier-interpolated electron–phonon, superconductivity, transport, and spectra. | Dense meshes, interpolation, Coulomb parameters, and code interfaces. | P0 |
| CT-EP-02 | [Perturbo](https://perturbo-code.github.io/) | Carrier dynamics, electron–phonon scattering, mobility, and ultrafast properties. | Requires validated interpolation and scattering approximations. | P0 |
| CT-EP-03 | [elphbolt](https://github.com/nakib/elphbolt) | Coupled electron–phonon Boltzmann transport. | Specialist workflows and convergence. | P2 |
| CT-TR-01 | [BoltzTraP2](https://gitlab.com/sousaw/BoltzTraP2) | Semiclassical band transport and interpolation. | Relaxation-time and rigid-band assumptions. | P0 |
| CT-TR-02 | [Phoebe](https://phoebe.readthedocs.io/) | Electron and phonon Boltzmann transport. | Very dense interpolation and scattering convergence. | P1 |
| CT-TR-03 | [AMSET](https://hackingmaterials.lbl.gov/amset/) | Electronic transport with explicit scattering models. | Scattering inputs, dielectric/elastic data, and band interpolation determine results. | P1 |
| CT-TR-04 | [WannierBerri](https://wannier-berri.org/) | Berry-phase and transport observables from Wannier interpolation. | Requires validated subspace and dense-mesh convergence. | P1 |

### 3.8 Defects, disorder, surfaces, interfaces, and reactions

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-DEF-01 | [pymatgen-analysis-defects](https://materialsproject.github.io/pymatgen-analysis-defects/) | Defect generation, analysis, charge corrections, and thermodynamics support. | Structure generation and correction formulas do not replace finite-size and chemical-potential validation. | P0 |
| CT-DEF-02 | [doped](https://doped.readthedocs.io/) | Defect setup, parsing, corrections, formation energies, and chemical-potential workflows. | Code interfaces and approximation stack must be declared. | P0 |
| CT-DEF-03 | [ShakeNBreak](https://shakenbreak.readthedocs.io/) | Symmetry-breaking structure searches for defect ground states. | Sampling improves candidate coverage but does not prove global completeness. | P0 |
| CT-DEF-04 | [sxdefectalign](https://sxrepo.mpie.de/projects/sphinx-add-ons/files) | Charged-defect finite-size correction tools. | Correction model and dielectric/electrostatic conventions must match the calculation. | P2 |
| CT-DEF-05 | [PyCDT](https://github.com/mbkumar/pycdt) | Earlier defect workflow toolkit. | Maintenance status and compatibility should be checked; prefer current tools when possible. | P3 |
| CT-SURF-01 | [ASE surface builders](https://wiki.fysik.dtu.dk/ase/ase/build/surface.html) | Slab, surface, adsorbate, and interface construction. | Geometry creation does not choose a valid physical model. | P0 |
| CT-SURF-02 | [pymatgen interfaces](https://pymatgen.org/pymatgen.analysis.interfaces.html) | Interface matching, grain boundaries, substrates, and slabs. | Geometric match is not energetic stability. | P1 |
| CT-SURF-03 | [CatKit](https://catkit.readthedocs.io/) | Catalysis structures, adsorption sites, and workflows. | Maintenance status and dependencies should be checked. | P2 |
| CT-SURF-04 | [CatMAP](https://catmap.readthedocs.io/) | Microkinetic modelling. | Mechanism, thermodynamics, barriers, and kinetic assumptions remain. | P1 |
| CT-SURF-05 | [Catalysis-Hub](https://www.catalysis-hub.org/) | Open adsorption/reaction database and API. | Calculation methods, references, coverage, and surface models vary. | P0 |
| CT-SURF-06 | [Open Catalyst Project](https://opencatalystproject.org/) | Large catalyst datasets and ML benchmarks. | ML predictions require domain and first-principles validation. | P1 |
| CT-REA-01 | [ASE NEB](https://wiki.fysik.dtu.dk/ase/ase/neb.html) | Minimum-energy paths and transition-state interfaces. | One path is not mechanism completeness. | P0 |
| CT-REA-02 | [Sella](https://github.com/zadorlab/sella) | Geometry optimization and saddle-point searches. | Hessian/model/calculator quality and search initialization remain. | P2 |
| CT-REA-03 | [geomeTRIC](https://geometric.readthedocs.io/) | Molecular geometry and transition-state optimization. | Molecular focus and calculator dependence. | P2 |

### 3.9 Bonding, charge, topology, and post-processing

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-AN-01 | [Critic2](https://aoterodelaroza.github.io/critic2/) | Density topology, basins, critical points, ELF and periodic analyses. | QTAIM/topological partition is one interpretation model. | P0 |
| CT-AN-02 | [LOBSTER](https://www.cohp.de/) | COHP/COOP, projected DOS, charges, and chemical bonding from plane-wave data. | Projection/reconstruction quality and basis completeness must be assessed. | P0 |
| CT-AN-03 | [Multiwfn](http://sobereva.com/multiwfn/) | Broad molecular/periodic wavefunction and density analysis. | Every analysis has its own definitions and limitations. | P0 |
| CT-AN-04 | [Chargemol](https://sourceforge.net/projects/ddec/) | DDEC charges, bond orders, and density-derived properties. | Versioned partitioning method, not formal oxidation state. | P1 |
| CT-AN-05 | [Henkelman Bader code](https://theory.cm.utexas.edu/henkelman/code/bader/) | Bader basin partitioning from real-space densities. | Grid and reference-density convergence. | P1 |
| CT-AN-06 | [PyProcar](https://pyprocar.readthedocs.io/) | Bands, Fermi surfaces, spin textures, projections, and multiple code interfaces. | Post-processing accuracy depends on underlying projections and k sampling. | P0 |
| CT-AN-07 | [sumo](https://smtg-bham.github.io/sumo/) | Publication-oriented band/DOS/phonon plotting and k paths. | Plot quality is not scientific validation. | P0 |
| CT-AN-08 | [pymatgen electronic_structure](https://pymatgen.org/pymatgen.electronic_structure.html) | Programmatic bands, DOS, projections, and plotting. | Parser and convention compatibility. | P1 |
| CT-AN-09 | [BoltzTraP2](https://gitlab.com/sousaw/BoltzTraP2) | Transport interpolation and coefficients. | See transport boundary above. | P1 |
| CT-TOP-01 | [WannierTools](https://www.wanniertools.org/) | Surface states, Weyl points, Wilson loops, spin textures, and topological analysis. | Requires validated tight-binding/Wannier Hamiltonian. | P0 |
| CT-TOP-02 | [Z2Pack](https://z2pack.greschd.ch/) | Hybrid Wannier charge centres and topological invariants. | Gap, subspace, symmetry, and convergence must be established. | P0 |
| CT-TOP-03 | [WannierBerri](https://wannier-berri.org/) | Berry curvature and related transport/response quantities. | Dense interpolation and subspace convergence. | P0 |
| CT-TOP-04 | [irvsp](https://github.com/zjwang11/irvsp) | Symmetry representations from selected ab initio outputs. | Interface/version, SOC, magnetic symmetry, and degeneracies. | P1 |
| CT-TOP-05 | [qeirreps](https://github.com/giovannipizzi/qeirreps) | Quantum ESPRESSO irreducible representations. | Compatibility and numerical degeneracies must be checked. | P2 |

### 3.10 Visualization and interactive inspection

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-VIS-01 | [VESTA](https://jp-minerals.org/vesta/en/) | Crystal structures, volumetric data, densities, and publication graphics. | Visualization choices do not validate structure or density interpretation. | P0 |
| CT-VIS-02 | [OVITO](https://www.ovito.org/) | Atomistic trajectories, defects, neighbour analysis, and visualization. | Analysis pipelines depend on thresholds and model assumptions. | P0 |
| CT-VIS-03 | [XCrySDen](http://www.xcrysden.org/) | Crystal, reciprocal-space, Fermi-surface, and density visualization. | Older ecosystem; check platform compatibility. | P2 |
| CT-VIS-04 | [Jmol](https://jmol.sourceforge.net/) | Open molecular and crystal visualization. | Visualization only. | P2 |
| CT-VIS-05 | [nglview](https://nglviewer.org/nglview/latest/) | Notebook-based molecular and materials visualization. | Browser rendering does not preserve all scientific metadata automatically. | P2 |
| CT-VIS-06 | [py3Dmol](https://3dmol.csb.pitt.edu/) | Lightweight notebook/web molecular visualization. | Primarily visualization. | P2 |
| CT-VIS-07 | [ParaView](https://www.paraview.org/) | Large-scale scientific fields, meshes, and volumetric visualization. | General-purpose tool and data-conversion correctness matter. | P2 |
| CT-VIS-08 | [Mayavi](https://docs.enthought.com/mayavi/mayavi/) | Python scientific 3D visualization. | Maintenance and GUI environment should be checked. | P3 |

### 3.11 HPC, environments, testing, and reproducibility

| ID | Tool | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| CT-HPC-01 | [Slurm documentation](https://slurm.schedmd.com/documentation.html) | Dominant HPC scheduler concepts and commands. | Scheduler success does not verify numerical or scientific correctness. | P0 |
| CT-HPC-02 | [Open MPI documentation](https://docs.open-mpi.org/) | Distributed-memory parallel execution. | Build/runtime compatibility and scaling must be tested. | P1 |
| CT-HPC-03 | [MPI tutorial](https://mpitutorial.com/) | Accessible MPI programming concepts. | General programming route, not code-specific performance guidance. | P2 |
| CT-HPC-04 | [Spack](https://spack.readthedocs.io/) | Reproducible HPC package builds and dependency variants. | Build hashes and recipes do not guarantee numerical equivalence across compilers/hardware. | P0 |
| CT-HPC-05 | [EasyBuild](https://docs.easybuild.io/) | HPC software build and module framework. | Environment construction rather than scientific validation. | P1 |
| CT-HPC-06 | [conda-forge](https://conda-forge.org/) | Community package distribution and environments. | Solver resolution and binary builds should be recorded. | P1 |
| CT-HPC-07 | [Apptainer](https://apptainer.org/docs/) | HPC-compatible containers. | Containers improve environment capture but cannot capture external services, hardware, or scientific adequacy. | P0 |
| CT-HPC-08 | [Docker](https://docs.docker.com/) | Containerized local/cloud environments. | HPC support and reproducibility boundaries differ from Apptainer. | P2 |
| CT-HPC-09 | [Quantum Mobile](https://quantum-mobile.readthedocs.io/) | Preconfigured virtual machine with electronic-structure and workflow tools. | Educational image versions age and are not production validation. | P1 |
| CT-HPC-10 | [pytest](https://docs.pytest.org/) | Automated scientific-software testing. | Passing tests cover only encoded expectations. | P1 |
| CT-HPC-11 | [ASV](https://asv.readthedocs.io/) | Performance benchmarking across revisions. | Performance stability does not imply numerical/scientific correctness. | P2 |
| CT-HPC-12 | [ReFrame](https://reframe-hpc.readthedocs.io/) | HPC regression and system testing. | System tests require scientifically meaningful reference outputs. | P2 |
| CT-HPC-13 | [DVC](https://dvc.org/doc) | Versioning data and pipeline stages. | Data hashes do not replace metadata, licensing, or provenance interpretation. | P2 |
| CT-HPC-14 | [Git LFS](https://git-lfs.com/) | Large-file versioning. | Avoid adding bulk scientific outputs to this repository. | P3 |
| CT-HPC-15 | [Zenodo](https://zenodo.org/) | DOI-based release and research-artifact archiving. | Archive description, licensing, and completeness remain author responsibilities. | P1 |
| CT-HPC-16 | [Software Heritage](https://www.softwareheritage.org/) | Long-term source-code preservation. | Preserves source, not necessarily executable environments or data. | P2 |

### Recommended Computational Tools public structure

1. Electronic-structure engines
2. Molecular and many-body engines
3. Structure, symmetry, and cell tools
4. Workflow and provenance systems
5. Databases and interoperability
6. Phonon, electron–phonon, and transport tools
7. Defects, surfaces, interfaces, and reaction paths
8. Bonding, charge, topology, and post-processing
9. Visualization
10. HPC, environments, testing, and preservation

For the first public pass, expose roughly 3–8 tools per category. Keep the larger alternative inventory in Reference or this audit.

---

## 4. Reference: durable reviewed collections

Reference should index durable collections and explain why they are useful. It should not duplicate every page-local resource paragraph.

### 4.1 Core electronic-structure textbooks and notes

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| R-BOOK-01 | Richard M. Martin, *Electronic Structure: Basic Theory and Practical Methods*, 2nd ed. | Main solid-state electronic-structure theory spine. | Commercial/institutional access; do not copy text or figures. | P0 |
| R-BOOK-02 | Sholl and Steckel, *Density Functional Theory: A Practical Introduction* | Accessible DFT and plane-wave practice bridge. | Introductory and not a full validation protocol. | P0 |
| R-BOOK-03 | Helgaker, Jørgensen, Olsen, *Molecular Electronic-Structure Theory* | Rigorous molecular integrals, HF, correlation, and response reference. | Advanced and commercial. | P1 |
| R-BOOK-04 | Szabo and Ostlund, *Modern Quantum Chemistry* | Standard molecular HF/post-HF introduction. | Older computational conventions and commercial access. | P1 |
| R-BOOK-05 | Parr and Yang, *Density-Functional Theory of Atoms and Molecules* | Foundational DFT reference. | Historical focus; later developments require additional sources. | P1 |
| R-BOOK-06 | Dreizler and Gross, *Density Functional Theory* | Formal DFT and response reference. | Advanced and commercial. | P2 |
| R-BOOK-07 | Giuliani and Vignale, *Quantum Theory of the Electron Liquid* | Electron gas, response, screening, and many-body reference. | Advanced. | P2 |
| R-BOOK-08 | Mahan, *Many-Particle Physics* | Green functions, response, electron–phonon, and many-body methods. | Advanced and commercial. | P2 |
| R-BOOK-09 | Marzari et al., *Maximally localized Wannier functions: Theory and applications* | Durable Wannier review article. | Review does not validate a specific construction. | P1 |
| R-BOOK-10 | Resta, *Macroscopic polarization in crystalline dielectrics* and related modern-theory reviews | Berry-phase polarization and gauge reference. | Formal review; implementation/convergence remain. | P2 |
| R-BOOK-11 | David Tong lecture notes collection](https://www.damtp.cam.ac.uk/user/tong/teaching.html) | Open notes spanning dynamics, QM, statistical physics, solids, and QFT. | Notes vary in prerequisite level. | P1 |
| R-BOOK-12 | [Feynman Lectures](https://www.feynmanlectures.caltech.edu/) | Open conceptual physics companion. | Not a substitute for a modern technical course in every topic. | P2 |

### 4.2 Open textbooks and general learning hubs

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| R-EDU-01 | [MIT OpenCourseWare](https://ocw.mit.edu/) | Durable courses, notes, problems, and videos across mathematics, physics, chemistry, and computing. | Select specific courses; the portal itself is not a recommendation. | P0 |
| R-EDU-02 | [NPTEL](https://nptel.ac.in/) | Large open university-course catalogue in science and engineering. | Course age, instructors, depth, and access vary. | P0 |
| R-EDU-03 | [中国国家高等教育智慧教育平台](https://higher.smartedu.cn/) | Chinese university courses and teaching teams. | Platform access and course availability can change. | P0 |
| R-EDU-04 | [Materials Cloud Learn](https://www.materialscloud.org/learn) | Electronic-structure schools, lectures, and hands-on material. | Event software and exercises are version-bound. | P0 |
| R-EDU-05 | [MolSSI Education](https://education.molssi.org/) | Open computational molecular science workshops and notebooks. | Workshop-specific environments and molecular emphasis. | P0 |
| R-EDU-06 | [nanoHUB courses](https://nanohub.org/resources/courses) | Interactive nanoscience and materials courses with simulation tools. | Registration/tool availability and course versions vary. | P1 |
| R-EDU-07 | [Chemistry LibreTexts](https://chem.libretexts.org/) | Open chemistry books and modules. | Heterogeneous quality; link to specific coherent books. | P1 |
| R-EDU-08 | [OpenStax](https://openstax.org/subjects/science) | Open foundational science textbooks. | Foundational level. | P1 |
| R-EDU-09 | [cond-mat.de events and lecture notes](https://www.cond-mat.de/events/) | Advanced condensed-matter and many-body school archive. | Select specific schools and retain date. | P1 |
| R-EDU-10 | [ICTP scientific calendar](https://indico.ictp.it/) | Schools, workshops, and lecture materials. | Search and event links can be ephemeral; prefer stable archives. | P2 |

### 4.3 Official code tutorial portals

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| R-CODE-01 | [Quantum ESPRESSO Learn](https://www.quantum-espresso.org/learn/) | Official tutorials and schools. | Version-specific. | P0 |
| R-CODE-02 | [ABINIT tutorials](https://docs.abinit.org/tutorial/) | Structured official tutorial sequence. | Version-specific. | P0 |
| R-CODE-03 | [SIESTA tutorials](https://docs.siesta-project.org/projects/siesta/en/stable/tutorials/) | Official broad tutorial collection. | Basis and code conventions remain. | P0 |
| R-CODE-04 | [FHI-aims tutorials](https://fhi-aims-club.gitlab.io/tutorials/tutorials-overview/) | All-electron and beyond-DFT tutorial hub. | Access/version boundaries. | P0 |
| R-CODE-05 | [GPAW tutorials](https://gpaw.readthedocs.io/tutorialsexercises/) | Ground-state, response, surfaces, GW/BSE, and exercises. | GPAW-specific. | P0 |
| R-CODE-06 | [Octopus tutorials](https://octopus-code.org/main/tutorials/) | Ground-state and TDDFT real-space tutorials. | Version-specific. | P1 |
| R-CODE-07 | [exciting tutorials](https://exciting-code.org/home/tutorials) | All-electron notebooks and tutorials. | Specialist LAPW context. | P1 |
| R-CODE-08 | [CP2K documentation](https://manual.cp2k.org/) | Official methods, inputs, and examples. | Large documentation tree; link to specific sections. | P1 |
| R-CODE-09 | [Wannier90 tutorials](https://wannier90.readthedocs.io/en/latest/tutorials/) | Official Wannier examples. | Subspace validation remains. | P0 |
| R-CODE-10 | [EPW documentation](https://docs.epw-code.org/) | Official electron–phonon/superconductivity/transport route. | Dense interpolation and method assumptions. | P0 |
| R-CODE-11 | [BerkeleyGW tutorials](https://berkeleygw.org/documentation/tutorial/) | Official GW/BSE route. | Version-specific. | P1 |
| R-CODE-12 | [Yambo tutorials](https://www.yambo-code.eu/wiki/index.php?title=Tutorials) | Official many-body route. | Some older tutorials. | P1 |
| R-CODE-13 | [phonopy documentation](https://phonopy.github.io/phonopy/) | Harmonic phonon tools and examples. | Force/supercell convergence. | P0 |
| R-CODE-14 | [phono3py documentation](https://phonopy.github.io/phono3py/) | Anharmonic transport tools. | High convergence burden. | P1 |

### 4.4 Benchmarks, verification, and reference datasets

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| R-BENCH-01 | [SSSP](https://www.materialscloud.org/discover/sssp/table/efficiency) | Pseudopotential precision/efficiency verification. | Covered tests only. | P0 |
| R-BENCH-02 | [PseudoDojo](https://www.pseudo-dojo.org/) | Pseudopotential grading and generation lineage. | System/observable transferability remains. | P0 |
| R-BENCH-03 | [Delta project / verification-PW](https://molmod.ugent.be/deltacodesdft) | Cross-code equation-of-state verification for elemental solids. | Narrow benchmark scope and specific settings. | P1 |
| R-BENCH-04 | [GW100](https://gw100.wordpress.com/) | Molecular GW cross-code benchmark. | Molecular scope. | P1 |
| R-BENCH-05 | [GMTKN55](https://www.chemie.uni-bonn.de/pctc/mulliken-center/software/GMTKN/gmtkn55) | Broad molecular DFA benchmark collection. | Not universal for solids/metals/strong correlation. | P1 |
| R-BENCH-06 | [ACCDB](https://accdb.chem.pmf.unizg.hr/) | Machine-readable computational chemistry benchmark data. | Match dataset and reference method to claim. | P2 |
| R-BENCH-07 | [NIST CCCBDB](https://cccbdb.nist.gov/) | Experimental/calculated small-molecule comparisons. | Limited species and methods. | P1 |
| R-BENCH-08 | [Matbench](https://matbench.materialsproject.org/) | Standardized materials-ML tasks. | ML benchmark performance does not validate DFT physics or out-of-domain prediction. | P2 |
| R-BENCH-09 | [Open Catalyst Project benchmarks](https://opencatalystproject.org/) | Surface/catalysis ML datasets and tasks. | Domain and first-principles methodology limits. | P2 |
| R-BENCH-10 | [2026 k-point/smearing protocol study and data](https://archive.materialscloud.org/record/2025.62) | Modern population-level convergence/error-control evidence. | Not universal defaults. | P1 |

### 4.5 FAIR data, provenance, and preservation

| ID | Resource | Role | Boundary | Priority |
| --- | --- | --- | --- | --- |
| R-FAIR-01 | [FAIR principles](https://www.go-fair.org/fair-principles/) | General findable, accessible, interoperable, reusable framing. | FAIR does not itself guarantee scientific correctness. | P0 |
| R-FAIR-02 | [AiiDA](https://www.aiida.net/) | Provenance-aware computational workflows. | Provenance is evidence of lineage, not validity. | P0 |
| R-FAIR-03 | [NOMAD](https://nomad-lab.eu/) | Materials schemas, raw/calculated data, and APIs. | Parser/schema coverage varies. | P0 |
| R-FAIR-04 | [OPTIMADE](https://www.optimade.org/) | Interoperable materials database API specification. | Source methodology differences remain. | P0 |
| R-FAIR-05 | [Materials Cloud Archive](https://archive.materialscloud.org/) | DOI-linked computational materials records and data. | Record completeness and author metadata vary. | P0 |
| R-FAIR-06 | [Zenodo](https://zenodo.org/) | DOI-based software/data release archiving. | Generic repository; discipline metadata must be supplied. | P1 |
| R-FAIR-07 | [Software Heritage](https://www.softwareheritage.org/) | Source-code preservation and identifiers. | Does not archive all dependencies, data, or runtime systems. | P2 |
| R-FAIR-08 | [CodeMeta](https://codemeta.github.io/) | Software metadata vocabulary. | Metadata completeness remains author responsibility. | P3 |
| R-FAIR-09 | [CITATION.cff](https://citation-file-format.github.io/) | Machine-readable software citation metadata. | Citation metadata is not scientific provenance by itself. | P1 |
| R-FAIR-10 | [RO-Crate](https://www.researchobject.org/ro-crate/) | Packaging research objects with structured metadata. | Adoption and domain schemas vary. | P2 |

---

## 5. Cross-site exclusions and deferments

Do not integrate the following merely to increase resource count:

- unofficial mirrors or reuploads when a primary source exists;
- commercial software videos that mainly demonstrate button clicking;
- parameter-recipe pages that omit physical model, version, convergence, and observable boundaries;
- link farms with no inspectable syllabus or curation method;
- abandoned repositories without a unique archival value;
- rankings based only on stars, citations, views, or institution prestige;
- databases without an identifiable release, method, or provenance path;
- textbook PDFs or course files whose copyright or redistribution status is unclear;
- software screenshots copied into the repository without permission and a specific teaching need;
- duplicated links already explained on the relevant Theory page.

## 6. Recommended Talos execution waves

### Wave 1 — P0 structural completion

- Computational Tools: publish the taxonomy with a restrained first selection.
- Reference: publish core learning hubs, official tutorial portals, benchmarks, databases, and FAIR resources.
- Home: optionally add a minimal ecosystem map.
- Methods: add only one or two gateways per method family.

### Wave 2 — highest-value Theory resources

- Numerical Analysis, SCF, discretization, representations, pseudopotentials, and BZ sampling.
- Chemical bonding, defects, surfaces/interfaces, and thermodynamics.
- Linear response, electron–phonon, GW/BSE, topology, and magnetism.

### Wave 3 — diversity and specialist alternatives

- Chinese courses and creator-maintained long-form resources.
- Executable notebooks and interactive visualizations.
- Alternative codes and advanced methods.

Every wave should use small, single-purpose PRs and retain unresolved candidates in these audit documents rather than expanding pages indefinitely.
