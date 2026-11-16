/* ===================================================================
   6. START
   =================================================================== */
render();
initFirebase().then(() => FB.A.onAuthStateChanged(FB.auth, onUser)).catch(e => { bootError = e; render(); });
