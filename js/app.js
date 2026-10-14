// Mathlore — NES 304 study app. Flashcards, Learn, Test, Match, review, problem sets, exam sim, drills.
import { S, save, replaceState, ymd, addDays, daysBetween, allDecks, deckById, newDeckColor, cs, grade, status, isDue, deckStats,
  tally, addXP, totalXP, level, streak, RANKS } from "./store.js";
import { DRILLS } from "./gen.js";

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const md = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" }); };
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const STAR = (on) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>`;
const ICON = {
  home: `<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>`,
  decks: `<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>`,
  practice: `<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>`,
  stats: `<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>`,
  gear: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>`,
};
const icon = (k, s = 22) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;

/* ---------- sound + confetti + toast ---------- */
let AC = null;
function tone(ok) {
  if (!S.sound) return;
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = ok ? [660, 880] : [220, 180];
    notes.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = ok ? "sine" : "triangle"; o.frequency.value = f;
      o.connect(g); g.connect(AC.destination); const t = AC.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.start(t); o.stop(t + 0.18); });
  } catch {}
}
function confetti(n = 70) {
  const box = document.createElement("div"); box.className = "confetti";
  const cols = ["#E0A93B", "#2F9E7E", "#4E8FD8", "#C2577A", "#8E6BD8"];
  box.innerHTML = Array.from({ length: n }, () => `<i style="left:${Math.random() * 100}%;background:${pick(cols)};animation-delay:${Math.random() * 0.4}s;animation-duration:${1.6 + Math.random()}s;transform:rotate(${Math.random() * 360}deg)"></i>`).join("");
  document.body.appendChild(box); setTimeout(() => box.remove(), 3000);
}
function toast(msg, ms = 2200) {
  const t = $("#toast"); t.innerHTML = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
}
function xp(n) {
  const before = level().lv;
  const r = addXP(n); save();
  if (r.goal) { setTimeout(() => { toast(`🔥 Daily goal hit! +25 XP`, 2600); confetti(); }, 300); }
  const after = level();
  if (after.lv > before) setTimeout(() => levelUp(before, after), 500);
}
function levelUp(from, L) {
  const oldRank = [...RANKS].reverse().find((r) => from >= r.min);
  overlay(`<div class="lv-pop"><div class="lv-badge">${L.rank.icon}</div><p class="kicker">Level up</p><h2>Level ${L.lv}</h2>
    ${L.rank.name !== oldRank.name ? `<p class="gold">Promoted: ${esc(L.rank.name)}</p>` : `<p class="muted">Keep going, ${esc(L.rank.name)}</p>`}
    <button class="btn primary" data-close>Nice</button></div>`);
  confetti(90);
}
function overlay(html) {
  const o = document.createElement("div"); o.className = "overlay"; o.innerHTML = `<div class="ov-box">${html}</div>`;
  document.body.appendChild(o);
  o.addEventListener("click", (e) => { if (e.target === o || e.target.closest("[data-close]")) o.remove(); });
  return o;
}

/* =========================================================
   SHELL + ROUTING
   ========================================================= */
const TABS = [["home", "Home"], ["decks", "Decks"], ["practice", "Practice"], ["stats", "Stats"]];
document.querySelector("#app").innerHTML = `
  <header class="top"><div><p class="eyebrow" id="hello"></p><p class="logo">Math<span>lore</span></p></div>
    <button class="icon-btn" id="gear" aria-label="Settings">${icon("gear")}</button></header>
  <main id="view"></main>
  <nav class="tabbar">${TABS.map(([id, l], i) => `<button data-tab="${id}" class="${i ? "" : "on"}">${icon(id)}<span>${l}</span></button>`).join("")}</nav>
  <section class="session" id="session" hidden></section>
  <div class="toast" id="toast"></div>`;
