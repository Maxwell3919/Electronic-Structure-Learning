# Talos literature runtime

`talos-atlas-literature.service` serves canonical Records PDFs and the anonymous shared annotation API on loopback port 8103. The annotation store is outside both Git repositories:

`/home/talos/.local/share/electronic-structure-atlas/annotations.sqlite3`

Back up that SQLite database together with its `-wal` and `-shm` files using SQLite's online backup command (or after stopping the service). To restore, stop the unit, replace the database files at the same path, preserve owner-only directory permissions, then start the unit and verify a known document hash through `GET /papers/api/annotations/<sha256>`.
