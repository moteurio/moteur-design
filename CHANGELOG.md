# Changelog

## Unreleased

- A highlighted panel: `--panel-highlight`, `--on-panel-highlight` and
  `--shadow-panel-highlight`, for a big panel that calls for you. In Lights on they are mustard,
  on-mustard and no shadow, as before; in Lights off, mustard-soft, ink and a mustard offset
  shadow, so a wall of mustard no longer glares. Full `--mustard` stays for selections, counts and
  small highlights. Folio gives them `accent-soft`, `accent-text` and no shadow. Text and focus
  rings on the panel are checked contrast pairs.
- docs/motion.md: text sits straight at rest. Anything that holds words leans only as it arrives,
  through `--enter-turn`, and settles straight; objects (stamps, photos, pins) may keep an angle.
- The arrival is public: `moteur-enter` and `moteur-leave`, set with `--enter-x`, `--enter-y`,
  `--enter-scale`, `--enter-turn`, `--enter-opacity` and their `--leave-*` twins (registered, so
  they don't inherit), and `--motion-snap`, `--motion-pop`, `--motion-settle`, `--motion-glide`,
  `--motion-drift`, `--motion-pen` and `--motion-linger`, the duration tokens with
  `--motion-cap` applied. They replace the internal `--m-x`, `--m-y`, `--m-s`, `--m-r`, `--m-o`
  and `--m-snap` to `--m-pen`. `moteur-leave` can now turn and keep some opacity too.
- The `flash` moment, for something you just changed: its background takes `--flash` and fades
  (Discothèque hits in marigold; Folio's wash soaks in and dries), and still shows under reduced
  motion. `flash(el)` in the helper plays it, again on an element already marked; the
  `moteur-flash` keyframe is public for use outside the moment.
- `moteur/motion-tokens` flags an uncapped duration token on a `moteur-` keyframe, such as
  `moteur-enter var(--spring-pop-duration)`, and says which `--motion-*` to use.
- Code wells: `--code`, `--on-code`, `--on-code-muted`, `--code-rule`, `--code-keyword`,
  `--code-string`, `--code-function` and `--code-focus`, a dark panel for code in both looks and
  both themes, with its syntax colours (Folio's names: `code`, `code-text` and so on). Their
  contrast pairs are checked, and `--code-focus` is the focus ring inside a well: Folio's light
  `--focus` was 2.7:1 there.
- `@moteurio/design/contrast`: the contrast checker's `ratio(fg, bg)` and `shown(ratio)`, so an
  app can check colour pairs of its own the same way.
- Folio on part of a page: `data-look="folio"` on any element gives it Folio's variables whatever
  the page's look, in the page's theme or in its own `data-theme`. Moments keep the page's look.
- `pnpm check` checks colour contrast: the pairs in `tokens/contrast.json`, in both looks and both
  themes, measured on the values the generated CSS gives each variable. The contrast tables in
  `docs/foundations.md` are written from the same list.
- Discothèque's focus ring has an ink edge: `--focus-edge` (on-mustard ink in Discothèque,
  transparent in Folio) fills the 2px gap inside the mustard ring, drawn with
  `box-shadow: 0 0 0 2px var(--focus-edge)`. Mustard alone was 1.8:1 on Lights-on paper.
- `--on-avocado` for large text on avocado: ink in Lights on, Lights-off paper in Lights off,
  where ink was 2.0:1. In Folio it is `on-success`.
- `@moteurio/design/stylelint`: a stylelint config that flags raw colours, raw motion durations
  and curves, ways of killing motion, and keyframes that move without `--travel`. stylelint is an
  optional peer dependency.
- VS Code custom data in `vscode/`: every CSS variable with its usage and values per look, and the
  moment attributes with their values.
- `pnpm test`: every moment played in Chromium, in both looks, with and without reduced motion.
- `moments.css`: under reduced motion, the fades that replace the arrival ring and the confetti
  last `var(--motion-cap)` rather than a written 200 ms (the same length).

## 0.1.0

The first version.

- Two looks as CSS variables: Discothèque (the default, on `:root`) and Folio
  (`data-look="folio"`), each with a light and a dark theme. Folio gives its own values to
  Discothèque's variable names, so component CSS reads one set of names.
- Self-hosted fonts for each look: `fonts/discotheque.css` and `fonts/folio.css`.
- Tokens for scripts (`js/tokens.js`, with types) and as JSON (`tokens/*.json`).
- Motion tokens per look: durations and curves, the pop and settle springs compiled to CSS
  `linear()`, and the pen for lines that draw themselves.
- `moments.css`: every named moment in docs/motion.md, in both looks, with reduced motion done
  through `--travel`, `--loop` and `--motion-cap` rather than skipping animations.
- `@moteurio/design/motion`: a small helper for the moments CSS can't do alone (`play`, `slide`,
  `count`, `hold`, `toastTimer`, `flight`, `growFrom`, `bin`, `switchLights`).
