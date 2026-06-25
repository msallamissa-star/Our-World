# Chloe's World, Platform Core, Module 1 (Animals), and Module 2 (Meal Plans)

This file is the complete reference for the project. It is written so that anyone (or a future session) can understand and continue the work without the original conversation. Read it top to bottom.

## 1. What this is
A co-play early-learning platform for Chloe (about 18 months old) and her parent, used side by side on an iPad. The parent is a first-class user, not a bystander. This folder is a reusable **platform core** with two top-level areas at the top of the app: **Entertainment** (Module 1: Animals) and **Meal Plans** (Module 2: a parent-facing daily meal planner), both built and complete. Future areas (a daily and weekly development calendar) are meant to snap onto the same core without rebuilding it.

It is a dependency-free static website: plain HTML, CSS, and JavaScript, no framework, no build step, no server required. It runs fully offline by opening `index.html`. Every photo, sound, video, and font is bundled in the folder. The visual theme is a soft, light, sophisticated rose pastel called "First Light": a warm ivory-rose dawn with milk-glass cards, a single rose accent, soft plum ink, and gentle low-amplitude motion. It is built for a baby girl yet refined for an adult, deliberately desaturated so the pink reads as dusty rose, never candy or Barbie. (It replaced the earlier dark gold "Golden Hour Cinema" theme.)

## 2. How to open, run, and share it
- **Open it:** double click `index.html`, or in a browser open the file directly. It works offline.
- **On the iPad:** copy the whole `chloe-play` folder (or the zip below) to the iPad and open `index.html` in Safari. Formats are chosen for iPad Safari.
- **Share or sell it:** a self-contained package is built at `../Chloe-World-final.zip` (it excludes the internal dev docs CLAUDE.md and DESIGN_SYSTEM.md; it ships the app plus CREDITS.md). Unzip and open `chloe-play/index.html`.
- **If a change does not show:** the browser cached old files. Hold Shift and click reload, or bump the version (see section 9).
- **Local preview server (optional, for development):** `python3 -m http.server 8777 --directory <path-to-chloe-play>` then open `http://localhost:8777`. The Python server supports HTTP Range, which is best for video.

## 3. Design law: the AAP 5 Cs of Media Use (non-negotiable)
Every module must honor these.
- **Content.** Real, accurate media of the real animal only. No AI-generated, cartoon, stylized, emoji, or illustrated content. No ads, no product tie-ins, no links a child can tap out to. The one deliberate, parent-approved exception is the dinosaurs (see section 8): extinct, so they use real film of life size animatronic museum models, framed honestly as animals from long ago.
- **Calm.** No autoplay of video or speech. Soft, still glow rather than flashing. Motion is either short (taps, reveals around 600 ms) or slow and barely perceptible (the ambient orb drift over 20 to 30 s, tiny amplitudes), never fast, flashing, or bouncy, and there is a full `prefers-reduced-motion` path (plus an `html.motion-ok` gate) that disables animation, particles, and haptics and leaves content simply present. Every session can end with a clear, friendly "all done".
- **Crowding Out.** Sessions are short. The ending screen actively suggests a real-world activity to do together. A gentle break reminder appears for the grown-up after about nine minutes (it never hard-locks the app).
- **Communication and Child.** Spoken audio is always paired with the written word. Language and pace suit a toddler: one short idea at a time.
- **Joint Media Engagement.** Every animal carries a **Grown-Up Card**: one question to ask the child now, one real-world follow-up for later, and for some animals a "real one near you" nudge.

