# Nana architecture

## product boundary

Nana is a child pain communication and handoff app. It helps a caregiver collect pain information and turn it into a readable summary. It is not a diagnostic medical device and it does not replace medical help.

## system flow

```text
user
  -> Vite frontend
  -> src/backendApi.js
  -> Express backend on Render
  -> Supabase database
  -> backend manager for private admin viewing
```

## frontend

- `src/main.js` mounts the app, handles hash routing, route loading states, splash timing, install prompt behavior, and global cleanup.
- `src/appState.js` holds the active caregiver, children, pain draft, saved pain logs, and sync helpers.
- `src/backendApi.js` is the only browser-side backend client.
- `src/sharedUi.js` owns shared header, bottom navigation, child cards, add-child overlay wiring, child context, and progress controls.
- `src/bodyMap/bodyZones.js` is the single source of truth for body-zone names, full 3D local bounds, mini preview marker points, and backend zone normalization.
- `src/screens/ShowpainScreen.js` renders the full interactive 3D body map.
- `src/miniBody3d.js` renders small passive body previews for review/summary screens.
- `src/aiCareAssistant.js` creates deterministic care-support summaries and handoff notes.
- `src/screens/assistantScreen.js` presents the assistant as a chat-style support screen.

## backend

- `src/index.js` creates the Express app, configures CORS, exposes `/health`, and mounts routes.
- `src/lib/supabase.js` creates the server-only Supabase client with the service role key and `persistSession: false`.
- `src/routes/auth.js` handles profile registration and login.
- `src/routes/children.js` handles child profile CRUD for signed-in users.
- `src/routes/painLogs.js` handles pain report persistence.
- `src/routes/assistant.js` exposes Nana Assistant decision-support responses.
- `src/routes/admin.js` powers the private backend manager.

## deployment

- frontend: Vercel
- backend: Render
- database: Supabase
- backend manager: Vercel

## environment variables

Frontend:

```text
VITE_API_URL=https://nanaappbackend.onrender.com
```

Backend:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
FRONTEND_URL
MANAGER_URL
ADMIN_MANAGER_TOKEN
```

Backend manager:

```text
MANAGER_URL=https://nanaappbackend.onrender.com
```
