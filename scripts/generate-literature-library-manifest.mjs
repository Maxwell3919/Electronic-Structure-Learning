import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const atlasRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordsRoot = path.resolve(process.env.ATLAS_LITERATURE_ROOT ?? '/home/talos/work/Research-Workflow-Records');
const literatureRoot = path.join(recordsRoot, 'literature');
const outputPath = path.join(atlasRoot, 'src/reading/literature-library.json');
const refreshMetadata = process.argv.includes('--refresh-metadata');

const excluded = new Set([
  'A Model Context Protocol Server for Quantum Execution in Hybrid Quantum-HPC Environments',
  'A Sample Article Using IEEEtran.cls for IEEE Journals and Transactions',
  'APS Author Guide for REVTEX 4.2',
  'Attention Is All You Need',
  'Comparative Electron–Phonon Screening of Carrier-Doped Monolayer HfX2 (X = Cl, Br, I)',
  'DeepSeekMath - Pushing the Limits of Mathematical Reasoning in Open Language Models',
  'Density Functional Theory - A Practical Introduction',
  'DoRA - Weight-Decomposed Low-Rank Adaptation',
  'Electronic Structure - Basic Theory and Practical Methods',
  'Electronic Structure Calculations for Solids and Molecules',
  'Front Matter',
  'Fundamentals of Condensed Matter Physics',
  'Graph of Thoughts - Solving Elaborate Problems with Large Language Models',
  'How to Use the IEEEtran LATEX Templates',
  'Manuscript Title - with Forced Linebreak',
  'Materials Modelling Using Density Functional Theory',
  'MinerU Library Index',
  'REVTEX 4.2 Command and Options Summary',
  'ReAct - Synergizing Reasoning and Acting in Language Models',
  'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
  'Revisiting Long-context Modeling from Context Denoising Perspective',
  'Surface Modification for III-V Selective Area Molecular Beam Epitaxy of Non-Selective Mask Materials',
  'The Sky Remembers everything - Celestial amplitude, Shadow and OPE in quadratic EFT of gravity',
  'auguide4-2',
  'tcallmaterials',
  'temp',
  '附录 C几何结构优化与解析导数法',
]);

const duplicateRecords = new Set([
  'High-throughput-study-on-magnetic-ground-states-with-Hubbard-U-corrections-in-transition-metal-dihalide-monolayers-(Supplementary-Information)',
  'Origin-of-charge-transfer-and-enhanced-electron-phonon-coupling-in-single-unit-cell-FeSe-films-on-SrTiO3-(Supplementary-Information)',
  'Reversible-and-selective-ion-intercalation-through-the-top-surface-of-few-layer-MoS2-(Supplementary-Information-2)',
  'Supplementary Information',
  'Ferroelectric control of a quantum spin Hall phase in - P t T e 2 - - alpha - - I n 2 S e 3 van der Waals heterobilayers',
  'Ferroelectric switching of a quantum spin Hall phase in - P t T e 2 - - alpha - - I n 2 S e 3 van der Waals heterobilayers',
  'Ferroelectric switching of a quantum spin Hall phase in a PtTe2 - alpha-In2Se3 van der Waals heterobilayer',
]);

// Fail closed when a Records package contains a real PDF whose content does not
// match the package/canonical paper identity.  Keep the metadata visible in the
// audit manifest, but do not publish that PDF or create an internal Reader.
const sourceMismatchRecords = new Map([
  [
    'Simultaneous Visualization of Covalent and Noncovalent Interactions Using Regions of Density Overlap',
    'canonical PDF opens as PostProc User\u2019s Guide (v.7.2), not the named JCTC article',
  ],
]);

