// app.js — bootstrap and view routing for the Leonida Ledger.
//
// Loads the trophy data, wires the tracker, filters, spoiler toggle and
// export/import, and routes by hash: #trophy-<id> opens a guide,
// #roadmap / #sources / #missable switch views. ?demo=1 seeds 12 earned
// trophies on a first visit so the cover shows real progress.

import { DEFAULT_TROPHY_ID, DEMO_EARNED, loadTrophies } from './data.js';
import { KIND_FILTERS, visibleTrophies } from './filters.js';
import { renderAuditStrip, renderProgress, renderTrophyList } from './tracker.js';
import { renderGuide } from './guide.js';
import { renderRoadmap } from './roadmap.js';
import { renderMissableWatch, renderSourceMatrix } from './sources.js';
import {
  exportProgress,
  importProgressFile,
  loadEarned,
  loadSpoilersOn,
  saveEarned,
  saveSpoilersOn,
} from './storage.js';

const VIEWS = ['tracker', 'roadmap', 'sources', 'missable'];

const state = {
  trophies: [],
  earned: new Set(),
  spoilersOn: true,
  filter: 'all',
  query: '',
  selectedId: DEFAULT_TROPHY_ID,
  view: 'tracker',
};

function refreshAll() {
  renderProgress(state.trophies, state.earned);
  const visible = visibleTrophies(state.trophies, state.filter, state.query, state.earned, state.spoilersOn);
  renderTrophyList(state.trophies, visible, state.earned, state.spoilersOn, state.selectedId);
  renderGuide(state.trophies, state.selectedId, state.earned, state.spoilersOn);
}

function showView(view) {
  if (!VIEWS.includes(view)) view = 'tracker';
  state.view = view;
  document.querySelectorAll('.view-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active', section.id === 'view-' + view);
  });
}

function readHash() {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('trophy-')) {
    const id = Number(hash.slice('trophy-'.length));
    if (Number.isInteger(id)) {
      state.selectedId = id;
      showView('tracker');
      refreshAll();
    }
    return;
  }
  if (VIEWS.includes(hash)) showView(hash);
}

function buildFilterChips() {
  const host = document.getElementById('filterChips');
  host.innerHTML = KIND_FILTERS.map(
    (f) => '<button type="button" class="chip' + (f.key === state.filter ? ' active' : '') + '" data-filter="' + f.key + '">' + f.label + '</button>',
  ).join('');
  host.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    state.filter = button.dataset.filter;
    host.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filter === state.filter);
    });
    refreshAll();
  });
}

function wireEvents() {
  document.querySelectorAll('.view-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      showView(tab.dataset.view);
      window.location.hash = tab.dataset.view === 'tracker' ? '' : tab.dataset.view;
    });
  });

  document.getElementById('searchBox').addEventListener('input', (event) => {
    state.query = event.target.value;
    refreshAll();
  });

  const spoilerToggle = document.getElementById('spoilerToggle');
  spoilerToggle.checked = state.spoilersOn;
  spoilerToggle.addEventListener('change', () => {
    state.spoilersOn = spoilerToggle.checked;
    saveSpoilersOn(state.spoilersOn);
    refreshAll();
  });

  document.getElementById('trophyList').addEventListener('click', (event) => {
    const check = event.target.closest('[data-check]');
    if (check) {
      const id = Number(check.dataset.check);
      if (check.checked) state.earned.add(id);
      else state.earned.delete(id);
      saveEarned(state.earned);
      refreshAll();
      return;
    }
    const row = event.target.closest('[data-id]');
    if (!row) return;
    state.selectedId = Number(row.dataset.id);
    window.location.hash = 'trophy-' + state.selectedId;
    refreshAll();
  });

  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state.earned));

  const importFile = document.getElementById('importFile');
  document.getElementById('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files[0];
    if (!file) return;
    try {
      const imported = await importProgressFile(file);
      state.earned = new Set([...imported].filter((id) => state.trophies.some((t) => t.id === id)));
      saveEarned(state.earned);
      refreshAll();
    } catch (_err) {
      window.alert('That file could not be imported — it holds no Leonida Ledger progress.');
    }
    importFile.value = '';
  });

  window.addEventListener('hashchange', readHash);
}

async function boot() {
  state.trophies = await loadTrophies();
  state.earned = loadEarned();
  state.spoilersOn = loadSpoilersOn();

  // Demo mode seeds 12 earned trophies on a first visit only — saved
  // progress is never overwritten.
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') === '1' && state.earned.size === 0) {
    state.earned = new Set(DEMO_EARNED);
    saveEarned(state.earned);
  }

  renderAuditStrip(state.trophies);
  renderRoadmap(state.trophies);
  renderSourceMatrix(state.trophies);
  renderMissableWatch(state.trophies);
  buildFilterChips();
  wireEvents();
  readHash();
  refreshAll();
}

boot();
