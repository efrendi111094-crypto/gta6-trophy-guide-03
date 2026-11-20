// tracker.js — the checklist, the progress bar, and the audit strip.
// The audit strip shows positive counts only: everything listed, everything
// cited, the cited-step total, the sources used, the missable flagged, and
// the online count (zero — the whole list is single-player).

import { totalCitedSteps } from './data.js';
import { KIND_LABELS, displayDescription, displayName, isMasked } from './filters.js';

export function renderAuditStrip(trophies) {
  const strip = document.getElementById('auditStrip');
  const cited = trophies.filter((t) => t.steps && t.steps.length > 0).length;
  const steps = totalCitedSteps(trophies);
  const sources = new Set();
  trophies.forEach((t) => (t.sources || []).forEach((s) => sources.add(s.split(',')[0])));
  const missable = trophies.filter((t) => t.missable).length;
  const cells = [
    [trophies.length + '/55', 'trophies listed'],
    [cited + '/55', 'guides cited'],
    [String(steps), 'cited steps'],
    [sources.size + ' sources', 'dated Nov 2026'],
    [missable + ' missable', 'flagged & warned'],
    ['0 online', 'all single-player'],
  ];
  strip.innerHTML = cells
    .map(([num, label]) => '<div class="audit-cell"><span class="audit-num">' + num + '</span><span class="audit-label">' + label + '</span></div>')
    .join('');
}

export function renderProgress(trophies, earned) {
  const done = trophies.filter((t) => earned.has(t.id)).length;
  const pct = Math.round((done / trophies.length) * 100);
  document.getElementById('progressText').textContent = done + ' / ' + trophies.length + ' earned';
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('progressFill').style.width = pct + '%';
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function rowHtml(trophy, earned, spoilersOn, selectedId) {
  const masked = isMasked(trophy, earned, spoilersOn);
  const isEarned = earned.has(trophy.id);
  const classes = ['trophy-row'];
  if (isEarned) classes.push('earned');
  if (trophy.id === selectedId) classes.push('selected');
  const countTag = trophy.count
    ? '<span class="count-tag">' + trophy.count + ' tracked</span>'
    : '';
  const missableTag = trophy.missable ? '<span class="flag-tag missable">Missable</span>' : '';
  const hiddenTag = masked ? '<span class="flag-tag hidden-tag">Hidden</span>' : '';
  return (
    '<li class="' + classes.join(' ') + '" data-id="' + trophy.id + '">' +
    '<input type="checkbox" data-check="' + trophy.id + '"' + (isEarned ? ' checked' : '') + ' aria-label="Mark earned">' +
    '<div class="trophy-main">' +
    '<div class="trophy-name">' + escapeHtml(displayName(trophy, earned, spoilersOn)) + '</div>' +
    '<div class="trophy-desc">' + escapeHtml(displayDescription(trophy, earned, spoilersOn)) + '</div>' +
    '<div class="trophy-meta">' +
    '<span class="grade grade-' + trophy.grade + '">' + gradeLabel(trophy.grade) + '</span>' +
    '<span class="kind-tag">' + KIND_LABELS[trophy.kind] + '</span>' +
    countTag + missableTag + hiddenTag +
    '</div></div></li>'
  );
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderTrophyList(trophies, visible, earned, spoilersOn, selectedId) {
  const list = document.getElementById('trophyList');
  const count = document.getElementById('listCount');
  count.textContent = 'Showing ' + visible.length + ' of ' + trophies.length + ' trophies — tick a box to mark it earned; click a row to read its guide.';
  list.innerHTML = visible.map((t) => rowHtml(t, earned, spoilersOn, selectedId)).join('');
}
