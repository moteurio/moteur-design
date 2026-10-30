# @moteurio/design

The design system behind Moteur's apps and site: two looks as CSS variables, their fonts, and
the motion that goes with them. It has no framework and no runtime dependencies, so anything
that can load a stylesheet can use it.

## Guides

- [Foundations](docs/foundations.md): colour roles, type, spacing, radius, borders, elevation,
  focus, icons and layout, in both looks.
- [Motion and moments](docs/motion.md): every named motion, its markup, reduced motion and the
  helper.
- [Writing](docs/writing.md): voice and tone in English and French.

## Install

```sh
pnpm add @moteurio/design
```

## Three layers

**Tokens.** Colours, type, spacing, radii, shadows and motion for each look, as CSS variables on
`:root`. Component CSS reads one set of names whatever the look.

```css
@import '@moteurio/design/looks.css';
@import '@moteurio/design/fonts/discotheque.css';
```

The same values are available to scripts, and as JSON:

```js
import { looks, motion } from '@moteurio/design';
```

**Moments.** Every named motion (a press, a toast, a seal, a drawer unfolding) as CSS keyed on
`data-moment`, `data-state` and `data-part`. Most of them need no script.

```css
@import '@moteurio/design/moments.css';
```

```html
<button data-moment="press copied" data-state="done">…</button>
```

**Helper.** A small ES module for the few moments CSS can't do alone: a title flying from a list
into the editor, a counter rolling its digits, press and hold, a toast's timer. It can be
tree-shaken.

```js
import { flight, toastTimer } from '@moteurio/design/motion';
```

Every moment, its markup and the helper's functions are described in
[docs/motion.md](docs/motion.md).

## Looks and themes

Discothèque is the default look and needs no attribute. Folio is set with `data-look="folio"` on
`<html>`.

Each look has a light and a dark theme. Without an attribute the system setting decides;
`data-theme="light"` or `data-theme="dark"` on `<html>` forces one.

Folio's fonts are separate, so a page loads them only when someone picks Folio:
`@moteurio/design/fonts/folio.css`.

## Reduced motion

Moments follow the system's reduced-motion setting, and `data-motion="reduce"` or
`data-motion="full"` on `<html>` overrides it. Under reduced motion nothing travels, grows,
bounces or repeats, fades and drawn lines stay short, and timers run as usual. Component CSS can
follow the same rule with `--travel`, `--loop` and `--motion-cap`; see
[docs/motion.md](docs/motion.md).

## Linting with stylelint

`@moteurio/design/stylelint` is a stylelint config that keeps an app's CSS on the tokens. Install
stylelint (17 or later) and extend it:

```js
// stylelint.config.js
export default { extends: ['@moteurio/design/stylelint'] };
```

It turns on no style or formatting rules, only these:

- **Raw colours**: hex, named colours (`transparent` and `currentColor` are fine) and colour
  functions (`rgb()`, `hsl()`, `oklch()` and the rest). Use a colour variable.
- **Raw motion** (`moteur/motion-tokens`): a duration or delay written in `ms` or `s`, or a
  `cubic-bezier()` or `linear()` curve, in `transition` and `animation` and their longhands. `0s`,
  `inherit` and anything inside `var(…)` pass.
- **Killing motion** (`moteur/no-motion-kill`): durations above zero and under 10 ms, like
  `animation-duration: 0.01ms`, and, for reduced motion, `animation: none`, `transition: none` or
  `!important` on an animation or transition. These skip moments and fire timers at once; reduce
  motion with `--travel`, `--loop` and `--motion-cap` instead (see
  [docs/motion.md](docs/motion.md)).
- **Keyframes that move** (`moteur/keyframes-travel`): `transform`, `translate`, `scale` or
  `rotate` in `@keyframes` without `var(--travel)` in a `calc()`, so the move would still happen
  under reduced motion. Values that move nothing (`none`, `scale(1)`) pass.

An app that keeps colour values in a token file of its own turns the colour rules off there:

```js
export default {
  extends: ['@moteurio/design/stylelint'],
  overrides: [
    {
      files: ['src/tokens.css'],
      rules: { 'color-no-hex': null, 'color-named': null, 'function-disallowed-list': null },
    },
  ],
};
```

For a real exception, disable one rule for one line and say why:
`/* stylelint-disable-next-line moteur/keyframes-travel -- a timer, not travel */`.

## Editor help

The package has VS Code custom data, generated from the tokens and the moments: hover a variable
to see what it's for and its value in each look and theme, and get completions for every
`--variable` and for the `data-moment`, `data-state`, `data-part`, `data-look`, `data-theme` and
`data-motion` attributes. Add the files to `.vscode/settings.json`:

```json
{
  "css.customData": ["./node_modules/@moteurio/design/vscode/css-custom-data.json"],
  "html.customData": ["./node_modules/@moteurio/design/vscode/html-custom-data.json"]
}
```

## Building and checking

The CSS and JS for the looks are generated from `tokens/*.json`, and so are the contrast tables in
[docs/foundations.md](docs/foundations.md) and the files in `vscode/`:

```sh
pnpm build   # writes css/discotheque.css, css/folio.css, css/looks.css, js/tokens.*, vscode/*
             # and the contrast tables
pnpm check   # fails if any of those are out of date, if a colour pair is below its contrast,
             # or if moments.css breaks the stylelint config
pnpm test    # plays every moment in a browser, in both looks, with and without reduced motion
```

`css/moments.css` and `js/motion.js` are written by hand.

**Contrast.** `tokens/contrast.json` lists the colour pairs that must stay readable, each with its
minimum: 4.5:1 for text, 3:1 for large text and for focus rings and the edges of controls. The
check measures every pair in both looks and both themes, on the values the generated CSS gives
each variable, and prints a table of the pairs that fall short.

**Reduced motion.** `pnpm test` opens `test/fixture/`, a page with one live example of each
moment, in Chromium through `playwright-core`, and plays them all. In each look, with reduced
motion and without, it checks that the page logs no errors, that what each moment leaves on screen
ends visible, that the toast lasts its full time and that `--travel` is 0 only under reduced
motion. If the browser is missing: `pnpm exec playwright-core install chromium`. To look at the
page yourself: `node test/fixture/serve.mjs`.

## License

MIT
