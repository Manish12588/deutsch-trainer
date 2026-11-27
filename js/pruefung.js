/* ===================================================================
   PRÜFUNG: grammar tests in the style of the course worksheets.
   "Richtig oder falsch?" Read the sentence. If it is wrong, pick the correct
   version. If it is already right, pick "Richtig so".
   No feedback until the end (unlike the Grammar practice).
   To add a test: add one entry to PRUEF_TESTS. Items use the same format as
   MOGEN_Q in mogen.js: { p: sentence, a: right answer, o: options, e: why }
   =================================================================== */
const PRUEF_HINT = "Richtig oder falsch? Pick the correct version.";
const PRUEF_MOGEN = [
 { p:"Ich mag ein Reis.", a:"Ich mag Reis.", o:["Ich mag Reis.","Ich mag einen Reis.","Ich mag eine Reis.",M_OK], e:"Food has no article when you say what you like." },
 { p:"Tom mögt Tee.", a:"Tom mag Tee.", o:["Tom mag Tee.","Tom magst Tee.","Tom mögen Tee.",M_OK], e:"Tom = er → mag. The ö only appears in wir, ihr and sie / Sie." },
 { p:"Ich esse gern Fleisch.", a:M_OK, o:["Ich mag gern Fleisch.","Ich esst gern Fleisch.","Ich gern esse Fleisch.",M_OK], e:"This is correct: esse + gern." },
 { p:"Maria esst gern Nudeln.", a:"Maria isst gern Nudeln.", o:["Maria isst gern Nudeln.","Maria esse gern Nudeln.","Maria essen gern Nudeln.",M_OK], e:"essen: er / sie → isst." },
 { p:"Wir mögen nicht Nudeln.", a:"Wir mögen keine Nudeln.", o:["Wir mögen keine Nudeln.","Wir mögen keinen Nudeln.","Wir nicht mögen Nudeln.",M_OK], e:"Nudeln is plural, so keine. (Wir mögen Nudeln nicht is also correct.)" },
 { p:"Ich mag gern Kaffee.", a:"Ich mag Kaffee.", o:["Ich mag Kaffee.","Ich mögen Kaffee.","Ich gern mag Kaffee.",M_OK], e:"mögen already means 'to like', so drop gern." },
 { p:"Wir mögen Äpfel.", a:M_OK, o:["Wir mag Äpfel.","Wir mögt Äpfel.","Wir magst Äpfel.",M_OK], e:"This is correct: wir → mögen." },
 { p:"Du magst kein Tomaten.", a:"Du magst keine Tomaten.", o:["Du magst keine Tomaten.","Du magst keinen Tomaten.","Du magst kein Tomate.",M_OK], e:"Tomaten is plural, so keine." },
 { p:"Ich isst gern Salat.", a:"Ich esse gern Salat.", o:["Ich esse gern Salat.","Ich esst gern Salat.","Ich essen gern Salat.",M_OK], e:"ich → esse." },
 { p:"Was magst du? Ich mag Akiko.", a:"Wen magst du? Ich mag Akiko.", o:["Wen magst du? Ich mag Akiko.","Wo magst du? Ich mag Akiko.","Was magst du? Ich mag den Akiko.",M_OK], e:"Akiko is a person, so ask Wen?" },
 { p:"Wen magst du? Ich mag Frankfurt.", a:"Was magst du? Ich mag Frankfurt.", o:["Was magst du? Ich mag Frankfurt.","Wer magst du? Ich mag Frankfurt.","Wen magst du? Ich mag den Frankfurt.",M_OK], e:"A city is a thing, not a person, so ask Was?" },
 { p:"Du mag Käse.", a:"Du magst Käse.", o:["Du magst Käse.","Du mögst Käse.","Du mögen Käse.",M_OK], e:"du → magst." },
 { p:"Ich mag der Lehrer.", a:"Ich mag den Lehrer.", o:["Ich mag den Lehrer.","Ich mag die Lehrer.","Ich mag das Lehrer.",M_OK], e:"A person gets an article. der Lehrer → den Lehrer." },
 { p:"Ihr mögt Fisch nicht.", a:M_OK, o:["Ihr mag Fisch nicht.","Ihr mögen Fisch nicht.","Ihr mögt nicht Fisch.",M_OK], e:"This is correct: ihr → mögt, and nicht at the end." },
 { p:"Ich mag keinen Käse.", a:M_OK, o:["Ich mag kein Käse.","Ich mag keine Käse.","Ich mag nicht Käse.",M_OK], e:"This is correct: der Käse → keinen." },
 { p:"Wir mag Pizza.", a:"Wir mögen Pizza.", o:["Wir mögen Pizza.","Wir mögt Pizza.","Wir magst Pizza.",M_OK], e:"wir → mögen." },
 { p:"Magst du Schokolade?", a:M_OK, o:["Mag du Schokolade?","Magst Schokolade du?","Du Schokolade magst?",M_OK], e:"This is correct: a yes/no question starts with the verb." },
 { p:"Mag du Tee?", a:"Magst du Tee?", o:["Magst du Tee?","Mögst du Tee?","Magst Tee du?",M_OK], e:"du → magst." },
 { p:"Ich mag keine Käse.", a:"Ich mag keinen Käse.", o:["Ich mag keinen Käse.","Ich mag kein Käse.","Ich mag nicht Käse.",M_OK], e:"der Käse → keinen. (Ich mag Käse nicht is also correct.)" },
 { p:"Ihr trinkt gern Tee.", a:M_OK, o:["Ihr trinke gern Tee.","Ihr trinkst gern Tee.","Ihr mögt gern Tee.",M_OK], e:"This is correct: ihr → trinkt." }
];

