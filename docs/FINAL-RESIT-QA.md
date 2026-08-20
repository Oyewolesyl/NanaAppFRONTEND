# Final resit QA evidence

## repository audit

Frontend:

- branch: main
- verified head before this pass: 1d4d281
- important preserved commits: f1beb64, 754e258, 2309f8e
- status before this pass: clean and synced with origin

Backend:

- branch: main
- verified head before this pass: 06312cb
- important preserved commits: 43344d2 and later admin/backend-manager fixes
- status before this pass: synced with origin, with untracked `001_initial_schema.sql`

Marketing:

- verified head: b2f6ace
- note: repository is detached at the shortened Nana marketing commit.
- scope: not edited during this frontend/backend final cleanup pass.

## verified technical items

- Three.js is loaded from npm, not from a CDN.
- The full body map imports `three` and `GLTFLoader` dynamically.
- The mini body map imports the same npm `three` dependency.
- `src/bodyMap/bodyZones.js` is the shared body-zone source of truth.
- The body-map fallback exists for GLB load failure and now also covers engine/WebGL startup failure.
- Mini body rotation respects `prefers-reduced-motion`.
- Full body pulse animation now respects `prefers-reduced-motion`.
- The when-start illustrations are standalone public assets, not inline JavaScript base64.
- The frontend has `.env.example`; runtime secrets are not committed.
- The backend has `.env.example`; Supabase service role stays server-side.
- CORS allows frontend and manager origins, including the production manager URL.
- Assistant copy is framed as decision support and handoff support, not diagnosis.
- User-facing assistant disclaimers are present near assistant output.
- Child delete exists in `manageChildrenScreen.js` through `removeChild()`.
- Handoff copy/export exists through the copy-to-clipboard flow.

## build checks

Run before submission:

```bash
npm ci
npm run build
```

Backend syntax checks:

```bash
node --check src/index.js
node --check src/routes/admin.js
node --check src/routes/assistant.js
node --check src/routes/painLogs.js
```

## known non-code evidence still needed

- actual user-test Notion page link
- performed test reports
- Figma Slides findings deck
- Figma prototype URL with access
- sprint board URL with July-August sprints and retrospectives
- final PDFs for business report, marketing plan, product proposal, and pitch

## untracked backend schema file

`001_initial_schema.sql` should be reviewed. If it is the real production schema, commit it as database documentation or migration evidence. If it is a temporary export, move it outside the repo or add a clear ignore rule. Do not delete it without checking its contents.
