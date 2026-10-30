# Motion and moments

Everything that moves in a Moteur app, by name. Each look moves with its own character:

- **Discothèque** is print you can touch: things pop, thud and bounce once.
- **Folio** is ink that draws itself: calm and quick, nothing bounces, and each moment has one
  flourish (a tick, an edge line or a ring that writes itself).

Motion comes in three layers, and most of it needs no script at all:

| Layer   | File                      | What it gives                                                     |
| ------- | ------------------------- | ----------------------------------------------------------------- |
| Tokens  | `looks.css` (both looks)  | durations, curves, springs as CSS `linear()`, the pen             |
| Moments | `moments.css`             | every named moment below, keyed on `data-moment` and `data-state` |
| Helper  | `@moteurio/design/motion` | the few things CSS can't do alone (about 3 KB, no dependencies)   |

```css
@import '@moteurio/design/looks.css';
@import '@moteurio/design/moments.css';
```

## Tokens

| Variable                                      | Discothèque       | Folio            | Use                              |
| --------------------------------------------- | ----------------- | ---------------- | -------------------------------- |
| `--duration-snap`, `--ease-spring`            | 120 ms, overshoot | 100 ms, standard | presses, hovers, toggles         |
| `--duration-pop`                              | 320 ms            | 150 ms           | menus, popovers, chips appearing |
| `--duration-glide`, `--ease-glide`            | 360 ms            | 250 ms           | panels, drawers, rows moving     |
| `--duration-drift`, `--ease-drift`            | 600 ms            | 400 ms           | things arriving on their own     |
| `--spring-pop`, `--spring-pop-duration`       | spring 400/22     | spring 380/36    | things you caused appearing      |
| `--spring-settle`, `--spring-settle-duration` | spring 420/20     | spring 520/42    | things landing after a move      |
| `--ease-pen`, `--duration-pen`                | 340 ms            | 420 ms           | lines that draw themselves       |
| `--ease-shake`                                | shake curve       | (same)           | error shake only (Discothèque)   |

Springs are compiled to `linear()` at build time, so `transition: scale var(--spring-pop-duration) var(--spring-pop)` is a real spring.

### Choosing a duration

- The further something travels or the bigger it gets, the longer it takes: snap for a button,
  pop for a chip or a menu, glide for a panel, drift for anything that arrives on its own.
- Entering uses the look's entering curve (a spring in Discothèque, standard in Folio). Leaving is
  always quicker and never springs: `--duration-snap` with `--ease-glide`.
- Things you caused answer at once. Things that happen on their own (presence, live updates) drift
  in, so they never feel like they came from your click.

## Reduced motion

When someone asks for less motion (the system setting, or `data-motion="reduce"` on `<html>`):

- **Nothing travels, grows, bounces or repeats.** Every moment ends where it would have ended.
- **Fades, colours and drawn lines stay**, 200 ms at most, so every state change is still seen.
- **Timers and progress run as usual**: a toast still counts down, a hold still fills.
- **Nothing is skipped.** A toast that shows for 5 s still shows for 5 s.

`moments.css` does this with three variables, so a component's own CSS can follow the same rule:

```css
:root {
  --travel: 1; /* 0 under reduced motion: multiply distances, scales and turns by it */
  --loop: infinite; /* 1 under reduced motion */
  --motion-cap: 100s; /* 200ms under reduced motion: min(var(--duration-pop), var(--motion-cap)) */
}
```

`data-motion="full"` on `<html>` ignores the system setting (for a "Motion: full" preference).

Never end animations instantly with `animation-duration: 0.01ms !important`: it makes timers
fire at once and closes toasts before anyone sees them.

The stylelint config (`@moteurio/design/stylelint`, see the README) flags that trick, raw
durations and curves, and keyframes that move without `--travel`.

## A moment budget

- One moment per action. Publishing gets the stamp; it doesn't also get a toast and confetti.
- Never two moments at the same time in the same place.
- Moments are for things that matter: the first publish, approvals, sign-in. Saving the hundredth
  time is a micro-interaction, not a moment.
- Every moment says something in words too (a label, a toast, `aria-live`). Motion is never the
  only signal.

## The catalogue

Three kinds:

- **Micro-interactions** belong to a component and happen every time.
- **Moments** are named events, rarer and with more character.
- **Transitions** are how one view becomes another.

Attributes: put `data-moment="<name>"` on the element; one element can carry more than one,
space-separated (`data-moment="press save"`). States are `data-state="busy|done|failed"` unless
noted. Parts are children marked `data-part="<part>"`; every part is optional unless the moment
can't work without it. Lines that draw themselves are SVG paths (or circles) with `pathLength="1"`
and `data-part="ink"`.