let tab = "home", route = null;
$$(".tabbar button").forEach((b) => (b.onclick = () => go(b.dataset.tab)));
$("#gear").onclick = openSettings;
function go(t, r = null) {
  tab = t; route = r;
  $$(".tabbar button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
  window.scrollTo({ top: 0 }); render();
}
function render() {
  const h = new Date().getHours();
  $("#hello").textContent = `${h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}, ${S.name}`;
  if (route?.name === "deck") return renderDeck(route.id);
  ({ home: renderHome, decks: renderDecks, practice: renderPractice, stats: renderStats })[tab]();
}

/* ---------- session (full-screen study modes) ---------- */
function openSession(html, onClose) {
  const s = $("#session"); s.hidden = false; document.body.classList.add("locked");
  s.innerHTML = `<div class="s-top"><button class="icon-btn" id="s-close" aria-label="Close">✕</button><div class="s-title" id="s-title"></div><div class="s-right" id="s-right"></div></div><div class="s-body" id="s-body">${html || ""}</div>`;
  $("#s-close").onclick = () => closeSession(onClose);
  return s;
}
function closeSession(cb) {
  const s = $("#session"); s.hidden = true; s.innerHTML = ""; document.body.classList.remove("locked");
  clearInterval(timer); document.onkeydown = null; cb?.(); render();
}
let timer = null;

/* =========================================================
   HOME
   ========================================================= */
function renderHome() {
  const L = level(), st = streak(), decks = allDecks();
  const due = decks.flatMap((d) => d.cards.filter((c) => isDue(c.id)));
  const goalPct = Math.min(100, (st.todayN / S.goal) * 100);
  const days = S.examDate ? daysBetween(ymd(), S.examDate) : null;
  const last = S.last && deckById(S.last.deck);
  const week = [...Array(7)].map((_, i) => addDays(ymd(), i - 6));
  $("#view").innerHTML = `
    <div class="card hero-card">
      <div class="rank"><span class="rank-ic">${L.rank.icon}</span><div><p class="kicker">${esc(L.rank.name)}</p><p class="lv">Level ${L.lv}</p></div>
        <div class="ring" style="--p:${goalPct}"><div><b>${st.todayN}</b><small>/ ${S.goal}</small></div></div></div>
      <div class="xpbar"><i style="width:${(L.into / L.need) * 100}%"></i></div>
      <div class="hero-foot"><span>${L.into} / ${L.need} XP</span><span>${st.today ? "Daily goal done ✓" : `${S.goal - st.todayN} answers to today's goal`}</span></div>
    </div>

    <div class="row2">
      <div class="card mini"><p class="kicker">Streak</p><p class="big">🔥 ${st.n}</p>
        <div class="dots">${week.map((d) => `<i class="${(S.log[d]?.n || 0) >= S.goal ? "on" : (S.log[d]?.n ? "some" : "")}"></i>`).join("")}</div></div>
      <button class="card mini exam" id="exam-card"><p class="kicker">NES 304</p>
        ${days == null ? `<p class="big small-big">Set exam date</p><p class="muted small">Tap to add it</p>` : days >= 0 ? `<p class="big">${days}</p><p class="muted small">${days === 1 ? "day" : "days"} to go · ${md(S.examDate)}</p>` : `<p class="big small-big">Exam done</p><p class="muted small">${md(S.examDate)}</p>`}</button>
    </div>

    ${due.length ? `<button class="card due" id="due-btn"><div><p class="kicker">Spaced review</p><p class="h3">${plural(due.length, "card")} due today</p><p class="muted small">Cards you're about to forget come back right on time.</p></div><span class="go-btn">Review</span></button>` : ""}

    ${last ? `<button class="card cont" id="cont-btn"><span class="d-ic" style="--c:${last.color}">${last.icon}</span><div><p class="kicker">Jump back in</p><p class="h3">${esc(last.short || last.title)}</p><p class="muted small">${esc(S.last.mode)}</p></div><span class="go-btn">Go</span></button>` : ""}

    <div class="quick">
      <button class="card q-act" data-q="exam"><span>⏱️</span><b>Exam sim</b><small>Timed, mixed</small></button>
      <button class="card q-act" data-q="drill"><span>⚡</span><b>Drills</b><small>Endless</small></button>
      <button class="card q-act" data-q="match"><span>🧩</span><b>Match</b><small>Beat your time</small></button>
    </div>

    <h3 class="sec">Lectures</h3>
    ${decks.filter((d) => d.group === "lecture" || d.group === "mine").map(deckRow).join("")}
    <h3 class="sec">NES 304 Quizlet set</h3>
    ${deckRow(decks.find((d) => d.id === "qall"))}
    <button class="link" id="see-topics">See all ${decks.filter((d) => d.group === "quizlet").length} topic decks ›</button>`;
  $("#exam-card").onclick = openSettings;
  $("#see-topics").onclick = () => go("decks");
  $("#due-btn") && ($("#due-btn").onclick = () => startFlash(null, { dueOnly: true }));
  $("#cont-btn") && ($("#cont-btn").onclick = () => go("decks", { name: "deck", id: last.id }));
  $$("[data-q]").forEach((b) => (b.onclick = () => {
    if (b.dataset.q === "exam") startExam();
    if (b.dataset.q === "drill") go("practice");
    if (b.dataset.q === "match") pickDeck("Match", (d) => startMatch(d));
  }));
  bindDeckRows();
}
function deckRow(d) {
  const s = deckStats(d), t = s.total || 1;
  return `<button class="card deck-row" data-deck="${d.id}">
    <span class="d-ic" style="--c:${d.color}">${d.icon}</span>
    <div class="d-main"><p class="h3">${esc(d.title)}</p>
      <div class="mbar"><i class="m" style="width:${(s.mastered / t) * 100}%"></i><i class="l" style="width:${(s.learning / t) * 100}%"></i></div>
      <p class="muted small">${s.total} cards · ${s.mastered} mastered${s.due ? ` · <b class="due-t">${s.due} due</b>` : ""}${d.questions.length ? ` · ${d.questions.length} problems` : ""}</p></div>
    <span class="chev">›</span></button>`;
}
const bindDeckRows = () => $$("[data-deck]").forEach((b) => (b.onclick = () => go("decks", { name: "deck", id: b.dataset.deck })));
function pickDeck(label, fn) {
  const o = overlay(`<h2>${esc(label)}: pick a deck</h2><div class="pick-list">${allDecks().map((d) => `<button class="pick" data-id="${d.id}"><span class="d-ic sm" style="--c:${d.color}">${d.icon}</span>${esc(d.title)}</button>`).join("")}</div><button class="btn" data-close>Cancel</button>`);
  $$(".pick", o).forEach((b) => (b.onclick = () => { o.remove(); fn(deckById(b.dataset.id)); }));
}

/* =========================================================
   DECKS
   ========================================================= */
function renderDecks() {
  const D = allDecks(), by = (g) => D.filter((d) => d.group === g);
  $("#view").innerHTML = `<div class="title-row"><h2 class="page-h">Decks</h2><button class="btn small" id="import-btn">＋ New / import</button></div>
    <h3 class="sec">Lectures</h3>${by("lecture").map(deckRow).join("")}
    ${by("mine").length ? `<h3 class="sec">Your decks</h3>${by("mine").map(deckRow).join("")}` : ""}
    <h3 class="sec">NES 304 Quizlet set · ${by("all")[0].cards.length} cards</h3>
    ${by("all").map(deckRow).join("")}${by("quizlet").map(deckRow).join("")}
    <p class="muted small center">More Quizlet sets? Tap “New / import” and paste them in.</p>`;
  bindDeckRows();
  $("#import-btn").onclick = () => openImport();
}

function renderDeck(id) {
  const d = deckById(id);
  if (!d) return go("decks");
  const s = deckStats(d);
  const starred = d.cards.filter((c) => S.cards[c.id]?.star).length;
  $("#view").innerHTML = `
    <button class="back" id="back">‹ Decks</button>
    <div class="deck-head"><span class="d-ic lg" style="--c:${d.color}">${d.icon}</span><div><h2 class="page-h">${esc(d.title)}</h2><p class="muted small">${s.total} cards${d.questions.length ? ` · ${d.questions.length} problems` : ""}</p></div></div>
    <div class="card">
      <div class="mbar big"><i class="m" style="width:${(s.mastered / (s.total || 1)) * 100}%"></i><i class="l" style="width:${(s.learning / (s.total || 1)) * 100}%"></i></div>
      <div class="legend3"><span><i class="m"></i>${s.mastered} mastered</span><span><i class="l"></i>${s.learning} learning</span><span><i class="n"></i>${s.new} new</span></div>
    </div>
    <div class="modes">
      <button class="card mode" data-m="flash"><span>🃏</span><b>Flashcards</b></button>
      <button class="card mode" data-m="learn"><span>🧠</span><b>Learn</b></button>
      <button class="card mode" data-m="test"><span>📝</span><b>Test</b></button>
      <button class="card mode" data-m="match"><span>🧩</span><b>Match</b></button>
      ${d.questions.length ? `<button class="card mode" data-m="probs"><span>✏️</span><b>Problems</b></button>` : ""}
      ${s.due ? `<button class="card mode due" data-m="due"><span>⏰</span><b>${s.due} due</b></button>` : ""}
      ${starred ? `<button class="card mode" data-m="star"><span>⭐</span><b>Starred (${starred})</b></button>` : ""}
    </div>
    ${S.match[d.id] ? `<p class="muted small center">Best match time: <b>${S.match[d.id].toFixed(1)}s</b></p>` : ""}
    <div class="title-row"><h3 class="sec">Cards</h3><div class="row-btns">${d.virtual ? "" : `<button class="btn small" id="add-card">＋ Add card</button>`}<button class="btn small" id="export-deck">Export</button></div></div>
    <ul class="card-list">${d.cards.map((c) => `<li><div class="cl-main">${d.virtual ? `<small class="from">${esc(c.from)}</small>` : ""}<b>${esc(c.t)}</b><span>${esc(c.d)}</span></div>
      <div class="cl-side"><i class="st ${status(c.id)}" title="${status(c.id)}"></i>
      <button class="star ${S.cards[c.id]?.star ? "on" : ""}" data-star="${c.id}" aria-label="Star">${STAR(S.cards[c.id]?.star)}</button>
      ${c.mine && !d.virtual ? `<button class="del" data-del="${esc(c.t)}" aria-label="Delete">×</button>` : ""}</div></li>`).join("")}</ul>
    ${d.builtIn ? "" : `<button class="btn danger wide" id="del-deck">Delete this deck</button>`}`;
  $("#back").onclick = () => go("decks");
  $$("[data-m]").forEach((b) => (b.onclick = () => {
    const m = b.dataset.m;
    if (m === "flash") startFlash(d);
    if (m === "learn") startLearn(d);
    if (m === "test") testSetup(d);
    if (m === "match") startMatch(d);
    if (m === "probs") startProblems(d);
    if (m === "due") startFlash(d, { dueOnly: true });
    if (m === "star") startFlash(d, { starOnly: true });
  }));
  $$("[data-star]").forEach((b) => (b.onclick = () => { const c = cs(b.dataset.star); c.star = !c.star; save(); renderDeck(id); }));
  $$("[data-del]").forEach((b) => (b.onclick = () => {
    if (!confirm("Delete this card?")) return;
    const t = b.dataset.del;
    if (d.builtIn) S.extra[d.id] = (S.extra[d.id] || []).filter((c) => c.t !== t);
    else { const cd = S.custom.find((x) => x.id === d.id); cd.cards = cd.cards.filter((c) => c.t !== t); }
    save(); renderDeck(id);
  }));
  if ($("#add-card")) $("#add-card").onclick = () => {
    const o = overlay(`<h2>Add a card</h2><label>Term (front)<textarea id="ac-t" rows="2"></textarea></label><label>Definition (back)<textarea id="ac-d" rows="3"></textarea></label>
      <div class="two"><button class="btn" data-close>Cancel</button><button class="btn primary" id="ac-save">Add</button></div>`);
    $("#ac-t", o).focus();
    $("#ac-save", o).onclick = () => {
      const t = $("#ac-t", o).value.trim(), dd = $("#ac-d", o).value.trim(); if (!t || !dd) return;
      if (d.builtIn) (S.extra[d.id] ||= []).push({ t, d: dd }); else S.custom.find((x) => x.id === d.id).cards.push({ t, d: dd });
      save(); o.remove(); renderDeck(id); toast("Card added");
    };
  };
  $("#export-deck").onclick = async () => {
    const text = d.cards.map((c) => `${c.t}\t${c.d}`).join("\n");
    try { await navigator.clipboard.writeText(text); toast("Copied — paste into Quizlet's import box"); }
    catch { overlay(`<h2>Export</h2><p class="muted small">Copy this into Quizlet's import box (tab between term and definition).</p><textarea rows="10" readonly>${esc(text)}</textarea><button class="btn primary" data-close>Done</button>`); }
  };
  $("#del-deck") && ($("#del-deck").onclick = () => { if (!confirm("Delete this whole deck?")) return; S.custom = S.custom.filter((x) => x.id !== d.id); save(); go("decks"); });
}

