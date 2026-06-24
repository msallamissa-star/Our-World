# Chloe's World, Design System

Theme: **Golden Hour Cinema**. A dark, warm, cinematic stage where every real animal photo glows like a lit picture plate. Built with `ui-ux-pro-max` (Glassmorphism + premium dark/gold palette + Playful Creative type pairing) and the `frontend-design` skill (one bold, cohesive, intentional direction).

It stays bound by the AAP 5 Cs that govern the whole platform: Content (real media only), Calm (no autoplay, soft slow glow, gentle pacing), Crowding Out, Communication, Child. Dark and cinematic does not mean loud. Glows are soft and still, motion is short, nothing flashes.

## 1. Concept
- A cozy night-time theatre, lantern lit, warm not cold. The background is warm charcoal with low amber light pools, a soft film grain, and a gentle vignette.
- Each animal sits behind a frosted glass frame with a soft golden rim that warms when touched, like a light box switching on.
- Gold is the single hero accent. Everything else is restrained so the gold and the real photos carry the room.

## 2. Color tokens
Dark base, warm not blue.
- `--bg-0 #0b0a10` deepest, `--bg-1 #14100d` warm charcoal, `--bg-2 #1d1712` lifted panel
- `--ink #fdf6ea` warm cream text (high contrast on dark), `--muted #b9ad9b` warm grey
- `--gold #fbbf24` primary, `--gold-2 #f59e0b` deep amber, `--gold-hi #ffe9b8` highlight, `--ember #ff8a3c` warm orange
- `--leaf #7bd88f` success (game correct), `--berry #ff7aa8` soft pink accent
- Glass: `--glass rgba(255,255,255,.06)`, `--glass-2 rgba(255,255,255,.10)`, `--glass-line rgba(255,255,255,.14)`, `--glass-line-2 rgba(255,255,255,.24)`
- Glow: `--glow rgba(251,191,36,.45)`

Contrast: cream on near black is far above 4.5:1; gold is used for large display text and icons only; muted grey on dark is about 7:1.

## 3. Glass recipe (the one surface language)
Every card, bar, and panel uses the same frosted glass:
```css
background: linear-gradient(160deg, var(--glass-2), var(--glass));
backdrop-filter: blur(16px) saturate(1.25);
-webkit-backdrop-filter: blur(16px) saturate(1.25);
border: 1px solid var(--glass-line);
box-shadow: 0 22px 50px -22px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.12);
```
Touched or focused state adds a warm rim and a soft golden bloom:
```css
box-shadow:
  0 0 0 1px var(--glass-line-2),
  0 26px 60px -18px rgba(0,0,0,.85),
  0 0 42px -6px var(--glow),
  inset 0 1px 0 rgba(255,255,255,.14);
```

## 4. Typography
Pairing: **Fredoka** (display) + **Nunito** (body), bundled locally as woff2 so the app stays fully offline. This is the skill's recommended pairing for children's and educational apps, rounded and friendly, now treated with cinematic weight.
- Display headings: Fredoka 600 to 700. Hero and animal names use a gold gradient clip with a soft drop shadow glow.
- Body: Nunito 600 to 800 for warmth and legibility at toddler sizes.
- Type scale uses `clamp()` so it reads large on the iPad and never breaks the grid.

## 5. Motion
Per the skill's UX rules: micro-interactions 150 to 300ms, ease-out on enter, ease-in on exit, nothing over 500ms for core UI.
- Tap: scale to .96 with a quick warm rim flash.
- Hover (desktop only): lift 6px, photo zooms 1.05, glow blooms.
- Page load: one calm staggered rise of the detail sections, then stillness.
- Sound playing: a slow, soft gold halo breath, not a flash.
- `prefers-reduced-motion` removes all of it.
- A gentle haptic tick fires on celebratory taps where the device supports it.

## 6. Components
- Top bar: dark glass, sticky, the CSS sun guide "Sunny" with a warm halo, a glass "For grown-ups" button, a gold "All done" button.
- Hero header: glass kicker pill, two tone headline (cream plus gold), a gold "Play a game" call to action.
- Animal tile: large, full bleed real photo, a frosted glass label strip at the foot with the name and a gold play chip, a soft permanent gold rim that warms on touch.
- Hero video plate: glass frame with a gold rim glow, a large central play control with a soft expanding ring, tap to play, no autoplay, no loop, a calm "watch again" ending.
- Sound button: full width gold gradient with dark ink text, a soft halo while playing.
- Read card and Grown-Up Card: glass panels; the Grown-Up Card is tinted warm gold so the parent content reads as a distinct layer.
- Game cards: glass photo tiles; correct answer gets a green and gold glow ring, wrong answer a short shake.
- Lightbox, toast, parent view: all the same dark glass language.

## 7. Accessibility and calm guardrails
- Minimum tap target 68px for little hands.
- One accent color, generous spacing, no competing motion.
- No autoplay, every session can end with a clear friendly "all done".
- All decorative glow is non-blocking and pointer-events none.
