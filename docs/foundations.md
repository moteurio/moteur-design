# Foundations

Colour, type, space, shape, elevation, focus, icons and layout: the parts every screen is made
of. Every value here comes from `tokens/discotheque.json` and `tokens/folio.json`, and from the CSS
that `scripts/build.mjs` generates from them. When the two disagree, the JSON wins; run
`pnpm build`.

There are two looks:

- **Discothèque** (the default) is print you can touch: warm paper, thick ink outlines, hard
  offset shadows, a serif for display.
- **Folio** (`data-look="folio"` on `<html>`) is calm and conventional: cool greys, 1px borders,
  soft shadows, one sans-serif.

Each look has a light and a dark theme. Discothèque calls them "Lights on" and "Lights off";
Folio calls them "Light" and "Dark". See the README for the attributes.

## One set of names

Component CSS reads **Discothèque's variable names** whatever the look. Folio gives those names
its own values, so `var(--paper)` is warm paper in Discothèque and Folio's grey canvas in Folio.
Write component CSS with the shared names below and it works in both looks.

Folio's own token names are also available, prefixed: `--folio-canvas`, `--folio-accent`,
`--folio-presence-3` and so on (only under `data-look="folio"`). Use them only for something that
exists in Folio alone.

## Colour

### Surfaces

| Variable           | Means                                                                               | Folio role      |
| ------------------ | ----------------------------------------------------------------------------------- | --------------- |
| `--paper`          | The page ground behind everything. A page never sits on white.                      | `canvas`        |
| `--paper-raised`   | Anything that is an object on the page: cards, tiles, dialogs.                      | `surface`       |
| `--paper-sunk`     | Wells: board columns, progress tracks, skeleton base.                               | `surface-sunk`  |
| `--paper-tint`     | Hover on rows and tiles; empty translation cells; dashed drop zones.                | `surface-hover` |
| `--field`          | Inside text inputs and editors only, so typing surfaces read as paper you write on. | `field`         |
| `--chocolate`      | Discothèque's dark band: top bar, toasts, code wells. In Folio, a plain surface.    | `surface`       |
| `--chocolate-soft` | Sidebar ground; inputs inside the top bar. In Folio, a plain surface.               | `surface`       |

| Variable           | Discothèque light | Discothèque dark | Folio light | Folio dark |
| ------------------ | ----------------- | ---------------- | ----------- | ---------- |
| `--paper`          | `#F7EBD0`         | `#1C110A`        | `#F5F6F8`   | `#111418`  |
| `--paper-raised`   | `#FFFAF0`         | `#2A1A10`        | `#FFFFFF`   | `#191D23`  |
| `--paper-sunk`     | `#EFDFBC`         | `#24170E`        | `#EDEFF2`   | `#0D1014`  |
| `--paper-tint`     | `#FBEFD6`         | `#33200F`        | `#F0F3F7`   | `#222830`  |
| `--field`          | `#FFFFFF`         | `#170E08`        | `#FFFFFF`   | `#14181D`  |
| `--chocolate`      | `#3B2416`         | `#0E0805`        | `#FFFFFF`   | `#191D23`  |
| `--chocolate-soft` | `#5A3822`         | `#160D07`        | `#FFFFFF`   | `#191D23`  |

### Text and lines

| Variable               | Means                                                                                     | Folio role      |
| ---------------------- | ----------------------------------------------------------------------------------------- | --------------- |
| `--ink`                | Primary text. In Discothèque, also the 2px outline of every object.                       | `text`          |
| `--ink-muted`          | Secondary text, metadata, labels.                                                         | `text-muted`    |
| `--ink-subtle`         | Placeholders, drag grips, disabled text. Never the only copy of an instruction.           | `text-subtle`   |
| `--rule`               | Dividers between rows and fields. Decorative only.                                        | `border`        |
| `--ink-line`           | The edge of text inputs, search boxes and editors. At least 3:1 against what they sit on. | `border-strong` |
| `--on-chocolate`       | Text on `--chocolate` and `--chocolate-soft`.                                             | `text`          |
| `--on-chocolate-muted` | Secondary text on the same.                                                               | `text-muted`    |