const idByDoi = new Map(Object.entries({
  '10.1021/acsomega.4c10560': 'stable-semiconducting-1t-prime-hfcl2-monolayer',
  '10.1088/0256-307x/37/12/127101': 'hfx2-type-ii-photovoltaic-heterostructures',
  '10.1103/revmodphys.73.515': 'dfpt-phonons-crystal-properties',
  '10.1103/revmodphys.89.015003': 'electron-phonon-interactions-first-principles',
  '10.1103/physrevb.96.075448': 'gated-2d-dfpt',
  '10.1103/physrevb.12.905': 'allen-dynes-transition-temperature',
  '10.1088/0256-307x/43/1/010711': 'snse2-ptte2-interfacial-superconductivity',
  '10.1103/l89c-t2s4': 'bilayer-cote2-superconductivity',
  '10.1103/t7nc-p31n': 'cu2n-electron-phonon-topology',
  '10.1038/s41467-019-10400-z': 'cross-dimensional-electron-phonon-coupling',
  '10.48550/arxiv.2607.20335': 'nbse2-stacking-superconductivity-cdw',
  '10.1038/s41524-026-02245-0': 'functionalized-double-mxene-superconductivity',
  '10.3390/cryst7050121': 'layered-dihalides-trihalides-structures',
  '10.1103/physrevb.105.245153': 'trigonal-symmetry-breaking-dihalides-trihalides',
  '10.1103/jmys-zkgs': 'hbn-sin-superconductivity-cdw',
  '10.7693/wl20180601': 'two-dimensional-superconductors-chinese-review',
}));
const topicByDoi = new Map(Object.entries({
  '10.1021/acsomega.4c10560': 'structures-phase-competition',
  '10.1088/0256-307x/37/12/127101': 'interfaces-heterostructures',
  '10.1103/revmodphys.73.515': 'lattice-dynamics',
  '10.1103/revmodphys.89.015003': 'electron-phonon-superconductivity',
  '10.1103/physrevb.96.075448': 'lattice-dynamics',
  '10.1103/physrevb.12.905': 'electron-phonon-superconductivity',
  '10.1088/0256-307x/43/1/010711': 'electron-phonon-superconductivity',
  '10.1103/l89c-t2s4': 'electron-phonon-superconductivity',
  '10.1103/t7nc-p31n': 'electron-phonon-superconductivity',
  '10.1038/s41467-019-10400-z': 'electron-phonon-superconductivity',
  '10.48550/arxiv.2607.20335': 'electron-phonon-superconductivity',
  '10.1038/s41524-026-02245-0': 'electron-phonon-superconductivity',
  '10.3390/cryst7050121': 'structures-phase-competition',
  '10.1103/physrevb.105.245153': 'structures-phase-competition',
  '10.1103/jmys-zkgs': 'electron-phonon-superconductivity',
  '10.1103/physrevb.92.245108': 'electron-phonon-superconductivity',
  '10.7693/wl20180601': 'electron-phonon-superconductivity',
}));

