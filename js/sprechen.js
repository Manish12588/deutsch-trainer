/* ===================================================================
   SPRECHEN – speaking practice from the Lektion 2 worksheets (Lebensmittel)
   Pair cards: one person asks, the other answers (swap roles), no scoring.
   Solo: build the question or sentence from word tiles, 10 per round, scored.
   Item: [German, English, kind, gender]  kind: eat | drink   gender: m | f | n | p (plural)
   =================================================================== */
const SP_FOOD = [
  ["Reis","rice","eat","m"],["Fisch","fish","eat","m"],["Käse","cheese","eat","m"],["Salat","salad","eat","m"],["Kuchen","cake","eat","m"],["Joghurt","yogurt","eat","m"],
  ["Brot","bread","eat","n"],["Fleisch","meat","eat","n"],["Ei","eggs","eat","n"],["Hähnchen","chicken","eat","n"],
  ["Pizza","pizza","eat","f"],["Wurst","sausage","eat","f"],["Butter","butter","eat","f"],["Schokolade","chocolate","eat","f"],
  ["Nudeln","noodles","eat","p"],["Kartoffeln","potatoes","eat","p"],["Tomaten","tomatoes","eat","p"],["Äpfel","apples","eat","p"],["Bananen","bananas","eat","p"],
  ["Wasser","water","drink","n"],["Bier","beer","drink","n"],["Tee","tea","drink","m"],["Kaffee","coffee","drink","m"],["Saft","juice","drink","m"],["Wein","wine","drink","m"],
  ["Milch","milk","drink","f"],["Cola","cola","drink","f"]
].map(([de, en, kind, g]) => ({ de, en, kind, g, kein: g === "m" ? "keinen" : g === "n" ? "kein" : "keine" }));
const SP_NAMES = ["Arul","Anna","Mehmet","Lena","Ravi","Sara"];
const spPick = a => a[Math.floor(Math.random() * a.length)];
const spCap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Pair cards ---------- */
function spCard(){
  const f = spPick(SP_FOOD), t = spPick(["mag","gern","gern","open","open2","nein"]);
  if (t === "mag")   return { q:`Magst du ${f.de}?`, en:`Do you like ${f.en}?`, a:[`Ja, ich mag ${f.de}.`, `Nein, ich mag ${f.kein} ${f.de}.`] };
  if (t === "gern")  return f.kind === "eat"
    ? { q:`Isst du gern ${f.de}?`, en:`Do you like eating ${f.en}?`, a:[`Ja, ich esse gern ${f.de}.`, `Nein, ich esse nicht gern ${f.de}.`] }
    : { q:`Trinkst du gern ${f.de}?`, en:`Do you like drinking ${f.en}?`, a:[`Ja, ich trinke gern ${f.de}.`, `Nein, ich trinke nicht gern ${f.de}.`] };
  if (t === "open")  return f.kind === "eat"
    ? { q:"Was isst du gern?", en:"What do you like eating?", a:[`Ich esse gern ${f.de}.`, `Ich mag ${f.de}.`] }
    : { q:"Was trinkst du gern?", en:"What do you like drinking?", a:[`Ich trinke gern ${f.de}.`, `Ich mag ${f.de}.`] };
  if (t === "open2") return { q:"Was magst du?", en:"What do you like?", a:[`Ich mag ${f.de}.`] };
  return { q:"Was magst du nicht?", en:"What don't you like?", a:[`Ich mag ${f.kein} ${f.de}.`] };
}
function spNewDeck(){ const d = [], seen = new Set(); let guard = 0; while (d.length < 12 && guard++ < 200){ const c = spCard(); if (!seen.has(c.q)){ seen.add(c.q); d.push(c); } } return d; }
function spPairNew(){ ui.spDeck = spNewDeck(); ui.spI = 0; ui.spShow = false; ui.spA = true; render(); }
function spPairNext(){ ui.spI = (ui.spI + 1) % ui.spDeck.length; ui.spShow = false; ui.spA = !ui.spA; render(); }
function viewSpPair(){
  if (!ui.spDeck) { ui.spDeck = spNewDeck(); ui.spI = 0; ui.spShow = false; ui.spA = true; }
  const c = ui.spDeck[ui.spI], asker = ui.spA ? "A" : "B", answerer = ui.spA ? "B" : "A";
  return `<div class="glass pad">
      <div class="muted tiny">Card ${ui.spI + 1} / ${ui.spDeck.length} · Partner <b>${asker}</b> asks, partner <b>${answerer}</b> answers</div>
      <div class="big" style="margin:14px 0 4px">${esc(c.q)} ${sayBtn(c.q)}</div>
      <div class="muted">${esc(c.en)}</div>
      ${ui.spShow ? `<div class="hh" style="margin-top:14px">Possible answers</div>
        ${c.a.map(x => `<div class="hq"><p><b>${esc(x)}</b> ${sayBtn(x)}</p></div>`).join("")}`
        : `<p class="muted tiny" style="margin-top:14px">Answer out loud first, then check.</p>`}
      <div class="row">
        <button class="btn alt" onclick="ui.spShow=!ui.spShow;render()">${ui.spShow ? "Hide answers" : "Show answers"}</button>
        <button class="btn" onclick="spPairNext()">Next · swap roles</button></div>
      <div class="row"><button class="btn alt" onclick="spPairNew()">New set of 12 cards</button></div></div>
    <div class="glass pad mt"><b>Sentence frames</b>
      <table class="gt" style="margin-top:6px">
        <tr><td>Ja, ich mag …</td><td>Yes, I like …</td></tr>
        <tr><td>Nein, ich mag kein / keine / keinen …</td><td>No, I don't like …</td></tr>
        <tr><td>Ich esse / trinke gern …</td><td>I like eating / drinking …</td></tr>
        <tr><td>Ich esse / trinke nicht gern …</td><td>I don't like eating / drinking …</td></tr></table>
      <p class="muted tiny" style="margin-bottom:0">kein for das words, keinen for der words, keine for die words and plurals.</p></div>`;
}

