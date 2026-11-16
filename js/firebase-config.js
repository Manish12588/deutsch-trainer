/* ===================================================================
   2. FIREBASE (login + saved progress)
   =================================================================== */
const ADMIN_EMAIL = "manish.kumar.sdet@gmail.com";
const FIREBASE_VERSION = "10.14.1";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAng33-EzSOC_K74BX0YEwUpo9aC2szRHM",
  authDomain: "learn-deutsch-with-manish.firebaseapp.com",
  projectId: "learn-deutsch-with-manish",
  storageBucket: "learn-deutsch-with-manish.firebasestorage.app",
  messagingSenderId: "271381410500",
  appId: "1:271381410500:web:54b601fe317dc8b4310f91"
};
let FB = null;            // {auth, db, A (auth module), F (firestore module)}
let bootError = null, loadError = null, authReady = false;

async function initFirebase(){
  const base = "https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/";
  const [appM, A, F] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")]);
  const app = appM.initializeApp(FIREBASE_CONFIG);
  FB = { auth: A.getAuth(app), db: F.getFirestore(app), A, F };
}