const metadataOverrides = {
  'Ah-SCDFT - A general approach for superconductivity with anharmonic corrections': {
    authors: ['Ryota Akashi'], year: 2026, venue: 'arXiv', arxiv: '2607.21051', metadata_source: 'arXiv metadata',
  },
  'Bulk Ising superconductivity in an intercalated TaSe2 bilayer structure': {
    authors: ['Yupeng Li', 'Zhaopeng Guo', 'Lihong Hu', 'Guoan Li', 'Siqi Wu', 'Xinyi Zheng', 'Xiao Deng', 'Zhiyuan Zhang', 'Anqi Wang', 'Xingchen Guo', 'Ziwei Dou', 'Peiling Li', 'Yuke Li', 'Fanming Qu', 'Guangtong Liu', 'Jin-Ke Bao', 'Guang-Han Cao', 'Li Lu', 'Jie Shen', 'Zhu-An Xu'],
    year: 2026, venue: 'arXiv', arxiv: '2608.01209', metadata_source: 'arXiv metadata',
  },
  'Charge-Density-Wave Phase Selection by Janus-Induced Intrinsic Strain in Monolayer NbSSiAs2': {
    authors: ['Chun-Jie Zhang', 'Bing Zhang', 'Dongliang Mao', 'Yapeng Wu', 'Xiao-Ping Li', 'Lei Wang'],
    year: 2026, venue: 'Preprint', metadata_source: 'Records source package title page',
  },
  'Charge-Density-Wave Phase Transitions in Monolayer 1T-TaS2 from Universal Machine Learning Molecular Dynamics': {
    authors: ['Valentina Nesterova', 'Tribhuwan Pandey', 'Tom Berlijn', 'Fariborz Kargar', 'Lucas Lindsay', 'Konstantin Klyukin'],
    year: 2026, venue: 'arXiv', arxiv: '2607.22316', metadata_source: 'arXiv metadata',
  },
  'Electron-phonon superconductivity in monolayer NiH3 and hole-doped CuH3 - Role of hybridization of transition metal eg and hydrogen 1s states': {
    authors: ['Renyu Duan', 'Meiling Xu', 'Yan Liu', 'Yiming Zhang', 'Yinwei Li'],
    year: 2026, venue: 'Physical Review B', doi: '10.1103/xqsd-2fnl', metadata_source: 'Records source package title page',
  },
  'Emergent superconductivity and non-reciprocal transport in a van der Waals Dirac semimetal-antiferromagnet heterostructure': {
    authors: ['Saurav Islam', 'Max Stanley', 'Anthony Richardella', 'Seungjun Lee', 'Kalana D. Halanayake', 'Sandra Santhosh', 'Danielle Reifsnyder Hickey', 'Tony Low', 'Nitin Samarth'],
    year: 2025, venue: 'arXiv', arxiv: '2504.20393', metadata_source: 'arXiv metadata',
  },
  'Fabrication of oxide-FeSe multilayer films using the PLD technique': {
    authors: ['Tomoki Kobayashi', 'Hiroki Nakagawa', 'Ryo Ogawa', 'Atsutaka Maeda'],
    year: 2025, venue: 'arXiv', arxiv: '2509.23591', metadata_source: 'arXiv metadata',
  },
  'First-Principles Investigation of Electron--Phonon Coupling and Intrinsic Two-Gap Superconductivity in Hexagonal BAs3 Monolayer': {
    authors: ['Jakkapat Seeyangnok', 'Udomsilp Pinsook'], year: 2026, venue: 'arXiv', arxiv: '2606.08423', metadata_source: 'arXiv metadata',
  },
  'Interface-Confined Superconductivity with Thickness-Independent Superfluid Stiffness in (Pb,Sn)Te - FeTe Bilayers': {
    authors: ['Zi-Jie Yan', 'Hongtao Rong', 'Yiyuan Luo', 'Yufei Zhao', 'Pu Xiao', 'Zihao Wang', 'Lok-Kan Lai', 'Annie G. Wang', 'Zhiyuan Xi', 'Yanxing Li', 'Xiaoyu Wei', 'Ke Wang', 'Binghai Yan', 'Chih-Kang Shih', 'Cui-Zu Chang'],
    year: 2026, venue: 'arXiv', arxiv: '2607.17539', metadata_source: 'arXiv metadata',
  },
  'Interfacial superconductivity in the type-III heterostructure SnSe2 - PtTe2': {
    authors: ['Jun Fan', 'Xiao-Le Qiu', 'Zhong-Yi Lu', 'Kai Liu', 'Ben-Chao Gong'],
    year: 2026, venue: 'Chinese Physics Letters', doi: '10.1088/0256-307X/43/1/010711', metadata_source: 'Records source package title page',
  },
  'Pressure induced magnetic-field-free superconducting diode effect in NbSe2 flake': {
    authors: ['Shihao Zhu', 'Tian Le', 'Cuiying Pei', 'Changhua Li', 'Yi Liao', 'Yi Zhao', 'Lingxiao Zhao', 'Qi Wang', 'Juefei Wu', 'Qilian Zhang', 'Yueshen Wu', 'Tonghuan Fu', 'Xujie Lü', 'Wenge Yang', 'Jie Shen', 'Jun Li', 'Yulin Chen', 'Xiao Lin', 'Wen-Yu He', 'Yanpeng Qi'],
    year: 2026, venue: 'arXiv', arxiv: '2608.03072', metadata_source: 'arXiv metadata',
  },
  'Studies on the origin of the interfacial superconductivity of Sb2 Te3 - Fe1+y Te heterostructures': {
    authors: ['Jing Liang', 'Yu Jun Zhang', 'Xiong Yao', 'Hui Li', 'Zi-Xiang Li', 'Jiannong Wang', 'Yuanzhen Chen', 'Iam Keong Sou'],
    year: 2019, venue: 'Proceedings of the National Academy of Sciences', doi: '10.1073/pnas.1914534117', metadata_source: 'Crossref DOI metadata',
  },
  'Superconductivity in twisted bilayer WSe2': {
    authors: ['Yinjie Guo', 'Jordan Pack', 'Joshua Swann', 'Luke Holtzman', 'Matthew Cothrine', 'Kenji Watanabe', 'Takashi Taniguchi', 'David G. Mandrus', 'Katayun Barmak', 'James Hone', 'Andrew J. Millis', 'Abhay Pasupathy', 'Cory R. Dean'],
    year: 2025, venue: 'Nature', doi: '10.1038/s41586-024-08381-1', metadata_source: 'Crossref DOI metadata',
  },
  'Theoretical prediction of structural stability and superconductivity in T-hexagonal molybdenum dihydrides Monolayer': {
    authors: ['Jakkapat Seeyangnok', 'Udomsilp Pinsook'], year: 2026, venue: 'arXiv', arxiv: '2607.13297', metadata_source: 'arXiv metadata',
  },
  'Trigonal Symmetry Breaking and its Electronic Effects in Two-Dimensional Dihalides MX2 and Trihalides MX3': {
    authors: ['Alexandru B. Georgescu', 'Andrew J. Millis', 'James M. Rondinelli'],
    year: 2022, venue: 'Physical Review B', doi: '10.1103/PhysRevB.105.245153', metadata_source: 'Records source package title page',
  },
  'Tuning Competing Electronic Phases in Monolayer VSe2 via Interface Hybridization': {
    authors: ['Ishita Pushkarna', 'Árpád Pásztor', 'Greta Lupi', 'Adolfo O. Fumega', 'Christoph Renner'],
    year: 2026, venue: 'ACS Nano', doi: '10.1021/acsnano.6c04065', metadata_source: 'Crossref DOI metadata',
  },
  '二维超导材料': {
    authors: ['肖瑞春', '鲁文建', '孙玉平'], year: 2018, venue: '物理', doi: '10.7693/wl20180601', metadata_source: 'Records source package front matter',
  },
};

