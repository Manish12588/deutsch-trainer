/* ===================================================================
   5. RENDER
   =================================================================== */
function render(){
  const app = el("app");
  if (bootError) app.innerHTML = viewBootError();
  else if (!authReady) app.innerHTML = `<div class="wrap narrow"><div class="glass auth center"><div class="spin"></div><div class="muted">Loading…</div></div></div>`;
  else if (!me) app.innerHTML = viewAuth();
  else if (!S) app.innerHTML = `<div class="wrap narrow"><div class="glass auth center"><p>Couldn't load your progress.</p>
      <p class="muted tiny">${esc((loadError && (loadError.code || loadError.message)) || "")}</p>
      <div class="row" style="justify-content:center"><button class="btn" onclick="retryLoad()">Try again</button><button class="btn alt" onclick="logout()">Log out</button></div></div></div>`;
  else app.innerHTML = viewApp();
  const a = el("ans"); if (a && quiz && !quiz.answered) a.focus();
}

function viewBootError(){
  return `<div class="wrap narrow"><div class="glass auth center"><div class="mono">!</div><h1>Can't connect</h1>
    <p class="muted">The page couldn't load Firebase. Please check your internet connection and open the page from its web address (https://…), not as a local file.</p>
    <p class="tiny muted">${esc(bootError && (bootError.message || bootError))}</p>
    <button class="btn" onclick="location.reload()">Reload</button></div></div>`;
}

function viewAuth(){
  const m = authMode, k = "onkeydown=\"if(event.key==='Enter')doAuth()\"";
  const sub = { login:"Welcome back", register:"Create your account", reset:"Reset your password" }[m];
  const sw = mode => `authMode='${mode}';authErr='';authOk='';render()`;
  return `<div class="wrap narrow"><div style="text-align:right;margin-bottom:10px">${themeChip()}</div><div class="glass auth">
    <div class="mono">D</div>
    <h1 class="center">Deutsch A1 · 30 Days</h1>
    <p class="muted center" style="margin:0">${sub}</p>
    ${m === "reset" ? "" : `<div class="seg"><button class="${m==="login"?"on":""}" onclick="${sw("login")}">Log in</button>
      <button class="${m==="register"?"on":""}" onclick="${sw("register")}">Create account</button></div>`}
    ${m === "register" ? `<label>Your name</label><input id="an" type="text" autocomplete="name" ${k}>
`  : ""}
    <label>Email</label>
    <input id="au" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" ${k}>
    ${m === "reset" ? "" : `<label>Password</label><input id="ap" type="password" autocomplete="${m==="register"?"new-password":"current-password"}" ${k}>`}
    ${m === "register" ? `<label>Repeat password</label><input id="ap2" type="password" autocomplete="new-password" ${k}>` : ""}
    <div id="aerr" class="err">${esc(authErr)}</div><div id="aok" class="okmsg">${esc(authOk)}</div>
    <button id="abtn" class="btn wide" onclick="doAuth()">${{login:"Log in",register:"Create account",reset:"Send reset link"}[m]}</button>
    ${m === "login" ? `<p class="center" style="margin-bottom:0"><a href="#" onclick="${sw("reset")};return false">Forgot password?</a></p>` : ""}
    ${m === "reset" ? `<p class="center" style="margin-bottom:0"><a href="#" onclick="${sw("login")};return false">← Back to log in</a></p>` : ""}
  </div></div>`;
}

