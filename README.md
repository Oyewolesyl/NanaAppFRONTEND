# Nana App — Frontend

Mobile-first health tracking application for parents and caregivers. Allows a parent to register their children and use an interactive body map to log where a child is experiencing pain or discomfort.

Part of the Dokita Health product family.

---

## Tech Stack

| | |
|---|---|
| Build tool | Vite 7 |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Plain CSS (single file — SCSS migration pending) |
| Fonts | Nunito 700, Sora 600 via Google Fonts |
| Design source | Figma |

No frameworks. No TypeScript. No Tailwind.

---

## Getting Started

**Prerequisites:** Node.js 18 or higher — download from [nodejs.org](https://nodejs.org)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

```bash
npm run dev       # Start local development server
npm run build     # Build for production (output to /dist)
npm run preview   # Preview the production build locally
```

---

## Project Structure

```
nana-app-front-end/
├── index.html
├── package.json
├── public/
│   ├── body-front.png    ← required, see note below
│   └── body-back.png     ← required, see note below
└── src/
    ├── main.js                              Hash router + screen dispatcher
    ├── styles.css                           All styles
    ├── assets.js                            Centralised asset URL references
    ├── components/
    │   ├── statusBar.js                     Reusable iPhone status bar
    │   └── addChildOverlay.js               Add child modal with age wheel
    └── screens/
        ├── getStartedScreen.js
        ├── selectRoleScreen.js
        ├── homepageNewUserScreen.js
        ├── childAddedScreen.js
        ├── secondChildAddedScreen.js
        └── ShowpainScreen.js
```

---

## Screens

| Screen | Route | Status |
|---|---|---|
| Get Started | `#get-started` | Complete |
| Select Role | `#select-role` | Complete |
| Homepage — New User | `#homepage-newuser` | Complete |
| Child Added (1 child) | `#child-added` | Complete |
| Two Children Added | `#second-child-added` | Complete |
| Body Map / Show Pain | `#body-map` | Complete (see known issues) |
| Biometric Input | `#biometrics` | Not built |
| Pain History | `#activity` | Not built |
| Settings | `#settings` | Not built |
| Doctor Flow | `#doctor-home` | Not built |

You can navigate directly to any screen:

```
http://localhost:5173/#get-started
http://localhost:5173/#select-role
http://localhost:5173/#homepage-newuser
http://localhost:5173/#child-added
http://localhost:5173/#second-child-added
http://localhost:5173/#body-map
```

---

## Routing

Hash-based router with no external library. Defined in `src/main.js`.

The router tracks `previousHash` so the back button on the body map screen returns to the correct child screen depending on where you came from.

Navigation flow:

```
#get-started → #select-role → #homepage-newuser → #child-added → #second-child-added → #body-map
```

---

## Components

### Status Bar
Renders the iPhone status UI (notch, 9:41 time, battery and signal icons). Purely decorative. Used on every screen. `aria-hidden="true"`.

### Add Child Overlay
Modal that opens over the current screen. Contains an image upload card, a child name text input, and a scrollable age wheel (ages 1–18) with scroll-snap behaviour. The selected age is highlighted. The overlay is shown and hidden using the HTML `hidden` attribute.

---

## Body Map

The body map screen (`ShowpainScreen.js`) contains a fully geometric SVG body illustration with 28 tappable zones across front and back views. No freehand paths — all shapes are `rect` and `ellipse` elements.

Front zones: head, neck, chest, abdomen, hips, left/right arms, left/right forearms, left/right hands, left/right thighs, left/right shins, left/right feet.

Back zones: back of head, neck, upper back, lower back, glutes, left/right shoulders, left/right forearms, left/right hands, left/right hamstrings, left/right calves, left/right heels.

Tapping a zone cycles through 5 colour states. A summary list below the body updates in real time with colour-coded badges. Front/back toggle and zoom controls (+/−) are included.

---

## Design Tokens

Defined as CSS custom properties in `src/styles.css`:

```css
--blue:       #a8d7ff   /* App background */
--black:      #000000
--outline:    #020202   /* Borders and strokes */
--yellow:     #ffe98a   /* Cards, buttons, nav bar */
--neutral:    #f2e6d8   /* Header background */
--red:        #ff6f61   /* Headings and primary text */
--button-red: #ff776b   /* CTA button fill */
--teal:       #4fb4a6   /* Accents, body map, toggle */
```

---

## Assets

All asset references are centralised in `src/assets.js`. Assets are served from Figma MCP endpoints and require an active Figma MCP session to load during development.

**Two assets are local files that must exist in `/public/` before the body map renders correctly:**

```
/public/body-front.png
/public/body-back.png
```

These must be exported manually from the Figma file. File ID: `12pSgR1EI0bCNS5rDFHqkR`, node `32:84`. Export as PNG and place in the `/public/` folder.

---

## Known Issues

- `body-front.png` and `body-back.png` are missing from `/public/` — body map background images will not render until they are exported from Figma and added
- Child card data is hardcoded (Sunny, 4 years / Leny, 8 years) — the Add Child overlay captures input but does not yet save or display it
- The Continue button on the body map screen has no route or action wired
- All Figma MCP asset URLs require an active Figma MCP session — not suitable for production deployment as-is
- CSS has not yet been migrated to SCSS (teacher requirement pending)
- No backend or database connected

---

## Pending Work

- SCSS migration: split `styles.css` into `_variables`, `_reset`, `_base`, `_screens`, `_nav`, `_overlay`, `_responsive` partials
- Wire Add Child overlay to save entered data and display on child card
- Wire body map Continue button to a submission action
- Connect Supabase for real data persistence (children, pain logs)
- Build remaining screens: biometrics, pain history, settings, doctor flow
- Replace Figma MCP asset URLs with locally hosted files
- Deploy to Vercel

---

## Author

Oyewole Sylvanna