Moments move things with `transform` and set the `animation` or `transition` of the elements they
name. Position those elements with `translate` or `inset`, and leave their animation and
transition to the moment. Settings are CSS variables a component can set on its own element.
Names starting with `--m-` are internal.

### Micro-interactions

| Name          | Lives in                  | Markup and states                                                                                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `press`       | Button                    | `data-moment="press"`; reacts to `:active` and `data-pressed`. Discothèque presses into its shadow (`--press`; set it lower on a button without one), Folio sinks 1 px and darkens a shade. Lands in 90 ms and lets go 90 ms later at the earliest. `data-state="busy"` shows the busy cue: stripes roll inside (Discothèque), a line runs along the bottom (Folio). |
| `switch`      | Switch                    | part `thumb`, on/off from `aria-checked` (or a checked input inside); the thumb stretches while pressed (6 px / 4 px), then lands with `--spring-pop`. Settings: `--switch-thumb`, `--switch-travel`, `--switch-stretch`.                                                                                                                                            |
| `slide`       | Segmented, Tabs           | part `indicator`, placed by `slide()` through `--x` and `--w`; glides between options.                                                                                                                                                                                                                                                                               |
| `field-error` | TextField, every field    | on the box around the input; `data-invalid`: Discothèque shakes once, Folio draws a rust line under the field. Part `message` (inside, or a sibling after it) drops in (Folio: rises).                                                                                                                                                                               |
| `save`        | SaveButton                | `data-state="dirty\|busy\|done\|failed"`; dirty shows a dot (part `dot`) that pings once, busy shows the busy cue, done draws a tick (part `ink`), failed shakes (Folio: a rust line along the bottom). `data-shortcut` flashes the press when ⌘S was used. This is also the unsaved state and the ⌘S press.                                                         |
| `copied`      | CopyButton                | part `icon` holds the copy glyph and the tick's SVG (the one with part `ink`) in one centred cell; `data-state="done"` swaps them and draws the tick. Part `tag` ("Copied") rises and fades after a second.                                                                                                                                                          |
| `counter`     | Count, Badge              | `count(el, value)` rolls the digits that changed; it fills the element with digit columns (part `digit`), so the element holds only the number.                                                                                                                                                                                                                      |
| `code-cells`  | CodeField                 | parts `cell` (`data-filled`), each holding its digit in a child element; `data-state="done"` closes the gaps and draws a tick; `failed` shakes or edges in rust, then the digits leave right to left (clear them after about 1 s).                                                                                                                                   |
| `hold`        | Button `intent="destroy"` | `hold(button, {ms, onConfirm})`; part `fill` grows while held, drains if released early. The button gets `data-state="busy"` while held and `done` at the end.                                                                                                                                                                                                       |

### Moments

