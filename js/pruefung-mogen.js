/* ===================================================================
   PRÜFUNG QUESTION BANK: mögen & Lebensmittel (150 sentences)
   20 written by hand + 130 built by rules from word lists (so every right answer
   follows the grammar rule by construction). Each test draws 15 at random.
   Item: { id, p: sentence, a: right answer, o: options, e: why }
   id = stable short code of the sentence, used to remember which ones you have seen.
   To add questions: add a hand-written item to PRUEF_MOGEN_HAND, or extend a word list below.
   =================================================================== */
const PRUEF_MOGEN_HAND = [
 { p:"Ich mag ein Reis.", a:"Ich mag Reis.", o:["Ich mag Reis.","Ich mag die Reis.","Ich mag das Reis.",M_OK], e:"Food has no article when you say what you like." },
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
 { p:"Ich mag der Hund.", a:"Ich mag den Hund.", o:["Ich mag den Hund.","Ich mag die Hund.","Ich mag das Hund.",M_OK], e:"An animal gets an article. der Hund → den Hund." },
 { p:"Ihr mögt Fisch nicht.", a:M_OK, o:["Ihr mag Fisch nicht.","Ihr mögen Fisch nicht.","Ihr mögt nicht Fisch.",M_OK], e:"This is correct: ihr → mögt, and nicht at the end." },
 { p:"Ich mag keinen Käse.", a:M_OK, o:["Ich mag kein Käse.","Ich mag keine Käse.","Ich mag nicht Käse.",M_OK], e:"This is correct: der Käse → keinen." },
 { p:"Wir mag Pizza.", a:"Wir mögen Pizza.", o:["Wir mögen Pizza.","Wir mögt Pizza.","Wir magst Pizza.",M_OK], e:"wir → mögen." },
 { p:"Magst du Schokolade?", a:M_OK, o:["Mag du Schokolade?","Magst Schokolade du?","Du Schokolade magst?",M_OK], e:"This is correct: a yes/no question starts with the verb." },
 { p:"Mag du Tee?", a:"Magst du Tee?", o:["Magst du Tee?","Mögst du Tee?","Magst Tee du?",M_OK], e:"du → magst." },
 { p:"Ich mag keine Käse.", a:"Ich mag keinen Käse.", o:["Ich mag keinen Käse.","Ich mag kein Käse.","Ich mag nicht Käse.",M_OK], e:"der Käse → keinen. (Ich mag Käse nicht is also correct.)" },
 { p:"Ihr trinkt gern Tee.", a:M_OK, o:["Ihr trinke gern Tee.","Ihr trinkst gern Tee.","Ihr mögt gern Tee.",M_OK], e:"This is correct: ihr → trinkt." }
];

/* ---------- word lists ---------- */
const PG_MOG = { s1:"mag", s2:"magst", s3:"mag", p1:"mögen", p2:"mögt", p3:"mögen" };
const PG_ESS = { s1:"esse", s2:"isst", s3:"isst", p1:"essen", p2:"esst", p3:"essen" };
const PG_TRINK = { s1:"trinke", s2:"trinkst", s3:"trinkt", p1:"trinken", p2:"trinkt", p3:"trinken" };
const PG_SUBJ = [["Ich","s1"],["Du","s2"],["Er","s3"],["Wir","p1"],["Ihr","p2"],["Tom","s3"],["Anna","s3"],["Maria","s3"],["Meine Eltern","p3"],["Die Kinder","p3"],["Anna und Lea","p3"],["Mein Vater","s3"],["Meine Mutter","s3"],["Sara","s3"]];
const PG_FOOD = ["Käse","Fisch","Reis","Salat","Kuchen","Brot","Fleisch","Obst","Butter","Milch","Pizza","Schokolade","Wurst","Joghurt","Tee","Kaffee","Saft","Cola","Wein","Bier","Wasser","Äpfel","Bananen","Tomaten","Kartoffeln","Nudeln","Orangen","Karotten","Gurken","Eier","Brötchen"];
const PG_EAT = ["Fleisch","Reis","Salat","Nudeln","Obst","Käse","Pizza","Kuchen","Fisch","Brot","Kartoffeln","Schokolade","Wurst","Joghurt","Äpfel","Bananen"];
const PG_DRINK = ["Kaffee","Tee","Wasser","Saft","Milch","Cola","Wein","Bier","Orangensaft"];
const PG_NEG = [["Käse","m"],["Fisch","m"],["Reis","m"],["Salat","m"],["Kuchen","m"],["Saft","m"],["Tee","m"],["Kaffee","m"],["Wein","m"],["Joghurt","m"],
  ["Brot","n"],["Fleisch","n"],["Bier","n"],["Wasser","n"],["Obst","n"],["Ei","n"],["Butter","f"],["Milch","f"],["Pizza","f"],["Schokolade","f"],["Cola","f"],["Wurst","f"],
  ["Tomaten","p"],["Bananen","p"],["Äpfel","p"],["Nudeln","p"],["Kartoffeln","p"],["Orangen","p"],["Karotten","p"],["Gurken","p"],["Eier","p"]];
