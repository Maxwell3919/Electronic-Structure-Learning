# Talos prompt — integrate the full-site external-resource audit

You are responsible for continuing the public repository:

- Repository: `https://github.com/Maxwell3919/Electronic-Structure-Learning`
- Current production site: `http://188.255.156.20/Electronic-Structure-Learning/`; the GitHub Pages target used when this historical prompt was written is retired.

Use goal mode and complete the work directly in the repository. Do not only produce a plan, sample text, or a list of suggestions.

The external-resource research has already been committed under:

- `docs/external-resource-audit-2026-08-04/README.md`
- `docs/external-resource-audit-2026-08-04/theory-resource-backlog.md`
- `docs/external-resource-audit-2026-08-04/methods-tools-reference-backlog.md`

These files form a large reviewed backlog. They are not page copy and must not be pasted wholesale into the website.

==================================================
1. Synchronize the local repository before doing anything else
==================================================

Your local checkout may be several versions behind the remote repository. Treat the current remote `origin/main` as the repository authority. The SHA stated in the audit documents is only the baseline used during research and may no longer be current.

First inspect the local state without changing it:

```bash
git status --short --branch
git remote -v
git branch --show-current
git rev-parse HEAD
git fetch origin --prune
git rev-parse origin/main
git log --oneline --decorate --graph --max-count=20 --all
```

Record:

- current local branch;
- local HEAD SHA;
- current `origin/main` SHA;
- whether the worktree has staged, unstaged, or untracked changes;
- whether local branches contain commits not on the remote.

### If the local checkout is clean

Update the local main branch only by fast-forward:

```bash
git switch main
git pull --ff-only origin main
```

Confirm:

```bash
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
git status --short --branch
```

### If the local checkout is dirty or contains local-only work

Do **not** run `git reset --hard`, `git clean -fd`, force checkout, force pull, or any command that can discard the user's work.

Preserve the current state first. Choose the least destructive option:

1. create a clearly named safety branch for local commits; and/or
2. create a patch or stash that includes untracked files when appropriate; and preferably
3. create a new clean worktree directly from current `origin/main` for this task.

A safe worktree pattern is:

```bash
git fetch origin --prune
mkdir -p ../electronic-structure-worktrees
git worktree add ../electronic-structure-worktrees/resource-integration origin/main
cd ../electronic-structure-worktrees/resource-integration
git switch -c resources/integration-<date>
```

Before using this exact path or branch name, ensure neither already exists. Do not delete an existing worktree or overwrite an existing branch.

If the repository is detached, diverged, or otherwise unusual, preserve it and perform the task in a new clean worktree from `origin/main`. Report the preserved local state in the final handoff.

Do not begin content work until the active worktree starts from the current remote main SHA.

==================================================
2. Re-read the current repository after synchronization
==================================================

Read at minimum:

- `README.md`
- `AGENTS.md`
- the three audit files listed above;
- current `src/pages/theory/index.astro`;
- current `src/pages/methods/index.astro`;
- current `src/pages/computational-tools/index.astro`;
- current `src/pages/reference/index.astro`;
- every target page before editing it.

Also inspect:

- current open issues;
- current open pull requests;
- active task branches that could overlap;
- recent merged PRs and commits affecting resources or the target pages.

Do not assume that page content, links, or the number of pages still matches the audit baseline.

==================================================
3. Understand the project boundaries
==================================================

Preserve the current site architecture:

- Plain Astro;
- static output;
- white, text-first design;
- system serif typography;
- no Starlight;
- no CMS;
- no search;
- no client hydration or page-specific JavaScript;
- no packaged fonts;
- no general data registry;
- native MathML with TeX annotations for mathematics.

This task is external-resource integration. It does not authorize a framework migration, visual redesign, navigation rewrite, new content-management layer, or restoration of the legacy Part/Chapter/course system.

Keep these responsibilities distinct:

- Theory explains concepts and may provide a small number of page-local study routes.
- Methods is a concise conceptual map of method families.
- Computational Tools classifies software, workflow systems, databases, and infrastructure.
- Reference indexes durable reviewed collections, benchmarks, learning hubs, and official portals.
- DFT Research Workflow remains the detailed operations, execution, convergence, validation, provenance, and research-protocol project.

==================================================
4. Treat the audit as a candidate set, not a mandatory checklist
==================================================

For every candidate resource considered:

1. open the current primary destination;
2. confirm the title, owner/author/institution/project, and visible scope;
3. check whether it is still maintained or historically valuable;
4. identify access conditions: open, enrolment, registration, commercial, licensed, or version-bound;
5. check the current target page for duplication;
6. define the exact learning, implementation, validation, or reference role;
7. state what the resource does **not** establish;
8. reject or defer it if the role is redundant or the provenance is unclear.

Do not rely on search snippets alone. Follow links to the primary or maintained destination.

Do not accept a resource because it is famous, highly viewed, highly starred, widely cited, from a prestigious institution, or commonly used. Those are discovery signals only.

Do not copy copyrighted textbook text, course notes, figures, slides, videos, exercises, datasets, screenshots, or restricted files into the repository. Link and summarize in original prose.

==================================================
5. Resource placement rules
==================================================

### Theory pages

A typical mature Theory page should usually contain a small combination such as:

- one rigorous theory spine;
- one accessible or Chinese route when it adds real value;
- one executable, notebook, or visual bridge;
- one official implementation or benchmark route when the topic requires it.

Do not add every alternative. When a page already has these roles, leave it unchanged and keep additional candidates in Reference or the audit.

Every page-local resource paragraph must explain:

- what the resource teaches or demonstrates;
- the prerequisite or intended stage where relevant;
- why it is distinct from existing routes;
- its access/version boundary;
- what completing or running it does not validate.