function viewApp(){
  const t = ui.tab, adm = isAdminEmail();
  const body = quiz ? viewQuiz() : t === "learn" ? viewLearn() : t === "check" ? viewCheck() : t === "grammar" ? viewGrammar() : t === "admin" ? viewAdmin() : viewProgress();
  const verify = me.emailVerified ? "" : `<div class="glass banner">📧 Please verify your email address – we sent you a link.
    <div class="row" style="margin-top:8px"><button class="btn alt" onclick="resendVerify()">Resend email</button><button class="btn alt" onclick="refreshVerified()">I've verified</button></div></div>`;
  return `<div class="wrap">
    <div class="top">
      <div class="brand"><span class="gem">D</span>Deutsch A1</div>
      <div class="chips">${themeChip()}<span class="chip">🔥 ${streak()}</span><span class="chip">Lv ${level()} · ${S.xp} XP</span>
        <span class="chip btnlike" onclick="logout()" title="Log out">${esc(dispName())} · Log out</span></div>
    </div>
    ${verify}
    <div class="glass tabs" style="grid-template-columns:repeat(${adm?5:4},1fr)">
      <button class="tab ${t==="learn"?"on":""}" onclick="setTab('learn')">Learn</button>
      <button class="tab ${t==="check"?"on":""}" onclick="setTab('check')">Test</button>
      <button class="tab ${t==="grammar"?"on":""}" onclick="setTab('grammar')">Grammar</button>
      <button class="tab ${t==="progress"?"on":""}" onclick="setTab('progress')">Progress</button>
      ${adm ? `<button class="tab ${t==="admin"?"on":""}" onclick="setTab('admin')">Admin</button>` : ""}
    </div>${body}</div>`;
}
function setTab(t){ ui.tab = t; quiz = null; render(); window.scrollTo(0,0); if (t === "admin" && me.emailVerified && !admin.rows && !admin.loading) loadAdmin(); }

/* ---------- LEARN ---------- */
function dayOptions(sel){
  return DAYS.map((d, i) => `<option value="${i}" ${i===sel?"selected":""}>Day ${d.day} · ${d.theme}${dayPassed(i)?" ✓":""}${dayUnlocked(i)?"":" 🔒"}</option>`).join("");
}
function viewLearn(){
  if (ui.learnIdx === null) ui.learnIdx = firstOpenDay();
  const i = ui.learnIdx, d = DAYS[i];
  let h = `<select onchange="ui.learnIdx=+this.value;ui.deck=null;ui.cardI=0;render()">${dayOptions(i)}</select>`;
  if (!dayUnlocked(i))
    return h + `<div class="glass pad mt center">🔒 Day ${d.day} is locked.<br><span class="muted">Pass the Day ${DAYS[i-1].day} test first.</span>
      <div class="row" style="justify-content:center"><button class="btn" onclick="ui.checkIdx=${i-1};setTab('check')">Go to Day ${DAYS[i-1].day} test</button></div></div>`;
  h += `<div class="seg"><button class="${ui.learnMode==="list"?"on":""}" onclick="ui.learnMode='list';render()">List</button>
        <button class="${ui.learnMode==="cards"?"on":""}" onclick="ui.learnMode='cards';render()">Flashcards</button></div>`;
  h += ui.learnMode === "cards" ? viewCards(d) : viewList(d);
  const learned = !!S.learned[d.day];
  h += `<div class="row"><button class="btn ${learned?"alt":""}" onclick="toggleLearned(${d.day})">${learned?"✓ Learned (undo)":"Mark Day "+d.day+" as learned"}</button>
        <button class="btn alt" onclick="ui.checkIdx=${i};setTab('check')">Take the test →</button></div>`;
  return h;
}
function viewList(d){
  let h = `<h2>Verbs</h2>`;
  d.verbs.forEach(v => {
    h += `<div class="glass wcard"><div><b>${esc(v.de)}</b> <span class="muted">– ${esc(v.en)}</span>
      <div>ich ${esc(v.ich)} · du ${esc(v.du)} · er ${esc(v.er)}</div><div class="ex">${esc(v.ex)}</div></div>${sayBtn(v.de + ". " + v.ex)}</div>`;
  });
  h += `<h2>Nouns</h2>`;
  d.nouns.forEach(n => {
    h += `<div class="glass wcard"><div>${art(n)} <span class="muted">– ${esc(n.en)} · pl. die ${esc(n.plural)}</span>
      <div class="ex">${esc(n.ex)}</div></div>${sayBtn(n.article + " " + n.de + ". " + n.ex)}</div>`;
  });
  return h;
}
function viewCards(d){
  if (!ui.deck || ui.deckDay !== d.day){ ui.deck = wordsOf(d); ui.deckDay = d.day; ui.cardI = 0; }
  const w = ui.deck[ui.cardI];
  const front = w.kind === "noun" ? `<div class="big">${art(w)}</div>` : `<div class="big">${esc(w.de)}</div>`;
  const back = w.kind === "noun"
    ? `<div class="big">${esc(w.en)}</div><div class="muted">Plural: die ${esc(w.plural)}</div>`
    : `<div class="big">${esc(w.en)}</div><div class="muted">ich ${esc(w.ich)} · du ${esc(w.du)} · er ${esc(w.er)}</div>`;
  return `<div class="flipwrap"><div class="flip" onclick="this.classList.toggle('on')">
      <div class="face glass"><span class="tag">${w.kind} · tap to flip</span>${sayBtn((w.kind==="noun"?w.article+" ":"")+w.de)}${front}</div>
      <div class="face glass back"><span class="tag">meaning</span>${sayBtn(w.ex)}${back}<div class="ex">${esc(w.ex)}</div></div></div></div>
    <div class="dots">${ui.deck.map((_, k) => `<i class="${k===ui.cardI?"on":""}"></i>`).join("")}</div>
    <div class="row" style="justify-content:center">
      <button class="btn alt" onclick="cardMove(-1)">← Back</button>
      <button class="btn alt" onclick="ui.deck=shuffle(ui.deck);ui.cardI=0;render()">Shuffle</button>
      <button class="btn" onclick="cardMove(1)">Next →</button></div>`;
}
function cardMove(n){ ui.cardI = (ui.cardI + n + ui.deck.length) % ui.deck.length; render(); }
function toggleLearned(day){ S.learned[day] = !S.learned[day]; if (S.learned[day]) S.days[localDate()] = true; save(); render(); }

