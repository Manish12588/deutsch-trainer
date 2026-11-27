/* ===================================================================
   SPRECHEN – build German sentences from word tiles (Test tab > Sprechen)
   Practice: pick a topic, 10 tasks per round, tap the words in order.
   Phrasebook: everyday phrases to memorise, grouped, with 🔊.
   Topics: phrases, verbs (A1 verbs), daily life, food (mögen, gern, kein), mix.
   Task: { en: what to do, s: the German answer with punctuation, e: optional explanation, extra: wrong tiles }
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
function spVerbTask(){
  const v = spPick(SP_VERBS), c = spPick(v.c), r = Math.random();
  if (r < 0.5){
    const s = Math.random() < 0.3 ? { de:spPick(SP_NAMES), i:2, t:1 } : spPick(SP_SUBJ), en = s.en || s.de;
    return { en:`Say: ${spCap(en)} ${s.t ? v.e3 : v.e} ${c[1]}.`, s:`${spCap(s.de)} ${v.f[s.i]} ${c[0]}.` };
  }
  if (r < 0.8) return { en:`Ask a friend: Do you ${v.e} ${c[1]}?`, s:`${spCap(v.f[1])} du ${c[0]}?` };
  return { en:`Ask politely: Do you ${v.e} ${c[1]}?`, s:`${spCap(v.f[5])} Sie ${c[0]}?` };
}
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
function spPriceTask(){
  const [a, n, en, pl] = spPick(SP_PRICES);
  return { en:`Ask: How much ${pl ? "do" : "does"} the ${en} cost?`, s:`Wie viel ${pl ? "kosten" : "kostet"} ${a} ${n}?` };
}

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
function spFoodTask(){
  const f = spPick(SP_FOOD), eat = f.kind === "eat", t = spPick(["ask","mag","neg","neggern","report","open"]);
  if (t === "ask")     return { en:`Ask: Do you like ${eat ? "eating" : "drinking"} ${f.en}?`, s:`${eat ? "Isst" : "Trinkst"} du gern ${f.de}?` };
  if (t === "mag")     return { en:`Ask: Do you like ${f.en}?`, s:`Magst du ${f.de}?` };
  if (t === "neg")     return { en:`Say: I don't like ${f.en}.`, s:`Ich mag ${f.kein} ${f.de}.`, extra:[spPick(["kein","keine","keinen"].filter(x => x !== f.kein))], e:"kein for das words, keinen for der words, keine for die words and plurals." };
  if (t === "neggern") return { en:`Say: I don't like ${eat ? "eating" : "drinking"} ${f.en}.`, s:`Ich ${eat ? "esse" : "trinke"} nicht gern ${f.de}.` };
  if (t === "report"){ const n = spPick(SP_NAMES); return { en:`Report: ${n} likes ${eat ? "eating" : "drinking"} ${f.en}.`, s:`${n} ${eat ? "isst" : "trinkt"} gern ${f.de}.` }; }
  return spPick([{ en:"Ask: What do you like eating?", s:"Was isst du gern?" }, { en:"Ask: What do you like drinking?", s:"Was trinkst du gern?" },
    { en:"Ask: What do you like?", s:"Was magst du?" }, { en:"Ask: What don't you like?", s:"Was magst du nicht?" }]);
}

/* ---- Topics ---- */
const SP_TOPICS = {
  phrases: { label:"Everyday phrases",               info:"Greetings, politeness, shopping, food. Short phrases to memorise.", n:10 },
  verbs:   { label:"A1 verbs",                       info:"wohnen, kommen, lernen, arbeiten, sprechen, kaufen, brauchen, essen, trinken, haben, mögen, plus questions with du and Sie.", n:10 },
  daily:   { label:"Daily life",                     info:"Café, family, time, places, weather, hobbies, können and müssen.", n:10 },
  food:    { label:"Food and mögen",                 info:"mögen, gern, kein, and price questions.", n:10 },
  mix:     { label:"Mixed",                          info:"A bit of everything.", n:10 }
};
function spMake(topic){
  if (topic === "phrases") return spPick(SP_PHRASE_TASKS);
  if (topic === "daily")   return spPick(SP_DAILY);
  if (topic === "verbs")   return Math.random() < 0.7 ? spVerbTask() : spPick(SP_BASIC);
  if (topic === "food")    return Math.random() < 0.15 ? spPriceTask() : spFoodTask();
  return spMake(spPick(["phrases","verbs","daily","food"]));      // mix
}
function spBuild(topic){
  const qs = [], seen = new Set(); let guard = 0;
  while (qs.length < SP_TOPICS[topic].n && guard++ < 400){ const it = spMake(topic); if (!seen.has(it.s)){ seen.add(it.s); qs.push(it); } }
  return qs;
}
function spTiles(it){
  const words = it.s.split(" ").concat(it.extra || []);
  let t, g = 0; do { t = shuffle(words.slice()); g++; } while (g < 20 && t.join(" ") === it.s);
  return t.map((w, i) => ({ w, id:i }));
}