/* Quizlet import: one card per line, term and definition split by a tab (Quizlet's export), " - ", ":" or "," */
function parseCards(text, sep) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const seps = sep === "auto" ? ["\t", " - ", " – ", " — ", ": ", ","] : [sep === "tab" ? "\t" : sep];
  return lines.map((l) => { const s = seps.find((x) => l.includes(x)); if (!s) return null; const i = l.indexOf(s); return { t: l.slice(0, i).trim(), d: l.slice(i + s.length).trim() }; })
    .filter((c) => c && c.t && c.d);
}
function openImport() {
  const o = overlay(`<h2>New deck / import</h2>
    <p class="muted small">In Quizlet: open your set › ⋯ › Export › Copy text. Paste it here — one card per line.</p>
    <label>Deck name<input id="im-name" type="text" placeholder="e.g. Lecture 3 · Functions"></label>
    <label>Add to<select id="im-to"><option value="new">A new deck</option>${allDecks().map((d) => `<option value="${d.id}">${esc(d.title)}</option>`).join("")}</select></label>
    <label>Paste cards<textarea id="im-text" rows="8" placeholder="Term&#9;Definition&#10;30° in radians&#9;π/6"></textarea></label>
    <label>Between term and definition<select id="im-sep"><option value="auto">Figure it out (tab, dash, colon or comma)</option><option value="tab">Tab (Quizlet default)</option><option value=" - ">Dash ( - )</option><option value=":">Colon</option><option value=",">Comma</option></select></label>
    <p class="muted small" id="im-prev">0 cards found</p>
    <div class="two"><button class="btn" data-close>Cancel</button><button class="btn primary" id="im-go">Import</button></div>`);
  const prev = () => { const n = parseCards($("#im-text", o).value, $("#im-sep", o).value).length; $("#im-prev", o).textContent = `${n} card${n === 1 ? "" : "s"} found`; };
  $("#im-text", o).oninput = prev; $("#im-sep", o).onchange = prev;
  $("#im-to", o).onchange = (e) => ($("#im-name", o).parentElement.hidden = e.target.value !== "new");
  $("#im-go", o).onclick = () => {
    const cards = parseCards($("#im-text", o).value, $("#im-sep", o).value);
    const to = $("#im-to", o).value;
    if (to === "new") {
      const title = $("#im-name", o).value.trim() || "My deck";
      if (!cards.length && !confirm("No cards found. Create an empty deck?")) return;
      const id = `u${Date.now().toString(36)}`;
      S.custom.push({ id, title, short: title, icon: (title.match(/lecture\s*(\d+)/i) || [])[1] || title.trim()[0]?.toUpperCase() || "✦", color: newDeckColor(), cards, questions: [] });
      save(); o.remove(); toast(`Made “${esc(title)}” with ${plural(cards.length, "card")}`); go("decks", { name: "deck", id });
    } else {
      if (!cards.length) { toast("No cards found — check the format"); return; }
      const d = deckById(to);
      if (d.builtIn) (S.extra[to] ||= []).push(...cards); else S.custom.find((x) => x.id === to).cards.push(...cards);
      save(); o.remove(); toast(`Added ${plural(cards.length, "card")}`); go("decks", { name: "deck", id: to });
    }
  };
}

/* =========================================================
   FLASHCARDS
   ========================================================= */