/* ---------- TEST ---------- */
function viewCheck(){
  if (ui.checkIdx === null) ui.checkIdx = firstOpenDay();
  const i = ui.checkIdx, d = DAYS[i], open = dayUnlocked(i), t = S.tests[d.day];
  return `<div class="glass pad"><b>Day test</b> <span class="muted">· pass with 8 / 10 to unlock the next day</span>
      <div style="margin-top:10px"><select onchange="ui.checkIdx=+this.value;render()">${dayOptions(i)}</select></div>
      ${t ? `<div class="muted" style="margin-top:8px">Best: ${t.best}/${t.total} · tries: ${t.attempts}</div>` : ""}
      <div class="row"><button class="btn" ${open?"":"disabled"} onclick="startQuiz('test')">Start Day ${d.day} test</button></div>
      ${open ? "" : `<div class="muted" style="margin-top:10px">🔒 Locked until Day ${d.day-1} is passed.</div>`}
    </div>
    <h2>Practice</h2>
    <div class="glass pad">
      <div class="row" style="margin-top:0">
        <button class="btn alt" ${open?"":"disabled"} onclick="startQuiz('meanings')">Meanings</button>
        <button class="btn alt" ${open?"":"disabled"} onclick="startQuiz('plurals')">Plurals</button>
        <button class="btn alt" onclick="startQuiz('review')">Review mix</button></div>
      <p class="muted tiny" style="margin-bottom:0">Practice doesn't change your day progress. Review mix = words from 3 and 7 days ago, plus your missed words.</p>
    </div>
    <p class="muted tiny">Test: nouns ask for the article (der / die / das), verbs ask for the form (ich / du / er).</p>`;
}

function makeQuestion(w){
  if (w.kind === "noun")
    return { key:w.key, type:"choice", prompt:`___ ${esc(w.de)}`, hint:w.en, options:["der","die","das"], answer:w.article,
             explain:`${w.article} ${w.de} – ${w.en} (pl. die ${w.plural})`, say:`${w.article} ${w.de}` };
  const p = pick(["ich","du","er"]);
  return { key:w.key, type:"text", prompt:`${p} ___ (${esc(w.de)})`, hint:w.en + (w.ich.includes(" ") ? " · separable verb: 2 words" : ""),
           answer:w[p], explain:`${p} ${w[p]} – ${w.de} (${w.en})`, say:`${p} ${w[p]}` };
}
function makeMeaning(w){
  const pool = allWords().filter(x => x.key !== w.key && x.kind === w.kind);
  const opts = shuffle([w.en, ...shuffle(pool).slice(0,3).map(x => x.en)]);
  return { key:w.key, type:"choice", prompt:esc(label(w)), hint:"", options:opts, answer:w.en, explain:`${label(w)} = ${w.en}`, say:label(w) };
}
function makePlural(w){
  return { key:w.key, type:"text", prompt:`die ___ (${esc(label(w))})`, hint:w.en + " – type the plural", answer:w.plural,
           explain:`${label(w)} → die ${w.plural}`, say:`die ${w.plural}` };
}