## 4. Folder structure
```
chloe-play/
  index.html                 loads core.css, core.js, animals.js, meals.js, then ChloePlatform.init().
                             asset links carry ?v=N for cache-busting. theme-color is the light rose bg (#fbe7ec).
  core/
    core.css                 the entire design system (see section 7)
    core.js                  the platform engine plus the section tabs (see section 6)
    fonts/                   Fredoka (display) + Nunito (body), bundled woff2 so the app is offline
  modules/
    animals/animals.js       Module 1: animal data, the home grid, the detail page, and the game
    meals/meals.js           Module 2: Meal Plans, the parent-facing daily meal planner (meal database + UI)
  assets/
    animals/
      _thumbs/<key>.jpg       square grid thumbnail for each of the 32 animals
      <key>/
        hero.mp4              720p H.264 hero clip
        poster.jpg           the still shown before the video plays
        sound.m4a            the real recorded sound (AAC). Absent for the speak-the-name animals (alpaca, snake, tiger, fish, shark, turtle, jellyfish).
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
- `speak(text, rate, onend, pitch)` device text-to-speech. Tuned soft and cute for a toddler: prefers warm Apple voices (Samantha first), default rate 0.9 and pitch 1.3 (the sweet spot; pitch and rate carry the charm even when Safari ignores the chosen voice). Voices load async (onvoiceschanged plus a short poll). Cancels any prior utterance and resolves `onend` on both end and error.
- `playSound(src, onend, vol)` plays an audio file through one shared player (stops the previous one first), with a per-sound target volume and a short fade-in.
- `stopSound()` stops audio and cancels speech.
- `recordVisit(key)`, `getProgress()` progress read and write.
- `toast(msg)`, `sparkle(x, y, opts)` (soft blush petals of light plus a gentle haptic, both skipped under reduced motion; `opts` sets count, spread, rise, and life for a bigger, slower burst), `el(html)`, `go(hash)`, `topbar()`, `sectionNav(active)` (the Entertainment / Meal Plans tab bar shown on both home screens), `autoReveal(scope)`, `motionOK()`, `icon`, `realWorldPick()`.
- **Top-level sections** live in core.js: `SECTIONS` lists the two areas (`play` -> `#/home`, `meals` -> `#/meals`) and the router sends `#/meals` to the meals module. To add a third area later, add an entry to `SECTIONS`, a route in `render()`, and a module with `renderHome`.
- **Motion engine** lives in core.js: a single gate (`MOTION_OK` boolean plus an `html.motion-ok` class, kept live on the reduced-motion media query) governs all motion. `injectAmbient()` adds the fixed dawn layer (three drifting blurred orbs in blush, lilac, and peach, plus a few soft twinkles) behind everything; `ambientParallax()` gives those orbs a barely-there scroll parallax; and `autoReveal()` (called after every `render()`) tags cards and section blocks so they gently rise into view on scroll via one shared IntersectionObserver. All amplitudes are tiny and every bit is disabled under reduced motion, where content is simply present.
It also owns: the session guardrail (the nine-minute break nudge), the "all done" screen, the gated parent view, and the guide character "Sunny" (a sun drawn in pure CSS in soft peach, deliberately not a cartoon; its rays pivot on the true centre and the whole sun spins as one piece).

