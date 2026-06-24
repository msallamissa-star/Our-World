# Chloe's World, Platform Core, Module 1 (Animals), and Module 2 (Meal Plans)

This file is the complete reference for the project. It is written so that anyone (or a future session) can understand and continue the work without the original conversation. Read it top to bottom.

## 1. What this is
A co-play early-learning platform for Chloe (about 18 months old) and her parent, used side by side on an iPad. The parent is a first-class user, not a bystander. This folder is a reusable **platform core** with two top-level areas at the top of the app: **Entertainment** (Module 1: Animals) and **Meal Plans** (Module 2: a parent-facing daily meal planner), both built and complete. Future areas (a daily and weekly development calendar) are meant to snap onto the same core without rebuilding it.

It is a dependency-free static website: plain HTML, CSS, and JavaScript, no framework, no build step, no server required. It runs fully offline by opening `index.html`. Every photo, sound, video, and font is bundled in the folder. The visual theme is dark cinematic glassmorphism with a single warm gold accent, called "Golden Hour Cinema".

## 2. How to open, run, and share it
- **Open it:** double click `index.html`, or in a browser open the file directly. It works offline.
- **On the iPad:** copy the whole `chloe-play` folder (or the zip below) to the iPad and open `index.html` in Safari. Formats are chosen for iPad Safari.
- **Share or sell it:** a self-contained package is built at `../Chloe-World-final.zip` (it excludes the internal dev docs CLAUDE.md and DESIGN_SYSTEM.md; it ships the app plus CREDITS.md). Unzip and open `chloe-play/index.html`.
- **If a change does not show:** the browser cached old files. Hold Shift and click reload, or bump the version (see section 9).
- **Local preview server (optional, for development):** `python3 -m http.server 8777 --directory <path-to-chloe-play>` then open `http://localhost:8777`. The Python server supports HTTP Range, which is best for video.

## 3. Design law: the AAP 5 Cs of Media Use (non-negotiable)
Every module must honor these.
- **Content.** Real, accurate media of the real animal only. No AI-generated, cartoon, stylized, emoji, or illustrated content. No ads, no product tie-ins, no links a child can tap out to. The one deliberate, parent-approved exception is the dinosaurs (see section 8): extinct, so they use real film of life size animatronic museum models, framed honestly as animals from long ago.
- **Calm.** No autoplay of video or speech. Soft, still glow rather than flashing. Motion is short (about 150 to 300 ms) and there is a full `prefers-reduced-motion` path that disables animation, particles, and haptics. Every session can end with a clear, friendly "all done".
- **Crowding Out.** Sessions are short. The ending screen actively suggests a real-world activity to do together. A gentle break reminder appears for the grown-up after about nine minutes (it never hard-locks the app).
- **Communication and Child.** Spoken audio is always paired with the written word. Language and pace suit a toddler: one short idea at a time.
- **Joint Media Engagement.** Every animal carries a **Grown-Up Card**: one question to ask the child now, one real-world follow-up for later, and for some animals a "real one near you" nudge.

## 4. Folder structure
```
chloe-play/
  index.html                 loads core.css, core.js, animals.js, meals.js, then ChloePlatform.init().
                             asset links carry ?v=N for cache-busting. theme-color is the dark bg.
  core/
    core.css                 the entire design system (see section 7)
    core.js                  the platform engine plus the section tabs (see section 6)
    fonts/                   Fredoka (display) + Nunito (body), bundled woff2 so the app is offline
  modules/
    animals/animals.js       Module 1: animal data, the home grid, the detail page, and the game
    meals/meals.js           Module 2: Meal Plans, the parent-facing daily meal planner (meal database + UI)
  assets/
    animals/
      _thumbs/<key>.jpg       square grid thumbnail for each of the 25 animals
      <key>/
        hero.mp4              720p H.264 hero clip
        poster.jpg           the still shown before the video plays
        sound.m4a            the real recorded sound (AAC). Absent only for alpaca.
        photos/<key>-1..N.jpg gallery photos (4 or 5 each)
  CLAUDE.md                  this file
  DESIGN_SYSTEM.md           the full visual design spec
  CREDITS.md                 source and licence basis for every asset
../tools/chloe_src.py        BUILD-TIME media sourcing tool (NOT in the app or the zip, see section 9)
../meal-plans/2026-06-18-breakfast-lunch-2weeks/   the family's established 14-day plan, the source of truth for Module 2
../Chloe-World-final.zip     the shareable package
```

