# Literature ingestion contract

This contract defines the shortest reliable path from a paper source to an Atlas
Paper Reader. It applies one paper at a time. It does not authorize bulk summaries,
automatic scientific interpretation, or a second literature authority inside Atlas.

## Authority and flow

```text
Mac / Preston                  Web GPT                         Talos
faithful source preparation -> scientific reading record -> evidence integration
PDF + Markdown + assets        notes + figures + claims       anchors + Reader + release
        \________________ Research-Workflow-Records ________________/
                                  |
                                  v
                         Atlas presentation layer
```

- `Research-Workflow-Records@main` owns the PDF, transcription, source assets,
  paper identity, scientific reading record, and canonical Reader annotations.
- Atlas owns the topic assignment, paper index, Reader schema/loader/renderer,
  exact runtime mapping, and public routes. Atlas does not copy the source package.
- The original PDF remains the final evidence source. Markdown and extracted figures
  help agents read and locate content; they do not supersede the PDF.

## 1. Mac / Preston delivery

Place one identified paper in the existing Records layout:

```text
literature/<formal-title>/
├── <formal-title>.pdf
├── <formal-title>.md
├── assets/
├── variants/                 # only when a distinct version must be retained
└── reader/                   # added when scientific reading begins
manifests/readers/<paper-id>.json
```

The minimum metadata is: `paper_id`, title, authors, year, journal, DOI or another
stable identifier, source URL, PDF path/filename, transcription path/filename, and
PDF SHA-256. Reuse the current manifest shape; do not create a provenance database.

Source preparation passes only when the PDF identity and page count are checked,
section order is intact, captions and figure/table numbers are recognizable, linked
assets exist, and equations are usable enough for scientific reading. OCR quality is
checked against the PDF. Mac / Preston records transcription defects but does not
interpret the paper's science.

## 2. Web GPT delivery

Use one continuous paper-specific reading session. Write the scientific record back
under the paper's `reader/` directory in Markdown, JSON, or the existing annotation
document. Its organization follows the paper, but it must make these four things
distinguishable:

1. paper summary: research question, method, principal results, and scope;
2. reading notes: the paper's actual argument in coherent groups, not one fragment
   per paragraph;
3. figure interpretation: what each important figure tests, displays, and supports;
4. claims and evidence: the supporting page/section/figure/text locator and a clear
   boundary between author claim, source record, reader inference, and unknown.

Web GPT supplies source locators and short source text where useful. It does not need
to invent page bboxes. It must not turn a calculated prediction into an experiment,
promote an inference to an author conclusion, or fill an unanswered question with
generic domain knowledge.

## 3. Talos integration

Talos receives the reviewed source package and scientific record, then:

- reconciles paper identity, DOI, filenames, paths, and hashes;
- creates normalized top-left page anchors for text, figures, equations, and tables;
- visually checks every published bbox against the original PDF;
- binds each Reading Note and Figure Note to one or more anchors;
- checks that each published claim has the evidence named by Web GPT;
- adds the paper to the existing topic index and exact runtime whitelist;
- verifies PDF streaming/download, Reader interaction, build, and public deployment.

Talos may correct identity, paths, hashes, labels, and anchor geometry. If scientific
text does not match its cited evidence, Talos returns it with: "This note or claim
lacks reliable source evidence and must be revised in the paper's Web GPT session."
Talos does not silently replace it with a new interpretation.

## 4. Publication gate

A paper may be published only when all four layers pass:

- source: readable PDF, faithful usable transcription, linked assets, stable identity;
- reading: paper-specific summary/notes/figures/claims with explicit boundaries;
- evidence: reviewed anchors resolve to the intended PDF objects and cover every
  published Reading Note or Figure Note;
- Reader: correct metadata, original PDF, range/download behavior, navigation in both
  directions, text selection/copy, direct refresh, checks, build, and live Newt route.

Publication stops and returns to Mac / Preston for missing pages, broken transcription,
or mismatched assets; to Web GPT for unsupported, generic, or boundary-blurring science;
and to Talos for metadata, anchor, runtime, UI, build, or deployment defects.

## Canonical example

`hbn-sin-superconductivity-cdw` is the structural reference, not a template for paper
prose. Its Records package contains an 8-page PDF, ordered Markdown, source assets, an
identity/hash manifest, 35 visually reviewed anchors, and seven coherent Reading Notes.
The five `figure-*` anchors bind real PDF figures to their interpretations. Right-rail
entries use evidence-bound language such as `【来源记录】`, `【来源主张】`, and
`【推断连接】`; the abstract and conclusion notes bound the paper summary.

See the package's `reader/README.md` for the exact map. Future papers may use different
note groups and anchor counts. They must preserve the authority and publication gates,
not copy this paper's rhetorical structure.
