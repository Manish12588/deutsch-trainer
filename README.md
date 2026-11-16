# Deutsch A1 · 30-Day Vocabulary Trainer

A free, static web app to learn German A1 vocabulary: 5 verbs + 5 nouns per day for 30 days.
Each day's test must be passed (8/10) before the next day unlocks. Every learner has their own
account and progress; only the admin can see everyone's progress.

Created by **Manish Kumar** · [LinkedIn](https://www.linkedin.com/in/manish-kumar-a9965227) · [GitHub](https://github.com/Manish12588)

## Project structure

```
index.html              page shell, loads the files below in order
css/style.css           themes (light/dark), layout, components
js/words.js             the 30 days of words (edit here to change content)
js/firebase-config.js   Firebase keys + admin email + Firebase loader
js/state.js             app state, helpers, quiz logic, XP/streak
js/auth.js              login, register, password reset, saving progress
js/views.js             all screens (Learn, Test, Progress, Admin)
js/main.js              start-up
firestore.rules         Firestore security rules (paste in Firebase console)
```

## Run locally

Open `index.html` in a browser, or serve the folder: `python3 -m http.server 8000`.

## Deploy (GitHub Pages)

Repo → Settings → Pages → Deploy from a branch → `main` / root.
In Firebase → Authentication → Settings → Authorized domains, add your Pages domain
(e.g. `manish12588.github.io`, and later your custom domain).

## Firebase setup

1. Authentication → Sign-in method → Email/Password (enable).
2. Firestore Database → Rules → paste `firestore.rules` → Publish.
3. Put your web-app config in `js/firebase-config.js`. (These keys are public by design; the
   security rules are what protect the data.)

## Admin

The admin email is set in `js/firebase-config.js` (`ADMIN_EMAIL`) and in `firestore.rules`.
The admin must verify that email address to see the Admin tab.
