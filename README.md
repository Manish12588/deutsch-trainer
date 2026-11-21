# Deutsch A1 · 30-Day Vocabulary Trainer

🔗 **Live app: https://deutsch.mkumardevops.in**

A free web app to learn German A1 vocabulary: **5 verbs + 5 nouns per day for 30 days** (150 verbs, 150 nouns).
Each day ends with a test, and you need **8/10** to unlock the next day. Every learner has a personal
account and progress. Only the admin can see everyone's progress.

Created by **Manish Kumar** · [LinkedIn](https://www.linkedin.com/in/manish-kumar-a9965227) · [GitHub](https://github.com/Manish12588)

---

## Features

- **30 themed days** (Basics, Daily routine, Food, Transport, Work, Health, Travel, Goals, …)
- **Learn** – word list with examples, flip flashcards, German pronunciation (browser text-to-speech)
- **Test** – one question per word: nouns ask for the article (der/die/das), verbs ask for the
  ich/du/er form. Pass mark 80 %. Day N unlocks only after Day N−1 is passed
- **Practice** – meanings, plurals and a mixed review of older words plus your mistakes
- **Grammar** – possessive articles (mein, dein, sein…) with 350 practice sentences in two sets: *Owner given* (200) and *In context* (150, e.g. "Peter hat einen Hund. Das ist ___ Hund."), or both mixed. Choose 10 / 15 / 20 random questions per test, unseen sentences first, explanation for every wrong answer
- **Nominative vs Accusative** – der → den, ein → einen, with a "How it works" card and 150 practice sentences (definite 90, indefinite 60, or mixed)
- **Progress** – XP, levels, streak, badges, per-day results, export/import of your progress
- **Accounts** – email + password, email verification, password reset by email
- **Admin view** – registered users and everyone's progress (admin only), CSV export
- **Light / dark theme** toggle (remembers your choice)
- Works on phone and desktop. No build step, no framework

## How it works

```
Browser (static files on GitHub Pages)
   │  Firebase JS SDK
   ├── Firebase Authentication  → email/password login, verification, reset mail
   └── Cloud Firestore          → users/{uid}: name, email, progress, summary
```

- The site is plain HTML/CSS/JS served by GitHub Pages.
- Each learner can read and write **only their own** document `users/{uid}`.
- The admin (verified email) can read all user documents. This is enforced by
  `firestore.rules` on Firebase's servers, not by the page.

## Project structure

```
index.html              page shell, loads the files below in order
css/style.css           themes (light/dark), layout, components
js/words.js             the 30 days of words (edit here to change content)
js/possessives.js       350 practice sentences for the Grammar tab (POSS 200 + POSS_CTX 150)
js/cases.js             150 practice sentences: nominative vs accusative (CASE_DEF 90 + CASE_IND 60)
js/firebase-config.js   Firebase keys, admin email, Firebase loader
js/state.js             app state, helpers, quiz logic, XP/streak
js/auth.js              login, register, password reset, saving progress
js/views.js             all screens (Learn, Test, Progress, Admin)
js/main.js              start-up
firestore.rules         Firestore security rules (paste in Firebase console)
CNAME                   custom domain for GitHub Pages (created by GitHub)
.nojekyll               tells GitHub Pages to serve files as they are
.gitignore              files kept out of the repo
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Registration needs `localhost` to be an authorized domain in Firebase
(it is by default).

## Setup from scratch

### 1. Firebase (free Spark plan)

1. Create a project at https://console.firebase.google.com and add a **Web app**.
2. **Authentication → Sign-in method** → enable **Email/Password** (leave "Email link" off).
3. **Firestore Database** → create a database in production mode.
4. **Firestore → Rules** → paste the contents of `firestore.rules` → **Publish**.
5. **Authentication → Settings → Authorized domains** → add your site domains
   (`manish12588.github.io` and `deutsch.mkumardevops.in`).
6. Copy the web-app config into `js/firebase-config.js` (`FIREBASE_CONFIG`).
   These keys are public by design. The security rules protect the data.

### 2. Admin

Set the admin email in **two** places:

- `js/firebase-config.js` → `ADMIN_EMAIL`
- `firestore.rules` → inside `isAdmin()`

Register with that email and **verify it**. The **Admin** tab then shows all users.

### 3. GitHub Pages

Repo → **Settings → Pages → Deploy from a branch → `main` / root**.

### 4. Custom domain (GoDaddy)

1. GoDaddy → Domain → DNS → add a record: type `CNAME`, name `deutsch`, value `manish12588.github.io`.
2. Repo → Settings → Pages → Custom domain → `deutsch.mkumardevops.in` → Save.
3. When the DNS check passes, tick **Enforce HTTPS**.
4. Add the domain to Firebase **Authorized domains** (step 1.5 above).

## Changing the words

Edit `js/words.js`. Each day looks like this:

```js
{ day:1, theme:"Basics",
  v:[ [infinitive, english, ich, du, er, example], ... 5 verbs ],
  n:[ [article, word, plural, english, example], ... 5 nouns ] }
```

Keep exactly 5 verbs and 5 nouns per day, because the test and the progress numbers assume 10 words.

## Privacy

The app stores name, email and learning progress in Firebase. The admin can see them, and the sign-up
page says so. Learners can delete their own account and data from within the app.

## Troubleshooting

| Message | Meaning / fix |
| --- | --- |
| `auth/unauthorized-domain` | Add the site's domain to Firebase → Authentication → Authorized domains |
| `auth/operation-not-allowed` | Enable Email/Password in Firebase → Authentication → Sign-in method |
| `permission-denied` | Publish the latest `firestore.rules`. Admin: verify your email, then press "I've verified" |
| `auth/invalid-credential` | Wrong email or password (or the account doesn't exist) |
| `auth/too-many-requests` | Wait a few minutes and try again |
| Blank page / `DAYS is not defined` | The `js/` files are missing or in the wrong folder |

## Tech

Plain HTML, CSS and JavaScript (no build step) · Firebase Authentication and Cloud Firestore (v10 modular SDK
loaded from Google's CDN) · GitHub Pages · Web Speech API for pronunciation.