## 7. The design system (core/core.css and DESIGN_SYSTEM.md)
Theme "First Light": a soft ivory-rose dawn where each real photo floats as milk glass catching warm light from above. Light, sophisticated, and calm; the pink is desaturated to a dusty rose so it reads refined, not candy. The whole palette is repointed under the original token names, so every component cascades to the new theme.
- **Colour tokens:** a two-source dawn background (a warm rose glow at top-left bleeding into a cooler lilac corner), soft plum ink (`--ink #4a3a48`, never black) and a plum-grey `--muted`. The rose accent family sits under the old gold names: `--gold #e7a9bc` (rose), `--gold-2 #c9748e` (deep rose, the one slightly saturated focal note), `--gold-hi #fad9e4` (pale rose highlight for gradient tops and glass rims). A readable deep rose `--accent #b75d83` is used for accent TEXT and small labels (the pale `--gold-hi` would vanish as text on a light ground), and a readable sage `--sage #5f8a6f` for success text. Support colours: peach `--ember #f3c3a7` (the warm bridge between rose and ivory) and sage-mint `--leaf #a7cbb4` (the game-correct fill). Plum-on-rose button ink is `--ink-on-gold #4a2e3c`. Milk-glass tokens are warm and light (`--glass rgba(255,250,252,.55)`, `--glass-line` a soft rose rim), shadows are warm rose-grey (never cold black), and `--glow` is a rose bloom.
- **One milk-glass recipe** used by every card and bar: a warm translucent gradient, `backdrop-filter: blur(...)`, a soft rose 1px rim with a bright top inset highlight (the "two-light glass" so cards read as milk glass on the ivory ground, not white-on-white), a warm rose-grey shadow, and a rose bloom on touch. The section tabs, Meal Plans cards, recipe and shopping overlays, and the lightbox arrows all use this same recipe.
- **Fonts:** Fredoka (display) plus Nunito (body), bundled locally. Hero and animal names use a rose gradient with a soft rose glow.
- **Ambient + scroll motion (calm by design):** a fixed dawn layer of three slowly drifting blurred orbs (blush, lilac, peach) and a few soft twinkles sits behind everything with a barely-there scroll parallax; cards and section blocks gently rise 16px into view as they scroll in (one shared IntersectionObserver, a 620ms decelerating settle, no bounce); taps scale to .96; hover lifts on desktop only; the detail page keeps its staggered reveal; a slow rose "breath" plays while a sound plays. Amplitudes are tiny (orbs drift under 15px, parallax under 50px) so nothing overstimulates an 18-month-old, and a single global media query plus the `html.motion-ok` gate remove all of it under reduced motion, where the resting state is the visible state.
- **Two themes (boy / girl):** the rose "First Light" is the girl default in `:root`. A boy "Clear Morning" theme is a single `html[data-theme="boy"]` override block: the same calm, desaturated approach in a soft sky-blue, with the warm sun guide kept warm and the ambient orbs cooled to blue. The pervasive accent glow, warm shadow, and heart colours were tokenised to `--accent-rgb`, `--shadow-rgb`, and `--berry-rgb` so the whole UI re-tints from those three values; the top-bar toggle sets `data-theme` live and saves the choice.
- **Accessibility and calm:** minimum 68px tap targets, one dominant accent, generous spacing, no competing motion, and readable ink/accent/sage text contrast on the light ground.

## 8. Module 1: Animals (modules/animals/animals.js)
Thirty-two animals in five groups (Farm and Home, Birds, Wild, Ocean, Dinosaurs). Every animal is live with a full detail page. Most play a real recorded sound; the ones with no honest recording on Commons (alpaca, snake, and the quiet sea animals fish, shark, turtle, and jellyfish) instead speak their name and sound word warmly.

**The vocalization label.** The detail-page kicker now shows the correct English term for each animal's voice (a `CALL` map: dog "Bark", lion "Roar", horse "Neigh", snake "Hiss", tiger "Roar", and so on), while the playful onomatopoeia (`say`) is still used for the "Can you say ...?" copy game. So the label teaches the real word and the child still copies the fun sound.

