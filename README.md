# Nana App â€” Frontend

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
| Backend | https://github.com/Oyewolesyl/NanaAppBACKEND.git |

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
- Nana AI care insight with urgency cues, caregiver next steps, and a doctor-ready handoff note
- Pain history grouped by Today, This Week, and Earlier
- Nana AI history summary for recent report attention and high-pain counts
- Mobile-first responsive UI for different mobile device sizes
- Skip/testing flow so the app can be tested without requiring authentication

## Nana AI Feature

Nana AI is an explainable care-support feature added to the pain reporting flow. After a report is saved, the app reviews the pain score, selected body areas, start time, pain type, and caregiver note. It then creates:

- an attention level such as Low urgency, Keep watching, or High attention
- practical next steps for the caregiver
- a doctor-ready handoff note that can be shared during a medical conversation
- a history summary that highlights recent reports and high-pain counts

The feature is intentionally designed as decision support, not diagnosis. It keeps the app safe for a child-care context while still showing how AI can add value to Nana's core function.

## Technical Handover Notes

### Three.js body map

The full body-map screen uses `src/screens/ShowpainScreen.js`. That file dynamically imports `three` and `three/examples/jsm/loaders/GLTFLoader.js`, loads `/bodymap.glb`, creates the scene/camera/lights, and uses raycasting to convert taps on the 3D body into named pain zones.

The small review/summary body previews use `src/miniBody3d.js`. This now uses the same npm Three.js dependency and GLTFLoader instead of loading Three.js from a CDN. That keeps the project dependency story consistent for handover and for the technical interview.

### Data flow

The app keeps local UI state in `src/appState.js` so screens update instantly. When a user is signed in, `src/backendApi.js` mirrors child profiles and pain reports to the Express/Supabase backend using the user's bearer token.

### Safe AI positioning

Nana Assistant is framed as care-support and handoff generation. It summarizes a pain report, highlights what to watch, and prepares caregiver/professional wording. It does not diagnose, prescribe, or replace medical help.

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

Copy `.env.example` to `.env.local` for local development if needed:

```env
VITE_API_URL=https://nanaappbackend.onrender.com
```

## Project Structure

```text
nana-app-front-end/
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ bodymap.glb
â”‚   â”œâ”€â”€ ani1.svg
â”‚   â”œâ”€â”€ ani2.svg
â”‚   â””â”€â”€ ani3.svg
â””â”€â”€ src/
    â”œâ”€â”€ appState.js
    â”œâ”€â”€ assets.js
    â”œâ”€â”€ main.js
    â”œâ”€â”€ miniBody3d.js
    â”œâ”€â”€ styles.scss
    â”œâ”€â”€ mobileNavFixes.scss
    â”œâ”€â”€ sharedUi.js
    â”œâ”€â”€ components/
    â”‚   â”œâ”€â”€ addChildOverlay.js
    â”‚   â””â”€â”€ statusBar.js
    â””â”€â”€ screens/
        â”œâ”€â”€ authScreen.js
        â”œâ”€â”€ getStartedScreen.js
        â”œâ”€â”€ homepageNewUserScreen.js
        â”œâ”€â”€ childAddedScreen.js
        â”œâ”€â”€ manageChildrenScreen.js
        â”œâ”€â”€ ShowpainScreen.js
        â”œâ”€â”€ Paintypescreen.js
        â”œâ”€â”€ WhenDidItStartScreen.js
        â”œâ”€â”€ Painscalescreen.js
        â”œâ”€â”€ summaryScreen.js
        â”œâ”€â”€ confirmationScreen.js
        â”œâ”€â”€ historyScreen.js
        â””â”€â”€ settingsScreen.js
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