## 5. Routing and storage
Hash-based routing (works on `file://`): `#/home` (the Entertainment area, Module 1 animals), `#/meals` (the Meal Plans area, Module 2), `#/animal/<key>`, `#/game`, `#/done` (session end), `#/grownups` (a press-and-hold gated parent area). Animal keys are lowercase letters only (the router matches `[a-z]+`), so keys are `trex`, `raptor`, etc., never with digits. Progress is in `localStorage` under `chloe_world_progress_v1` as `{ child, visited:{key:count}, plays, sessions }`. The parent view summarizes it; no scores are ever shown to the child.

## 6. The platform core (core/core.js)
A small dependency-free engine that hosts pluggable modules. Public API on the global `ChloePlatform`:
- `registerModule({ id, title, renderHome(rootEl), renderDetail(rootEl, key), renderGame(rootEl), ... })`
- `speak(text, rate, onend)` device text-to-speech, prefers a warm female voice, cancels any prior utterance.
- `playSound(src, onend)` plays an audio file through one shared player (stops the previous one first).
- `stopSound()` stops audio and cancels speech.
- `recordVisit(key)`, `getProgress()` progress read and write.
- `toast(msg)`, `sparkle(x,y)` (golden particles plus a gentle haptic, both skipped under reduced motion), `el(html)`, `go(hash)`, `topbar()`, `sectionNav(active)` (the Entertainment / Meal Plans tab bar shown on both home screens), `icon`, `realWorldPick()`.
- **Top-level sections** live in core.js: `SECTIONS` lists the two areas (`play` -> `#/home`, `meals` -> `#/meals`) and the router sends `#/meals` to the meals module. To add a third area later, add an entry to `SECTIONS`, a route in `render()`, and a module with `renderHome`.
It also owns: the session guardrail (the nine-minute break nudge), the "all done" screen, the gated parent view, and the guide character "Sunny" (a sun drawn in pure CSS, deliberately not a cartoon; its rays pivot on the true centre and the whole sun spins as one piece).

## 7. The design system (core/core.css and DESIGN_SYSTEM.md)
Theme "Golden Hour Cinema": a dark, warm, cinematic stage where each real photo glows like a lit plate.
- **Colour tokens:** dark warm base (`--bg-0 #0b0a10`, `--bg-1 #14100d`), warm cream text (`--ink #fdf6ea`), one gold accent (`--gold #fbbf24`, `--gold-2 #f59e0b`, `--gold-hi #ffe9b8`), dark ink on gold (`--ink-on-gold #241606`), success green for the game, frosted glass tokens (`--glass`, `--glass-line`), and `--glow`.
- **One glass recipe** used by every card and bar: a translucent gradient, `backdrop-filter: blur(...)`, a 1px light border, a soft shadow, and a warm gold bloom on touch. The section tabs, the Meal Plans cards, and the lightbox arrows all use this same recipe.
- **Fonts:** Fredoka (display) plus Nunito (body), bundled locally. This is the standard pairing for children's apps. Hero and animal names use a gold gradient with a soft glow.
- **Motion:** taps scale to .96, hover lifts on desktop only, one calm staggered reveal on the detail page, a slow gold "breath" while a sound plays. A single global media query removes all of it under reduced motion.
- **Accessibility and calm:** minimum 68px tap targets, one accent colour, generous spacing, no competing motion.

## 8. Module 1: Animals (modules/animals/animals.js)
Twenty-five animals in four groups (Farm and Home, Birds, Wild, Dinosaurs). Every animal is live with a full detail page. Twenty-four play a real recorded sound; the alpaca alone has no recording, so its button speaks its name.