### Animal data object
```js
{ key, name, ready,            // ready:false renders a dimmed "soon" tile, not openable (none are ready:false now)
  thumb, hero, poster, sound, photos:[...],   // paths carry the ASSET_V cache query
  videoHasSound,               // true: the clip's own on-camera sound plays; false: clip is muted and sound.m4a plays in sync
  hasSound,                    // false for the speak-the-name animals (alpaca, snake, tiger, fish, shark, turtle, jellyfish); the button then speaks the name
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
| Wild | Bear | Grrr | false | clear wild brown bear fishing for salmon in Alaska (~27s) + the official Yellowstone National Park grizzly roar in sync; LOUD tier (played quieter) |
| Wild | Zebra | Bray | false | mountain zebra clip (no audio) + real Grevy's zebra call in sync |
| Wild | Panda | Bleat | false | clear HD giant panda eating bamboo in snow (replaced the old blurry clip) + real scene audio |
| Wild | Frog | Ribbit | true | croaks on camera |
| Wild | Alligator | Hiss | false | clip + real alligator hiss in sync |
| Wild | Crocodile | Hiss | false | feeding-pond clip + real scene audio (not an isolated hiss, honest gap); 5 photos |
| Dinosaurs | T-Rex | Roar | false | real film of the Natural History Museum London life size animatronic T-Rex (muted, brightened) + its own roar pulled from the clip's loudest moment |
| Dinosaurs | Raptor | Screech | false | real film of an NHM animatronic raptor (muted, brightened) + its own screech from the clip |
| Wild | Tiger | Roar | false | ~35s clip of a tiger swimming/playing in a pool (muted); the only real tiger recording on Commons was an aggressive snarl (wrong for the calm framing), so the button speaks its name instead (NO_SOUND) |
| Wild | Snake | Hiss | false | ~20s clip of a rat snake on the ground (muted); no honest snake recording on Commons, so the button speaks its name |
| Ocean | Fish | Blub | false | ~35s clownfish-in-anemone clip (muted); silent animal, button speaks its name |
| Ocean | Dolphin | Click | false | ~35s bottlenose dolphin clip (muted) + a real field recording of dolphin whistles in sync |
| Ocean | Shark | Swish | false | ~24s gentle whale-shark clip (muted); silent animal, button speaks its name |
| Ocean | Turtle | Splash | false | ~37s green sea turtle clip (muted); silent animal, button speaks its name |
| Ocean | Jellyfish | Float | false | ~18s moon-jellyfish clip (muted); silent animal, button speaks its name |

The five existing videos were re-sourced longer and clearer in this build: lion (~40s male lion walking toward camera), bear (~27s wild brown bear fishing for salmon in Alaska), horse (~36s horse grazing), alpaca (~40s alpacas in a paddock), and peacock (~40s peacock display). They stay muted with their real sound in sync; an on-camera roar/neigh at 40s was not available on Commons, so the roar, neigh, and call play clearly in sync rather than from the clip's own audio.

`VIDEO_SOUND` (the true, hear-on-camera set) in animals.js is: `dog, cat, sheep, pig, chicken, monkey, bird, frog, donkey`. Everything else uses a muted clip with a synced sound. `NO_SOUND` is `{ alpaca, snake, tiger, fish, shark, turtle, jellyfish }`: animals with no honest, calm `sound.m4a`, so their `hasSound` is false and the button speaks the name. All 32 animals are `ready:true`. A `LOUD` set `{ bear, lion, trex, raptor, macaw, peacock, dolphin }` plays those big calls at 0.6 volume, and the core fades every sound in over about 140 ms, so a roar or squawk never startles a child held close to the device (Calm). `playSound(src, onend, vol)` carries the per-animal `vol`.

**Dinosaurs are extinct,** so no real living footage or real sound exists. With the parent's explicit choice, the two dinosaurs use real film of life size moving museum models (animatronics from the Natural History Museum, London), framed honestly in the child and parent text as animals from long ago. No copyrighted movie footage is used, so the app stays clean to share or sell. They are never presented as living animals.

### The detail page, top to bottom
(a) hero video: tap to play, no autoplay, no loop, a calm "watch again" poster when it ends. For false animals the clip is muted and the real sound plays in sync the moment it starts (an animal with `hasSound:false`, the alpaca, plays no file and stays silent on video). (b) a big "Hear the X" button that plays the real sound, lights the written name as it is spoken, then invites "Can you say X?" and falls silent; if `hasSound` is false it skips the file and warmly speaks the name. (c) a photo gallery, tap to enlarge; in the enlarged view you move between an animal's photos with the keyboard arrows, the on-screen prev/next arrows, a swipe, or a tap on the picture (a position counter shows where you are), and it closes on Escape, the X, or a tap on the dark edge, returning focus to the thumbnail. (d) a short toddler line read aloud (only the core sentence is spoken; the fuller text stays on screen) plus a grown-up note. (e) the Grown-Up Card. (f) a large back control. The page does not speak on its own; the first sound is always a deliberate tap.

### The matching game (#/game)
Starts at two choices and widens to three after a correct round. Distractors are drawn from the target's own group when possible (a real same-group discrimination), and alligator and crocodile are never shown together because they look alike. The target is biased toward animals already visited this session. A wrong tap never shakes or says "try again"; instead it gently re-invites and lights up the correct tile (redirection, not correction).
**Correct-answer celebration:** on the right tap the winner's photo grows big (scale 1.42 with a soft overshoot easing, a soft mint "correct" ring) and becomes the focus while the other choices gently fade. A short blush petal burst fires once. Then audio plays strictly in sequence so nothing collides: the grow settles (~620ms), the animal's REAL recorded sound plays (the same `sound.m4a` as its detail page, at its per-animal volume; the alpaca, with no recording, skips straight to praise), a 250ms breath, then a soft, slightly higher, slower spoken "Yes! This is the [name]!", then a gentle fade to the next round. A row of five soft stars lights one per correct answer (light progress, no score). Every step has an `onend` plus a `setTimeout` fallback and a guard flag, and a master safety net, so the round always advances even if an audio event silently dies on iOS. A `token` guards against stale timers crossing rounds.

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
- `vidinfo URL` probe one candidate (duration, audio presence, loudness, size) before committing, so you can pick a source long enough for a 40s clip.
- `makevideo KEY URL [DUR] [SS] [AUDIO]` build `hero.mp4` + `poster.jpg` from an explicit chosen URL, trimming the window `[SS, SS+DUR]` (AUDIO = on/off/auto). Use this for a specific 40s clip, a specific window (the moment it vocalises), or to mute a clip you will pair with a synced sound.
- `autoaudio KEY "terms" "syn"` make `sound.m4a`.
- `makeaudio KEY URL` make `sound.m4a` from an explicit chosen audio URL (use when the auto picker would grab a word-pronunciation file or a song; this build hit `De-Tiger2.ogg`, a German word file, and `Swimming with the dolphins`, an Antti Luode music track).
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
Asset URLs carry a cache query so updates always show. There are two independent counters: `ASSET_V` in `animals.js` (currently `"?v=10"`) busts only the animal media, and the `?v=N` on the core/module files in `index.html` (currently `v=17`) busts the code. After replacing a hero, poster, sound, or photo bump `ASSET_V`; after editing core.css/core.js/animals.js/meals.js bump the `?v=N` in index.html. Then reload.

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
Module 1, Animals: 32 animals, all live, in five groups, Farm and Home, Birds (parakeet, macaw, peacock), Wild (now also tiger and snake), Ocean (fish, dolphin, shark, turtle, jellyfish), and Dinosaurs (T-Rex and raptor). The alpaca and the quiet sea animals speak their name. The enlarged photo viewer moves between photos with the keyboard arrows, on-screen arrows, swipe, or tap. The matching game has a full correct-answer celebration (the winner's photo grows, its real sound plays, then a soft spoken "Yes! This is the [name]!", with lit progress stars). Design, media, the matching game, and the co-play refinements are complete and verified in the browser.

**This build (videos, new animals, vocalization labels, boy/girl theme).** Added seven animals with real, sighted-verified media: tiger (clear pool clip; speaks its name, see the tiger row in section 8), snake (speaks its name), and an Ocean group of fish (clownfish), dolphin (+ a real Felix Blume dolphin recording, played at the quieter LOUD volume), shark (whale shark), turtle, and jellyfish. Re-sourced the five existing videos to longer, clearer clips of roughly 27 to 40 seconds (lion, alpaca, peacock ~40s; horse ~36s; bear ~27s; see section 8). The detail-page kicker now shows the correct vocalization term (Bark, Roar, Neigh, Hiss, ...). Added a **boy/girl theme toggle** in the top bar: the default is the rose "First Light" (girl); one tap switches to the light-blue "Clear Morning" (boy), saved in `localStorage` (`chloe_theme_v1`) so a friend who sets it keeps it. Verified in the live preview (both themes, new groups, new detail pages, all hero videos serving). Honest limitation: a 40s clip of a bear or horse vocalising on camera was not available on Commons, so those calls play clearly in sync rather than from the clip's own audio; snake and the quiet sea animals have no recording and speak their name.

**Council review (this build).** A six-expert panel (child-development + zoology, WCAG accessibility, front-end QA, art direction, nutrition regression, media/licensing) audited the build, each finding adversarially verified against the real code. Fixed from it: darkened `--muted`/`--accent`/`--sage` to clear WCAG 4.5:1 for small text in both themes; added a global `:focus-visible` ring; cooled the boy theme's remaining warm chips (topbar, tile label, hero cap, lightbox counter) and moved the iron/safe-prep cluster and the name-glow flash onto theme-aware tokens (`--warn-ink`/`--warn-rgb`, `--name-flash`); the tiger now speaks its name because the only real tiger recording was an aggressive snarl; deleted an orphan snake `sound.m4a` (it was a German word-pronunciation file that contradicted the docs); fixed the snake copy word (`say` "Ssss" so the toddler copies the sound, kicker still "Hiss"); gave the peacock the specific term "Honk"; added the dolphin to LOUD for a gentler volume; fixed the empty "Main" line on every meal card (now derived from the first ingredients); added stopSound on navigation; gave the game choice buttons accessible names; and reconciled the stale doc lines. Open pre-sale items remain as listed below (Pixabay footer, per-asset attribution, NHM clearance).

**Redesign (this build):** the whole app moved from the dark gold "Golden Hour Cinema" theme to the light, sophisticated rose "First Light" theme (see sections 1 and 7), grounded in a researched art-direction pass. Added: the ambient dawn layer and gentle scroll-reveal motion, a softer cuter toddler voice, and the game celebration above. Verified in the live preview across home, detail, game, and meals on desktop and mobile, with no console errors. A latent bug was fixed in passing: the recipe "Shopping list for this meal" button SVG was unsized and rendered huge; it is now in the icon-sizing rule.
Module 2, Meal Plans: built and live. A parent-facing daily planner with three options per meal slot (two simple, one a bit more), one or two snacks, and 54 meals across seven cuisines (including French and Dutch). Tap any card to open its full recipe (detailed ingredients with quantities and step-by-step prep), then the detailed per-meal shopping list one tap further. Full allergy / dislike / cuisine / quick / iron customization saved per child, per-aisle shopping lists with quantities, plate-balance and why-it's-good touches, a Surprise me, and a professional-sources panel (AAP, CDC, WHO), all built on the family's established 14 day plan. Reviewed by an infant-nutrition council and corrected for it: every card carries a structural Safe prep line, allergens are derived from ingredients so a mis-tag cannot expose an allergic child, the iron tag reflects real iron sources, and a daily-iron nudge fires if filters remove every iron meal. The detailed recipes were generated and dietitian-verified by the `chloe-meal-recipes` workflow. Sanity-checked click by click (day tabs, every filter including French and Dutch, tap-to-open recipe, favourites vs card tap, all shopping lists, Surprise me, overlay close and focus trap, the all-allergens and no-iron edge cases, and persistence) and meal by meal (all 54 recipes present, no honey/added salt/added sugar, eggs fully cooked, fish de-boned).
The shareable package is at `../Chloe-World-final.zip` (excludes internal dev docs).

A five-expert council review (early-childhood/AAP, zoology, UX/accessibility, product/licensing, code/QA) ran on this build. Fixed from it: the monkey sound (ape to real monkey), the peacock word (Honk honk to May-awe to match its text and real call), loud calls softened and faded in, pinch-zoom restored (WCAG 1.4.4), the photo lightbox hardened (closes on navigation, focus trap, focus moved into the dialog, per-photo alt text, bigger close button), a reduced-motion static "playing" cue and name highlight, the alligator/crocodile same-and-different comparison completed, the session break nudge made timer-based at ~7 minutes, and small copy and comment cleanups.

STILL OPEN before a commercial sale (owner decisions, not yet done): complete per-asset attribution for all 32 animals (only the dog is fully documented in CREDITS.md); replace or relicense the remaining Pixabay-licensed assets (dog hero, dog photos, original cow photo) and then drop Pixabay from the footer; and confirm commercial clearance for the Natural History Museum animatronic dinosaur footage (the depicted animatronic model is a separate copyrighted work, distinct from the videographer's CC licence). The product is polished and accurate for family use; it is not yet licensing-cleared for sale.

Planned after Meal Plans: a daily and weekly development calendar, on this same core.
