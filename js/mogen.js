/* ===================================================================
   GRAMMAR: mögen & Lebensmittel (Lektion 2, A1)
   Six categories + a mixed set. Each question is written by hand.
   Item: { p: prompt (___ = blank), a: right answer, o: all options, e: why, h: optional hint }
   "Richtig so" = the sentence in the prompt is already correct.
   =================================================================== */
const MOGEN_SETS = {
  conj:  { label:"Conjugation",          info:"mag · magst · mögen · mögt. Fill in the right form of mögen." },
  art:   { label:"Article or no article", info:"Food has no article. People, animals and things do. Only der becomes den." },
  waswen:{ label:"Was or Wen?",          info:"Wen? asks for a person. Was? asks for things and food." },
  neg:   { label:"nicht or kein",        info:"Negation: nicht at the end, or kein / keine / keinen in front of the noun." },
  order: { label:"Word order",           info:"Verb in position 2 in statements, first in yes/no questions." },
  gern:  { label:"gern, essen, trinken", info:"mögen already means 'to like', so no gern. Plus esse / isst and trinke / trinkt." },
  mix:   { label:"Mixed",                info:"All six categories shuffled together." } };

const M_ART = ["den","die","das","X (no article)"];
const M_OK = "Richtig so";

const MOGEN_Q = {
conj:[
 { p:"Ich ___ Pizza.", a:"mag", o:["mag","magst","mögen","mögt"], e:"ich → mag (no ending, no umlaut)." },
 { p:"Du ___ Tee.", a:"magst", o:["mag","magst","mögen","mögt"], e:"du → magst (mag + st)." },
 { p:"Er ___ Fisch.", a:"mag", o:["mag","magst","mögen","mögt"], e:"er / sie / es → mag, the same as ich." },
 { p:"Wir ___ Äpfel.", a:"mögen", o:["mag","magst","mögen","mögt"], e:"wir → mögen. The plural has the ö." },
 { p:"Ihr ___ Nudeln.", a:"mögt", o:["mag","magst","mögen","mögt"], e:"ihr → mögt (mög + t)." },
 { p:"Anna und Lea ___ Schokolade.", a:"mögen", o:["mag","magst","mögen","mögt"], e:"Two people = sie (they) → mögen." },
 { p:"Tom ___ Obst.", a:"mag", o:["mag","magst","mögen","mögt"], e:"Tom = er → mag." },
 { p:"Meine Eltern ___ Reis.", a:"mögen", o:["mag","magst","mögen","mögt"], e:"Meine Eltern = sie (they) → mögen." },
 { p:"Du ___ Kaffee nicht.", a:"magst", o:["mag","magst","mögen","mögt"], e:"du → magst, also in a negative sentence." },
 { p:"Maria ___ keine Tomaten.", a:"mag", o:["mag","magst","mögen","mögt"], e:"Maria = sie (she) → mag." },
 { p:"Ihr ___ Wasser.", a:"mögt", o:["mag","magst","mögen","mögt"], e:"ihr → mögt." },
 { p:"___ Sie Bier?", a:"Mögen", o:["Mag","Magst","Mögen","Mögt"], h:"Formal Sie, one person", e:"Sie (formal) → mögen, like sie (they). A question starts with the verb." },
 { p:"Er mögt Schokolade.", a:"Er mag Schokolade.", o:["Er mag Schokolade.","Er magst Schokolade.","Er mögen Schokolade.",M_OK], h:"Find the correct version", e:"er → mag. The ö only appears in wir, ihr and sie / Sie." },
 { p:"Wir mag Kaffee.", a:"Wir mögen Kaffee.", o:["Wir mögen Kaffee.","Wir mögt Kaffee.","Wir magst Kaffee.",M_OK], h:"Find the correct version", e:"wir → mögen." },
 { p:"Du mag Käse.", a:"Du magst Käse.", o:["Du magst Käse.","Du mögst Käse.","Du mögen Käse.",M_OK], h:"Find the correct version", e:"du → magst. There is no 'mögst'." }
],
art:[
 { p:"Ich mag ___ Käse.", a:"X (no article)", o:M_ART, e:"Food usually has no article when you say what you like." },
 { p:"Du magst ___ Chef.", a:"den", o:M_ART, e:"A person gets an article. Chef is der, and only der changes: der → den." },
 { p:"Sara mag ___ Lehrerin.", a:"die", o:M_ART, e:"A person gets an article. Lehrerin is die, and die stays die." },
 { p:"Wir mögen ___ Auto.", a:"das", o:M_ART, e:"A thing gets an article. Auto is das, and das stays das." },
 { p:"Ich mag ___ Tomaten.", a:"X (no article)", o:M_ART, e:"Food: no article. Plural food too." },
 { p:"Er mag ___ Hund.", a:"den", o:M_ART, e:"An animal gets an article. Hund is der → den." },
 { p:"Sie mag ___ Schokolade.", a:"X (no article)", o:M_ART, e:"Food: no article, even though it is die Schokolade when you learn the word." },
 { p:"Ihr mögt ___ Bruder.", a:"den", o:M_ART, e:"A person: article. der Bruder → den Bruder." },
 { p:"Du magst ___ Kaffee nicht.", a:"X (no article)", o:M_ART, e:"Food: no article, also in a negative sentence." },
 { p:"Ich mag ___ Katze.", a:"die", o:M_ART, e:"An animal gets an article. die Katze stays die." },
 { p:"Wir mögen ___ Fahrrad.", a:"das", o:M_ART, e:"A thing: article. das Fahrrad stays das." },
 { p:"Tom mag ___ Nudeln.", a:"X (no article)", o:M_ART, e:"Food: no article." },
 { p:"Du magst ___ Mann.", a:"den", o:M_ART, e:"A person: article. der Mann → den Mann." },
 { p:"Er mag ___ Pizza.", a:"X (no article)", o:M_ART, e:"Food: no article." },
 { p:"Sie mag ___ Kind.", a:"das", o:M_ART, e:"A person: article. das Kind stays das." }
],
waswen:[
 { p:"___ magst du? – Ich mag Pizza.", a:"Was", o:["Was","Wen"], e:"Pizza is food, so ask Was?" },
 { p:"___ magst du? – Ich mag den Lehrer.", a:"Wen", o:["Was","Wen"], e:"A person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Anna.", a:"Wen", o:["Was","Wen"], e:"Anna is a person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Schokolade.", a:"Was", o:["Was","Wen"], e:"Food, so ask Was?" },
 { p:"___ magst du? – Ich mag meine Lehrerin.", a:"Wen", o:["Was","Wen"], e:"A person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Kaffee.", a:"Was", o:["Was","Wen"], e:"A drink, so ask Was?" },
 { p:"___ magst du? – Ich mag das Auto.", a:"Was", o:["Was","Wen"], e:"A thing, so ask Was?" },
 { p:"___ magst du? – Ich mag Tom.", a:"Wen", o:["Was","Wen"], e:"Tom is a person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Nudeln.", a:"Was", o:["Was","Wen"], e:"Food, so ask Was?" },
 { p:"___ magst du? – Ich mag meinen Bruder.", a:"Wen", o:["Was","Wen"], e:"A person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Frankfurt.", a:"Was", o:["Was","Wen"], e:"A city is a thing, not a person, so ask Was?" },
 { p:"___ magst du? – Ich mag die Chefin.", a:"Wen", o:["Was","Wen"], e:"A person, so ask Wen?" },
 { p:"___ magst du? – Ich mag Äpfel.", a:"Was", o:["Was","Wen"], e:"Food, so ask Was?" },
 { p:"You want to ask about a person. Which question is right?", a:"Wen magst du?", o:["Wen magst du?","Was magst du?","Wo magst du?","Wie magst du?"], h:"Person", e:"Wen? is the question for people." },
 { p:"You want to ask about food. Which question is right?", a:"Was magst du?", o:["Was magst du?","Wen magst du?","Wo magst du?","Wie magst du?"], h:"Food", e:"Was? is the question for things and food." }
],
neg:[
 { p:"Ich mag ___ Tomaten.", a:"keine", o:["nicht","kein","keine","keinen"], e:"Tomaten is plural, so keine." },
 { p:"Du magst Fisch ___.", a:"nicht", o:["nicht","kein","keine","keinen"], e:"nicht stands at the end: Du magst Fisch nicht." },
 { p:"Wir mögen ___ Käse.", a:"keinen", o:["nicht","kein","keine","keinen"], e:"der Käse → keinen. Only masculine changes (like ein → einen)." },
 { p:"Er mag ___ Bier.", a:"kein", o:["nicht","kein","keine","keinen"], e:"das Bier → kein." },
 { p:"Sie mag ___ Pizza.", a:"keine", o:["nicht","kein","keine","keinen"], e:"die Pizza → keine." },
 { p:"Ich mag den Lehrer ___.", a:"nicht", o:["nicht","kein","keine","keinen"], e:"kein- cannot go with den / die / das. Use nicht at the end." },
 { p:"Ihr mögt Kaffee ___.", a:"nicht", o:["nicht","kein","keine","keinen"], e:"nicht at the end: Ihr mögt Kaffee nicht." },
 { p:"Ich mag ___ Nudeln.", a:"keine", o:["nicht","kein","keine","keinen"], e:"Nudeln is plural, so keine." },
 { p:"Tom mag Anna ___.", a:"nicht", o:["nicht","kein","keine","keinen"], e:"A name never takes kein-. Use nicht at the end." },
 { p:"Wir mögen ___ Fisch.", a:"keinen", o:["nicht","kein","keine","keinen"], e:"der Fisch → keinen." },
 { p:"Anna mag ___ Obst.", a:"kein", o:["nicht","kein","keine","keinen"], e:"das Obst → kein." },
 { p:"Du magst ___ Schokolade.", a:"keine", o:["nicht","kein","keine","keinen"], e:"die Schokolade → keine." },
 { p:"Ich mag nicht Tomaten.", a:"Ich mag keine Tomaten.", o:["Ich mag keine Tomaten.","Ich mag keinen Tomaten.","Ich nicht mag Tomaten.",M_OK], h:"Find the correct version", e:"nicht cannot stand in front of the noun here. Use keine Tomaten (or put nicht at the end: Ich mag Tomaten nicht)." },
 { p:"Ich mag kein Bananen.", a:"Ich mag keine Bananen.", o:["Ich mag keine Bananen.","Ich mag keinen Bananen.","Ich mag kein Banane.",M_OK], h:"Find the correct version", e:"Bananen is plural, so keine." },
 { p:"Wir mögen Kaffee nicht.", a:M_OK, o:["Wir mögen nicht Kaffee.","Wir nicht mögen Kaffee.","Wir mögen keine Kaffee.",M_OK], h:"Find the correct version", e:"This is correct. nicht stands at the end." },
 { p:"Ich mag nicht Fleisch.", a:"Ich mag kein Fleisch.", o:["Ich mag kein Fleisch.","Ich mag keine Fleisch.","Ich nicht mag Fleisch.",M_OK], h:"Find the correct version", e:"das Fleisch → kein Fleisch (or Ich mag Fleisch nicht)." }
],
order:[
 { p:"ich / mag / Schokolade", a:"Ich mag Schokolade.", o:["Ich mag Schokolade.","Ich Schokolade mag.","Schokolade ich mag.","Mag Schokolade ich."], h:"Make a statement", e:"In a statement the verb is in position 2." },
 { p:"du / Kaffee / mögen", a:"Magst du Kaffee?", o:["Magst du Kaffee?","Magst Kaffee du?","Du Kaffee magst?","Kaffee du magst?"], h:"Make a yes/no question", e:"A yes/no question starts with the verb." },
 { p:"was / du / mögen", a:"Was magst du?", o:["Was magst du?","Was du magst?","Magst was du?","Du was magst?"], h:"Make a question", e:"Question word first, then the verb in position 2." },
 { p:"wir / Fisch / nicht / mögen", a:"Wir mögen Fisch nicht.", o:["Wir mögen Fisch nicht.","Wir mögen nicht Fisch.","Wir nicht mögen Fisch.","Nicht wir mögen Fisch."], h:"Make a statement", e:"The verb is in position 2 and nicht goes to the end." },
 { p:"wen / du / mögen", a:"Wen magst du?", o:["Wen magst du?","Wen du magst?","Magst wen du?","Du wen magst?"], h:"Make a question", e:"Wen first, then the verb, then du." },
 { p:"ihr / Tee / mögen", a:"Mögt ihr Tee?", o:["Mögt ihr Tee?","Mögt Tee ihr?","Ihr Tee mögt?","Tee ihr mögt?"], h:"Make a yes/no question", e:"Verb first: Mögt ihr Tee?" },
 { p:"Anna / Pizza / mögen", a:"Anna mag Pizza.", o:["Anna mag Pizza.","Anna Pizza mag.","Mag Anna Pizza.","Pizza Anna mag."], h:"Make a statement", e:"Subject, then the verb in position 2." },
 { p:"Which one is a yes/no question?", a:"Magst du Tomaten?", o:["Magst du Tomaten?","Was magst du?","Ich mag Tomaten.","Wen magst du?"], e:"A yes/no question starts with the verb." },
 { p:"Which one starts with a question word?", a:"Was magst du?", o:["Was magst du?","Magst du Käse?","Du magst Käse.","Mögt ihr Käse?"], e:"Was is the question word. The verb follows in position 2." },
 { p:"sie / Wasser / nicht / mögen (they)", a:"Sie mögen Wasser nicht.", o:["Sie mögen Wasser nicht.","Sie nicht mögen Wasser.","Nicht sie mögen Wasser.","Sie Wasser mögen nicht."], h:"Make a statement", e:"Verb in position 2, nicht at the end." },
 { p:"du / keinen Fisch / mögen", a:"Du magst keinen Fisch.", o:["Du magst keinen Fisch.","Du keinen Fisch magst.","Magst du keinen Fisch.","Du magst Fisch keinen."], h:"Make a statement", e:"Verb in position 2, keinen stays in front of its noun." },
 { p:"Sie (formal) / Bier / mögen", a:"Mögen Sie Bier?", o:["Mögen Sie Bier?","Mögen Bier Sie?","Sie Bier mögen?","Bier Sie mögen?"], h:"Make a yes/no question", e:"Verb first: Mögen Sie Bier?" },
 { p:"Tom / Tee / mögen / nicht", a:"Tom mag Tee nicht.", o:["Tom mag Tee nicht.","Tom nicht mag Tee.","Tom mag nicht Tee.","Nicht Tom mag Tee."], h:"Make a statement", e:"Verb in position 2, nicht at the end." },
 { p:"Magst du Fisch? Choose the 'no' answer.", a:"Nein, ich mag Fisch nicht.", o:["Nein, ich mag Fisch nicht.","Nein, ich Fisch nicht mag.","Nein, nicht ich mag Fisch.","Nein, mag ich Fisch nicht."], e:"After Nein the statement keeps its normal order: Ich mag Fisch nicht." }
],
gern:[
 { p:"Which sentence is correct?", a:"Ich trinke gern Kaffee.", o:["Ich trinke gern Kaffee.","Ich mag gern Kaffee.","Ich trinkst gern Kaffee.","Ich gern trinke Kaffee."], e:"gern goes with verbs like trinken and essen. mögen already means 'to like', so Ich mag gern is wrong." },
 { p:"Maria ___ gern Nudeln.", a:"isst", o:["isst","esst","esse","essen"], e:"essen: er / sie → isst (e changes to i)." },
 { p:"Ich ___ gern Salat.", a:"esse", o:["isst","esst","esse","essen"], e:"ich → esse." },
 { p:"Du ___ gern Fleisch.", a:"isst", o:["isst","esst","esse","essen"], e:"du → isst." },
 { p:"Wir ___ gern Reis.", a:"essen", o:["isst","esst","esse","essen"], e:"wir → essen." },
 { p:"Er ___ gern Tee.", a:"trinkt", o:["trinkt","trinke","trinkst","trinken"], e:"er → trinkt." },
 { p:"Du ___ gern Saft.", a:"trinkst", o:["trinkt","trinke","trinkst","trinken"], e:"du → trinkst." },
 { p:"Ihr ___ gern Wasser.", a:"trinkt", o:["trinkt","trinke","trinkst","trinken"], e:"ihr → trinkt." },
 { p:"Ich ___ gern Orangensaft.", a:"trinke", o:["trinkt","trinke","trinkst","trinken"], e:"ich → trinke." },
 { p:"Ich mag gern Kaffee.", a:"Ich mag Kaffee.", o:["Ich mag Kaffee.","Ich mögen Kaffee.","Ich gern mag Kaffee.",M_OK], h:"Find the correct version", e:"mögen already means 'to like', so drop gern." },
 { p:"Which sentence is correct?", a:"Ich esse gern Reis.", o:["Ich esse gern Reis.","Ich mag gern Reis.","Ich esse Reis gern mag.","Ich gern esse Reis."], e:"Use gern with essen. Ich mag gern is wrong." },
 { p:"Maria esst gern Nudeln.", a:"Maria isst gern Nudeln.", o:["Maria isst gern Nudeln.","Maria esse gern Nudeln.","Maria essen gern Nudeln.",M_OK], h:"Find the correct version", e:"essen: er / sie → isst. Not esst." },
 { p:"Ich isst gern Salat.", a:"Ich esse gern Salat.", o:["Ich esse gern Salat.","Ich esst gern Salat.","Ich essen gern Salat.",M_OK], h:"Find the correct version", e:"ich → esse." }
]};