function startFlash(deck, opts = {}) {
  let cards = deck ? deck.cards : allDecks().flatMap((d) => d.cards.map((c) => ({ ...c, deckTitle: d.short })));
  if (opts.dueOnly) cards = cards.filter((c) => isDue(c.id));
  if (opts.starOnly) cards = cards.filter((c) => S.cards[c.id]?.star);
  if (opts.only) cards = cards.filter((c) => opts.only.includes(c.id));
  if (!cards.length) return toast("Nothing to study here yet");
  if (deck) S.last = { deck: deck.id, mode: "Flashcards" };
  let order = [...cards], i = 0, flipped = false, defFirst = false, know = [], learning = [], shuffled = false;
  openSession();
  $("#s-title").textContent = opts.dueOnly ? "Spaced review" : "Flashcards";
  $("#s-right").innerHTML = `<button class="chip-btn" id="fc-shuf" title="Shuffle">🔀</button><button class="chip-btn" id="fc-side" title="Show definition first">⇄</button>`;
  const draw = () => {
    if (i >= order.length) return finish();
    const c = order[i], st = S.cards[c.id];
    $("#s-body").innerHTML = `
      <div class="prog"><i style="width:${(i / order.length) * 100}%"></i></div>
      <p class="muted small center">${i + 1} / ${order.length}${c.deckTitle || (deck?.virtual && c.from) ? ` · ${esc(c.deckTitle || c.from)}` : ""}</p>
      <div class="fc-wrap"><div class="fc ${flipped ? "flip" : ""}" id="fc">
        <div class="fc-face front"><button class="star ${st?.star ? "on" : ""}" id="fc-star">${STAR(st?.star)}</button><span class="fc-lab">${defFirst ? "Definition" : "Term"}</span><p>${esc(defFirst ? c.d : c.t)}</p><small>Tap to flip</small></div>
        <div class="fc-face back"><span class="fc-lab">${defFirst ? "Term" : "Definition"}</span><p>${esc(defFirst ? c.t : c.d)}</p></div>
      </div></div>
      <div class="fc-btns"><button class="btn big-btn bad" id="fc-no">✗ Still learning<small>${learning.length}</small></button><button class="btn big-btn good" id="fc-yes">✓ Know it<small>${know.length}</small></button></div>
      <p class="muted small center">Swipe left / right, or tap the buttons</p>`;
    const fc = $("#fc");
    fc.onclick = (e) => { if (e.target.closest("#fc-star")) return; flipped = !flipped; fc.classList.toggle("flip", flipped); };
    $("#fc-star").onclick = () => { const s = cs(c.id); s.star = !s.star; save(); $("#fc-star").classList.toggle("on", s.star); $("#fc-star").innerHTML = STAR(s.star); };
    $("#fc-yes").onclick = () => answer(true);
    $("#fc-no").onclick = () => answer(false);
    let sx = null;
    fc.ontouchstart = (e) => (sx = e.touches[0].clientX);
    fc.ontouchmove = (e) => { if (sx == null) return; const dx = e.touches[0].clientX - sx; fc.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`; fc.parentElement.dataset.dir = dx > 40 ? "yes" : dx < -40 ? "no" : ""; };
    fc.ontouchend = (e) => { const dx = (e.changedTouches[0].clientX - sx) || 0; sx = null; fc.style.transform = ""; fc.parentElement.dataset.dir = ""; if (Math.abs(dx) > 80) answer(dx > 0); };
  };
  const answer = (k) => {
    const c = order[i];
    grade(c.id, k, true); (k ? know : learning).push(c);
    xp(k ? 1 : 0); tone(k);
    const fc = $("#fc"); fc.classList.add(k ? "fly-r" : "fly-l");
    setTimeout(() => { i++; flipped = false; draw(); }, 220);
  };
  const finish = () => {
    $("#s-body").innerHTML = `<div class="done">
      <div class="done-ring" style="--p:${(know.length / order.length) * 100}"><b>${Math.round((know.length / order.length) * 100)}%</b></div>
      <h2>${know.length === order.length ? "You know them all! 🎉" : "Nice round"}</h2>
      <p class="muted">${know.length} known · ${learning.length} still learning</p>
      ${learning.length ? `<button class="btn primary wide" id="again">Study the ${learning.length} again</button>` : ""}
      <button class="btn wide" id="restart">Restart all</button>
      ${deck ? `<button class="btn wide" id="to-learn">Go to Learn</button>` : ""}</div>`;
    if (know.length === order.length) confetti();
    $("#again") && ($("#again").onclick = () => { order = shuffle(learning); i = 0; know = []; learning = []; draw(); });
    $("#restart").onclick = () => { order = shuffled ? shuffle(cards) : [...cards]; i = 0; know = []; learning = []; draw(); };
    $("#to-learn") && ($("#to-learn").onclick = () => { closeSession(); startLearn(deck); });
  };
  $("#fc-shuf").onclick = () => { shuffled = !shuffled; $("#fc-shuf").classList.toggle("on", shuffled); order = shuffled ? shuffle(order.slice(i)) : cards.filter((c) => order.slice(i).includes(c)); i = 0; draw(); };
  $("#fc-side").onclick = () => { defFirst = !defFirst; $("#fc-side").classList.toggle("on", defFirst); flipped = false; draw(); };
  document.onkeydown = (e) => { if (e.key === " ") { e.preventDefault(); $("#fc")?.click(); } if (e.key === "ArrowRight") answer(true); if (e.key === "ArrowLeft") answer(false); };
  draw();
}

/* =========================================================
   LEARN (adaptive: multiple choice → reverse / written, rounds of 7)
   ========================================================= */
function norm(s) { return String(s).toLowerCase().replace(/[−–—]/g, "-").replace(/sqrt/g, "√").replace(/pi/g, "π").replace(/[\s.,;:!?'"()]/g, ""); }
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
const closeEnough = (typed, right) => { const a = norm(typed), b = norm(right); return !!a && (a === b || lev(a, b) <= Math.max(1, Math.floor(b.length * 0.15))); };
const choicesFor = (deck, right, field, n = 4) => shuffle([right, ...shuffle([...new Set(deck.cards.map((c) => c[field]).filter((x) => x !== right))]).slice(0, n - 1)]);

function startLearn(deck) {
  const rank = (c) => (isDue(c.id) ? 0 : status(c.id) === "learning" ? 1 : status(c.id) === "new" ? 2 : 3);
  const pool = [...deck.cards].sort((a, b) => rank(a) - rank(b) || (S.cards[a.id]?.l || 0) - (S.cards[b.id]?.l || 0)).slice(0, 21);
  const items = pool.map((c) => ({ c, stage: 0, miss: 0 }));
  S.last = { deck: deck.id, mode: "Learn" }; save();
  let queue = [], roundNo = 0, correctRun = 0;
  openSession(); $("#s-title").textContent = "Learn";
  $("#s-right").innerHTML = `<button class="chip-btn ${S.written ? "on" : ""}" id="ln-w" title="Typed answers">⌨︎</button>`;
  $("#ln-w").onclick = () => { S.written = !S.written; save(); $("#ln-w").classList.toggle("on", S.written); toast(S.written ? "Typed answers on" : "Typed answers off"); };
  const remaining = () => items.filter((x) => x.stage < 2);
  const header = () => { const fam = items.filter((x) => x.stage === 1).length, mas = items.filter((x) => x.stage >= 2).length;
    return `<div class="ln-bars"><div><small>Familiar ${fam}</small><div class="prog"><i class="fam" style="width:${(fam / items.length) * 100}%"></i></div></div><div><small>Mastered ${mas}/${items.length}</small><div class="prog"><i style="width:${(mas / items.length) * 100}%"></i></div></div></div>`; };
  const nextRound = () => { roundNo++; queue = shuffle(remaining()).slice(0, 7); ask(); };
  const ask = () => {
    if (!remaining().length) return finish();
    if (!queue.length) return roundSummary();
    const it = queue[0], c = it.c;
    const written = it.stage === 1 && S.written;
    const reverse = it.stage === 1 && !S.written;
    if (written) {
      const answerSide = c.t.length <= c.d.length ? "t" : "d";
      $("#s-body").innerHTML = `${header()}<div class="q-card"><span class="fc-lab">${answerSide === "t" ? "Definition" : "Term"}</span><p class="q-text">${esc(answerSide === "t" ? c.d : c.t)}</p></div>
        <form id="wf" class="wf"><input id="wa" autocomplete="off" placeholder="Type the ${answerSide === "t" ? "term" : "definition"}"><button class="btn primary">Check</button></form>
        <div class="sym-row">${["√", "π", "²", "³", "°", "−", "/", "θ", "∩", "∪", "¬", "→"].map((s) => `<button type="button" class="sym">${s}</button>`).join("")}</div>
        <button class="link" id="dunno">Don't know</button>`;
      const inp = $("#wa"); inp.focus();
      $$(".sym").forEach((b) => (b.onclick = () => { inp.value += b.textContent; inp.focus(); }));
      $("#wf").onsubmit = (e) => { e.preventDefault(); const r = answerSide === "t" ? c.t : c.d; result(it, closeEnough(inp.value, r), r, inp.value); };
      $("#dunno").onclick = () => result(it, false, answerSide === "t" ? c.t : c.d, "");
      return;
    }
    const prompt = reverse ? c.d : c.t, right = reverse ? c.t : c.d;
    const opts = choicesFor(deck, right, reverse ? "t" : "d");
    $("#s-body").innerHTML = `${header()}<div class="q-card"><span class="fc-lab">${reverse ? "Definition" : "Term"}</span><p class="q-text">${esc(prompt)}</p></div>
      <p class="muted small">Choose the matching ${reverse ? "term" : "definition"}</p>
      <div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="key">${k + 1}</span>${esc(o)}</button>`).join("")}</div>
      <button class="link" id="dunno">Don't know</button>`;
    $$(".opt").forEach((b) => (b.onclick = () => result(it, opts[+b.dataset.k] === right, right, null, b)));
    $("#dunno").onclick = () => result(it, false, right, null);
    document.onkeydown = (e) => { const k = +e.key; if (k >= 1 && k <= opts.length) $$(".opt")[k - 1].click(); };
  };
  const result = (it, ok, right, typed, btn) => {
    document.onkeydown = null;
    tone(ok);
    if (ok) { it.stage++; correctRun++; grade(it.c.id, true); xp(2); }
    else { it.miss++; it.stage = 0; correctRun = 0; grade(it.c.id, false); }
    queue.shift();
    if (!ok) queue.push(it);  // comes back this round
    if (btn) { $$(".opt").forEach((b) => { b.disabled = true; if (b.textContent.slice(1) === right) b.classList.add("right"); }); if (!ok) btn.classList.add("wrong"); }
    if (ok) {
      if (btn) btn.classList.add("right");
      const msg = pick(["Nice!", "You got it!", "Perfect", "Yes!", "Correct", correctRun >= 3 ? `${correctRun} in a row 🔥` : "Great"]);
      const fb = document.createElement("p"); fb.className = "fb good"; fb.textContent = msg; $("#s-body").appendChild(fb);
      if (typed != null) $("#wf").innerHTML = `<p class="fb good">✓ ${esc(right)}</p>`;
      setTimeout(ask, 750);
    } else {
      $("#s-body").insertAdjacentHTML("beforeend", `<div class="miss"><p class="fb bad">Not quite — study this one</p>
        ${typed ? `<p class="small">You wrote: <s>${esc(typed)}</s></p>` : ""}<p class="ans">${esc(right)}</p>
        ${typed ? `<button class="link" id="override">I was right — count it</button>` : ""}<button class="btn primary wide" id="cont">Continue</button></div>`);
      $("#cont").onclick = ask;
      $("#override") && ($("#override").onclick = () => { queue.pop(); it.stage++; const c = cs(it.c.id); c.w = Math.max(0, c.w - 1); c.l = Math.min(6, c.l + 2); save(); xp(2); ask(); });
      if (typed != null && $("#wf")) $("#wf").remove();
    }
  };
  const roundSummary = () => {
    const mas = items.filter((x) => x.stage >= 2).length;
    $("#s-body").innerHTML = `<div class="done">${header()}<h2>Round ${roundNo} done</h2><p class="muted">${mas} of ${items.length} mastered</p>
      <ul class="sum-list">${items.filter((x) => x.miss).slice(0, 6).map((x) => `<li><b>${esc(x.c.t)}</b><span>${esc(x.c.d)}</span></li>`).join("")}</ul>
      <button class="btn primary wide" id="nr">Next round</button></div>`;
    $("#nr").onclick = nextRound;
  };
  const finish = () => {
    xp(20); confetti();
    $("#s-body").innerHTML = `<div class="done"><div class="done-ring" style="--p:100"><b>✓</b></div><h2>All ${items.length} mastered!</h2><p class="muted">+20 XP bonus. These come back in spaced review when you're about to forget them.</p>
      <button class="btn primary wide" id="again">Keep learning</button><button class="btn wide" id="to-test">Take a test</button></div>`;
    $("#again").onclick = () => { closeSession(); startLearn(deck); };
    $("#to-test").onclick = () => { closeSession(); testSetup(deck); };
  };
  nextRound();
}

