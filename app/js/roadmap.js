// roadmap.js — the six-stage platinum roadmap, listing all 55 trophies in
// stage order with a grade and a key fact each.

import { ROADMAP_STAGES, keyFact } from './data.js';
import { escapeHtml } from './tracker.js';

export function renderRoadmap(trophies) {
  const host = document.getElementById('roadmapStages');
  host.innerHTML = ROADMAP_STAGES.map((stage) => {
    const members = trophies.filter((t) => t.stage === stage.n);
    const rows = members
      .map((t) => {
        const grade = t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
        const flag = t.missable ? ' <span class="flag-tag missable">Missable</span>' : '';
        return (
          '<li class="stage-row">' +
          '<span class="trophy-name">' + escapeHtml(t.name) + flag + '</span>' +
          '<span class="grade grade-' + t.grade + '">' + grade + '</span>' +
          '<span class="key-fact">' + escapeHtml(keyFact(t)) + '</span>' +
          '</li>'
        );
      })
      .join('');
    return (
      '<div class="stage"><div class="stage-head"><h3>' + escapeHtml(stage.title) + ' — ' + members.length + ' trophies</h3>' +
      '<p>' + escapeHtml(stage.note) + '</p></div>' +
      '<ul class="stage-list">' + rows + '</ul></div>'
    );
  }).join('');
}
