# Chloe's World

A dependency-free static co-play early-learning web app for toddlers and their parent. Pure HTML, CSS, and JavaScript, no build step. Open `index.html` in a browser to run it locally.

## Run locally

Because the app loads files (audio, video, JSON-like data) via JavaScript, open it through a tiny local server rather than double-clicking the file:

```bash
# from inside this folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Structure

- `index.html` — entry point, loads core then modules
- `core/` — design system (`core.css`), engine (`core.js`: router, audio, profile), bundled fonts
- `modules/animals/` — Animals module (20 animals, hero video, real recorded sound, gallery, matching game)
- `modules/meals/` — Meals module
- `assets/animals/<key>/` — real media per animal (hero.mp4, sound.m4a, photos)
- `CLAUDE.md` — module contract and detail-page pattern for anyone extending the app
- `DESIGN_SYSTEM.md` — visual design system
- `CREDITS.md` — media attribution

## Editing

All asset links carry a `?v=N` cache-buster. Bump the number in `index.html` and detail pages when assets change so browsers reload them.

## Hosting

This is a static site. It runs as-is on GitHub Pages with no configuration. All paths are relative, so it works whether served from a domain root or a subfolder.