### Animal data object
```js
{ key, name, ready,            // ready:false renders a dimmed "soon" tile, not openable (none are ready:false now)
  thumb, hero, poster, sound, photos:[...],   // paths carry the ASSET_V cache query
  videoHasSound,               // true: the clip's own on-camera sound plays; false: clip is muted and sound.m4a plays in sync
  hasSound,                    // false only for animals with no real recording (alpaca); the button then speaks the name
  say,                         // onomatopoeia, e.g. "Woof woof"
  child,                       // short toddler line, read aloud (only the first one or two sentences are spoken)
  parent,                      // fuller grown-up note (on screen, not spoken)
  grownup:{ ask, later, near } } // co-play prompts; near is an optional parent-only "a real one near you" line
```

### The full animal list
Groups: Farm and Home, Birds, Wild, Dinosaurs. videoHasSound true means you hear the animal on camera; false means the clip is muted and a real recorded sound plays in sync.

| Group | Animal | Says | videoHasSound | Sound notes |
|---|---|---|---|---|
| Farm | Dog | Woof woof | true | barks on camera; 5 photos; has a "near you" nudge |
| Farm | Cat | Meow | true | meows on camera; has a "near you" nudge |
| Farm | Cow | Moo | false | common Holstein (replaced the old Highland); clip muted + real moo |
| Farm | Sheep | Baa baa | true | bleats on camera |
| Farm | Pig | Oink oink | true | grunts on camera |
| Farm | Horse | Neigh | false | clean clip + synced neigh |
| Farm | Donkey | Hee haw | true | brays on camera |
| Farm | Alpaca | Hum | false | LIVE; no real alpaca recording exists, so hasSound is false and the button speaks its name (never faked) |
| Birds | Duck | Quack quack | false | clip + synced quack; has a "near you" nudge |
| Birds | Chicken | Cluck cluck | true | rooster crows on camera |
| Birds | Bird | Tweet tweet | true | robin sings on camera; has a "near you" nudge |
| Birds | Parakeet | Chirp chirp | false | green parakeets feeding clip (muted) + a real budgie chirp in sync; has a "near you" nudge |
| Birds | Macaw | Squawk | false | scarlet macaw on a branch (muted) + a real macaw call in sync |
| Birds | Peacock | May-awe | false | peacock fanning its tail (muted) + a real peacock call in sync; LOUD tier |
| Wild | Lion | Roar | false | lion strides toward camera (13s) + a strong 13s real roar in sync |
| Wild | Elephant | Pawoo | false | clip + synced call |
| Wild | Monkey | Ooh ooh ah ah | true | capuchin calls on camera; sound button now uses a real vervet monkey call (fixed from a chimp pant-hoot, since a chimp is an ape not a monkey, after the council review) |
| Wild | Bear | Grrr | false | clear wild brown bear walking (20s) + the official Yellowstone National Park grizzly roar in sync; LOUD tier (played quieter) |
| Wild | Zebra | Bray | false | mountain zebra clip (no audio) + real Grevy's zebra call in sync |
| Wild | Panda | Bleat | false | clear HD giant panda eating bamboo in snow (replaced the old blurry clip) + real scene audio |
| Wild | Frog | Ribbit | true | croaks on camera |
| Wild | Alligator | Hiss | false | clip + real alligator hiss in sync |
| Wild | Crocodile | Hiss | false | feeding-pond clip + real scene audio (not an isolated hiss, honest gap); 5 photos |
| Dinosaurs | T-Rex | Roar | false | real film of the Natural History Museum London life size animatronic T-Rex (muted, brightened) + its own roar pulled from the clip's loudest moment |
| Dinosaurs | Raptor | Screech | false | real film of an NHM animatronic raptor (muted, brightened) + its own screech from the clip |

`VIDEO_SOUND` (the true, hear-on-camera set) in animals.js is: `dog, cat, sheep, pig, chicken, monkey, bird, frog, donkey`. Everything else uses a muted clip with a synced sound. `NO_SOUND` is `{ alpaca:1 }`: the only animal with no `sound.m4a`, so its `hasSound` is false and the button speaks its name. All 25 animals are `ready:true`. A `LOUD` set `{ bear, lion, trex, raptor, macaw, peacock }` plays those big calls at 0.6 volume, and the core fades every sound in over about 140 ms, so a roar or squawk never startles a child held close to the device (Calm). `playSound(src, onend, vol)` carries the per-animal `vol`.