const pendingPapers = [
  {
    paper_id: 'electron-doped-hfncl-superconductivity', title: 'High-Tc Superconductivity in Weakly Electron-Doped HfNCl',
    authors: ['Betül Pamuk', 'Francesco Mauri', 'Matteo Calandra'], year: 2017, venue: 'Physical Review B',
    doi: '10.1103/PhysRevB.96.024518', primary_category: 'electron-phonon-superconductivity',
  },
  {
    paper_id: 'fese-srtio3-interfacial-mode-coupling', title: 'Interfacial Mode Coupling as the Origin of the Enhancement of Tc in FeSe Films on SrTiO3',
    authors: ['J. J. Lee', 'F. T. Schmitt', 'R. G. Moore', 'S. Johnston', 'Y.-T. Cui', 'W. Li', 'M. Yi', 'Z. K. Liu', 'M. Hashimoto', 'Y. Zhang', 'D. H. Lu', 'T. P. Devereaux', 'D.-H. Lee', 'Z.-X. Shen'],
    year: 2014, venue: 'Nature', doi: '10.1038/nature13894', primary_category: 'electron-phonon-superconductivity',
  },
  {
    paper_id: 'wannier-electron-phonon-interaction', title: 'Electron-Phonon Interaction Using Wannier Functions',
    authors: ['Feliciano Giustino', 'Marvin L. Cohen', 'Steven G. Louie'], year: 2007, venue: 'Physical Review B',
    doi: '10.1103/PhysRevB.76.165108', primary_category: 'electron-phonon-superconductivity',
  },
].map((paper) => ({
  ...paper,
  arxiv: null,
  source_record_path: null,
  pdf_path: null,
  document_sha256: null,
  pdf_size_bytes: null,
  annotation_path: null,
  page_count: null,
  topic_relations: [paper.primary_category],
  atlas_route: null,
  status: 'source_pending',
  metadata_source: 'existing Atlas preprocessing queue',
}));