/* ---- Round state and actions ---- */
let sp = null;
function spStart(topic){
  topic = SP_TOPICS[topic] ? topic : "phrases"; ui.spCat = topic; ui.spSec = "practice";
  const qs = spBuild(topic);
  sp = { topic, qs, i:0, score:0, built:[], pool:spTiles(qs[0]), checked:false, ok:false, done:false, wrong:[] };
  render();
}
function spTap(id){
  if (!sp || sp.checked) return;
  const a = sp.pool.findIndex(t => t.id === id);
  if (a >= 0) sp.built.push(sp.pool.splice(a, 1)[0]);
  else { const k = sp.built.findIndex(t => t.id === id); if (k >= 0) sp.pool.push(sp.built.splice(k, 1)[0]); }
  render();
}
function spQuit(){ sp = null; render(); }
function spClear(){ if (!sp || sp.checked) return; sp.pool = sp.pool.concat(sp.built); sp.built = []; render(); }
function spCheck(){
  if (!sp || sp.checked || !sp.built.length) return;
  const it = sp.qs[sp.i], got = sp.built.map(t => t.w).join(" ");
  sp.checked = true; sp.ok = got.toLowerCase() === it.s.toLowerCase();
  if (sp.ok) sp.score++; else sp.wrong.push({ en:it.en, right:it.s, got, e:it.e });
  render();
}
function spNext(){
  if (sp.i + 1 >= sp.qs.length){
    sp.done = true; sp.need = Math.ceil(sp.qs.length * PASS_RATIO); sp.passed = sp.score >= sp.need;
    const key = "s_" + sp.topic, p = (S.grammar[key] = S.grammar[key] || { attempts:0, best:0, bestTotal:0, seen:[] }); p.attempts++;
    if (!p.bestTotal || sp.score / sp.qs.length >= p.best / p.bestTotal){ p.best = sp.score; p.bestTotal = sp.qs.length; }
    if (sp.passed) S.xp += 20;
    S.days[localDate()] = true; save();
  } else { sp.i++; sp.built = []; sp.pool = spTiles(sp.qs[sp.i]); sp.checked = false; sp.ok = false; }
  render();
}

/* ---- Views ---- */
function spStat(k){
  const p = S.grammar && S.grammar["s_" + k];
  return `<div class="muted tiny" style="margin-top:4px">${SP_TOPICS[k].label}: ${p && p.attempts ? `best ${p.best}/${p.bestTotal} · ${p.attempts} ${p.attempts === 1 ? "try" : "tries"}` : "not tried yet"}</div>`;
}
function viewSpPractice(){
  const cat = SP_TOPICS[ui.spCat] ? ui.spCat : "phrases";
  if (!sp) return `<div class="glass pad"><b>Build the sentence</b>
      <p class="muted">You get a task in English, or a sentence to fix. Tap the German words in the right order. Pass mark 80 %.</p>
      <label class="muted tiny" style="display:block;margin-top:10px">Topic</label>
      <select onchange="ui.spCat=this.value;render()">${Object.keys(SP_TOPICS).map(k => `<option value="${k}" ${k===cat?"selected":""}>${SP_TOPICS[k].label}</option>`).join("")}</select>
      <div class="muted tiny" style="margin-top:6px">${SP_TOPICS[cat].info}</div>
      <div class="row"><button class="btn" onclick="spStart('${cat}')">Start · ${SP_TOPICS[cat].n} tasks</button></div>
      <div style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px">${Object.keys(SP_TOPICS).map(spStat).join("")}</div></div>`;
  if (sp.done) return `<div class="glass pad"><div class="big">${sp.score} / ${sp.qs.length}</div>
      <div class="fb ${sp.passed ? "ok" : "bad"}">${sp.passed ? "Stark! ✓ Pass mark reached. +20 XP" : `Need ${sp.need}/${sp.qs.length} to pass. Check the answers below and try again.`}</div>
      ${sp.wrong.length ? `<div class="hh">Review</div>${sp.wrong.map(w => `<div class="hq"><p>${esc(w.en)}<br><span class="muted">You: ${esc(w.got)}</span><br><b>${esc(w.right)}</b> ${sayBtn(w.right)}${w.e ? `<br><span class="muted tiny">${esc(w.e)}</span>` : ""}</p></div>`).join("")}` : ""}
      <div class="row"><button class="btn" onclick="spStart('${sp.topic}')">New round</button><button class="btn alt" onclick="sp=null;render()">Close</button></div></div>`;
  const it = sp.qs[sp.i], tile = t => `<button class="opt" style="width:auto;display:inline-block;margin:4px" onclick="spTap(${t.id})">${esc(t.w)}</button>`;
  return `<div class="glass pad"><div class="muted tiny">${esc(SP_TOPICS[sp.topic].label)} · ${sp.i + 1} / ${sp.qs.length} · score ${sp.score}</div>
      <div class="big" style="margin:10px 0">${esc(it.en)}</div>
      <div style="min-height:52px;border:1px dashed var(--line);border-radius:12px;padding:6px;margin-bottom:8px">${sp.built.map(tile).join("") || '<span class="muted tiny">Tap the words below</span>'}</div>
      <div>${sp.pool.map(tile).join("")}</div>
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
