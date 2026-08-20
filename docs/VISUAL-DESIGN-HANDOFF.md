# Nana visual design handoff

This document explains the visual system that is implemented in the Nana frontend. It is written for handover, jury explanation, and future developers. It documents the current app instead of proposing a redesign.

## Product visual direction

Nana is a child pain communication and caregiver handoff app. The interface is intentionally soft, bright, and simple because the product is used around children, but the assistant and history screens are written as decision support and handoff support, not diagnosis.

The visual identity is built from:

- a light blue app canvas
- coral red primary actions and brand face
- warm yellow secondary actions and information surfaces
- teal support colour for labels, outlines, body-map feedback, and success/support states
- large rounded cards, pill buttons, and a fixed bottom navigation
- a 3D body map as the main product signal

## File map

| file | visual responsibility |
| --- | --- |
| `src/styles.scss` | main design tokens, base layout, screen-level styling, component styling, route overrides, and most responsive fixes |
| `src/launchPolish.scss` | get-started, splash, onboarding, and launch-flow visual polish |
| `src/mobileNavFixes.scss` | mobile safe-area handling, fixed bottom nav behaviour, and mobile route-specific spacing |
| `src/sharedUi.js` | shared header, bottom navigation, menu, onboarding helper markup, labels, and route hooks |
| `src/assets.js` | central image/model asset references and asset loading helpers |
| `src/screens/ShowpainScreen.js` | primary interactive 3D body-map screen |
| `src/miniBody3d.js` | small passive 3D body previews used in summaries and history-style surfaces |
| `index.html` | app metadata, PWA links, font loading, and asset preloads |
| `public/manifest.webmanifest` | PWA name, theme colour, start URL, display mode, and app icons |

## Visual principles

1. Keep the child-facing steps direct and uncluttered.
2. Use the red action button only for primary actions or urgent emphasis.
3. Use yellow for supportive choices, secondary actions, and soft product guidance.
4. Use teal as a supporting brand accent rather than the dominant colour.
5. Keep Nana Assistant clearly non-diagnostic in copy and layout.
6. Keep the 3D body map visually central in the pain-report flow.
7. Keep bottom navigation reachable without covering the active content.
8. Respect small screens first, especially iPhone SE style heights.

## Typography

The intended production font system is Sora plus Nunito.

- Sora is used for compact UI labels, nav-centred labels, stronger controls, and several CTA-style surfaces.
- Nunito is used for main headings, child-friendly cards, form labels, pain choices, menu items, and body text.

The font loading is declared in `index.html`. The current Google Fonts request loads the weights actually used by the CSS: Nunito 400, 600, 700, 800, 900, 1000 and Sora 500, 600, 700, 800.

## Colour system

The core tokens are declared at the top of `src/styles.scss`.

- `--blue: #a8d7ff` - app background and main canvas
- `--black: #000000` - strongest text
- `--outline: #020202` - dark outline and text support
- `--yellow: #ffe98a` - secondary surfaces and soft prompts
- `--neutral: #f2e6d8` - warm light text/surface support
- `--red: #ff6f61` - brand face, primary emphasis, and alerts
- `--button-red: #ff776b` - primary button fill
- `--teal: #4fb4a6` - supportive labels, borders, and body-map feedback

## Layout system

The app is mobile-first. The base `.screen` container is constrained around the app-width experience and then protected with route-specific mobile rules. Mobile rules use dynamic viewport units and safe-area padding so Safari browser bars and PWA safe areas do not hide key content.

The bottom navigation is fixed and centered. It has route-specific spacing support so screen content can scroll behind it without important buttons becoming unreachable.

## 3D visual system

The main body map is implemented in `src/screens/ShowpainScreen.js`. It imports Three.js and GLTFLoader as npm modules and loads `/bodymap.glb`. The mini body preview is implemented in `src/miniBody3d.js` using the same npm Three.js package.

The visual behaviour is:

- transparent WebGL canvas over the app surface
- warm child-body material
- soft ambient, key, fill, and rim lighting
- requestAnimationFrame rotation and rendering
- raycaster-based click/tap selection on the main body map
- red pain markers for selected zones
- a non-3D fallback when WebGL/model loading fails
- reduced animation when `prefers-reduced-motion` is enabled

## Accessibility visual behaviour

The app includes visible loading and fallback states for the 3D body map. The body loading element uses `role="status"` and `aria-live="polite"` so loading is announced without being disruptive. Main controls are sized as large touch targets, especially in the child-facing flow.

Known accessibility intent:

- keep primary controls at roughly 44 px or larger where possible
- avoid colour-only state communication when text or selected styling is available
- provide disabled button styling and active states
- keep the assistant copy as support, not diagnosis
- respect reduced-motion settings in the 3D code

## Handover warning

`src/styles.scss` has grown into a large layered stylesheet with many route-specific overrides. It works, but the next cleanup should split it into smaller files by responsibility:

- tokens and base reset
- app shell and navigation
- onboarding and get-started
- child/profile screens
- pain-report flow
- history
- assistant
- settings and menu
- mobile safe-area overrides

That split should be done after visual acceptance, not during a deadline pass.
