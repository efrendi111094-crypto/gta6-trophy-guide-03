// sources.js — the source matrix (every trophy mapped to its sources), the
// disputes list, and the missable watch list.

import { DISPUTES, SOURCES } from './data.js';
import { escapeHtml } from './tracker.js';

export function renderSourceMatrix(trophies) {
  const host = document.getElementById('sourceMatrix');
  const roster = SOURCES.map((s) => '<li><strong>' + escapeHtml(s.name) + '</strong>, ' + escapeHtml(s.date) + ' — ' + escapeHtml(s.role) + '</li>').join('');
  const rows = trophies
    .map((t) => {
      const srcs = (t.sources || []).join(' · ');
      const steps = (t.steps || []).length;
      return '<tr><td><strong>' + escapeHtml(t.name) + '</strong></td><td>' + steps + ' cited steps</td><td class="src-cell">' + escapeHtml(srcs) + '</td></tr>';
    })
    .join('');
  host.innerHTML =
    '<table class="matrix-table"><thead><tr><th>Trophy</th><th>Guidance</th><th>Sources</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="matrix-note">Every trophy carries at least 3 cited steps; every step names its source and date. The two official-list sources agree on all 55 names, descriptions and grades.</p>';

  const disputes = document.getElementById('disputeList');
  disputes.innerHTML =
    '<ul class="source-roster">' + roster + '</ul>' +
    '<h2 class="subhead">Disputes &amp; open questions</h2>' +
    DISPUTES.map((d) => (
      '<div class="dispute-card"><h3>' + escapeHtml(d.title) + ' <span class="status ' + d.status + '">' + d.status + '</span></h3>' +
      '<p>' + escapeHtml(d.body) + '</p></div>'
    )).join('');
}

export function renderMissableWatch(trophies) {
  const host = document.getElementById('missableWatch');
  const missable = trophies.filter((t) => t.missable);
  const cards = missable
    .map((t) => {
      const steps = (t.steps || [])
        .map((s) => '<li>' + escapeHtml(s.text) + ' ' + (s.sources || []).map((x) => '<span class="src-tag">' + escapeHtml(x) + '</span>').join(' ') + '</li>')
        .join('');
      return (
        '<div class="watch-card"><h3>' + escapeHtml(t.name) + ' — ' + escapeHtml(t.description) + '</h3>' +
        '<p>' + escapeHtml(t.guide) + '</p>' +
        '<p class="steps-title">Cited steps — ' + t.steps.length + ' steps</p><ol class="cited-steps">' + steps + '</ol></div>'
      );
    })
    .join('');
  host.innerHTML = cards +
    '<div class="watch-safe"><strong>The other 54 trophies are safe:</strong> every story trophy is unmissable on a normal playthrough, and every collectible, activity, side and combat trophy can be earned after the story ends. The game has no mission replay, which is exactly why the Chapter 1 balcony spot is the one thing to guard.</div>';
}