function startQuiz(mode){
  const d = DAYS[ui.checkIdx]; let words = [];
  if (mode === "review"){
    const base = Math.max(0, ...DAYS.filter((x, k) => dayPassed(k) || S.learned[x.day]).map(x => x.day));
    const byDay = n => { const x = DAYS.find(y => y.day === n); return x ? shuffle(wordsOf(x)).slice(0,3) : []; };
    const miss = S.misses.map(k => allWords().find(w => w.key === k)).filter(Boolean).slice(0,4);
    const seen = new Set();
    words = [...byDay(base-3), ...byDay(base-7), ...miss].filter(w => !seen.has(w.key) && seen.add(w.key));
    if (!words.length) words = base ? shuffle(DAYS.filter(x => x.day <= base).flatMap(wordsOf)).slice(0,10) : [];
    if (!words.length){ toast("Nothing to review yet. Learn a day first."); return; }
  } else if (mode === "plurals"){ words = wordsOf(d).filter(w => w.kind === "noun");
  } else { words = wordsOf(d); }
  const make = mode === "meanings" ? makeMeaning : mode === "plurals" ? makePlural : makeQuestion;
  quiz = { mode, day:d.day, qs:shuffle(words).map(make), i:0, score:0, wrong:[], answered:false, last:null, done:false };
  render();
}

