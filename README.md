# Nana App — Frontend

Nana is a mobile-first child pain communication app for parents, caregivers, and health professionals. It helps children communicate where and when they hurt through a playful 3D body map, child profiles, pain intensity tracking, and a structured pain history.

## Project Information

| Item | Details |
|---|---|
| Product | Nana |
| Purpose | Help children communicate pain clearly and help caregivers track pain over time |
| Target users | Children, parents, caregivers, teachers, and health professionals |
| Frontend stack | Vite, Vanilla JavaScript, SCSS/CSS, Three.js |
| Deployment | Vercel |
| Backend | Express + Supabase |

## Live URLs

| Environment | URL |
|---|---|
| Production | https://nana-app-frontend.vercel.app |
| Staging | https://nana-app-frontend-i28e.vercel.app |
| Backend API | https://nanaappbackend.onrender.com |

## Git URLs

| Repository | URL |
|---|---|
| Frontend | https://github.com/Oyewolesyl/NanaAppFRONTEND.git |
| Backend | PASTE_BACKEND_GIT_URL_HERE |

## Main Features

- Add, edit, and delete child profiles
- Child profile image support
- Interactive 3D body map using Three.js
- Rotate and zoom body map
- Limb/body zone recognition
- Pain type selection
- Pain index / pain scale
- Pain start-time selection
- Optional notes
- Pain summary
- Pain history grouped by Today, This Week, and Earlier
- Mobile-first responsive UI for different mobile device sizes
- Skip/testing flow so the app can be tested without requiring authentication

## Setup

### Requirements

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment Variables

Create `.env.local` in the frontend root if needed:

```env
VITE_API_URL=https://nanaappbackend.onrender.com
```

## Project Structure

```text
nana-app-front-end/
├── index.html
├── package.json
├── public/
│   ├── bodymap.glb
│   ├── ani1.svg
│   ├── ani2.svg
│   └── ani3.svg
└── src/
    ├── appState.js
    ├── assets.js
    ├── main.js
    ├── miniBody3d.js
    ├── styles.scss
    ├── mobileNavFixes.scss
    ├── sharedUi.js
    ├── components/
    │   ├── addChildOverlay.js
    │   └── statusBar.js
    └── screens/
        ├── authScreen.js
        ├── getStartedScreen.js
        ├── homepageNewUserScreen.js
        ├── childAddedScreen.js
        ├── manageChildrenScreen.js
        ├── ShowpainScreen.js
        ├── Paintypescreen.js
        ├── WhenDidItStartScreen.js
        ├── Painscalescreen.js
        ├── summaryScreen.js
        ├── confirmationScreen.js
        ├── historyScreen.js
        └── settingsScreen.js
```

## Submission Checks

Before submitting:

```bash
git status
npm install
npm run build
```

Make sure:

- `main`, `staging`, and `develop` are synced.
- All final work is committed before the deadline.
- Production and staging URLs are live.
- Frontend README includes project info, setup, staging URL, and production URL.
