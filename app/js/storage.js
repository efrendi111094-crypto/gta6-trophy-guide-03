// storage.js — saved progress in localStorage, plus JSON export and import.
// Nothing leaves the browser except a file the reader asks for.

const EARNED_KEY = 'mangrove-compass-earned-v3';
const SPOILER_KEY = 'mangrove-compass-spoilers-v3';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (_err) {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(EARNED_KEY, JSON.stringify(Array.from(earned).sort((a, b) => a - b)));
  } catch (_err) {
    // Private browsing or a full store: the checklist still works in memory.
  }
}

export function loadSpoilersOn() {
  try {
    const raw = localStorage.getItem(SPOILER_KEY);
    return raw === null ? true : raw === '1';
  } catch (_err) {
    return true;
  }
}

export function saveSpoilersOn(on) {
  try {
    localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
  } catch (_err) {
    // See saveEarned: the toggle still works in memory.
  }
}

export function exportProgress(earned) {
  const payload = {
    app: 'Mangrove Compass',
    version: 3,
    exportedAt: new Date().toISOString(),
    earned: Array.from(earned).sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mangrove-compass-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('That file holds no earned list.');
  return new Set(ids.filter((n) => Number.isInteger(n)));
}
