#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const atlasRoot = path.resolve(import.meta.dirname, '..');
const recordsRoot = path.resolve(process.argv[2] ?? '/home/talos/work/Research-Workflow-Records');
const library = JSON.parse(fs.readFileSync(path.join(atlasRoot, 'src/reading/literature-library.json'), 'utf8'));
const coveragePath = path.join(recordsRoot, 'manifests/literature-annotation-coverage.json');
const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
const fixtures = JSON.parse(fs.readFileSync(path.join(recordsRoot, 'manifests/literature-annotation-fixtures.json'), 'utf8'));
const outputPath = path.join(atlasRoot, 'src/reading/literature-concept-map.json');

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

// This is a deliberately small, reviewed vocabulary. Patterns classify evidence into
// these stable concepts; they never create new concepts from arbitrary keywords.
const vocabulary = [
  ['density-functional-theory', 'Density functional theory', '/theory/density-functional-theory-foundations/', 'Ground-state density as the basic variable, with an exact framework separated from practical approximations.', ['density functional|DFT|first-principles']],
  ['kohn-sham-system', 'Kohn–Sham system', '/theory/kohn-sham-density-functional-theory/', 'The auxiliary one-particle system that reproduces a ground-state density, not the interacting wavefunction.', ['Kohn.?Sham|KS eigen|KS band']],
  ['exchange-correlation', 'Exchange–correlation approximations', '/theory/exchange-correlation-functionals-and-approximations/', 'Where functional choice, screening and self-interaction enter practical density-functional results.', ['exchange.correlation|LDA|PBE|HSE06|hybrid functional|overscreen']],
  ['dft-plus-u', 'DFT+U', '/methods/#dft-plus-u', 'A localized-subspace correction whose U, projectors and competing states define the claim boundary.', ['DFT\+U|Hubbard.?U|U_eff|U correction']],
  ['spin-polarization', 'Spin polarization and magnetic states', '/theory/relativistic-electronic-structure-spin-and-magnetism/', 'Candidate spin-dependent electronic solutions and the nonlinear landscape that separates them.', ['spin.?polar|magnetic state|magnetic ground|local moment|ferromag|antiferromag']],
  ['spin-orbit-coupling', 'Spin–orbit coupling', '/theory/relativistic-electronic-structure-spin-and-magnetism/', 'Relativistic spin–orbital coupling, symmetry changes and the difference between band splitting and a phase claim.', ['spin.?orbit|SOC|Ising|spin.valley']],
  ['magnetic-exchange', 'Magnetic exchange and ordering', '/methods/#magnetic-exchange', 'Energy mapping, exchange parameters, anisotropy and the extra assumptions needed for finite-temperature order.', ['exchange interaction|Heisenberg|superexchange|Dzyaloshinskii|single.?ion anisotropy|magnetic exchange']],
  ['bloch-bands', 'Bloch states and band structure', '/core/part-iii/', 'Periodic eigenstates and bands indexed by crystal momentum.', ['Bloch|band structure|electronic bands|band dispersion']],
  ['fermi-surface', 'Fermi surface', '/core/part-iii/#band-path-boundary', 'The full-Brillouin-zone occupied-state boundary, not a high-symmetry line crossing.', ['Fermi surface|Fermi pocket|Fermi.?sheet|nesting|Lifshitz']],
  ['density-of-states', 'Density of states and van Hove structure', '/core/part-iii/', 'A compressed spectrum whose peaks can suggest, but do not alone prove, an instability or coupling mechanism.', ['density of states|DOS|van Hove|VHS']],
  ['band-alignment', 'Band alignment', '/methods/#interfaces-and-alignment', 'Energy references and interface-specific checks behind type-I, II or III labels.', ['band alignment|type.?I{1,3}|broken.?gap|work function|lineup']],
  ['berry-topology', 'Berry phases, Wilson loops, and topology', '/theory/berry-phases-and-electronic-topology/', 'Gauge-aware invariants and boundary evidence beyond a visual band inversion.', ['Berry|Wilson loop|Wannier charge center|topolog|Z2|Chern']],
  ['quantum-geometry', 'Quantum geometry', '/theory/berry-phases-and-electronic-topology/', 'Metric and geometric contributions of occupied subspaces, kept distinct from topology alone.', ['quantum geometry|quantum metric|geometric contribution|superfluid weight']],
  ['structural-stability', 'Structural and thermodynamic stability', '/core/part-vi/', 'Stationarity, local curvature, competing phases and thermodynamic accessibility are different claims.', ['structural stability|formation energy|convex hull|phase stability|metastab|AIMD|molecular dynamics']],
  ['dynamical-stability', 'Dynamical stability', '/core/part-vii/#dynamical-stability', 'The eigenvalues of the dynamical matrix throughout the relevant Brillouin zone, with numerical and model boundaries.', ['dynamical stability|imaginary frequenc|negative frequenc|unstable phonon|no imaginary|phonon stability']],
  ['dfpt', 'Density-functional perturbation theory', '/theory/linear-response-and-excited-states/', 'Self-consistent derivatives of a declared reference state with respect to a declared perturbation.', ['DFPT|density.functional perturbation|Sternheimer|linear response']],
  ['phonons', 'Phonons and lattice dynamics', '/core/part-vii/', 'Mass-weighted normal modes built from interatomic force constants and crystal momentum q.', ['phonon|lattice dynam|dynamical matrix|force constant|vibrational']],
  ['soft-modes-cdw', 'Soft modes and charge-density waves', '/reading/literature/synthesis/soft-modes-and-charge-order/', 'A softened collective coordinate, its q dependence, and the evidence needed to connect it to charge order.', ['soft mode|phonon soften|charge.?density.?wave|CDW|Kohn anomal']],
  ['anharmonicity', 'Anharmonicity and finite-temperature nuclei', '/reading/literature/synthesis/dynamical-stability-in-2d/', 'Physics beyond a quadratic expansion, including temperature-dependent renormalization and competing basins.', ['anharm|SSCHA|TDEP|quasi.?harmonic|finite.?temperature phonon']],
  ['electron-phonon-matrix-elements', 'Electron–phonon matrix elements', '/core/part-vii/#electron-phonon-coupling', 'The state- and mode-resolved change of the electronic Hamiltonian under a phonon displacement.', ['electron.?phonon matrix|matrix element|g.?mn|mode.?resolved.?EPC|electron.?phonon coupling']],
  ['eliashberg-function', 'Eliashberg spectral function α²F(ω)', '/methods/#from-dfpt-to-tc', 'A frequency-resolved contraction of electronic phase space, phonons and coupling matrix elements.', ['α²F|alpha.?2.?F|Eliashberg spectral']],
  ['epc-lambda', 'Electron–phonon coupling λ', '/methods/#from-dfpt-to-tc', 'A dimensionless weighted integral whose value depends on the states, modes and averaging convention.', ['EPC constant|coupling constant|lambda|λ']],
  ['omega-log', 'Logarithmic phonon frequency ωlog', '/methods/#from-dfpt-to-tc', 'The logarithmic spectral moment that competes with coupling strength in common Tc estimates.', ['omega.?log|ωlog|logarithmic phonon']],
  ['migdal-approximation', 'Migdal approximation', '/reading/literature/synthesis/from-dfpt-to-tc/', 'The small-vertex-correction assumption and its adiabatic, bandwidth and strong-coupling boundaries.', ['Migdal|vertex correction|nonadiabatic']],
  ['eliashberg-theory', 'Migdal–Eliashberg theory', '/reading/literature/synthesis/from-dfpt-to-tc/', 'Frequency-dependent pairing and renormalization equations, distinct from a closed-form Tc estimate.', ['Eliashberg equation|Eliashberg theory|anisotropic Eliashberg|Migdal.?Eliashberg']],
  ['allen-dynes', 'McMillan and Allen–Dynes estimates', '/methods/#from-dfpt-to-tc', 'Compressed Tc models with explicit μ*, spectral moments and fit-domain boundaries.', ['Allen.?Dynes|McMillan|Coulomb pseudopotential|mu.?star|μ[*]']],
  ['conventional-superconductivity-evidence', 'Evidence for conventional superconductivity', '/reading/literature/synthesis/what-establishes-conventional-superconductivity/', 'The distinction among metallicity, viable phonons, calculated pairing and experimental superconductivity.', ['superconduct|transition temperature|critical temperature|pairing|Meissner|zero resistance']],
  ['anisotropic-multiband-superconductivity', 'Anisotropic and multiband superconductivity', '/reading/literature/synthesis/from-dfpt-to-tc/', 'Momentum- and sheet-resolved gaps or coupling that an isotropic average can hide.', ['anisotropic superconduct|multiband|two.?gap|multigap|gap anisotropy']],
  ['two-dimensional-superconductivity', 'Two-dimensional superconductivity', '/reading/literature/synthesis/evidence-for-2d-superconductivity/', 'Dimensionality established through stiffness, BKT, critical fields, vortices and thickness controls.', ['two.?dimensional superconduct|BKT|Tinkham|superfluid stiffness|vortex']],
  ['ising-superconductivity', 'Ising superconductivity', '/reading/literature/synthesis/soc-and-ising-superconductivity/', 'SOC-locked spin texture and pair protection, kept separate from large critical-field evidence alone.', ['Ising superconduct|Ising protection|Pauli limit|spin.valley lock']],
  ['nonreciprocal-superconductivity', 'Nonreciprocal superconducting transport', '/reading/literature/synthesis/evidence-for-2d-superconductivity/', 'Diode or nonreciprocal response and the symmetry, control and nonequilibrium evidence it requires.', ['superconducting diode|non.?reciprocal|rectification|diode effect']],
  ['van-der-waals-coupling', 'van der Waals and interlayer coupling', '/reading/literature/synthesis/interlayer-coupling-as-control/', 'Layer registry, distance and interlayer electronic coupling as physical control variables.', ['van der Waals|interlayer coupling|layered|stacking|bilayer']],
  ['interface-charge-transfer', 'Interface charge redistribution', '/reading/literature/synthesis/interlayer-coupling-as-control/', 'Electrostatic redistribution distinguished from hybridization, defects and nominal doping.', ['charge transfer|charge redistribution|band bending|self.?doping|electrostatic potential']],
  ['interface-hybridization', 'Interface hybridization', '/reading/literature/synthesis/interlayer-coupling-as-control/', 'Wavefunction mixing across an interface and its consequences for bands, phonons and low-energy states.', ['interface hybrid|interlayer hybrid|orbital hybrid|proximity effect']],
  ['strain-pressure-control', 'Strain and pressure control', '/methods/#structures-forces-and-paths', 'A structural control parameter whose electronic and vibrational consequences must be separated from stability.', ['strain|pressure|lattice mismatch|stress']],
  ['intercalation', 'Intercalation', '/reading/literature/synthesis/intercalation-as-control/', 'Ion or molecular insertion as a coupled structural, electrostatic and kinetic control knob.', ['intercalat|lithium insertion|guest ion|stage.?one graphite']],
  ['ferroelectricity', 'Ferroelectricity and polarization', '/reading/literature/synthesis/effective-hamiltonians-and-ferroelectricity/', 'Switchable polarization, depolarization fields, domains and finite-size boundary conditions.', ['ferroelectric|polarization|depolarization|ferroic']],
  ['effective-hamiltonians', 'Effective Hamiltonians', '/reading/literature/synthesis/effective-hamiltonians-and-ferroelectricity/', 'A reduced set of degrees of freedom parameterized from first principles and solved at a different scale.', ['effective Hamiltonian|low.?energy Hamiltonian|downfold|coarse.?grain']],
  ['spin-lattice-coupling', 'Spin–lattice coupling', '/methods/#magnetic-exchange', 'How structural coordinates modify magnetic interactions and vice versa.', ['spin.?lattice|magnetoelastic|exchange.striction|Hellmann.?Feynman force']],
  ['excitons-gw-bse', 'Quasiparticles and excitons', '/core/part-viii/', 'Charged and neutral excitation sectors and the GW/BSE objects used to approximate them.', ['GW|BSE|exciton|quasiparticle|electron.?hole']],
  ['screening-polar-coupling', 'Screening and polar coupling', '/reading/literature/synthesis/from-dfpt-to-tc/', 'Dielectric screening, long-range Fröhlich fields and dimensional electrostatics in coupling calculations.', ['screening|Fröhlich|Born effective charge|dielectric|Coulomb cutoff|polar coupling']],
  ['wannier-interpolation', 'Wannier interpolation', '/theory/berry-phases-and-electronic-topology/', 'A gauge- and subspace-controlled localized representation for dense electronic, phonon and coupling meshes.', ['Wannier|EPW|interpolation|MLWF']],
  ['transport-evidence', 'Transport and spectroscopic evidence', '/methods/#coupling-and-transport', 'The bridge from calculated states to measured resistance, ARPES, STM, Raman or optical observables.', ['transport|resist|ARPES|STM|STS|Raman|photoemission|spectroscop']],
  ['materials-screening', 'Materials screening and model validation', '/reading/literature/synthesis/prediction-to-evidence/', 'A funnel from candidate generation through stability, observable-specific validation and experiment.', ['high.?throughput|screening|active learning|machine learning|candidate|workflow']],
];