function viewQuiz(){
  if (quiz.done) return viewResult();
  const q = quiz.qs[quiz.i], title = { test:`Day ${quiz.day} test`, meanings:"Meanings", plurals:"Plurals", review:"Review mix", poss:"Possessive articles" }[quiz.mode];
  let h = `<div class="muted" style="display:flex;justify-content:space-between"><span>${title}</span><span>${quiz.i+1} / ${quiz.qs.length}</span></div>
    <div class="bar"><div style="width:${quiz.i / quiz.qs.length * 100}%"></div></div>
    <div class="glass q"><div class="big">${q.prompt}</div>${q.hint ? `<div class="muted">${esc(q.hint)}</div>` : ""}`;
  if (q.type === "choice"){
    h += q.options.map(o => {
      let c = ""; if (quiz.answered) c = norm(o) === norm(q.answer) ? "right" : (quiz.last === o ? "wrong" : "");
      return `<button class="opt ${c}" ${quiz.answered?"disabled":""} data-v="${esc(o)}" onclick="submitAnswer(this.dataset.v)">${esc(o)}</button>`;
    }).join("");
  } else {
    h += `<div style="margin-top:12px"><input id="ans" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" ${quiz.answered?"disabled value=\""+esc(quiz.last)+"\"":""}
      onkeydown="if(event.key==='Enter'){event.stopPropagation();submitAnswer(this.value)}"></div>
      <div class="umlauts">${["ä","ö","ü","ß"].map(c => `<button onclick="el('ans').value+='${c}';el('ans').focus()">${c}</button>`).join("")}</div>
      ${quiz.answered ? "" : `<div class="row"><button class="btn" onclick="submitAnswer(el('ans').value)">Check</button></div>`}`;
  }
  if (quiz.answered){
    const ok = norm(quiz.last) === norm(q.answer);
    h += `<div class="fb ${ok?"ok":"bad"}">${ok ? "✓ Richtig!" : "✗ Falsch."} ${esc(q.explain)} ${sayBtn(q.say)}</div>
      <div class="row"><button class="btn" onclick="nextQ()">${quiz.i+1 === quiz.qs.length ? "See result" : "Next →"}</button></div>`;
  }
  h += `</div><div class="row"><button class="btn alt" onclick="quiz=null;render()">✕ Quit</button></div>`;
  return h;
}
function submitAnswer(val){
  if (!quiz || quiz.answered) return;
  const q = quiz.qs[quiz.i]; quiz.answered = true; quiz.last = val;
  if (norm(val) === norm(q.answer)){ quiz.score++; S.xp += quiz.mode === "test" ? 10 : 5; S.misses = S.misses.filter(k => k !== q.key); }
  else { quiz.wrong.push(q); if (q.key && !S.misses.includes(q.key)) S.misses.push(q.key); }
  save(); render();
}
function nextQ(){ quiz.i++; quiz.answered = false; quiz.last = null; if (quiz.i >= quiz.qs.length) finishQuiz(); render(); if (quiz.done && quiz.passed && quiz.mode === "test") confetti(); }
function finishQuiz(){
  quiz.done = true; quiz.need = Math.ceil(quiz.qs.length * PASS_RATIO); quiz.passed = quiz.score >= quiz.need;
  if (quiz.mode === "test"){
    const t = S.tests[quiz.day] || { attempts:0, best:0, passed:false };
    t.attempts++; t.best = Math.max(t.best, quiz.score); t.total = quiz.qs.length; t.last = quiz.score;
    if (quiz.passed){ if (!t.passed) S.xp += 50; t.passed = true; }
    S.tests[quiz.day] = t;
  }
  if (quiz.mode === "poss"){
    const p = S.grammar.poss; p.attempts++;
    if (!p.bestTotal || quiz.score / quiz.qs.length >= p.best / p.bestTotal){ p.best = quiz.score; p.bestTotal = quiz.qs.length; }
    if (quiz.passed) S.xp += 20;
  }
  S.days[localDate()] = true; save();
}
function viewResult(){
  const total = quiz.qs.length, pct = quiz.score / total;
  let msg = "";
  if (quiz.mode === "test") msg = quiz.passed
    ? `<div class="fb ok">Bestanden! ✓ ${quiz.day < 30 ? "Day " + (quiz.day+1) + " is unlocked." : "You finished all 30 days! 🎉"}</div>`
    : `<div class="fb bad">Not passed yet (need ${quiz.need}/${total}). Review today's words and try again.</div>`;
  else if (quiz.mode === "poss") msg = quiz.passed
    ? `<div class="fb ok">Stark! ✓ You reached the pass mark (${quiz.need}/${total}). +20 XP</div>`
    : `<div class="fb bad">Need ${quiz.need}/${total} to pass. Check the explanations below and try a new set.</div>`;
  else msg = `<div class="muted">Practice only – your day progress is unchanged.</div>`;
  let h = `<div class="glass pad center"><div style="display:flex;justify-content:center">${ring(pct, 150, quiz.score + "/" + total, "correct")}</div>${msg}`;
  if (quiz.wrong.length) h += `<h2>Review these</h2><div style="text-align:left">${quiz.wrong.map(q => `<div style="margin:6px 0">• ${esc(q.explain)}</div>`).join("")}</div>`;
  h += `<div class="row" style="justify-content:center"><button class="btn" onclick="${quiz.mode === "poss" ? "startPoss(" + quiz.qs.length + ")" : "startQuiz('" + quiz.mode + "')"}">${quiz.mode === "poss" ? "New random set" : "Try again"}</button>
    ${quiz.mode === "test" && quiz.passed && quiz.day < 30 ? `<button class="btn alt" onclick="ui.learnIdx=${quiz.day};ui.deck=null;ui.learnMode='list';setTab('learn')">Learn Day ${quiz.day+1} →</button>` : ""}
    <button class="btn alt" onclick="quiz=null;render()">Back</button></div></div>`;
  return h;
}
document.addEventListener("keydown", e => { if (quiz && quiz.answered && !quiz.done && e.key === "Enter") nextQ(); });

