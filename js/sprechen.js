/* ===================================================================
   SPRECHEN – build German sentences from word tiles (Test tab > Sprechen)
   One bank of 200+ sentences (everyday phrases, daily life, A1 verbs, food and mögen).
   Each round draws 15. Every sentence has a stable id, the ones you have checked are saved,
   and unseen sentences come first (same idea as the Prüfung). A new round starts when all are seen.
   Besides the right words, the tile pool contains wrong verb forms and wrong articles
   (for example kommt / kommen / komme, or ein / eine / einen), so you must choose.
   Phrasebook: everyday phrases to memorise, in collapsible groups, with 🔊.
   Task: { id, en: what to do, s: the German answer with punctuation, e: optional explanation }
   =================================================================== */
const spPick = a => a[Math.floor(Math.random() * a.length)];
const spCap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---- Everyday phrases: [group, English, German] ---- */
const SP_PHRASES = [
  ["Greetings","Hello!","Hallo!"],["Greetings","Good morning!","Guten Morgen!"],["Greetings","Good day!","Guten Tag!"],["Greetings","Good evening!","Guten Abend!"],
  ["Greetings","Good night!","Gute Nacht!"],["Greetings","Goodbye!","Auf Wiedersehen!"],["Greetings","Bye!","Tschüss!"],["Greetings","See you tomorrow!","Bis morgen!"],
  ["Greetings","See you later!","Bis später!"],["Greetings","How are you?","Wie geht's?"],["Greetings","Fine, thanks. And you?","Gut, danke. Und dir?"],
  ["Greetings","Nice to meet you.","Freut mich."],["Greetings","Welcome!","Herzlich willkommen!"],
  ["Polite and help","Please.","Bitte."],["Polite and help","Thank you very much!","Vielen Dank!"],["Polite and help","Thanks!","Danke!"],
  ["Polite and help","You're welcome.","Bitte schön."],["Polite and help","Excuse me.","Entschuldigung!"],["Polite and help","Pardon? (please repeat)","Wie bitte?"],
  ["Polite and help","Slower, please.","Langsamer, bitte."],["Polite and help","Once more, please.","Noch einmal, bitte."],["Polite and help","I don't understand.","Ich verstehe nicht."],
  ["Polite and help","I understand.","Ich verstehe."],["Polite and help","I don't know.","Ich weiß nicht."],["Polite and help","Yes, exactly.","Ja, genau."],
  ["Polite and help","Can you help me?","Können Sie mir helfen?"],["Polite and help","Do you speak English?","Sprechen Sie Englisch?"],
  ["Polite and help","I speak a little German.","Ich spreche ein bisschen Deutsch."],
  ["Shopping","I would like a coffee.","Ich möchte einen Kaffee."],["Shopping","How much does that cost?","Wie viel kostet das?"],
  ["Shopping","How much is it all together?","Wie viel kostet das alles zusammen?"],["Shopping","Do you have fish?","Haben Sie Fisch?"],
  ["Shopping","No, unfortunately not.","Nein, leider nicht."],["Shopping","That's all, thanks.","Das ist alles, danke."],
  ["Shopping","That comes to five euros.","Das macht zusammen fünf Euro."],["Shopping","Here you go.","Hier, bitte."],
  ["Food and drink","Enjoy your meal!","Guten Appetit!"],["Food and drink","Cheers!","Prost!"],["Food and drink","I'm hungry.","Ich habe Hunger."],
  ["Food and drink","I'm thirsty.","Ich habe Durst."],["Food and drink","I like cheese.","Ich mag Käse."],["Food and drink","I don't like fish.","Ich mag keinen Fisch."],
  ["Everyday","Where is the toilet?","Wo ist die Toilette?"],["Everyday","What time is it?","Wie spät ist es?"],["Everyday","I'm tired.","Ich bin müde."],
  ["Everyday","Good luck!","Viel Glück!"]
];
const SP_PHRASE_TASKS = SP_PHRASES.map(([g, en, s]) => ({ en: `Say in German: ${en}`, s }));