const PRUEF_TESTS = [
  { id:"mogen", title:"mögen & Lebensmittel", sub:"Richtig oder falsch? Find the mistake and correct it.", bank:PRUEF_MOGEN, n:15 }
];

function startPruef(id){
  const t = PRUEF_TESTS.find(x => x.id === id) || PRUEF_TESTS[0], key = "p_" + t.id;
  const g = (S.grammar = S.grammar || {}); g[key] = g[key] || { attempts:0, best:0, bestTotal:0, seen:[] };
  const n = Math.min(t.n, t.bank.length), all = t.bank.map((_, i) => i);
  let ids = shuffle(all.filter(i => !g[key].seen.includes(i))).slice(0, n);                   // unseen sentences first
  if (ids.length < n){ ids = ids.concat(shuffle(all.filter(i => !ids.includes(i))).slice(0, n - ids.length)); g[key].seen = ids.slice(); }
  else g[key].seen = g[key].seen.concat(ids);
  quiz = { mode:"pruef", set:t.id, setLabel:t.title, n, qs:shuffle(ids).map(i => makeMogen({ ...t.bank[i], h:PRUEF_HINT })), i:0, score:0, wrong:[], answered:false, last:null, done:false };
  render();
}
function pruefStat(t){
  const p = S.grammar && S.grammar["p_" + t.id], seen = (p && p.seen.length) || 0;
  return `<div class="muted tiny" style="margin-top:6px">${p && p.attempts ? `Best ${p.best}/${p.bestTotal} · ${p.attempts} ${p.attempts === 1 ? "try" : "tries"}` : "Not tried yet"} · seen ${Math.min(seen, t.bank.length)}/${t.bank.length} sentences</div>`;
}
function viewPruef(){
  return `<div class="glass pad"><b>Prüfung</b> <span class="muted">· grammar tests, answers at the end</span>
      <p class="muted tiny" style="margin:6px 0 0">Read each sentence. If it is wrong, pick the correct version. If it is already right, pick <b>Richtig so</b>. You see the result and all explanations after the last question. Pass mark 80 %.</p></div>
    ${PRUEF_TESTS.map(t => `<div class="glass pad mt"><b>${t.title}</b> <span class="muted">· ${Math.min(t.n, t.bank.length)} questions</span>
      <div class="muted tiny" style="margin-top:4px">${t.sub}</div>
      <div class="row"><button class="btn" onclick="startPruef('${t.id}')">Start Prüfung</button></div>
      ${pruefStat(t)}</div>`).join("")}`;
}

/* Test tab: two sections, Vocabulary (day tests) and Prüfung (grammar) */
function viewCheck(){
  const sec = ui.testSec === "pruef" ? "pruef" : "vocab";
  return `<div class="glass tabs" style="grid-template-columns:repeat(2,1fr);margin-bottom:12px">
      <button class="tab ${sec==="vocab"?"on":""}" onclick="ui.testSec='vocab';render()">Vocabulary</button>
      <button class="tab ${sec==="pruef"?"on":""}" onclick="ui.testSec='pruef';render()">Prüfung</button></div>
    ${sec === "pruef" ? viewPruef() : viewVocabTest()}`;
}
