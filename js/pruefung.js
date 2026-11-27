/* ===================================================================
   PRÜFUNG: grammar tests in the style of the course worksheets.
   "Richtig oder falsch?" Read the sentence. If it is wrong, pick the correct
   version. If it is already right, pick "Richtig so".
   No feedback until the end (unlike the Grammar practice).
   Every test draws 15 random sentences from its question bank. Each sentence has a
   stable id, and the ids you have seen are saved, so unseen sentences come first.
   When all are seen, a new round starts.
   To add a test: build a bank (see pruefung-mogen.js) and add one entry to PRUEF_TESTS.
   =================================================================== */
const PRUEF_HINT = "Richtig oder falsch? Pick the correct version.";
const PRUEF_TESTS = [
  { id:"mogen", title:"mögen & Lebensmittel", sub:"Richtig oder falsch? Find the mistake and correct it.", bank:PRUEF_MOGEN, n:15 }
];

function startPruef(id){
  const t = PRUEF_TESTS.find(x => x.id === id) || PRUEF_TESTS[0], key = "p_" + t.id;
  const g = (S.grammar = S.grammar || {}); g[key] = g[key] || { attempts:0, best:0, bestTotal:0, seen:[] };
  const rec = g[key], valid = new Set(t.bank.map(q => q.id));
  rec.seen = (rec.seen || []).filter(x => valid.has(x));                         // drop ids that no longer exist (or old numbers)
  const n = Math.min(t.n, t.bank.length), unseen = t.bank.filter(q => !rec.seen.includes(q.id));
  let chosen, again = [];
  if (unseen.length >= n){ chosen = shuffle(unseen).slice(0, n); rec.seen = rec.seen.concat(chosen.map(q => q.id)); }
  else {                                                                         // not enough new ones left: new round
    const rest = shuffle(t.bank.filter(q => !unseen.includes(q)));
    again = rest.slice(0, n - unseen.length).map(q => q.id); chosen = unseen.concat(rest.slice(0, n - unseen.length)); rec.seen = chosen.map(q => q.id); rec.rounds = (rec.rounds || 1) + 1;
  }
  quiz = { mode:"pruef", set:t.id, setLabel:t.title, n, qs:shuffle(chosen).map(q => ({ ...makeMogen({ ...q, h:PRUEF_HINT }), old:again.includes(q.id) })), i:0, score:0, wrong:[], answered:false, last:null, done:false };
  save(); render();
}
function pruefStat(t){
  const p = S.grammar && S.grammar["p_" + t.id], valid = new Set(t.bank.map(q => q.id)), seen = p ? (p.seen || []).filter(x => valid.has(x)).length : 0;
  const pct = Math.round(seen / t.bank.length * 100);
  return `<div class="muted tiny" style="margin-top:10px">Seen <b>${seen} / ${t.bank.length}</b> sentences${p && p.rounds > 1 ? " · round " + p.rounds : ""}</div>
    <div class="bar" style="margin:4px 0 6px"><div style="width:${pct}%"></div></div>
    <div class="muted tiny">${p && p.attempts ? `Best ${p.best}/${p.bestTotal} · ${p.attempts} ${p.attempts === 1 ? "try" : "tries"}` : "Not tried yet"} · new sentences come first, a new round starts when all are seen</div>`;
}
function viewPruef(){
  return `<div class="glass pad"><b>Prüfung</b> <span class="muted">· grammar tests, answers at the end</span>
      <p class="muted tiny" style="margin:6px 0 0">Read each sentence. If it is wrong, pick the correct version. If it is already right, pick <b>Richtig so</b>. You see the result and all explanations after the last question. Pass mark 80 %.</p></div>
    ${PRUEF_TESTS.map(t => `<div class="glass pad mt"><b>${t.title}</b> <span class="muted">· ${Math.min(t.n, t.bank.length)} random questions from ${t.bank.length}</span>
      <div class="muted tiny" style="margin-top:4px">${t.sub}</div>
      <div class="row"><button class="btn" onclick="startPruef('${t.id}')">Start Prüfung</button></div>
      ${pruefStat(t)}</div>`).join("")}`;
}

/* Test tab: two sections, Vocabulary (day tests) and Prüfung (grammar) */
function viewCheck(){
  const sec = ui.testSec === "pruef" || ui.testSec === "sprech" ? ui.testSec : "vocab";
  return `<div class="glass tabs" style="grid-template-columns:repeat(3,1fr);margin-bottom:12px">
      <button class="tab ${sec==="vocab"?"on":""}" onclick="ui.testSec='vocab';render()">Vocabulary</button>
      <button class="tab ${sec==="pruef"?"on":""}" onclick="ui.testSec='pruef';render()">Prüfung</button>
      <button class="tab ${sec==="sprech"?"on":""}" onclick="ui.testSec='sprech';render()">Sprechen</button></div>
    ${sec === "pruef" ? viewPruef() : sec === "sprech" ? viewSprechen() : viewVocabTest()}`;
}