/* ---------- Solo: build the sentence from tiles ---------- */
function spItem(){
  const f = spPick(SP_FOOD), v = f.kind === "eat" ? "isst" : "trinkst", vi = f.kind === "eat" ? "esse" : "trinke", vs = f.kind === "eat" ? "isst" : "trinkt";
  const t = spPick(["ask","mag","neg","neggern","report","open"]);
  if (t === "ask")    return { en:`Ask: Do you like ${f.kind === "eat" ? "eating" : "drinking"} ${f.en}?`, s:`${spCap(v)} du gern ${f.de}`, p:"?" };
  if (t === "mag")    return { en:`Ask: Do you like ${f.en}?`, s:`Magst du ${f.de}`, p:"?" };
  if (t === "neg") {
    const wrong = ["kein","keine","keinen"].filter(x => x !== f.kein);
    return { en:`Say: I don't like ${f.en}.`, s:`Ich mag ${f.kein} ${f.de}`, p:".", extra:[spPick(wrong)] };
  }
  if (t === "neggern") return { en:`Say: I don't like ${f.kind === "eat" ? "eating" : "drinking"} ${f.en}.`, s:`Ich ${vi} nicht gern ${f.de}`, p:"." };
  if (t === "report") { const n = spPick(SP_NAMES); return { en:`Report: ${n} likes ${f.kind === "eat" ? "eating" : "drinking"} ${f.en}.`, s:`${n} ${f.kind === "eat" ? "isst" : "trinkt"} gern ${f.de}`, p:"." }; }
  return spPick([
    { en:"Ask: What do you like eating?", s:"Was isst du gern", p:"?" }, { en:"Ask: What do you like drinking?", s:"Was trinkst du gern", p:"?" },
    { en:"Ask: What do you like?", s:"Was magst du", p:"?" }, { en:"Ask: What don't you like?", s:"Was magst du nicht", p:"?" }]);
}
function spTiles(it){
  const words = it.s.split(" ").concat(it.extra || []);
  let t, g = 0; do { t = shuffle(words.slice()); g++; } while (g < 20 && t.join(" ") === it.s);
  return t.map((w, i) => ({ w, id:i }));
}
function spStart(){
  const qs = [], seen = new Set(); let guard = 0;
  while (qs.length < 10 && guard++ < 300){ const it = spItem(); if (!seen.has(it.s)){ seen.add(it.s); qs.push(it); } }
  sp = { qs, i:0, score:0, built:[], pool:spTiles(qs[0]), checked:false, ok:false, done:false, wrong:[] };
  ui.spMode = "solo"; render();
}
let sp = null;
function spTap(id){
  if (!sp || sp.checked) return;
  const inPool = sp.pool.findIndex(t => t.id === id);
  if (inPool >= 0) sp.built.push(sp.pool.splice(inPool, 1)[0]);
  else { const k = sp.built.findIndex(t => t.id === id); if (k >= 0) sp.pool.push(sp.built.splice(k, 1)[0]); }
  render();
}
function spClear(){ if (!sp || sp.checked) return; sp.pool = sp.pool.concat(sp.built); sp.built = []; render(); }
function spCheck(){
  if (!sp || sp.checked || !sp.built.length) return;
  const it = sp.qs[sp.i], got = sp.built.map(t => t.w).join(" ");
  sp.checked = true; sp.ok = got.toLowerCase() === it.s.toLowerCase();
  if (sp.ok) sp.score++; else sp.wrong.push({ en:it.en, right:it.s + it.p, got:got + it.p });
  render();
}
function spNext(){
  if (sp.i + 1 >= sp.qs.length){
    sp.done = true; const need = Math.ceil(sp.qs.length * PASS_RATIO); sp.passed = sp.score >= need; sp.need = need;
    const p = (S.grammar.s_solo = S.grammar.s_solo || { attempts:0, best:0, bestTotal:0, seen:[] }); p.attempts++;
    if (!p.bestTotal || sp.score / sp.qs.length >= p.best / p.bestTotal){ p.best = sp.score; p.bestTotal = sp.qs.length; }
    if (sp.passed) S.xp += 20;
    S.days[localDate()] = true; save();
  } else { sp.i++; sp.built = []; sp.pool = spTiles(sp.qs[sp.i]); sp.checked = false; sp.ok = false; }
  render();
}
function viewSpSolo(){
  const rec = S.grammar && S.grammar.s_solo, stat = rec && rec.attempts ? `best ${rec.best}/${rec.bestTotal} · ${rec.attempts} ${rec.attempts === 1 ? "try" : "tries"}` : "not tried yet";
  if (!sp) return `<div class="glass pad"><b>Build the sentence</b>
      <p class="muted">You see an English task, like <i>Ask: Do you like rice?</i> Tap the German words in the right order. 10 per round, pass mark 80 %.</p>
      <div class="muted tiny">${stat}</div><div class="row"><button class="btn" onclick="spStart()">Start</button></div></div>`;
  if (sp.done) return `<div class="glass pad"><div class="big">${sp.score} / ${sp.qs.length}</div>
      <div class="fb ${sp.passed ? "ok" : "bad"}">${sp.passed ? "Stark! ✓ Pass mark reached. +20 XP" : `Need ${sp.need}/${sp.qs.length} to pass. Check the answers below and try again.`}</div>
      ${sp.wrong.length ? `<div class="hh">Review</div>${sp.wrong.map(w => `<div class="hq"><p>${esc(w.en)}<br><span class="muted">You: ${esc(w.got)}</span><br><b>${esc(w.right)}</b> ${sayBtn(w.right)}</p></div>`).join("")}` : ""}
      <div class="row"><button class="btn" onclick="spStart()">New round</button><button class="btn alt" onclick="sp=null;render()">Close</button></div></div>`;
  const it = sp.qs[sp.i], tile = (t, inB) => `<button class="opt" style="width:auto;display:inline-block;margin:4px" onclick="spTap(${t.id})">${esc(t.w)}</button>`;
  const full = it.s + it.p;
  return `<div class="glass pad"><div class="muted tiny">Question ${sp.i + 1} / ${sp.qs.length} · score ${sp.score}</div>
      <div class="big" style="margin:10px 0">${esc(it.en)}</div>
      <div style="min-height:52px;border:1px dashed var(--line);border-radius:12px;padding:6px;margin-bottom:8px">${sp.built.map(t => tile(t, true)).join("") || '<span class="muted tiny">Tap the words below</span>'}${sp.built.length ? `<span class="muted">${it.p}</span>` : ""}</div>
      <div>${sp.pool.map(t => tile(t, false)).join("")}</div>
      ${sp.checked ? `<div class="fb ${sp.ok ? "ok" : "bad"}" style="margin-top:10px">${sp.ok ? "Richtig! ✓" : "Not quite."} <b>${esc(full)}</b> ${sayBtn(full)}</div>
        <div class="row"><button class="btn" onclick="spNext()">${sp.i + 1 >= sp.qs.length ? "Finish" : "Next"}</button></div>`
      : `<div class="row"><button class="btn" onclick="spCheck()">Check</button><button class="btn alt" onclick="spClear()">Clear</button></div>`}</div>`;
}

function viewSprechen(){
  const m = ui.spMode === "solo" ? "solo" : "pair";
  return `<div class="seg"><button class="${m==="pair"?"on":""}" onclick="ui.spMode='pair';render()">With a partner</button>
      <button class="${m==="solo"?"on":""}" onclick="ui.spMode='solo';render()">Solo</button></div>
    <div style="margin-top:12px">${m === "solo" ? viewSpSolo() : viewSpPair()}</div>`;
}