/* =========================================================
   TEST
   ========================================================= */
function testSetup(deck) {
  const max = deck.cards.length + deck.questions.length;
  const o = overlay(`<h2>Test: ${esc(deck.short || deck.title)}</h2>
    <label>Questions <b id="ts-n-l">${Math.min(20, max)}</b><input type="range" id="ts-n" min="4" max="${Math.max(4, max)}" value="${Math.min(20, max)}"></label>
    <div class="checks">
      ${[["tf", "True / False", true], ["mc", "Multiple choice", true], ["match", "Matching", true], ["written", "Written", false], ["probs", "Lecture problems", deck.questions.length > 0]].map(([k, l, on]) =>
        (k === "probs" && !deck.questions.length) ? "" : `<label class="check-row"><input type="checkbox" value="${k}" ${on ? "checked" : ""}> ${l}</label>`).join("")}
    </div>
    <div class="two"><button class="btn" data-close>Cancel</button><button class="btn primary" id="ts-go">Start test</button></div>`);
  $("#ts-n", o).oninput = (e) => ($("#ts-n-l", o).textContent = e.target.value);
  $("#ts-go", o).onclick = () => {
    const types = $$(".checks input:checked", o).map((x) => x.value);
    if (!types.length) return toast("Pick at least one question type");
    o.remove(); startTest(deck, +$("#ts-n", o).value, types);
  };
}
function buildTest(deck, n, types) {
  const cardTypes = types.filter((t) => t !== "probs");
  const qs = [];
  let probN = types.includes("probs") ? Math.min(deck.questions.length, cardTypes.length ? Math.round(n * 0.4) : n) : 0;
  shuffle(deck.questions).slice(0, probN).forEach((q) => qs.push({ kind: "prob", q }));
  let left = n - qs.length;
  const cards = shuffle(deck.cards);
  let ci = 0;
  if (cardTypes.includes("match") && left >= 4 && cards.length >= 4) { const k = Math.min(5, left); qs.push({ kind: "match", cards: cards.slice(ci, ci + k) }); ci += k; left -= k; }
  const others = cardTypes.filter((t) => t !== "match");
  while (left > 0 && ci < cards.length && others.length) {
    const c = cards[ci++], kind = others[(ci + left) % others.length];
    if (kind === "tf") { const truth = Math.random() < 0.5; const shown = truth ? c.d : pick(deck.cards.filter((x) => x.d !== c.d)).d; qs.push({ kind, c, shown, truth }); }
    if (kind === "mc") qs.push({ kind, c, opts: choicesFor(deck, c.d, "d") });
    if (kind === "written") { const side = c.t.length <= c.d.length ? "t" : "d"; qs.push({ kind, c, side }); }
    left--;
  }
  return shuffle(qs.filter((q) => q.kind !== "match")).concat(qs.filter((q) => q.kind === "match"));
}
function startTest(deck, n, types) {
  const qs = buildTest(deck, n, types);
  S.last = { deck: deck.id, mode: "Test" }; save();
  const t0 = Date.now();
  openSession(); $("#s-title").textContent = "Test";
  const letters = "ABCDE";
  $("#s-body").innerHTML = `<form id="test" class="test">${qs.map((q, i) => {
    const head = `<p class="tq-n">${i + 1} of ${qs.length} · ${{ tf: "True or false", mc: "Multiple choice", written: "Written", prob: "Problem", match: "Matching" }[q.kind]}</p>`;
    if (q.kind === "tf") return `<div class="card tq" data-i="${i}">${head}<p class="q-text">${esc(q.c.t)}</p><p class="tf-def">${esc(q.shown)}</p><div class="tf"><label><input type="radio" name="q${i}" value="1"><span>True</span></label><label><input type="radio" name="q${i}" value="0"><span>False</span></label></div></div>`;
    if (q.kind === "mc") return `<div class="card tq" data-i="${i}">${head}<p class="q-text">${esc(q.c.t)}</p>${q.opts.map((o, k) => `<label class="opt-r"><input type="radio" name="q${i}" value="${k}"><span>${esc(o)}</span></label>`).join("")}</div>`;
    if (q.kind === "prob") return `<div class="card tq" data-i="${i}">${head}<p class="q-text">${esc(q.q.q)}</p>${q.q.c.map((o, k) => `<label class="opt-r"><input type="radio" name="q${i}" value="${k}"><span><b>${"ABCD"[k]}.</b> ${esc(o)}</span></label>`).join("")}</div>`;
    if (q.kind === "written") return `<div class="card tq" data-i="${i}">${head}<p class="q-text">${esc(q.side === "t" ? q.c.d : q.c.t)}</p><input class="w-in" name="q${i}" autocomplete="off" placeholder="Type the ${q.side === "t" ? "term" : "definition"}"></div>`;
    const defs = shuffle(q.cards.map((c, k) => ({ d: c.d, k })));
    q.defs = defs;
    return `<div class="card tq" data-i="${i}">${head}<p class="muted small">Match each term to its definition.</p>
      <ol class="m-defs">${defs.map((x, k) => `<li><b>${letters[k]}</b> ${esc(x.d)}</li>`).join("")}</ol>
      ${q.cards.map((c, k) => `<label class="m-row"><span>${esc(c.t)}</span><select name="q${i}m${k}"><option value="">—</option>${defs.map((_, j) => `<option value="${j}">${letters[j]}</option>`).join("")}</select></label>`).join("")}</div>`;
  }).join("")}<button class="btn primary wide big-btn" id="submit">Submit test</button></form>`;
  $("#test").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData($("#test"));
    const unanswered = qs.filter((q, i) => q.kind !== "match" && !f.get(`q${i}`)).length;
    if (unanswered && !confirm(`${unanswered} unanswered. Submit anyway?`)) return;
    let right = 0, total = 0;
    qs.forEach((q, i) => {
      const el = $(`.tq[data-i="${i}"]`);
      let ok, ans;
      if (q.kind === "match") {
        q.cards.forEach((c, k) => { total++; const v = f.get(`q${i}m${k}`); const good = v !== "" && v != null && q.defs[+v].k === k; if (good) right++; grade(c.id, good);
          const sel = $(`select[name="q${i}m${k}"]`, el); sel.parentElement.classList.add(good ? "ok" : "no"); if (!good) sel.insertAdjacentHTML("afterend", `<em class="fix">${letters[q.defs.findIndex((x) => x.k === k)]}</em>`); });
        el.classList.add("graded"); return;
      }
      total++;
      const v = f.get(`q${i}`);
      if (q.kind === "tf") { ok = v != null && (v === "1") === q.truth; ans = q.truth ? "True" : `False — it's “${q.c.d}”`; }
      if (q.kind === "mc") { ok = v != null && q.opts[+v] === q.c.d; ans = q.c.d; }
      if (q.kind === "written") { const r = q.side === "t" ? q.c.t : q.c.d; ok = closeEnough(v || "", r); ans = r; }
      if (q.kind === "prob") { ok = v != null && +v === q.q.a; ans = `${"ABCD"[q.q.a]}. ${q.q.c[q.q.a]} — ${q.q.why}`; const p = (S.qs[q.q.id] ||= { r: 0, w: 0 }); ok ? p.r++ : p.w++; p.last = ymd(); tally(ok); }
      else grade(q.c.id, ok);
      if (ok) right++;
      // color the choices: right answer green, your wrong pick red
      $$("input[type=radio]", el).forEach((r) => {
        const val = r.value, sp = r.nextElementSibling;
        const isRight = q.kind === "tf" ? (val === "1") === q.truth : q.kind === "mc" ? q.opts[+val] === q.c.d : +val === q.q?.a;
        if (isRight) sp.classList.add("r-right"); else if (r.checked) sp.classList.add("r-wrong");
        r.disabled = true;
      });
      el.classList.add("graded", ok ? "ok" : "no");
      el.insertAdjacentHTML("beforeend", `<p class="verdict ${ok ? "good" : "bad"}">${ok ? "✓ Correct" : `✗ ${esc(ans)}`}</p>`);
    });
    const pct = Math.round((right / total) * 100), secs = (Date.now() - t0) / 1000;
    S.tests.push({ d: ymd(), deck: deck.id, mode: "Test", score: right, total, secs: Math.round(secs) }); save();
    xp(5 + Math.round(pct / 5)); tone(pct >= 70); if (pct >= 80) confetti();
    $("#submit").remove();
    $("#test").insertAdjacentHTML("afterbegin", `<div class="card done tight"><div class="done-ring" style="--p:${pct}"><b>${pct}%</b></div>
      <h2>${pct >= 90 ? "Outstanding" : pct >= 70 ? "Solid work" : "Keep at it"}</h2><p class="muted">${right} of ${total} right · ${fmtTime(secs)}</p>
      <div class="two"><button type="button" class="btn" id="t-again">New test</button><button type="button" class="btn primary" id="t-learn">Learn missed</button></div></div>`);
    $("#s-body").scrollTop = 0;
    $("#t-again").onclick = () => { closeSession(); testSetup(deck); };
    $("#t-learn").onclick = () => { const missed = qs.filter((q, i) => q.c && $(`.tq[data-i="${i}"]`).classList.contains("no")).map((q) => q.c.id); closeSession(); missed.length ? startFlash(deck, { only: missed }) : startLearn(deck); };
  };
}