| Variable               | Discothèque light | Discothèque dark | Folio light | Folio dark |
| ---------------------- | ----------------- | ---------------- | ----------- | ---------- |
| `--ink`                | `#3B2416`         | `#F7EBD0`        | `#1A2029`   | `#E8EBEF`  |
| `--ink-muted`          | `#6B4F36`         | `#C9B28A`        | `#4F5A68`   | `#AAB3BF`  |
| `--ink-subtle`         | `#7A5D42`         | `#A8906C`        | `#5E6978`   | `#939DAA`  |
| `--rule`               | `#D9C49A`         | `#4A3020`        | `#DDE1E6`   | `#2C333C`  |
| `--ink-line`           | `#8A7763`         | `#8A7558`        | `#7D8794`   | `#6E7987`  |
| `--on-chocolate`       | `#F7EBD0`         | `#F7EBD0`        | `#1A2029`   | `#E8EBEF`  |
| `--on-chocolate-muted` | `#E9D6B0`         | `#C9B28A`        | `#4F5A68`   | `#AAB3BF`  |

### Action, selection and status

| Variable         | Means                                                                                                 | Folio role     |
| ---------------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| `--action`       | Primary buttons (Publish, Save, New). Pair with `--on-action`.                                        | `accent`       |
| `--on-action`    | Text on `--action`.                                                                                   | `on-accent`    |
| `--mustard`      | Selection and "needs you": the selected item, review state, highlights. Discothèque's signature fill. | `accent-soft`  |
| `--on-mustard`   | Text on `--mustard`.                                                                                  | `accent-text`  |
| `--mustard-soft` | Inserted text in diffs, freshly added rows, warning suggestions.                                      | `warning-soft` |
| `--orange`       | Decoration only: display italics at 28px and up, stripes, cursors. Never small text.                  | `accent`       |
| `--rust`         | Danger and errors: text on paper, deletions in diffs. Also Discothèque's link colour.                 | `danger`       |
| `--rust-soft`    | Background of blocking problems and deleted text.                                                     | `danger-soft`  |
| `--avocado`      | Large fills for "live" and success areas (tiles, stubs). Text on it is large and `--on-avocado`.      | `success`      |
| `--on-avocado`   | Large text on `--avocado`.                                                                            | `on-success`   |
| `--success`      | Live status and success buttons; success text.                                                        | `success`      |
| `--success-soft` | Background of live pills and "all caught up" notices.                                                 | `success-soft` |
| `--warning-ink`  | Warning text: suggestions, counters near their limit.                                                 | `warning`      |
| `--teal`         | Scheduled and informational.                                                                          | `info`         |
| `--teal-soft`    | Background of scheduled pills and info notes.                                                         | `info-soft`    |
| `--plum`         | The sixth presence colour. Never a status.                                                            | `presence-6`   |
| `--on-plum`      | Text on plum and teal fills.                                                                          | `on-presence`  |
| `--focus`        | The focus ring.                                                                                       | `focus`        |

| Variable         | Discothèque light | Discothèque dark | Folio light | Folio dark |
| ---------------- | ----------------- | ---------------- | ----------- | ---------- |
| `--action`       | `#B8491A`         | `#E57A47`        | `#1F5FC4`   | `#6EA0F2`  |
| `--on-action`    | `#FFFFFF`         | `#1C110A`        | `#FFFFFF`   | `#0D1014`  |
| `--mustard`      | `#E1A730`         | `#E1A730`        | `#E8F0FC`   | `#17253B`  |
| `--on-mustard`   | `#3B2416`         | `#3B2416`        | `#1C56B3`   | `#8DB4F5`  |
| `--mustard-soft` | `#FFF1C7`         | `#3A2A0C`        | `#FFF4DB`   | `#33270D`  |
| `--orange`       | `#D9622B`         | `#E57A47`        | `#1F5FC4`   | `#6EA0F2`  |
| `--rust`         | `#A8401A`         | `#F0A27A`        | `#B42318`   | `#F2877D`  |
| `--rust-soft`    | `#FBE6DC`         | `#3B1A0E`        | `#FDECEA`   | `#3A1714`  |
| `--avocado`      | `#7A8B3A`         | `#9DB050`        | `#18794E`   | `#5CC08F`  |
| `--on-avocado`   | `#3B2416`         | `#1C110A`        | `#FFFFFF`   | `#0D1014`  |
| `--success`      | `#56651F`         | `#9DB050`        | `#18794E`   | `#5CC08F`  |
| `--success-soft` | `#E7EDCF`         | `#232B10`        | `#E6F4EC`   | `#12301F`  |
| `--warning-ink`  | `#8F5C00`         | `#E1A730`        | `#8A5A00`   | `#E5B454`  |
| `--teal`         | `#1F4B5A`         | `#7FB3C4`        | `#0B6E85`   | `#5EC2DA`  |
| `--teal-soft`    | `#DCEBEF`         | `#10262E`        | `#E2F3F7`   | `#10292F`  |
| `--plum`         | `#7A3B5A`         | `#D9A0BC`        | `#7A3FA0`   | `#C59BE0`  |
| `--on-plum`      | `#FFFFFF`         | `#1C110A`        | `#FFFFFF`   | `#0D1014`  |
| `--focus`        | `#E1A730`         | `#E1A730`        | `#1F5FC4`   | `#6EA0F2`  |