/* ---- A1 verbs: forms for ich / du / er-sie-es / wir / ihr / sie-Sie, English base + 3rd person, complements [de, en] ---- */
const SP_VERBS = [
  { f:["wohne","wohnst","wohnt","wohnen","wohnt","wohnen"], e:"live", e3:"lives", c:[["in Berlin","in Berlin"],["in Frankfurt","in Frankfurt"],["in München","in Munich"],["in Hamburg","in Hamburg"],["in Köln","in Cologne"]] },
  { f:["komme","kommst","kommt","kommen","kommt","kommen"], e:"come", e3:"comes", c:[["aus Indien","from India"],["aus Deutschland","from Germany"],["aus Polen","from Poland"],["aus Italien","from Italy"],["aus Spanien","from Spain"]] },
  { f:["lerne","lernst","lernt","lernen","lernt","lernen"], e:"learn", e3:"learns", c:[["Deutsch","German"],["Englisch","English"],["Spanisch","Spanish"]] },
  { f:["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"], e:"work", e3:"works", c:[["in Berlin","in Berlin"],["in Frankfurt","in Frankfurt"],["in Hamburg","in Hamburg"]] },
  { f:["spreche","sprichst","spricht","sprechen","sprecht","sprechen"], e:"speak", e3:"speaks", c:[["Deutsch","German"],["Englisch","English"],["Hindi","Hindi"],["Spanisch","Spanish"]] },
  { f:["kaufe","kaufst","kauft","kaufen","kauft","kaufen"], e:"buy", e3:"buys", c:[["Brot","bread"],["Käse","cheese"],["Milch","milk"],["Obst","fruit"],["Reis","rice"],["Wasser","water"]] },
  { f:["brauche","brauchst","braucht","brauchen","braucht","brauchen"], e:"need", e3:"needs", c:[["Brot","bread"],["Milch","milk"],["Butter","butter"],["Wasser","water"],["Eier","eggs"]] },
  { f:["esse","isst","isst","essen","esst","essen"], e:"eat", e3:"eats", c:[["Reis","rice"],["Fisch","fish"],["Salat","salad"],["Nudeln","noodles"],["Käse","cheese"]] },
  { f:["trinke","trinkst","trinkt","trinken","trinkt","trinken"], e:"drink", e3:"drinks", c:[["Tee","tea"],["Kaffee","coffee"],["Wasser","water"],["Saft","juice"],["Milch","milk"]] },
  { f:["habe","hast","hat","haben","habt","haben"], e:"have", e3:"has", c:[["einen Hund","a dog"],["eine Katze","a cat"],["ein Auto","a car"],["einen Bruder","a brother"],["eine Schwester","a sister"],["ein Kind","a child"]] },
  { f:["mag","magst","mag","mögen","mögt","mögen"], e:"like", e3:"likes", c:[["Pizza","pizza"],["Käse","cheese"],["Tee","tea"],["Schokolade","chocolate"],["Obst","fruit"]] }
];
const SP_SUBJ = [
  { de:"ich", en:"I", i:0 }, { de:"er", en:"he", i:2, t:1 }, { de:"sie", en:"she", i:2, t:1 }, { de:"wir", en:"we", i:3 },
  { de:"ihr", en:"you all", i:4 }, { de:"sie", en:"they", i:5 }
];
const SP_NAMES = ["Arul","Anna","Mehmet","Lena","Ravi","Sara"];
/* fixed A1 sentences about you, work and things (from the Lektion 1 and 2 worksheets) */
const SP_BASIC = [
  ["Ask a friend: What is your name?","Wie heißt du?"],["Ask politely: What is your name?","Wie heißen Sie?"],
  ["Ask a friend: Where do you live?","Wo wohnst du?"],["Ask politely: Where do you live?","Wo wohnen Sie?"],
  ["Ask a friend: Where are you from?","Woher kommst du?"],["Ask politely: Where are you from?","Woher kommen Sie?"],
  ["Ask politely: Which language do you speak?","Welche Sprache sprechen Sie?"],["Ask politely: What is your job?","Was sind Sie von Beruf?"],
  ["Ask a friend: Are you tired?","Bist du müde?"],["Say: My name is Anna.","Ich heiße Anna."],["Say: We are learning German.","Wir lernen Deutsch."],
  ["Say: I live in Frankfurt.","Ich wohne in Frankfurt."],["Say: I am a teacher. (woman)","Ich bin Lehrerin."],
  ["Say: The phone is expensive.","Das Handy ist teuer."],["Say: The coffee is warm.","Der Kaffee ist warm."],["Say: The table is big and old.","Der Tisch ist groß und alt."],
  ["Say: The bag is small and new.","Die Tasche ist klein und neu."],["Say: The lamp is bright.","Die Lampe ist hell."],
  ["Say: This is my dog.","Das ist mein Hund."],["Say: That is our table.","Das ist unser Tisch."],["Say: That is her cat.","Das ist ihre Katze."],
  ["Say: That is his bike.","Das ist sein Fahrrad."],["Say: That is your (you all) apartment.","Das ist eure Wohnung."]
].map(([en, s]) => ({ en, s }));
const SP_PRICES = [["die","Butter","butter"],["das","Brot","bread"],["die","Milch","milk"],["das","Wasser","water"],["der","Käse","cheese"],["der","Kaffee","coffee"],
  ["die","Tomaten","tomatoes",1],["die","Äpfel","apples",1],["die","Bananen","bananas",1],["die","Eier","eggs",1],["die","Nudeln","noodles",1],["die","Kartoffeln","potatoes",1]];
