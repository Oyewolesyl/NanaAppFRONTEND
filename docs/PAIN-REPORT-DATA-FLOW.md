# Pain report data flow

## report creation

1. The caregiver selects or creates a child profile.
2. The body-map screen stores selected zones in `appState.painDraft.zones`.
3. The pain-type screen stores `painType`.
4. The start-time screen stores `started`.
5. The pain-scale screen stores `intensity`.
6. The summary screen calls `savePainLog()`.

## local state

`src/appState.js` saves the report locally first. This keeps the mobile experience usable even if a phone has slow data.

The report contains the functional fields used by the app:

- child id
- child name
- selected body zones
- pain type
- start context
- intensity score
- optional caregiver note
- created timestamp
- assistant handoff fields derived from the report

## backend sync

When a user is signed in, `syncPainLogToBackend()` maps the frontend report to the backend payload and calls `createBackendPainLog()` in `src/backendApi.js`.

The browser sends:

```text
Authorization: Bearer <access token>
```

The backend route validates the user, checks child ownership, normalizes the incoming fields, and stores the report in Supabase.

## history and assistant

- `src/screens/historyScreen.js` reads saved reports from `appState.painLogs` and presents filters/search.
- `src/screens/assistantScreen.js` uses the latest selected report to answer caregiver questions.
- `src/aiCareAssistant.js` creates handoff text and safety wording from the report fields.

## manager

The backend manager reads the same Supabase records through protected admin endpoints. It is for the project owners, not public users.