const normalize = (value) => value.normalize('NFKD').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+|[{}$*_]/g, ' ').replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase();
const slugify = (value) => normalize(value).split(' ').filter(Boolean).slice(0, 14).join('-');
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readFrontmatter = (text) => {
  if (!text.startsWith('---\n')) return {};
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) return {};
  return Object.fromEntries(text.slice(4, end).split('\n').flatMap((line) => {
    const match = /^([a-z_]+):\s*(.*)$/.exec(line);
    return match ? [[match[1], match[2].trim().replace(/^"|"$/g, '')]] : [];
  }));
};
const cleanDoi = (value) => value?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/[),.;]+$/g, '') || null;
const extractDoi = (text) => cleanDoi(text.match(/10\.\d{4,9}\/[A-Z0-9._;()/:+-]+/i)?.[0]);
const extractArxiv = (text, doi) => doi?.match(/^10\.48550\/arxiv\.(.+)$/i)?.[1] ?? text.match(/arXiv[:.\s]+(\d{4}\.\d{4,5})/i)?.[1] ?? null;
const titleSimilarity = (a, b) => {
  const aa = new Set(normalize(a).split(' '));
  const bb = new Set(normalize(b).split(' '));
  const intersection = [...aa].filter((token) => bb.has(token)).length;
  return intersection / Math.max(aa.size, bb.size, 1);
};

const topicFor = (title) => {
  const value = normalize(title);
  if (/topolog|berry|quantum geometry|ising protection|spin hall/.test(value)) return 'quantum-geometry-topology';
  if (/electron phonon|superconduct|charge density wave|\bcdw\b|fese|transition temperature|eliashberg/.test(value)) return 'electron-phonon-superconductivity';
  if (/ferroelectric|polarization|\bbatio3?\b|dielectric|electromechanical/.test(value)) return 'polarization-response';
  if (/hubbard|magnetic|magnetism|spin lattice|antiferromagnet|srfeo/.test(value)) return 'magnetism-correlation';
  if (/gw |quasiparticle|exciton|spectroscop/.test(value)) return 'quasiparticles-excitons';
  if (/phonon|lattice dynamic|vibrational/.test(value)) return 'lattice-dynamics';
  if (/interface|heterostruct|heterobilayer|intercalat|two dimensional|monolayer|bilayer|van der waals|surface/.test(value)) return 'interfaces-heterostructures';
  if (/phase transition|structural stability|crystal structure|preparing/.test(value)) return 'structures-phase-competition';
  if (/transport|scattering|mobility/.test(value)) return 'transport-scattering';
  if (/method|density functional|first principles|high throughput|computational design|downfold|visualization|workflow|active learning/.test(value)) return 'reliability-validation';
  return 'electronic-character';
};
const topicRelationsFor = (title, primary) => {
  const value = normalize(title);
  const relations = new Set([primary]);
  if (/interface|heterostruct|heterobilayer|intercalat|monolayer|bilayer|two dimensional|van der waals/.test(value)) relations.add('interfaces-heterostructures');
  if (/phonon|vibrational|lattice/.test(value)) relations.add('lattice-dynamics');
  if (/topolog|berry|quantum geometry|ising/.test(value)) relations.add('quantum-geometry-topology');
  if (/magnetic|spin|hubbard|correlation/.test(value)) relations.add('magnetism-correlation');
  return [...relations].slice(0, 4);
};