/* ---------- GRAMMAR: possessive articles ---------- */
const possForm = (stem, fem) => fem ? (stem === "euer" ? "eure" : stem === "unser" ? "unsere" : stem + "e") : stem;
const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);
function makePoss(item){
  const [owner, art, noun, sent] = item, stem = POSS_STEM[owner], fem = art === "die" || art === "pl";
  const fix = s => sent.startsWith("___") ? capFirst(s) : s;
  const answer = fix(possForm(stem, fem)), opts = [answer];
  const add = v => { if (opts.length < 4 && !opts.some(o => norm(o) === norm(v))) opts.push(v); };
  add(fix(possForm(stem, !fem)));
  shuffle(Object.values(POSS_STEM)).forEach(s => add(fix(possForm(s, fem))));
  const full = sent.replace("___", answer);
  const why = art === "pl" ? `${noun} is plural, so add -e` : art === "die" ? `${noun} is die (feminine), so add -e` : `${noun} is ${art}, so no ending`;
  const spell = fem && stem === "euer" ? " (euer drops its middle e: eure)" : fem && stem === "unser" ? " (unser + e = unsere)" : "";
  return { type:"choice", prompt:esc(sent).replace("___", '<span class="blank">_____</span>'), hint:"Owner: " + owner,
    options:shuffle(opts), answer, say:full, explain:`${full} — ${owner} → ${stem}; ${why}${spell}.` };
}
function startPoss(n){
  const g = (S.grammar = S.grammar || {}), p = (g.poss = g.poss || { attempts:0, best:0, bestTotal:0, seen:[] });
  const all = POSS.map((_, i) => i);
  let ids = shuffle(all.filter(i => !p.seen.includes(i))).slice(0, n);      // unseen sentences first
  if (ids.length < n){ ids = ids.concat(shuffle(all.filter(i => !ids.includes(i))).slice(0, n - ids.length)); p.seen = ids.slice(); }
  else p.seen = p.seen.concat(ids);
  quiz = { mode:"poss", n, qs:ids.map(i => makePoss(POSS[i])), i:0, score:0, wrong:[], answered:false, last:null, done:false };
  render();
}
function viewGrammar(){
  const p = (S.grammar && S.grammar.poss) || { attempts:0, best:0, bestTotal:0, seen:[] }, n = ui.gq || 10;
  const rows = [["ich","mein","meine"],["du","dein","deine"],["er / es","sein","seine"],["sie (she)","ihr","ihre"],["wir","unser","unsere"],["ihr (you all)","euer","eure"],["sie (they)","ihr","ihre"],["Sie (formal)","Ihr","Ihre"]];
  return `<div class="glass pad"><b>Possessive articles</b> <span class="muted">· mein, dein, sein…</span>
      <p class="muted tiny" style="margin:6px 0 10px">Nominative. The owner picks the stem, the noun picks the ending.</p>
      <table class="gt"><tr><th>Owner</th><th>der / das</th><th>die / plural</th></tr>
        ${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table>
      <p class="muted tiny" style="margin:10px 0 0">der / das word: no ending. die word or plural: add -e. Careful: euer → eure.</p></div>
    <div class="glass pad mt"><b>Practice test</b> <span class="muted">· ${POSS.length} sentences, picked at random</span>
      <label class="muted tiny" style="display:block;margin-top:10px">Number of questions</label>
      <select onchange="ui.gq=+this.value">${[10,15,20].map(k => `<option value="${k}" ${k===n?"selected":""}>${k} questions</option>`).join("")}</select>
      ${p.attempts ? `<div class="muted" style="margin-top:8px">Best: ${p.best}/${p.bestTotal} · tries: ${p.attempts} · sentences seen: ${Math.min(p.seen.length, POSS.length)}/${POSS.length}</div>` : ""}
      <div class="row"><button class="btn" onclick="startPoss(ui.gq||10)">Start test</button></div>
      <p class="muted tiny" style="margin-bottom:0">Pass mark 80 %. New sentences first, so you see all ${POSS.length} before any repeat. Wrong answers get an explanation.</p></div>`;
}