/* ---------- builder, start, stats ---------- */
const mogenPools = set => set === "mix" ? Object.keys(MOGEN_Q) : [set];
const mogenTotal = set => mogenPools(set).reduce((a, k) => a + MOGEN_Q[k].length, 0);
function makeMogen(it){
  const ok = it.a === M_OK, noArt = /^X\b/.test(it.a);
  const full = ok ? it.p : it.p.includes("___") ? it.p.replace("___", noArt ? "" : it.a).replace(/\s+/g, " ").replace(" .", ".").replace(" ?", "?") : it.a;
  return { type:"choice", prompt:esc(it.p).replace("___", '<span class="blank">_____</span>'), hint:it.h || "",
    options:shuffle(it.o.slice()), answer:it.a, say:full, explain:`${full} — ${it.e}` };
}
function startMogen(n, set){
  set = MOGEN_SETS[set] ? set : "conj";
  n = Math.min(n, mogenTotal(set));
  const g = (S.grammar = S.grammar || {}), pools = mogenPools(set);
  let pick = [];
  pools.forEach((k, pi) => {
    const gk = "m_" + k; g[gk] = g[gk] || { attempts:0, best:0, bestTotal:0, seen:[] };
    const need = Math.min(MOGEN_Q[k].length, Math.floor(n / pools.length) + (pi < n % pools.length ? 1 : 0));
    if (!need) return;
    const all = MOGEN_Q[k].map((_, i) => i);
    let ids = shuffle(all.filter(i => !g[gk].seen.includes(i))).slice(0, need);              // unseen questions first
    const again = [];                                                                          // ids already seen in an earlier round
    if (ids.length < need){ const extra = shuffle(all.filter(i => !ids.includes(i))).slice(0, need - ids.length); again.push(...extra); ids = ids.concat(extra); g[gk].seen = ids.slice(); g[gk].rounds = (g[gk].rounds || 1) + 1; }   // all seen: new round
    else g[gk].seen = g[gk].seen.concat(ids);
    pick = pick.concat(ids.map(i => [k, i, again.includes(i)]));
  });
  pick = shuffle(pick);
  quiz = { mode:"mogen", set, setLabel:MOGEN_SETS[set].label, n, qs:pick.map(([k, i, old]) => ({ ...makeMogen(MOGEN_Q[k][i]), old })), i:0, score:0, wrong:[], answered:false, last:null, done:false };
  save(); render();
}
function mogenStat(set){
  const p = S.grammar && S.grammar["m_" + set], total = mogenTotal(set);
  const seen = mogenPools(set).reduce((a, k) => a + ((S.grammar && S.grammar["m_" + k] && S.grammar["m_" + k].seen.length) || 0), 0);
  return `<div class="muted tiny" style="margin-top:4px">${MOGEN_SETS[set].label}: ${p && p.attempts ? `best ${p.best}/${p.bestTotal} · ${p.attempts} ${p.attempts === 1 ? "try" : "tries"}` : "not tried yet"} · seen ${Math.min(seen, total)}/${total}${roundOf(mogenPools(set).map(k => "m_" + k)) > 1 ? " · round " + roundOf(mogenPools(set).map(k => "m_" + k)) : ""}</div>`;
}

