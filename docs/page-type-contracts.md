# Page type contracts

| Type | Shared structure | Width and visual density | State and fallback |
| --- | --- | --- | --- |
| Home | `EditorialPageHero`, learning paths, three primary entrances, progress, next steps | 88rem outer canvas; one restrained original SVG motif | Registry-driven state; complete navigation without JavaScript |
| Learning Path | editorial section hero, prerequisite trail, milestones, progress overview | 72rem working width; route cards allowed | Local progress is optional; milestones remain readable without JavaScript |
| Theory Chapter | reading header/column, margin/source/assumption/evidence notes, wide figures | 47rem prose with 72rem figure breakout | Scientific meaning remains in chapter components; notes enter flow on narrow screens |
| Lab / Case | objective/task, interaction or result area, convergence and evidence boundary | 72rem work area; compact readouts | Planned entries stay planned; controls need labels and static fallback |
| Appendix / Reference | restrained reading column and compact catalogs | 47rem prose; low card and motion density | No decorative animation required; full content remains available without JavaScript |

Only Home and a small number of authored interactions may use non-essential motion. All types must preserve Pages base paths, keyboard focus, reduced motion, local formula overflow, bilingual language markup, and print completeness.