**Dinosaurs are extinct,** so no real living footage or real sound exists. With the parent's explicit choice, the two dinosaurs use real film of life size moving museum models (animatronics from the Natural History Museum, London), framed honestly in the child and parent text as animals from long ago. No copyrighted movie footage is used, so the app stays clean to share or sell. They are never presented as living animals.

### The detail page, top to bottom
(a) hero video: tap to play, no autoplay, no loop, a calm "watch again" poster when it ends. For false animals the clip is muted and the real sound plays in sync the moment it starts (an animal with `hasSound:false`, the alpaca, plays no file and stays silent on video). (b) a big "Hear the X" button that plays the real sound, lights the written name as it is spoken, then invites "Can you say X?" and falls silent; if `hasSound` is false it skips the file and warmly speaks the name. (c) a photo gallery, tap to enlarge; in the enlarged view you move between an animal's photos with the keyboard arrows, the on-screen prev/next arrows, a swipe, or a tap on the picture (a position counter shows where you are), and it closes on Escape, the X, or a tap on the dark edge, returning focus to the thumbnail. (d) a short toddler line read aloud (only the core sentence is spoken; the fuller text stays on screen) plus a grown-up note. (e) the Grown-Up Card. (f) a large back control. The page does not speak on its own; the first sound is always a deliberate tap.

### The matching game (#/game)
Starts at two choices and widens to three after a correct round. Distractors are drawn from the target's own group when possible (a real same-group discrimination), and alligator and crocodile are never shown together because they look alike. The target is biased toward animals already visited this session. A wrong tap never shakes or says "try again"; instead it gently re-invites and lights up the correct tile (redirection, not correction). The spoken prompt always matches the shown target, and the celebration is sequenced on speech-end so audio never overlaps.

### Co-play and calm refinements (from an expert panel review)
No auto-speech on page load; the read-aloud speaks only the core line; the sound button invites the child to copy the sound; the written name pulses once as it is spoken; the lightbox is forgiving; sparkle and haptics respect reduced motion; dog, cat, bird, duck, and parakeet carry a parent-only "a real one near you" line; the break reminder is about nine minutes; the parent view reports animals explored and time together rather than a raw play count.

## 8b. Module 2: Meal Plans (modules/meals/meals.js)
A parent-facing daily meal planner for Chloe (about 18 months), built on the family's established 14 day plan (`../meal-plans/2026-06-18-breakfast-lunch-2weeks/`) and on standard toddler nutrition guidance (AAP HealthyChildren.org, CDC, WHO), and reviewed by an infant-nutrition council (pediatric dietitian, pediatric safety, food-allergy, culinary, and code QA). It registers `{ id:"meals", title, renderHome }` and draws the section tabs with `ChloePlatform.sectionNav("meals")`.

