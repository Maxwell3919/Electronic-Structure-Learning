# Editorial Quantum Atlas design system

Editorial Quantum Atlas combines an editorial paper surface, ink-led hierarchy, restrained indigo emphasis, teal evidence states, amber assumptions, and red errors. All color, spacing, typography, widths, and motion values are exposed through semantic `--esl-*` tokens.

The system uses local system font stacks only. Display headings use a serif stack; body, mathematics, and code remain optimized for reading. The shared layout provides a 47rem reading column, 72rem figure/interaction width, and 88rem outer limit.

Components are static-first, keyboard reachable, and understandable without JavaScript. Margin notes collapse into document flow, wide figures cannot create page-level overflow, long formulas scroll locally, and non-essential motion respects `prefers-reduced-motion`.

Token values may be contrast-tuned without changing their semantic roles. Reference projects inform responsibilities and principles only; no external brand assets or implementation are copied.
