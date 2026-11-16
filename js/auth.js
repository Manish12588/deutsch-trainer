/* ===================================================================
   4. AUTH + SAVING
   =================================================================== */
function authMsg(e, mode){
  const m = { "auth/invalid-credential":"Wrong email or password.", "auth/wrong-password":"Wrong email or password.", "auth/user-not-found":"Wrong email or password.",
    "auth/invalid-login-credentials":"Wrong email or password.", "auth/email-already-in-use":"An account with this email already exists. Try logging in.",
    "auth/weak-password":"Password needs at least 6 characters.", "auth/invalid-email":"Please enter a valid email address.",
    "auth/too-many-requests":"Too many attempts. Please wait a minute and try again.", "auth/network-request-failed":"No connection. Please check your internet.",
    "auth/operation-not-allowed":"Email/password sign-in is not enabled in Firebase.", "auth/invalid-api-key":"Firebase API key is wrong. Check js/firebase-config.js.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.":"Firebase API key is wrong. Check js/firebase-config.js." };
  const code = (e && e.code) || (e && e.message) || "unknown";
  let msg = m[e && e.code] || "Something went wrong.";
  if (mode === "register" && ["auth/invalid-credential","auth/wrong-password","auth/user-not-found","auth/invalid-login-credentials"].includes(e && e.code))
    msg = "Couldn't create this account – this email may already be registered. Try Log in, or use Forgot password.";
  return String(code).startsWith("app/") ? msg : msg + " [" + code + "]";
}

let authErr = "", authOk = "", registering = false;

async function doAuth(){
  const say2 = (e, o) => { authErr = e || ""; authOk = o || ""; el("aerr").textContent = authErr; el("aok").textContent = authOk; };
  const id = (el("au").value || "").trim().toLowerCase(), p = el("ap") ? el("ap").value : "", btn = el("abtn");
  say2();
  if (!id) return say2(authMode === "register" ? "Please enter your email address." : "Please enter your email address.");
  btn.disabled = true;
  try {
    if (authMode === "reset"){
      await FB.A.sendPasswordResetEmail(FB.auth, id);
      say2("", "If an account exists for this email, a reset link is on its way. Check your inbox and spam folder.");
      btn.disabled = false; return;
    }
    if (authMode === "register"){
      const name = (el("an").value || "").trim();
      const fail = m => { btn.disabled = false; return say2(m); };
      if (name.length < 2) return fail("Please enter your name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(id)) return fail("Please enter a valid email address.");
      if (p.length < 6) return fail("Password needs at least 6 characters.");
      if (p !== el("ap2").value) return fail("Passwords do not match.");
      pendingName = name; registering = true;
      try {
        const cred = await FB.A.createUserWithEmailAndPassword(FB.auth, id, p);
        try { await FB.A.updateProfile(cred.user, { displayName: name }); } catch(e){}
        try { await FB.A.sendEmailVerification(cred.user); } catch(e){}
      } finally { registering = false; }
      await onUser(FB.auth.currentUser);
    } else {
      if (!p){ btn.disabled = false; return say2("Please enter your password."); }
      await FB.A.signInWithEmailAndPassword(FB.auth, id, p);
    }
  } catch(e){ say2(authMsg(e, authMode)); btn.disabled = false; }
}

async function onUser(u){
  if (registering) return;                       // sign-up is still finishing; it calls onUser itself
  if (!u){ me = null; S = null; quiz = null; docExists = false; admin = { rows:null, loading:false, err:"", open:null };
    ui = { tab:"learn", learnIdx:null, learnMode:"list", deck:null, deckDay:null, cardI:0, checkIdx:null };
    authReady = true; render(); return; }
  me = u; loadError = null;
  try { await loadProgress(); } catch(e){ loadError = e; }
  authReady = true; render();
}
async function loadProgress(){
  const ref = FB.F.doc(FB.db, "users", me.uid), snap = await FB.F.getDoc(ref);
  if (snap.exists()){ docExists = true; const d = snap.data(); S = Object.assign(fresh(), d.data || {}); }
  else { docExists = false; S = fresh(); await saveNow(); }
}
function retryLoad(){ authReady = false; render(); onUser(FB.auth.currentUser); }

function summary(s){
  const passed = DAYS.filter(d => s.tests[d.day] && s.tests[d.day].passed).length;
  return { passedDays:passed, passedWords:passed * 10, xp:s.xp, streak:streakFrom(s.days), learnedDays:DAYS.filter(d => s.learned[d.day]).length };
}
let saveT = null;
function save(){ clearTimeout(saveT); saveT = setTimeout(saveNow, 500); }
async function saveNow(){
  clearTimeout(saveT);
  if (!me || !S || !FB) return;
  const ref = FB.F.doc(FB.db, "users", me.uid);
  const base = { name:dispName(), email:me.email, lastActive:FB.F.serverTimestamp(), summary:summary(S), data:S };
  try {
    if (!docExists){ await FB.F.setDoc(ref, { ...base, createdAt:FB.F.serverTimestamp() }); docExists = true; }
    else await FB.F.updateDoc(ref, base);
  } catch(e){ toast("Couldn't save your progress – check your connection."); }
}
document.addEventListener("visibilitychange", () => { if (document.hidden) saveNow(); });

async function logout(){ await saveNow(); try { await FB.A.signOut(FB.auth); } catch(e){} authMode = "login"; }
async function resendVerify(){
  try { await FB.A.sendEmailVerification(FB.auth.currentUser); toast("Verification email sent. Check your inbox and spam folder."); }
  catch(e){ toast(authMsg(e)); }
}
async function refreshVerified(){
  try { await FB.A.reload(FB.auth.currentUser); await FB.auth.currentUser.getIdToken(true); me = FB.auth.currentUser; render();
    if (!me.emailVerified) toast("Not verified yet. Open the link in the email first.");
    else if (ui.tab === "admin" && isAdminEmail() && !admin.rows) loadAdmin(); }
  catch(e){ toast(authMsg(e)); }
}
async function sendMyReset(){
  try { await FB.A.sendPasswordResetEmail(FB.auth, me.email); toast("Password reset email sent."); } catch(e){ toast(authMsg(e)); }
}