const PG_KEIN = { m:"keinen", n:"kein", f:"keine", p:"keine" };
// people, animals and things (no noun here has a plural that looks like its singular, so "die + noun" is always wrong)
const PG_THING = [["Hund","m"],["Katze","f"],["Auto","n"],["Fahrrad","n"],["Mann","m"],["Frau","f"],["Kind","n"],["Freund","m"],["Freundin","f"],["Bruder","m"],["Schwester","f"],
  ["Chef","m"],["Chefin","f"],["Sohn","m"],["Tochter","f"],["Baby","n"],["Haus","n"],["Pferd","n"],["Vogel","m"],["Lehrerin","f"]];
const PG_ART = { m:"den", f:"die", n:"das" };
const PG_ARTWRONG = { m:["der","die","das"], f:["den","das","der"], n:["den","der","die"] };
const PG_GWORD = { m:"der", f:"die", n:"das" };
const PG_PERSON = ["Tom","Anna","Maria","den Lehrer","die Lehrerin","meinen Bruder","meine Schwester","die Chefin","den Mann","die Frau","meinen Freund","meine Freundin"];
const PG_OBJ = ["Pizza","Kaffee","Käse","Schokolade","das Auto","Berlin","Frankfurt","Obst","Tee","Nudeln","das Fahrrad","Reis"];

/* ---------- builder helpers ---------- */
const pgUniq = a => [...new Set(a)];
const pgOthers = (forms, right) => pgUniq(Object.values(forms)).filter(f => f !== right);
const pgCap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pgAt = (arr, i, step, off) => arr[(i * step + (off || 0)) % arr.length];
// a === M_OK: the sentence in the prompt is already right (options = three wrong versions + "Richtig so")
const pgItem = (p, a, wrongs, e) => ({ p, a, e, o: a === M_OK ? [M_OK, ...wrongs.slice(0, 3)] : [a, ...wrongs.slice(0, 2), M_OK] });
function pgBuild(n, make){            // collect n unique items; make(i) may return null to skip
  const out = [], seen = new Set();
  for (let i = 0; i < 600 && out.length < n; i++){ const it = make(i); if (it && !seen.has(it.p)){ seen.add(it.p); out.push(it); } }
  return out;
}