const crossrefHeaders = { 'User-Agent': 'ElectronicStructureAtlas/1.0 (mailto:maxwell3919@users.noreply.github.com)' };
const fetchWithRetry = async (url, options = {}) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
      if (response.ok || response.status < 500) return response;
    } catch {
      // A registry timeout is retried; unresolved metadata still fails closed below.
    }
  }
  return null;
};
const crossrefMetadata = async (doi, title) => {
  const direct = doi && !doi.toLowerCase().startsWith('10.48550/arxiv.')
    ? `https://api.crossref.org/works/${encodeURIComponent(doi)}`
    : null;
  const query = `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=3&select=DOI,title,author,published,container-title,type`;
  const response = await fetchWithRetry(direct ?? query, { headers: crossrefHeaders });
  if (!response?.ok) return null;
  const message = (await response.json()).message;
  const candidates = direct ? [message] : message.items;
  const match = candidates.find((candidate) => titleSimilarity(title, candidate.title?.[0] ?? '') >= 0.72);
  if (!match) return null;
  return {
    title: match.title?.[0] ?? title,
    authors: (match.author ?? []).map((author) => [author.given, author.family].filter(Boolean).join(' ')).filter(Boolean),
    year: match.published?.['date-parts']?.[0]?.[0] ?? null,
    venue: match['container-title']?.[0] || (match.type === 'posted-content' ? 'Preprint' : null),
    doi: cleanDoi(match.DOI ?? doi),
    metadata_source: 'Crossref DOI metadata',
  };
};

const arxivMetadata = async (arxiv) => {
  if (!arxiv) return null;
  const response = await fetchWithRetry(`https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxiv)}`);
  if (!response?.ok) return null;
  const xml = await response.text();
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
  if (!entry) return null;
  const text = (tag) => entry.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1].replace(/\s+/g, ' ').trim() ?? null;
  return {
    title: text('title'),
    authors: [...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)].map((match) => match[1].replace(/\s+/g, ' ').trim()),
    year: Number(text('published')?.slice(0, 4)) || null,
    venue: 'arXiv',
    arxiv,
    metadata_source: 'arXiv metadata',
  };
};

if (!fs.existsSync(literatureRoot)) throw new Error(`Records literature root is unavailable: ${literatureRoot}`);
const existing = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : { papers: [] };
const existingByPath = new Map(existing.papers?.filter((paper) => paper.source_record_path).map((paper) => [paper.source_record_path, paper]) ?? []);
const directories = fs.readdirSync(literatureRoot).filter((name) => fs.statSync(path.join(literatureRoot, name)).isDirectory()).sort();
const selected = directories.filter((name) => !excluded.has(name) && !duplicateRecords.has(name));
const failures = [];
const papers = [];