| Name          | Lives in            | Markup and states                                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toast`       | Toast               | enters from below; part `timer` is the clock (`--toast-time`, 5 s): `toastTimer(el)` resolves when its bar runs out and pauses on hover and focus. `data-state="leaving"` exits; remove the toast on `animationend`.                                                                                                                |
| `stamp`       | Stamp (Discothèque) | thuds down with a slight turn when added, and lifts off after 1.8 s; the page gives a 2 px jolt (`data-moment="thud"` on the container, which jolts when a stamp lands in it or on `data-state="done"`).                                                                                                                            |
| `seal`        | StatusPill          | Folio's publish, and approve and schedule in both looks. `data-state="done"`: part `fill` sweeps in, the `ink` writes itself in order (a ring, then a tick), part `rays` sparks once, part `edge` draws down the card, part `label` firms up, part `badge` pops onto an avatar. `failed` (changes asked) does the same without ink. |
| `change-mark` | ChangeMark          | something someone else just changed, when added: part `bar` draws down the edge, part `highlight` sweeps the words, then both fade over about 4 s.                                                                                                                                                                                  |
| `milestone`   | Celebration         | first publish and other firsts, when added: part `card` lands, its `ink` seal draws, one burst: ten strips in part `confetti` (Discothèque) or part `rays` (Folio). `data-state="leaving"` fades it.                                                                                                                                |
| `arrival`     | PresenceStack       | someone joins: their avatar slides into the stack, then part `ring` pings three times (Discothèque) or its `ink` circle draws itself around the avatar (Folio).                                                                                                                                                                     |
| `curtain`     | Sign-in page        | `data-state="done"` when signed in: the five children of part `bands` sweep up and lift away (Discothèque); part `card` steps back and part `view` (the Studio) rises (Folio).                                                                                                                                                      |
| `develop`     | Upload tile         | an uploaded image develops like a print with the upload: set `--progress` (0 to 1). Part `image` goes from soft to sharp (Folio: grey to colour), part `progress` fills; `data-state="done"` flashes (Discothèque) or draws the `ink` tick in part `badge` (Folio).                                                                 |
| `pen`         | AI suggestion diff  | when added, part `del` gets a line drawn through it, then part `ins` writes itself in, underline and all. `data-state="done"` (accepted) folds `del` away and settles `ins` into plain ink.                                                                                                                                         |
| `wind`        | Schedule button     | `data-state="done"`: part `minute` winds two turns and part `hour` three quarters, landing on `--hour` (270deg by default); then the pill (a `seal`) reads the time.                                                                                                                                                                |

### Transitions

| Name           | Lives in              | How                                                                                                                                                                                                                                        |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title-flight` | List → editor route   | `flight(from, to)`: the entry's title flies from its row into the editor's heading.                                                                                                                                                        |
| `grow-from`    | Create → editor route | `growFrom(button, view)`: the new editor grows out of the "+ New" button, and back on the way out (`{back: true}`).                                                                                                                        |
| `unfold`       | Drawer, Disclosure    | `data-state="open"`: height and opacity, with `@starting-style`; Discothèque settles with a spring.                                                                                                                                        |
| `dialog`       | Dialog, Popover, Menu | Discothèque rises 16 px with `--spring-pop` and its shadow grows as it lands; Folio rises 8 px from 98% with `--spring-settle`. The backdrop (`::backdrop`, or part `backdrop` next to the panel) fades. `data-state="leaving"` closes it. |
| `bin`          | Rows in every list    | `bin(row)`: the row slides out and the gap closes; undo, `bin(row, {back: true})`, brings it back, then mark it with a `change-mark`.                                                                                                      |
| `lift`         | Sortable lists        | `data-state="lifted"`: the row rises and tilts (Discothèque) or lifts 1.5% with a shadow (Folio).                                                                                                                                          |
| `wait`         | Skeleton              | appears only after 200 ms, so fast loads show no skeleton at all; parts `bone` shimmer, and stop under reduced motion.                                                                                                                     |
| `lights`       | Theme switch          | `switchLights(apply, {x, y})`: the new theme spreads as a circle from the switch (View Transitions); Folio and reduced motion cross-fade.                                                                                                  |

### Site

| Name     | Lives in | How                                                                                                                                                                                                                                                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ticker` | LiveBand | part `track` scrolls (give it two copies side by side; `--ticker-time`, 70 s); stops while the element holding it is hovered or focused (a Play button beside it doesn't pause it) and with `data-state="paused"`; under reduced motion it starts paused and `data-state="running"` plays it. Part `dot` pulses while it runs. |

## The helper

```js
import {
  play,
  reduced,
  spring,
  slide,
  count,
  hold,
  toastTimer,
  flight,
  growFrom,
  bin,
  switchLights,
} from '@moteurio/design/motion';
```

| Function                        | Does                                                                                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reduced()`                     | whether motion is reduced right now (system setting or `data-motion`).                                                                                                                               |
| `play(el, frames, options)`     | `el.animate()` with the reduced-motion rule built in. `options.info: true` marks a timer or progress, left alone. `fill` defaults to `backwards`; the promise carries the Animation as `.animation`. |
| `spring(name)`                  | `{duration, easing}` of `pop`, `settle` or `pen` in the current look.                                                                                                                                |
| `slide(indicator, target)`      | moves a `slide` indicator to `target` (sets `--x` and `--w`).                                                                                                                                        |
| `count(el, value)`              | rolls a `counter` to `value`; returns a promise.                                                                                                                                                     |
| `hold(button, {ms, onConfirm})` | press and hold to confirm, with Space and Enter; returns a cleanup function.                                                                                                                         |
| `toastTimer(el)`                | resolves when the toast's timer bar runs out; the timer is the animation, so hovering pauses both.                                                                                                   |
| `flight(from, to)`              | flies `from`'s look into `to` (a cross-fading ghost); waits while one flight is still running.                                                                                                       |
| `growFrom(origin, view)`        | grows `view` out of `origin`'s box; `growFrom(origin, view, {back: true})` shrinks it back.                                                                                                          |
| `bin(row, {back})`              | slides the row out and closes its gap; resolves when done. `{back: true}` opens the gap and slides it back in.                                                                                       |
| `switchLights(apply, {x, y})`   | runs `apply()` inside a View Transition that spreads from (x, y); just calls `apply()` where unsupported.                                                                                            |

Everything returns promises that resolve when the motion is done (never rejects), so code can
`await` a moment before moving on.

`flight()`, `growFrom()` and `bin(row, {back: true})` measure both ends, so show the destination
before calling them and hide the source after they resolve. A view that sets its own `display`
(a grid list, say) doesn't hide with the `hidden` attribute unless something says so:
`moments.css` does for anything inside a moment, and a page should have
`[hidden] { display: none !important; }` for the rest.