/* ---- Daily life: my own A1 sentences (café, family, time, places, weather, hobbies, can / must) ---- */
const SP_DAILY = [
  ["I would like a tea, please.","Ich möchte einen Tee, bitte."],["The bill, please.","Die Rechnung, bitte."],["Do you have a table for two?","Haben Sie einen Tisch für zwei?"],
  ["What would you like?","Was möchten Sie?"],["I would like to pay.","Ich möchte bezahlen."],["The soup is hot.","Die Suppe ist heiß."],
  ["This is my sister.","Das ist meine Schwester."],["I have two brothers.","Ich habe zwei Brüder."],["My mother is a doctor.","Meine Mutter ist Ärztin."],
  ["Do you have children?","Haben Sie Kinder?"],["How old are you?","Wie alt bist du?"],["I am twenty years old.","Ich bin zwanzig Jahre alt."],
  ["It is nine o'clock.","Es ist neun Uhr."],["Today is Monday.","Heute ist Montag."],["See you on Friday!","Bis Freitag!"],
  ["I get up at seven.","Ich stehe um sieben Uhr auf."],["I work from Monday to Friday.","Ich arbeite von Montag bis Freitag."],["The lesson starts at nine.","Der Unterricht beginnt um neun Uhr."],
  ["Where is the station?","Wo ist der Bahnhof?"],["Is there a supermarket here?","Gibt es hier einen Supermarkt?"],["I am going to the supermarket.","Ich gehe zum Supermarkt."],
  ["The bus stop is on the right.","Die Haltestelle ist rechts."],["Go straight ahead.","Gehen Sie geradeaus."],
  ["The weather is nice today.","Das Wetter ist heute schön."],["It is cold.","Es ist kalt."],["I like reading.","Ich lese gern."],
  ["I play football on Sundays.","Ich spiele sonntags Fußball."],["Do you like music?","Magst du Musik?"],
  ["Can you speak slowly?","Können Sie langsam sprechen?"],["I can swim.","Ich kann schwimmen."],["I have to learn German.","Ich muss Deutsch lernen."],
  ["Can I ask a question?","Kann ich eine Frage stellen?"],["I would like to learn German.","Ich möchte Deutsch lernen."],["The apartment is big.","Die Wohnung ist groß."]
].map(([en, s]) => ({ en: `Say in German: ${en}`, s }));