What it does:
- A `MEALS` database (54 items, added with the `M(...)` helper) of toddler-soft meals and snacks across seven cuisines (Any, Middle Eastern, Mediterranean, International, Indian, French, Dutch), each tagged with slot, cuisine, level (easy/simple/involved), prep minutes, simple ingredient keywords, allergens, food groups, an iron and a vitamin C flag, a portion, and a short "why it's good" note. No added salt, sugar, or honey; all soft and small. French meals: chicken ratatouille, vegetable and lentil potage, vegetable gratin, fruit compote. Dutch meals: pannenkoek with appelmoes, hutspot, stamppot, appelmoes with yogurt.
- **Tap any card to open its full recipe** (`recipeDetail`): detailed ingredients WITH quantities (grams and tablespoons) and numbered prep steps, then a "Shopping list for this meal" button one tap further. The card itself shows a short "Main" ingredients line and the Safe prep note. The detailed recipes live in a separate `RECIPES` object keyed by id (attached to each meal as `m.recipe` and `m.steps`); they were generated by a recipe workflow and verified by a pediatric dietitian and food-safety panel, then injected. The per-meal and per-day shopping lists use these detailed ingredients (with quantities), grouped by aisle. To regenerate, re-run the `chloe-meal-recipes` workflow and re-inject at the `RECIPES` marker.
- A 7 day plan with a day selector (today is highlighted). Breakfast, lunch, and dinner each show three options, two simple and one a bit more involved, rotating by day. Snacks show one or two per the preference.
- **Make it yours** (saved in `localStorage` under `chloe_meals_v1`): allergies (the 9 common allergens, removes any meal containing them), dislikes (free-text ingredient chips, e.g. "oat milk", hides any meal whose name or ingredients contain that word), cuisine, snacks per day, quick-only (10 min or less), and iron-first. After filtering, each slot refills back to three options.
- **Shopping made simple:** per meal and per day, a deduped grocery list grouped by aisle (Produce, Protein, Dairy, Grains and pantry).
- Touches: plate-balance colour dots, iron / vitamin C / allergen tags, save-to-favourites (heart), a rotating feeding tip, a **Surprise me** pick with a fun fact, and a professional-sources panel (AAP, CDC, WHO) with six golden rules (iron daily, milk and water, safe pieces, cook it through, none-of-these, never alone) and a clear "supplements, does not replace, the pediatrician" note.
- **Safety is structural, not buried in prose** (the council's first ask): every card with a choking, doneness, or bone concern carries a **Safe prep** line (quarter grapes and cherry tomatoes lengthwise; cook egg fully until set; cook fish until opaque and check for bones; mash sardine bones; mince shrimp finely). Quartered grapes and tomatoes are in the meal name and ingredients, not only the prose, so they also show in the shopping list.
- **Allergens are derived from ingredients** (`deriveAllergens` + `ALG_MAP`) and unioned with any hand tags, so a future hand mis-tag cannot silently expose an allergic child; chickpea flour stays correctly gluten-free. The dislikes box is labelled preference-only, not an allergy tool.
- **The iron tag reflects real iron sources.** Salmon and tilapia alone are not iron (corrected by the dietitian); sardines, beef, chicken, lentils, chickpeas, and fortified cereal are; egg keeps a minor iron flag but no longer headlines as the day's iron. A lemon counts as vitamin C. A daily-iron nudge appears if filters strip every iron meal from the day.

The view re-renders in place on every preference change (`remount` preserves scroll). No media assets, so it is not affected by `ASSET_V`.

## 9. Media: how assets are made and sourced
**Source: Wikimedia Commons only** (Creative Commons or public domain). Pixabay now blocks direct fetch, so it is not used for new media. The build tool is `../tools/chloe_src.py` (kept outside the app folder so it is not shipped). It needs ffmpeg from the `imageio-ffmpeg` Python package (resolve the path with `python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`), plus the system `sips`.

Tool subcommands (run `python3 ../tools/chloe_src.py <cmd> ...`):
- `videosearch / audiosearch / imagesearch "term1;;term2" "syn,syn"` list candidates.
- `autovideo KEY "terms" "syn" [DUR]` download, verify, transcode `hero.mp4` plus `poster.jpg`. Prefers a clip whose own audio is the animal's call.
- `autoaudio KEY "terms" "syn"` make `sound.m4a`.
- `autophotos KEY "terms" "syn" [N]` save N gallery photos plus the thumbnail; it drops grayscale and sepia automatically.
- `cands KEY "terms" "syn" [N]` and `savefrom KEY i,j,k` download a numbered candidate montage to `/tmp/verify/KEY_cands.jpg`, look at it, then save the indexes you pick. Use this whenever photo quality matters.
- `contact KEY` build `/tmp/verify/KEY.jpg`, a montage of the poster, thumbnail, and gallery, to eyeball before accepting.
- `status KEY` report which assets exist.

Hard lessons baked into the tool (do not regress):
- Commons search MUST include the `filetype:video|audio|bitmap` qualifier, or image results swamp video and audio searches and return almost nothing.
- Reject source videos longer than 80 seconds; long files are films and cartoons, not animal clips.
- A large BLOCK list rejects cartoons, toys, statues, paintings, engravings, sea lions, sports and political clips, and text-to-speech word-pronunciation files (over the build it was fooled by a 1935 cartoon cow, a "moo box" toy, a 1630 Mughal lion painting, an 1842 alpaca engraving, a "bear enters home" news clip, a sea lion matching "lion", a "Que bicho é esse" cartoon kids-show intro for the macaw, an Ubuntu Budgie OS screenshot for the parakeet, and German and indigenous-language word recordings for the macaw and parakeet sounds). Always confirm by sight.
- Photos are gated by colour saturation to drop black-and-white and sepia archival images; grey animals like the donkey use a low threshold.
- ALWAYS verify by sight with `contact` and pick gallery photos with `cands` / `savefrom`. Title filters alone are not enough.
- For a long roar or call, take the loudest sustained window of the recording, not the quiet intro (the lion roar was weak until it was cut from the loud middle of a 42-second recording).

**Dinosaurs need a separate, permissive path** because the BLOCK list (rightly) rejects "animatronic"-adjacent words like statue, skeleton, fossil, model-show terms, animation, and movie. They were sourced by hand: Commons searched without the BLOCK filter, candidate frames pulled and eyeballed, then the chosen Natural History Museum animatronic clips processed locally with ffmpeg (muted hero, brightened with `eq=brightness=0.07:contrast=1.08:saturation=1.2` because museum footage is dark, poster grabbed, and a 5-second roar taken from the loudest window of the clip's own audio).

Format targets: video 1280x720 H.264 with `+faststart`, clips about 12 to 26 seconds; audio AAC `.m4a` at 44100 Hz, trimmed and normalized; photos resized to about 980px and cropped with `object-fit:cover`.

### After swapping any media: bump the version
Asset URLs carry a cache query so updates always show. There are two independent counters: `ASSET_V` in `animals.js` (currently `"?v=9"`) busts only the animal media, and the `?v=N` on the core/module files in `index.html` (currently `v=13`) busts the code. After replacing a hero, poster, sound, or photo bump `ASSET_V`; after editing core.css/core.js/animals.js/meals.js bump the `?v=N` in index.html. Then reload.

## 10. How to add an animal
1. Source and verify a hero video, a real sound, and 4 or 5 photos with `../tools/chloe_src.py` (always check the `contact` sheet by eye).
2. Place files under `assets/animals/<key>/` and `_thumbs/<key>.jpg`; bump `ASSET_V`.
3. In `animals.js`: add the entry to `ANIMAL_DATA` (`say`, `child`, `parent`, `ask`, `later`, optional `nearNow`), add the key to the right group in `CATEGORIES` (or add a new group), set the `VIDEO_SOUND` flag if it vocalizes on camera, keep it `ready:true`, and if it genuinely has no real `sound.m4a`, add its key to `NO_SOUND` (like the alpaca) so the button speaks its name instead of failing.

## 11. How to add a module or top-level area
Create `modules/<name>/<name>.js`, implement `renderHome` (and `renderDetail` if it has detail pages), call `ChloePlatform.registerModule({...})`, and add assets under `assets/<name>/`. To make it a top-level area like Meal Plans, add it to `SECTIONS` in core.js, add its route in `render()`, and draw the tabs with `ChloePlatform.sectionNav("<id>")` at the top of its `renderHome`. The core (top bar, Sunny, sessions, parent view, speech, audio, the design system) is reused as is. Keep the 5 Cs. Module 2 (Meal Plans) is the live worked example.

## 12. Honest caveats and known limitations
- **Audio was verified by source, file, and level, not by ear.** Loud calls (bear, lion, the two dinosaurs, macaw, peacock) now play at 0.6 volume with a short fade-in so they do not startle a child; the bear is the official Yellowstone grizzly roar; and the monkey is now a real vervet monkey call (it was a chimpanzee, an ape, before the council review). A device tap-test by ear is still wise before any sale, especially the loud calls and the panda and crocodile, which use real scene audio rather than an isolated call.
- **Alpaca is live but has no sound file:** no real alpaca recording exists on free sources and faking one would break the real-media promise, so its key is in `NO_SOUND` and the button warmly speaks its name. To give it a real sound later: add `assets/animals/alpaca/sound.m4a`, remove `alpaca` from `NO_SOUND`, and bump the version.
- **Panda and crocodile** sounds are real audio taken from their own footage (enclosure or feeding-pond ambience), not an isolated vocalization, because none exists on Commons.
- **Dinosaurs are the one parent-approved exception to "real living animal only."** They are extinct, so the two dinosaurs use real film of life size animatronic museum models with the models' own roars, framed honestly as animals from long ago. There are two strong, distinct species (T-Rex and raptor); a third distinct species (a triceratops or long-neck) can be added later if clean, well-lit footage is found, since Commons is thin on it.
- Licences permit private, non-commercial educational use. Before selling, compile the per-file author and licence details from each Commons source page; `CREDITS.md` records the basis.

## 13. Status
Two top-level areas sit at the top of the app: **Entertainment** (Module 1, Animals) and **Meal Plans** (Module 2, a parent-facing daily meal planner). Both are built and complete.
Module 1, Animals: 25 animals, all live, in four groups, Farm and Home, Birds (now including parakeet, macaw, and peacock), Wild, and Dinosaurs (T-Rex and raptor). The alpaca is live and speaks its name. The enlarged photo viewer now moves between photos with the keyboard arrows, on-screen arrows, swipe, or tap. Design, media, the matching game, and the co-play refinements are complete and verified in the browser.
Module 2, Meal Plans: built and live. A parent-facing daily planner with three options per meal slot (two simple, one a bit more), one or two snacks, and 54 meals across seven cuisines (including French and Dutch). Tap any card to open its full recipe (detailed ingredients with quantities and step-by-step prep), then the detailed per-meal shopping list one tap further. Full allergy / dislike / cuisine / quick / iron customization saved per child, per-aisle shopping lists with quantities, plate-balance and why-it's-good touches, a Surprise me, and a professional-sources panel (AAP, CDC, WHO), all built on the family's established 14 day plan. Reviewed by an infant-nutrition council and corrected for it: every card carries a structural Safe prep line, allergens are derived from ingredients so a mis-tag cannot expose an allergic child, the iron tag reflects real iron sources, and a daily-iron nudge fires if filters remove every iron meal. The detailed recipes were generated and dietitian-verified by the `chloe-meal-recipes` workflow. Sanity-checked click by click (day tabs, every filter including French and Dutch, tap-to-open recipe, favourites vs card tap, all shopping lists, Surprise me, overlay close and focus trap, the all-allergens and no-iron edge cases, and persistence) and meal by meal (all 54 recipes present, no honey/added salt/added sugar, eggs fully cooked, fish de-boned).
The shareable package is at `../Chloe-World-final.zip` (excludes internal dev docs).

A five-expert council review (early-childhood/AAP, zoology, UX/accessibility, product/licensing, code/QA) ran on this build. Fixed from it: the monkey sound (ape to real monkey), the peacock word (Honk honk to May-awe to match its text and real call), loud calls softened and faded in, pinch-zoom restored (WCAG 1.4.4), the photo lightbox hardened (closes on navigation, focus trap, focus moved into the dialog, per-photo alt text, bigger close button), a reduced-motion static "playing" cue and name highlight, the alligator/crocodile same-and-different comparison completed, the session break nudge made timer-based at ~7 minutes, and small copy and comment cleanups.

STILL OPEN before a commercial sale (owner decisions, not yet done): complete per-asset attribution for all 25 animals (only the dog is fully documented in CREDITS.md); replace or relicense the remaining Pixabay-licensed assets (dog hero, dog photos, original cow photo) and then drop Pixabay from the footer; and confirm commercial clearance for the Natural History Museum animatronic dinosaur footage (the depicted animatronic model is a separate copyrighted work, distinct from the videographer's CC licence). The product is polished and accurate for family use; it is not yet licensing-cleared for sale.

Planned after Meal Plans: a daily and weekly development calendar, on this same core.
