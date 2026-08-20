# Nana visual design oral guide

Use this as a spoken explanation for the visual design and UI implementation.

## 1. What is the visual identity?

Nana uses a soft child-friendly visual identity: light blue as the app canvas, coral red as the brand and primary action colour, yellow for supportive surfaces, and teal for secondary guidance and body-map feedback. The goal is to feel approachable for children and caregivers while still being clear enough for health-related handoff.

## 2. Where are the design tokens?

The main tokens are at the top of `src/styles.scss`. The most important ones are `--blue`, `--red`, `--button-red`, `--yellow`, `--teal`, `--outline`, and `--neutral`.

## 3. Which fonts are used?

The final font system is Sora and Nunito. They are loaded in `index.html`. Nunito carries the child-friendly tone in headings, cards, and body copy. Sora is used for stronger compact UI labels and controls. Old Inter and Actor references were removed so the implementation matches the documented font system.

## 4. How does the layout work on mobile?

The app is mobile-first. `src/styles.scss` defines the base `.screen` layout. `src/mobileNavFixes.scss` adds the fixed bottom navigation behaviour, safe-area spacing, and mobile route fixes. The screens use viewport-aware sizing so the app still works on smaller phones.

## 5. How is the bottom navigation handled?

The bottom nav is fixed and centred. It has active and inactive visual states. The CSS reserves bottom padding on scrollable routes so content is not hidden behind the nav or Safari browser controls.

## 6. How does the 3D body map work visually?

The main 3D body map is in `src/screens/ShowpainScreen.js`. It imports Three.js and GLTFLoader through npm, loads `/bodymap.glb`, applies warm lighting and material, and uses raycasting so taps on the model can become selected pain areas. The mini preview is in `src/miniBody3d.js`.

## 7. What happens if 3D loading fails?

The body-map screen has loading and fallback states. The loading text uses `role="status"` and `aria-live="polite"`. If WebGL or the model fails, the app shows a fallback map instead of leaving the user with a blank body area.

## 8. How is motion handled?

The 3D body map uses requestAnimationFrame for rendering and rotation. Both the main body map and mini preview check `prefers-reduced-motion` so the animation can be reduced for users who need less motion.

## 9. How do the visuals support the learning goals?

The UI supports the product concept by turning a difficult child-caregiver conversation into a structured visual flow: child profile, 3D body area, pain feeling, pain timing, pain score, history, and assistant handoff. The branding is consistent across the PWA icon, app navigation, assistant identity, and get-started flow.

## 10. What is still technical debt?

The main technical debt is stylesheet size. `src/styles.scss` contains many route-specific fixes because the app went through intensive deadline polishing. The next developer should split it into smaller CSS modules after the current visual state is accepted.