for (const directory of selected) {
  const sourceRecordPath = path.posix.join('literature', directory);
  const absoluteDirectory = path.join(literatureRoot, directory);
  const names = fs.readdirSync(absoluteDirectory);
  const pdfName = names.find((name) => name === `${directory}.pdf`) ?? names.find((name) => name.toLowerCase().endsWith('.pdf'));
  const markdownName = names.find((name) => name === `${directory}.md`) ?? names.find((name) => name.toLowerCase().endsWith('.md'));
  if (!pdfName || !markdownName) {
    failures.push(`${directory}: canonical PDF or Markdown missing`);
    continue;
  }
  const pdfPath = path.join(absoluteDirectory, pdfName);
  const markdownPath = path.join(absoluteDirectory, markdownName);
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const frontmatter = readFrontmatter(markdown);
  const prefix = markdown.slice(0, 24000);
  const title = directory.replace(/\s+-$/, '').trim();
  const doi = cleanDoi(frontmatter.doi) ?? extractDoi(prefix);
  const arxiv = extractArxiv(prefix, doi);
  const documentSha256 = sha256(pdfPath);
  const pdfSizeBytes = fs.statSync(pdfPath).size;
  const declaredSha = frontmatter.source_sha256;
  if (declaredSha && declaredSha !== documentSha256) failures.push(`${directory}: frontmatter PDF SHA-256 mismatch`);
  const pageCount = Number(execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' }).match(/^Pages:\s+(\d+)$/m)?.[1]);
  if (!Number.isInteger(pageCount) || pageCount < 1) failures.push(`${directory}: invalid PDF page count`);

  let metadata = metadataOverrides[directory] ?? existingByPath.get(sourceRecordPath);
  if (refreshMetadata || !metadata?.authors?.length || !metadata.year || !metadata.venue) {
    metadata = await arxivMetadata(arxiv) ?? await crossrefMetadata(doi, title) ?? metadataOverrides[directory] ?? null;
  }
  if (!metadata?.authors?.length || !metadata.year || !metadata.venue) {
    failures.push(`${directory}: reliable authors/year/venue metadata unresolved`);
    continue;
  }
  const canonicalDoi = doi ?? cleanDoi(metadata.doi);
  const paperId = idByDoi.get(canonicalDoi?.toLowerCase()) ?? `records-${slugify(title)}`;
  const primaryCategory = topicByDoi.get(canonicalDoi?.toLowerCase()) ?? topicFor(title);
  const sourceMismatch = sourceMismatchRecords.get(directory);
  papers.push({
    paper_id: paperId,
    title,
    authors: metadata.authors,
    year: Number(metadata.year),
    venue: metadata.venue,
    doi: canonicalDoi,
    arxiv: arxiv ?? metadata.arxiv ?? null,
    source_record_path: sourceRecordPath,
    pdf_path: path.posix.join(sourceRecordPath, pdfName),
    document_sha256: documentSha256,
    pdf_size_bytes: pdfSizeBytes,
    annotation_path: path.posix.join(sourceRecordPath, 'annotations'),
    page_count: pageCount,
    primary_category: primaryCategory,
    topic_relations: topicRelationsFor(title, primaryCategory),
    atlas_route: sourceMismatch ? null : `/reading/literature/${primaryCategory}/${paperId}/`,
    status: sourceMismatch ? 'source_mismatch' : 'published',
    ...(sourceMismatch ? { failure_reason: sourceMismatch } : {}),
    metadata_source: metadata.metadata_source ?? 'Records source package',
  });
}

papers.push(...pendingPapers);
papers.sort((a, b) => a.title.localeCompare(b.title, 'en'));
const duplicatePaperIds = papers.filter((paper, index) => papers.findIndex((candidate) => candidate.paper_id === paper.paper_id) !== index);
const duplicateDois = papers.filter((paper, index) => paper.doi && papers.findIndex((candidate) => candidate.doi?.toLowerCase() === paper.doi.toLowerCase()) !== index);
const duplicateHashes = papers.filter((paper, index) => paper.document_sha256 && papers.findIndex((candidate) => candidate.document_sha256 === paper.document_sha256) !== index);
if (duplicatePaperIds.length) failures.push(`duplicate paper IDs: ${duplicatePaperIds.map((paper) => paper.paper_id).join(', ')}`);
if (duplicateDois.length) failures.push(`duplicate DOIs: ${duplicateDois.map((paper) => paper.doi).join(', ')}`);
if (duplicateHashes.length) failures.push(`duplicate PDF hashes: ${duplicateHashes.map((paper) => paper.document_sha256).join(', ')}`);
if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const manifest = {
  schema_version: 1,
  authority: 'Maxwell3919/Research-Workflow-Records',
  records_main_sha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: recordsRoot, encoding: 'utf8' }).trim(),
  generated_at: new Date().toISOString(),
  stats: {
    scanned: directories.length,
    atlas_related: papers.length,
    published: papers.filter((paper) => paper.status === 'published').length,
    deduplicated: duplicateRecords.size,
    missing_pdf: papers.filter((paper) => !paper.pdf_path).length,
    unclassified: papers.filter((paper) => !paper.primary_category).length,
    failed: papers.filter((paper) => paper.status === 'source_mismatch').length,
  },
  deduplicated_records: [...duplicateRecords].sort(),
  excluded_records: [...excluded].sort(),
  failed_records: papers.filter((paper) => paper.status === 'source_mismatch').map((paper) => ({
    paper_id: paper.paper_id,
    source_record_path: paper.source_record_path,
    reason: paper.failure_reason,
  })),
  papers,
};
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.stats, null, 2));
console.log(`Wrote ${path.relative(atlasRoot, outputPath)}.`);