/* ---------- PROGRESS ---------- */
function viewProgress(){
  const passed = passedCount(), passedWords = passed * 10, learned = DAYS.filter(d => S.learned[d.day]).length;
  const badges = [
    ["🚀","First step","Pass your first test", passed >= 1],
    ["💯","Perfect 10","Score 10/10 in a test", Object.values(S.tests).some(t => t.best === t.total && t.total)],
    ["📅","Week 1","Pass days 1–7", DAYS.slice(0,7).every((d,i) => dayPassed(i))],
    ["⛰️","Halfway","Pass 15 days", passed >= 15],
    ["🎓","Graduate","Pass all 30 days", passed >= 30],
    ["🔥","3-day streak","Learn 3 days in a row", streak() >= 3],
    ["⚡","7-day streak","Learn 7 days in a row", streak() >= 7],
    ["📚","100 words","Pass 100 words", passedWords >= 100]
  ];
  let h = `<div class="glass pad"><div class="ringwrap">${ring(passed/30, 150, passed + "/30", "days passed")}
    <div class="stats">
      <div class="glass stat"><b>${passedWords}</b><span class="muted tiny">words passed</span></div>
      <div class="glass stat"><b>${learned}</b><span class="muted tiny">days learned</span></div>
      <div class="glass stat"><b>${streak()}</b><span class="muted tiny">day streak</span></div>
      <div class="glass stat"><b>${S.misses.length}</b><span class="muted tiny">to repeat</span></div></div></div></div>
    <h2>Your 30 days</h2><div class="grid">`;
  DAYS.forEach((d, i) => {
    const t = S.tests[d.day], st = dayPassed(i) ? "passed" : !dayUnlocked(i) ? "locked" : t ? "retry" : "open";
    h += `<button class="tile ${st}" ${st==="locked"?"disabled":""} onclick="ui.learnIdx=${i};ui.deck=null;setTab('learn')">${st==="locked"?"🔒":d.day}<small>${t ? t.best + "/" + t.total : st==="open" ? "start" : ""}</small></button>`;
  });
  h += `</div><h2>Badges</h2><div class="badges">${badges.map(b => `<div class="glass badge ${b[3]?"":"off"}"><span class="e">${b[0]}</span><b>${b[1]}</b><div class="muted tiny">${b[2]}</div></div>`).join("")}</div>`;
  if (S.misses.length){
    const list = S.misses.map(k => allWords().find(w => w.key === k)).filter(Boolean).map(w => esc(label(w))).join(" · ");
    h += `<h2>Words to repeat</h2><div class="glass pad">${list}</div>`;
  }
  h += `<h2>Account</h2><div class="glass pad"><div class="muted tiny">Signed in as <b>${esc(me.email)}</b>. Your progress is saved online and follows you to any device.</div>
    <div class="row"><button class="btn alt" onclick="exportData()">Export</button>
    <label class="btn alt" style="margin:0">Import<input type="file" accept="application/json" hidden onchange="importData(event)"></label>
    <button class="btn alt" onclick="sendMyReset()">Change password</button>
    <button class="btn alt" onclick="resetData()">Reset progress</button>
    <button class="btn alt" onclick="deleteAccount()">Delete account</button></div></div>`;
  return h;
}
function exportData(){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], {type:"application/json"}));
  a.download = "deutsch-progress.json"; a.click();
}
function importData(e){
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { S = Object.assign(fresh(), JSON.parse(r.result)); save(); render(); toast("Progress imported."); } catch(x){ toast("That file isn't valid."); } };
  r.readAsText(f);
}
function resetData(){ if (confirm("Delete all your progress? This can't be undone.")){ S = fresh(); saveNow().then(render); } }
async function deleteAccount(){
  if (!confirm("Delete your account and all progress permanently?")) return;
  try {
    await FB.F.deleteDoc(FB.F.doc(FB.db, "users", me.uid));
    await FB.A.deleteUser(FB.auth.currentUser);
    toast("Account deleted.");
  } catch(e){
    if (e && e.code === "auth/requires-recent-login"){ docExists = false; toast("For safety, please log out, log in again, then retry."); }
    else toast(authMsg(e));
  }
}