/* ---- Food and mögen ---- */
const SP_FOOD = [
  ["Reis","rice","eat","m"],["Fisch","fish","eat","m"],["Käse","cheese","eat","m"],["Salat","salad","eat","m"],["Kuchen","cake","eat","m"],["Joghurt","yogurt","eat","m"],
  ["Brot","bread","eat","n"],["Fleisch","meat","eat","n"],["Ei","eggs","eat","n"],["Hähnchen","chicken","eat","n"],
  ["Pizza","pizza","eat","f"],["Wurst","sausage","eat","f"],["Butter","butter","eat","f"],["Schokolade","chocolate","eat","f"],
  ["Nudeln","noodles","eat","p"],["Kartoffeln","potatoes","eat","p"],["Tomaten","tomatoes","eat","p"],["Äpfel","apples","eat","p"],["Bananen","bananas","eat","p"],
  ["Wasser","water","drink","n"],["Bier","beer","drink","n"],["Tee","tea","drink","m"],["Kaffee","coffee","drink","m"],["Saft","juice","drink","m"],["Wein","wine","drink","m"],
  ["Milch","milk","drink","f"],["Cola","cola","drink","f"]
].map(([de, en, kind, g]) => ({ de, en, kind, g, kein: g === "m" ? "keinen" : g === "n" ? "kein" : "keine" }));
/* ---- Build the bank (deterministic, so the ids stay stable) ---- */
const spHash = x => { let h = 5381; for (let i = 0; i < x.length; i++) h = ((h << 5) + h + x.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
function spBankBuild(){
  const out = [];
  SP_PHRASE_TASKS.forEach(t => out.push(t));
  SP_DAILY.forEach(t => out.push(t));
  SP_BASIC.forEach(t => out.push(t));
  SP_VERBS.forEach((v, vi) => {                                   // 7 sentences per verb, complements rotate
    const c = k => v.c[(vi * 2 + k) % v.c.length], name = k => SP_NAMES[(vi + k) % SP_NAMES.length];
    const st = (subj, en, i, third, k) => out.push({ en:`Say: ${spCap(en)} ${third ? v.e3 : v.e} ${c(k)[1]}.`, s:`${spCap(subj)} ${v.f[i]} ${c(k)[0]}.`, e:`${subj} → ${v.f[i]}` });
    st("ich", "I", 0, 0, 0); st(name(0), name(0), 2, 1, 1); st("wir", "we", 3, 0, 2); st("ihr", "you all", 4, 0, 3); st("er", "he", 2, 1, 4);
    out.push({ en:`Ask a friend: Do you ${v.e} ${c(5)[1]}?`, s:`${spCap(v.f[1])} du ${c(5)[0]}?`, e:`du → ${v.f[1]}` });
    out.push({ en:`Ask politely: Do you ${v.e} ${c(6)[1]}?`, s:`${spCap(v.f[5])} Sie ${c(6)[0]}?`, e:`Sie → ${v.f[5]}` });
  });
  SP_FOOD.forEach((f, i) => {                                      // one food sentence per word, type rotates
    const eat = f.kind === "eat", t = i % 5;
    if (t === 0) out.push({ en:`Ask: Do you like ${eat ? "eating" : "drinking"} ${f.en}?`, s:`${eat ? "Isst" : "Trinkst"} du gern ${f.de}?` });
    if (t === 1) out.push({ en:`Say: I don't like ${f.en}.`, s:`Ich mag ${f.kein} ${f.de}.`, e:"kein for das words, keinen for der words, keine for die words and plurals." });
    if (t === 2) out.push({ en:`Ask: Do you like ${f.en}?`, s:`Magst du ${f.de}?` });
    if (t === 3) out.push({ en:`Say: I don't like ${eat ? "eating" : "drinking"} ${f.en}.`, s:`Ich ${eat ? "esse" : "trinke"} nicht gern ${f.de}.` });
    if (t === 4) out.push({ en:`Report: ${SP_NAMES[i % SP_NAMES.length]} likes ${eat ? "eating" : "drinking"} ${f.en}.`, s:`${SP_NAMES[i % SP_NAMES.length]} ${eat ? "isst" : "trinkt"} gern ${f.de}.` });
  });
  [{ en:"Ask: What do you like eating?", s:"Was isst du gern?" }, { en:"Ask: What do you like drinking?", s:"Was trinkst du gern?" },
   { en:"Ask: What do you like?", s:"Was magst du?" }, { en:"Ask: What don't you like?", s:"Was magst du nicht?" },
   { en:"Ask: Whom do you like?", s:"Wen magst du?" }].forEach(t => out.push(t));
  SP_PRICES.forEach(([a, n, en, pl]) => out.push({ en:`Ask: How much ${pl ? "do" : "does"} the ${en} cost?`, s:`Wie viel ${pl ? "kosten" : "kostet"} ${a} ${n}?`, e:pl ? "Plural → kosten" : "Singular → kostet" }));
  const seen = new Set();
  return out.filter(t => !seen.has(t.s) && seen.add(t.s)).map(t => ({ ...t, id:spHash(t.s) }));
}
const SP_BANK = spBankBuild();

/* ---- Wrong tiles: other forms of the same verb, other articles ---- */
const SP_CONFUSE = (() => {
  const groups = [["der","die","das","den","dem"],["ein","eine","einen"],["kein","keine","keinen"],["mein","meine"],["dein","deine"],["sein","seine"],["ihr","ihre"],["unser","unsere"],["euer","eure"],
    ["bin","bist","ist","sind","seid"],["möchte","möchtest","möchten","möchtet"],["kann","kannst","können","könnt"],["muss","musst","müssen","müsst"],
    ["gehe","gehst","geht","gehen"],["heiße","heißt","heißen"],["lese","liest","lesen"],["spiele","spielst","spielt","spielen"],["stehe","stehst","steht","stehen"],
    ["beginne","beginnst","beginnt","beginnen"],["kostet","kosten"],["verstehe","verstehst","versteht","verstehen"],["weiß","weißt","wissen"],["Wo","Woher","Wie","Was","Wen"],["gibt","geben"]];
  SP_VERBS.forEach(v => groups.push([...new Set(v.f)]));
  const map = {}; groups.forEach(g => g.forEach(w => { (map[w.toLowerCase()] = map[w.toLowerCase()] || []).push(g); }));
  return map;
})();
function spExtras(it){
  const toks = it.s.split(" "), have = new Set(toks.map(t => t.replace(/[.,!?:]+$/, "").toLowerCase())), cands = [];
  toks.forEach(t => {
    const core = t.replace(/[.,!?:]+$/, ""), low = core.toLowerCase(), tail = t.slice(core.length), gs = SP_CONFUSE[low];
    if (!gs) return;
    const upper = core[0] !== core[0].toLowerCase();
    const wrong = [...new Set(gs.flat().map(w => w.toLowerCase()))].filter(w => w !== low && !have.has(w));
    if (wrong.length) cands.push(shuffle(wrong).map(w => (upper ? spCap(w) : w) + tail));
  });
  const out = [];
  shuffle(cands).forEach(c => { const w = c.find(x => !out.includes(x)); if (w && out.length < 4) out.push(w); });
  shuffle(cands).forEach(c => { const w = c.find(x => !out.includes(x)); if (w && out.length < 3) out.push(w); });
  return out;
}
function spTiles(it){
  const words = it.s.split(" ").concat(it.extra || []);
  let t, g = 0; do { t = shuffle(words.slice()); g++; } while (g < 20 && t.join(" ") === it.s);
  return t.map((w, i) => ({ w, id:i }));
}

/* ---- Round state and actions ---- */
const SP_N = 15;
let sp = null;
function spRec(){ const g = (S.grammar = S.grammar || {}); g.s_all = g.s_all || { attempts:0, best:0, bestTotal:0, seen:[] }; return g.s_all; }
function spStart(){
  const rec = spRec(), valid = new Set(SP_BANK.map(q => q.id));
  rec.seen = (rec.seen || []).filter(x => valid.has(x));
  const unseen = SP_BANK.filter(q => !rec.seen.includes(q.id)); let chosen;
  if (unseen.length >= SP_N) chosen = shuffle(unseen).slice(0, SP_N);
  else { chosen = unseen.concat(shuffle(SP_BANK.filter(q => !unseen.includes(q))).slice(0, SP_N - unseen.length)); rec.rounds = (rec.rounds || 1) + 1; rec.seen = []; }
  const qs = shuffle(chosen).map(q => ({ ...q, extra:spExtras(q) }));
  ui.spSec = "practice";
  sp = { qs, i:0, score:0, built:[], pool:spTiles(qs[0]), checked:false, ok:false, done:false, wrong:[] };
  render();
}
function spQuit(){ sp = null; render(); }
function spTap(id){
  if (!sp || sp.checked) return;
  const a = sp.pool.findIndex(t => t.id === id);
  if (a >= 0) sp.built.push(sp.pool.splice(a, 1)[0]);
  else { const k = sp.built.findIndex(t => t.id === id); if (k >= 0) sp.pool.push(sp.built.splice(k, 1)[0]); }
  render();
}
function spClear(){ if (!sp || sp.checked) return; sp.pool = sp.pool.concat(sp.built); sp.built = []; render(); }
function spCheck(){
  if (!sp || sp.checked || !sp.built.length) return;
  const it = sp.qs[sp.i], got = sp.built.map(t => t.w).join(" "), rec = spRec();
  sp.checked = true; sp.ok = got.toLowerCase() === it.s.toLowerCase();
  if (!rec.seen.includes(it.id)) rec.seen.push(it.id);
  if (sp.ok) sp.score++; else sp.wrong.push({ en:it.en, right:it.s, got, e:it.e });
  render();
}
function spNext(){
  if (sp.i + 1 >= sp.qs.length){
    sp.done = true; sp.need = Math.ceil(sp.qs.length * PASS_RATIO); sp.passed = sp.score >= sp.need;
    const p = spRec(); p.attempts++;
    if (!p.bestTotal || sp.score / sp.qs.length >= p.best / p.bestTotal){ p.best = sp.score; p.bestTotal = sp.qs.length; }
    if (sp.passed) S.xp += 20;
    S.days[localDate()] = true; save();
  } else { sp.i++; sp.built = []; sp.pool = spTiles(sp.qs[sp.i]); sp.checked = false; sp.ok = false; }
  render();
}

/* ---- Views ---- */
function spStat(){
  const p = spRec(), valid = new Set(SP_BANK.map(q => q.id)), seen = (p.seen || []).filter(x => valid.has(x)).length, pct = Math.round(seen / SP_BANK.length * 100);
  return `<div class="muted tiny" style="margin-top:10px">Seen <b>${seen} / ${SP_BANK.length}</b> sentences${p.rounds > 1 ? " · round " + p.rounds : ""}</div>
    <div class="bar" style="margin:4px 0 6px"><div style="width:${pct}%"></div></div>
    <div class="muted tiny">${p.attempts ? `Best ${p.best}/${p.bestTotal} · ${p.attempts} ${p.attempts === 1 ? "try" : "tries"}` : "Not tried yet"} · new sentences come first, a new round starts when all are seen</div>`;
}
function viewSpPractice(){
  if (!sp) return `<div class="glass pad"><b>Build the sentence</b> <span class="muted">· ${SP_N} random tasks from ${SP_BANK.length}</span>
      <p class="muted tiny" style="margin:6px 0 0">You get a task in English. Tap the German words in the right order. The tiles also contain <b>wrong verb forms and wrong articles</b>, so pick carefully. Topics are mixed: everyday phrases, daily life, A1 verbs, food and mögen. Pass mark 80 %.</p>
      <div class="row"><button class="btn" onclick="spStart()">Start</button></div>${spStat()}</div>`;
  if (sp.done) return `<div class="glass pad"><div class="big">${sp.score} / ${sp.qs.length}</div>
      <div class="fb ${sp.passed ? "ok" : "bad"}">${sp.passed ? "Stark! ✓ Pass mark reached. +20 XP" : `Need ${sp.need}/${sp.qs.length} to pass. Check the answers below and try again.`}</div>
      ${sp.wrong.length ? `<div class="hh">Review</div>${sp.wrong.map(w => `<div class="hq"><p>${esc(w.en)}<br><span class="muted">You: ${esc(w.got)}</span><br><b>${esc(w.right)}</b> ${sayBtn(w.right)}${w.e ? `<br><span class="muted tiny">${esc(w.e)}</span>` : ""}</p></div>`).join("")}` : ""}
      <div class="row"><button class="btn" onclick="spStart()">New round</button><button class="btn alt" onclick="sp=null;render()">Close</button></div>${spStat()}</div>`;
  const it = sp.qs[sp.i], tile = t => `<button class="opt" style="width:auto;display:inline-block;margin:4px" onclick="spTap(${t.id})">${esc(t.w)}</button>`;
  return `<div class="glass pad"><div class="muted tiny">${sp.i + 1} / ${sp.qs.length} · score ${sp.score}</div>
      <div class="big" style="margin:10px 0">${esc(it.en)}</div>
      <div style="min-height:52px;border:1px dashed var(--line);border-radius:12px;padding:6px;margin-bottom:8px">${sp.built.map(tile).join("") || '<span class="muted tiny">Tap the words below</span>'}</div>
      <div>${sp.pool.map(tile).join("")}</div>
      <div class="muted tiny" style="margin-top:6px">Some tiles are wrong forms. Do not use them.</div>
      ${sp.checked ? `<div class="fb ${sp.ok ? "ok" : "bad"}" style="margin-top:10px">${sp.ok ? "Richtig! ✓" : "Not quite."} <b>${esc(it.s)}</b> ${sayBtn(it.s)}${it.e ? `<div class="tiny" style="margin-top:4px">${esc(it.e)}</div>` : ""}</div>
        <div class="row"><button class="btn" onclick="spNext()">${sp.i + 1 >= sp.qs.length ? "Finish" : "Next"}</button><button class="btn alt" onclick="spQuit()">Quit</button></div>`
      : `<div class="row"><button class="btn" onclick="spCheck()">Check</button><button class="btn alt" onclick="spClear()">Clear</button><button class="btn alt" onclick="spQuit()">Quit</button></div>`}</div>`;
}
function spToggle(i){ ui.spOpen = ui.spOpen || {}; ui.spOpen[i] = !ui.spOpen[i]; render(); }
function spAll(open){ const n = new Set(SP_PHRASES.map(p => p[0])).size; ui.spOpen = {}; for (let i = 0; i < n; i++) ui.spOpen[i] = open; render(); }
function viewSpBook(){
  const groups = [...new Set(SP_PHRASES.map(p => p[0]))], open = ui.spOpen || {};
  return `<div class="row" style="margin:0 0 4px"><button class="btn alt" onclick="spAll(true)">Expand all</button><button class="btn alt" onclick="spAll(false)">Collapse all</button></div>` +
    groups.map((g, i) => { const rows = SP_PHRASES.filter(p => p[0] === g), o = !!open[i];
      return `<div class="glass pad mt"><button class="hhead" onclick="spToggle(${i})" aria-expanded="${o}"><b>${g}</b><span class="hmore">${rows.length} phrases ${o ? "▴" : "▾"}</span></button>
        ${o ? `<table class="gt" style="margin-top:6px"><tr><th>German</th><th>English</th><th></th></tr>
          ${rows.map(p => `<tr><td style="color:inherit"><b>${esc(p[2])}</b></td><td>${esc(p[1])}</td><td>${sayBtn(p[2])}</td></tr>`).join("")}</table>` : ""}</div>`; }).join("");
}
function viewSprechen(){
  const m = ui.spSec === "book" ? "book" : "practice";
  return `<div class="seg"><button class="${m==="practice"?"on":""}" onclick="ui.spSec='practice';render()">Practice</button>
      <button class="${m==="book"?"on":""}" onclick="ui.spSec='book';render()">Phrasebook</button></div>
    <div style="margin-top:12px">${m === "book" ? viewSpBook() : viewSpPractice()}</div>`;
}