### Roles that differ by look

A few variables name a role rather than a colour, because the two looks fill that role
differently. Prefer them to the raw colour.

| Variable                 | Discothèque              | Folio                       | Use                                        |
| ------------------------ | ------------------------ | --------------------------- | ------------------------------------------ |
| `--outline`              | `--ink`                  | `--folio-border`            | the edge of objects: cards, tables, panels |
| `--outline-control`      | `--ink`                  | `--folio-border-strong`     | the edge of controls: buttons, switches    |
| `--outline-field`        | `--ink-line`             | `--ink-line`                | the edge of a text input at rest           |
| `--outline-field-active` | `--ink`                  | `--ink-line`                | the same, hovered or focused               |
| `--divider`              | `2px dotted var(--rule)` | `1px solid var(--rule)`     | a whole `border` value between rows        |
| `--link`                 | `--rust`                 | `--folio-accent-text`       | links in text                              |
| `--inverse`              | `--chocolate`            | `--folio-inverse`           | the one dark-on-light object: toasts       |
| `--on-inverse`           | `--on-chocolate`         | `--folio-on-inverse`        | text on `--inverse`                        |
| `--on-inverse-accent`    | `--mustard`              | `--folio-on-inverse-accent` | the action word in a toast (Undo)          |
| `--selected-soft`        | `--mustard-soft`         | `--folio-accent-soft`       | a soft selection fill                      |
| `--backdrop`             | (not set)                | `--folio-overlay`           | the dimmed backdrop behind dialogs         |

`--chocolate` is white in Folio: Folio has no dark band, so the top bar and sidebar are plain
surfaces. For a toast or tooltip that must stay dark in both looks, use `--inverse`.

### Folio only

These exist as `--folio-*` variables only under `data-look="folio"`:

- `--folio-accent-hover`: primary button hover and press.
- `--folio-danger`, `--folio-on-danger`: a danger fill and its text.
- `--folio-on-success`: text on a success fill.
- `--folio-overlay`: the dialog backdrop (`rgba(16, 24, 40, 0.45)` light, `rgba(0, 0, 0, 0.6)`
  dark).
- `--folio-presence-1` to `--folio-presence-6` and `--folio-on-presence`: one colour per person on
  a screen, with initials in `--folio-on-presence` (at least 4.5:1 on all six).
- `--folio-type-article`, `--folio-type-event`, `--folio-type-media`, `--folio-type-person`: type
  squares in link chips and search results.

### Contrast pairs that are safe

Ratios are WCAG contrast, computed from the token values, light theme then dark, and rounded
down. The pairs live in `tokens/contrast.json`; `pnpm check` fails when one drops below what it
needs (4.5:1 for text, 3:1 for large text and for focus rings and the edges of controls), and
`pnpm build` writes these tables from the same list.

<!-- contrast-pairs: written by pnpm build from tokens/contrast.json -->

