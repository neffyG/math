// Saved progress (this phone only) + spaced repetition + XP math.
import { DECKS, DECK_COLORS } from "./data.js";
import { QUIZLET } from "./quizlet.js";

const KEY = "mathlore:v1";
export const ymd = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (s, n) => { const [y, m, d] = s.split("-").map(Number); return ymd(new Date(y, m - 1, d + n)); };
export const daysBetween = (a, b) => { const p = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 86400000); };

const defaults = () => ({
  name: "Neftali", examDate: null, goal: 30, written: false, sound: true,
  custom: [],            // decks you made or imported: { id, title, short, icon, color, cards:[{t,d}], questions:[] }
  extra: {},             // cards you added to a built-in deck: { deckId: [{t,d}] }
  cards: {},             // card progress: { id: { l: level 0-6, due, r: right, w: wrong, star, seen } }
  qs: {},                // problem progress: { id: { r, w, last } }
  log: {},               // per day: { n: answered, c: correct, xp }
  tests: [],             // test + exam history
  match: {},             // best match time per deck (seconds)
  combo: {},             // best drill combo per drill
  last: null, seenLevel: null,
});
export let S = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)) || {}; return { ...defaults(), ...s }; } catch { return defaults(); }
}
export const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
export const replaceState = (s) => { S = { ...defaults(), ...s }; save(); };

/* ---------- ids ---------- */
const hash = (s) => { let h = 5381; for (const ch of s) h = ((h << 5) + h + ch.codePointAt(0)) >>> 0; return h.toString(36); };
export const cardId = (deckId, c) => `${deckId}:${hash(c.t)}`;
export const qId = (deckId, q) => `${deckId}:q${hash(q.q)}`;

/* ---------- decks ---------- */
export function allDecks() {
  const built = [...DECKS.map((d) => ({ ...d, group: "lecture" })), ...QUIZLET].map((d) => ({ ...d, builtIn: true, cards: [...d.cards, ...(S.extra[d.id] || []).map((c) => ({ ...c, mine: true }))] }));
  const mine = S.custom.map((d) => ({ ...d, group: "mine", cards: d.cards.map((c) => ({ ...c, mine: true })), questions: d.questions || [] }));
  const list = [...built, ...mine].map((d) => ({ ...d, cards: d.cards.map((c) => ({ ...c, id: cardId(d.id, c), from: d.short || d.title })), questions: (d.questions || []).map((q) => ({ ...q, id: qId(d.id, q), deck: d.id })) }));
  // one deck with every Quizlet card — progress is shared with the topic decks
  const qz = list.filter((d) => d.group === "quizlet");
  list.push({ id: "qall", title: "Full Quizlet set", short: "Full Quizlet set", icon: "★", color: "#C98A1F", group: "all", builtIn: true, virtual: true, cards: qz.flatMap((d) => d.cards), questions: [] });
  return list;
}
export const deckById = (id) => allDecks().find((d) => d.id === id);
export const newDeckColor = () => DECK_COLORS[S.custom.length % DECK_COLORS.length];

/* ---------- spaced repetition (Leitner boxes) ---------- */
const GAPS = [0, 1, 2, 4, 8, 16, 32]; // days until a card comes back, by level
export const cs = (id) => (S.cards[id] ||= { l: 0, due: null, r: 0, w: 0, star: false, seen: 0 });
export function grade(id, right, soft = false) {
  const c = cs(id), t = ymd();
  c.seen++;
  if (right) { c.r++; c.l = Math.min(6, c.l + 1); }
  else { c.w++; c.l = soft ? Math.max(0, c.l - 1) : Math.max(0, c.l - 2); }
  c.due = addDays(t, right ? GAPS[c.l] : 0);
  tally(right);
}
export const status = (id) => { const c = S.cards[id]; if (!c || !c.seen) return "new"; return c.l >= 3 ? "mastered" : "learning"; };
export const isDue = (id) => { const c = S.cards[id]; return !!(c && c.seen && c.due && c.due <= ymd()); };
export function deckStats(d) {
  const s = { new: 0, learning: 0, mastered: 0, due: 0, total: d.cards.length };
  for (const c of d.cards) { s[status(c.id)]++; if (isDue(c.id)) s.due++; }
  return s;
}

/* ---------- daily log, XP, levels, streak ---------- */
const today = () => (S.log[ymd()] ||= { n: 0, c: 0, xp: 0 });
export function tally(right) { const t = today(); t.n++; if (right) t.c++; }
export function addXP(n) {
  const t = today();
  const wasUnder = t.n < S.goal || !t.goalXP;
  t.xp += n;
  if (t.n >= S.goal && !t.goalXP) { t.goalXP = true; t.xp += 25; return { goal: true }; }
  return { goal: false, wasUnder };
}
export const totalXP = () => Object.values(S.log).reduce((s, d) => s + (d.xp || 0), 0);
export const RANKS = [
  { min: 1, name: "Student", icon: "🎒" }, { min: 4, name: "Student Teacher", icon: "📝" }, { min: 8, name: "Substitute", icon: "🍎" },
  { min: 13, name: "Math Teacher", icon: "📐" }, { min: 20, name: "Department Head", icon: "📚" }, { min: 28, name: "Assistant Principal", icon: "🗂️" },
  { min: 37, name: "Principal", icon: "🏫" }, { min: 48, name: "Superintendent", icon: "🏛️" }, { min: 60, name: "Doctor of Mathematics", icon: "🎓" },
];
export function level(xp = totalXP()) {
  let lv = 1, acc = 0; const need = (l) => 100 + 20 * (l - 1);
  while (xp >= acc + need(lv)) { acc += need(lv); lv++; }
  return { lv, into: xp - acc, need: need(lv), rank: [...RANKS].reverse().find((r) => lv >= r.min) };
}
export function streak() {
  const met = (d) => (S.log[d]?.n || 0) >= S.goal;
  let n = 0, d = ymd();
  if (!met(d)) d = addDays(d, -1);
  while (met(d)) { n++; d = addDays(d, -1); }
  let best = 0, run = 0;
  for (const k of Object.keys(S.log).sort()) { run = met(k) && S.log[addDays(k, -1)] && met(addDays(k, -1)) ? run + 1 : met(k) ? 1 : 0; best = Math.max(best, run); }
  return { n, best: Math.max(best, n), today: met(ymd()), todayN: S.log[ymd()]?.n || 0 };
}
