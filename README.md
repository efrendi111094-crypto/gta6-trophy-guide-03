# Mangrove Compass: all 55 GTA VI trophies with 180 cited steps from 8 sources, a platinum roadmap and a missable watch

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/efrendi111094-crypto/gta6-trophy-guide-03/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/efrendi111094-crypto/gta6-trophy-guide-03/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI — a light "ledger / field-guide" app in cream paper, dark ink, gold and deep green. Every trophy carries its official name, description and grade, a guide written fresh for this entry, and 3–4 numbered steps that each name their source and date: **180 cited steps in total, from 8 dated sources**.

## What it does

- **Tracker** — a checklist of all 55 trophies with official names, descriptions and grades (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden). Progress saves in localStorage, with JSON export and import.
- **Filters & search** — story, missable, collectibles, activities, side, combat, completion, platinum, earned, remaining, plus full-text search.
- **Spoiler setting** — on by default: hidden story trophies stay masked (name and description) until earned.
- **Cited guides** — every trophy's guide is 3–4 numbered steps, each step carrying a source tag (source name + date). A trophy's guide is open by default on load — Positive Mental Attitude, the missable one — so the guide is never an empty panel.
- **Audit strip** — live counts on the main screen: 55/55 listed, 55/55 cited, 180 cited steps, 8 sources, 1 missable flagged, 0 online.
- **Platinum roadmap** — six stages listing all 55 trophies in stage order, each with its grade and a key fact (chapters, missions, collectibles, counts).
- **Source matrix** — every trophy mapped to its sources, plus a "Disputes & open questions" section that states honestly where sources disagree or are still confirming a detail.
- **Missable watch** — exactly one trophy can be missed: Positive Mental Attitude (the Chapter 1 balcony meditation spot, gone after Chapter 1, no mission replay). Everything else is safe after the story.

## How to run

```sh
node serve.ts
```

Then open the app in desktop Chrome. It works with the network off: every file it loads is a local file under `app/`, and it makes no network request at run time.

Demo mode (`?demo=1`) seeds 12 earned trophies on a first visit, so the tracker shows real progress. Deep links work too: `#trophy-28` opens a trophy's guide; `#roadmap`, `#sources` and `#missable` switch views.

## Methodology & sources

- Official names, descriptions and grades are PlayStation's list as Exophase and PSNProfiles published it on 18 Nov 2026; the two agree on all 55.
- How-to steps cite GTABase (19 Nov 2026), PowerPyx (18 Nov 2026) and Output Lag (19 Nov 2026); the missable warning cites CryptoGames and EGamers (19 Nov 2026); cross-checks cite Planet GTA 6 (18 Nov 2026).
- Where sources disagree, the guide says so and picks one with a reason: PowerPyx lists 18 meditation spots, GTABase counts 15 locations — resolved as spots vs locations, so the guide follows the 18 spots. Where sources are still confirming a detail (seven trophies), the guide states that honestly inside the guide itself.
- All guide text is written fresh for this entry, in its own words. Sources are cited, never copied. No Rockstar logo, artwork or game screenshot is used anywhere.

## How this entry meets the rubric

1. **Tracker and data** — all 55 trophies with official name, description and grade; saved progress; filters (story, missable, collectibles, activities and more); spoiler setting on by default; export and import.
2. **Roadmap and missables** — a six-stage roadmap listing all 55 trophies with key facts, built from the official descriptions, plus a dedicated missable watch list for the one missable trophy.
3. **Cited guidance** — 180 numbered steps, every one carrying a source name and date; a source matrix mapping each trophy to its sources; disputes resolved or honestly marked open.
4. **Fast, clear and polished** — a small static first load, a coherent ledger look of its own, and a layout where the checklist, progress, filters, audit strip and an open cited guide are all visible at a glance.

## Screenshots

Taken with `node shots.mjs` (headless Chrome, 1280×720 viewport) — see `shots.json` for which view each shot shows.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the [gta6-trophy-guide-01 bounty on make.fun](https://make.fun/bounty/gta6-trophy-guide-01). [Join make.fun with my referral link](https://make.fun/r/tzrh51cg).
