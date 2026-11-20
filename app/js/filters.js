// filters.js — kind filters, search, and the spoiler rule.
//
// Spoiler rule: a hidden trophy stays masked — name and description hidden —
// while spoilers are on and the trophy is not yet earned. Earned trophies
// always show, and nothing else is ever masked.

export const KIND_FILTERS = [
  { key: 'all', label: 'All 55' },
  { key: 'story', label: 'Story' },
  { key: 'missable', label: 'Missable' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'side', label: 'Side' },
  { key: 'combat', label: 'Combat' },
  { key: 'completion', label: 'Completion' },
  { key: 'platinum', label: 'Platinum' },
  { key: 'earned', label: 'Earned' },
  { key: 'remaining', label: 'Remaining' },
];

export const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  side: 'Side',
  combat: 'Combat',
  completion: 'Completion',
  platinum: 'Platinum',
};

export function isMasked(trophy, earned, spoilersOn) {
  return spoilersOn && trophy.hidden && !earned.has(trophy.id);
}

export function displayName(trophy, earned, spoilersOn) {
  return isMasked(trophy, earned, spoilersOn) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, earned, spoilersOn) {
  return isMasked(trophy, earned, spoilersOn)
    ? 'Hidden until earned — turn spoilers off or earn it to reveal the name and description.'
    : trophy.description;
}

export function matchesFilter(trophy, filter, earned) {
  if (filter === 'all') return true;
  if (filter === 'missable') return trophy.missable === true;
  if (filter === 'earned') return earned.has(trophy.id);
  if (filter === 'remaining') return !earned.has(trophy.id);
  return trophy.kind === filter;
}

export function matchesSearch(trophy, query, earned, spoilersOn) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (isMasked(trophy, earned, spoilersOn)) return false;
  return trophy.name.toLowerCase().includes(q) || trophy.description.toLowerCase().includes(q);
}

export function visibleTrophies(trophies, filter, query, earned, spoilersOn) {
  return trophies.filter(
    (t) => matchesFilter(t, filter, earned) && matchesSearch(t, query, earned, spoilersOn),
  );
}