const fixtureByPaper = new Map(fixtures.papers.map((entry) => [entry.paper_id, new Set(entry.annotation_ids)]));
const libraryById = new Map(library.papers.filter((paper) => paper.status === 'published').map((paper) => [paper.paper_id, paper]));
const paperRecords = [];

for (const entry of coverage.papers) {
  const paper = libraryById.get(entry.paper.paper_id);
  if (!paper) throw new Error(`Coverage paper is not published: ${entry.paper.paper_id}`);
  const directory = path.join(recordsRoot, paper.source_record_path, 'annotations');
  const fixtureIds = fixtureByPaper.get(paper.paper_id) ?? new Set();
  const annotations = fs.readdirSync(directory).filter((name) => name.endsWith('.json')).sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')))
    .filter((item) => !fixtureIds.has(item.annotation_id));
  if (annotations.length !== entry.annotation_count) throw new Error(`Scientific annotation count drift: ${paper.paper_id}`);
  paperRecords.push({ paper, coverage: entry, annotations });
}

const labelOrder = ['来源主张', '阅读注解', '限制', '推断连接'];
const concepts = vocabulary.map(([id, title, canonical_route, description, patterns]) => {
  const regex = new RegExp(patterns.join('|'), 'iu');
  const papers = [];
  const candidates = [];
  for (const record of paperRecords) {
    const corpus = [record.paper.title, ...record.coverage.topics, ...record.annotations.map((item) => item.annotation_payload.contents)].join('\n');
    if (!regex.test(corpus)) continue;
    papers.push(record.paper.paper_id);
    for (const item of record.annotations) {
      if (regex.test(item.annotation_payload.contents)) candidates.push({ paper_id: record.paper.paper_id, annotation_id: item.annotation_id, page: item.page_index + 1, contents: item.annotation_payload.contents });
    }
  }
  const useful_annotations = [];
  for (const label of labelOrder) {
    const match = candidates.find((item) => item.contents.startsWith(`【${label}`) && !useful_annotations.some((selected) => selected.paper_id === item.paper_id));
    if (match) useful_annotations.push(match);
    if (useful_annotations.length === 3) break;
  }
  return { id, title, canonical_route, description, paper_count: papers.length, papers, useful_annotations };
});

const conceptsById = new Map(concepts.map((concept) => [concept.id, concept]));
const papers = paperRecords.map((record) => {
  const concept_ids = concepts.filter((concept) => concept.papers.includes(record.paper.paper_id)).map((concept) => concept.id);
  if (concept_ids.length < 2) throw new Error(`Paper has fewer than two stable concepts: ${record.paper.paper_id}`);
  return { paper_id: record.paper.paper_id, atlas_route: record.paper.atlas_route, concept_ids };
});

for (const concept of concepts) {
  if (concept.paper_count === 0 || !conceptsById.has(concept.id)) throw new Error(`Empty concept: ${concept.id}`);
}

const output = {
  schema_version: 1,
  records_main_sha: library.records_main_sha,
  coverage_papers_sha256: crypto.createHash('sha256').update(JSON.stringify(canonical(coverage.papers))).digest('hex'),
  coverage_annotation_count: coverage.papers.reduce((sum, entry) => sum + entry.annotation_count, 0),
  paper_count: papers.length,
  concept_count: concepts.length,
  concepts,
  papers,
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${concepts.length} stable concepts for ${papers.length} papers and ${output.coverage_annotation_count} scientific annotations.`);
