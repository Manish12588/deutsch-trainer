/* ===================================================================
   3. STATE + HELPERS
   =================================================================== */
const fresh = () => ({ learned:{}, tests:{}, misses:[], xp:0, days:{} });
let me = null, S = null, authMode = "login", pendingName = "", docExists = false;
let ui = { tab:"learn", learnIdx:null, learnMode:"list", deck:null, deckDay:null, cardI:0, checkIdx:null };
let quiz = null;
let admin = { rows:null, loading:false, err:"", open:null };

const el = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => a.map(v => [Math.random(), v]).sort((x,y) => x[0] - y[0]).map(x => x[1]);
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g," ").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss");
const PASS_RATIO = 0.8;
const LSget = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch(e){ return d; } };
const LSset = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };

function toast(msg){
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* theme */
const theme = () => LSget("gt.theme", (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light");
const applyTheme = t => document.documentElement.setAttribute("data-theme", t);
function toggleTheme(){ const t = theme() === "dark" ? "light" : "dark"; LSset("gt.theme", t); applyTheme(t); render(); }
const themeChip = () => `<span class="chip btnlike" onclick="toggleTheme()" title="Switch theme">${theme() === "dark" ? "☀️ Light" : "🌙 Dark"}</span>`;
applyTheme(theme());

/* words */
function wordsOf(d){
  return [...d.verbs.map(v => ({...v, kind:"verb", key:"v:"+v.de, day:d.day})),
          ...d.nouns.map(n => ({...n, kind:"noun", key:"n:"+n.de, day:d.day}))];
}
const allWords = () => DAYS.flatMap(wordsOf);
const label = w => w.kind === "noun" ? w.article + " " + w.de : w.de;
const art = w => `<span class="${w.article}">${w.article} ${esc(w.de)}</span>`;
const dayPassed = i => !!(S.tests[DAYS[i].day] && S.tests[DAYS[i].day].passed);
const dayUnlocked = i => i === 0 || dayPassed(i - 1);       // next day opens after the previous test is passed
const firstOpenDay = () => { const i = DAYS.findIndex((d, k) => !dayPassed(k)); return i === -1 ? DAYS.length - 1 : i; };
const localDate = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
function streakFrom(days){ let n = 0; const d = new Date(); if (!days[localDate(d)]) d.setDate(d.getDate() - 1);
  while (days[localDate(d)]){ n++; d.setDate(d.getDate() - 1); } return n; }
const streak = () => streakFrom(S.days);
const level = () => Math.floor(S.xp / 250) + 1;
const passedCount = () => DAYS.filter((d, i) => dayPassed(i)).length;
const dispName = () => (me && (me.displayName || pendingName)) || (me && me.email ? me.email.split("@")[0] : "");
const isAdminEmail = () => !!(me && me.email && me.email.toLowerCase() === ADMIN_EMAIL);

function say(text, ev){
  if (ev) ev.stopPropagation();
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text); u.lang = "de-DE"; u.rate = 0.85;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
const sayBtn = t => `<button class="say" title="Listen" data-say="${esc(t)}" onclick="say(this.dataset.say,event)">🔊</button>`;

function ring(pct, size, big, small){
  const r = size/2 - 9, c = 2 * Math.PI * r, off = c * (1 - pct);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent2)"/></linearGradient></defs>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--ring)" stroke-width="10"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#rg)" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="50%" y="48%" text-anchor="middle" fill="var(--text)" font-size="${size/4.2}" font-weight="700">${big}</text>
    <text x="50%" y="66%" text-anchor="middle" fill="var(--muted)" font-size="${size/10}">${small}</text></svg>`;
}

function confetti(){
  const cols = ["#6fb1b6","#7f9fcb","#dba2b7","#e0b878","#8fc8a3"];
  const c = el("confetti"), x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight; c.style.display = "block";
  const P = Array.from({length:110}, () => ({x:Math.random()*c.width, y:-20-Math.random()*c.height*.5, vx:(Math.random()-.5)*3,
    vy:2+Math.random()*3.5, s:5+Math.random()*6, c:pick(cols), r:Math.random()*6}));
  let t = 0;
  (function f(){ x.clearRect(0,0,c.width,c.height);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += .12; x.fillStyle = p.c; x.save(); x.translate(p.x,p.y); x.rotate(p.r); x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6); x.restore(); });
    if (++t < 180) requestAnimationFrame(f); else { x.clearRect(0,0,c.width,c.height); c.style.display = "none"; } })();
}