/* ---------- topic view ---------- */
function viewMogenTopic(){
  const set = ui.mset || "conj", total = mogenTotal(set), counts = [5,10,15,20].filter(k => k <= total), n = counts.includes(ui.mq) ? ui.mq : counts[Math.min(1, counts.length - 1)];
  const open = howOpen();
  const how = `<div class="glass pad how">
      <button class="hhead" onclick="toggleHow()" aria-expanded="${open}"><b>How it works</b><span class="hmore">${open ? "Hide" : "Show"} ${open ? "▴" : "▾"}</span></button>
      ${open ? `<p class="muted tiny" style="margin:4px 0 10px">mögen = to like. Four small rules cover the whole lesson.</p>
      <div class="hq"><span class="hn">1</span><p><b>Verb forms.</b> ich / du / er use <span class="st">mag</span> (<i>mag, magst, mag</i>). wir / ihr / sie use <span class="st">mög</span> (<i>mögen, mögt, mögen</i>). The ö only appears in the plural.</p></div>
      <div class="hq"><span class="hn">2</span><p><b>Article?</b> Food has <span class="st">no article</span>: <i>Ich mag Käse.</i> People, animals and things do: <i>Ich mag <span class="en">den</span> Lehrer.</i> Only der changes (der → den).</p></div>
      <div class="hq"><span class="hn">3</span><p><b>Ask the right question.</b> <i>Was magst du?</i> for things and food. <i>Wen magst du?</i> for people.</p></div>
      <div class="hq"><span class="hn">4</span><p><b>Say no.</b> Either put <span class="en">nicht</span> at the end: <i>Ich mag Fisch nicht.</i> Or use <span class="en">kein-</span> instead of the article: <i>Ich mag keinen Fisch.</i></p></div>
      <div class="hh">Word order</div>
      <ul><li><b>Statement:</b> the verb is in position 2: <i>Ich mag Schokolade.</i></li>
        <li><b>Yes/no question:</b> the verb is first: <i>Magst du Schokolade?</i></li>
        <li><b>Question word:</b> question word first, then the verb: <i>Was magst du?</i></li></ul>
      <div class="hh">Memory tricks</div>
      <ul><li><b>ich and er are twins:</b> both mag.</li>
        <li><b>Singular = a, plural = ö.</b> mag / magst / mag, but mögen / mögt / mögen.</li>
        <li><b>kein- works like ein-:</b> only masculine changes: kein → keinen.</li></ul>
      <div class="hh">Watch out</div>
      <div class="hwarn">Don't say <i>Ich mag gern Kaffee</i>. mögen already means 'like'. Use gern with other verbs: <i>Ich trinke gern Kaffee.</i><br>kein- never goes with den / die / das or a name: <i>Ich mag den Lehrer nicht</i>, <i>Ich mag Anna nicht.</i><br>essen: <i>ich esse, du isst, er isst.</i></div>` : ""}</div>`;
  const conj = [["ich","mag"],["du","magst"],["er / sie / es","mag"],["wir","mögen"],["ihr","mögt"],["sie / Sie","mögen"]];
  const kein = [["der (masculine)","Ich mag <b>keinen</b> Käse."],["das (neuter)","Ich mag <b>kein</b> Bier."],["die (feminine)","Ich mag <b>keine</b> Pizza."],["plural","Ich mag <b>keine</b> Nudeln."]];
  return how + `<div class="glass pad mt"><b>All forms</b> <span class="muted">· mögen</span>
      <table class="gt"><tr><th>Person</th><th>mögen</th></tr>
        ${conj.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table>
      <p class="muted tiny" style="margin:10px 0 6px">Saying no with kein-</p>
      <table class="gt"><tr><th>Noun</th><th>Example</th></tr>
        ${kein.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table></div>
    <div class="glass pad mt"><b>Practice test</b> <span class="muted">· ${mogenTotal("mix")} questions in 6 categories</span>
      <label class="muted tiny" style="display:block;margin-top:10px">Category</label>
      <select onchange="ui.mset=this.value;render()">${Object.keys(MOGEN_SETS).map(k => `<option value="${k}" ${k===set?"selected":""}>${MOGEN_SETS[k].label} · ${mogenTotal(k)} questions</option>`).join("")}</select>
      <div class="muted tiny" style="margin-top:6px">${MOGEN_SETS[set].info}</div>
      <label class="muted tiny" style="display:block;margin-top:10px">Number of questions</label>
      <select onchange="ui.mq=+this.value">${counts.map(k => `<option value="${k}" ${k===n?"selected":""}>${k} questions</option>`).join("")}</select>
      <div class="row"><button class="btn" onclick="startMogen(ui.mq||${n}, ui.mset||'conj')">Start test</button></div>
      <p class="muted tiny" style="margin-bottom:0">Pass mark 80 %. Random questions, unseen ones first, so you see all ${total} before any repeat. Wrong answers get an explanation.</p>
      <div style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px">${Object.keys(MOGEN_SETS).map(mogenStat).join("")}</div></div>`;
}