/* ---------- ADMIN (only the admin email can load this data – enforced by Firestore rules) ---------- */
async function loadAdmin(){
  admin.loading = true; admin.err = ""; render();
  try {
    const snap = await FB.F.getDocs(FB.F.collection(FB.db, "users"));
    admin.rows = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  } catch(e){ admin.err = (e && (e.code || e.message)) || "error"; }
  admin.loading = false; render();
}
const tsDate = t => t && t.toDate ? t.toDate() : null;
const fmtDate = t => { const d = tsDate(t); return d ? d.toLocaleDateString("en-GB") : "–"; };
function ago(t){
  const d = tsDate(t); if (!d) return "–";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : days + " days ago";
}
function viewAdmin(){
  if (!me.emailVerified)
    return `<div class="glass pad center"><b>Verify your email to unlock the admin view</b>
      <p class="muted">Open the verification link we sent to ${esc(me.email)}, then tap the button.</p>
      <div class="row" style="justify-content:center"><button class="btn" onclick="refreshVerified()">I've verified</button><button class="btn alt" onclick="resendVerify()">Resend email</button></div></div>`;
  if (admin.loading && !admin.rows) return `<div class="glass pad center"><div class="spin"></div><div class="muted">Loading users…</div></div>`;
  if (admin.err) return `<div class="glass pad"><b>Couldn't load users</b><p class="muted tiny">${esc(admin.err)}</p>
      <p class="muted tiny">If this says "permission-denied", check that the Firestore rules are published and that you're signed in with the admin email.</p>
      <div class="row"><button class="btn" onclick="loadAdmin()">Try again</button></div></div>`;
  if (!admin.rows) return `<div class="glass pad center"><button class="btn" onclick="loadAdmin()">Load users</button></div>`;
  const rows = (admin.rows || []).slice().sort((a, b) => ((tsDate(b.lastActive) || 0) - (tsDate(a.lastActive) || 0)));
  const week = rows.filter(r => { const d = tsDate(r.lastActive); return d && Date.now() - d.getTime() < 7 * 86400000; }).length;
  const avg = rows.length ? (rows.reduce((n, r) => n + ((r.summary && r.summary.passedDays) || 0), 0) / rows.length).toFixed(1) : "0";
  let h = `<div class="glass pad"><div class="stats" style="min-width:0">
      <div class="glass stat"><b>${rows.length}</b><span class="muted tiny">registered</span></div>
      <div class="glass stat"><b>${week}</b><span class="muted tiny">active (7 days)</span></div>
      <div class="glass stat"><b>${avg}</b><span class="muted tiny">avg days passed</span></div></div>
      <div class="row"><button class="btn alt" onclick="loadAdmin()">${admin.loading ? "Refreshing…" : "Refresh"}</button><button class="btn alt" onclick="exportCsv()">Download CSV</button></div></div>
      <h2>People</h2>`;
  if (!rows.length) h += `<div class="glass pad muted">No one has registered yet.</div>`;
  rows.forEach(r => {
    const s = r.summary || {}, open = admin.open === r.id, tests = (r.data && r.data.tests) || {};
    h += `<div class="glass user" onclick="admin.open=admin.open==='${esc(r.id)}'?null:'${esc(r.id)}';render()">
      <div class="nm">${esc(r.name || "(no name)")} <span class="muted" style="font-weight:400;font-size:13px">· ${esc(r.email)}</span></div>
      <div class="meta"><span class="chip">${s.passedDays || 0}/30 days</span><span class="chip">${s.xp || 0} XP</span><span class="chip">🔥 ${s.streak || 0}</span>
        <span class="chip">active ${ago(r.lastActive)}</span></div>`;
    if (open){
      h += `<div class="muted tiny" style="margin-top:10px">Joined ${fmtDate(r.createdAt)} · last active ${fmtDate(r.lastActive)} · ${s.learnedDays || 0} days marked learned</div>
        <div class="grid" style="margin-top:10px">${DAYS.map(d => { const t = tests[d.day];
          return `<div class="tile ${t && t.passed ? "passed" : t ? "retry" : ""}" style="cursor:default">${d.day}<small>${t ? t.best + "/" + t.total + " · " + t.attempts + "x" : "–"}</small></div>`; }).join("")}</div>`;
    }
    h += `</div>`;
  });
  return h;
}
function exportCsv(){
  const q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const lines = [["Name","Email","Joined","Last active","Days passed","Words passed","XP","Streak"].map(q).join(",")];
  (admin.rows || []).forEach(r => { const s = r.summary || {};
    lines.push([r.name, r.email, fmtDate(r.createdAt), fmtDate(r.lastActive), s.passedDays || 0, s.passedWords || 0, s.xp || 0, s.streak || 0].map(q).join(",")); });
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type:"text/csv"}));
  a.download = "deutsch-users.csv"; a.click();
}