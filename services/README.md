# Talos services

`talos-atlas-literature.service` serves pre-indexed canonical Records PDFs and the read-only curated annotation API on loopback port 8103. PDF bytes, MinerU/source assets, metadata, and curated annotations are read-only application data. Editable personal annotations live only in the browser's IndexedDB.

The runtime reads its deploy and synchronization diagnostics from:

```text
dist/deployment-manifest.json
/home/talos/.local/state/electronic-structure-atlas/records-sync-status.json
```

`GET /papers/health` reports the deployed Atlas commit, local and origin Records commits, last successful synchronization, literature-manifest identity, and published-paper count. Reader pages expose this only when opened with `?debug=1`.

`talos-research-records-sync.timer` calls the same `talos-sync-research-records` command available to an operator. It runs every five minutes in Talos local time, is persistent across missed runs, and records outcomes in the user journal and the atomic status file. The sync command is fail-closed: it accepts only a clean local Records checkout that can fast-forward to the validated GitHub authority.

The production path remains:

```text
Atlas static :8101 + Literature runtime :8103 -> Newt -> /Electronic-Structure-Learning/
```
