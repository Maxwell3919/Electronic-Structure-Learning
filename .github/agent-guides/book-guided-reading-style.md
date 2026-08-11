# Book Guided Reading writing style

This file is repository guidance for maintainers and automated agents. It is not rendered or linked from the public website. The repository is public, so the file is not confidential; it is “internal” only in the sense that readers do not encounter it as part of the learning site.

Read this file before creating or revising any page under `Guided Reading → Books`.

## Purpose

A book guide should help a reader reconstruct and understand the source's argument while remaining clearly shorter than the source. It should preserve the source's sequence, terminology, and conceptual emphasis, then add only the modern context needed to connect the material to present electronic-structure research.

The guide is not:

- a textbook reproduction;
- a generic summary detached from the source;
- a complete modern review article;
- a software tutorial;
- a rigid template filled with repeated headings;
- a place for progress, status, or project-management language.

## Language and tone

- Write in English.
- Use the original chapter title as the page title.
- Prefer direct scientific prose over promotional, administrative, or process language.
- Avoid words such as `contract`, `protocol`, `compliance`, `acceptance gate`, `status`, and similar governance language when describing learning or reading.
- Avoid repetitive contrast formulas such as “not X, but Y” when a direct statement is clearer.
- Do not address the reader with unnecessary commands or motivational filler.
- Do not imitate the source sentence by sentence. Use original prose while preserving its meaning and order.

## Page opening

Begin with one sentence labeled **Core Idea**.

The sentence should state the purpose of the chapter, not merely list its topics.

Good form:

> **Core Idea.** This chapter shows how periodicity converts the one-electron problem in a crystal into Bloch states and energy bands.

Weak form:

> **Core Idea.** This chapter discusses crystals, Bloch functions, bands, and metals.

## Organization

Follow the source's reasoning order. Divide the body into the number of themes naturally required by the chapter.

A typical page may contain:

```text
Original chapter title
Core Idea

Theme 1
Theme 2
Theme 3
...

Modern Perspective, when needed
Chapter Synthesis
```

This is not a required visible template. Omit headings that would be empty or repetitive. Rename themes according to the chapter's actual logic.

Adjacent minor source sections may be merged when they form one continuous argument. Do not move a later result ahead of the assumptions or conceptual steps that make it understandable.

## What to retain

Each theme keeps only what is needed to reconstruct the argument:

- central concepts;
- necessary contributors when their work marks a conceptual transition;
- physical meaning;
- decisive assumptions;
- formulas that define, connect, or limit the theory;
- direct consequences for later chapters or present research.

Omit secondary examples, repeated explanations, long bibliographic lists, and derivations that do not add physical understanding.

## Historical material

Historical content should explain development rather than preserve every detail.

Compress secondary history into a causal timeline when useful:

```text
observation or conceptual difficulty
→ new physical idea
→ calculable formulation
→ influence on present methods
```

Keep names only when the contribution is needed to understand the change in theory. Usually omit biographies, institutional history, award history, and minor priority disputes.

A historical method may still receive careful explanation when modern methods inherit its central idea.

## Depth selection

Do not allocate equal space to every source section. Give more depth when a topic:

- is required by later chapters;
- remains part of current calculations or interpretation;
- directly led to an active method;
- has a restricted validity range that is often misunderstood;
- changes how researchers formulate, compute, validate, or interpret a problem.

Do not expand a topic merely because it is recent. Do not compress a topic merely because it is old.

## Formulas

Include a formula only when it does at least one of the following:

1. defines an object used repeatedly later;
2. completes the chapter's decisive conceptual step;
3. exposes an approximation or validity condition;
4. connects directly to an observable or quantity used in research.

Normally omit:

- intermediate algebra;
- immediately recoverable mathematical steps;
- several equivalent forms that add no new physical meaning;
- formulas used only in a secondary example;
- complete derivations already available in Foundations or an earlier guide page.

For each retained formula, explain in the surrounding prose:

- what it represents;
- the meaning of its important terms;
- why it matters physically;
- the assumptions under which it is valid.

Do not repeat these as fixed labels for every equation.

All public mathematics must use native MathML with one TeX annotation inside `<semantics>`. Display mathematics uses the shared `.math-display` wrapper.

## Diagrams

Add a simple original diagram only when it clarifies something that prose alone makes harder to see:

- development over time;
- causal structure;
- hierarchy of approximations;
- input → transformation → output;
- reciprocal-space or real-space geometry;
- inheritance between methods;
- branches between ground-state, response, and excitation theories.

Prefer compact text or SVG diagrams for abstractions that have no fixed source visual. Do not add decorative images. If the page specifically discusses a real source figure or table and a reliable source asset is available, use the shared source-media manifest and an exact, tightly cropped excerpt with lightweight caption and provenance instead of redrawing that object. Do not publish a full textbook page or imply that an excerpt has an open licence.

## Source-aligned explanation and modern additions

Write the source's argument first. Add later developments only after the reader can distinguish them from the source.

Modern additions may explain:

- how the theory is used today;
- which later extension became important;
- which interpretation now requires more care;
- which limitation motivates another method;
- what specialized literature is needed next.

Do not silently insert modern claims into the source narrative. Use wording such as `Modern perspective`, `Later development`, or an equivalent natural transition when the distinction would otherwise be unclear.

Modern additions must remain directly connected to the chapter. Do not turn one chapter into a survey of every related frontier topic.

## Relationship to the rest of the Atlas

Link to Foundations when a concept already has a canonical explanation or course route. Link to Methods when the chapter introduces or compares a method family. Link to Computational Tools or DFT Research Workflow only when the discussion reaches practical implementation.

Do not duplicate:

- complete Foundations explanations;
- course inventories;
- software command sequences;
- convergence procedures;
- workflow operation pages.

## Length

The page must be clearly shorter than the source chapter while still sufficient for recall and understanding.

There is no fixed word count. Length depends on:

- conceptual density;
- later dependence;
- present research relevance;
- risk of misuse;
- number of decisive formulas.

Short historical sections may become a few paragraphs or one timeline. Central chapters on DFT, Kohn–Sham theory, numerical representations, response, or topology may require more space.

## Closing

End with a short synthesis only when it adds value. It should connect the chapter's main result to the next part of the source or to the relevant research question.

Do not repeat the Core Idea in slightly different words. Do not add separate `Summary`, `Key Takeaways`, and `What You Learned` sections that say the same thing.

## Source and copyright handling

- Use the source chapter as the primary basis.
- Preserve its terminology, organization, framing, and level of detail where relevant.
- Clearly distinguish source-derived content from modern additions or external research.
- If the source does not support a claim, do not attribute it to the source.
- Use original prose.
- Do not commit textbook pages, complete extracted text, or page scans. A source-linked figure or table excerpt is allowed only when the shared media manifest records its source, figure/table identifier, page, retrieval URL, usage pages, hash, and rights note; it must preserve the original data and labels.
- Do not expose private source-file paths in public pages.

## Before publishing

Check that the page:

- uses the original chapter title;
- begins with one useful Core Idea sentence;
- follows the source's actual reasoning order;
- contains no unnecessary historical detail;
- explains the physical meaning of retained formulas;
- clearly separates later developments from the source;
- links instead of repeating existing Atlas content;
- is substantially shorter than the source;
- contains no copied source text or untracked source visuals; any source-linked figure or table is recorded in the shared media manifest;
- avoids administrative wording in public prose;
- renders correctly with JavaScript disabled and at 390-pixel width.

The final editorial question is:

> Does this page materially improve how a researcher understands, formulates, computes, validates, or interprets an electronic-structure problem?
