# Nana design tokens

This file documents the design tokens currently used by the Nana frontend.

## Source of truth

The active code source is `src/styles.scss`. Route and mobile refinements also exist in `src/launchPolish.scss` and `src/mobileNavFixes.scss`.

## Colours

| token | value | use |
| --- | --- | --- |
| `--blue` | `#a8d7ff` | app canvas, full-screen background |
| `--black` | `#000000` | primary readable text |
| `--outline` | `#020202` | outlines, strong text, card strokes |
| `--yellow` | `#ffe98a` | secondary buttons, soft cards, prompts |
| `--neutral` | `#f2e6d8` | warm light support colour |
| `--red` | `#ff6f61` | brand face, headings, selected states, urgency |
| `--button-red` | `#ff776b` | primary CTA fill |
| `--teal` | `#4fb4a6` | support labels, focus accents, body-map feedback |

## Typography

| role | family | common weights | notes |
| --- | --- | --- | --- |
| headings | Nunito | 800, 900, 1000 | child-friendly, rounded, high personality |
| body text | Nunito | 400, 600, 700, 800 | readable paragraphs and labels |
| compact controls | Sora | 500, 600, 700, 800 | stronger button/nav utility tone |
| fallback | Arial, sans-serif | browser fallback | used when web fonts are unavailable |

The font request is in `index.html`:

`Nunito:wght@400;600;700;800;900;1000`
`Sora:wght@500;600;700;800`

## Spacing scale

The app mostly uses this practical scale:

| size | use |
| --- | --- |
| 4-8 px | compact gaps, icon/text spacing |
| 10-14 px | card inner gaps, small pills |
| 16 px | default horizontal card padding |
| 18-24 px | screen section gaps, card padding |
| 28-34 px | larger page spacing and route-specific breathing room |
| 40-48 px | major stack gaps, safe touch spacing |
| 56-62 px | major button height and large controls |
| 92-148 px | bottom navigation and safe-area content buffers |

## Radius scale

| radius | use |
| --- | --- |
| 12 px | compact controls, menu buttons, age wheel |
| 14 px | child cards, inputs, settings links |
| 18 px | history, summary, and management cards |
| 22 px | pain choice cards |
| 24 px | mini 3D body preview containers |
| 30 px and above | large page cards and launch surfaces |
| 999 px | circular avatars, pills, and round action targets |

## Size tokens and component dimensions

| component | implemented size pattern |
| --- | --- |
| app screen | max-width around 390 px in the classic app frame |
| bottom nav | fixed, centered, safe-area aware, route-specific height |
| menu/back touch target | around 42 px minimum |
| main buttons | 55-56 px high |
| input fields | at least 52 px high |
| child avatar | 110 x 110 px base, circular border |
| compact body preview | 124 x 156 px |
| pain scale choices | large card targets in a 2 x 3 grid |
| add child card | max-width `calc(100vw - 24px)` with tall card layout |

## Breakpoints

The CSS contains targeted mobile breakpoints around:

- 430 px
- 380 px
- 375 px
- 370 px
- 360 px
- 340 px

These exist because the app was audited heavily against small iPhone-sized screens.

## Motion tokens

Motion is intentionally light:

- button active states use small scale/opacity changes
- 3D body rotation uses requestAnimationFrame
- 3D reduced-motion mode disables continuous motion or keeps it minimal
- loading states avoid replacing the whole app with unlabelled empty screens

## PWA tokens

`public/manifest.webmanifest` defines:

- name: Nana the App
- short_name: Nana
- start_url: /#get-started
- display: standalone
- background_color: #a8d7ff
- theme_color: #ff6f61
- icons: /pwa-icon-192.png and /pwa-icon-512.png
