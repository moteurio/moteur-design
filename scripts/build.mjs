#!/usr/bin/env node
// Builds the looks' CSS and JS from their tokens. Run: pnpm build (or pnpm check, to fail when
// the committed files are out of date).
//
// - tokens/discotheque.json: Discothèque, the default look. Written to css/discotheque.css on
//   :root, so a page that loads it and nothing else is Discothèque.
// - tokens/folio.json: Folio, the quiet look. Written to css/folio.css on :root[data-look='folio'].
//
// Both looks give values to the same variable names (Discothèque's), plus the look variables below,
// so component CSS reads one set of names whatever the look (Folio › Implementation › Token mapping).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import { docTables, failures } from './contrast.mjs';
import { cssData, htmlData } from './vscode.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const disco = read('tokens/discotheque.json');
const folio = read('tokens/folio.json');
const HEADER = 'Generated from tokens/*.json by scripts/build.mjs. Do not edit.';
const check = process.argv.includes('--check');

const lower = (v) => String(v).replace(/#[0-9a-f]{3,8}\b/gi, (h) => h.toLowerCase());
const valueIn = (tok, theme, first) =>
  lower(typeof tok.value === 'string' ? tok.value : (tok.value[theme] ?? tok.value[first]));
/**
 * A spring (stiffness, damping, mass 1) as a CSS linear() curve and the time it takes to settle,
 * so springs need no script: transition: transform var(--spring-pop-duration) var(--spring-pop).
 */
function spring({ stiffness, damping }) {
  let x = 0;
  let v = 0;
  let t = 0;
  const dt = 1 / 240;
  const pts = [0];
  while (t < 2.5) {
    for (let i = 0; i < 4; i++) {
      v += (-stiffness * (x - 1) - damping * v) * dt;
      x += v * dt;
      t += dt;
    }
    pts.push(x);
    if (Math.abs(x - 1) < 0.002 && Math.abs(v) < 0.02) break;
  }
  pts[pts.length - 1] = 1;
  const step = Math.max(1, Math.floor(pts.length / 40));
  const kept = pts.filter((_, i) => i % step === 0 || i === pts.length - 1);
  return {
    ms: Math.round(t * 1000),
    easing: `linear(${kept.map((p) => +p.toFixed(3)).join(', ')})`,
  };
}
/** Motion tokens as CSS variables: --spring-<name> and --spring-<name>-duration, --ease-<name>, --duration-<name>. */
const motionVars = (look) =>
  look.motion.tokens.flatMap((tok) => {
    if (tok.spring) {
      const s = spring(tok.spring);
      return [
        [`spring-${tok.name}`, s.easing],
        [`spring-${tok.name}-duration`, `${s.ms}ms`],
      ];
    }
    return [
      [`ease-${tok.name}`, tok.easing],
      [`duration-${tok.name}`, tok.duration],
    ];
  });

// A declaration is [name, value] or [name, value, usage]; the usage feeds the editor help.
const block = (decls, indent = '  ') => decls.map(([k, v]) => `${indent}--${k}: ${v};`).join('\n');

/**
 * What each look's stylesheet declares, per theme: declared[look].light holds the light block with
 * the values that don't change, .dark the dark block. The contrast check and the editor help read
 * this, so they see exactly what the CSS says.
 */
const declared = {};

/** One light/dark layout for any selector: light, dark by system unless forced light, forced dark. */
function themed(look, sel, light, dark, plain = []) {
  declared[look] = {
    light: Object.fromEntries([...light, ...plain].map(([k, v]) => [k, v])),
    dark: Object.fromEntries(dark.map(([k, v]) => [k, v])),
  };
  return `${sel.light} {
${block(light)}
${block(plain)}
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  ${sel.systemDark} {
${block(dark, '    ')}
    color-scheme: dark;
  }
}
${sel.dark} {
${block(dark)}
  color-scheme: dark;
}
`;
}

const files = {};

// ── Look variables: what differs between looks beyond colour. Discothèque's values. ─────────────
// The third item is the usage note the editor help shows; token-backed variables take theirs from
// the token JSON instead.
const discoLook = [
  ['outline', 'var(--ink)', 'The edge of objects: cards, tables, panels.'],
  ['outline-control', 'var(--ink)', 'The edge of controls: buttons, switches, checkboxes.'],
  // Typing surfaces: a lighter edge than objects, ink on hover and focus.
  ['outline-field', 'var(--ink-line)', 'The edge of a text input at rest.'],
  ['outline-field-active', 'var(--ink)', 'The edge of a text input, hovered or focused.'],
  ['border-field', '1.5px', "Width of a text input's edge."],
  [
    'divider',
    'var(--border-object) dotted var(--rule)',
    'A whole border value for the line between rows.',
  ],
  ['focus-ring', '3px', 'Width of the focus ring, drawn 2px outside the element.'],
  // Mustard is too light on Lights-on paper to be the only mark (1.8:1), and no one colour reads
  // on both the cream paper and the chocolate sidebar, so Discothèque's ring is two bands: mustard,
  // with an ink edge filling the 2px gap inside it. On-mustard is the ink that reads on mustard in
  // both themes. Folio's ring needs no edge.
  [
    'focus-edge',
    'var(--on-mustard)',
    "The focus ring's inner edge, drawn under the outline with `box-shadow: 0 0 0 2px var(--focus-edge)`. Transparent in Folio.",
  ],
  ['press', '3px', 'How far a primary button travels into its shadow when pressed.'],
  ['lift', '-1px', 'How far a hovered object rises.'],
  ['radius-button', 'var(--radius-pill)', 'Corner of buttons.'],
  ['radius-badge', 'var(--radius-pill)', 'Corner of badges and pills.'],
  ['label-size', '12px', 'Size of eyebrows and section labels.'],
  ['label-weight', '700', 'Weight of eyebrows and section labels.'],
  ['label-tracking', '0.12em', 'Letter spacing of eyebrows and section labels.'],
  ['label-case', 'uppercase', 'text-transform of eyebrows and section labels.'],
  // Field labels read as sentences; capitals stay for eyebrows and section headers.
  ['field-label-size', '13px', 'Size of field labels.'],
  ['field-label-tracking', '0', 'Letter spacing of field labels.'],
  ['field-label-case', 'none', 'text-transform of field labels.'],
  ['label-color', 'var(--ink-muted)', 'Colour of labels.'],
  ['ui-size', '16px', 'Default size of UI text.'],
  ['link', 'var(--rust)', 'Links in text.'],
  ['inverse', 'var(--chocolate)', 'The one dark-on-light object: toasts, tooltips.'],
  ['on-inverse', 'var(--on-chocolate)', 'Text on --inverse.'],
  ['on-inverse-accent', 'var(--mustard)', 'The action word in a toast (Undo, View).'],
  ['on-chocolate-accent', 'var(--mustard)', 'An accent on the top bar and sidebar.'],
  ['selected-soft', 'var(--mustard-soft)', 'A soft selection fill.'],
];

// ── Discothèque: css/discotheque.css ────────────────────────────────────────────────────────────
{
  const [light, dark] = disco.color.themes.map((x) => x.id);
  const colors = [...disco.color.tokens, ...(disco.shadow?.tokens ?? [])];
  const vars = (theme) => colors.map((tok) => [tok.name, valueIn(tok, theme, light)]);
  const plain = [
    ...['spacing', 'radius', 'border', 'duration', 'easing']
      .flatMap((k) => disco[k]?.tokens ?? [])
      .map((tok) => [tok.name, tok.value]),
    ...Object.entries(disco.type.families).map(([k, v]) => [`font-${k}`, v]),
    ...motionVars(disco),
    ...discoLook,
  ];
  files['css/discotheque.css'] = `/* Discothèque. ${HEADER} */
${themed(
  'discotheque',
  {
    light: ':root',
    systemDark: `:root:not([data-theme='${light}'])`,
    dark: `:root[data-theme='${dark}']`,
  },
  vars(light),
  vars(dark),
  plain,
)}`;
}

// ── Folio: css/folio.css ────────────────────────────────────────────────────────────────────────
{
  const [light, dark] = folio.color.themes.map((x) => x.id);
  const color = Object.fromEntries(folio.color.tokens.map((t) => [t.name, t]));
  const shadow = Object.fromEntries(folio.shadow.tokens.map((t) => [t.name, t]));
  const c = (name, theme) => valueIn(color[name], theme, light);
  const s = (name, theme) => valueIn(shadow[name], theme, light);

  // Discothèque variable → Folio colour token (Folio › Implementation › Token mapping).
  const colorMap = {
    paper: 'canvas',
    'paper-raised': 'surface',
    'paper-sunk': 'surface-sunk',
    'paper-tint': 'surface-hover',
    field: 'field',
    ink: 'text',
    'ink-muted': 'text-muted',
    'ink-subtle': 'text-subtle',
    rule: 'border',
    'ink-line': 'border-strong',
    chocolate: 'surface',
    'chocolate-soft': 'surface',
    'on-chocolate': 'text',
    'on-chocolate-muted': 'text-muted',
    mustard: 'accent-soft',
    'on-mustard': 'accent-text',
    'mustard-soft': 'warning-soft',
    orange: 'accent',
    action: 'accent',
    'on-action': 'on-accent',
    rust: 'danger',
    'rust-soft': 'danger-soft',
    avocado: 'success',
    success: 'success',
    'success-soft': 'success-soft',
    'warning-ink': 'warning',
    teal: 'info',
    'teal-soft': 'info-soft',
    plum: 'presence-6',
    focus: 'focus',
    'on-plum': 'on-presence',
    'on-avocado': 'on-success',
  };
  const missing = disco.color.tokens.map((t) => t.name).filter((n) => !(n in colorMap));
  if (missing.length)
    throw new Error(`No Folio value for Discothèque colour(s): ${missing.join(', ')}`);

  const colorsIn = (theme) => [
    ...Object.entries(colorMap).map(([discoName, folioName]) => [discoName, c(folioName, theme)]),
    ['shadow-press', s('shadow-xs', theme)],
    ['shadow-lift', s('shadow-s', theme)],
    ['shadow-dialog', s('shadow-l', theme)],
    ['shadow-drag', s('shadow-drag', theme)],
    ['shadow-highlight', `0 0 0 3px ${c('accent-soft', theme)}`],
    // Folio's own names, for the few component rules that differ by more than colour.
    ...folio.color.tokens.map((t) => [`folio-${t.name}`, c(t.name, theme)]),
    ...folio.shadow.tokens.map((t) => [`folio-${t.name}`, s(t.name, theme)]),
  ];

  const sans = `'IBM Plex Sans Variable', ${folio.type.families.sans}`;
  const plain = [
    ['radius-s', '4px'],
    ['radius-m', '6px'],
    ['radius-l', '8px'],
    ['radius-xl', '12px'],
    ['border-object', '1px'],
    ['border-strong', '1px'],
    ['stripe-band', '0px'],
    ['duration-snap', '100ms'],
    ['duration-pop', '150ms'],
    ['duration-glide', '250ms'],
    ['duration-drift', '400ms'],
    ['ease-spring', 'cubic-bezier(0.2, 0, 0, 1)'],
    ['ease-glide', 'cubic-bezier(0.2, 0, 0, 1)'],
    ['ease-drift', 'cubic-bezier(0.2, 0, 0, 1)'],
    ...motionVars(folio),
    ['font-display', sans],
    ['font-body', sans],
    ['font-mono', folio.type.families.mono],
    ['font-celebrate', sans],
    ['font-empty', sans],
    ['outline', 'var(--folio-border)'],
    ['outline-control', 'var(--folio-border-strong)'],
    ['outline-field', 'var(--ink-line)'],
    ['outline-field-active', 'var(--ink-line)'],
    ['border-field', '1px'],
    ['divider', '1px solid var(--rule)'],
    ['focus-ring', '2px'],
    ['focus-edge', 'transparent'],
    ['press', '0px'],
    ['lift', '0px'],
    ['radius-button', '6px'],
    ['radius-badge', '4px'],
    ['label-size', '13px'],
    ['label-weight', '500'],
    ['label-tracking', '0'],
    ['label-case', 'none'],
    ['field-label-size', '13px'],
    ['field-label-tracking', '0'],
    ['field-label-case', 'none'],
    ['label-color', 'var(--ink)'],
    // Dialog backdrops: Discothèque tints chocolate in each rule; Folio dims with its overlay.
    ['backdrop', 'var(--folio-overlay)'],
    // Type sizes: component CSS writes "font-size: var(--fs-page, <Discothèque size>)", so these
    // exist only in Folio and Discothèque keeps its own sizes untouched.
    ['fs-hero', '28px'],
    ['fs-poster', '48px'],
    ['fs-entry', '26px'],
    ['fs-page', '22px'],
    ['fs-num', '20px'],
    ['fs-section', '16px'],
    ['fs-field', '16px'],
    ['fs-sub', '15px'],
    ['fs-mark', '15px'],
    ['fs-item', '14px'],
    // Body sizes one notch denser and no weight above 600 (Folio › Foundations › Typography).
    ['fs-18', '16px'],
    ['fs-17', '15px'],
    ['fs-16', '14px'],
    ['fs-15', '14px'],
    ['fs-14', '13px'],
    ['fw-bold', '600'],
    ['fw-heavy', '600'],
    ['fs-dialog', '18px'],
    // Corners written as literals in component CSS, scaled to Folio's radii.
    ['r-22', '8px'],
    ['r-16', '8px'],
    ['r-12', '6px'],
    ['r-10', '6px'],
    ['r-9', '4px'],
    ['fs-empty', '16px'],
    ['fw-empty', '600'],
    ['ui-size', '14px'],
    ['link', 'var(--folio-accent-text)'],
    ['inverse', 'var(--folio-inverse)'],
    ['on-inverse', 'var(--folio-on-inverse)'],
    ['on-inverse-accent', 'var(--folio-on-inverse-accent)'],
    ['on-chocolate-accent', 'var(--folio-accent-text)'],
    ['selected-soft', 'var(--folio-accent-soft)'],
  ];

  files['css/folio.css'] = `/* Folio. ${HEADER} */
${themed(
  'folio',
  {
    light: `:root[data-look='folio']`,
    systemDark: `:root[data-look='folio']:not([data-theme='${light}'])`,
    dark: `:root[data-look='folio'][data-theme='${dark}']`,
  },
  colorsIn(light),
  colorsIn(dark),
  plain,
)}`;
}

// ── Motion and themes for scripts: js/tokens.js and js/tokens.d.ts ──────────────────────────────
{
  const ms = (v) => Number(String(v).replace('ms', ''));
  const curve = (v) => v.match(/[\d.]+/g).map(Number);
  const folioTok = (fam, name) => folio[fam].tokens.find((x) => x.name === name).value;
  const named = (look, prefix) =>
    Object.fromEntries(look.tokens.map((x) => [x.name.replace(prefix, ''), x]));
  const values = {
    duration: Object.fromEntries(
      Object.entries(named(disco.duration, 'duration-')).map(([k, x]) => [k, ms(x.value)]),
    ),
    easing: Object.fromEntries(
      Object.entries(named(disco.easing, 'ease-')).map(([k, x]) => [k, curve(x.value)]),
    ),
    themes: disco.color.themes,
    motion: Object.fromEntries(
      [disco, folio].map((look, i) => [
        ['discotheque', 'folio'][i],
        Object.fromEntries(
          look.motion.tokens.map((tok) => [
            tok.name,
            tok.spring
              ? {
                  ...tok.spring,
                  duration: spring(tok.spring).ms,
                  easing: spring(tok.spring).easing,
                }
              : { duration: ms(tok.duration), easing: tok.easing },
          ]),
        ),
      ]),
    ),
    folioMotion: {
      duration: Object.fromEntries(
        Object.entries(named(folio.duration, 'duration-')).map(([k, x]) => [k, ms(x.value)]),
      ),
      standard: curve(folioTok('easing', 'ease-standard')),
      exit: curve(folioTok('easing', 'ease-exit')),
    },
    looks: [
      { id: 'discotheque', name: disco.name, themes: disco.color.themes },
      { id: 'folio', name: folio.name, themes: folio.color.themes },
    ],
  };
  const js = (name, v, doc) =>
    `${doc ? `/** ${doc} */\n` : ''}export const ${name} = ${JSON.stringify(v, null, 2)};\n`;
  files['js/tokens.js'] = `// ${HEADER}
${js('duration', values.duration, 'Discothèque durations, in ms.')}
${js('easing', values.easing, 'Discothèque cubic-bezier curves.')}
${js('themes', values.themes, "Discothèque's themes.")}
${js('motion', values.motion, 'Springs and the pen, per look: duration in ms and a CSS easing (springs as linear()).')}
${js('folioMotion', values.folioMotion, "Folio's motion: tweens only, no overshoot.")}
${js('looks', values.looks, 'Every look, with its themes. The first is the default.')}`;
  files['js/tokens.d.ts'] = `// ${HEADER}
${Object.entries(values)
  .map(([k, v]) => `export declare const ${k}: ${JSON.stringify(v)};`)
  .join('\n')}
export type LookId = (typeof looks)[number]['id'];
`;
}

files['css/looks.css'] =
  `/* Every look: Discothèque on :root, Folio under data-look='folio'. ${HEADER} */
@import './discotheque.css';
@import './folio.css';
`;

// ── Contrast: tokens/contrast.json, measured on what the stylesheets above declare ─────────────
const contrast = read('tokens/contrast.json');
const contrastFailures = failures(declared, contrast.pairs);
{
  // The tables in docs/foundations.md are written from the same list, between markers, so the
  // docs can't drift from what pnpm check enforces.
  const file = 'docs/foundations.md';
  const doc = fs.readFileSync(path.join(root, file), 'utf8');
  const { safe, avoid } = docTables(declared, contrast);
  const between = (text, name, body) => {
    const start = `<!-- ${name}: written by pnpm build from tokens/contrast.json -->`;
    const end = `<!-- /${name} -->`;
    const a = text.indexOf(start);
    const b = text.indexOf(end);
    if (a < 0 || b < a) throw new Error(`${file} needs the markers ${start} and ${end}`);
    return `${text.slice(0, a + start.length)}\n\n${body}\n\n${text.slice(b)}`;
  };
  files[file] = between(between(doc, 'contrast-pairs', safe), 'contrast-avoid', avoid);
}

// ── Editor help: vscode/*.json ──────────────────────────────────────────────────────────────────
{
  // Every variable's usage note. Token-backed ones come from the token JSON, look variables from
  // the lists above; the few groups Folio adds for its denser sizes get a note per group.
  const usage = {};
  const note = (name, text) => {
    if (text && !(name in usage)) usage[name] = text;
  };
  for (const k of ['color', 'shadow', 'spacing', 'radius', 'border', 'duration', 'easing'])
    for (const tok of disco[k]?.tokens ?? []) note(tok.name, tok.usage);
  for (const [name, , text] of discoLook) note(name, text);
  const families = {
    display: 'Display type: page and entry titles, headings.',
    body: 'Body and UI text.',
    mono: 'Code, ids, keys and keyboard hints.',
    celebrate: 'Celebrations only; at most once per session.',
    empty: 'Empty states.',
    typewriter: 'Memo-style cards.',
  };
  for (const k of Object.keys(disco.type.families)) note(`font-${k}`, families[k]);
  for (const look of [disco, folio])
    for (const tok of look.motion.tokens) {
      if (tok.spring) {
        note(
          `spring-${tok.name}`,
          `${tok.usage} A spring as a CSS \`linear()\` curve; pair it with \`--spring-${tok.name}-duration\`.`,
        );
        note(`spring-${tok.name}-duration`, `How long the ${tok.name} spring takes to settle.`);
      } else {
        note(`ease-${tok.name}`, tok.usage);
        note(`duration-${tok.name}`, tok.usage);
      }
    }
  for (const tok of [...folio.color.tokens, ...folio.shadow.tokens])
    note(`folio-${tok.name}`, `Folio only. ${tok.usage}`);
  note(
    'backdrop',
    'The dimmed backdrop behind dialogs. Folio only; Discothèque tints each backdrop in its own rule.',
  );
  for (const name of Object.keys(declared.folio.light)) {
    if (/^fs-/.test(name))
      note(
        name,
        `Folio only: the size Folio uses where component CSS writes \`font-size: var(--${name}, …)\` with Discothèque's size as the fallback.`,
      );
    if (/^fw-/.test(name))
      note(
        name,
        `Folio only: the weight Folio uses where component CSS writes \`font-weight: var(--${name}, …)\` with Discothèque's weight as the fallback.`,
      );
    if (/^r-/.test(name))
      note(
        name,
        `Folio only: Folio's corner where component CSS writes \`border-radius: var(--${name}, ${name.slice(2)}px)\`.`,
      );
  }
  const momentsCss = fs.readFileSync(path.join(root, 'css/moments.css'), 'utf8');
  const motionMd = fs.readFileSync(path.join(root, 'docs/motion.md'), 'utf8');
  const looks = [
    { id: 'discotheque', name: disco.name, themes: disco.color.themes },
    { id: 'folio', name: folio.name, themes: folio.color.themes },
  ];
  files['vscode/css-custom-data.json'] = JSON.stringify(cssData({ declared, usage, momentsCss }));
  files['vscode/html-custom-data.json'] = JSON.stringify(htmlData({ momentsCss, motionMd, looks }));
}

const prettierConfig = await prettier.resolveConfig(path.join(root, 'package.json'));
const stale = [];
for (const [file, raw] of Object.entries(files)) {
  const text = await prettier.format(raw, { ...prettierConfig, filepath: file });
  const target = path.join(root, file);
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (current === text) continue;
  if (check) stale.push(file);
  else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
}
if (check && stale.length) console.error(`Out of date: ${stale.join(', ')}. Run pnpm build.`);
else console.log(check ? 'Up to date.' : `Written: ${Object.keys(files).join(', ')}`);
// The files are written even when a pair fails, so the docs show the failing ratios too.
if (contrastFailures) {
  console.error(
    `\nThese colour pairs are below their minimum contrast (tokens/contrast.json):\n\n${contrastFailures}\n`,
  );
  process.exitCode = 1;
} else console.log(`Contrast: all ${contrast.pairs.length} pairs pass in every look and theme.`);
if (check && stale.length) process.exitCode = 1;