/* =========================================================
   MATCH
   ========================================================= */
function startMatch(deck) {
  if (deck.cards.length < 3) return toast("This deck needs at least 3 cards");
  const cards = shuffle(deck.cards).slice(0, 6);
  const tiles = shuffle(cards.flatMap((c) => [{ id: c.id, txt: c.t, side: "t" }, { id: c.id, txt: c.d, side: "d" }]));
  S.last = { deck: deck.id, mode: "Match" }; save();
  openSession(); $("#s-title").textContent = "Match";
  let start = null, penalty = 0, sel = null, left = cards.length;
  $("#s-right").innerHTML = `<span class="timer" id="m-t">0.0s</span>`;
  $("#s-body").innerHTML = `<p class="muted small center">Tap a term and its definition. Wrong pairs add 1 second.</p>
    <div class="match">${tiles.map((t, i) => `<button class="tile ${t.side}" data-i="${i}">${esc(t.txt.length > 90 ? t.txt.slice(0, 88) + "…" : t.txt)}</button>`).join("")}</div>
    ${S.match[deck.id] ? `<p class="muted small center">Best: ${S.match[deck.id].toFixed(1)}s</p>` : ""}`;
  $$(".tile").forEach((b) => (b.onclick = () => {
    if (!start) { start = Date.now(); timer = setInterval(() => ($("#m-t").textContent = `${((Date.now() - start) / 1000 + penalty).toFixed(1)}s`), 100); }
    const t = tiles[+b.dataset.i];
    if (b.classList.contains("gone")) return;
    if (!sel) { sel = { b, t }; b.classList.add("sel"); return; }
    if (sel.b === b) { b.classList.remove("sel"); sel = null; return; }
    if (sel.t.id === t.id && sel.t.side !== t.side) {
      [sel.b, b].forEach((x) => x.classList.add("gone")); tone(true); sel = null; left--;
      if (!left) {
        clearInterval(timer);
        const secs = (Date.now() - start) / 1000 + penalty;
        const best = !S.match[deck.id] || secs < S.match[deck.id];
        if (best) S.match[deck.id] = secs; save(); xp(15); confetti();
        $("#s-body").innerHTML = `<div class="done"><div class="done-ring" style="--p:100"><b>${secs.toFixed(1)}s</b></div><h2>${best ? "New best time! 🏆" : "Matched!"}</h2>
          <p class="muted">Best: ${S.match[deck.id].toFixed(1)}s · +15 XP</p><button class="btn primary wide" id="m-again">Play again</button></div>`;
        $("#m-again").onclick = () => { closeSession(); startMatch(deck); };
      }
    } else {
      penalty += 1; tone(false); [sel.b, b].forEach((x) => { x.classList.add("shake"); setTimeout(() => x.classList.remove("shake", "sel"), 400); }); sel = null;
    }
  }));
}

/* =========================================================
   PROBLEMS (one at a time, explanation after each)
   ========================================================= */
function runMC(title, list, { onEnd, label, record = true } = {}) {
  let i = 0, right = 0; const missed = [];
  openSession(); $("#s-title").textContent = title;
  const draw = () => {
    if (i >= list.length) return end();
    const q = list[i];
    $("#s-body").innerHTML = `<div class="prog"><i style="width:${(i / list.length) * 100}%"></i></div><p class="muted small center">${i + 1} / ${list.length}${q.tag ? ` · ${esc(q.tag)}` : ""}</p>
      <div class="q-card"><p class="q-text">${esc(q.q)}</p></div>
      <div class="opts">${q.c.map((o, k) => `<button class="opt" data-k="${k}"><span class="key">${"ABCD"[k]}</span>${esc(o)}</button>`).join("")}</div>`;
    $$(".opt").forEach((b) => (b.onclick = () => {
      const ok = +b.dataset.k === q.a;
      $$(".opt").forEach((x, k) => { x.disabled = true; if (k === q.a) x.classList.add("right"); });
      if (!ok) { b.classList.add("wrong"); missed.push(q); }
      tone(ok); if (ok) right++;
      if (record && q.id) { const p = (S.qs[q.id] ||= { r: 0, w: 0 }); ok ? p.r++ : p.w++; p.last = ymd(); }
      tally(ok); xp(ok ? 3 : 0);
      $("#s-body").insertAdjacentHTML("beforeend", `<div class="why ${ok ? "good" : "bad"}"><b>${ok ? "✓ Correct" : `✗ Answer: ${"ABCD"[q.a]}`}</b><p>${esc(q.why)}</p></div><button class="btn primary wide" id="nx">${i + 1 < list.length ? "Next" : "See results"}</button>`);
      $("#nx").onclick = () => { i++; draw(); };
    }));
  };
  const end = () => {
    const pct = Math.round((right / list.length) * 100);
    if (pct >= 80) confetti();
    onEnd?.(right, list.length);
    $("#s-body").innerHTML = `<div class="done"><div class="done-ring" style="--p:${pct}"><b>${pct}%</b></div><h2>${right} of ${list.length}</h2><p class="muted">${label || ""}</p>
      ${missed.length ? `<button class="btn primary wide" id="redo">Redo the ${missed.length} missed</button>` : ""}<button class="btn wide" data-close-s>Done</button></div>`;
    $("#redo") && ($("#redo").onclick = () => { closeSession(); runMC(title, shuffle(missed), { onEnd, label, record }); });
    $("[data-close-s]").onclick = () => closeSession();
  };
  draw();
}
function startProblems(deck, missedOnly = false) {
  let list = deck.questions;
  if (missedOnly) list = list.filter((q) => (S.qs[q.id]?.w || 0) > (S.qs[q.id]?.r || 0));
  if (!list.length) return toast(missedOnly ? "Nothing missed here 🎉" : "No problems in this deck yet");
  S.last = { deck: deck.id, mode: "Problems" }; save();
  const seenLast = (q) => (S.qs[q.id] ? 1 : 0);
  runMC(deck.short || deck.title, shuffle(list).sort((a, b) => seenLast(a) - seenLast(b)), { label: "Explanations are in your lecture notes too." });
}

/* =========================================================
   EXAM SIM (timed, mixed, results at the end)
   ========================================================= */