| Text or mark                | On                 | Needs | Discothèque | Folio       | Safe for                       |
| --------------------------- | ------------------ | ----- | ----------- | ----------- | ------------------------------ |
| `--ink`                     | `--paper`          | 4.5:1 | 12.2 / 15.6 | 15.1 / 15.4 | any text                       |
| `--ink`                     | `--paper-raised`   | 4.5:1 | 13.9 / 14.1 | 16.3 / 14.1 | any text                       |
| `--ink`                     | `--paper-sunk`     | 4.5:1 | 11.0 / 14.7 | 14.2 / 15.9 | any text                       |
| `--ink`                     | `--paper-tint`     | 4.5:1 | 12.7 / 13.1 | 14.7 / 12.4 | any text                       |
| `--ink`                     | `--field`          | 4.5:1 | 14.4 / 16.0 | 16.3 / 14.9 | typing                         |
| `--ink-muted`               | `--paper`          | 4.5:1 | 6.3 / 9.0   | 6.4 / 8.7   | any text                       |
| `--ink-muted`               | `--paper-raised`   | 4.5:1 | 7.2 / 8.1   | 7.0 / 7.9   | any text                       |
| `--ink-muted`               | `--paper-sunk`     | 4.5:1 | 5.7 / 8.4   | 6.0 / 8.9   | any text                       |
| `--ink-subtle`              | `--paper`          | 4.5:1 | 5.1 / 6.0   | 5.1 / 6.7   | any text (never the only copy) |
| `--ink-subtle`              | `--paper-raised`   | 4.5:1 | 5.8 / 5.4   | 5.5 / 6.1   | any text (never the only copy) |
| `--ink-subtle`              | `--field`          | 4.5:1 | 6.0 / 6.2   | 5.5 / 6.4   | placeholders                   |
| `--link`                    | `--paper`          | 4.5:1 | 5.2 / 8.9   | 6.4 / 8.7   | links                          |
| `--link`                    | `--paper-raised`   | 4.5:1 | 5.9 / 8.0   | 6.9 / 8.0   | links                          |
| `--on-action`               | `--action`         | 4.5:1 | 5.2 / 6.3   | 6.0 / 7.2   | button labels                  |
| `--on-mustard`              | `--mustard`        | 4.5:1 | 6.7 / 6.7   | 6.0 / 7.3   | any text                       |
| `--rust`                    | `--paper`          | 4.5:1 | 5.2 / 8.9   | 6.0 / 7.5   | error text                     |
| `--rust`                    | `--rust-soft`      | 4.5:1 | 5.1 / 7.5   | 5.7 / 6.5   | error text in a problem box    |
| `--success`                 | `--paper`          | 4.5:1 | 5.4 / 7.7   | 5.0 / 8.2   | success text                   |
| `--success`                 | `--success-soft`   | 4.5:1 | 5.3 / 6.1   | 4.7 / 6.3   | live pills                     |
| `--on-action`               | `--success`        | 4.5:1 | 6.4 / 7.7   | 5.4 / 8.5   | success button labels          |
| `--on-avocado`              | `--avocado`        | 3:1   | 3.8 / 7.7   | 5.4 / 8.5   | large text on avocado fills    |
| `--warning-ink`             | `--paper`          | 4.5:1 | 4.7 / 8.6   | 5.4 / 9.6   | warning text                   |
| `--warning-ink`             | `--mustard-soft`   | 4.5:1 | 5.0 / 6.4   | 5.4 / 7.6   | warning suggestions            |
| `--teal`                    | `--paper`          | 4.5:1 | 8.0 / 8.0   | 5.4 / 8.9   | info text                      |
| `--teal`                    | `--teal-soft`      | 4.5:1 | 7.7 / 6.8   | 5.1 / 7.3   | scheduled pills                |
| `--on-plum`                 | `--plum`           | 4.5:1 | 8.0 / 8.5   | 6.8 / 8.2   | presence tabs                  |
| `--on-plum`                 | `--teal`           | 4.5:1 | 9.4 / 8.0   | 5.8 / 9.2   | type squares                   |
| `--on-chocolate`            | `--chocolate`      | 4.5:1 | 12.2 / 16.8 | 16.3 / 14.1 | top bar                        |
| `--on-chocolate`            | `--chocolate-soft` | 4.5:1 | 8.7 / 16.2  | 16.3 / 14.1 | sidebar                        |
| `--on-chocolate-muted`      | `--chocolate`      | 4.5:1 | 10.1 / 9.6  | 7.0 / 7.9   | secondary text in the top bar  |
| `--on-inverse`              | `--inverse`        | 4.5:1 | 12.2 / 16.8 | 15.1 / 15.4 | toasts                         |
| `--on-inverse-accent`       | `--inverse`        | 4.5:1 | 6.7 / 9.2   | 7.7 / 5.7   | the action word in a toast     |
| `--ink-line`                | `--field`          | 3:1   | 4.2 / 4.3   | 3.6 / 4.0   | input edges                    |
| `--ink-line`                | `--paper`          | 3:1   | 3.6 / 4.2   | 3.3 / 4.1   | input edges                    |
| `--ink-line`                | `--paper-sunk`     | 3:1   | 3.2 / 3.9   | 3.1 / 4.3   | input edges                    |
| `--outline-control`         | `--paper`          | 3:1   | 12.2 / 15.6 | 3.3 / 4.1   | control edges                  |
| `--outline-control`         | `--paper-raised`   | 3:1   | 13.9 / 14.1 | 3.6 / 3.8   | control edges                  |
| `--focus`                   | `--focus-edge`     | 3:1   | 6.7 / 6.7   | n/a         | focus ring: the two bands      |
| `--focus` or `--focus-edge` | `--paper`          | 3:1   | 12.2 / 8.6  | 5.5 / 7.0   | focus ring                     |
| `--focus` or `--focus-edge` | `--paper-raised`   | 3:1   | 13.9 / 7.7  | 6.0 / 6.4   | focus ring                     |
| `--focus` or `--focus-edge` | `--paper-sunk`     | 3:1   | 11.0 / 8.1  | 5.2 / 7.2   | focus ring                     |
| `--focus` or `--focus-edge` | `--field`          | 3:1   | 14.4 / 8.8  | 6.0 / 6.7   | focus ring                     |
| `--focus` or `--focus-edge` | `--chocolate`      | 3:1   | 6.7 / 9.2   | 6.0 / 6.4   | focus ring                     |
| `--focus` or `--focus-edge` | `--chocolate-soft` | 3:1   | 4.8 / 8.9   | 6.0 / 6.4   | focus ring                     |

