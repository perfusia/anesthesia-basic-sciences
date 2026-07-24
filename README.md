# Anesthesia Basic Sciences

Self-directed coursework covering the basic-science core underneath nurse anesthesia
practice. Mechanism first, name second, derivation before formula.

Two tracks, one site. Modules run 1 through 9 straight across both, because the material
crosses the boundary anyway: Module 9 depends on Module 2.

| Track | Scope | Modules |
|---|---|---|
| I — Physics & Chemistry | Measurement, gas laws, vapour and solubility, flow, the delivery system, monitoring physics, electrical safety | 1–6 |
| II — Pharmacokinetics & Pharmacodynamics | Compartment models, infusion kinetics, dose-response, inhalational uptake | 7–9 |

## Why these two and not the rest

The COA requires a minimum of 30 graduate semester credits across anatomy, physiology,
pathophysiology, pharmacology, chemistry, biochemistry, and physics. Physics and
pharmacokinetics are the slice of that requirement with no prerequisite anywhere in a
nursing pathway, which makes them the reliable weak point in a cohort.

Deliberately excluded: cardiovascular, respiratory, renal, and acid-base physiology,
which A&P covers, and clinical and specialty anesthesia, which needs bedside context and
has a recency problem.

## Status

| Module | Topic | Pages | Items |
|---|---|---|---|
| 1 | Measurement, Units, and the Gas Laws | 8 | 63 |
| 2 | Vapour, Solubility, and Partition Coefficients | 9 | 72 |
| 3 | Fluid Dynamics and Flow | — | — |
| 4 | The Anesthesia Delivery System | — | — |
| 5 | Physics of Monitoring | — | — |
| 6 | Electricity, Safety, and Hazards in the OR | — | — |
| 7 | Pharmacokinetics I — Single Compartment | — | — |
| 8 | Pharmacokinetics II — Multicompartment and Infusion | — | — |
| 9 | Pharmacodynamics and Inhalational Uptake | — | — |

## Structure

```
/
├── index.html                      course index, both tracks
├── assets/
│   ├── engine.css                  theme, shared and cached across every page
│   └── engine.js                   quiz runtime: locking, mechanism reveal, copy-misses
├── physics/
│   ├── index.html                  Track I landing
│   ├── m1/
│   │   ├── index.html              module landing
│   │   ├── 1-1-units-and-dimensional-analysis.html
│   │   └── ...
│   └── m2/
└── pharmacology/
    └── index.html                  Track II landing
```

Tracks own their own path but share one engine. Adding a module means dropping a data
file in and registering it; nothing else changes.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "modules 1-2"
git branch -M main
git remote add origin https://github.com/<user>/anesthesia-basic-sciences.git
git push -u origin main
```

**Settings → Pages → Source: Deploy from a branch → main / (root)**

Live at `https://<user>.github.io/anesthesia-basic-sciences/`.

### Two deployment details that matter

**Every path is relative.** A project site serves from `username.github.io/<repo>/`, not
the domain root, so `/assets/engine.css` would resolve to `username.github.io/assets/`
and 404. Everything here uses `../` or `../../`, which works on Pages and off disk alike.
The generator fails the build if a root-absolute path appears.

**Every path is lowercase.** GitHub Pages is case-sensitive, macOS is not. Mixed-case
filenames produce a site that works locally and 404s once deployed.

`.nojekyll` is present so Pages serves files verbatim instead of running Jekyll.

### Custom domain

Add a `CNAME` file at the repo root with the domain, then point a DNS `CNAME` record at
`<user>.github.io`. Relative paths keep working unchanged.

## Rebuilding

Content lives in `m<N>_data.py` as plain dicts. Registration lives in `site.py`.

```bash
python3 site.py             # shared assets (default, for hosting)
python3 site.py --inline    # inline css/js into every page
```

Use `--inline` only for pages that must work standalone outside the folder. For hosting,
the default is correct: one cached stylesheet beats duplicating it into every page.

The generator balances correct-answer positions across the whole build so the key does
not cluster on a letter. Current spread: A=25% B=26% C=24% D=24%.

## Quiz behaviour

- **First answer locks.** By design, no changing an answer after selection.
- Mechanism appears on lock, for right and wrong answers alike.
- Fill-in grading is lenient on case and punctuation, strict on order. A two-part answer
  given in reverse is marked wrong, because reversal is usually the exact misconception
  the question exists to catch.
- **Copy my misses** exports question, your answer, correct answer, and mechanism.

## Theme

Paper-and-ink base. Semantic accents follow ISO 26825 anesthesia syringe label colours:
yellow for induction agents, blue for opioids, red for neuromuscular blockers, violet for
vasopressors, green for anticholinergics. Labs use monitor cyan, exams use NMB red.