function startExam() {
  const o = overlay(`<h2>⏱️ Exam simulation</h2><p class="muted small">Mixed: your Quizlet cards from every NES topic, lecture problems and fresh drills. No answers until you submit, like the real test. 1.5 minutes per question.</p>
    <div class="seg3">${[15, 25, 40].map((n, i) => `<button class="${i === 1 ? "on" : ""}" data-n="${n}">${n} questions<small>${Math.round(n * 1.5)} min</small></button>`).join("")}</div>
    <div class="two"><button class="btn" data-close>Cancel</button><button class="btn primary" id="ex-go">Start</button></div>`);
  let n = 25;
  $$(".seg3 button", o).forEach((b) => (b.onclick = () => { n = +b.dataset.n; $$(".seg3 button", o).forEach((x) => x.classList.toggle("on", x === b)); }));
  $("#ex-go", o).onclick = () => { o.remove(); runExam(n); };
}
function runExam(n) {
  const decks = allDecks();
  const probs = shuffle(decks.flatMap((d) => d.questions.map((q) => ({ ...q, tag: d.short }))));
  // a third from your Quizlet cards (spread across topics), a third lecture problems, the rest fresh drills
  const topics = shuffle(decks.filter((d) => d.group === "quizlet" && d.cards.length >= 4));
  const nCards = Math.round(n / 3), nProbs = Math.min(probs.length, Math.round(n / 3)), nDrills = n - nCards - nProbs;
  const cardQs = Array.from({ length: nCards }, (_, k) => { const d = topics[k % topics.length], c = pick(d.cards), c4 = choicesFor(d, c.d, "d");
    return { q: c.t.endsWith("?") ? c.t : `${c.t}:`, c: c4, a: c4.indexOf(c.d), why: `${c.t} → ${c.d}`, tag: d.short, cardId: c.id }; });
  const list = shuffle([...probs.slice(0, nProbs), ...cardQs, ...Array.from({ length: nDrills }, () => { const D = pick(DRILLS); return { ...D.make(), tag: decks.find((d) => d.id === D.deck)?.short || "Drill" }; })]);
  const ans = Array(list.length).fill(null), flag = Array(list.length).fill(false);
  let i = 0; const limit = list.length * 90, t0 = Date.now();
  openSession(() => {}); $("#s-title").textContent = "Exam sim";
  $("#s-right").innerHTML = `<span class="timer" id="ex-t"></span>`;
  const tick = () => { const left = limit - (Date.now() - t0) / 1000; $("#ex-t").textContent = fmtTime(Math.max(0, left)); $("#ex-t").classList.toggle("low", left < 120); if (left <= 0) submit(true); };
  timer = setInterval(tick, 500); tick();
  const draw = () => {
    const q = list[i];
    $("#s-body").innerHTML = `<div class="ex-nav">${list.map((_, k) => `<button class="${k === i ? "cur" : ""} ${ans[k] != null ? "ans" : ""} ${flag[k] ? "flag" : ""}" data-k="${k}">${k + 1}</button>`).join("")}</div>
      <p class="muted small">Question ${i + 1} of ${list.length} · ${esc(q.tag)}</p>
      <div class="q-card"><p class="q-text">${esc(q.q)}</p></div>
      <div class="opts">${q.c.map((o, k) => `<button class="opt ${ans[i] === k ? "picked" : ""}" data-o="${k}"><span class="key">${"ABCD"[k]}</span>${esc(o)}</button>`).join("")}</div>
      <div class="ex-btns"><button class="btn" id="ex-prev" ${i ? "" : "disabled"}>‹ Back</button><button class="btn ${flag[i] ? "flagged" : ""}" id="ex-flag">⚑ ${flag[i] ? "Flagged" : "Flag"}</button><button class="btn primary" id="ex-next">${i + 1 < list.length ? "Next ›" : "Review"}</button></div>
      <button class="btn wide" id="ex-submit">Submit exam</button>`;
    $$("[data-k]").forEach((b) => (b.onclick = () => { i = +b.dataset.k; draw(); }));
    $$("[data-o]").forEach((b) => (b.onclick = () => { ans[i] = +b.dataset.o; draw(); }));
    $("#ex-prev").onclick = () => { i--; draw(); };
    $("#ex-next").onclick = () => { if (i + 1 < list.length) { i++; draw(); } else { const un = ans.findIndex((a) => a == null); if (un >= 0) { i = un; draw(); toast("Jumped to your first unanswered question"); } } };
    $("#ex-flag").onclick = () => { flag[i] = !flag[i]; draw(); };
    $("#ex-submit").onclick = () => submit(false);
  };
  const submit = (timeUp) => {
    if (!timeUp) { const un = ans.filter((a) => a == null).length; if (un && !confirm(`${un} unanswered. Submit anyway?`)) return; }
    clearInterval(timer);
    const secs = Math.min(limit, (Date.now() - t0) / 1000);
    let right = 0; const byTag = {};
    list.forEach((q, k) => { const ok = ans[k] === q.a; if (ok) right++; (byTag[q.tag] ||= [0, 0])[1]++; if (ok) byTag[q.tag][0]++; tally(ok);
      if (q.id) { const p = (S.qs[q.id] ||= { r: 0, w: 0 }); ok ? p.r++ : p.w++; p.last = ymd(); }
      if (q.cardId) { const c = cs(q.cardId); ok ? c.r++ : c.w++; c.seen++; } });
    const pct = Math.round((right / list.length) * 100);
    S.tests.push({ d: ymd(), deck: "exam", mode: "Exam sim", score: right, total: list.length, secs: Math.round(secs) }); save();
    xp(10 + right * 2); if (pct >= 80) confetti();
    $("#s-right").innerHTML = "";
    $("#s-body").innerHTML = `<div class="card done tight">${timeUp ? `<p class="fb bad">Time's up!</p>` : ""}<div class="done-ring" style="--p:${pct}"><b>${pct}%</b></div>
      <h2>${right} of ${list.length}</h2><p class="muted">${fmtTime(secs)} used of ${fmtTime(limit)}</p>
      <div class="by-tag">${Object.entries(byTag).map(([t, [r, n]]) => `<div><span>${esc(t)}</span><div class="prog"><i style="width:${(r / n) * 100}%"></i></div><b>${r}/${n}</b></div>`).join("")}</div></div>
      <h3 class="sec">Review</h3>
      ${list.map((q, k) => { const ok = ans[k] === q.a; return `<div class="card tq graded ${ok ? "ok" : "no"}"><p class="tq-n">${k + 1} · ${esc(q.tag)}</p><p class="q-text">${esc(q.q)}</p>
        <p class="small">${ans[k] == null ? "Not answered" : `You: ${"ABCD"[ans[k]]}. ${esc(q.c[ans[k]])}`}</p>
        <p class="verdict ${ok ? "good" : "bad"}">${ok ? "✓ Correct" : `✗ ${"ABCD"[q.a]}. ${esc(q.c[q.a])}`}</p><p class="muted small">${esc(q.why)}</p></div>`; }).join("")}
      <button class="btn primary wide" id="ex-done">Done</button>`;
    $("#s-body").scrollTop = 0;
    $("#ex-done").onclick = () => closeSession();
  };
  draw();
}

/* =========================================================
   PRACTICE TAB (problem sets + endless drills)
   ========================================================= */
function renderPractice() {
  const decks = allDecks().filter((d) => d.questions.length);
  $("#view").innerHTML = `<h2 class="page-h">Practice</h2>
    <button class="card exam-big" id="exam-btn"><span>⏱️</span><div><p class="h3">Exam simulation</p><p class="muted small">Timed, mixed across every NES topic, results by topic</p></div><span class="go-btn">Start</span></button>
    <h3 class="sec">Lecture problems</h3>
    ${decks.map((d) => { const done = d.questions.filter((q) => S.qs[q.id]).length, miss = d.questions.filter((q) => (S.qs[q.id]?.w || 0) > (S.qs[q.id]?.r || 0)).length;
      return `<div class="card prob-row"><span class="d-ic" style="--c:${d.color}">${d.icon}</span><div class="d-main"><p class="h3">${esc(d.short)}</p><p class="muted small">${d.questions.length} problems · ${done} tried${miss ? ` · ${miss} to fix` : ""}</p></div>
        <div class="row-btns">${miss ? `<button class="btn small" data-miss="${d.id}">Missed</button>` : ""}<button class="btn small primary" data-probs="${d.id}">Start</button></div></div>`; }).join("")}
    <h3 class="sec">Endless drills</h3>
    <p class="muted small">Fresh numbers every time. Build a combo — one miss resets it.</p>
    <div class="drills">${DRILLS.map((D) => `<button class="card drill" data-drill="${D.id}"><span class="dr-ic">${D.icon}</span><b>${esc(D.title)}</b><small>${esc(D.desc)}</small>${S.combo[D.id] ? `<em>Best combo ${S.combo[D.id]}</em>` : ""}</button>`).join("")}</div>`;
  $("#exam-btn").onclick = startExam;
  $$("[data-probs]").forEach((b) => (b.onclick = () => startProblems(deckById(b.dataset.probs))));
  $$("[data-miss]").forEach((b) => (b.onclick = () => startProblems(deckById(b.dataset.miss), true)));
  $$("[data-drill]").forEach((b) => (b.onclick = () => startDrill(DRILLS.find((D) => D.id === b.dataset.drill))));
}
function startDrill(D) {
  let combo = 0, right = 0, total = 0;
  openSession(); $("#s-title").textContent = D.title;
  $("#s-right").innerHTML = `<span class="combo" id="combo">🔥 0</span>`;
  const draw = () => {
    const q = D.make();
    $("#s-body").innerHTML = `<p class="muted small center">${right} / ${total} right · best combo ${S.combo[D.id] || 0}</p><div class="q-card drill-q"><p class="q-text big-q">${esc(q.q)}</p></div>
      <div class="opts grid2">${q.c.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`;
    $$(".opt").forEach((b) => (b.onclick = () => {
      const ok = +b.dataset.k === q.a; total++;
      $$(".opt").forEach((x, k) => { x.disabled = true; if (k === q.a) x.classList.add("right"); });
      tone(ok); tally(ok);
      if (ok) { right++; combo++; xp(2); if (combo > (S.combo[D.id] || 0)) { S.combo[D.id] = combo; save(); }
        if (combo && combo % 10 === 0) { confetti(40); toast(`🔥 ${combo} in a row!`); }
        $("#combo").textContent = `🔥 ${combo}`; $("#combo").classList.add("pop"); setTimeout(() => $("#combo")?.classList.remove("pop"), 300);
        setTimeout(draw, 650);
      } else {
        b.classList.add("wrong"); combo = 0; $("#combo").textContent = "🔥 0";
        $("#s-body").insertAdjacentHTML("beforeend", `<div class="why bad"><b>✗ ${esc(q.c[q.a])}</b><p>${esc(q.why)}</p></div><button class="btn primary wide" id="nx">Next</button>`);
        $("#nx").onclick = draw;
      }
    }));
  };
  draw();
}

/* =========================================================
   STATS
   ========================================================= */
function renderStats() {
  const decks = allDecks(), L = level(), st = streak();
  const all = decks.flatMap((d) => d.cards);
  const weak = all.filter((c) => (S.cards[c.id]?.w || 0) > 0).sort((a, b) => (S.cards[b.id].w - S.cards[b.id].r) - (S.cards[a.id].w - S.cards[a.id].r)).slice(0, 8);
  const totals = Object.values(S.log).reduce((a, d) => ({ n: a.n + d.n, c: a.c + d.c }), { n: 0, c: 0 });
  $("#view").innerHTML = `<h2 class="page-h">Stats</h2>
    <div class="stat-grid">
      <div class="card"><p class="kicker">Level</p><p class="big">${L.lv}</p><p class="muted small">${esc(L.rank.name)}</p></div>
      <div class="card"><p class="kicker">Total XP</p><p class="big">${totalXP().toLocaleString()}</p></div>
      <div class="card"><p class="kicker">Answered</p><p class="big">${totals.n.toLocaleString()}</p><p class="muted small">${totals.n ? Math.round((totals.c / totals.n) * 100) : 0}% right</p></div>
      <div class="card"><p class="kicker">Best streak</p><p class="big">🔥 ${st.best}</p></div>
    </div>
    <div class="card"><div class="title-row"><h3 class="h3">Last 14 days</h3><span class="muted small">answers · % right</span></div><canvas id="hist" class="chart"></canvas></div>
    <div class="card"><h3 class="h3">Mastery by deck</h3>${decks.map((d) => { const s = deckStats(d), t = s.total || 1;
      return `<div class="m-deck"><span>${esc(d.short || d.title)}</span><div class="mbar"><i class="m" style="width:${(s.mastered / t) * 100}%"></i><i class="l" style="width:${(s.learning / t) * 100}%"></i></div><b>${Math.round((s.mastered / t) * 100)}%</b></div>`; }).join("")}</div>
    ${weak.length ? `<div class="card"><div class="title-row"><h3 class="h3">Trickiest cards</h3><button class="btn small primary" id="weak-go">Study these</button></div>
      <ul class="sum-list">${weak.map((c) => `<li><b>${esc(c.t)}</b><span>${esc(c.d)}</span><em>${S.cards[c.id].w}✗ ${S.cards[c.id].r}✓</em></li>`).join("")}</ul></div>` : ""}
    ${S.tests.length ? `<div class="card"><h3 class="h3">Tests & exams</h3><ul class="t-list">${[...S.tests].reverse().slice(0, 12).map((t) => `<li><span>${md(t.d)} · ${esc(t.mode)}${t.deck !== "exam" ? ` · ${esc(deckById(t.deck)?.short || "")}` : ""}</span><b>${Math.round((t.score / t.total) * 100)}%</b></li>`).join("")}</ul></div>` : ""}`;
  $("#weak-go") && ($("#weak-go").onclick = () => startFlash(null, { only: weak.map((c) => c.id) }));
  drawHist();
}
function drawHist() {
  const cv = $("#hist"); if (!cv) return;
  const dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr; const c = cv.getContext("2d"); c.scale(dpr, dpr);
  const days = [...Array(14)].map((_, i) => addDays(ymd(), i - 13));
  const vals = days.map((d) => S.log[d] || { n: 0, c: 0 });
  const max = Math.max(S.goal, ...vals.map((v) => v.n)) * 1.15, pad = { l: 6, r: 6, t: 14, b: 18 };
  const bw = (W - pad.l - pad.r) / days.length, y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  c.setLineDash([4, 4]); c.strokeStyle = css("--gold"); c.beginPath(); c.moveTo(pad.l, y(S.goal)); c.lineTo(W - pad.r, y(S.goal)); c.stroke(); c.setLineDash([]);
  c.font = "10px Nunito, sans-serif"; c.textAlign = "center";
  vals.forEach((v, i) => {
    const x = pad.l + i * bw + bw * 0.18, w = bw * 0.64;
    if (v.n) { c.fillStyle = css("--line"); c.beginPath(); c.roundRect(x, y(v.n), w, H - pad.b - y(v.n), 4); c.fill();
      c.fillStyle = css("--accent"); c.beginPath(); c.roundRect(x, y(v.c), w, H - pad.b - y(v.c), 4); c.fill();
      c.fillStyle = css("--mid"); c.fillText(`${Math.round((v.c / v.n) * 100)}%`, x + w / 2, y(v.n) - 3); }
    if (i % 2 === 1) { c.fillStyle = css("--mid"); c.fillText(md(days[i]).split(" ")[1], x + w / 2, H - 4); }
  });
}

/* =========================================================
   SETTINGS
   ========================================================= */
function openSettings() {
  const o = overlay(`<h2>Settings</h2>
    <label>Your name<input id="st-name" type="text" value="${esc(S.name)}"></label>
    <label>NES 304 exam date<input id="st-exam" type="date" value="${S.examDate || ""}"></label>
    <label>Daily goal (answers) <b id="st-goal-l">${S.goal}</b><input id="st-goal" type="range" min="10" max="100" step="5" value="${S.goal}"></label>
    <label class="check-row"><input type="checkbox" id="st-w" ${S.written ? "checked" : ""}> Typed answers in Learn</label>
    <label class="check-row"><input type="checkbox" id="st-s" ${S.sound ? "checked" : ""}> Sounds</label>
    <p class="muted small">Everything is saved only on this phone. Back it up now and then.</p>
    <div class="two"><button class="btn" id="st-export">Export backup</button><label class="btn file">Import<input type="file" id="st-import" accept="application/json" hidden></label></div>
    <div class="two"><button class="btn" data-close>Cancel</button><button class="btn primary" id="st-save">Save</button></div>`);
  $("#st-goal", o).oninput = (e) => ($("#st-goal-l", o).textContent = e.target.value);
  $("#st-save", o).onclick = () => {
    S.name = $("#st-name", o).value.trim() || "Neftali"; S.examDate = $("#st-exam", o).value || null;
    S.goal = +$("#st-goal", o).value; S.written = $("#st-w", o).checked; S.sound = $("#st-s", o).checked;
    save(); o.remove(); render(); toast("Saved");
  };
  $("#st-export", o).onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" })); a.download = `mathlore-backup-${ymd()}.json`; a.click(); };
  $("#st-import", o).onchange = async (e) => {
    try { const data = JSON.parse(await e.target.files[0].text()); if (!data.cards || !data.log) throw 0; replaceState(data); o.remove(); go("home"); toast("Backup restored"); }
    catch { toast("That file didn't work"); }
  };
}

/* ---------- boot ---------- */
go("home");
window.addEventListener("resize", () => { if (tab === "stats" && !route) drawHist(); });
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
document.addEventListener("visibilitychange", () => { if (!document.hidden && $("#session").hidden) render(); });
