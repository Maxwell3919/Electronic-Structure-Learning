# Talos Literature runtime and Records synchronization

`talos-atlas-literature.service` serves pre-indexed canonical Records PDFs and the anonymous shared annotation API on loopback port 8103. PDF bytes and MinerU/source assets are read-only application data. Shared annotations are runtime data stored one record per file at:

```text
/home/talos/work/Research-Workflow-Records/literature/<paper-package>/annotations/<annotation-id>.json
```

The runtime reads that directory on every annotation GET, so repository edits become visible after browser refresh without an Astro build or service restart. POST validates the document/page/native EmbedPDF payload, takes the shared Records lock, and creates the JSON record atomically. It exposes no PDF, MinerU, Markdown, metadata, delete, or update write route.

PDF SHA-256, byte size, page count, canonical path, and annotation directory are calculated by `npm run generate:literature-index`. The runtime checks the pre-indexed size and `%PDF-` header at startup, then serves HEAD/GET/Range with filesystem streaming; it does not hash or read the complete PDF on the request hot path.

The retired SQLite store remains only as a recovery artifact after an online backup and audit. It is not referenced by the runtime unit.

`talos-research-records-sync.timer` calls the same `talos-sync-research-records` command available to an operator. The timer uses Talos local time, runs at `00:00`, is persistent across missed runs, and records outcomes in the user journal.