Do not add generic praise such as “excellent”, “comprehensive”, or “widely used” without specifying the actual role.

### Methods

Methods must remain concise. Add no more than one or two external gateways per method family, and only when they help a reader move from the conceptual method description to a maintained course, school, or official method overview.

Do not turn Methods into:

- a software directory;
- a paper database;
- a parameter manual;
- a duplicate of DFT Research Workflow;
- a second Theory resource list.

### Computational Tools

This is the main structural resource gap. Organize the page by scientific role, for example:

1. electronic-structure engines;
2. molecular and many-body engines;
3. structure, symmetry, cells, and reciprocal-space tools;
4. workflow and provenance systems;
5. databases and interoperability;
6. phonon, electron–phonon, and transport tools;
7. defects, surfaces, interfaces, and reaction paths;
8. bonding, charge, topology, and post-processing;
9. visualization;
10. HPC, environments, testing, and preservation.

For the first public version, select roughly three to eight representative tools per category. Provide concise descriptions and route users to the official destination. Keep specialist alternatives in Reference or in the audit.

Every tool entry must retain the boundary:

> Installation, normal termination, parser success, workflow completion, or provenance capture does not establish representation convergence, observable convergence, physical validity, or scientific support.

Do not place program-specific commands, input templates, output semantics, or troubleshooting instructions on this page. Those belong to DFT Research Workflow or code-specific documentation.

### Reference

Reference should contain durable reviewed collections rather than every page-local link. Organize it by role, such as:

- core books and open notes;
- open courses and school hubs;
- official code tutorial portals;
- benchmark and verification collections;
- materials, molecular, crystallographic, spectroscopic, and thermochemical databases;
- FAIR data, provenance, interoperability, and preservation resources.

Each collection needs a specific reason for inclusion and an access/scope boundary. Do not publish an unannotated bibliography or alphabetized link dump.

### Home

Home should remain minimal. Add a small ecosystem map only if it fits the current page without changing the design. Prefer no more than four external ecosystems plus DFT Research Workflow.

==================================================
6. Recommended execution order
==================================================

Use small, single-purpose branches and PRs. Do not attempt to integrate the entire backlog in one PR.

Recommended waves:

### Wave 1 — structural resources

1. Computational Tools taxonomy and first representative set.
2. Reference structure and first durable collections.
3. Optional minimal Home ecosystem map.
4. Selective Methods gateways.

### Wave 2 — high-return Theory gaps

Prioritize:

- Numerical Analysis;
- Self-Consistent Field Methods;
- Discretization and Basis Representations;
- Plane-Wave and Real-Space Methods;
- Localized-Orbital Methods;
- Pseudopotentials and PAW;
- Chemical Bonding and Molecular Structure;
- Surface and Interface Chemistry;
- Linear Response and Excited States;
- electron–phonon, transport, GW/BSE, topology, and magnetism bridges.

### Wave 3 — diversity and alternatives

Add source-clear Chinese routes, executable notebooks, interactive material, and specialist alternatives only where a distinct role remains missing.

A practical PR should normally touch one site section or around three to eight pages/resources. Re-read remote main before every new branch because another session may be working in parallel.

==================================================
7. Branch and PR discipline
==================================================

For each batch:

1. fetch current remote state;
2. confirm no overlapping open PR or task branch;
3. branch from the current `origin/main` SHA;
4. make only the intended resource changes;
5. add or update a dated review record under `docs/` describing accepted, deferred, and rejected candidates;
6. inspect the complete diff;
7. run the required checks;
8. open a single-purpose PR;
9. inspect the PR merge ref and CI logs;
10. confirm the base and head have not moved before merging;
11. merge using the expected fixed head SHA;
12. re-read the final remote main files.

Do not mix Theory, Methods, Tools, Reference, visual redesign, or unrelated maintenance in one PR unless the batch is explicitly a cross-section structural change and the diff remains easy to review.

==================================================
8. Required verification
==================================================

Minimum local gate:

```bash
npm ci --no-audit --no-fund
npm run check
git diff --check
```

Also verify:

- native MathML remains visible on every modified mathematical page;
- every mathematical expression still contains a TeX annotation;
- no page-level horizontal overflow at desktop and 390-pixel width;
- keyboard navigation remains usable;
- the site works with JavaScript disabled;
- no client JavaScript, hydration, packaged fonts, Starlight, CMS, search, or general data registry has been introduced;
- all new external links resolve to the intended primary or maintained destination;
- links do not silently redirect to an unrelated product, login wall, or unofficial mirror.

A successful build verifies structure and covered runtime behaviour. It does not constitute scientific review.

==================================================
9. Deployment and completion claims
==================================================

Repository merge and website deployment are separate facts.

Do not claim the public site is updated until you have:

- the final merged `main` SHA;
- a successful deployment tied to that exact SHA or an exact deployment manifest;
- live smoke results for the affected routes;
- narrow-screen and JavaScript-disabled checks where public behaviour changed.

If the connector or environment cannot observe the exact-main deployment, report deployment as `unknown / not independently verified` rather than assuming success.

==================================================
10. Required final handoff
==================================================

After each batch, report:

1. local state found before synchronization;
2. how local-only or dirty work was preserved;
3. initial remote main SHA;
4. final remote main SHA;
5. branch and PR;
6. exact files and public routes changed;
7. accepted resources and their roles;
8. deferred/rejected resources and reasons;
9. verification commands and results;
10. whether CI tested the branch head, a synthetic PR merge ref, or the final main commit;
11. exact-main deployment and live-smoke status;
12. remaining audit priorities.

Continue through the waves without requesting repeated authorization, but stop and report rather than discarding local work, overwriting another session, changing repository architecture, or bypassing failed verification.
