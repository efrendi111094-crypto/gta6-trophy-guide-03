// data.js — trophy loading, the eight dated sources, and the roadmap stages.
// All trophy facts come from app/data/trophies.json; this module adds the
// source roster and stage plan the views share.

export const SOURCES = [
  { name: 'Exophase', date: '18 Nov 2026', role: 'Official names, descriptions and grades' },
  { name: 'PSNProfiles', date: '18 Nov 2026', role: 'Official list cross-check and tracked counts' },
  { name: 'GTABase', date: '19 Nov 2026', role: 'How-to steps and locations' },
  { name: 'PowerPyx', date: '18 Nov 2026', role: 'How-to steps and collectible counts' },
  { name: 'Output Lag', date: '19 Nov 2026', role: 'How-to steps and activity guides' },
  { name: 'CryptoGames', date: '19 Nov 2026', role: 'Missable warning and story order' },
  { name: 'EGamers', date: '19 Nov 2026', role: 'Missable warning and story order' },
  { name: 'Planet GTA 6', date: '18 Nov 2026', role: 'Cross-checks on every trophy' },
];

// The 12 trophies the demo mode (?demo=1) marks earned: the early story
// trophies plus a few activities, so the cover shows real progress.
export const DEMO_EARNED = [2, 3, 4, 5, 8, 9, 10, 11, 16, 21, 46, 53];

// The trophy the guide opens on by default: the missable one, so the
// cover always shows a full cited guide, never an empty panel.
export const DEFAULT_TROPHY_ID = 28;

export const ROADMAP_STAGES = [
  { n: 1, title: 'Stage 1 — Chapter 1: First Steps in Leonida', note: 'Play the opening, and meditate at the balcony spot before the chapter ends.' },
  { n: 2, title: 'Stage 2 — Chapters 2–3: The Story Deepens', note: 'Keep the story moving; start the long grinds between missions.' },
  { n: 3, title: 'Stage 3 — Chapter 4 & Finale: The Story Closes', note: 'Finish the story. The world stays open afterwards for everything else.' },
  { n: 4, title: 'Stage 4 — Strangers & Side Work', note: 'Contact lines, stranger strands, hunting, money and property.' },
  { n: 5, title: 'Stage 5 — Collectibles & Activities', note: 'Cards, WAiNK spots, races, ranges, exploration and the odd one-offs.' },
  { n: 6, title: 'Stage 6 — Combat, Chaos & Clean-Up', note: 'Robberies and wanted-level feats, then 100% completion and the platinum.' },
];

export const DISPUTES = [
  {
    title: 'Meditation spots: 18 or 15?',
    status: 'resolved',
    body: 'PowerPyx lists 18 meditation spots; GTABase counts 15 locations. Resolved: some locations hold more than one spot, so the two counts describe the same set differently. This guide follows the 18-spot count — meditate at every spot you find, and the trophy pops at the last one.',
  },
  {
    title: 'Strangers & Freaks: which 8 strands?',
    status: 'open',
    body: 'Four strands are named in the guides so far — Kirk, Kyle, Yago and Pilot Pete. The remaining strands are still being confirmed by the sources. The guide says so honestly: meet every stranger, finish every strand you start, and the eighth completion pops the trophy.',
  },
  {
    title: 'Unconfirmed triggers — stated inside their guides',
    status: 'open',
    body: 'Seven trophies have details the sources are still confirming: Fair Game (which animal triggers it), In The Beginning… (the exact Ocean Beach cocktail steps), Capital Offense (the exact showroom), Bad Luck, I Guess (the exact trigger), The Truth Is Out There (the trigger), Ten Pin (the exact melee drive-by conditions), and the unnamed Strangers & Freaks strands. Each guide states what is known, what is not, and the best next step — no guess is dressed up as fact.',
  },
];

export async function loadTrophies() {
  const res = await fetch('data/trophies.json');
  const data = await res.json();
  return data.trophies.slice().sort((a, b) => a.stage - b.stage || a.id - b.id);
}

export function totalCitedSteps(trophies) {
  return trophies.reduce((sum, t) => sum + (t.steps ? t.steps.length : 0), 0);
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function keyFact(trophy) {
  if (trophy.count) {
    const units = {
      'Cunning Stunts': 'stunts',
      'The Shootist': 'Shooting Range challenges',
      'Top Fun': 'drone race locations',
      'Earn Cash, Not Kudos': 'different races',
      'Master of None': 'activity types',
      'Strangers & Freaks': 'stranger strands',
      'Positive Mental Attitude': 'meditation spots',
      "Don't Touch My Deck": 'card sets',
      'You WAiNKer!': 'WAiNK locations',
      'One Last Thing': 'challenges',
      'Retail Therapy': 'shops back-to-back',
      'Whip It Good': 'vehicles',
      'Gunslinger': 'enemies in one Combat Focus',
      'Maximum Withdrawal': 'bank vaults',
      'The Goodtime State': 'areas of Leonida',
      'Pest Control': 'gangs',
      'Actions Speak Louder': 'choices tracked',
      'Little Boxes': 'garage properties',
      'On the Spot': 'vehicles registered',
    };
    return trophy.count + ' ' + (units[trophy.name] || 'tracked');
  }
  return trophy.description;
}
