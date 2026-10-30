# Changelog

## Unreleased

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
