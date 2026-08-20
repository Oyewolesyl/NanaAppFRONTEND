# Feature to file map

## onboarding and auth

- welcome/get started: `src/screens/getStartedScreen.js`
- signup/login: `src/screens/authScreen.js`
- role selection: `src/screens/selectRoleScreen.js`

## child management

- child cards: `src/sharedUi.js`
- add child overlay: `src/components/addChildOverlay.js` and `src/sharedUi.js`
- manage children screen: `src/screens/manageChildrenScreen.js`
- child persistence: `src/appState.js`, `src/backendApi.js`, backend `src/routes/children.js`

## pain report flow

- body map: `src/screens/ShowpainScreen.js`
- shared body zones: `src/bodyMap/bodyZones.js`
- pain type: `src/screens/Paintypescreen.js`
- start time: `src/screens/WhenDidItStartScreen.js`
- pain score: `src/screens/Painscalescreen.js`
- summary/submit: `src/screens/summaryScreen.js`
- confirmation: `src/screens/confirmationScreen.js`

## 3D implementation

- full body map: `src/screens/ShowpainScreen.js`
- mini review body: `src/miniBody3d.js`
- model file: `public/bodymap.glb`
- npm dependency: `three` in `package.json`

## assistant

- deterministic insight engine: `src/aiCareAssistant.js`
- chat-style assistant screen: `src/screens/assistantScreen.js`
- backend assistant endpoint: backend `src/routes/assistant.js`

## history

- history screen: `src/screens/historyScreen.js`
- stored reports: `src/appState.js`
- backend persistence: backend `src/routes/painLogs.js`

## navigation and layout

- route mounting: `src/main.js`
- shared header/menu/nav: `src/sharedUi.js`
- main styling: `src/styles.scss`
- mobile nav fixes: `src/mobileNavFixes.scss`
