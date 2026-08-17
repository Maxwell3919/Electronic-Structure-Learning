# Electronic Structure Atlas agent policy

## Deployment authority

- The source and version-control authority is `Maxwell3919/Electronic-Structure-Learning@main`.
- The only production deployment is the Talos static build and Literature runtime exposed through Newt at `http://188.255.156.20/Electronic-Structure-Learning/`.
- GitHub Pages is retired and is a forbidden deployment target. Do not add a Pages workflow, Pages Actions, a `github-pages` environment dependency, `pages: write`, or `id-token: write`.
- GitHub build checks validate source changes only. A passing Action is not production deployment evidence.
- Production acceptance must read back the Talos services, Newt route, deployment manifest, and relevant browser behavior.

## Literature boundary

- `Research-Workflow-Records@main` is the canonical source for Literature identity, PDFs, extracted source material, and curated annotations.
- Every published Reader serves its canonical Records PDF when package identity, SHA-256, size, PDF magic, and manifest integrity pass. Missing, mismatched, malformed, or path-unsafe sources remain fail closed.
- Do not remove Literature routes or runtime code merely to affect the retired GitHub Pages site; the same source is required by Newt.
- Curated annotations are read-only GitHub-authoritative data. Personal annotations remain browser-local.

## Change discipline

- Preserve scientific prose and source assets unless the task explicitly requires changing them.
- Keep changes single-purpose, run `npm run check`, and verify the formal Newt endpoint after deployment.
