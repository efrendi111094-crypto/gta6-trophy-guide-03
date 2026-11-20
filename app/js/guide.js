// guide.js — the open guide panel: the trophy's official facts, its guide
// in this entry's own words, its numbered cited steps, and its sources.
// The panel is never empty: a trophy is always selected.

import { keyFact, trophyById } from './data.js';
import { displayDescription, displayName, isMasked } from './filters.js';
import { escapeHtml } from './tracker.js';

const STAGE_NAMES = {
  1: 'Roadmap stage 1 — Chapter 1',
  2: 'Roadmap stage 2 — Chapters 2–3',
  3: 'Roadmap stage 3 — Chapter 4 & finale',
  4: 'Roadmap stage 4 — Strangers & side work',
  5: 'Roadmap stage 5 — Collectibles & activities',
  6: 'Roadmap stage 6 — Combat, chaos & clean-up',
};

export function renderGuide(trophies, selectedId, earned, spoilersOn) {
  const pane = document.getElementById('guidePane');
  const trophy = trophyById(trophies, selectedId) || trophies[0];
  const masked = isMasked(trophy, earned, spoilersOn);
  const grade = trophy.grade.charAt(0).toUpperCase() + trophy.grade.slice(1);
  const warning = trophy.missable
    ? '<p class="missable-warning">MISSABLE — the Chapter 1 balcony spot outside Lucia\u2019s apartment disappears after Chapter 1, and the game has no mission replay. Do it first.</p>'
    : '';
  const steps = (trophy.steps || [])
    .map((step) => {
      const tags = (step.sources || [])
        .map((s) => '<span class="src-tag">' + escapeHtml(s) + '</span>')
        .join(' ');
      return '<li>' + escapeHtml(step.text) + ' ' + tags + '</li>';
    })
    .join('');
  const sources = (trophy.sources || []).join(' · ');
  pane.innerHTML =
    '<h3>' + escapeHtml(displayName(trophy, earned, spoilersOn)) + '</h3>' +
    '<p class="guide-official">' + escapeHtml(displayDescription(trophy, earned, spoilersOn)) + ' — ' + grade + (trophy.count ? ' · ' + escapeHtml(keyFact(trophy)) : '') + '</p>' +
    warning +
    '<p class="guide-body">' + escapeHtml(masked ? 'This story trophy stays hidden until it is earned. Turn spoilers off to read its guide early.' : trophy.guide) + '</p>' +
    (masked
      ? ''
      : '<p class="steps-title">Cited steps — ' + trophy.steps.length + ' steps</p>' +
        '<ol class="cited-steps">' + steps + '</ol>' +
        '<p class="guide-sources"><strong>Sources:</strong> ' + escapeHtml(sources) + '</p>') +
    '<p class="guide-stage">' + STAGE_NAMES[trophy.stage] + ' · ' + (earned.has(trophy.id) ? 'Earned' : 'Not yet earned') + '</p>';
}