/* ---------- generators ---------- */
// 1. conjugation of mögen (22)
const pgConj = pgBuild(23, i => {
  const [s, k] = pgAt(PG_SUBJ, i, 1), f = pgAt(PG_FOOD, i, 5, 2), right = PG_MOG[k], oth = pgOthers(PG_MOG, right), S = (v) => `${s} ${v} ${f}.`;
  if (i % 4 === 3) return pgItem(S(right), M_OK, oth.map(S), `This is correct: ${s} → ${right}.`);
  const bad = oth[i % 3];
  return pgItem(S(bad), S(right), oth.filter(x => x !== bad).map(S), `${s} → ${right}. (ich / du / er: mag, magst, mag · wir / ihr / sie: mögen, mögt, mögen)`);
});
// 2. article for people, animals, things (22)
const pgArt = pgBuild(22, i => {
  const [s, k] = pgAt(PG_SUBJ, i, 3, 1), [n, g] = pgAt(PG_THING, i, 7, 2), right = PG_MOG[k], S = (a) => `${s} ${right} ${a} ${n}.`, ok = PG_ART[g], wl = PG_ARTWRONG[g];
  const why = g === "m" ? `${n} is der → den (only masculine changes).` : `${n} is ${PG_GWORD[g]}, and ${PG_GWORD[g]} stays ${PG_GWORD[g]}.`;
  if (i % 4 === 3) return pgItem(S(ok), M_OK, wl.map(S), `This is correct: ${why}`);
  const bad = wl[i % 3];
  return pgItem(S(bad), S(ok), wl.filter(x => x !== bad).map(S), `A person, animal or thing gets an article. ${why}`);
});
// 3. nicht or kein (24)
const pgNeg = pgBuild(24, i => {
  const [s, k] = pgAt(PG_SUBJ, i, 5, 3), [n, g] = pgAt(PG_NEG, i, 7, 1), v = PG_MOG[k], right = PG_KEIN[g], wk = ["kein","keine","keinen"].filter(x => x !== right);
  const S = (x) => `${s} ${v} ${x} ${n}.`, why = g === "p" ? `${n} is plural → keine.` : `${PG_GWORD[g]} ${n} → ${right}${g === "m" ? " (only masculine changes)" : ""}.`;
  if (i % 3 === 0) return pgItem(`${s} ${v} nicht ${n}.`, S(right), wk.map(S), `nicht cannot stand in front of the noun here. ${why} (Putting nicht at the end is also correct.)`);
  if (i % 3 === 1) return pgItem(S(wk[i % 2]), S(right), [S(wk[(i + 1) % 2]), `${s} ${v} nicht ${n}.`], `${why}`);
  return pgItem(S(right), M_OK, [...wk.map(S), `${s} ${v} nicht ${n}.`], `This is correct: ${why}`);
});
// 4. word order (18): scrambled statements, questions, W-questions, nicht at the end
const pgOrder = pgBuild(18, i => {
  const [s, k] = pgAt(PG_SUBJ, i, 3, 2), f = pgAt(PG_FOOD, i, 7, 4), v = PG_MOG[k], t = i % 18;
  if (t < 4){ const ok = `${s} ${v} ${f}.`; return pgItem(`${s} ${f} ${v}.`, ok, [`${f} ${s} ${v}.`, `${pgCap(v)} ${f} ${s}.`], "In a statement the verb is in position 2: subject, verb, then the rest."); }
  if (t < 7){ const q = [["du","magst"],["ihr","mögt"],["Sie","mögen"]][t - 4], ok = `${pgCap(q[1])} ${q[0]} ${f}?`;
    return pgItem(`${pgCap(q[1])} ${f} ${q[0]}?`, ok, [`${pgCap(q[0])} ${f} ${q[1]}?`, `${f} ${q[0]} ${q[1]}?`], "A yes/no question starts with the verb, then the subject."); }
  if (t < 10){ const w = ["was","wen"][t % 2], q = [["du","magst"],["ihr","mögt"],["Sie","mögen"]][t - 7], ok = `${pgCap(w)} ${q[1]} ${q[0]}?`;
    return pgItem(`${pgCap(w)} ${q[0]} ${q[1]}?`, ok, [`${pgCap(q[0])} ${w} ${q[1]}?`, `${pgCap(q[1])} ${w} ${q[0]}?`], "Question word first, then the verb in position 2, then the subject."); }
  if (t < 14){ const ok = `${s} ${v} ${f} nicht.`; return pgItem(`${s} nicht ${v} ${f}.`, ok, [`${s} ${v} nicht ${f}.`, `${s} ${f} ${v} nicht.`], "The verb is in position 2 and nicht goes to the end."); }
  if (t === 14) return pgItem(`${s} ${v} ${f}.`, M_OK, [`${s} ${f} ${v}.`, `${f} ${s} ${v}.`, `${pgCap(v)} ${f} ${s}.`], "This is correct: the verb is in position 2.");
  if (t === 15) return pgItem(`Magst du ${f}?`, M_OK, [`Magst ${f} du?`, `Du ${f} magst?`, `${f} du magst?`], "This is correct: a yes/no question starts with the verb.");
  if (t === 16) return pgItem(i % 2 ? "Wen magst du?" : "Was magst du?", M_OK, ["Was du magst?", "Du was magst?", "Magst was du?"].map(x => i % 2 ? x.replace("Was", "Wen").replace("was", "wen") : x), "This is correct: question word first, then the verb.");
  return pgItem(`${s} ${v} ${f} nicht.`, M_OK, [`${s} ${v} nicht ${f}.`, `${s} nicht ${v} ${f}.`, `${s} ${f} ${v} nicht.`], "This is correct: nicht goes to the end.");
});
// 5. Was or Wen (20)
const pgWas = pgBuild(20, i => {
  const t = i % 5;                                        // 0,1: person with Was; 2,3: thing with Wen; 4: already right
  if (t < 2){ const x = pgAt(PG_PERSON, i, 5, 1), ok = `Wen magst du? Ich mag ${x}.`; return pgItem(`Was magst du? Ich mag ${x}.`, ok, [`Wer magst du? Ich mag ${x}.`, `Wo magst du? Ich mag ${x}.`], "A person, so ask Wen?"); }
  if (t < 4){ const x = pgAt(PG_OBJ, i, 5, 2), ok = `Was magst du? Ich mag ${x}.`; return pgItem(`Wen magst du? Ich mag ${x}.`, ok, [`Wer magst du? Ich mag ${x}.`, `Wie magst du? Ich mag ${x}.`], "Food and things (even a city) are asked with Was?"); }
  return i % 2 ? pgItem(`Wen magst du? Ich mag ${pgAt(PG_PERSON, i, 3)}.`, M_OK, ["Was", "Wer", "Wo"].map(w => `${w} magst du? Ich mag ${pgAt(PG_PERSON, i, 3)}.`), "This is correct: a person, so Wen?")
                 : pgItem(`Was magst du? Ich mag ${pgAt(PG_OBJ, i, 3)}.`, M_OK, ["Wen", "Wer", "Wie"].map(w => `${w} magst du? Ich mag ${pgAt(PG_OBJ, i, 3)}.`), "This is correct: food and things, so Was?");
});
// 6. gern, essen, trinken (24)
const pgGern = pgBuild(24, i => {
  const t = i % 6, [s, k] = pgAt(PG_SUBJ, i, 3, 1);
  if (t === 0 || t === 5){ const f = pgAt(PG_FOOD, i, 5, 3), v = PG_MOG[k], w = pgOthers(PG_MOG, v)[i % 3];
    return pgItem(`${s} ${v} gern ${f}.`, `${s} ${v} ${f}.`, [`${s} ${w} ${f}.`, `${s} gern ${v} ${f}.`], "mögen already means 'to like', so drop gern. Use gern with other verbs: essen, trinken."); }
  const forms = (t === 1 || t === 3) ? PG_ESS : PG_TRINK, list = (t === 1 || t === 3) ? PG_EAT : PG_DRINK, f = pgAt(list, i, 5, 2), right = forms[k], oth = pgOthers(forms, right), S = (v) => `${s} ${v} gern ${f}.`;
  const rule = (t === 1 || t === 3) ? "essen: ich esse, du isst, er isst, wir essen, ihr esst, sie essen." : "trinken: ich trinke, du trinkst, er trinkt, wir trinken, ihr trinkt, sie trinken.";
  if (t >= 3) return pgItem(S(right), M_OK, oth.map(S), `This is correct. ${rule}`);
  const bad = oth[i % 3];
  return pgItem(S(bad), S(right), oth.filter(x => x !== bad).map(S), rule);
});

/* ---------- the bank: 20 + 130 = 150, each with a stable id ---------- */
const pgHash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const PRUEF_MOGEN = (() => {
  const all = [...PRUEF_MOGEN_HAND, ...pgConj, ...pgArt, ...pgNeg, ...pgOrder, ...pgWas, ...pgGern], seen = new Set();
  return all.filter(it => !seen.has(it.p) && seen.add(it.p)).map(it => ({ ...it, id:pgHash(it.p) }));
})();