<!-- /contrast-pairs -->

Pairs to avoid:

<!-- contrast-avoid: written by pnpm build from tokens/contrast.json -->

| Text or mark | On          | Discothèque | Folio     | Why                                                               |
| ------------ | ----------- | ----------- | --------- | ----------------------------------------------------------------- |
| `--orange`   | `--paper`   | 3.0 / 6.3   | 5.5 / 7.0 | Decoration and display italics of 28px and up only.               |
| `--ink`      | `--avocado` | 3.8 / 2.0   | 3.0 / 1.8 | Use `--on-avocado`, and keep text on avocado large.               |
| `--focus`    | `--paper`   | 1.8 / 8.6   | n/a       | Mustard alone: draw the ring with its `--focus-edge` (see Focus). |
| `--rule`     | `--paper`   | 1.4 / 1.5   | 1.2 / 1.4 | Decorative: never the only edge of a control.                     |

<!-- /contrast-avoid -->

## Type

### Families

| Variable            | Discothèque                       | Folio                 |
| ------------------- | --------------------------------- | --------------------- |
| `--font-display`    | Fraunces (variable), then Georgia | IBM Plex Sans         |
| `--font-body`       | Karla (variable), then system UI  | IBM Plex Sans         |
| `--font-mono`       | JetBrains Mono (variable)         | IBM Plex Mono         |
| `--font-celebrate`  | Shrikhand                         | IBM Plex Sans         |
| `--font-empty`      | Bagel Fat One                     | IBM Plex Sans         |
| `--font-typewriter` | Courier Prime, then Courier New   | (Discothèque's value) |

The fonts are self-hosted: `@moteurio/design/fonts/discotheque.css` and
`@moteurio/design/fonts/folio.css`. Courier Prime is not bundled; it falls back to Courier New.

### Scale

The type scale is in the token JSON (`type.groups`), not in CSS variables yet. An app writes these
sizes in its own CSS. The few type variables that do exist are `--ui-size` (16px Discothèque,
14px Folio), the `--label-*` set below, and in Folio a set of `--fs-*` sizes that let CSS written
with Discothèque's sizes come out one notch denser.

**Discothèque**

| Style         | Family     | Size | Line height | Weight      | Use                                                |
| ------------- | ---------- | ---- | ----------- | ----------- | -------------------------------------------------- |
| `display-xl`  | display    | 96px | 0.9         | 900         | greetings and poster numbers; one per screen       |
| `display-l`   | display    | 56px | 0.95        | 800         | page and entry titles                              |
| `title`       | display    | 34px | 1.05        | 800         | panel and dialog titles                            |
| `section`     | display    | 24px | 1.15        | 700         | card and tile headings                             |
| `item`        | display    | 20px | 1.2         | 700         | entry names on cards, agenda rows                  |
| `voice`       | display    | 20px | 1.3         | 400 italic  | the app speaking: gentle notes, empty translations |
| `body-l`      | body       | 18px | 1.7         | 400         | rich-text editing and previews                     |
| `body`        | body       | 16px | 1.55        | 400         | default UI text, inputs                            |
| `body-strong` | body       | 16px | 1.55        | 700         | names, button labels                               |
| `small`       | body       | 14px | 1.5         | 400         | metadata, help text, table cells                   |
| `label`       | body       | 12px | 1.3         | 700, 0.12em | field labels and eyebrows, uppercase               |
| `code`        | mono       | 13px | 1.65        | 400         | endpoints, JSON, ids, keys                         |
| `kbd`         | mono       | 12px | 1.2         | 600         | keyboard hints, in a 2px ink box                   |
| `celebrate`   | celebrate  | 40px | 1           | 400         | celebrations only; at most once per session        |
| `empty`       | empty      | 38px | 1           | 400         | empty states: one line, a sentence, one action     |
| `memo`        | typewriter | 16px | 1.75        | 400         | memo-style cards                                   |

`display-xl` and `display-l` set Fraunces' optical size to 144. Letter spacing tightens as the
size grows: -0.03em, -0.02em, -0.01em.

**Folio**

| Style           | Size | Line height | Weight      | Use                                             |
| --------------- | ---- | ----------- | ----------- | ----------------------------------------------- |
| `display`       | 28px | 1.2         | 600         | the greeting and a dashboard's big numbers      |
| `entry-title`   | 26px | 1.25        | 600         | the entry's title field, larger than the chrome |
| `page-title`    | 22px | 1.3         | 600         | list and settings page titles                   |
| `section-title` | 16px | 1.4         | 600         | card, panel, dialog and form-section headings   |
| `item`          | 14px | 1.4         | 600         | entry names in rows and cards, column heads     |
| `body-l`        | 16px | 1.65        | 400         | rich text, at most 72 characters per line       |
| `body`          | 14px | 1.5         | 400         | default UI text, inputs, table cells            |
| `body-strong`   | 14px | 1.5         | 500         | names, button labels                            |
| `small`         | 13px | 1.45        | 400         | metadata, help text, badges                     |
| `label`         | 13px | 1.4         | 500         | field labels, sentence case                     |
| `overline`      | 11px | 1.4         | 600, 0.06em | sidebar group headings only, uppercase, muted   |
| `code`          | 13px | 1.6         | 400         | endpoints, JSON, ids, slugs                     |
| `kbd`           | 11px | 1.2         | 500         | keyboard hints, in a 1px box                    |

Folio has no weight above 600 and no celebration or empty-state face: those variables point at
IBM Plex Sans.

### Labels

Labels and eyebrows read four variables, so one rule works in both looks:

| Variable           | Discothèque   | Folio   |
| ------------------ | ------------- | ------- |
| `--label-size`     | 12px          | 13px    |
| `--label-weight`   | 700           | 500     |
| `--label-tracking` | 0.12em        | 0       |
| `--label-case`     | uppercase     | none    |
| `--label-color`    | `--ink-muted` | `--ink` |

Field labels have their own set, the same in both looks: `--field-label-size` 13px,
`--field-label-tracking` 0, `--field-label-case` none.

## Spacing

A 4px base. The names are steps, not pixels.

| Variable     | Value | Discothèque use                     | Folio use                            |
| ------------ | ----- | ----------------------------------- | ------------------------------------ |
| `--space-1`  | 4px   | icon to label, avatar overlap step  | icon to label, badge padding         |
| `--space-2`  | 8px   | chip gaps, button groups            | button groups, label to input        |
| `--space-3`  | 12px  | row padding, field label to input   | row padding, gaps inside cards       |
| `--space-4`  | 16px  | card padding, phone gutter          | card padding, phone gutter           |
| `--space-5`  | 20px  | tile padding, list gaps             | panel padding                        |
| `--space-6`  | 24px  | desktop gutter, sections in a panel | desktop gutter, form sections        |
| `--space-8`  | 32px  | main content padding                | main content padding on wide screens |
| `--space-10` | 40px  | between major page regions          | between major page regions           |
| `--space-14` | 56px  | above page titles on wide screens   | (Discothèque's value)                |

Folio's JSON also defines `space-12` (48px, empty-state padding), but it is not in the CSS yet;
use `calc(var(--space-6) * 2)` or write 48px.

## Radius

| Variable          | Discothèque | Folio | Use                                                                                                       |
| ----------------- | ----------- | ----- | --------------------------------------------------------------------------------------------------------- |
| `--radius-s`      | 8px         | 4px   | kbd boxes, chips, badges (Folio), thumbnails in rows                                                      |
| `--radius-m`      | 14px        | 6px   | inputs, list containers; buttons and menus (Folio)                                                        |
| `--radius-l`      | 22px        | 8px   | cards, tiles, panels, tables                                                                              |
| `--radius-xl`     | 26px        | 12px  | dialogs and the command palette                                                                           |
| `--radius-pill`   | 999px       | 999px | Discothèque: buttons, pills, segmented controls, avatars. Folio: avatars, switches, the presence dot only |
| `--radius-button` | pill        | 6px   | buttons                                                                                                   |
| `--radius-badge`  | pill        | 4px   | badges and pills                                                                                          |

Use `--radius-button` and `--radius-badge` on buttons and badges rather than picking a radius: a
button is a pill in Discothèque and a rounded rectangle in Folio.

## Borders

| Variable          | Discothèque | Folio | Use                                              |
| ----------------- | ----------- | ----- | ------------------------------------------------ |
| `--border-object` | 2px         | 1px   | the outline of every card, button and pill       |
| `--border-strong` | 3px         | 1px   | dialogs, the palette, a selected presence ring   |
| `--border-field`  | 1.5px       | 1px   | the edge of text inputs (with `--outline-field`) |
| `--stripe-band`   | 6px         | 0px   | each of the four rainbow stripes; Folio has none |

Folio's JSON also names `border-selected` (2px: a selected media card, the active tab's
underline) and `focus-width` (2px); in CSS the focus width is `--focus-ring`.

In Discothèque every object has a 2px ink outline and rows are split by dotted rules. In Folio,
objects have a 1px hairline (`--rule`) and controls a 1px stronger edge (`--outline-control`),
because a hairline is too faint to be the only edge of something you can press.

## Elevation and shadows

The two looks lift things differently. Discothèque has no soft shadows: an object that lifts gets
a hard offset in ink, like card stock on a desk. Folio separates objects with borders first, and
keeps soft, low shadows for things that float.

| Variable             | Discothèque light                 | Discothèque dark              | Folio (light)                     | Use                                    |
| -------------------- | --------------------------------- | ----------------------------- | --------------------------------- | -------------------------------------- |
| `--shadow-press`     | `3px 3px 0 #3B2416`               | `3px 3px 0 #000000`           | `shadow-xs`                       | primary buttons at rest                |
| `--shadow-lift`      | `4px 4px 0 #3B2416`               | `4px 4px 0 #000000`           | `shadow-s`                        | hovered cards, the selected nav item   |
| `--shadow-dialog`    | `8px 8px 0 #3B2416`               | `8px 8px 0 #000000`           | `shadow-l`                        | dialogs, the palette, popovers, panels |
| `--shadow-drag`      | `10px 14px 0 rgba(59,36,22,0.35)` | `10px 14px 0 rgba(0,0,0,0.6)` | `0 12px 24px rgba(16,24,40,0.18)` | anything being dragged                 |
| `--shadow-highlight` | `4px 4px 0 #E1A730`               | `4px 4px 0 #E1A730`           | `0 0 0 3px` accent-soft           | a field or preview that just changed   |

Folio's shadows, light theme (dark uses black at higher opacity):

| Folio token | Value                                                                  | Use                                        |
| ----------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| `shadow-xs` | `0 1px 2px rgba(16, 24, 40, 0.05)`                                     | buttons and inputs at rest                 |
| `shadow-s`  | `0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)`   | dashboard cards; lists and tables use none |
| `shadow-m`  | `0 4px 12px rgba(16, 24, 40, 0.10), 0 1px 3px rgba(16, 24, 40, 0.06)`  | menus, popovers, toasts                    |
| `shadow-l`  | `0 16px 40px rgba(16, 24, 40, 0.18), 0 2px 6px rgba(16, 24, 40, 0.08)` | dialogs, the palette, drawers              |

`shadow-m` has no shared name; use `--folio-shadow-m` under Folio. Two more variables carry the
press: `--press` (3px in Discothèque, the distance a primary button travels into its shadow; 0 in
Folio) and `--lift` (-1px in Discothèque, how far a hovered object rises; 0 in Folio).

Levels, from the page up: the page (`--paper`), objects on it (`--paper-raised` with an outline),
things that float above it (menus, popovers, toasts), then dialogs over a backdrop. Use the next
shadow up only when the object really sits above the one below.

## Focus

Every interactive element shows a focus ring when reached by keyboard:

```css
:focus-visible {
  outline: var(--focus-ring) solid var(--focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 2px var(--focus-edge);
}
```

| Variable       | Discothèque              | Folio                        |
| -------------- | ------------------------ | ---------------------------- |
| `--focus`      | mustard `#E1A730`        | accent `#1F5FC4` / `#6EA0F2` |
| `--focus-edge` | on-mustard ink `#3B2416` | transparent                  |
| `--focus-ring` | 3px                      | 2px                          |

Discothèque's ring is two bands: the mustard ring, and an ink edge filling the 2px gap between it
and the element. Mustard alone is too light on Lights-on paper (1.8:1), and no single colour reads
on both the cream paper and the chocolate sidebar, so whichever band the ground hides, the other
one shows: the ink edge on paper (12.2:1), the mustard on chocolate (4.8:1 or more) and in Lights
off (8.6:1 on paper). The edge is the ink that reads on mustard in both themes, so the two bands
stay apart too (6.7:1). Folio's ring is one colour, at least 5:1 wherever it sits, and its edge is
transparent.

The edge is a `box-shadow`, so an element with a shadow of its own lists both, edge first:
`box-shadow: 0 0 0 2px var(--focus-edge), var(--shadow-press);`.

- Never remove the outline without drawing another one.
- Show focus on the element that has it, or on its visible box when the real element is hidden
  (a checkbox's square, a switch's track).
- Don't show the ring on mouse click: use `:focus-visible`.

## Icons

The package ships no icons. Apps built on it use [Lucide](https://lucide.dev) (`lucide-react` in
React), at its default 2px stroke, in `currentColor` so icons take the text colour.

| Size    | Where                                      |
| ------- | ------------------------------------------ |
| 14px    | inside small buttons and dense rows        |
| 16px    | the default: inside buttons, menus, inputs |
| 18px    | standalone icon buttons, banners, toolbars |
| 22–24px | the top bar's menu button, larger chrome   |
| 32–40px | empty states and drop zones                |

When an icon needs a label:

- **Next to text**, the icon is decoration: `aria-hidden="true"`, no label.
- **Alone in a button**, the button needs a name: `aria-label="Remove"`, plus a tooltip with the
  same words for sighted users.
- **Carrying meaning on its own** (a status, a warning), give it a text alternative or put the
  words beside it. Colour and shape are never the only signal.
- Use the same icon for the same action everywhere, and never an icon that only makes sense once
  you know the app.

## Layout and breakpoints

There are no breakpoint or grid tokens yet. What the tokens give:

- **Gutters**: `--space-4` (16px) on phones, `--space-6` (24px) on desktop.
- **Content padding**: `--space-8` (32px) on wide screens.
- **Region gaps**: `--space-10` (40px) between major regions.
- **Reading width**: rich text at most 72 characters per line (Folio's `body-l` note).

Each app sets its own breakpoints in its CSS for now. Prefer container queries for components that
appear in more than one width (a card in a sidebar and in a page), and media queries for the page
shell. Check every layout at 320px wide: no horizontal page scroll, and targets of at least 24px.
