# Nana final technical handover

## one product story

Nana is a child pain communication and handoff product. The app helps a caregiver create a child profile, record where pain is on a 3d body map, capture pain type, start context, score, notes, and then turn the report into a readable handoff. Nana Assistant supports communication. It does not diagnose, prescribe, or replace medical care.

## frontend architecture

- `src/main.js` controls navigation and screen mounting.
- `src/appState.js` is the frontend state source for children, active child, caregiver profile, draft report, and saved reports.
- `src/backendApi.js` is the only browser API client. It reads `VITE_API_URL`, attaches the stored bearer token, and sends children/pain reports to the backend.
- `src/screens/ShowpainScreen.js` is the full 3d body-map screen.
- `src/miniBody3d.js` renders small non-interactive body previews on summary/review screens.
- `src/bodyMap/bodyZones.js` is the shared body-zone vocabulary used by the 3d picker, the mini body, and backend sync.
- `src/aiCareAssistant.js` contains the deterministic care-support logic used to summarize reports and produce handoff text.

## three.js architecture

Three.js is installed through npm and declared in `package.json`. The app does not rely on a separate CDN copy of Three.js.

The full body map dynamically imports `three` and `three/examples/jsm/loaders/GLTFLoader.js`. That keeps the initial app lighter and loads the 3d engine only when the body-map screen is opened. The full screen creates a renderer, scene, camera, lights, loads `/bodymap.glb`, uses raycasting for tap selection, and places badges using the shared local-space zone definitions.

The mini body imports the same npm Three.js dependency and GLTFLoader. It uses the same `bodyZones.js` marker vocabulary and respects `prefers-reduced-motion` by stopping passive rotation when the user requests reduced motion.

## backend and supabase architecture

The backend is an Express API deployed on Render. Supabase stays server-side.

- `src/index.js` configures CORS, JSON parsing, health check, and route mounting.
- `src/lib/supabase.js` creates the Supabase server client with `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` and disables persisted sessions.
- `src/routes/auth.js` handles account register/login/logout/profile.
- `src/routes/children.js` handles child profile CRUD for signed-in users.
- `src/routes/painLogs.js` handles pain report persistence and child ownership checks.
- `src/routes/assistant.js` exposes Nana Assistant support responses.
- `src/routes/admin.js` powers the private backend manager using `ADMIN_MANAGER_TOKEN`.

## persistence flow

1. The caregiver completes a report in the frontend.
2. `appState.js` saves it locally first so the app remains responsive.
3. If the user is signed in, `backendApi.js` posts the child/report to the backend with a bearer token.
4. The backend validates ownership and fields.
5. Supabase stores the profile/report.
6. The backend manager reads those same Supabase records through admin endpoints.

## safety position

Nana Assistant is decision support for communication. It may say a report needs attention, suggest checking again, and prepare a handoff note. It must not claim diagnosis, certainty, treatment, or medical replacement. Emergency wording should direct caregivers to local medical help.

## environment variables

Frontend: `VITE_API_URL=https://nanaappbackend.onrender.com`

Backend: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `MANAGER_URL`, `ADMIN_MANAGER_TOKEN`

Backend manager: `MANAGER_URL=https://nanaappbackend.onrender.com`

The backend accepts comma-separated `FRONTEND_URL` and `MANAGER_URL` values, which helps when production and preview URLs must both be allowed.

## what still needs human evidence

- Real user-test reports and observations.
- Final Figma URL and prototype access.
- Final PDF exports for business report, proposal paper, marketing plan, and jury presentation.
- Sprint board URL with July-August sprints and retrospectives.


## performance correction

The January/June feedback said the dependency setup and 3D loading needed clearer explanation. The current frontend fixes this by keeping Three.js in `package.json` and using npm imports rather than a CDN script. The full 3D body map is dynamically imported only when the body-map screen is opened, which keeps the first app load lighter. The when-start illustrations were also moved out of inline JavaScript and into `public/when-start/`, so the main bundle no longer carries those large base64 strings.
