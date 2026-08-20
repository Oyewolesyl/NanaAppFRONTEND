# Nana UI component reference

This document maps the main UI pieces to the files and classes a future developer should inspect first.

| component | files/classes | behaviour |
| --- | --- | --- |
| app shell | `src/styles.scss`, `.screen` | blue full-page app canvas, mobile-first vertical flow, route-aware scrolling |
| shared header | `src/sharedUi.js`, `.screen-header`, header logo/menu classes | consistent top logo and hamburger/menu access across internal routes |
| bottom navigation | `src/sharedUi.js`, `src/mobileNavFixes.scss`, `.bottom-nav`, `.bottom-nav-item` | fixed mobile nav with active/inactive states and safe-area support |
| get-started flow | `src/launchPolish.scss`, get-started route classes | launch card, text logo usage, splash/wink transition support, and CTA |
| onboarding hints | `src/sharedUi.js`, `src/styles.scss`, `.landing-hint-*` | guided overlay cards with skip/next actions and highlighted regions |
| children dashboard | `src/screens`, `.child-card-list`, `.child-card` | caregiver home with assistant card, child cards, open body map button, and add action |
| child card | `.child-card`, `.child-card-photo-wrap`, `.child-name`, `.child-open-map-btn` | centred child identity card with avatar, age, and body-map action |
| add child overlay | add-child screen classes, `.add-child-card`, `.age-wheel-shell`, `.save-child-button` | large modal-like card for image, name, age selection, and save |
| role selection | select-role route, role card classes | two large role cards and continue button, centred in the child-friendly flow |
| main body map | `src/screens/ShowpainScreen.js`, show-pain classes | interactive Three.js body model, zoom controls, loading status, fallback map |
| mini body preview | `src/miniBody3d.js`, `.mini-body-wrap` | small passive 3D report preview with pain markers |
| pain type cards | pain type screen classes, pain visual classes | selected pain feeling cards using larger visual metaphors and text labels |
| pain scale | `.pain-face-choice`, scale button classes | simple severity selection with disabled next state until a value is selected |
| pain timing | when screen classes | child-facing selection of when pain started |
| summary/review | `.summary-card`, confirmation classes | final report summary and assistant-support cards |
| history | history screen classes, `.history-card` | filters, search, stored report cards, and assistant entry points |
| assistant | assistant route classes | support chat/handoff UI, readiness copy, prompts, and non-diagnostic disclaimer |
| settings | `.settings-field`, `.settings-link`, settings route overrides | caregiver profile fields, management links, and spacing adjustments |
| menu drawer | `.nana-menu-panel`, `.nana-menu-context` | slide-out navigation and current child context |
| loading assets | `src/assets.js`, `.asset-loading`, `.asset-error` | skeleton/opacity treatment for assets that may take time |

## Notes for future developers

- Use `src/sharedUi.js` before duplicating header, nav, menu, or onboarding markup.
- Use `src/assets.js` before hardcoding new image paths.
- Keep body-map copy and assistant copy non-diagnostic.
- Check iPhone SE-sized screens before shipping changes to bottom nav, add child overlay, history, assistant, and body-map flow.
- Do not add another Three.js loading method. Use npm imports.
- Avoid adding another font family. The app font system is Sora plus Nunito.
